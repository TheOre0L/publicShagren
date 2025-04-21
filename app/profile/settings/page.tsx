"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Eye, EyeOff, Home, Package, Save, Settings, ShoppingBag, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Моковые данные пользователя
const USER = {
  id: 1,
  firstName: "Иван",
  lastName: "Петров",
  email: "ivan@example.com",
  phone: "+7 (999) 123-45-67",
  avatar: "/placeholder-user.jpg",
  registrationDate: "15.01.2023",
  notifications: {
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    reviews: true,
  },
}

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Состояния для форм
  const [profileData, setProfileData] = useState({
    firstName: USER.firstName,
    lastName: USER.lastName,
    email: USER.email,
    phone: USER.phone,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState(USER.notifications)

  // Обработчики изменения форм
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (key, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Обработчики отправки форм
  const handleProfileSubmit = (e) => {
    e.preventDefault()
    // Здесь будет логика сохранения профиля
    setSuccessMessage("Профиль успешно обновлен")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    // Здесь будет логика изменения пароля
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Пароли не совпадают")
      return
    }
    setSuccessMessage("Пароль успешно изменен")
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleNotificationSubmit = (e) => {
    e.preventDefault()
    // Здесь будет логика сохранения настроек уведомлений
    setSuccessMessage("Настройки уведомлений сохранены")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xl">КожаМастер</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Главная
            </Link>
            <Link href="/catalog" className="text-sm font-medium hover:underline underline-offset-4">
              Каталог
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              О нас
            </Link>
            <Link href="#reviews" className="text-sm font-medium hover:underline underline-offset-4">
              Отзывы
            </Link>
            <Link href="#contacts" className="text-sm font-medium hover:underline underline-offset-4">
              Контакты
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" size="icon" className="rounded-full relative">
                <ShoppingBag className="h-4 w-4" />
                <span className="sr-only">Корзина</span>
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto" asChild>
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4" />
                Назад в профиль
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Боковая панель */}
            <div className="w-full md:w-64 space-y-6">
              <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={USER.avatar} alt={`${USER.firstName} ${USER.lastName}`} />
                  <AvatarFallback>
                    {USER.firstName.charAt(0)}
                    {USER.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">
                  {USER.firstName} {USER.lastName}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">{USER.email}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Изменить фото
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 font-medium">Настройки</div>
                <div className="p-2">
                  <button
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "profile" ? "bg-amber-50 text-amber-700" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4" />
                    Личные данные
                  </button>
                  <button
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "password" ? "bg-amber-50 text-amber-700" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveTab("password")}
                  >
                    <Settings className="h-4 w-4" />
                    Изменить пароль
                  </button>
                  <button
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "notifications" ? "bg-amber-50 text-amber-700" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-4 w-4" />
                    Уведомления
                  </button>
                  <Link
                    href="/profile"
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors hover:bg-muted`}
                  >
                    <Package className="h-4 w-4" />
                    Мои заказы
                  </Link>
                </div>
              </div>
            </div>

            {/* Основной контент */}
            <div className="flex-1">
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

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Личные данные</CardTitle>
                      <CardDescription>Обновите свою личную информацию</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Имя</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={profileData.firstName}
                              onChange={handleProfileChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Фамилия</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={profileData.lastName}
                              onChange={handleProfileChange}
                              required
                            />
                          </div>
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
                          <Label htmlFor="phone">Телефон</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profileData.phone}
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

                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Изменить пароль</CardTitle>
                      <CardDescription>Обновите свой пароль для повышения безопасности</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Текущий пароль</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              required
                              className="pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Новый пароль</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              required
                              className="pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Пароль должен содержать минимум 8 символов, включая буквы и цифры
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                              className="pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
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

                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Настройки уведомлений</CardTitle>
                      <CardDescription>Выберите, какие уведомления вы хотите получать</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form id="notifications-form" onSubmit={handleNotificationSubmit} className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="orderUpdates">Обновления заказов</Label>
                              <p className="text-sm text-muted-foreground">
                                Получать уведомления о статусе ваших заказов
                              </p>
                            </div>
                            <Switch
                              id="orderUpdates"
                              checked={notificationSettings.orderUpdates}
                              onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="promotions">Акции и скидки</Label>
                              <p className="text-sm text-muted-foreground">
                                Получать информацию о специальных предложениях и скидках
                              </p>
                            </div>
                            <Switch
                              id="promotions"
                              checked={notificationSettings.promotions}
                              onCheckedChange={(checked) => handleNotificationChange("promotions", checked)}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="newsletter">Новостная рассылка</Label>
                              <p className="text-sm text-muted-foreground">
                                Получать ежемесячную рассылку с новостями и советами
                              </p>
                            </div>
                            <Switch
                              id="newsletter"
                              checked={notificationSettings.newsletter}
                              onCheckedChange={(checked) => handleNotificationChange("newsletter", checked)}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="reviews">Отзывы и обзоры</Label>
                              <p className="text-sm text-muted-foreground">
                                Получать запросы на оставление отзывов о приобретенных товарах
                              </p>
                            </div>
                            <Switch
                              id="reviews"
                              checked={notificationSettings.reviews}
                              onCheckedChange={(checked) => handleNotificationChange("reviews", checked)}
                            />
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" form="notifications-form" className="bg-amber-700 hover:bg-amber-800">
                        <Save className="mr-2 h-4 w-4" />
                        Сохранить настройки
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

