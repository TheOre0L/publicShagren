"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ShoppingBag, Star, Upload, X, AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import $api, { API_URL } from "@/http/requests"
import Header from "@/components/header"
import { useAuth } from "@/http/isAuth"
import Loader from "@/components/loader"

// Моковые данные для продуктаs
export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  // В реальном приложении здесь был бы запрос к API для получения данных о товаре по id
  const [product, setProduct] = useState({});
  const [isLoaded, setIsLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Обработчик изменения рейтинга
  const handleRatingChange = (value: number) => {
    setRating(value)
  }

  // Обработчик наведения на звезды
  const handleRatingHover = (value: number) => {
    setHoverRating(value)
  }

  // Обработчик загрузки изображений
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)

        const uploadedImages = await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        const uniqueFile = new File([file], `product_review_${crypto.randomUUID()}`, { type: file.type });
          formData.append("file", uniqueFile);
          const { data } = await $api.post("/upload", formData);
          //@ts-ignore
          setImageUrls((prev) => [...prev, {
            id: crypto.randomUUID(),
            alt: `Картинка: ${data.filePath}`,
            file: `${data.filePath}`,
          }]);
            return {
              id: crypto.randomUUID(),
              alt: `Картинка: ${data.filePath}`,
              file: `${data.filePath}`,
            };
          }
        ));

      setError("")
    }
  }

  // Обработчик удаления изображения
  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    const newImageUrls = [...imageUrls]

    // Освобождаем URL объекта
    URL.revokeObjectURL(newImageUrls[index])

    newImages.splice(index, 1)
    newImageUrls.splice(index, 1)

    setImages(newImages)
    //@ts-ignore
    setImageUrls(newImageUrls)
  }

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация
    if (rating === 0) {
      setError("Пожалуйста, выберите рейтинг")
      return
    }

    if (reviewText.trim().length < 10) {
      setError("Отзыв должен содержать не менее 10 символов")
      return
    }

    setError("")
    setSubmitting(true)

    try {
      $api
        .post(`${API_URL}/reviews?productId=${id}`, {
          rating: rating,
          text: reviewText,
          productId: id,
          images: imageUrls
        })
        .then(() => {
      // Успешная отправка
      setSuccess(true)

      // Перенаправление на страницу товара через 2 секунды
      setTimeout(() => {
        router.push(`/product/${id}`)
      }, 2000)
        })
    } catch (err) {
      setError("Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте еще раз.")
    } finally {
      setSubmitting(false)
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
    setIsLoading(true)
    $api
      .get(`${API_URL}/products?action=find&productId=${id}`)
      .then((res) => setProduct(res.data))
      .catch()
      .finally(() => setIsLoading(false))
  }, [])

  if(isLoaded || isLoading) {
    return (
      <Loader/>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuth/>

      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto" asChild>
                <Link href={`/product/${id}`}>
                  <span className="text-amber-700">← Вернуться к товару</span>
                </Link>
              </Button>
            </div>

            <h1 className="text-2xl font-bold">Оставить отзыв</h1>

            {success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Спасибо за ваш отзыв!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Ваш отзыв успешно отправлен и будет опубликован. Вы будете перенаправлены
                  на страницу товара.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Информация о товаре */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 overflow-hidden rounded-md border">
                        <Image
                          src={`${API_URL}/uploads/${product?.images[0]?.file}` || "/placeholder.svg"}
                          alt={`${product?.images[0]?.alt}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-medium">{product.title}</h2>
                        <p className="text-sm text-muted-foreground">
                        {product?.type?.name} • {product?.category?.title}
                        </p>
                        <p className="text-sm font-medium">{product?.price?.toLocaleString()} ₽</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Рейтинг */}
                  <div className="space-y-2">
                    <Label htmlFor="rating" className="text-base">
                      Ваша оценка <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="p-1 focus:outline-none"
                          onClick={() => handleRatingChange(value)}
                          onMouseEnter={() => handleRatingHover(value)}
                          onMouseLeave={() => handleRatingHover(0)}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              (hoverRating || rating) >= value ? "fill-amber-500 text-amber-500" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Текст отзыва */}
                  <div className="space-y-2">
                    <Label htmlFor="review" className="text-base">
                      Ваш отзыв <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="review"
                      placeholder="Расскажите о вашем опыте использования товара. Что вам понравилось или не понравилось?"
                      rows={6}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">Минимум 10 символов</p>
                  </div>

                  {/* Загрузка фотографий */}
                  <div className="space-y-2">
                    <Label htmlFor="images" className="text-base">
                      Фотографии (необязательно)
                    </Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {}
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border">
                          <Image
                            src={`${API_URL}/uploads/${url?.file}` || "/placeholder.svg"}
                            alt={`Фото ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-black/70"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}

                      {images.length < 5 && (
                        <label className="flex flex-col items-center justify-center w-24 h-24 border border-dashed rounded-md cursor-pointer hover:bg-muted/50">
                          <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground text-center">Добавить фото</span>
                          <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Вы можете загрузить фотографии (JPG, PNG)</p>
                  </div>

                  <Separator />

                  {/* Советы по написанию отзыва */}
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Советы по написанию отзыва:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                      <li>Опишите качество материалов и изготовления</li>
                      <li>Расскажите о функциональности и удобстве использования</li>
                      <li>Поделитесь впечатлениями о дизайне и внешнем виде</li>
                      <li>Укажите, соответствует ли товар вашим ожиданиям</li>
                      <li>Избегайте оскорбительных выражений и ненормативной лексики</li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push(`/product/${id}`)}>
                      Отмена
                    </Button>
                    <Button type="submit" className="bg-amber-700 hover:bg-amber-800" disabled={submitting}>
                      {submitting ? "Отправка..." : "Отправить отзыв"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

