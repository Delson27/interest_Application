import { useRef, useState } from "react";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

export default function UploadBox({ onFilesChange }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const validateFiles = (list) => {
    for (const f of list) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        return "Only PNG, JPG, or PDF files are allowed.";
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        return `Each file must be ≤ ${MAX_SIZE_MB}MB.`;
      }
    }
    return "";
  };

  const onFiles = (fileList) => {
    const arr = Array.from(fileList);
    const err = validateFiles(arr);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    const newFiles = [...files, ...arr];
    setFiles(newFiles);
    // Notify parent component
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
  };

  const removeFile = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    // Notify parent component
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary bg-white"
        onClick={() => inputRef.current?.click()}
      >
        <p className="text-textLight">
          Drag & drop files here, or click to upload
        </p>
        <p className="text-xs text-textLight mt-1">
          PNG, JPG, PDF • up to {MAX_SIZE_MB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-cardBlue p-3 rounded-card"
            >
              <div className="truncate">
                <p className="text-sm font-medium truncate">{f.name}</p>
                <p className="text-xs text-textLight">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-red-600 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
