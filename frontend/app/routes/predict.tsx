import { useState } from "react";
import api from "~/components/api";
import "../app.css";

const Predict = () => {
    const [fileImage, setFileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null); 
    const [topK, setTopK] = useState<number>(5);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileImage(file);
            // Revoke the old URL object to prevent memory leaks
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleTopKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1; 
        if (val > 50) val = 50; 
        setTopK(val);
    };

    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault(); 
        
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
        <div className="container bg-surface dark:bg-Dark_surface">
            <h1 className="title text-text dark:text-Dark_text">Image Search</h1>

            <form onSubmit={handleSubmit} className="input-section text-text dark:text-Dark_text">
                <input type="file" onChange={handleFileChange} accept="image/*" className="file-input"/>
                
                <input 
                    type="number" 
                    value={topK} 
                    onChange={handleTopKChange} 
                    min={1} 
                    max={50} 
                    className="number-input" 
                    placeholder="Top K"
                />
                
                <button type="submit" className="search-btn bg-primary dark:bg-Dark_primary" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {preview && (
                <div className="preview-section flex flex-col items-center text-text dark:text-Dark_text">
                    <h2>Uploaded Image:</h2>
                    <img src={preview} alt="Uploaded" className="preview-img" />
                </div>
            )}

            {results.length > 0 && (
                <div className="results-section text-text dark:text-Dark_text">
                    <h2>Results:</h2>
                    <div className="results-grid">
                        {results.map((res, idx) => (
                            <div key={idx} className="result-item">
                                <h2 className="result-label">{res.label}</h2>
                                <div className="result-cards-wrapper">
                                    {res.images.map((img: { path: string, distance: number }, imgIdx: number) => ( 
                                        <div key={imgIdx} className="result-card">
                                            <img src={img.path} alt={res.label} className="result-img" />
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

export default Predict;