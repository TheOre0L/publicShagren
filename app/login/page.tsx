"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShoppingBag } from "lucide-react"
import {message} from "antd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import $api, { API_URL } from "@/http/requests"
import Header from "@/components/header"

export default function LoginPage() {
  const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

    if (!formData.email.trim()) {
      newErrors.email = "Введите email"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Введите пароль"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Здесь будет логика отправки данных на сервер
      console.log("Форма входа отправлена:", formData)

      $api.post(`${API_URL}/login`, {email: formData.email, password: formData.password}).then((res) => {
        localStorage.setItem('token', res.data.accessToken)
        router.push('/')
      }).catch((e) => {
        console.log(e)
        messageApi.error(`${e.response.data.message}`)
      })
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
              <CardTitle className="text-2xl font-bold text-center">Вход в аккаунт</CardTitle>
              <CardDescription className="text-center">Введите свои данные для входа в личный кабинет</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Введите email"
                    value={formData.login}
                    onChange={handleChange}
                    className={errors.login ? "border-red-500" : ""}
                  />
                  {errors.login && <p className="text-red-500 text-xs mt-1">{errors.login}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Пароль</Label>
                    <Link href="/forgot-password" className="text-sm text-amber-700 hover:underline">
                      Забыли пароль?
                    </Link>
                  </div>
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
                  Войти
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center text-sm">
                Нет аккаунта?{" "}
                <Link href="/registration" className="text-amber-700 hover:underline">
                  Зарегистрироваться
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

