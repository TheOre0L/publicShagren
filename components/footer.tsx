import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

export default function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer id="contacts" className="bg-[#f4f4f4] py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="https://i.imgur.com/NrS9R03.png"
                  alt="Логотип"
                  width={200}
                  height={32}
                />
              </div>
              <p className="text-muted-foreground">
                Изделия из натуральной кожи ручной работы, созданные с любовью и
                вниманием к каждой детали.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Навигация</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Главная
                  </Link>
                </li>
                <li>
                  <Link
                    href="#catalog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    О нас
                  </Link>
                </li>
                <li>
                  <Link
                    href="#reviews"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Отзывы
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Контакты</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Невинномысск, ул. Гагарина, 36</li>
                <li>Мастер: <a href="mailto:master@shagren.shop">master@shagren.shop</a></li>
                <li>Менеджер: <a href="mailto:manager@shagren.shop">manager@shagren.shop</a></li>
                <li>Служба поддержки сайта: <a href="mailto:support@shagren.shop">support@shagren.shop</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Соц. сети</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href='https://vk.com/shagreen_leathere'><img src="/vk.svg" alt="vk-icon" height={50} width={50} /></a></li>
              </ul>
            </div>  
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>
              © 2018 - {new Date().getFullYear()} Шагрень. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
