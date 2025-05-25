import { useState, useEffect, useRef } from "react";
import $api, { API_URL } from "./requests";
import router from "next/router";

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isAccept, setIsAccept] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isAuthChecked = useRef(false); // Добавляем реф для проверки, был ли уже выполнен запрос

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthChecked.current) return; // Если авторизация уже проверялась, выходим

      isAuthChecked.current = true; // Устанавливаем флаг, что запрос выполнен

      try {
        setIsLoading(true);
        const res = await $api.get(`${API_URL}/refreshTokens`, {
          withCredentials: true,
        });
        localStorage.setItem("token", res.data.accessToken);
        setIsAccept(res.data.accept)
        setIsAuth(true);  
      } catch {
        // Ошибка игнорируется, isAuth остается false
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  return { isAuth, isLoading, isAccept };
};

export const logout = async () => {
  try {
    await $api.get(`${API_URL}/logout`, { withCredentials: true });
    localStorage.removeItem("token");
  } catch {
    // Ошибку игнорируем
  } finally {
    router.push("/")
  }
};
