import React, { useEffect, useState } from "react";
import api from "~/components/api";
import "../app.css";

type ImageDataItem = {
    label: string;
    images: string[];
};

const show_data = () => {
    const [data, setData] = useState<ImageDataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openLabels, setOpenLabels] = useState<{ [key: string]: boolean }>({});
    const [inputMaxImages, setInputMaxImages] = useState<number>(10);
    const [maxImages, setMaxImages] = useState<number>(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/AllImages/");
                const json: ImageDataItem[] = response.data; 
                setData(json);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val > 0) setInputMaxImages(val);
    };

    const handleConfirm = () => {
        setMaxImages(inputMaxImages);
    };

    if (loading) return <p className="text-center">Loading images...</p>;

    return (
        <div className="container bg-surface dark:bg-Dark_surface text-text dark:text-Dark_text">
            <h1 className="text-3xl lg:text-5xl mb-8 lg:mb-10">Dataset All Images</h1>
            <div className="max-images-control">
                <label htmlFor="maxImagesInput"><h3>Max images :</h3></label>
                <input id="maxImagesInput" type="number" value={inputMaxImages} onChange={handleInputChange} min={1} className="max-images-input"/>
                <button onClick={handleConfirm} className="max-images-btn bg-primary dark:bg-Dark_primary">
                    Confirm
                </button>
            </div>

            {data.map(({ label, images }) => (
                <div key={label} className="category-section">
                    <h2
                        className="category-title cursor-pointer select-none"
                        onClick={() => toggleLabel(label)}
                    >
                        {label} {openLabels[label] ? "▴" : "▾"}
                    </h2>
                    {openLabels[label] && (
                        <div className="images-grid">
                            {images.slice(0, maxImages).map((img, idx) => (
                                <div key={idx} className="image-card">
                                    <img src={img} alt={`${label}-${idx}`} className="image-item" />
                                </div>
                            ))}
                        </div>
                    )}
                    <hr className="line_category" />
                </div>
            ))}
        </div>
    );
};

export default show_data;
