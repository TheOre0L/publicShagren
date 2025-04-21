"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import {
  Aperture,
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import $api, { API_URL } from "@/http/requests"
import Header from "@/components/header"
import Loader from "@/components/loader"
import { useAuth } from "@/http/isAuth"

// Mock данные продукта
// const PRODUCT = {
//   id: 1,
//   name: "Кожаный кошелек Classic",
//   description:
//     "Классический кошелек из натуральной кожи высшего качества с продуманной организацией пространства. Отделения для купюр, монет и карт. Ручная работа наших мастеров.",
//   longDescription: `<p>Представляем вам кошелек из натуральной кожи высшего качества, который станет надежным спутником в повседневной жизни. Каждый кошелек изготавливается вручную нашими опытными мастерами, с особым вниманием к деталям и качеству исполнения.</p>
//   <p>Кошелек выполнен из 100% натуральной кожи, прошедшей специальную обработку для придания мягкости и долговечности. Природная текстура кожи делает каждое изделие уникальным.</p>
//   <h3>Особенности:</h3>
//   <ul>
//     <li>Прочная конструкция, которая прослужит вам долгие годы</li>
//     <li>Два отделения для купюр</li>
//     <li>Отделение для монет на молнии</li>
//     <li>6 слотов для кредитных карт</li>
//     <li>2 потайных кармана для важных документов</li>
//     <li>Компактный размер, который удобно помещается в карман</li>
//   </ul>
//   <p>С течением времени натуральная кожа приобретает благородный внешний вид, формируя уникальную патину, которая делает ваш кошелек только лучше и индивидуальнее.</p>`,
//   price: 3500,
//   oldPrice: 4200,
//   currency: "₽",
//   discount: 17, // процент скидки
//   rating: 4.8,
//   reviewCount: 24,
//   images: [
//     "/placeholder.svg?height=600&width=600",
//     "/placeholder.svg?height=600&width=600",
//     "/placeholder.svg?height=600&width=600",
//     "/placeholder.svg?height=600&width=600",
//   ],
//   thumbnails: [
//     "/placeholder.svg?height=100&width=100",
//     "/placeholder.svg?height=100&width=100",
//     "/placeholder.svg?height=100&width=100",
//     "/placeholder.svg?height=100&width=100",
//   ],
//   category: "Кошельки",
//   color: "Коричневый",
//   material: "Натуральная кожа",
//   dimensions: "12 x 9.5 x 2 см",
//   weight: "120 г",
//   inStock: true,
//   isNew: true,
//   isBestseller: true,
//   sku: "KM-K-001",
//   deliveryInfo: "Доставка 2-3 дня",
//   features: [
//     "Ручная работа",
//     "100% натуральная кожа",
//     "2 отделения для купюр",
//     "Отделение для монет на молнии",
//     "6 слотов для карт",
//   ],
//   reviews: [
//     {
//       id: 1,
//       author: "Александр И.",
//       rating: 5,
//       date: "16.03.2023",
//       text: "Отличный кошелек! Качество материала и пошива на высоте. Кожа мягкая, но плотная, швы ровные. Пользуюсь уже месяц, очень доволен покупкой.",
//       isVerified: true,
//     },
//     {
//       id: 2,
//       author: "Елена М.",
//       rating: 4,
//       date: "28.02.2023",
//       text: "Хороший кошелек, но немного меньше, чем я ожидала. Тем не менее, все карты помещаются, к качеству претензий нет.",
//       isVerified: true,
//     },
//     {
//       id: 3,
//       author: "Максим К.",
//       rating: 5,
//       date: "12.01.2023",
//       text: "Покупал в подарок отцу. Он остался очень доволен. Кожа действительно качественная, приятно пахнет. Рекомендую.",
//       isVerified: true,
//     },
//   ],
//   relatedProducts: [
//     {
//       id: 7,
//       name: "Кардхолдер Slim",
//       price: 1800,
//       oldPrice: null,
//       image: "/placeholder.svg?height=300&width=300",
//       rating: 4.6,
//       reviewCount: 11,
//     },
//     {
//       id: 10,
//       name: "Кошелек с монетницей Classic Plus",
//       price: 4200,
//       oldPrice: 4500,
//       image: "/placeholder.svg?height=300&width=300",
//       rating: 4.8,
//       reviewCount: 16,
//     },
//     {
//       id: 2,
//       name: "Ремень ручной работы Premium",
//       price: 2800,
//       oldPrice: null,
//       image: "/placeholder.svg?height=300&width=300",
//       rating: 4.9,
//       reviewCount: 17,
//     },
//     {
//       id: 4,
//       name: "Чехол для ключей Minimal",
//       price: 1200,
//       oldPrice: null,
//       image: "/placeholder.svg?height=300&width=300",
//       rating: 4.5,
//       reviewCount: 8,
//     },
//   ],
// }

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const {isAuth} = useAuth();
  // В реальном приложении здесь был бы запрос к API для получения данных о товаре по id
  const [product, setPRODUCT] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState<{id: string; title: string}>({id: '', title: ''})
  const [loading, setLoading] = useState(true); // Состояние для загрузки
  const [relatedProducts, setRelatedProducts] = useState([])
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
  
        const response = await $api.get(`${API_URL}/products?action=find&productId=${id}`);
        const { category } = response.data;
  
        if (category) {
          setCategory({ id: category.id, title: category.title }  );
        }

        $api.get(`${API_URL}/products?action=findMany&productId=${response.data.relatedProducts}`)
        .then((res) => {
          setRelatedProducts(res.data)
        })
        .catch(() => {})
  
        setPRODUCT(response.data || []);
        
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
      } finally {
        console.log(category);
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id]);
  




  // Если идет загрузка, показываем лоадер
  if (loading) {
    return <Loader/>
  }

if(!loading) {
  
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const addToCart = () => {
    // Здесь будет логика добавления в корзину
    $api.post(`${API_URL}/shopping-cart`, {
      productId: product.id,
      quantity: quantity,
    }).then(() => {
      alert(`Товар "${product.title}" добавлен в корзину в количестве ${quantity} шт.`)
    })

  }

  const addToWishlist = () => {
    // Здесь будет логика добавления в избранное
    alert(`Товар "${product.title}" добавлен в избранное`)
  }

              return (
                <div className="min-h-screen flex flex-col">
                  <Header isAuth={isAuth}/>
                  <main className="flex-1 container py-8">
                    <div className="flex flex-col space-y-8">
                      {/* Хлебные крошки */}
                      <nav className="flex items-center text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                          Главная
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <Link href="/catalog" className="hover:text-foreground transition-colors">
                          Каталог
                        </Link>
                    
                <ChevronRight className="h-4 w-4 mx-2" />
                  <Link
              href={`/catalog?category=${product.category.title}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.title}
            </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link
              href={`/catalog?category=${product.title}`}
              className="hover:text-foreground transition-colors"
            >
              {product.title}
            </Link>
          </nav>
          {/* Основная информация о товаре */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Галерея изображений */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                {console.log(product.images)}
                <Image
                  src={`${API_URL}/uploads/${product?.images[activeImageIndex]?.file}`|| "/placeholder.svg"}
                  alt={product.images[activeImageIndex]?.alt}
                  fill
                  className="object-cover"
                />
                {product.isNew && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    Новинка
                  </div>
                )}
                {product.isBestseller && (
                  <div className="absolute top-2 right-2 bg-amber-700 text-white text-xs font-semibold px-2 py-1 rounded">
                    Хит продаж
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    className={`relative w-20 h-20 ml-2 rounded-md border overflow-hidden ${
                      activeImageIndex === index ? "ring-2 ring-amber-700" : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={`${API_URL}/uploads/${image?.file}` || "/placeholder.svg"}
                      alt={`${product.title} - изображение ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Информация о товаре */}
            <div className="flex flex-col">
              <Link
                href="/catalog"
                className="text-amber-700 hover:text-amber-800 flex items-center gap-1 mb-2 self-start"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Назад в каталог</span>
              </Link>

              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-5 w-5 ${
                        index < Math.floor(product.rating)
                          ? "fill-amber-500 text-amber-500"
                          : index < product.rating
                            ? "fill-amber-500/50 text-amber-500/50"
                            : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.rating}) {product.reviewCount} отзывов
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <p className="text-2xl font-bold">
                  {product.price.toLocaleString()} ₽ {product.currency}
                </p>
                {product.oldPrice && (
                  <p className="text-lg text-muted-foreground line-through">
                    {product.oldPrice.toLocaleString()} {product.currency}
                  </p>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-0.5 rounded">
                    Скидка {product.discount}%
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium min-w-[120px]">Артикул:</span>
                  <span>{product.sku}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium min-w-[120px]">Категория:</span>
                  <Link href={`/catalog?category=${product.category.title}`} className="text-amber-700 hover:underline">
                    {product.category.title}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium min-w-[120px]">Материал:</span>
                  <span>{product.material.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium min-w-[120px]">Цвет:</span>
                  {product.colors.map((color: any) => (
                    <span key={color.id}>{color.name}</span> // Добавил key и вернул элемент
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium min-w-[120px]">Размеры:</span>
                  <span>{product.dimensions}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 border rounded-l-md flex items-center justify-center hover:bg-muted disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="h-10 px-4 border-t border-b flex items-center justify-center min-w-[3rem]">
                    {quantity}
                  </div>
                  <button
                    onClick={increaseQuantity}
                    className="h-10 w-10 border rounded-r-md flex items-center justify-center hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  onClick={addToCart}
                  className="flex-1 bg-amber-700 hover:bg-amber-800"
                  disabled={product.count <= 0 || isAuth === false}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.count > 0 ? "Добавить в корзину" : "Нет в наличии"}
                </Button>
                <Button variant="outline" size="icon" onClick={addToWishlist} className="rounded-md">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-muted/50 rounded-md p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-700/10 p-2">
                    <Truck className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-medium">Доставка</p>
                    <p className="text-sm text-muted-foreground">{product.deliveryInfo}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs bg-muted/70 rounded-full px-3 py-1">
                    <Check className="h-3 w-3 text-amber-700" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Подробная информация о товаре */}
          <div className="mt-8">
            <Tabs defaultValue="description">
              <TabsList className="w-full border-b rounded-none h-auto p-0 bg-transparent justify-start">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 pt-2 pb-3 px-4 -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none h-auto"
                >
                  Описание
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 pt-2 pb-3 px-4 -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none h-auto"
                >
                  Характеристики
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 pt-2 pb-3 px-4 -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none h-auto"
                >
                  Отзывы ({product.reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-6">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
              </TabsContent>

              <TabsContent value="specifications" className="pt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Артикул</dt>
                    <dd>{product.sku}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Категория</dt>
                    <dd>{product.category.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Материал</dt>
                    <dd>{product.material.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Цвет</dt>
                    {product.colors.map((color: any) => (
                      <span key={color.id}>{color.name}</span> // Добавил key и вернул элемент
                    ))}
                    
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Размеры</dt>
                    <dd>{product.dimensions}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Вес</dt>
                    <dd>{product.weight}</dd>
                  </div>
                </dl>
              </TabsContent>

              <TabsContent value="reviews" className="pt-6">
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          {review.isVerified && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                              Подтвержденная покупка
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{review.text}</p>

                      <div className="relative w-20 h-20 mt-4 overflow-hidden rounded-md border">
                                              <Image
                                                src={`${API_URL}/uploads/${review?.images[0]?.file}` || "/placeholder.svg"}
                                                alt={`${review?.images[0]?.alt}`}
                                                fill
                                                className="object-cover"
                                              />
                                            </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Похожие товары */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`} className="group">
                  <div className="overflow-hidden rounded-md border bg-card transition-all hover:border-amber-800/50 hover:shadow-md group-hover:shadow-amber-800/5">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={`${API_URL}/uploads/${relatedProduct?.images[0]?.file}` || "/placeholder.svg"}
                        alt={`relatedProduct.name`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-base mb-1">{relatedProduct.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < Math.floor(relatedProduct.rating)
                                  ? "fill-amber-500 text-amber-500"
                                  : index < relatedProduct.rating
                                    ? "fill-amber-500/50 text-amber-500/50"
                                    : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">({relatedProduct.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{relatedProduct.price.toLocaleString()} ₽</p>
                        {relatedProduct.oldPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            {relatedProduct.oldPrice.toLocaleString()} ₽
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
}

