"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Lock, CheckCircle, ArrowRight } from "lucide-react"
import Header from "@/components/header"

export default function PasswordRecovery() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleNextStep = () => {
    setError("")

    if (step === 1 && !email) {
      setError("Пожалуйста, введите email")
      return
    }

    if (step === 2 && !code) {
      setError("Пожалуйста, введите код подтверждения")
      return
    }

    if (step === 3) {
      if (!password) {
        setError("Пожалуйста, введите новый пароль")
        return
      }
      if (password !== confirmPassword) {
        setError("Пароли не совпадают")
        return
      }
      if (password.length < 8) {
        setError("Пароль должен содержать минимум 8 символов")
        return
      }
    }

    setStep(step + 1)
  }

  return (
    <>
    <Header isAuth={false}></Header>

    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-black">Восстановление пароля</CardTitle>
          <CardDescription className="text-center text-black">
            {step === 1 && "Введите ваш email для восстановления пароля"}
            {step === 2 && "Введите код подтверждения, отправленный на ваш email"}
            {step === 3 && "Создайте новый пароль"}
            {step === 4 && "Пароль успешно изменен!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      s < step
                        ? "bg-black text-white"
                        : s === step
                          ? "bg-black text-white"
                          : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                  </div>
                  <div className={`text-xs ${s <= step ? "text-black" : "text-black"}`}>
                    {s === 1 && "Email"}
                    {s === 2 && "Код"}
                    {s === 3 && "Пароль"}
                    {s === 4 && "Готово"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-slate-200 text-red-600 text-sm rounded">{error}</div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    className="pl-10 border-slate-200 focus:border-slate-500 focus:ring-oraslatenge-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-slate-700">
                  Код подтверждения
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Введите 6-значный код"
                  className="text-center text-lg tracking-widest border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <p className="text-xs text-slate-600 text-center mt-2">Код был отправлен на {email}</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Новый пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Минимум 8 символов"
                    className="pl-10 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-slate-700">
                  Подтвердите пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Повторите пароль"
                    className="pl-10 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <CheckCircle className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-orange-700 mb-2">Пароль успешно изменен!</h3>
              <p className="text-orange-600 mb-4">Теперь вы можете войти в систему, используя новый пароль.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step < 4 ? (
            <>
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="border-orange-200 text-slate-700 hover:bg-orange-50 hover:text-orange-800"
                >
                  Назад
                </Button>
              )}
              {step === 1 && <div></div>}
              <Button onClick={handleNextStep} className="bg-slate-500 hover:bg-slate-600 text-white ml-auto">
                {step === 3 ? "Завершить" : "Далее"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Войти в систему
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
        </>
  )
}
