import React, { useState, useEffect } from "react";
import api from "~/components/api";

const UploadData = () => {
  const [labels, setLabels] = useState<{ label: string; count: number }[]>([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"new" | "existing" | "">("");


  const loadLabels = async () => {
    try {
      const response = await api.get("/LabelsSummary/");
      if (response.data.summary) {
        setLabels(response.data.summary);
      }
    } catch (err) {
      console.error("❌ Failed to fetch labels:", err);
    }
  };

  useEffect(() => {
    loadLabels();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => {
        const existingNames = prev.map((f) => f.name);
        return [...prev, ...newFiles.filter((f) => !existingNames.includes(f.name))];
      });
      e.target.value = "";
    }
  };

  const handleRemoveFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (!mode) {
      setMessage("⚠️ Please choose whether to add a new label or select existing");
      return;
    }

    const labelToUse = mode === "new" ? newLabel.trim() : selectedLabel;
    if (!labelToUse) {
      setMessage("⚠️ Label cannot be empty");
      return;
    }

    if (files.length === 0) {
      setMessage("⚠️ Please select at least 1 image");
      return;
    }

    if (files.length > 50) {
      setMessage("⚠️ Maximum 50 images per upload");
      return;
    }

    setUploading(true);
    setMessage("");
    setProgress(0);

    const formData = new FormData();
    formData.append("label", labelToUse);
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await api.post("/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      });

      if (response.status === 200) {
        const res = response.data;
        setMessage(`✅ Upload successful (${res.uploaded_count} images)`);
        setFiles([]);
        setNewLabel("");
        setSelectedLabel("");
        setMode("");
        setProgress(100);
        loadLabels();
      } else {
        setMessage("❌ Upload failed. Please try again");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Connection or server error. Please try again");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container max-w-lg mx-auto rounded-2xl shadow p-6 mt-8 bg-surface dark:bg-Dark_surface text-text dark:text-Dark_text">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Training Images</h2>

      <div className="label-options mb-4">
        <label>
          <input
            type="radio"
            name="mode"
            value="new"
            checked={mode === "new"}
            onChange={() => setMode("new")}
          /> Add New Label
        </label>
        <label className="ml-4">
          <input
            type="radio"
            name="mode"
            value="existing"
            checked={mode === "existing"}
            onChange={() => setMode("existing")}
          /> Select Existing Label
        </label>
      </div>

      {mode === "new" && (
        <input
          type="text"
          placeholder="Enter new label..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
      )}

      {mode === "existing" && (
        <select
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value)}
          className="border p-2 rounded w-full mb-4 text-black"
        >
          <option value="">-- Select label --</option>
          {labels.map((item) => (
            <option key={item.label} value={item.label}>
              {item.label} ({item.count})
            </option>
          ))}
        </select>
      )}

      <label className="block mb-2 font-semibold">Select Images (max 50):</label>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mb-4" />

      {files.length > 0 && (
        <ul className="mb-4">
          {files.map((file, idx) => (
            <li key={idx} className="flex justify-between items-center mb-1">
              {file.name} ({Math.round(file.size / 1024)} KB)
              <button onClick={() => handleRemoveFile(idx)} className="text-red-600 font-bold ml-2">
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full py-2 rounded text-white font-semibold ${
          uploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>}
    </div>
  );
};

export default UploadData;
