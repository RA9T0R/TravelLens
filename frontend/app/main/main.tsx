import { useState } from "react";

export function Main() {
  const [image, setImage] = useState<string | null>(null); // preview
  const [results, setResults] = useState<{ label: string; image_path: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File, top_k: number) {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);        // ส่งไฟล์
    formData.append("top_k", top_k.toString()); // ส่ง top_k เป็น string

    try {
      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      setResults(data.results); // results จาก backend
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch results from backend");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
      handleUpload(file, 5); // ส่ง top_k = 5
    }
  }

  return (
    <div>
      <div className="select_img">
        <form>
          <label>Choose Image</label><br/>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </form>

        {image && <p>Preview:</p>}
        {image && <img src={image} alt="Preview" width="200" />}
      </div>

      <div className="show_results">
        {loading && <p>Loading results...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && results.length > 0 && (
          results.map((r, idx) => (
            <div key={idx} style={{ marginBottom: "20px" }}>
              <p>{r.label}</p>
              <img src={r.image_path} alt={r.label} width="200" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
