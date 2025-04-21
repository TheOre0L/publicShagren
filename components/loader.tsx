import styled from "styled-components";
import { useState, useEffect } from "react";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Центрируем по вертикали */
  width: 100vw;
  background: #f8f8f8; /* Светлый фон */
`;

const LoaderImage = styled.img`
  width: 100px; /* Фиксированный размер сразу */
  height: 100px;
  object-fit: contain; /* Чтобы картинка загружалась без скачков */
  animation: slow-spin 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  opacity: 0; /* Скрываем пока не загрузится */
  transition: opacity 0.3s ease-in; /* Плавное появление */

  @keyframes slow-spin {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); } /* Половина оборота */
    100% { transform: rotate(360deg); } /* Полный оборот */
  }
`;

const Loader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Имитация загрузки (например, реальный fetch данных)
    const img = new Image();
    img.src = "https://i.imgur.com/NrS9R03.png";
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <LoaderWrapper>
      <LoaderImage
        src="https://i.imgur.com/NrS9R03.png"
        alt="Loading..."
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </LoaderWrapper>
  );
};

export default Loader;
