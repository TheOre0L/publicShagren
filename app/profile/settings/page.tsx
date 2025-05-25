"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  Settings,
  User,
  Package,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import $api, { API_URL } from "@/http/requests"
import Loader from "@/components/loader"
import { useAuth } from "@/http/isAuth"
import Header from "@/components/header"

// Заглушка начальных данных уведомлений — подмени на реальные данные из API
const DEFAULT_NOTIFICATIONS = {
  orderUpdates: true,
  promotions: true,
  newsletter: false,
  reviews: true,
}

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { isAuth, isLoading } = useAuth()

  // Данные профиля
  const [profileData, setProfileData] = useState({
    fio: "",
    email: "",
    telephone: "",
  })
  const [isLoadingProfile, setLoadingProfile] = useState(true)

  // Пароли
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Видимость паролей
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Уведомления
  const [notificationSettings, setNotificationSettings] = useState(DEFAULT_NOTIFICATIONS)

  // Активная вкладка
  const [activeTab, setActiveTab] = useState("profile")

  // Сообщения об успехе
  const [successMessage, setSuccessMessage] = useState("")

  // Редирект если не авторизован
  useEffect(() => {
    if (isLoading) return
    if (!isAuth) router.push("/login")
  }, [isAuth, isLoading, router])

  // Загрузка данных профиля после авторизации
  useEffect(() => {
    if (isLoading || !isAuth) return
    setLoadingProfile(true)
    $api
      .get(`${API_URL}/profile`)
      .then((res) => {
        setProfileData({
          fio: res.data.fio || "",
          email: res.data.email || "",
          telephone: res.data.telephone || "",
        })
        setNotificationSettings(res.data.notifications || DEFAULT_NOTIFICATIONS)
      })
      .catch((e) => {
        alert("Ошибка при загрузке данных профиля")
        console.error(e)
      })
      .finally(() => setLoadingProfile(false))
  }, [isAuth, isLoading])

  if (isLoading || isLoadingProfile) return <Loader />

  // Хендлеры изменения данных
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }
  const handleNotificationChange = (key, value) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Отправка данных профиля
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      await $api.patch(`${API_URL}/settings`, profileData)
      setSuccessMessage("Профиль успешно обновлен")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch {
      alert("Ошибка при обновлении профиля")
    }
  }

  // Отправка смены пароля
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Пароли не совпадают")
      return
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d).{6,}/.test(passwordData.newPassword)) {
      alert("Пароль должен содержать минимум 6 символов, включая буквы и цифры")
      return
    }

    try {
      await $api.post(`${API_URL}/pass`, {
        pas: passwordData.currentPassword,
        newpas: passwordData.newPassword,
      })
      setSuccessMessage("Пароль успешно изменен!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch {
      alert("Ошибка при изменении пароля")
    }
  }

  // Отправка настроек уведомлений
  const handleNotificationSubmit = (e) => {
    e.preventDefault()
    // TODO: сделать вызов API для сохранения notificationSettings, если есть эндпоинт
    setSuccessMessage("Настройки уведомлений сохранены")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Функция для инициалов в аватаре
  const getInitials = (fio) => {
    if (!fio) return "?"
    return fio
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuth={isAuth} />

      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center gap-2">
            <Link href="/profile" passHref legacyBehavior>
              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto" as="a">
                <ArrowLeft className="h-4 w-4" />
                Назад в профиль
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Боковая панель */}
            <aside className="w-full md:w-64 space-y-6">
              <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback>{getInitials(profileData.fio)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profileData.fio}</h2>
                <p className="text-sm text-muted-foreground mb-4">{profileData.email}</p>
                <div className="p-2 flex flex-col space-y-1">
                  <button
                    type="button"
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "profile" ? "bg-amber-50 text-amber-700" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4" />
                    Личные данные
                  </button>
                  <button
                    type="button"
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "password" ? "bg-amber-50 text-amber-700" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveTab("password")}
                  >
                    <Settings className="h-4 w-4" />
                    Изменить пароль
                  </button>
                  <button
                    type="button"
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "notifications" ? "bg-amber-50 text-amber-700" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <BellIcon className="h-4 w-4" />
                    Уведомления
                  </button>
                  <Link
                    href="/profile"
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors hover:bg-muted"
                  >
                    <Package className="h-4 w-4" />
                    Мои заказы
                  </Link>
                </div>
              </div>
            </aside>

            {/* Основной контент */}
            <section className="flex-1">
              <h1 className="text-2xl font-bold mb-6">Настройки профиля</h1>

              {successMessage && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <AlertTitle className="text-green-700">Успешно!</AlertTitle>
                  <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Личные данные</TabsTrigger>
                  <TabsTrigger value="password">Пароль</TabsTrigger>
                  <TabsTrigger value="notifications">Уведомления</TabsTrigger>
                </TabsList>

                {/* Личные данные */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Личные данные</CardTitle>
                      <CardDescription>Обновите свою личную информацию</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fio">ФИО</Label>
                          <Input
                            id="fio"
                            name="fio"
                            value={profileData.fio}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telephone">Телефон</Label>
                          <Input
                            id="telephone"
                            name="telephone"
                            type="tel"
                            value={profileData.telephone}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" form="profile-form" className="bg-amber-700 hover:bg-amber-800">
                        <Save className="mr-2 h-4 w-4" />
                        Сохранить изменения
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Изменение пароля */}
                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Изменить пароль</CardTitle>
                      <CardDescription>Пароль должен содержать минимум 6 символов, включая буквы и цифры</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
                        <PasswordInput
                          id="currentPassword"
                          name="currentPassword"
                          label="Текущий пароль"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          show={showCurrentPassword}
                          setShow={setShowCurrentPassword}
                        />
                        <PasswordInput
                          id="newPassword"
                          name="newPassword"
                          label="Новый пароль"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          show={showNewPassword}
                          setShow={setShowNewPassword}
                          description="Пароль должен содержать минимум 6 символов, включая буквы и цифры"
                        />
                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          label="Подтвердите новый пароль"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          show={showConfirmPassword}
                          setShow={setShowConfirmPassword}
                        />
                      </form>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        form="password-form"
                        className="bg-amber-700 hover:bg-amber-800"
                        disabled={
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword ||
                          passwordData.newPassword !== passwordData.confirmPassword
                        }
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Изменить пароль
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Настройки уведомлений */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Настройки уведомлений</CardTitle>
                      <CardDescription>Управляйте своими предпочтениями уведомлений</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form id="notifications-form" onSubmit={handleNotificationSubmit} className="space-y-4">
                        {Object.entries(notificationSettings).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <Label htmlFor={key} className="capitalize">
                              {{
                                orderUpdates: "Обновления заказов",
                                promotions: "Промоакции",
                                newsletter: "Рассылка новостей",
                                reviews: "Отзывы",
                              }[key] || key}
                            </Label>
                            <Switch id={key} checked={value} className="bg-amber-300 radix-state-checked:bg-amber-500" onCheckedChange={(checked) => handleNotificationChange(key, checked)} />
                          </div>
                        ))}
                      </form>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" form="notifications-form" className="bg-amber-700 hover:bg-amber-800">
                        Сохранить настройки
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

// Вспомогательный компонент для поля пароля с кнопкой показать/скрыть
function PasswordInput({ id, name, label, value, onChange, show, setShow, description }) {
  return (
    <div className="space-y-2 relative">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        required
        className="pr-10"
        aria-label={label}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={() => setShow(!show)}
        aria-label={show ? "Скрыть пароль" : "Показать пароль"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

// Иконка колокольчика для уведомлений, если lucide-react не подключён
function BellIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  )
}
