import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import $api, { API_URL } from "@/http/requests"
 
export default function Header({ isAuth = false, isAuthPage =  false, isAdminPage = false}: { isAuth: boolean, isAdminPage?: boolean, isAuthPage?: boolean}) {
  const [cartItemCount, setCartItemCount] = useState(0)
  useEffect(() => {
      $api
          .get(`${API_URL}/notification/count`)
          .then((res) => {
            setCartItemCount(res.data.cartItemsCount)
          })
          .catch(() => {})
  }, [])
  
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center justify-between py-4">

      {isAuthPage ? 
      <>
          <Link href="/">
            <div className="flex items-center gap-2">
                <Image src="https://i.imgur.com/NrS9R03.png" alt="Логотип" width={120} height={32} />
            </div>
          </Link>
      </>
      :
      <>
      {!isAdminPage ? 
      <>
      <Link href="/">
            <div className="flex items-center gap-2">
                <Image src="https://i.imgur.com/NrS9R03.png" alt="Логотип" width={120} height={32} />
            </div>
          </Link>
      </>
      :
      <>
      </>}
          
          <nav className="hidden md:flex items-center gap-6">
        {isAdminPage ? 
        <>

        </>
        :
        <>
                <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
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
        </>
        }
      </nav>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z" />
          </svg>
          <span className="sr-only">Поиск</span>
        </Button>
        <div className="flex items-center gap-4">

            {isAuth ? 
            <>          
            {isAdminPage ? 
            <>
            </>
            :
            <>
              <Link href="/cart">
                <Button variant="outline" size="icon" className="rounded-full relative">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="sr-only">Корзина</span>
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                </Button>
              </Link>
            </>
            }
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  Профиль
                </Button>
              </Link>
            </>
            : 
            <>
            <Link href="/login">
              <Button className="hidden md:flex">Войти</Button>
            </Link>
            <Link href="/registration">
              <Button className="hidden md:flex">Зарегистрироваться</Button>
            </Link>
            </>
            }
          </div>
      </div>
      </>
      }
      
    </div>
  </header>
  )
}