// src/components/InputPanel.tsx
import React from "react";
import { useDropzone } from "react-dropzone";
import { useAppContext } from "../context/AppContext";
import type { InputMethod } from "../types";

const InputPanel: React.FC = () => {
  const {
    inputMethod, setInputMethod,
    emailText, setEmailText,
    audioFile, setAudioFile,
    pdfFile, setPdfFile,
  } = useAppContext();

  const onDrop = (files: File[]) => {
    if (files?.[0]) {
      const f = files[0];
      if (f.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
      }
      setPdfFile(f);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <>
      <div className="flex gap-2">
        {(["pdf", "email", "audio"] as InputMethod[]).map((m) => (
          <button
            key={m}
            className={`px-3 py-1.5 rounded-md border text-sm ${
              inputMethod === m ? "border-purple-600 text-purple-700" : "border-stone-300"
            }`}
            onClick={() => setInputMethod(m)}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {inputMethod === "pdf" && (
          <div
            {...getRootProps()}
            className={`h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center ${
              isDragActive ? "border-purple-500 bg-purple-50" : "border-stone-300 bg-stone-50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-stone-700">
              Drag & drop a <span className="font-medium">PDF</span> here, or click to select
            </div>
            {pdfFile && <div className="text-xs text-stone-500 mt-2">{pdfFile.name}</div>}
          </div>
        )}

        {inputMethod === "email" && (
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste the email pitch content here…"
            className="w-full min-h-[160px] rounded-lg border p-3 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        )}

        {inputMethod === "audio" && (
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />
            <div className="text-sm text-stone-500">(Prototype will simulate transcription)</div>
            {audioFile && <div className="text-xs text-stone-600">{audioFile.name}</div>}
          </div>
        )}
      </div>
    </>
  );
};

export default InputPanel;
