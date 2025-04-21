"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, ShoppingBag, Package, Tag, Info, CheckCircle2, Search, Trash2, MoreHorizontal, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Header from "@/components/header"
import Loader from "@/components/loader"
import { useAuth } from "@/http/isAuth"
import $api, { API_URL } from "@/http/requests"

// Mock data for notifications

export default function NotificationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [notifications, setNotifications] = useState([])
  const [isLoadedNotification, setLoadedNotification] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(5)

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  let currentNotifications;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Today - show time
      return `Сегодня, ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
    } else if (diffDays === 1) {
      // Yesterday
      return "Вчера"
    } else if (diffDays < 7) {
      // Within a week
      const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
      return days[date.getDay()]
    } else {
      // Older than a week
      return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`
    }
  }


  const { isAuth, isLoading } = useAuth(); // Теперь используем isLoading
  
  useEffect(() => {
    if (isLoading) return; // Ждём, пока закончится загрузка
    if (!isAuth) {
      router.push("/login");
    }
  }, [isAuth, isLoading, router]); 
  
  useEffect(() => {
    if (isLoading || !isAuth) return; // Ждём завершения авторизации
    setLoadedNotification(true)
    $api
      .get(`${API_URL}/notification?page=${currentPage}&limit=${itemsPerPage}`)
      .then((res) => {
        setNotifications(res.data.notifications)
        setTotalPages(Math.ceil(res.data.total / itemsPerPage))
      })
      .catch(() => {})
      .finally(() => {setLoadedNotification(false)})
  }, [isAuth, isLoading, currentPage]); 
  
  if (isLoading || isLoadedNotification) {
    return <Loader />; // Показываем лоадер, пока идёт авторизация
  }
  

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-blue-500" />
      case "promo":
        return <Tag className="h-5 w-5 text-amber-500" />
      case "system":
        return <Info className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    // Mark as read
    setNotifications(notifications.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))

    // Navigate to the link
    router.push(`${notification.link}`)
  }

  // Handle mark as read
  const markAsRead = (ids: number[]) => {

  }

  // Handle mark all as read
  const markAllAsRead = () => {

  }

  // Handle delete notifications
  const deleteNotifications = (ids: number[]) => {

  }

  // Handle select all notifications on current page
  const selectAllOnPage = (checked: boolean) => {
  }

  // Handle select notification
  const toggleSelectNotification = (id: number) => {
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuth/>
      <main className="flex-1 container py-8">
      <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 p-0 h-auto m-2"
                      onClick={() => router.push('/profile')}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                      Назад к заказам
                    </Button>
                  </div>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Уведомления</h1>
              <p className="text-muted-foreground">
                Управляйте своими уведомлениями и будьте в курсе последних обновлений
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead()}
                disabled={true}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Прочитать все
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Main content */}
            <div className="flex-1">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {activeTab === "all" && "Все уведомления"}
                    </CardTitle>
                    {selectedNotifications.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => markAsRead(selectedNotifications)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Прочитать
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteNotifications(selectedNotifications)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {notifications.length > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center py-2 px-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all"
                            checked={
                              notifications.length > 0 &&
                              notifications.every((n) => selectedNotifications.includes(n.id))
                            }
                            onCheckedChange={selectAllOnPage}
                          />
                          <Label htmlFor="select-all" className="text-sm cursor-pointer">
                            Выбрать все
                          </Label>
                        </div>
                      </div>
                      <Separator />
                      {notifications.map((notification) => (
                        <div key={notification.id}>
                          <div
                            className={`flex items-start gap-4 py-4 px-4 hover:bg-muted/50 cursor-pointer ${
                              !notification.isRead ? "bg-muted/30" : ""
                            }`}
                          >
                            <div className="flex items-center h-full pt-1">
                              <Checkbox
                                checked={selectedNotifications.includes(notification.id)}
                                onCheckedChange={() => toggleSelectNotification(notification.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="flex-shrink-0 pt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0" onClick={() => handleNotificationClick(notification)}>
                              <div className="flex items-center justify-between">
                                <h3 className={`font-medium ${notification?.status === "send" ? "font-semibold" : ""}`}>
                                  {notification.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDate(notification.date)}
                                  </span>
                                  {!notification.isRead && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.text}</p>
                              {notification.orderId && (
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    Заказ #{notification.orderId}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Действия</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!notification.isRead && (
                                    <DropdownMenuItem onClick={() => markAsRead([notification.id])}>
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Отметить как прочитанное
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => deleteNotifications([notification.id])}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Удалить
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Нет уведомлений</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        {searchQuery
                          ? "По вашему запросу не найдено уведомлений. Попробуйте изменить параметры поиска."
                          : "У вас пока нет уведомлений. Они появятся здесь, когда произойдет что-то важное."}
                      </p>
                    </div>
                  )}
                </CardContent>
                {totalPages > 1 && (
                  <CardFooter>
                    <div className="w-full">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            > 
                            Назад
                            </PaginationPrevious>
                            
                          </PaginationItem>

                          {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNumber = index + 1
                            // Show first page, last page, and pages around current page
                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      setCurrentPage(pageNumber)
                                    }}
                                    isActive={pageNumber === currentPage}
                                  >
                                    {pageNumber}
                                  </PaginationLink>
                                </PaginationItem>
                              )
                            }

                            // Show ellipsis for gaps
                            if (
                              (pageNumber === 2 && currentPage > 3) ||
                              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )
                            }

                            return null
                          })}

                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                              }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

