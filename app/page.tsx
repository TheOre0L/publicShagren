"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import $api, { API_URL } from "@/http/requests";
import { useAuth } from "@/http/isAuth";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";

export default function Home() {
  const { isAuth } = useAuth();
  const router = useRouter();
  const [homeData, setHomeData] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState();
  const [categoryes, setCategoryes] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          homeResponse,
          productsResponse,
          reviewsResponse,
          categoryResponse,
        ] = await Promise.all([
          $api.get(`${API_URL}/home`),
          $api.get(`${API_URL}/products`, {
            params: { action: "all", limit: 4, page: 1 },
          }),
          $api.get(`${API_URL}/reviews`, { params: { limit: 5, page: 1 } }),
          $api.get(`${API_URL}/category-product?action=all`),
        ]);
        setHomeData(homeResponse.data);
        setReviews(reviewsResponse.data.reviews);
        setCategoryes(categoryResponse.data);
        setProducts(productsResponse.data.products);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}

      <Header isAuth={isAuth} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative rigth- h-[600px] w-full">
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
              <div className="mt-8 flex justify-center gap-4"></div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {products.length !== 0 && (
          <section id="catalog" className="py-16 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl font-bold text-center mb-12">
                Популярные изделия
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <Link
                    key={index}
                    href={`/product/${product.id}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-md border border-border/50 bg-card transition-all hover:border-amber-800/50 hover:shadow-md group-hover:shadow-amber-800/5">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={
                            `${API_URL}/uploads/${product.images[0]?.file}` ||
                            "/placeholder.svg"
                          }
                          alt={product.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
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
                        {product.count === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <p className="text-white font-medium">
                              Нет в наличии
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-base mb-1">
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${
                                  index < Math.floor(product.rating)
                                    ? "fill-amber-500 text-amber-500"
                                    : index < product.rating
                                    ? "fill-amber-500/50 text-amber-500/50"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {product.price.toLocaleString()} ₽
                          </p>
                          {product.oldPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              {product.oldPrice.toLocaleString()} ₽
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-12">
                <Button
                  onClick={() => {
                    router.push("/catalog");
                  }}
                  variant="outline"
                  size="lg"
                >
                  Смотреть все товары
                </Button>
              </div>
            </div>
          </section>
        )}

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
                <h2 className="text-3xl font-bold mb-6">
                  {homeData.titleAbout}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {homeData.textAbout}
                </p>

                <Button className="bg-amber-700 hover:bg-amber-800">
                  Узнать больше
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Категории товаров
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryes
                .filter((category) => category.product.length > 0)
                .map((category) => (
                  <div
                    key={category.id}
                    className="relative group overflow-hidden rounded-lg"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={
                          category.product?.[0]?.images?.[0]?.file
                            ? `${API_URL}/uploads/${category.product[0].images[0].file}`
                            : "/placeholder.svg"
                        }
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                        <h3 className="text-white text-xl font-semibold">
                          {category.title}
                        </h3>
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
            <h2 className="text-3xl font-bold text-center mb-12">
              Отзывы наших клиентов
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews?.length === 0 ? (
                <h3 className="text-center text-muted-foreground text-lg">
                  Отзывов пока нет!
                </h3>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <Card key={review.id || index} className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                          {review.author?.charAt(0) || "?"}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold">
                            {review.author || "Аноним"}
                          </h3>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.text}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
