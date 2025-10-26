import functions_framework
import io
from google.cloud import documentai_v1 as documentai
from google.cloud import storage
from google.cloud import firestore
from pypdf import PdfReader, PdfWriter
from urllib.parse import urlparse

# --- Initialize clients ---
# We do this globally so they are reused
storage_client = storage.Client()
db = firestore.Client()

# These will be set as environment variables in the Cloud Function
DOCAI_PROJECT_ID = "pitch-lens-ai" # Your Project ID
DOCAI_LOCATION = "us" # Your DocAI processor location
DOCAI_PROCESSOR_ID = "c592e7609eabbf3" # Your DocAI processor ID

PAGE_LIMIT = 15 # The hard quota

#
# --- This is our Firestore trigger function ---
#
@functions_framework.cloud_event
def process_deal_pdf(cloud_event):
    """
    Triggered by the creation of a new document in /deals/{dealId}
    """
    deal_id = cloud_event.subject.split('/')[-1]
    data = cloud_event.data

    gcs_uri = data.get("value", {}).get("fields", {}).get("gcsPath", {}).get("stringValue")
    if not gcs_uri:
        print(f"No gcsPath found for deal {deal_id}. Aborting.")
        return

    print(f"Processing {deal_id}: {gcs_uri}")

    try:
        # --- 1. Run the Orchestrator ---
        full_text = _get_full_text_orchestrator(gcs_uri, deal_id)

        if not full_text:
            raise ValueError("Text extraction failed, returned no text.")

        # --- 2. Update Firestore ---
        doc_ref = db.collection("deals").document(deal_id)
        doc_ref.update({
            "status": "text_extracted",
            "full_text": full_text
        })
        print(f"Successfully extracted text for {deal_id}.")

    except Exception as e:
        print(f"Error processing {deal_id}: {e}")
        # Set error status in Firestore
        doc_ref = db.collection("deals").document(deal_id)
        doc_ref.update({"status": "error", "error_message": str(e)})


#
# --- This is our orchestrator logic, copied from before ---
#
def _get_full_text_orchestrator(gcs_uri: str, deal_id: str) -> str:
    """
    Orchestrator to get full text from large PDFs by splitting them.
    """
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

            # --- Create PDF chunk ---
            pdf_writer = PdfWriter()
            for page_num in range(start_page, end_page):
                pdf_writer.add_page(pdf_reader.pages[page_num])

            chunk_bytes_io = io.BytesIO()
            pdf_writer.write(chunk_bytes_io)
            chunk_bytes = chunk_bytes_io.getvalue()

            # --- Upload chunk to GCS ---
            chunk_file_name = f"deals/{deal_id}/temp_chunk_p{start_page + 1}.pdf"
            _upload_blob(bucket_name, chunk_bytes, chunk_file_name)
            temp_blob_names.append(chunk_file_name)

            chunk_gcs_uri = f"gs://{bucket_name}/{chunk_file_name}"
            print(f"Uploaded chunk {chunk_gcs_uri}")

            # --- Process chunk ---
            text_chunk = _extract_chunk_text(chunk_gcs_uri)
            all_extracted_text.append(text_chunk)

        return "\n\n".join(all_extracted_text)

    finally:
        print(f"Cleaning up {len(temp_blob_names)} temporary chunks...")
        for blob_name in temp_blob_names:
            _delete_blob(bucket_name, blob_name)


# --- These are the helper functions ---

def _extract_chunk_text(gcs_uri: str) -> str:
    """Processes a SINGLE document chunk (<= 15 pages)."""
    print(f"Starting Document AI processing for chunk: {gcs_uri}")
    client_options = {"api_endpoint": f"{DOCAI_LOCATION}-documentai.googleapis.com"}
    client = documentai.DocumentProcessorServiceClient(client_options=client_options)
    name = client.processor_path(DOCAI_PROJECT_ID, DOCAI_LOCATION, DOCAI_PROCESSOR_ID)
    gcs_document = documentai.GcsDocument(gcs_uri=gcs_uri, mime_type="application/pdf")
    request = documentai.ProcessRequest(name=name, gcs_document=gcs_document, skip_human_review=True)

    result = client.process_document(request=request)
    return result.document.text

def _parse_gcs_uri(gcs_uri: str) -> (str, str):
    parsed_uri = urlparse(gcs_uri)
    return parsed_uri.netloc, parsed_uri.path.lstrip('/')

def _download_blob(bucket_name, blob_name):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    return blob.download_as_bytes()

def _upload_blob(bucket_name, data, destination_blob_name):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_string(data, content_type="application/pdf")

def _delete_blob(bucket_name, blob_name):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.delete()


import functions_framework
from google.cloud import firestore
from vertexai.generative_models import GenerativeModel, Part

# --- Initialize clients ---
db = firestore.Client()
model = GenerativeModel("gemini-2.5-flash-001") # Use a fast model

#
# --- This is our Firestore trigger function ---
#
@functions_framework.cloud_event
def generate_analysis(cloud_event):
    """
    Triggered by an update to a document in /deals/{dealId}
    """
    deal_id = cloud_event.subject.split('/')[-1]

    # --- Check for the correct status ---
    before_data = cloud_event.data.get("value", {}).get("oldValue", {}).get("fields", {})
    after_data = cloud_event.data.get("value", {}).get("fields", {})

    before_status = before_data.get("status", {}).get("stringValue")
    after_status = after_data.get("status", {}).get("stringValue")

    # This is the most important check!
    # Only run if the status *just changed* to "text_extracted"
    if after_status != "text_extracted" or before_status == "text_extracted":
        print(f"Skipping {deal_id}: not a valid trigger (Status: {after_status})")
        return

    print(f"Starting Gemini analysis for {deal_id}...")

    full_text = after_data.get("full_text", {}).get("stringValue")
    if not full_text:
        print(f"No full_text found for {deal_id}. Aborting.")
        return

    try:
        # --- Call Gemini ---
        # (Here you would run all your prompts for Risk, Financials, etc.)
        # (For the hackathon, you can do them sequentially)

        risk_prompt = f"Analyze the following pitch deck text and provide a risk assessment: {full_text}"
        risk_response = model.generate_content(risk_prompt)

        financials_prompt = f"Extract key financial metrics from this text: {full_text}"
        financials_response = model.generate_content(financials_prompt)

        # --- Update Firestore with the final analysis ---
        doc_ref = db.collection("deals").document(deal_id)
        doc_ref.update({
            "status": "completed",
            "analysis": {
                "risk": risk_response.text,
                "financials": financials_response.text
                # ... add all other analysis parts
            }
        })
        print(f"Successfully generated analysis for {deal_id}.")

    except Exception as e:
        print(f"Error analyzing {deal_id}: {e}")
        doc_ref = db.collection("deals").document(deal_id)
        doc_ref.update({"status": "error", "error_message": f"Gemini analysis failed: {e}"})