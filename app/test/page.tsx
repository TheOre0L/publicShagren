"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChart3,
  Home,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  Menu,
  Star,
  Folder,
  CheckCircle,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

// Mock data for the charts
const salesData = [
  { name: "Янв", Кошельки: 400, Ремни: 240, Сумки: 320 },
  { name: "Фев", Кошельки: 300, Ремни: 280, Сумки: 280 },
  { name: "Мар", Кошельки: 500, Ремни: 300, Сумки: 350 },
  { name: "Апр", Кошельки: 580, Ремни: 400, Сумки: 420 },
  { name: "Май", Кошельки: 620, Ремни: 380, Сумки: 410 },
  { name: "Июн", Кошельки: 750, Ремни: 500, Сумки: 550 },
]

// Mock data for products
const products = [
  {
    id: 1,
    name: "Кожаный кошелек",
    category: "Кошельки",
    price: "3 500 ₽",
    stock: 15,
    image: "/placeholder.svg",
    relatedProducts: [2, 4, 10],
  },
  {
    id: 2,
    name: "Ремень ручной работы",
    category: "Ремни",
    price: "2 800 ₽",
    stock: 8,
    image: "/placeholder.svg",
    relatedProducts: [1, 5],
  },
  {
    id: 3,
    name: "Кожаная сумка",
    category: "Сумки",
    price: "12 500 ₽",
    stock: 5,
    image: "/placeholder.svg",
    relatedProducts: [6],
  },
  {
    id: 4,
    name: "Чехол для ключей",
    category: "Аксессуары",
    price: "1 200 ₽",
    stock: 20,
    image: "/placeholder.svg",
    relatedProducts: [1, 5],
  },
  {
    id: 5,
    name: "Кожаный браслет",
    category: "Аксессуары",
    price: "1 500 ₽",
    stock: 12,
    image: "/placeholder.svg",
    relatedProducts: [2, 4],
  },
]

// Mock data for customers
const customers = [
  { id: 1, name: "Анна Смирнова", email: "anna@example.com", orders: 5, spent: "32 500 ₽", lastOrder: "15.06.2023" },
  { id: 2, name: "Иван Петров", email: "ivan@example.com", orders: 3, spent: "18 700 ₽", lastOrder: "22.05.2023" },
  { id: 3, name: "Елена Козлова", email: "elena@example.com", orders: 8, spent: "64 200 ₽", lastOrder: "10.06.2023" },
  {
    id: 4,
    name: "Дмитрий Соколов",
    email: "dmitry@example.com",
    orders: 2,
    spent: "15 300 ₽",
    lastOrder: "05.06.2023",
  },
  { id: 5, name: "Мария Иванова", email: "maria@example.com", orders: 4, spent: "27 800 ₽", lastOrder: "18.06.2023" },
]

// Mock data for reviews
const reviews = [
  {
    id: 1,
    name: "Анна К.",
    rating: 5,
    text: "Заказывала кошелек в подарок мужу. Качество превзошло все ожидания!",
    isActive: true,
  },
  {
    id: 2,
    name: "Дмитрий С.",
    rating: 5,
    text: "Уже второй год пользуюсь портмоне от КожаМастер. Несмотря на ежедневное использование, выглядит как новое.",
    isActive: true,
  },
  {
    id: 3,
    name: "Елена В.",
    rating: 4,
    text: "Заказывала сумку по индивидуальным меркам. Процесс занял больше времени, чем ожидала, но результат того стоил.",
    isActive: true,
  },
  {
    id: 4,
    name: "Сергей П.",
    rating: 5,
    text: "Отличный ремень! Ношу уже полгода, выглядит как новый.",
    isActive: false,
  },
  { id: 5, name: "Ольга М.", rating: 3, text: "Сумка хорошая, но есть небольшие недочеты в швах.", isActive: false },
]

// Mock data for homepage settings
const homepageSettings = {
  heroTitle: "Изделия из кожи ручной работы",
  heroSubtitle: "Уникальные аксессуары, созданные с любовью и мастерством",
  aboutTitle: "О нашем магазине",
  aboutText:
    "Мы - небольшая мастерская, специализирующаяся на создании высококачественных изделий из натуральной кожи. Каждое изделие создается вручную с особым вниманием к деталям и качеству.",
  heroImage: "/placeholder.svg",
  aboutImage: "/placeholder.svg",
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [homepageData, setHomepageData] = useState(homepageSettings)
  const [reviewsData, setReviewsData] = useState(reviews)

  // Add these state variables after the existing state declarations (around line 90)
  const [CATEGORIES, setCategories] = useState([
    { id: 1, name: "Кошельки", count: 3 },
    { id: 2, name: "Ремни", count: 2 },
    { id: 3, name: "Сумки", count: 2 },
    { id: 4, name: "Аксессуары", count: 3 },
  ])
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [deleteProductId, setDeleteProductId] = useState(null)
  const [deleteCustomerId, setDeleteCustomerId] = useState(null)
  const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false)
  const [deleteCustomerModalOpen, setDeleteCustomerModalOpen] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Add state for related products search and selection
  // Add these after the existing state declarations (around line 90)

  const [relatedProductSearch, setRelatedProductSearch] = useState("");
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<number[]>([]);

  // Function to toggle review active status
  const toggleReviewStatus = (id) => {
    setReviewsData(reviewsData.map((review) => (review.id === id ? { ...review, isActive: !review.isActive } : review)))
  }

  // Chart component (simplified for this example)
  const SalesChart = ({ data }) => (
    <div className="h-[300px] w-full">
      <div className="flex h-full items-end gap-2">
        {data.map((item, index) => (
          <div key={index} className="relative flex h-full w-full flex-col justify-end">
            <div className="flex gap-1 pb-2">
              <div className="h-32 w-full rounded-md bg-primary" style={{ height: `${item.Кошельки / 10}%` }}></div>
              <div className="h-32 w-full rounded-md bg-blue-500" style={{ height: `${item.Ремни / 10}%` }}></div>
              <div className="h-32 w-full rounded-md bg-green-500" style={{ height: `${item.Сумки / 10}%` }}></div>
            </div>
            <span className="absolute bottom-0 left-0 right-0 text-center text-xs">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary"></div>
          <span className="text-xs">Кошельки</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span className="text-xs">Ремни</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className="text-xs">Сумки</span>
        </div>
      </div>
    </div>
  )

  // Add these functions before the return statement
  const handleDeleteProduct = (id) => {
    setDeleteProductId(id)
    setDeleteProductModalOpen(true)
  }

  // Add this function before the return statement to handle related products search
  const handleRelatedProductSearch = (e) => {
    setRelatedProductSearch(e.target.value);
  };

  // Add this function to handle adding a related product
  const addRelatedProduct = (productId) => {
    if (!selectedRelatedProducts.includes(productId)) {
      setSelectedRelatedProducts([...selectedRelatedProducts, productId]);
    }
  };

  // Add this function to handle removing a related product
  const removeRelatedProduct = (productId) => {
    setSelectedRelatedProducts(selectedRelatedProducts.filter(id => id !== productId));
  };

  // Add this effect to initialize selected related products when editing
  useEffect(() => {
    if (selectedProduct && selectedProduct.relatedProducts) {
      setSelectedRelatedProducts(selectedProduct.relatedProducts);
    } else {
      setSelectedRelatedProducts([]);
    }
    setRelatedProductSearch("");
  }, [selectedProduct]);

  // Add this function to filter products based on search
  const getFilteredProducts = () => {
    if (!relatedProductSearch) return products.filter(p => selectedProduct?.id !== p.id);
    
    return products.filter(p => 
      selectedProduct?.id !== p.id && 
      (p.name.toLowerCase().includes(relatedProductSearch.toLowerCase()) || 
       p.category.toLowerCase().includes(relatedProductSearch.toLowerCase()))
    );
  };

  const handleDeleteCustomer = (id) => {
    setDeleteCustomerId(id)
    setDeleteCustomerModalOpen(true)
  }

  const confirmDeleteProduct = () => {
    // Here you would add the actual delete logic
    console.log(`Deleting product with ID: ${deleteProductId}`)
    setDeleteProductModalOpen(false)
  }

  const confirmDeleteCustomer = () => {
    // Here you would add the actual delete logic
    console.log(`Deleting customer with ID: ${deleteCustomerId}`)
    setDeleteCustomerModalOpen(false)
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ShoppingBag className="h-6 w-6" />
              <span>КожаМастер</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeTab === "dashboard"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <BarChart3 className="h-4 w-4" />
                Статистика
              </button>
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeTab === "products"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("products")}
              >
                <Package className="h-4 w-4" />
                Товары
              </button>
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeTab === "categories"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("categories")}
              >
                <Folder className="h-4 w-4" />
                Категории
              </button>
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeTab === "customers"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("customers")}
              >
                <Users className="h-4 w-4" />
                Клиенты
              </button>
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeTab === "homepage"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("homepage")}
              >
                <Home className="h-4 w-4" />
                Главная страница
              </button>
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeTab === "settings"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4" />
                Настройки
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
          <button className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </button>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Уведомления</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 rounded-full">
                <Image src="/placeholder-user.jpg" alt="Аватар" width={28} height={28} className="rounded-full" />
                <span className="hidden md:inline-block">Администратор</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Профиль</DropdownMenuItem>
              <DropdownMenuItem>Настройки</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Выйти</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Dashboard Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Панель управления</h1>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1 265 400 ₽</div>
                    <p className="text-xs text-muted-foreground">+20.1% с прошлого месяца</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Заказы</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">245</div>
                    <p className="text-xs text-muted-foreground">+12.5% с прошлого месяца</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">132</div>
                    <p className="text-xs text-muted-foreground">+18.2% с прошлого месяца</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5 165 ₽</div>
                    <p className="text-xs text-muted-foreground">+5.2% с прошлого месяца</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Статистика продаж</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 pb-4">
                      <Select defaultValue="6months">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Выберите период" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30days">Последние 30 дней</SelectItem>
                          <SelectItem value="6months">Последние 6 месяцев</SelectItem>
                          <SelectItem value="1year">Последний год</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все категории</SelectItem>
                          <SelectItem value="wallets">Кошельки</SelectItem>
                          <SelectItem value="belts">Ремни</SelectItem>
                          <SelectItem value="bags">Сумки</SelectItem>
                          <SelectItem value="accessories">Аксессуары</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <SalesChart data={salesData} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Популярные товары</CardTitle>
                    <CardDescription>Топ-5 самых продаваемых товаров</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <div className="font-medium">{product.price}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Управление товарами</h1>
                <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedProduct(null)}>
                      <Plus className="mr-2 h-4 w-4" /> Добавить товар
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedProduct ? "Редактировать товар" : "Добавить новый товар"}</DialogTitle>
                      <DialogDescription>
                        {selectedProduct
                          ? "Измените информацию о товаре и нажмите Сохранить"
                          : "Заполните информацию о новом товаре и нажмите Добавить"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-image" className="text-right">
                          Изображение
                        </Label>
                        <div className="col-span-3 flex items-center gap-4">
                          <div className="relative h-20 w-20 overflow-hidden rounded border">
                            <Image
                              src={selectedProduct ? selectedProduct.image : "/placeholder.svg"}
                              alt="Изображение товара"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" /> Загрузить
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-name" className="text-right">
                          Название
                        </Label>
                        <Input
                          id="product-name"
                          defaultValue={selectedProduct ? selectedProduct.name : ""}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-category" className="text-right">
                          Категория
                        </Label>
                        <div className="col-span-3">
                          <Select defaultValue={selectedProduct ? selectedProduct.category : ""}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-price" className="text-right">
                          Цена
                        </Label>
                        <Input
                          id="product-price"
                          defaultValue={selectedProduct ? selectedProduct.price.replace(" ₽", "") : ""}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-stock" className="text-right">
                          Количество
                        </Label>
                        <Input
                          id="product-stock"
                          type="number"
                          defaultValue={selectedProduct ? selectedProduct.stock : ""}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-description" className="text-right">
                          Описание
                        </Label>
                        <Textarea
                          id="product-description"
                          className="col-span-3"
                          rows={4}
                          defaultValue={selectedProduct ? "Описание товара" : ""}
                        />
                      </div>
                      
                      {/* Related Products Section */}
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">
                          Похожие товары
                        </Label>
                        <div className="col-span-3 space-y-4">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Поиск товаров..."
                                className="pl-8"
                                value={relatedProductSearch}
                                onChange={handleRelatedProductSearch}
                              />
                            </div>
                          </div>
                          
                          {/* Selected Related Products */}
                          <div className="space-y-2">
                            <Label className="text-sm">Выбранные товары ({selectedRelatedProducts.length})</Label>
                            <div className="border rounded-md p-2 min-h-[100px] max-h-[200px] overflow-y-auto">
                              {selectedRelatedProducts.length > 0 ? (
                                <div className="space-y-2">
                                  {products
                                    .filter(p => selectedRelatedProducts.includes(p.id))
                                    .map((product) => (
                                      <div key={product.id} className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md">
                                        <div className="flex items-center gap-2">
                                          <div className="relative h-8 w-8 overflow-hidden rounded">
                                            <Image
                                              src={product.image || "/placeholder.svg"}
                                              alt={product.name}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <span className="text-sm font-medium">{product.name}</span>
                                        </div>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-7 w-7"
                                          onClick={() => removeRelatedProduct(product.id)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                  Нет выбранных товаров
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Search Results */}
                          <div className="space-y-2">
                            <Label className="text-sm">Результаты поиска</Label>
                            <div className="border rounded-md p-2 min-h-[150px] max-h-[250px] overflow-y-auto">
                              {getFilteredProducts().length > 0 ? (
                                <div className="space-y-2">
                                  {getFilteredProducts().map((product) => (
                                    <div key={product.id} className="flex items-center justify-between gap-2 p-2 hover:bg-muted/50 rounded-md">
                                      <div className="flex items-center gap-2">
                                        <div className="relative h-8 w-8 overflow-hidden rounded">
                                          <Image
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium">{product.name}</span>
                                          <span className="text-xs text-muted-foreground">{product.category} • {product.price}</span>
                                        </div>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7"
                                        onClick={() => addRelatedProduct(product.id)}
                                        disabled={selectedRelatedProducts.includes(product.id)}
                                      >
                                        {selectedRelatedProducts.includes(product.id) ? (
                                          <>
                                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                            Добавлен
                                          </>
                                        ) : (
                                          <>
                                            <Plus className="h-3.5 w-3.5 mr-1" />
                                            Добавить
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                  {relatedProductSearch ? "Ничего не найдено" : "Начните поиск товаров"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setProductModalOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={() => setProductModalOpen(false)}>
                        {selectedProduct ? "Сохранить" : "Добавить"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead className="w-[80px]">Фото</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>В наличии</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>
                          <div className="relative h-10 w-10 overflow-hidden rounded">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedProduct(product)
                                setProductModalOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Редактировать</span>
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Удалить</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Управление категориями</h1>
                <Button onClick={() => setCategoryModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Добавить категорию
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Кол-во товаров</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CATEGORIES.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.id}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.count}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setNewCategoryName(category.name)
                                setCategoryModalOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Редактировать</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                // Here you would add delete category logic
                                alert(`Удаление категории: ${category.name}`)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Удалить</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Управление клиентами</h1>
                <Dialog open={customerModalOpen} onOpenChange={setCustomerModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedCustomer(null)}>
                      <Plus className="mr-2 h-4 w-4" /> Добавить клиента
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedCustomer ? "Редактировать клиента" : "Добавить нового клиента"}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedCustomer
                          ? "Измените информацию о клиенте и нажмите Сохранить"
                          : "Заполните информацию о новом клиенте и нажмите Добавить"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customer-name" className="text-right">
                          ФИО
                        </Label>
                        <Input
                          id="customer-name"
                          defaultValue={selectedCustomer ? selectedCustomer.name : ""}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customer-email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="customer-email" type="email"
                          defaultValue={selectedCustomer ? selectedCustomer.email : ""}aultValue={selectedCustomer ? selectedCustomer.email : ""}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customer-phone" className="text-right">
                          Телефон
                        </Label>
                        <Input
                          id="customer-phone"
                          defaultValue={selectedCustomer ? "+7 (999) 123-45-67" : ""}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customer-address" className="text-right">
                          Адрес
                        </Label>
                        <Textarea
                          id="customer-address"
                          className="col-span-3"
                          rows={3}
                          defaultValue={selectedCustomer ? "г. Москва, ул. Примерная, д. 1, кв. 1" : ""}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCustomerModalOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={() => setCustomerModalOpen(false)}>
                        {selectedCustomer ? "Сохранить" : "Добавить"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Заказов</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Последний заказ</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.orders}</TableCell>
                        <TableCell>{customer.spent}</TableCell>
                        <TableCell>{customer.lastOrder}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedCustomer(customer)
                                setCustomerModalOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Редактировать</span>
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteCustomer(customer.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Удалить</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Delete Product Confirmation Dialog */}
          <Dialog open={deleteProductModalOpen} onOpenChange={setDeleteProductModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogDescription>
                  Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteProductModalOpen(false)}>
                  Отмена
                </Button>
                <Button variant="destructive" onClick={confirmDeleteProduct}>
                  Удалить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Customer Confirmation Dialog */}
          <Dialog open={deleteCustomerModalOpen} onOpenChange={setDeleteCustomerModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogDescription>
                  Вы уверены, что хотите удалить этого клиента? Это действие нельзя отменить.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteCustomerModalOpen(false)}>
                  Отмена
                </Button>
                <Button variant="destructive" onClick={confirmDeleteCustomer}>
                  Удалить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Category Dialog */}
          <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Добавить категорию</DialogTitle>
                <DialogDescription>Введите название новой категории товаров</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category-name" className="text-right">
                    Название
                  </Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>
                  Отмена
                </Button>
                <Button
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      const newCategory = {
                        id: CATEGORIES.length + 1,
                        name: newCategoryName.trim(),
                        count: 0,
                      }
                      setCategories([...CATEGORIES, newCategory])
                      setNewCategoryName("")
                      setCategoryModalOpen(false)
                    }
                  }}
                  disabled={!newCategoryName.trim()}
                >
                  Добавить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Homepage Settings Tab */}
          {activeTab === "homepage" && (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Настройки главной страницы</h1>

              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Контент</TabsTrigger>
                  <TabsTrigger value="images">Изображения</TabsTrigger>
                  <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Заголовки и тексты</CardTitle>
                      <CardDescription>Настройте текстовое содержимое главной страницы</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="hero-title">Заголовок баннера</Label>
                        <Input
                          id="hero-title"
                          defaultValue={homepageData.heroTitle}
                          onChange={(e) => setHomepageData({ ...homepageData, heroTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hero-subtitle">Подзаголовок баннера</Label>
                        <Input
                          id="hero-subtitle"
                          defaultValue={homepageData.heroSubtitle}
                          onChange={(e) => setHomepageData({ ...homepageData, heroSubtitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-title">Заголовок блока "О нас"</Label>
                        <Input
                          id="about-title"
                          defaultValue={homepageData.aboutTitle}
                          onChange={(e) => setHomepageData({ ...homepageData, aboutTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-text">Текст блока "О нас"</Label>
                        <Textarea
                          id="about-text"
                          rows={5}
                          defaultValue={homepageData.aboutText}
                          onChange={(e) => setHomepageData({ ...homepageData, aboutText: e.target.value })}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">
                        <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="images" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Изображения</CardTitle>
                      <CardDescription>Загрузите изображения для главной страницы</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Изображение для баннера</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative h-40 w-64 overflow-hidden rounded-md border">
                            <Image
                              src={homepageData.heroImage || "/placeholder.svg"}
                              alt="Баннер"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" /> Загрузить новое изображение
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Изображение для блока "О нас"</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative h-40 w-64 overflow-hidden rounded-md border">
                            <Image
                              src={homepageData.aboutImage || "/placeholder.svg"}
                              alt="О нас"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" /> Загрузить новое изображение
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">
                        <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="reviews" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Отзывы</CardTitle>
                      <CardDescription>Управляйте отзывами, отображаемыми на главной странице</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reviewsData.map((review) => (
                          <div key={review.id} className="flex items-start gap-4 rounded-lg border p-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{review.name}</h3>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{review.text}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`review-${review.id}`}
                                  checked={review.isActive}
                                  onCheckedChange={() => toggleReviewStatus(review.id)}
                                />
                                <Label htmlFor={`review-${review.id}`} className="text-sm">
                                  Отображать
                                </Label>
                              </div>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">
                        <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Настройки магазина</h1>

              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">Основные</TabsTrigger>
                  <TabsTrigger value="payment">Оплата</TabsTrigger>
                  <TabsTrigger value="delivery">Доставка</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Основные настройки</CardTitle>
                      <CardDescription>Настройте основную информацию о вашем магазине</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Название магазина</Label>
                        <Input id="store-name" defaultValue="КожаМастер" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-description">Описание магазина</Label>
                        <Textarea
                          id="store-description"
                          rows={3}
                          defaultValue="Магазин кожаных изделий ручной работы: кошельки, сумки, ремни и аксессуары из натуральной кожи."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-email">Email для связи</Label>
                        <Input id="store-email" type="email" defaultValue="info@kozhamaster.ru" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-phone">Телефон</Label>
                        <Input id="store-phone" defaultValue="+7 (999) 123-45-67" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-address">Адрес</Label>
                        <Input id="store-address" defaultValue="Москва, ул. Кожевническая, 7" />
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="maintenance-mode">Режим обслуживания</Label>
                            <p className="text-sm text-muted-foreground">
                              Когда режим обслуживания включен, сайт будет недоступен для посетителей
                            </p>
                          </div>
                          <div className="ml-auto">
                            <Switch
                              id="maintenance-mode"
                              checked={maintenanceMode}
                              onCheckedChange={setMaintenanceMode}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">
                        <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Настройки оплаты</CardTitle>
                      <CardDescription>Настройте способы оплаты для вашего магазина</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="payment-cash" defaultChecked />
                          <Label htmlFor="payment-cash">Наличные при получении</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="payment-card" defaultChecked />
                          <Label htmlFor="payment-card">Банковская карта при получении</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="payment-online" defaultChecked />
                          <Label htmlFor="payment-online">Онлайн-оплата</Label>
                        </div>
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-medium mb-4">Настройки онлайн-оплаты</h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="payment-api-key">API ключ платежной системы</Label>
                            <Input id="payment-api-key" type="password" defaultValue="sk_test_example123456" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-merchant-id">ID продавца</Label>
                            <Input id="payment-merchant-id" defaultValue="merchant_12345" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-success-url">URL успешной оплаты</Label>
                            <Input id="payment-success-url" defaultValue="https://kozhamaster.ru/payment/success" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-cancel-url">URL отмены оплаты</Label>
                            <Input id="payment-cancel-url" defaultValue="https://kozhamaster.ru/payment/cancel" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">
                        <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="delivery" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Настройки доставки</CardTitle>
                      <CardDescription>Настройте способы доставки для вашего магазина</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="delivery-pickup" defaultChecked />
                            <Label htmlFor="delivery-pickup">Самовывоз</Label>
                          </div>
                          <Input className="w-24" defaultValue="0" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="delivery-courier" defaultChecked />
                            <Label htmlFor="delivery-courier">Курьерская доставка</Label>
                          </div>
                          <Input className="w-24" defaultValue="300" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="delivery-post" defaultChecked />
                            <Label htmlFor="delivery-post">Почта России</Label>
                          </div>
                          <Input className="w-24" defaultValue="250" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="delivery-cdek" defaultChecked />
                            <Label htmlFor="delivery-cdek">СДЭК</Label>
                          </div>
                          <Input className="w-24" defaultValue="400" />
                        </div>
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-medium mb-4">Дополнительные настройки</h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="free-shipping-threshold">Бесплатная доставка от суммы (₽)</Label>
                            <Input id="free-shipping-threshold" defaultValue="5000" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="delivery-time">Среднее время доставки (дни)</Label>
                            <Input id="delivery-time" defaultValue="3-5" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pickup-address">Адрес самовывоза</Label>
                            <Textarea
                              id="pickup-address"
                              rows={2}
                              defaultValue="Москва, ул. Кожевническая, 7, офис 504"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">
                        <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

