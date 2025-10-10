import React, { useState, useEffect } from "react";

const UploadData = () => {
  const [labels, setLabels] = useState<{ label: string; count: number }[]>([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // โหลด labels จาก backend
  useEffect(() => {
    fetch("http://localhost:8000/LabelsSummary/") // ← URL ของ FastAPI
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) setLabels(data.summary);
      })
      .catch((err) => console.error("Failed to fetch labels:", err));
  }, []);

  // ฟังก์ชันอัปโหลดรูป
  const handleUpload = async () => {
    if (!selectedLabel) {
      setMessage("⚠️ กรุณาเลือก Label ก่อน");
      return;
    }
    if (!files || files.length === 0) {
      setMessage("⚠️ กรุณาเลือกรูปภาพอย่างน้อย 1 รูป");
      return;
    }
    if (files.length > 50) {
      setMessage("⚠️ สามารถอัปโหลดได้สูงสุด 50 รูปต่อครั้งเท่านั้น");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("label", selectedLabel);
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setMessage(`✅ อัปโหลดสำเร็จ (${data.uploaded_count} รูป)`);
    } catch (err) {
      console.error(err);
      setMessage("❌ อัปโหลดล้มเหลว กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        📸 Upload Training Images
      </h2>

      {/* Dropdown เลือก label */}
      <label className="block mb-2 font-semibold">เลือก Label:</label>
      <select
        value={selectedLabel}
        onChange={(e) => setSelectedLabel(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">-- เลือกสถานที่ --</option>
        {labels.map((item) => (
          <option key={item.label} value={item.label}>
            {item.label} ({item.count})
          </option>
        ))}
      </select>

      {/* เลือกรูปภาพ */}
      <label className="block mb-2 font-semibold">
        เลือกรูปภาพ (สูงสุด 50 รูป):
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles(e.target.files)}
        className="mb-4"
      />

      {/* ปุ่มอัปโหลด */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full py-2 rounded text-white font-semibold ${
          uploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
      </button>

      {/* ข้อความผลลัพธ์ */}
      {message && (
        <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
};

export default UploadData;
