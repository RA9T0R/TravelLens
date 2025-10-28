import React, { useState, useEffect } from "react";
import api from "~/components/api";

const Welcome = () => {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

 
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get("/AllImages/");
        const data = res.data;
        const allImages: string[] = [];
        data.forEach((item: any) => allImages.push(...item.images));
        allImages.sort(() => Math.random() - 0.5); // สุ่ม
        setImages(allImages);
      } catch (err) {
        console.error("Failed to load images:", err);
      }
    };
    fetchImages();
  }, []);

  
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="h-screen w-full relative flex items-center justify-center bg-bg dark:bg-Dark_bg text-text dark:text-Dark_text">
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-4xl md:text-5xl font-bold z-30 drop-shadow-md">
        Welcome To TravelLens
      </div>
      <div className="relative w-11/12 md:w-3/4 lg:w-2/3 h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-xl">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`slide-${idx}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xl font-bold hover:text-gray-300 z-20 opacity-80"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xl font-bold hover:text-gray-300 z-20 opacity-80"
        >
          &#10095;
        </button>
      </div>
      <div className="absolute bottom-10 left-1/6 text-lg md:text-xl z-30">
        Phongphat Bangkha 6604062630358<br/>
        Supakorn Sawangarom 6604062620221
      </div>

    </div>
  );
};

export default Welcome;
