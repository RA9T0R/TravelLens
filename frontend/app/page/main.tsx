import { useState } from "react";
import api from "~/components/api";

export function Main() {
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); 
  const [topK, setTopK] = useState<number>(5);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleTopKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopK(parseInt(e.target.value, 10));
  };

  const handleSubmit = async () => {
    if (!fileImage) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", fileImage);
      formData.append("top_k", topK.toString());

      const response = await api.post("/predict/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data.results);
    } catch (err) {
      console.error("API error:", err);
      alert("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Image Search</h1>

      <input type="file" onChange={handleFileChange} accept="image/*" className="mb-2" />
      <input
        type="number"
        value={topK}
        onChange={handleTopKChange}
        min={1}
        className="border p-1 mb-2"
        placeholder="Top K"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>


      {preview && (
        <div className="mb-4">
          <h2 className="font-semibold">Uploaded Image:</h2>
          <img src={preview} alt="Uploaded" className="w-48 h-auto" />
        </div>
      )}

      <div>
        {results.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Results:</h2>
            <ul>
              {results.map((res, idx) => (
                <li key={idx} className="mb-2">
                  <p>{res.label}</p>
                  <img src={res.image_path} alt={res.label} className="w-48 h-auto" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
