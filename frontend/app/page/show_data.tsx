import React, { useEffect, useState } from "react";
import "../app.css";

type ImageDataItem = {
  label: string;
  images: string[];
};

export const ShowData: React.FC = () => {
  const [data, setData] = useState<ImageDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openLabels, setOpenLabels] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/AllImages/");
        if (!res.ok) throw new Error("Failed to fetch images");
        const json: ImageDataItem[] = await res.json();
        setData(json);

        // กำหนดค่า default ทุก label เป็นปิด
        const initialOpen: { [key: string]: boolean } = {};
        json.forEach(item => {
          initialOpen[item.label] = false;
        });
        setOpenLabels(initialOpen);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleLabel = (label: string) => {
    setOpenLabels(prev => ({ ...prev, [label]: !prev[label] }));
  };

  if (loading) return <p>Loading images...</p>;

  return (
    <div className="container">
      {data.map(({ label, images }) => (
        <div key={label} className="category-section">
          <h2 
            className="category-title" 
            onClick={() => toggleLabel(label)}
            style={{ cursor: "pointer" }}
          >
            {label} {openLabels[label] ? "▲" : "▼"}
          </h2>
          {openLabels[label] && (
            <div className="images-grid">
              {images.map((img, idx) => (
                <div key={idx} className="image-card">
                  <img src={img} alt={`${label}-${idx}`} className="image-item" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
