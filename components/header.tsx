"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import $api, { API_URL } from "@/http/requests";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const Logo = () => (
  <Link href="/">
    <div className="flex items-center gap-2">
      <Image
        src="https://i.imgur.com/NrS9R03.png"
        alt="Логотип"
        width={120}
        height={32}
        priority
      />
    </div>
  </Link>
);

export default function Header({
  isAuth = false,
  isAuthPage = false,
  isAdminPage = false,
}: {
  isAuth: boolean;
  isAdminPage?: boolean;
  isAuthPage?: boolean;
}) {
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    $api
      .get(`${API_URL}/notification/count`)
      .then((res) => {
        setCartItemCount(res.data.cartItemsCount);
      })
      .catch(() => {
        setCartItemCount(0);
      });
  }, []);

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: "#about", label: "О нас" },
    { href: "#reviews", label: "Отзывы" },
    { href: "#contacts", label: "Контакты" },
  ];

  const isActive = (href: string) => {
    // Сравниваем путь только для маршрутов без #
    return href !== "#" && pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="container flex h-16 items-center justify-between py-4">
        {(isAuthPage || !isAdminPage) && <Logo />}

        {!isAuthPage && !isAdminPage && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium hover:underline underline-offset-4 ${
                  isActive(href) ? "text-amber-600 font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {isAuth ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-amber-600"
                    aria-label="Профиль пользователя"
                  >
                    <User className="text-amber-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="m-2" />
                      Профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/profile/settings")}
                    >
                      <Settings className="m-2" />
                      Настройки
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={() => router.push("/cart")}
                className="border-amber-600 text-amber-600 hover:text-amber-600"
                aria-label={`Корзина с ${cartItemCount} товарами`}
              >
                <ShoppingCart className="text-amber-600" /> ({cartItemCount})
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="hidden bg-amber-700 hover:bg-amber-800 md:flex">
                  Войти
                </Button>
              </Link>
              <Link href="/registration">
                <Button
                  variant="outline"
                  className="hidden border-amber-700 hover:bg-slate-100 md:flex"
                >
                  Зарегистрироваться
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
