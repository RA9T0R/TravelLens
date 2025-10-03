import { useState } from "react";
import api from "~/components/api";
import "../app.css"; // import ไฟล์ CSS

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
    <div className="container">
      <h1 className="title">Image Search</h1>

      <div className="input-section">
        <input type="file" onChange={handleFileChange} accept="image/*" className="file-input"/>
        <input type="number" value={topK} onChange={handleTopKChange} min={1} className="number-input" placeholder="Top K"/>
        <button onClick={handleSubmit} className="search-btn" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {preview && (
        <div className="preview-section">
          <h2>Uploaded Image:</h2>
          <img src={preview} alt="Uploaded" className="preview-img" />
        </div>
      )}

      {results.length > 0 && (
        <div className="results-section">
          <h2>Results:</h2>
          <div className="results-grid">
            {results.map((res, idx) => (
              <div key={idx} className="result-item">
                <h2 className="result-label">{res.label}</h2>
                <div className="result-cards-wrapper">
                  {res.images.map((img: string, imgIdx: number) => (
                    <div key={imgIdx} className="result-card">
                      <img src={img} alt={res.label} className="result-img" />
                    </div> 
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
