"use client";
import Header from "@/components/header";
import { useAuth } from "@/http/isAuth";
import { CheckCircle } from "lucide-react"

export default function Thank() {

  const { isAuth } = useAuth();

  return (
    <>
      <Header isAuth={isAuth} />
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Заголовок с иконкой успеха */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Спасибо за покупку!</h1>
          <p className="text-lg mb-4 text-gray-600 max-w-2xl mx-auto">
            Ваш заказ успешно оформлен и оплачен.
          </p>
          <a href="/">На главную </a>
        </div>
      </div>
    </div>
    </>
  );
}
