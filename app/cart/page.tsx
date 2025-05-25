"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useMask } from '@react-input/mask';
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  Check,
  ChevronRight,
  CreditCard,
  Home,
  MapPin,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Header from "@/components/header"
import $api, { API_URL } from "@/http/requests"
import CdekWidget from "@/components/cdekWidget"
import Script from "next/script"
import { useAuth } from "@/http/isAuth"
import Head from "next/head"
import Loader from "@/components/loader";
import { message } from "antd";

export default function CartPage() {
  const router = useRouter()
  const inputRefPhone = useMask({
    mask: '+7 (___) ___-__-__',
    replacement: { _: /\d/ },
  });
  const {messageApi, contextHolder} = message.useMessage();
  // Состояния для корзины
  const {isAuth} = useAuth();
  const [cartItems, setCartItems] = useState([])
  const [promoCode, setPromoCode] = useState("")
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [activeTab, setActiveTab] = useState("cart")
  const [deliveryMethod, setDeliveryMethod] = useState("cdek")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [selectedPoint, setSelectedPoint] = useState({delivery: null, rate: {delivery_sum: 0}, address: null })
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isLoader, setIsLoaded] = useState(true)

  // Состояния для формы
  const [formData, setFormData] = useState({
    type: deliveryMethod,
    paymentMethod: paymentMethod,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    comment: "",
  })


  useEffect(() => {
    $api.get(`${API_URL}/shopping-cart`).then((res) => {
      setIsLoaded(true)
      setCartItems(res.data.cartItems)
    }).finally(() => {
      setIsLoaded(false)
    })
  }, [])

  useEffect(() => {
  if (!cartItems || cartItems.length === 0) {
    setSubtotal(0);
    setDiscount(0);
    return;
  }

  const calculatedSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const calculatedDiscount = cartItems.reduce((sum, item) => {
    if (item.product.oldPrice) {
      return (
        sum +
        (item.product.oldPrice - item.product.price) * item.quantity
      );
    }
    return sum;
  }, 0);

  setSubtotal(calculatedSubtotal);
  setDiscount(calculatedDiscount);
}, [cartItems]);

  if(isLoader) {
    return (<Loader/>)
  }

    // Если корзина пуста, показываем соответствующее сообщение
  if (!cartItems || cartItems.length < 1) {
    return (
      <div className="min-h-screen flex flex-col">

        <Header isAuth/>
        <main className="flex-1 container py-12">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="rounded-full bg-muted p-6 mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Ваша корзина пуста</h1>
            <p className="text-muted-foreground mb-6">
              Похоже, вы еще не добавили товары в корзину. Перейдите в каталог, чтобы выбрать товары.
            </p>
            <Button asChild className="bg-amber-700 hover:bg-amber-800">
              <Link href="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }
  

    // Расчет итогов
  const deliveryCost = deliveryMethod === "pickup" ? 0 : deliveryMethod === "cdek" ? 300 : 500
  const promoValue = promoDiscount > 0 ? (subtotal * promoDiscount) / 100 : 0
  const total = subtotal + (deliveryMethod === 'cdek' ? selectedPoint.rate?.delivery_sum : 0) - promoValue

  const addToCart = (productId: number, count: number) => {
    $api.get(`${API_URL}/shopping-cart/count?item=${productId}&count=${count + 1}`)
        .then((res) => {setCartItems(res.data.cartItems)})
  }

  const removeFromCart = (productId: number, count: number) => {
    $api.get(`${API_URL}/shopping-cart/count?item=${productId}&count=${count - 1}`)
    .then((res) => {
      setCartItems(res.data.cartItems)
      if(count - 1 === 0) {
        messageApi.info(`Товар #${productId} был удален из корзины!`)
      }
    })
  }

  const deleteFromCart = (productId: number) => {
    $api.get(`${API_URL}/shopping-cart/count?item=${productId}&count=${0}`)
    .then((res) => {
      setCartItems(res.data.cartItems)
      messageApi.info(`Товар #${productId} был удален из корзины!`)
    })
  }


  const applyPromoCode = () => {
    // Имитация проверки промокода
    if (promoCode.toLowerCase() === "leather10") {
      setPromoDiscount(10)
      setPromoError("")
    } else if (promoCode.toLowerCase() === "leather20") {
      setPromoDiscount(20)
      setPromoError("")
    } else {
      setPromoDiscount(0)
      setPromoError("Недействительный промокод")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
      $api.post(`${API_URL}/orders`, {...formData, ...selectedPoint}).then((res) => {
        router.push(`${res.data.payment.confirmation.confirmation_url}`)
        console.log(res.data)
      })

  }

  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Header isAuth={isAuth}/>

      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">Корзина</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="cart">Корзина</TabsTrigger>
                  <TabsTrigger value="delivery" disabled={activeTab === "cart" && cartItems.length === 0}>
                    Доставка
                  </TabsTrigger>
                  <TabsTrigger value="payment" disabled={activeTab !== "payment"}>
                    Оплата
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cart" className="space-y-6">
                  {/* Список товаров в корзине */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                        <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
                          <Image
                            src={`${API_URL}/uploads/${item.product?.images?.[0]?.file}` || "/placeholder.svg"}
                            alt={"fff"}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                            <Link href={`/product/${item.product.id}`} className="font-medium hover:text-amber-700">
                              {item.product.title}
                              
                            </Link>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <button
                                  onClick={() => removeFromCart(item.product?.id, item.quantity)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8 border rounded-l-md flex items-center justify-center hover:bg-muted disabled:opacity-50"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <div className="h-8 px-3 border-t border-b flex items-center justify-center min-w-[2.5rem]">
                                  {item.quantity}
                                </div>
                                <button
                                  onClick={() => addToCart(item.product?.id, item.quantity)}
                                  disabled={item.quantity >= item.product?.count}
                                  className="h-8 w-8 border rounded-r-md flex items-center justify-center hover:bg-muted disabled:opacity-50"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                                
                              </div>
                              <p className="text-sm">В наличии: {item.product?.count}</p>
                              <button
                                onClick={() => deleteFromCart(item.product?.id)}
                                className="h-8 w-8 border rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-auto flex flex-col sm:flex-row sm:justify-between gap-2 pt-2">
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} x {item.product.price.toLocaleString()} ₽
                            </div>
                            <div className="font-semibold">
                              {(item.product.price * item.quantity).toLocaleString()} ₽
                              {item.product.oldPrice && (
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  {(item.product.oldPrice * item.quantity).toLocaleString()} ₽
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href="/catalog">
                        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                        Продолжить покупки
                      </Link>
                    </Button>
                    <Button onClick={() => setActiveTab("delivery")} className="bg-amber-700 hover:bg-amber-800">
                      Перейти к оформлению
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="delivery" className="space-y-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setActiveTab("payment")
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Контактная информация */}
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Контактная информация</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Имя *</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Фамилия *</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Телефон *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            ref={inputRefPhone}
                            placeholder="+7 (___) ___-__-__"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Способ доставки */}
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Способ доставки</h2>
                        <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-amber-700 transition-colors">
                            <RadioGroupItem value="cdek" id="cdek" />
                            <Label htmlFor="cdek" className="flex items-center gap-2 cursor-pointer flex-1">
                              <MapPin className="h-5 w-5 text-amber-700" />
                              <div>
                                <div>Доставка СДЭК до ПВЗ</div>
                                <div className="text-sm text-muted-foreground">{selectedPoint.rate?.period_min}-{selectedPoint.rate?.period_max} рабочих дней, {selectedPoint.rate?.delivery_sum} ₽</div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-amber-700 transition-colors">
                            <RadioGroupItem value="pickup" id="pickup"/>
                            <Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Home className="h-5 w-5 text-amber-700" />
                              <div>
                                <div>Самовывоз из магазина</div>
                                <div className="text-sm text-muted-foreground">
                                  г. Невинномысск ул. Гагарина 
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                        {/* Выбор ПВЗ СДЭК */}
                        {deliveryMethod === "cdek" && (
                          <div className="space-y-4 mt-4 p-4 border rounded-lg">
                            <h3 className="font-medium">Выберите пункт выдачи</h3>

                            <div className="relative w-full h-[50px] bg-muted rounded-lg overflow-hidden mb-4">
                              <CdekWidget setSelectPoint={setSelectedPoint}/>
                            </div>
                            {selectedPoint && (
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <h4 className="font-medium mb-2">Пункт выдачи: {selectedPoint.address?.region}, {selectedPoint.address?.city}, {selectedPoint.address?.address}</h4>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Режим работы: {selectedPoint.address?.work_time}
                                </p>
                                <p className="text-sm text-muted-foreground">Стоимость доставки: {selectedPoint.rate?.delivery_sum} ₽</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="comment">Комментарий к заказу</Label>
                          <Textarea
                            id="comment"
                            name="comment"
                            placeholder="Дополнительная информация к заказу"
                            value={formData.comment}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("cart")}>
                        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                        Назад к корзине
                      </Button>
                      <Button
                        type="submit"
                        className="bg-amber-700 hover:bg-amber-800"
                        disabled={
                          !formData.firstName ||
                          !formData.lastName ||
                          !formData.email ||
                          !formData.phone ||
                          (deliveryMethod === "cdek" && selectedPoint.address === null)
                        }
                      >
                        Перейти к оплате
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Способ оплаты</h2>

                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                        <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-amber-700 transition-colors">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                            <CreditCard className="h-5 w-5 text-amber-700" />
                            <div>
                              <div>Банковская карта</div>
                              <div className="text-sm text-muted-foreground">Visa, MasterCard, МИР</div>
                            </div>
                          </Label>
                        </div>
                        <div aria-disabled={deliveryMethod == 'cdek'} className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-amber-700 transition-colors">
                          <RadioGroupItem value="cash" id="cash" disabled={deliveryMethod == 'cdek'}/>
                          <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                            <Package className="h-5 w-5 text-amber-700" />
                            <div>
                              <div>Наличными при получении</div>
                              <div className="text-sm text-muted-foreground">Оплата курьеру или в пункте выдачи</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === "card" && (
                        <Alert className="bg-muted/50 border-amber-700/20">
                          <AlertCircle className="h-4 w-4 text-amber-700" />
                          <AlertTitle>Безопасная оплата</AlertTitle>
                          <AlertDescription>
                            После нажатия кнопки "Оформить заказ" вы будете перенаправлены на страницу безопасной
                            оплаты.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="p-4 border rounded-lg space-y-4">
                        <h3 className="font-medium">Информация о заказе</h3>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Получатель:</span>
                            <span className="font-medium">
                              {formData.firstName} {formData.lastName}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Телефон:</span>
                            <span className="font-medium">{formData.phone}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Email:</span>
                            <span className="font-medium">{formData.email}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Способ доставки:</span>
                            <span className="font-medium">
                              {deliveryMethod === "cdek"
                                  ? "СДЭК до ПВЗ"
                                  : "Самовывоз"}
                            </span>
                          </div>
                          {deliveryMethod === "cdek" && selectedPoint && (
                            <div className="flex justify-between text-sm">
                              <span>Пункт выдачи:</span>
                              <span className="font-medium">{selectedPoint.address?.region}, {selectedPoint.address?.city}, {selectedPoint.address?.address}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span>Способ оплаты:</span>
                            <span className="font-medium">
                              {paymentMethod === "card" ? "Банковская карта" : "Наличными при получении"}
                            </span>
                          </div>
                          {formData.comment && (
                            <div className="flex justify-between text-sm">
                              <span>Комментарий:</span>
                              <span className="font-medium">{formData.comment}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("delivery")}>
                        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                        Назад к доставке
                      </Button>
                      <Button type="submit" className="bg-amber-700 hover:bg-amber-800" 
                      >
                        Оформить заказ
                        <Check className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>

            {/* Сводка заказа */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle>Ваш заказ</CardTitle>
                    <CardDescription>
                      {cartItems.length}{" "}
                      {cartItems.length === 1
                        ? "товар"
                        : cartItems.length >= 2 && cartItems.length <= 4
                          ? "товара"
                          : "товаров"}{" "}
                      в корзине
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Accordion type="single" collapsible defaultValue="items">
                      <AccordionItem value="items">
                        <AccordionTrigger className="text-sm font-medium">Товары ({cartItems.length})</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 mt-2">
                            {cartItems.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.product.title} x {item.quantity}
                                </span>
                                <span>{(item.product.price * item.quantity).toLocaleString()} ₽</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Подытог</span>
                        <span>{subtotal.toLocaleString()} ₽</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Скидка</span>
                          <span className="text-green-600">-{discount.toLocaleString()} ₽</span>
                        </div>
                      )}
                      {promoValue > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Промокод ({promoCode})</span>
                          <span className="text-green-600">-{promoValue.toLocaleString()} ₽</span>
                        </div>
                      )}
                      {deliveryCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Доставка</span>
                          <span>{selectedPoint.rate?.delivery_sum.toLocaleString()} ₽</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between font-medium">
                      <span>Итого</span>
                      <span>{total.toLocaleString()} ₽</span>
                    </div>

                    {/* Промокод */}
                    <div className="pt-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Промокод"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button variant="outline" onClick={applyPromoCode} disabled={!promoCode}>
                          Применить
                        </Button>
                      </div>
                      {promoError && <p className="text-destructive text-sm mt-1">{promoError}</p>}
                      {promoDiscount > 0 && (
                        <p className="text-green-600 text-sm mt-1">Промокод применен! Скидка {promoDiscount}%</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {activeTab === "cart" && (
                      <Button
                        className="w-full bg-amber-700 hover:bg-amber-800"
                        onClick={() => setActiveTab("delivery")}
                      >
                        Перейти к оформлению
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  )
}

