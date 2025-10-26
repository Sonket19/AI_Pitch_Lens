"""Cloud Functions + FastAPI entrypoints for the Pitch Lens backend."""
from __future__ import annotations

import io
import json
from functools import lru_cache
from typing import Tuple

import functions_framework
try:
    from fastapi import FastAPI, HTTPException
except ImportError:  # pragma: no cover - FastAPI is optional for local runs
    FastAPI = None  # type: ignore[assignment]

    class HTTPException(Exception):  # type: ignore[assignment]
        def __init__(self, status_code: int, detail: str):
            self.status_code = status_code
            self.detail = detail
            super().__init__(f"{status_code}: {detail}")
from google.cloud import documentai_v1 as documentai
from google.cloud import firestore, storage
from pydantic import BaseModel, ValidationError
from pypdf import PdfReader, PdfWriter
from urllib.parse import urlparse
from vertexai.generative_models import GenerativeModel

__all__ = ["app", "process_deal_pdf", "generate_analysis"]


def _index_payload() -> dict:
    return {
        "message": "Pitch Lens backend is running.",
        "endpoints": ["/healthz", "/queueAnalysis"],
    }


def _health_payload() -> dict:
    return {"status": "ok"}


def _json_response(status: int, payload: dict) -> Tuple[int, bytes, list[tuple[bytes, bytes]]]:
    body = json.dumps(payload).encode("utf-8")
    headers = [(b"content-type", b"application/json"), (b"content-length", str(len(body)).encode())]
    return status, body, headers


# --- Configuration ---
DOCAI_PROJECT_ID = "pitch-lens-ai"
DOCAI_LOCATION = "us"
DOCAI_PROCESSOR_ID = "c592e7609eabbf3"
PAGE_LIMIT = 15


# ---------------------------------------------------------------------------
# Lazy Google Cloud clients
# ---------------------------------------------------------------------------
@lru_cache(maxsize=1)
def _get_storage_client() -> storage.Client:
    return storage.Client()


@lru_cache(maxsize=1)
def _get_firestore_client() -> firestore.Client:
    return firestore.Client()


@lru_cache(maxsize=1)
def _get_model() -> GenerativeModel:
    return GenerativeModel("gemini-2.5-flash-001")



# ---------------------------------------------------------------------------
# Firestore-triggered functions
# ---------------------------------------------------------------------------
@functions_framework.cloud_event
def process_deal_pdf(cloud_event):
    """Triggered when a deal document is created."""
    deal_id = cloud_event.subject.split("/")[-1]
    data = cloud_event.data

    gcs_uri = (
        data.get("value", {})
        .get("fields", {})
        .get("gcsPath", {})
        .get("stringValue")
    )
    if not gcs_uri:
        print(f"No gcsPath found for deal {deal_id}. Aborting.")
        return

    print(f"Processing {deal_id}: {gcs_uri}")

    try:
        full_text = _get_full_text_orchestrator(gcs_uri, deal_id)
        if not full_text:
            raise ValueError("Text extraction failed, returned no text.")

        doc_ref = _get_firestore_client().collection("deals").document(deal_id)
        doc_ref.update({"status": "text_extracted", "full_text": full_text})
        print(f"Successfully extracted text for {deal_id}.")
    except Exception as exc:  # pylint: disable=broad-except
        print(f"Error processing {deal_id}: {exc}")
        doc_ref = _get_firestore_client().collection("deals").document(deal_id)
        doc_ref.update({"status": "error", "error_message": str(exc)})


@functions_framework.cloud_event
def generate_analysis(cloud_event):
    """Triggered when a deal document is updated to text_extracted."""
    deal_id = cloud_event.subject.split("/")[-1]
    after_data = (
        cloud_event.data.get("value", {}).get("fields", {})
    )
    before_data = (
        cloud_event.data.get("oldValue", {}).get("fields", {})
    )

    after_status = after_data.get("status", {}).get("stringValue")
    before_status = before_data.get("status", {}).get("stringValue")

    if after_status != "text_extracted" or before_status == "text_extracted":
        print(f"Skipping {deal_id}: not a valid trigger (status: {after_status})")
        return

    print(f"Starting Gemini analysis for {deal_id}...")
    full_text = after_data.get("full_text", {}).get("stringValue")
    if not full_text:
        print(f"No full_text found for {deal_id}. Aborting.")
        return

    try:
        model = _get_model()
        risk_prompt = (
            "Analyze the following pitch deck text and provide a risk assessment: "
            f"{full_text}"
        )
        risk_response = model.generate_content(risk_prompt)

        financials_prompt = (
            "Extract key financial metrics from this text: "
            f"{full_text}"
        )
        financials_response = model.generate_content(financials_prompt)

        doc_ref = _get_firestore_client().collection("deals").document(deal_id)
        doc_ref.update(
            {
                "status": "completed",
                "analysis": {
                    "risk": risk_response.text,
                    "financials": financials_response.text,
                },
            }
        )
        print(f"Successfully generated analysis for {deal_id}.")
    except Exception as exc:  # pylint: disable=broad-except
        print(f"Error analyzing {deal_id}: {exc}")
        doc_ref = _get_firestore_client().collection("deals").document(deal_id)
        doc_ref.update(
            {
                "status": "error",
                "error_message": f"Gemini analysis failed: {exc}",
            }
        )


# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------
def _get_full_text_orchestrator(gcs_uri: str, deal_id: str) -> str:
    print(f"Starting large PDF text extraction for {gcs_uri}")
    bucket_name, blob_name = _parse_gcs_uri(gcs_uri)

    file_bytes = _download_blob(bucket_name, blob_name)
    pdf_reader = PdfReader(io.BytesIO(file_bytes))
    total_pages = len(pdf_reader.pages)
    print(f"Document has {total_pages} pages. Splitting...")

    if total_pages <= PAGE_LIMIT:
        print("Document is under page limit. Processing directly.")
        return _extract_chunk_text(gcs_uri)

    all_extracted_text = []
    temp_blob_names = []
    try:
        for start_page in range(0, total_pages, PAGE_LIMIT):
            end_page = min(start_page + PAGE_LIMIT, total_pages)

            pdf_writer = PdfWriter()
            for page_num in range(start_page, end_page):
                pdf_writer.add_page(pdf_reader.pages[page_num])

            chunk_bytes_io = io.BytesIO()
            pdf_writer.write(chunk_bytes_io)
            chunk_bytes = chunk_bytes_io.getvalue()

            chunk_file_name = f"deals/{deal_id}/temp_chunk_p{start_page + 1}.pdf"
            _upload_blob(bucket_name, chunk_bytes, chunk_file_name)
            temp_blob_names.append(chunk_file_name)

            chunk_gcs_uri = f"gs://{bucket_name}/{chunk_file_name}"
            print(f"Uploaded chunk {chunk_gcs_uri}")

            text_chunk = _extract_chunk_text(chunk_gcs_uri)
            all_extracted_text.append(text_chunk)

        return "\n\n".join(all_extracted_text)
    finally:
        print(f"Cleaning up {len(temp_blob_names)} temporary chunks...")
        for temp_blob in temp_blob_names:
            _delete_blob(bucket_name, temp_blob)


def _extract_chunk_text(gcs_uri: str) -> str:
    print(f"Starting Document AI processing for chunk: {gcs_uri}")
    client_options = {"api_endpoint": f"{DOCAI_LOCATION}-documentai.googleapis.com"}
    client = documentai.DocumentProcessorServiceClient(client_options=client_options)
    name = client.processor_path(DOCAI_PROJECT_ID, DOCAI_LOCATION, DOCAI_PROCESSOR_ID)
    gcs_document = documentai.GcsDocument(
        gcs_uri=gcs_uri, mime_type="application/pdf"
    )
    request = documentai.ProcessRequest(
        name=name, gcs_document=gcs_document, skip_human_review=True
    )

    result = client.process_document(request=request)
    return result.document.text


def _parse_gcs_uri(gcs_uri: str) -> Tuple[str, str]:
    parsed_uri = urlparse(gcs_uri)
    return parsed_uri.netloc, parsed_uri.path.lstrip("/")


def _download_blob(bucket_name: str, blob_name: str) -> bytes:
    bucket = _get_storage_client().bucket(bucket_name)
    blob = bucket.blob(blob_name)
    return blob.download_as_bytes()


def _upload_blob(bucket_name: str, data: bytes, destination_blob_name: str) -> None:
    bucket = _get_storage_client().bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_string(data, content_type="application/pdf")


def _delete_blob(bucket_name: str, blob_name: str) -> None:
    bucket = _get_storage_client().bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.delete()


# ---------------------------------------------------------------------------
# FastAPI app for local development (uvicorn main:app)
# ---------------------------------------------------------------------------
class QueueRequest(BaseModel):
    dealId: str


def _queue_analysis_handler(payload: QueueRequest) -> dict:
    doc_ref = _get_firestore_client().collection("deals").document(payload.dealId)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Deal not found")

    doc_ref.update({"status": "queued"})
    return {"dealId": payload.dealId, "status": "queued"}


if FastAPI is not None:
    app = FastAPI(title="Pitch Lens Backend")

    @app.get("/")
    def index() -> dict:
        """Provide a friendly landing response for local testing."""
        return _index_payload()

    @app.get("/healthz")
    def health_check() -> dict:
        return _health_payload()


    @app.post("/queueAnalysis")
    def queue_analysis(payload: QueueRequest) -> dict:
        """Minimal local shim for the HTTPS function."""
        try:
            return _queue_analysis_handler(payload)
        except HTTPException:
            raise
        except Exception as exc:  # pylint: disable=broad-except
            raise HTTPException(status_code=500, detail=str(exc)) from exc
else:

    class _FallbackASGIApp:
        """Minimal ASGI app so uvicorn works even when FastAPI isn't installed."""

        async def __call__(self, scope, receive, send):  # pragma: no cover - exercised manually
            if scope["type"] != "http":
                status, body, headers = _json_response(500, {"detail": "Unsupported scope"})
                await send({"type": "http.response.start", "status": status, "headers": headers})
                await send({"type": "http.response.body", "body": body})
                return

            path = scope.get("path", "")
            method = scope.get("method", "GET").upper()

            if path == "/" and method == "GET":
                status, body, headers = _json_response(200, _index_payload())
                await send({"type": "http.response.start", "status": status, "headers": headers})
                await send({"type": "http.response.body", "body": body})
                return

            if path == "/healthz" and method == "GET":
                status, body, headers = _json_response(200, _health_payload())
                await send({"type": "http.response.start", "status": status, "headers": headers})
                await send({"type": "http.response.body", "body": body})
                return

            if path == "/queueAnalysis" and method == "POST":
                raw_body = b""
                more_body = True
                while more_body:
                    message = await receive()
                    raw_body += message.get("body", b"")
                    more_body = message.get("more_body", False)

                try:
                    payload = QueueRequest.parse_raw(raw_body or b"{}")
                    result = _queue_analysis_handler(payload)
                    status, body, headers = _json_response(200, result)
                except (ValueError, ValidationError) as exc:
                    status, body, headers = _json_response(400, {"detail": str(exc)})
                except HTTPException as exc:  # type: ignore[arg-type]
                    status, body, headers = _json_response(exc.status_code, {"detail": exc.detail})
                except Exception as exc:  # pylint: disable=broad-except
                    status, body, headers = _json_response(500, {"detail": str(exc)})

                await send({"type": "http.response.start", "status": status, "headers": headers})
                await send({"type": "http.response.body", "body": body})
                return

            status, body, headers = _json_response(404, {"detail": "Not Found"})
            await send({"type": "http.response.start", "status": status, "headers": headers})
            await send({"type": "http.response.body", "body": body})


    app = _FallbackASGIApp()

