"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, Edit, Home, LogOut, Package, Settings, ShoppingBag, User, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logout, useAuth } from "@/http/isAuth"
import $api, { API_URL } from "@/http/requests"
import Loader from "@/components/loader"
import Header from "@/components/header"

// Моковые данные пользователя
const USER = {
  id: 1,
  firstName: "Иван",
  lastName: "Петров",
  email: "ivan@example.com",
  phone: "+7 (999) 123-45-67",
  avatar: "/placeholder-user.jpg",
  registrationDate: "15.01.2023",
  addresses: [
    {
      id: 1,
      title: "Домашний",
      address: "г. Москва, ул. Ленина, 10, кв. 25",
      isDefault: true,
    },
    {
      id: 2,
      title: "Рабочий",
      address: "г. Москва, Проспект Мира, 112, офис 301",
      isDefault: false,
    },
  ],
}

// Моковые данные заказов


export default function ProfilePage() {
  const router = useRouter();
const [activeTab, setActiveTab] = useState("overview");
const [notificationCount, setNotificationCount] = useState(0)
const [selectedOrder, setSelectedOrder] = useState(null);
const [isLoadingProfile, setLoadingProfile] = useState(true)
const [user, setUser] = useState({});
const { isAuth, isLoading } = useAuth(); // Теперь используем isLoading

useEffect(() => {
  if (isLoading) return; // Ждём, пока закончится загрузка
  if (!isAuth) {
    router.push("/login");
  }
}, [isAuth, isLoading, router]); 

useEffect(() => {
  if (isLoading || !isAuth) return; // Ждём завершения авторизации
  setLoadingProfile(true)
  $api
    .get(`${API_URL}/notification/count`)
    .then((res) => {
      setNotificationCount(res.data.notificationCount)
    })
  $api
    .get(`${API_URL}/profile`)
    .then((res) => {
      setUser(res.data)
    })
    .catch(() => {})
    .finally(() => {setLoadingProfile(false)})
}, [isAuth, isLoading]); 

if (isLoading || isLoadingProfile) {
  return <Loader />; // Показываем лоадер, пока идёт авторизация
}

  
  // Функция для отображения статуса заказа
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            В обработке
          </Badge>
        )
        case "accepted":
        return (
          <Badge variant="outline" className="bg-lime-50 text-lime-400 hover:bg-lime-50 border-lime-200">
            Принят в работу
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">
            Отправлен
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            Доставлен
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
            Отменен
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleLogout = () => {
    // Здесь будет логика выхода из аккаунта
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuth/>
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Боковая панель */}
            <div className="w-full md:w-64 space-y-6">
              <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={USER.avatar} alt={`${user.fio}`} />
                  <AvatarFallback>
                    {user.fio.charAt(0)}
                    {user.fio.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">
                  {user.fio}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 font-medium">Меню</div>
                <div className="p-2">
                  <button
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "overview" ? "bg-amber-50 text-amber-700" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <User className="h-4 w-4" />
                    Обзор
                  </button>
                  <button
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "orders" ? "bg-amber-50 text-amber-700" : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      setActiveTab("orders")
                      setSelectedOrder(null)
                    }}
                  >
                    <Package className="h-4 w-4" />
                    Мои заказы
                  </button>
                  <Link
                    href="/profile/settings"
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors hover:bg-muted`}
                  >
                    <Settings className="h-4 w-4" />
                    Настройки
                  </Link>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors hover:bg-muted text-red-600 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </button>
                </div>
              </div>
            </div>

            {/* Основной контент */}
            <div className="flex-1">
              {/* Обзор */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Личный кабинет</h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <Package className="h-4 w-4 text-amber-700" />
                          Заказы
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{user.order.length}</p>
                        <p className="text-sm text-muted-foreground">Всего заказов</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-0 h-auto text-sm text-amber-700 hover:text-amber-800 hover:bg-transparent"
                          onClick={() => {
                            setActiveTab("orders")
                            setSelectedOrder(null)
                          }}
                        >
                          Посмотреть все заказы
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <Bell className="h-4 w-4 text-amber-700" />
                          Уведомления
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{notificationCount}</p>
                        <p className="text-sm text-muted-foreground">Непрочитанных уведомлений</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => router.push('/notifications')}
                          variant="ghost"
                          className="w-full justify-start p-0 h-auto text-sm text-amber-700 hover:text-amber-800 hover:bg-transparent"
                        >
                          Просмотреть уведомления
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <h2 className="text-xl font-semibold mt-8">Последние заказы</h2>
                  <div className="space-y-4">
                    {user.order.slice(0, 2).map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">Заказ {order.id}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">от {
                            new Date(order.createdAt as string).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric', // Полный год
                            })
                            }</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{order.summa.toLocaleString()} ₽</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveTab("orders")
                                setSelectedOrder(order)
                              }}
                            >
                              Подробнее
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="relative w-12 h-12 rounded-md overflow-hidden border">
                              <Image
                                src={`${API_URL}/uploads/${item.product.images[0].file}` || "/placeholder.svg"}
                                alt={item.product.images[0].alt}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {user.order.length > 2 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setActiveTab("orders")
                          setSelectedOrder(null)
                        }}
                      >
                        Показать все заказы
                      </Button>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold mt-8">Личная информация</h2>
                  <Card>
                    <CardContent className="pt-6">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-muted-foreground">Имя</dt>
                          <dd>{USER.firstName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Фамилия</dt>
                          <dd>{USER.lastName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Email</dt>
                          <dd>{USER.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Телефон</dt>
                          <dd>{USER.phone}</dd>
                        </div>
                      </dl>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" asChild className="gap-1">
                        <Link href="/profile/settings">
                          <Edit className="h-4 w-4" />
                          Редактировать
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Заказы */}
              {activeTab === "orders" && !selectedOrder && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Мои заказы</h1>
                    <Link href="/catalog">
                      <Button className="bg-amber-700 hover:bg-amber-800">Сделать новый заказ</Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {user.order.length > 0 ? (
                      user.order.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">Заказ №{order.id}</h3>
                                {getStatusBadge(order.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">от {
                            new Date(order.createdAt as string).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric', // Полный год
                            })
                            }</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{order.summa.toLocaleString()} ₽</p>
                              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                Подробнее
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="relative w-12 h-12 rounded-md overflow-hidden border">
                                <Image
                                  src={`${API_URL}/uploads/${item.product.images[0].file}`|| "/placeholder.svg"}
                                  alt={item.product.images[0].alt}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 border rounded-lg">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">У вас пока нет заказов</h3>
                        <p className="text-muted-foreground mb-6">
                          Перейдите в каталог, чтобы сделать свой первый заказ
                        </p>
                        <Button asChild className="bg-amber-700 hover:bg-amber-800">
                          <Link href="/catalog">Перейти в каталог</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Детали заказа */}
              {activeTab === "orders" && selectedOrder && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 p-0 h-auto"
                      onClick={() => setSelectedOrder(null)}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                      Назад к заказам
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold">Заказ №{selectedOrder.id}</h1>
                      <p className="text-muted-foreground">от {
                            new Date(selectedOrder.createdAt as string).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric', // Полный год
                            })
                            }</p>
                    </div>
                    {getStatusBadge(selectedOrder.status)}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Информация о заказе</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Товары</h3>
                        <div className="space-y-4">
                          {selectedOrder.orderItems.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="relative w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                                <Image
                                  src={`${API_URL}/uploads/${item.product.images[0].file}` || "/placeholder.svg"}
                                  alt={item.product.images[0].alt}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                              <Link key={item.product.id} href={`/product/${item.product.id}`} className="group">
                                <h4 className="font-medium">{item.product.title}</h4>
                              </Link>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity} x {item.product.price.toLocaleString()} ₽
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{(item.product.price * item.quantity).toLocaleString()} ₽</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Подытог</span>
                          <span>{(selectedOrder.summa - (selectedOrder.delivery?.deliverySum || 0)).toLocaleString()}
                          ₽</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Доставка</span>
                          {selectedOrder.delivery ? <span>{selectedOrder.delivery.deliverySum} ₽</span> : <span>0 ₽</span>}
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Итого</span>
                          <span>{selectedOrder.summa.toLocaleString()} ₽</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-2">Способ доставки</h3>
                          <p>{selectedOrder.delivery ? "CDEK до ПВЗ" : "Самовывоз"}</p>
                          <p className="text-sm text-muted-foreground mt-1">{selectedOrder?.deliveryAddress}</p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Способ оплаты</h3>
                          <p>{selectedOrder.payment ? 'Картой на сайте' : 'Наличными'}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                        Назад к заказам
                      </Button>
                      {selectedOrder.status === "pending" && (
                        <Button variant="destructive" size="sm">
                          Отменить заказ
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Адреса */}
              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Адреса доставки</h1>
                    <Button className="bg-amber-700 hover:bg-amber-800">Добавить новый адрес</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {USER.addresses.map((address) => (
                      <Card key={address.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium">{address.title}</CardTitle>
                            {address.isDefault && (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                              >
                                По умолчанию
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{address.address}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-4 w-4" />
                            Изменить
                          </Button>
                          {!address.isDefault && (
                            <Button variant="ghost" size="sm">
                              Сделать основным
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

