import React, { useEffect, useState } from "react";
import "../app.css";

type ImageData = {
  [category: string]: string[];
};

export const ShowData: React.FC = () => {
  const [data, setData] = useState<ImageData>({});

  useEffect(() => {
    // สมมติ fetch จาก API หรือ database
    const fetchData = async () => {
      // ตัวอย่าง json
      const json: ImageData = {
        "Antarctica": [
          "https://.../Antarctica/1.jpg",
          "https://.../Antarctica/10.jpg",
          "https://.../Antarctica/102.jpg"
        ],
        "Paris": [
          "https://.../Paris/eiffel1.jpg",
          "https://.../Paris/eiffel2.jpg"
        ],
        "Tokyo": [
          "https://.../Tokyo/skytree.jpg"
        ]
      };
      setData(json);
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      {Object.entries(data).map(([category, images]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="images-grid">
            {images.map((img, idx) => (
              <div key={idx} className="image-card">
                <img src={img} alt={`${category}-${idx}`} className="image-item" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};