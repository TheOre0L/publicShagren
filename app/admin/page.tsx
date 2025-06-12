"use client";

import { CardFooter } from "@/components/ui/card";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { message } from "antd";
import Link from "next/link";
import {
  BarChart3,
  Home,
  Package,
  Settings,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  Star,
  CheckCircle,
  X,
} from "lucide-react";
import "easymde/dist/easymde.min.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/header";
import $api, { API_URL } from "@/http/requests";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useAuth } from "@/http/isAuth";
import { redirect } from "next/navigation";
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
  {
    id: 5,
    name: "Ольга М.",
    rating: 3,
    text: "Сумка хорошая, но есть небольшие недочеты в швах.",
    isActive: false,
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hoverIndex, setHoverIndex] = useState(null);
  const [statusOrderFilter, setStatusOrderFilter] = useState("succeeded");
  const [materoalModalOpen, setMaterialModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [editItemId, setEditItemId] = useState(null);
  const [attributesTab, setAttributesTab] = useState("categories");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [homepageData, setHomepageData] = useState(null);
  const [reviewsData, setReviewsData] = useState(reviews);
  const [isLoadingg, setIsLoading] = useState(true);
  // Add these state variables after the existing state declarations (around line 90)
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
  const [deleteCustomerModalOpen, setDeleteCustomerModalOpen] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [testPayMode, setTestPayMode] = useState(false);
  const [image, setImages] = useState<File[]>([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedRecomendProducts, setRecomendProduct] = useState([]);
  const [findProduct, setFindProduct] = useState([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputReff = useRef<HTMLInputElement>(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [productParam, setproductParam] = useState<any>({
    categoryes: [{}],
    colors: [{}],
    types: [{}],
    materials: [{}],
  });
  const [product, setProduct] = useState({
    id: "",
    longDescription: "",
    title: "",
    price: 0,
    description: "",
    images: image,
    thumbnails: image,
    materialid: "",
    categoryid: "",
    typeid: "",
    count: 0,
    isNew: false,
    isBestseller: false,
    sku: "",
    features: [],
    dimensions: "",
    weight: "",
    colors: [],
    relatedProducts: selectedRecomendProducts,
  });
  const { isAuth, isAccept, isLoading } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    const uniqueFile = new File([file], `home_${crypto.randomUUID()}`, {
      type: file.type,
    });
    formData.append("file", uniqueFile);
    try {
      const response = await $api.post(`${API_URL}/upload`, formData);
      setHomepageData((prev) => ({
        ...prev,
        imageTitle: response.data.filePath, // путь к файлу на сервере
      }));
      messageApi.success("Файл загружен");
    } catch (error) {
      messageApi.error(`Ошибка при загрузке: ${error}`);
    }
  };

  const handleFileUploadAmout = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    const uniqueFile = new File([file], `about_${crypto.randomUUID()}`, {
      type: file.type,
    });
    formData.append("file", uniqueFile);
    try {
      const response = await $api.post(`${API_URL}/upload`, formData);
      setHomepageData((prev) => ({
        ...prev,
        imageAbout: response.data.filePath, // путь к файлу на сервере
      }));
      messageApi.success("Файл загружен");
    } catch (error) {
      messageApi.error(`Ошибка при загрузке: ${error}`);
    }
  };

  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    string[]
  >([]);
  // Обработчик выбора файлов
  const getStatusBadge = (status, isPay?: boolean) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
          >
            В обработке
          </Badge>
        );
      case "succeeded":
        return (
          <Badge
            variant="outline"
            className="bg-lime-50 text-lime-400 hover:bg-lime-50 border-lime-200"
          >
            {isPay ? "Оплачен" : "Принят в работу"}
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
          >
            Отправлен
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
          >
            Доставлен
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
          >
            Отменен
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    setImages((prevImages) => {
      const updatedImages = Array.from(prevImages);
      const [movedImage] = updatedImages.splice(result.source.index, 1);
      updatedImages.splice(result.destination.index, 0, movedImage);
      return updatedImages;
    });
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    document.getElementById("file-upload")?.click();
  };

  function searchProducts(query: string) {
    $api
      .get(`${API_URL}/products?action=search&query=${query}`)
      .then((res) => {
        if (query === "") {
          return setFindProduct([]);
        }
        setFindProduct(res.data);
      })
      .catch();
  }

  useEffect(() => {}, [findProduct]);
  useEffect(() => {
    searchProducts(searchProduct);
  }, [searchProduct]);

  const handleChangeFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (!event.target.files) return;

      const files = Array.from(event.target.files);
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          const uniqueFile = new File(
            [file],
            `product_${crypto.randomUUID()}`,
            { type: file.type }
          );
          formData.append("file", uniqueFile);

          const { data } = await $api.post("/upload", formData);
          return {
            id: crypto.randomUUID(),
            alt: `Картинка: ${data.filePath}`,
            file: `${data.filePath}`,
          };
        })
      );

      setImages((prevImages) => [...prevImages, ...uploadedImages]);
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
        thumbnails: [...prev.images, ...uploadedImages],
      }));
    } catch (e) {
      console.error("Ошибка загрузки файла:", e);
    }
  };

  useEffect(() => {
    console.log(product);
  }, [selectedRelatedProducts]);

  useEffect(() => {
    document.body.style.overflow = productModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [productModalOpen]);

  useEffect(() => {
    // if(!isAccept) {setIsLoading(false); return  }
    setIsLoading(true);

    Promise.all([
      $api.get(`${API_URL}/category-product?action=all`),
      $api.get(`${API_URL}/type-product?action=all`),
      $api.get(`${API_URL}/products/color`),
      $api.get(`${API_URL}/products/material`),
      $api.get(`${API_URL}/orders`),
      $api.get(`${API_URL}/products?action=all&page=1&limit=1000`),
      $api.get(`${API_URL}/orders/stats`),
      $api.get(`${API_URL}/home`),
    ])
      .then(
        ([
          categoriesRes,
          typesRes,
          colorsRes,
          materialRes,
          order,
          products,
          stats,
          home,
        ]) => {
          setproductParam((prev) => ({
            ...prev,
            categoryes: categoriesRes.data,
            types: typesRes.data,
            colors: colorsRes.data,
            materials: materialRes.data,
          }));
          setStats(stats.data);
          setProducts(products.data.products);
          setOrders(order.data);
          setHomepageData(home.data);
        }
      )
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1400);
      });
  }, []);

  const filteredOrders = statusOrderFilter
    ? orders.filter((order) => order.status === statusOrderFilter)
    : orders;

  if (isLoadingg || isLoading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  // Function to toggle review active status
  const toggleReviewStatus = (id) => {
    setReviewsData(
      reviewsData.map((review) =>
        review.id === id ? { ...review, isActive: !review.isActive } : review
      )
    );
  };
  const addRelatedProduct = (productId) => {
    if (!selectedRelatedProducts.includes(productId)) {
      const updatedProducts = [...selectedRelatedProducts, productId];
      setSelectedRelatedProducts(updatedProducts);
      setProduct((prev) => ({ ...prev, relatedProducts: updatedProducts }));
    }
  };

  const removeRelatedProduct = (productId) => {
    const updatedProducts = selectedRelatedProducts.filter(
      (id) => id !== productId
    );
    setSelectedRelatedProducts(updatedProducts);
    setProduct((prev) => ({ ...prev, relatedProducts: updatedProducts }));
  };

  // Chart component (simplified for this example)
  const SalesChart = ({ data }) => (
    <div className="h-[800px] w-full">
      <div className="flex h-full items-end gap-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative flex h-full w-full flex-col justify-end cursor-pointer"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div className="flex gap-1 pb-2">
              <div
                className="h-32 w-full rounded-md bg-orange-500 mb-5"
                style={{ height: `${item.totalSales * 20}px` }}
              ></div>
            </div>

            {/* Tooltip */}
            {hoverIndex === index && (
              <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white"
                style={{ whiteSpace: "nowrap" }}
              >
                {item.totalSales}
              </div>
            )}

            <span className="absolute bottom-0 left-0 right-0 text-center text-xs">
              {item.categoryTitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
  // Add these functions before the return statement
  const handleDeleteProduct = (id) => {
    setDeleteProductId(id);
    setDeleteProductModalOpen(true);
  };

  const handleDeleteCustomer = (id) => {
    setDeleteCustomerId(id);
    setDeleteCustomerModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    // Here you would add the actual delete logic
    console.log(`Deleting product with ID: ${deleteProductId}`);
    setDeleteProductModalOpen(false);
  };

  const confirmDeleteCustomer = () => {
    // Here you would add the actual delete logic
    console.log(`Deleting customer with ID: ${deleteCustomerId}`);
    setDeleteCustomerModalOpen(false);
  };

  if (!isAccept) {
    redirect("/forbidden");
  }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      {/* Sidebar */}

      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                src="https://i.imgur.com/NrS9R03.png"
                alt="Логотип"
                width={120}
                height={32}
              />
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
                  activeTab === "orders"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <Users className="h-4 w-4" />
                Заказы
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
                } disabled:opacity-30`}
                onClick={() => setActiveTab("settings")}
                disabled
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
        <Header isAuth isAdminPage />
        {contextHolder}
        {/* Dashboard Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-bold">Панель управления</h1>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Общая выручка
                    </CardTitle>
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
                    <div className="text-2xl font-bold">
                      {stats.totalRevenue} ₽
                    </div>
                    <p className="text-sm text-slate-400">за месяц </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Заказы
                    </CardTitle>
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
                    <div className="text-2xl font-bold">
                      {stats.totalOrders}
                    </div>
                    <p className="text-sm text-slate-400">за месяц </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Средний чек
                    </CardTitle>
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
                    <div className="text-2xl font-bold">
                      {stats.averageCheck} ₽
                    </div>
                    <p className="text-sm text-slate-400">за месяц </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Статистика продаж</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SalesChart data={stats.result} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Популярные товары</CardTitle>
                    <CardDescription>
                      Топ-5 самых продаваемых товаров
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded">
                            <Image
                              src={
                                `${API_URL}/uploads/${product.images[0]?.file}` ||
                                "/placeholder.svg"
                              }
                              alt={`${product.images[0]?.alt}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {product.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {product.category.title}
                            </p>
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
            <>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between ">
                  <h1 className="text-2xl font-bold">Управление товарами</h1>
                  <Dialog
                    open={productModalOpen}
                    onOpenChange={setProductModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="bg-amber-600"
                        onClick={() => setSelectedProduct(null)}
                      >
                        <Plus className="mr-2 h-4 w-4 " /> Добавить товар
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedProduct
                            ? "Редактировать товар"
                            : "Добавить новый товар"}
                        </DialogTitle>
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
                            <div className="relative overflow-hidden border-white rounded border">
                              <div>
                                {/* Скрытый input */}
                                <input
                                  id="file-upload"
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleChangeFile}
                                />

                                {/* Кнопка выбора файлов */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={openFileDialog}
                                >
                                  <Upload className="mr-2 h-4 w-4" /> Выбрать
                                  файлы
                                </Button>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                  {image.length > 0 && (
                                    <Droppable
                                      isDropDisabled={false}
                                      isCombineEnabled={true}
                                      ignoreContainerClipping={false}
                                      droppableId="thumbnails"
                                      direction="horizontal"
                                    >
                                      {(provided) => (
                                        <div
                                          className="flex flex-wrap"
                                          {...provided.droppableProps}
                                          ref={provided.innerRef}
                                        >
                                          {image.map((img, index) => (
                                            <Draggable
                                              key={img.id}
                                              draggableId={String(img.id)}
                                              index={index}
                                            >
                                              {(provided) => (
                                                <div
                                                  className="relative m-2"
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                >
                                                  <img
                                                    className="w-20 h-20 object-cover rounded"
                                                    src={`${API_URL}/uploads/${img.file}`}
                                                    alt={img.alt}
                                                  />
                                                  <button
                                                    onClick={() =>
                                                      handleDeleteImage(index)
                                                    }
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                  >
                                                    &times;
                                                  </button>
                                                </div>
                                              )}
                                            </Draggable>
                                          ))}
                                          {provided.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                  )}
                                </DragDropContext>
                              </div>
                            </div>
                          </div>
                        </div>
                        <br></br>
                        <div>
                          {/* Артикул товара */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label htmlFor="product-sku" className="text-right">
                              Артикул товара
                            </Label>
                            <Input
                              id="product-sku"
                              value={product.sku}
                              onChange={(e) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  sku: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>

                          {/* Название */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-name"
                              className="text-right"
                            >
                              Название
                            </Label>
                            <Input
                              id="product-name"
                              value={product.title}
                              onChange={(e) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>

                          {/* Категория */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-category"
                              className="text-right"
                            >
                              Категория
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  categoryid: value,
                                }))
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Выберите категорию" />
                              </SelectTrigger>
                              <SelectContent>
                                {productParam.categoryes?.map((category) => (
                                  <SelectItem
                                    value={`${category.id}`}
                                    key={category.id}
                                  >
                                    {category.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {/* Тип */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-type"
                              className="text-right"
                            >
                              Тип
                            </Label>
                            <Select
                              defaultValue={product.typeid}
                              onValueChange={(value) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  typeid: value,
                                }))
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Выберите тип" />
                              </SelectTrigger>
                              <SelectContent>
                                {productParam.types?.map((type) => (
                                  <SelectItem
                                    value={`${type.id}`}
                                    key={type.id}
                                  >
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {/* Цвет */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-color"
                              className="text-right"
                            >
                              Цвет
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  colors: { connect: [{ id: value }] },
                                }))
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Выберите цвет" />
                              </SelectTrigger>
                              <SelectContent>
                                {productParam.colors?.map((color) => (
                                  <SelectItem
                                    value={`${color.id}`}
                                    key={color.id}
                                  >
                                    {color.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {/* Категория */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-material"
                              className="text-right"
                            >
                              Материал
                            </Label>
                            <Select
                              value={product.materialid} // Use the current value of materialid
                              onValueChange={(value) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  materialid: value,
                                }))
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Выберите материал" />
                              </SelectTrigger>
                              <SelectContent>
                                {productParam.materials?.map((material) => (
                                  <SelectItem
                                    value={`${material.id}`}
                                    key={material.id}
                                  >
                                    {material.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Цена */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-price"
                              className="text-right"
                            >
                              Цена
                            </Label>
                            <Input
                              id="product-price"
                              min={0}
                              value={product.price}
                              onChange={(e) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  price: parseFloat(e.target.value),
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>

                          {/* Количество */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-stock"
                              className="text-right"
                            >
                              Количество (в наличии)
                            </Label>
                            <Input
                              id="product-stock"
                              type="number"
                              min={0}
                              value={product.count}
                              onChange={(e) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  count: parseFloat(e.target.value),
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>

                          {/* Короткое описание */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-description"
                              className="text-right"
                            >
                              Короткое описание
                            </Label>
                            <Input
                              id="product-description"
                              value={product.description}
                              onChange={(e) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>

                          {/* Подробное описание */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-weight"
                              className="text-right"
                            >
                              Полное описание
                            </Label>
                            <Textarea
                              id="product-weight"
                              value={product.longDescription}
                              onChange={(e) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  longDescription: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>

                          {/* Особенности */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-features"
                              className="text-right"
                            >
                              Особенности
                            </Label>
                            <Input
                              id="product-features"
                              value={product.features}
                              onChange={(e) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  features: e.target.value.split(","),
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>

                          {/* Размеры */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-dimensions"
                              className="text-right"
                            >
                              Размеры
                            </Label>
                            <Input
                              id="product-dimensions"
                              value={product.dimensions}
                              onChange={(e) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  dimensions: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>

                          {/* Вес */}
                          <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label
                              htmlFor="product-weight"
                              className="text-right"
                            >
                              Вес
                            </Label>
                            <Input
                              id="product-weight"
                              value={product.weight}
                              onChange={(e) =>
                                setProduct((prev) => ({
                                  ...prev,
                                  weight: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>

                          <div className="grid grid-cols-4 items-start gap-4 mt-4">
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
                                    value={searchProduct}
                                    onChange={(e) => {
                                      setSearchProduct(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Selected Related Products */}
                              <div className="space-y-2">
                                <Label className="text-sm">
                                  Выбранные товары (
                                  {selectedRelatedProducts.length})
                                </Label>
                                <div className="border rounded-md p-2 min-h-[100px] max-h-[200px] overflow-y-auto">
                                  {selectedRelatedProducts.length > 0 ? (
                                    <div className="space-y-2">
                                      {products
                                        .filter((p) =>
                                          selectedRelatedProducts.includes(p.id)
                                        )
                                        .map((product) => (
                                          <div
                                            key={product.id}
                                            className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="relative h-8 w-8 overflow-hidden rounded">
                                                <Image
                                                  src={
                                                    `${API_URL}/uploads/${product?.images[0]?.file}` ||
                                                    "/placeholder.svg"
                                                  }
                                                  alt={`${product?.images[0]?.alt}`}
                                                  fill
                                                  className="object-cover"
                                                />
                                              </div>
                                              <span className="text-sm font-medium">
                                                {product.title}
                                              </span>
                                            </div>

                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7"
                                              onClick={() =>
                                                removeRelatedProduct(product.id)
                                              }
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
                                <Label className="text-sm">
                                  Результаты поиска
                                </Label>
                                <div className="border rounded-md p-2 min-h-[150px] max-h-[250px] overflow-y-auto">
                                  {findProduct.length > 0 ? (
                                    <div className="space-y-2">
                                      {findProduct.map((product) => (
                                        <div
                                          key={product?.id}
                                          className="flex items-center justify-between gap-2 p-2 hover:bg-muted/50 rounded-md"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="relative h-8 w-8 overflow-hidden rounded">
                                              <Image
                                                src={
                                                  `${API_URL}/uploads/${product?.images[0]?.file}` ||
                                                  "/placeholder.svg"
                                                }
                                                alt={`${product?.images[0]?.alt}`}
                                                fill
                                                className="object-cover"
                                              />
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-sm font-medium">
                                                {product?.title}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                {product?.type?.name} •{" "}
                                                {product?.category?.title}
                                              </span>
                                            </div>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7"
                                            onClick={() =>
                                              addRelatedProduct(product?.id)
                                            }
                                            disabled={selectedRelatedProducts.includes(
                                              product?.id
                                            )}
                                          >
                                            {selectedRelatedProducts.includes(
                                              product?.id
                                            ) ? (
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
                                      {searchProduct
                                        ? "Ничего не найдено"
                                        : "Начните поиск товаров"}
                                    </div>
                                  )}
                                </div>
                                {/* Переключатели */}
                                <div className="grid grid-cols-4 items-center gap-4 mt-2">
                                  <Label
                                    htmlFor="product-new"
                                    className="text-right"
                                  >
                                    Новый товар
                                  </Label>
                                  <Switch
                                    id="product-new"
                                    checked={product.isNew}
                                    onCheckedChange={(value) =>
                                      setProduct((prev) => ({
                                        ...prev,
                                        isNew: value,
                                      }))
                                    }
                                  />
                                  <Label
                                    htmlFor="product-bestseller"
                                    className="text-right"
                                  >
                                    Хит продаж
                                  </Label>
                                  <Switch
                                    id="product-bestseller"
                                    checked={product.isBestseller}
                                    onCheckedChange={(value) =>
                                      setProduct((prev) => ({
                                        ...prev,
                                        isBestseller: value,
                                      }))
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setProductModalOpen(false)}
                        >
                          Отмена
                        </Button>
                        <Button
                          className="bg-amber-600"
                          onClick={() => {
                            if (!selectedProduct) {
                              $api
                                .post(`${API_URL}/products`, product)
                                .then((res) => {
                                  messageApi.success(
                                    `${res.data.alert.message}`
                                  );
                                  setProductModalOpen(false);
                                })
                                .catch((err) => {
                                  messageApi.error(`${err}`);
                                });
                            }
                            if (selectedProduct) {
                              $api
                                .patch(
                                  `${API_URL}/products?productId=${selectedProduct?.id}`,
                                  {
                                    longDescription: product.longDescription,
                                    title: product.title,
                                    price: product.price,
                                    description: product.description,
                                    images: product.images,
                                    thumbnails: product.images,
                                    materialid: product.materialid,
                                    categoryid: product.categoryid,
                                    typeid: product.typeid,
                                    count: product.count,
                                    isNew: product.isNew,
                                    isBestseller: product.isBestseller,
                                    sku: product.sku,
                                    features: product.features,
                                    dimensions: product.dimensions,
                                    weight: product.weight,
                                    colors: {
                                      connect: [{ id: product.colors[0].id }],
                                    },
                                    relatedProducts: product.relatedProducts,
                                  }
                                )
                                .then((res) => {
                                  messageApi.success(
                                    `Продукт успешно обновлен`
                                  );
                                  setProductModalOpen(false);
                                })
                                .catch((err) => {
                                  messageApi.error(`${err}`);
                                });
                            }
                          }}
                        >
                          {selectedProduct ? "Сохранить" : "Добавить"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Tabs defaultValue="products" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="products">Товары</TabsTrigger>
                    <TabsTrigger value="attributes">Атрибуты</TabsTrigger>
                  </TabsList>

                  <TabsContent value="products" className="space-y-4 pt-4">
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
                            <TableHead className="text-right">
                              Действия
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">
                                {product.id}
                              </TableCell>
                              <TableCell>
                                <div className="relative h-10 w-10 overflow-hidden rounded">
                                  <Image
                                    src={
                                      `${API_URL}/uploads/${product?.images[0]?.file}` ||
                                      "/placeholder.svg"
                                    }
                                    alt={`${product?.images[0]?.alt}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>{product.title}</TableCell>
                              <TableCell>{product.category.title}</TableCell>
                              <TableCell>{product.price}</TableCell>
                              <TableCell>{product.count}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      setProduct(product);
                                      setSelectedProduct(product);
                                      setImages([...product.images]);
                                      setSelectedRelatedProducts(
                                        product.relatedProducts
                                      );
                                      console.log(selectedProduct);
                                      setProductModalOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">
                                      Редактировать
                                    </span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="attributes" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Управление атрибутами товаров</CardTitle>
                        <CardDescription>
                          Управляйте категориями, типами и цветами товаров
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs
                          value={attributesTab}
                          onValueChange={setAttributesTab}
                        >
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="categories">
                              Категории
                            </TabsTrigger>
                            <TabsTrigger value="types">Типы</TabsTrigger>
                            <TabsTrigger value="colors">Цвета</TabsTrigger>
                            <TabsTrigger value="materials">
                              Материал
                            </TabsTrigger>
                          </TabsList>

                          {/* Категории */}
                          <TabsContent
                            value="categories"
                            className="space-y-4 pt-4"
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                Список категорий
                              </h3>
                              <Dialog
                                open={categoryModalOpen}
                                onOpenChange={setCategoryModalOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="bg-amber-600"
                                    onClick={() => {
                                      setEditItemId(null);
                                      setNewCategoryName("");
                                      setCategoryModalOpen(true);
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" /> Добавить
                                    категорию
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {editItemId
                                        ? "Редактировать"
                                        : "Добавить"}
                                    </DialogTitle>
                                    <DialogDescription>
                                      {editItemId
                                        ? "Измените информацию и нажмите Сохранить"
                                        : "Заполните информацию и нажмите Добавить"}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-4 items-center gap-4 mt-2">
                                    <Label
                                      htmlFor="product-name"
                                      className="text-right"
                                    >
                                      Название категории
                                    </Label>
                                    <Input
                                      id="product-name"
                                      value={newCategoryName}
                                      onChange={(e) =>
                                        setNewCategoryName(e.target.value)
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setCategoryModalOpen(false)
                                      }
                                    >
                                      Отмена
                                    </Button>
                                    <Button
                                      className="bg-amber-600"
                                      onClick={() => {
                                        if (!editItemId) {
                                          $api
                                            .post(
                                              `${API_URL}/category-product`,
                                              {
                                                title: newCategoryName,
                                              }
                                            )
                                            .then(() =>
                                              setCategoryModalOpen(false)
                                            );
                                        } else {
                                          $api
                                            .patch(
                                              `${API_URL}/category-product?categoryId=${editItemId}`,
                                              {
                                                title: newCategoryName,
                                              }
                                            )
                                            .then(() =>
                                              setCategoryModalOpen(false)
                                            );
                                        }
                                      }}
                                    >
                                      {editItemId ? "Сохранить" : "Добавить"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>

                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[400px]">
                                      ID
                                    </TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead className="text-right">
                                      Действия
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {productParam.categoryes?.map((category) => (
                                    <TableRow key={category.id}>
                                      <TableCell className="font-medium">
                                        {category.id}
                                      </TableCell>
                                      <TableCell>{category.title}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              setEditItemId(category.id);
                                              setNewCategoryName(
                                                category.title
                                              );
                                              setCategoryModalOpen(true);
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">
                                              Редактировать
                                            </span>
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              if (
                                                confirm(
                                                  `Вы уверены, что хотите удалить категорию "${category.title}"?`
                                                )
                                              ) {
                                                setproductParam((prev) => ({
                                                  ...prev,
                                                  productParam: {
                                                    ...prev.productParam,
                                                    categoryes:
                                                      prev.productParam.categoryes?.filter(
                                                        (c) =>
                                                          c.id !== category.id
                                                      ) || [],
                                                  },
                                                }));
                                              }
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                              Удалить
                                            </span>
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TabsContent>

                          {/* Типы */}
                          <TabsContent value="types" className="space-y-4 pt-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                Список типов
                              </h3>
                              <Dialog
                                open={typeModalOpen}
                                onOpenChange={setTypeModalOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="bg-amber-600"
                                    onClick={() => {
                                      setEditItemId(null);
                                      setNewTypeName("");
                                      setTypeModalOpen(true);
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" /> Добавить
                                    тип
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {editItemId
                                        ? "Редактировать"
                                        : "Добавить"}
                                    </DialogTitle>
                                    <DialogDescription>
                                      {editItemId
                                        ? "Измените информацию и нажмите Сохранить"
                                        : "Заполните информацию и нажмите Добавить"}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-4 items-center gap-4 mt-2">
                                    <Label
                                      htmlFor="product-name"
                                      className="text-right"
                                    >
                                      Название типа
                                    </Label>
                                    <Input
                                      id="product-name"
                                      value={newTypeName}
                                      onChange={(e) =>
                                        setNewTypeName(e.target.value)
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setEditItemId(null);
                                        setTypeModalOpen(false);
                                      }}
                                    >
                                      Отмена
                                    </Button>
                                    <Button
                                      className="bg-amber-600"
                                      onClick={() => {
                                        if (!editItemId) {
                                          $api
                                            .post(`${API_URL}/type-product`, {
                                              name: newTypeName,
                                            })
                                            .then(() =>
                                              setTypeModalOpen(false)
                                            );
                                        } else {
                                          $api
                                            .patch(
                                              `${API_URL}/type-product?typeId=${editItemId}`,
                                              {
                                                name: newTypeName,
                                              }
                                            )
                                            .then(() =>
                                              setTypeModalOpen(false)
                                            );
                                        }
                                      }}
                                    >
                                      {editItemId ? "Сохранить" : "Добавить"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>

                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[400px]">
                                      ID
                                    </TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead className="text-right">
                                      Действия
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {productParam.types?.map((type) => (
                                    <TableRow key={type.id}>
                                      <TableCell className="font-medium">
                                        {type.id}
                                      </TableCell>
                                      <TableCell>{type.name}</TableCell>

                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              setEditItemId(type.id);
                                              setNewTypeName(type.name);
                                              setTypeModalOpen(true);
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">
                                              Редактировать
                                            </span>
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              if (
                                                confirm(
                                                  `Вы уверены, что хотите удалить тип "${type.name}"?`
                                                )
                                              ) {
                                                setproductParam((prev) => ({
                                                  ...prev,
                                                  productParam: {
                                                    ...prev.productParam,
                                                    types:
                                                      prev.productParam.types?.filter(
                                                        (t) => t.id !== type.id
                                                      ) || [],
                                                  },
                                                }));
                                              }
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                              Удалить
                                            </span>
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TabsContent>

                          {/* Цвета */}
                          <TabsContent
                            value="colors"
                            className="space-y-4 pt-4"
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                Список цветов
                              </h3>
                              <Dialog
                                open={colorModalOpen}
                                onOpenChange={setColorModalOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="bg-amber-600"
                                    onClick={() => {
                                      setEditItemId(null);
                                      setNewTypeName("");
                                      setTypeModalOpen(true);
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" /> Добавить
                                    цвет
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  onMouseDown={(e) => e.stopPropagation()} // Остановить всплытие клика
                                  onOpenAutoFocus={(e) => e.preventDefault()} // Предотвращает фокусировку модалки
                                  className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto"
                                >
                                  <DialogHeader>
                                    <DialogTitle>
                                      {editItemId
                                        ? "Редактировать"
                                        : "Добавить"}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="grid grid-cols-4 items-center gap-4 mt-2">
                                    <Label
                                      htmlFor="product-name"
                                      className="text-right"
                                    >
                                      Название цвета
                                    </Label>
                                    <Input
                                      id="product-name"
                                      value={newColorName}
                                      onChange={(e) =>
                                        setNewColorName(e.target.value)
                                      }
                                      className="col-span-3"
                                    />
                                    <Label className="text-right">Цвет</Label>
                                    <div
                                      onMouseDown={(e) => e.stopPropagation()}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Input
                                        type="color"
                                        value={newColorHex}
                                        onChange={(e) => {
                                          setNewColorHex(e.target.value);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setColorModalOpen(false)}
                                    >
                                      Отмена
                                    </Button>
                                    <Button
                                      disabled={
                                        newColorName.length > 1 ? false : true
                                      }
                                      className="bg-amber-600"
                                      onClick={() => {
                                        if (!editItemId) {
                                          $api
                                            .post(`${API_URL}/products/color`, {
                                              name: newColorName,
                                              rgb: newColorHex,
                                            })
                                            .then(() =>
                                              setColorModalOpen(false)
                                            );
                                        } else {
                                          $api
                                            .patch(
                                              `${API_URL}/products/color-edit?id=${editItemId}`,
                                              {
                                                name: newColorName,
                                                rgb: newColorHex,
                                              }
                                            )
                                            .then(() =>
                                              setColorModalOpen(false)
                                            );
                                        }
                                      }}
                                    >
                                      {editItemId ? "Сохранить" : "Добавить"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>

                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[40 0px]">
                                      ID
                                    </TableHead>
                                    <TableHead className="w-[80px]">
                                      Цвет
                                    </TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead>Код цвета</TableHead>
                                    <TableHead className="text-right">
                                      Действия
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {productParam.colors?.map((color) => (
                                    <TableRow key={color.id}>
                                      <TableCell className="font-medium">
                                        {color.id}
                                      </TableCell>
                                      <TableCell>
                                        <div
                                          className="h-6 w-6 rounded-full border"
                                          style={{ backgroundColor: color.rgb }}
                                        />
                                      </TableCell>
                                      <TableCell>{color.name}</TableCell>
                                      <TableCell>{color.rgb}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              setEditItemId(color.id);
                                              setNewColorName(color.name);
                                              setNewColorHex(color.hex);
                                              setColorModalOpen(true);
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">
                                              Редактировать
                                            </span>
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              if (
                                                confirm(
                                                  `Вы уверены, что хотите удалить цвет "${color.name}"?`
                                                )
                                              ) {
                                                setproductParam((prev) => ({
                                                  ...prev,
                                                  productParam: {
                                                    ...prev.productParam,
                                                    colors:
                                                      prev.productParam.colors?.filter(
                                                        (c) => c.id !== color.id
                                                      ) || [],
                                                  },
                                                }));
                                              }
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                              Удалить
                                            </span>
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TabsContent>
                          <TabsContent
                            value="materials"
                            className="space-y-4 pt-4"
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                Список материалов
                              </h3>
                              <Dialog
                                open={materoalModalOpen}
                                onOpenChange={setMaterialModalOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="bg-amber-600"
                                    onClick={() => {
                                      setEditItemId(null);
                                      setNewMaterialName("");
                                      setMaterialModalOpen(true);
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" /> Добавить
                                    материал
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {editItemId
                                        ? "Редактировать"
                                        : "Добавить"}
                                    </DialogTitle>
                                    <DialogDescription>
                                      {editItemId
                                        ? "Измените информацию и нажмите Сохранить"
                                        : "Заполните информацию и нажмите Добавить"}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-4 items-center gap-4 mt-2">
                                    <Label
                                      htmlFor="product-name"
                                      className="text-right"
                                    >
                                      Название материала
                                    </Label>
                                    <Input
                                      id="product-name"
                                      value={newMaterialName}
                                      onChange={(e) =>
                                        setNewMaterialName(e.target.value)
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setMaterialModalOpen(false)
                                      }
                                    >
                                      Отмена
                                    </Button>
                                    <Button
                                      className="bg-amber-600"
                                      onClick={() => {
                                        if (!editItemId) {
                                          $api
                                            .post(
                                              `${API_URL}/products/material-add`,
                                              {
                                                name: newMaterialName,
                                              }
                                            )
                                            .then(() =>
                                              setMaterialModalOpen(false)
                                            );
                                        } else {
                                          $api
                                            .patch(
                                              `${API_URL}/products/material-edit?id=${editItemId}`,
                                              {
                                                name: newMaterialName,
                                              }
                                            )
                                            .then(() =>
                                              setMaterialModalOpen(false)
                                            );
                                        }
                                      }}
                                    >
                                      {editItemId ? "Сохранить" : "Добавить"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>

                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[400px]">
                                      ID
                                    </TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead className="text-right">
                                      Действия
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {productParam.materials?.map((material) => (
                                    <TableRow key={material.id}>
                                      <TableCell className="font-medium">
                                        {material.id}
                                      </TableCell>
                                      <TableCell>{material.name}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              setEditItemId(material.id);
                                              setNewMaterialName(material.name);
                                              setMaterialModalOpen(true);
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">
                                              Редактировать
                                            </span>
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              if (
                                                confirm(
                                                  `Вы уверены, что хотите удалить категорию "${category.title}"?`
                                                )
                                              ) {
                                                setproductParam((prev) => ({
                                                  ...prev,
                                                  productParam: {
                                                    ...prev.productParam,
                                                    categoryes:
                                                      prev.productParam.categoryes?.filter(
                                                        (c) =>
                                                          c.id !== category.id
                                                      ) || [],
                                                  },
                                                }));
                                              }
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                              Удалить
                                            </span>
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}

          {/* Customers Tab */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Управление заказами</h1>
              </div>
              <div className="flex justify-end gap-2">
                <Label
                  htmlFor="product-category"
                  // className="text-right"
                >
                  Статус заказа
                </Label>
                <Select
                  value={statusOrderFilter}
                  onValueChange={(value) => setStatusOrderFilter(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">В обработке</SelectItem>
                    <SelectItem value="succeeded">Принят в работу</SelectItem>
                    <SelectItem value="shipped">Отправлен</SelectItem>
                    <SelectItem value="delivered">Доставлен</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">ID</TableHead>
                      <TableHead className="w-[500px]">
                        Данные получателя и доставки
                      </TableHead>
                      <TableHead className="w-[600px]">
                        Подробности заказа
                      </TableHead>
                      <TableHead>Подробности оплаты</TableHead>

                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          ФИО: {order.fio || order.delivery?.recipient?.name}{" "}
                          <br />
                          Телефон клиента: {order.phone} <br />
                          Адрес доставки:{" "}
                          {order.delivery
                            ? `г.${order.delivery?.city} ${order.delivery?.toLocation.address}`
                            : "Самовывоз"}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-4 m-2">
                            <h3 className="font-medium">Товары</h3>
                            <div className="space-y-4">
                              {order.orderItems?.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                  <div className="relative w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                                    <Image
                                      src={
                                        `${API_URL}/uploads/${item.product.images[0]?.file}` ||
                                        "/placeholder.svg"
                                      }
                                      alt={item.product.images[0]?.alt}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Link
                                      key={item.product.id}
                                      href={`/product/${item.product.id}`}
                                      className="group"
                                    >
                                      <h4 className="font-medium">
                                        {item.product.title}
                                      </h4>
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                      {item.quantity} x{" "}
                                      {item.product.price.toLocaleString()} ₽
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {(
                                        item.product.price * item.quantity
                                      ).toLocaleString()}{" "}
                                      ₽
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Доставка</span>
                              {order.delivery ? (
                                <span>{order.delivery.deliverySum} ₽</span>
                              ) : (
                                <span>0 ₽</span>
                              )}
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Итого</span>
                              <span>{order.summa.toLocaleString()} ₽</span>
                            </div>
                            <h6>
                              Статус заказа: {getStatusBadge(order.status)}
                            </h6>
                          </div>
                        </TableCell>
                        <TableCell>
                          <h6>
                            Идентификатор платежа (YooKassa):{" "}
                            {order.payment?.yooKassaId}
                          </h6>
                          <h6>
                            Статус оплаты:{" "}
                            {getStatusBadge(order.payment?.status, true)}
                          </h6>{" "}
                          <br />
                        </TableCell>
                        {order.status != "cancelled" && (
                          <>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Label
                                  htmlFor="product-category"
                                  className="text-right"
                                >
                                  Статус заказа
                                </Label>
                                <Select
                                  // defaultValue={}
                                  onValueChange={(value) => {
                                    if (value === "cancelled") {
                                      $api
                                        .delete(
                                          `${API_URL}/orders?orderId=${order.id}`
                                        )
                                        .then()
                                        .catch();
                                    }
                                    if (order.status === "cancelled")
                                      return messageApi.error(
                                        `Заказ #${order.id} отменен, взять его в работу невозможно!`
                                      );
                                    $api
                                      .patch(
                                        `${API_URL}/orders?orderId=${order.id}&status=${value}`
                                      )
                                      .then((res) => {
                                        setOrders(res.data);
                                        messageApi.success(
                                          `Статус заказа #${order.id} установлен как - ${value}`
                                        );
                                      });
                                    // setSelectedStatusOrder(value)
                                  }}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Выберите статус" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      В обработке
                                    </SelectItem>
                                    <SelectItem value="succeeded">
                                      Принять в работу
                                    </SelectItem>
                                    <SelectItem value="shipped">
                                      Отправлен
                                    </SelectItem>
                                    <SelectItem value="delivered">
                                      Доставлен
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                      Отменен
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Delete Product Confirmation Dialog */}
          <Dialog
            open={deleteProductModalOpen}
            onOpenChange={setDeleteProductModalOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogDescription>
                  Вы уверены, что хотите удалить этот товар? Это действие нельзя
                  отменить.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex space-x-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteProductModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button variant="destructive" onClick={confirmDeleteProduct}>
                  Удалить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Customer Confirmation Dialog */}
          <Dialog
            open={deleteCustomerModalOpen}
            onOpenChange={setDeleteCustomerModalOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogDescription>
                  Вы уверены, что хотите удалить этого клиента? Это действие
                  нельзя отменить.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex space-x-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteCustomerModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button variant="destructive" onClick={confirmDeleteCustomer}>
                  Удалить
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
                  <TabsTrigger value="reviews" disabled>
                    Отзывы
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Заголовки и тексты</CardTitle>
                      <CardDescription>
                        Настройте текстовое содержимое главной страницы
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="hero-title">Заголовок баннера</Label>
                        <Input
                          id="hero-title"
                          defaultValue={homepageData.title}
                          onChange={(e) =>
                            setHomepageData({
                              ...homepageData,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hero-subtitle">
                          Подзаголовок баннера
                        </Label>
                        <Input
                          id="hero-subtitle"
                          defaultValue={homepageData.subTitle}
                          onChange={(e) =>
                            setHomepageData({
                              ...homepageData,
                              subTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-title">
                          Заголовок блока "О нас"
                        </Label>
                        <Input
                          id="about-title"
                          defaultValue={homepageData.titleAbout}
                          onChange={(e) =>
                            setHomepageData({
                              ...homepageData,
                              titleAbout: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-text">Текст блока "О нас"</Label>
                        <Textarea
                          id="about-text"
                          rows={5}
                          defaultValue={homepageData.textAbout}
                          onChange={(e) =>
                            setHomepageData({
                              ...homepageData,
                              textAbout: e.target.value,
                            })
                          }
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="ml-auto"
                        onClick={() => {
                          $api.patch(`${API_URL}/home`, homepageData);
                        }}
                      >
                        <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="images" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Изображения</CardTitle>
                      <CardDescription>
                        Загрузите изображения для главной страницы
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Изображение для баннера</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative h-[500px] w-[1200px] overflow-hidden rounded-lg border">
                            <Image
                              src={
                                `${API_URL}/uploads/${homepageData.imageTitle}` ||
                                "/placeholder.svg"
                              }
                              alt="Баннер"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" /> Загрузить новое
                            изображение
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Изображение для блока "О нас"</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative h-[400px] w-[600px] overflow-hidden rounded-md border">
                            <Image
                              src={
                                `${API_URL}/uploads/${homepageData.imageAbout}` ||
                                "/placeholder.svg"
                              }
                              alt="О нас"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => fileInputReff.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" /> Загрузить новое
                            изображение
                          </Button>
                          <input
                            type="file"
                            ref={fileInputReff}
                            className="hidden"
                            onChange={handleFileUploadAmout}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="ml-auto"
                        onClick={() => {
                          $api
                            .patch(`${API_URL}/home`, homepageData)
                            .then(() => {
                              messageApi.success("Новые картинки уже на сайте");
                            });
                        }}
                      >
                        <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="reviews" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Отзывы</CardTitle>
                      <CardDescription>
                        Управляйте отзывами, отображаемыми на главной странице
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reviewsData.map((review) => (
                          <div
                            key={review.id}
                            className="flex items-start gap-4 rounded-lg border p-4"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{review.name}</h3>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-amber-500 text-amber-500"
                                          : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {review.text}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`review-${review.id}`}
                                  checked={review.isActive}
                                  onCheckedChange={() =>
                                    toggleReviewStatus(review.id)
                                  }
                                />
                                <Label
                                  htmlFor={`review-${review.id}`}
                                  className="text-sm"
                                >
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
                      <CardDescription>
                        Настройте основную информацию о вашем магазине
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Название магазина</Label>
                        <Input id="store-name" defaultValue="КожаМастер" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-description">
                          Описание магазина
                        </Label>
                        <Textarea
                          id="store-description"
                          rows={3}
                          defaultValue="Магазин кожаных изделий ручной работы: кошельки, сумки, ремни и аксессуары из натуральной кожи."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-email">Email для связи</Label>
                        <Input
                          id="store-email"
                          type="email"
                          defaultValue="info@kozhamaster.ru"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-phone">Телефон</Label>
                        <Input
                          id="store-phone"
                          defaultValue="+7 (999) 123-45-67"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-address">Адрес</Label>
                        <Input
                          id="store-address"
                          defaultValue="Москва, ул. Кожевническая, 7"
                        />
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="maintenance-mode">
                              Режим обслуживания
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Когда режим обслуживания включен, сайт будет
                              недоступен для посетителей
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
                      <CardDescription>
                        Настройте способы оплаты для вашего магазина
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="payment-cash" defaultChecked />
                          <Label htmlFor="payment-cash">
                            Наличные при получении
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="payment-card" defaultChecked />
                          <Label htmlFor="payment-card">
                            Банковская карта при получении
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="payment-online" defaultChecked />
                          <Label htmlFor="payment-online">Онлайн-оплата</Label>
                        </div>
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-medium mb-4">
                          Настройки онлайн-оплаты
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="payment-api-key">
                              API ключ платежной системы
                            </Label>
                            <Input
                              id="payment-api-key"
                              type="password"
                              defaultValue="sk_test_example123456"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-merchant-id">
                              ID продавца
                            </Label>
                            <Input
                              id="payment-merchant-id"
                              defaultValue="merchant_12345"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-success-url">
                              URL успешной оплаты
                            </Label>
                            <Input
                              id="payment-success-url"
                              defaultValue="https://kozhamaster.ru/payment/success"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-cancel-url">
                              URL отмены оплаты
                            </Label>
                            <Input
                              id="payment-cancel-url"
                              defaultValue="https://kozhamaster.ru/payment/cancel"
                            />
                          </div>
                        </div>
                        <div className="border-t pt-4 mt-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="maintenance-mode">
                                Режим тестовой оплаты
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Когда режим тестовой оплаты включен, сайт не
                                будет принимать настоящие платежи
                              </p>
                            </div>
                            <div className="ml-auto">
                              <Switch
                                id="maintenance-mode"
                                checked={testPayMode}
                                onCheckedChange={setTestPayMode}
                              />
                            </div>
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
                {/* Доставка */}
                <TabsContent value="delivery" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Настройки доставки</CardTitle>
                      <CardDescription>
                        Настройте способы доставки для вашего магазина
                      </CardDescription>
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
                            <Label htmlFor="delivery-courier">
                              Курьерская доставка
                            </Label>
                          </div>
                          <Input className="w-24" defaultValue="300" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="delivery-post" />
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
                        <h3 className="text-lg font-medium mb-4">
                          Дополнительные настройки
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="free-shipping-threshold">
                              Бесплатная доставка от суммы (₽)
                            </Label>
                            <Input
                              id="free-shipping-threshold"
                              defaultValue="5000"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="delivery-time">
                              Среднее время доставки (дни)
                            </Label>
                            <Input id="delivery-time" defaultValue="3-5" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pickup-address">
                              Адрес самовывоза
                            </Label>
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
  );
}
