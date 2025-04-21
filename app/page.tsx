"use client"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import { useEffect, useState } from "react"
import $api, { API_URL } from "@/http/requests"
import CdekWidget from "@/components/cdekWidget"
import Script from "next/script"
import { useAuth } from "@/http/isAuth"
import Loader from "@/components/loader"

export default function Home() {
    const {isAuth} = useAuth();
    const [homeData, setHomeData] = useState(null)
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true)
          const [homeResponse, productsResponse] = await Promise.all([
            $api.get(`${API_URL}/home`),
            $api.get(`${API_URL}/products`, {params: {action: 'all', limit: 4, page: 1}})
          ])
          setHomeData(homeResponse.data)
          setProducts(productsResponse.data.products)
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error)
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchData()
    }, [])

    if(isLoading) {
      return ( <Loader/> )
    }

    return(
    <div className="flex min-h-screen flex-col">

      {/* Header */}
 
      <Header isAuth = {isAuth}/>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative h-[500px] w-full">
            <Image
              src={`${API_URL}/uploads/${homeData.imageTitle}`}
              alt="Изделия из кожи ручной работы"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {homeData.title}
              </h1>
              <p className="mt-4 text-lg sm:text-xl">{homeData.subTitle}</p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" className="bg-amber-700 hover:bg-amber-800">
                  Смотреть каталог
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  О нашем мастерстве
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="catalog" className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Популярные изделия</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-64 w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <p className="text-muted-foreground">{product.price}</p>
                    <Button className="w-full mt-4 bg-amber-700 hover:bg-amber-800">В корзину</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Смотреть все товары
              </Button>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section id="about" className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px]">
                <Image
                  src={`${API_URL}/uploads/${homeData.imageAbout}`}
                  alt="Наша мастерская"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">{homeData.titleAbout}</h2>
                <p className="text-muted-foreground mb-4">
                  {homeData.textAbout}
                </p>

                <Button className="bg-amber-700 hover:bg-amber-800">Узнать больше</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Категории товаров</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Кошельки и портмоне",
                  image: "/placeholder.svg?height=300&width=400",
                },
                {
                  name: "Сумки и рюкзаки",
                  image: "/placeholder.svg?height=300&width=400",
                },
                {
                  name: "Ремни и браслеты",
                  image: "/placeholder.svg?height=300&width=400",
                },
                {
                  name: "Чехлы и аксессуары",
                  image: "/placeholder.svg?height=300&width=400",
                },
                {
                  name: "Подарочные наборы",
                  image: "/placeholder.svg?height=300&width=400",
                },
                {
                  name: "Индивидуальный заказ",
                  image: "/placeholder.svg?height=300&width=400",
                },
              ].map((category, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <div className="relative h-64 w-full">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                      <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Отзывы наших клиентов</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Анна К.",
                  rating: 5,
                  text: "Заказывала кошелек в подарок мужу. Качество превзошло все ожидания! Кожа мягкая, швы ровные, все детали продуманы. Муж в восторге, теперь хочет заказать ремень из такой же кожи.",
                },
                {
                  name: "Дмитрий С.",
                  rating: 5,
                  text: "Уже второй год пользуюсь портмоне от КожаМастер. Несмотря на ежедневное использование, выглядит как новое. Кожа только приобрела благородный оттенок. Рекомендую всем, кто ценит качество и долговечность.",
                },
                {
                  name: "Елена В.",
                  rating: 4,
                  text: "Заказывала сумку по индивидуальным меркам. Процесс занял больше времени, чем ожидала, но результат того стоил. Сумка идеально подходит под мои требования, а качество на высоте.",
                },
              ].map((review, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                      {review.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">{review.name}</h3>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.text}</p>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline">Смотреть все отзывы</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contacts" className="bg-muted py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="https://i.imgur.com/NrS9R03.png" alt="Логотип" width={200} height={32} />
              </div>
              <p className="text-muted-foreground">
                Изделия из натуральной кожи ручной работы, созданные с любовью и вниманием к каждой детали.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Навигация</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link href="#catalog" className="text-muted-foreground hover:text-foreground">
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-muted-foreground hover:text-foreground">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="#reviews" className="text-muted-foreground hover:text-foreground">
                    Отзывы
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Контакты</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Москва, ул. Кожевническая, 7</li>
                <li>+7 (999) 123-45-67</li>
                <li>info@kozhamaster.ru</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2018 - {new Date().getFullYear()} Шагрень. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

