"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {message} from "antd"
import $api, { API_URL } from "@/http/requests"
import Header from "@/components/header"

export default function RegisterPage() {
  const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    email: "",
    fio: "",
    city: "",
    telephone: "",
  })
  const [errors, setErrors] = useState({
    password: "",
    email: "",
    fio: "",
    city: "",
    telephone: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }
  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = "Пароль обязателен"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов"
      isValid = false
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email обязателен"
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Введите корректный email"
      isValid = false
    }

    // Валидация ФИО
    if (!formData.fio.trim()) {
      newErrors.fio = "ФИО обязательно"
      isValid = false
    }

    // Валидация города
    if (!formData.city.trim()) {
      newErrors.city = "Город обязателен"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Здесь будет логика отправки данных на сервер
      console.log("Форма отправлена:", formData)

      // После успешной регистрации перенаправляем на страницу входа
      $api.post(`${API_URL}/regist`, formData)
  .then((res) => {
    localStorage.setItem('refreshToken', res.data.refreshToken)
    router.push('/login')
  })
  .catch((error) => {
    const respData = error.response?.data as { message?: string | string[] };
    const { message } = respData || {};

    if (Array.isArray(message)) {
      message.forEach((msg) => messageApi.error(msg));
    } else if (typeof message === "string") {
      messageApi.error(message);
    } else {
      messageApi.error(error.message || "Ошибка регистрации");
    }
  });

      // 
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthPage isAuth={false}/>
      {contextHolder}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Card className="border-amber-800/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Регистрация</CardTitle>
              <CardDescription className="text-center">Создайте аккаунт для доступа к личному кабинету</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">


                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fio">ФИО</Label>
                  <Input
                    id="fio"
                    name="fio"
                    placeholder="Иванов Иван Иванович"
                    value={formData.fio}
                    onChange={handleChange}
                    className={errors.fio ? "border-red-500" : ""}
                  />
                  {errors.fio && <p className="text-red-500 text-xs mt-1">{errors.fio}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Москва"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Телефон</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={errors.telephone ? "border-red-500" : ""}
                  />
                  {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                
                <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
                  Зарегистрироваться
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Уже есть аккаунт?{" "}
                <Link href="/login" className="text-amber-700 hover:underline">
                  Войти
                </Link>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                Регистрируясь, вы соглашаетесь с нашими{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                  Условиями использования
                </Link>{" "}
                и{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Политикой конфиденциальности
                </Link>
                .
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

