"use client";
import Header from "@/components/header";
import { useAuth } from "@/http/isAuth";
import { useEffect, useState } from "react";

const images = [
  "/cat.png",
  "https://pp.userapi.com/c638819/v638819666/1dd15/oUOltkWNh70.jpg",
  "https://cdn1.ozone.ru/s3/multimedia-1/6526695769.jpg",
];

export default function NotFound() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAuth } = useAuth();
  useEffect(() => {
    // Меняем картинку каждые 20 секунд
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 20000); // 20 000 мс = 20 секунд
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header isAuth={isAuth} />

      <div className="flex flex-col items-center justify-center min-h-screen bg-white font-montserrat text-black">
        <h1
          id="error-text"
          className="font-black text-center"
          style={{ fontSize: "clamp(80px, 10vw, 300px)" }}
        >
          404
        </h1>

        <h2
          className="font-extrabold text-center mt-4"
          style={{ fontSize: "clamp(30px, 5vw, 115px)" }}
        >
          ОКАК
        </h2>

        <div className="w-full max-w-screen-lg mt-auto flex justify-center">
          <img
            src={images[currentImageIndex]}
            alt="cat"
            className="h-auto object-contain"
          />
        </div>
      </div>
    </>
  );
}
