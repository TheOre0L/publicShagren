"use client";

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Filter, ShoppingBag, ShoppingCart, Star, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Header from "@/components/header"
import $api, { API_URL } from "@/http/requests"
import { useAuth } from "@/http/isAuth"
import { title } from "process"


export default function CatalogPage() {

    const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);
    const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [COLORS, setCOLORS] = useState<any[]>([]);
    const {isAuth} = useAuth();

    const router = useRouter()
    const searchParams = useSearchParams()

    // Фильтры и состояния
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [activeCategories, setActiveCategories] = useState<string[]>([])
    const [activeColors, setActiveColors] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000])
    const [sortOption, setSortOption] = useState<string>("featured")
    const [inStockOnly, setInStockOnly] = useState<boolean>(false)
    const [onlyNew, setOnlyNew] = useState<boolean>(false)
    const [onlyBestsellers, setOnlyBestsellers] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalItem, setTotalItem] = useState<number>(0)
    const [itemsPerPage, setItemsPerPage] = useState('6')


  // Обработчики для фильтров
  const handleCategoryChange = (category: string) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter((c) => c !== category))
    } else {
      setActiveCategories([...activeCategories, category])
    }
    setCurrentPage(1)
  }

  const handleColorChange = (color: string) => {
    if (activeColors.includes(color)) {
      setActiveColors(activeColors.filter((c) => c !== color))
    } else {
      setActiveColors([...activeColors, color])
    }
    setCurrentPage(1)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
    setCurrentPage(1)
  }

  const handleElementChange = (value: string) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked)
    setCurrentPage(1)
  }

  const handleNewChange = (checked: boolean) => {
    setOnlyNew(checked)
    setCurrentPage(1)
  }

  const handleBestsellersChange = (checked: boolean) => {
    setOnlyBestsellers(checked)
    setCurrentPage(1)
  }

  const fetchProducts = async () => {
    try {
      const resCat = await $api.get(`${API_URL}/category-product?action=all`)
      setCATEGORIES(resCat.data || []);
      const resCol = await $api.get(`${API_URL}/products/color`)
      setCOLORS(resCol.data || []);
      const response = await $api.get(`${API_URL}/products`, {
        params: {
          action: 'all',
          page: Number(currentPage), // Это уже число
          limit: Number(itemsPerPage), // Это тоже число
          category: activeCategories.join(","),
          color: activeColors.join(","),
          minPrice: priceRange[0], // minPrice теперь число
          maxPrice: priceRange[1], // maxPrice теперь число
          inStock: inStockOnly ? true : false, // inStock передается как true или false
          isNew: onlyNew ? true : false, // isNew передается как true или false
          isBestseller: onlyBestsellers ? true : false, // isBestseller передается как true или false
          sort: sortOption,
        },
      });
      


      setPRODUCTS(response.data.products || []);
      setTotalPages(Math.ceil(response.data.total / Number(itemsPerPage)));
      setTotalItem(response.data.total);
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage, activeCategories, activeColors, priceRange, inStockOnly, onlyNew, onlyBestsellers, sortOption])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  

  const clearAllFilters = () => {
    setActiveCategories([])
    setActiveColors([])
    setPriceRange([0, 1000000])
    setInStockOnly(false)
    setOnlyNew(false)
    setOnlyBestsellers(false)
    setSortOption("featured")
    setCurrentPage(1)
    fetchProducts()
  }

  // Количество активных фильтров
  const activeFiltersCount =
    activeCategories.length +
    activeColors.length +
    (inStockOnly ? 1 : 0) +
    (onlyNew ? 1 : 0) +
    (onlyBestsellers ? 1 : 0) +
    (JSON.stringify(priceRange) !== JSON.stringify([0, 60000]) ? 1 : 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuth={isAuth}/>

      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">Каталог товаров</h1>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="text-base text-muted-foreground">
                {totalItem}{" "}
                {totalItem === 1
                  ? "товар"
                  : totalItem >= 2 && totalItem <= 4
                    ? "товара"
                    : "товаров"}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="flex items-center">
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 lg:hidden gap-1">
                        <Filter className="h-4 w-4" />
                        Фильтры
                        {activeFiltersCount > 0 && (
                          <span className="ml-1 rounded-full bg-amber-700 text-white w-5 h-5 flex items-center justify-center text-xs">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px]">
                      <SheetHeader className="mb-5">
                        <SheetTitle>Фильтры</SheetTitle>
                        <SheetDescription>Фильтруйте товары по параметрам</SheetDescription>
                      </SheetHeader>

                      {/* Мобильные фильтры - то же содержимое, что и в десктопной версии */}
                      <div className="space-y-6">
                        {/* Категории */}
                        <div>
                          <h3 className="font-medium mb-3">Категории</h3>
                          <div className="space-y-2">
                            {CATEGORIES.map((category) => (
                              <div key={category.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={`category-mobile-${category.id}`}
                                  checked={activeCategories.includes(category.title)}
                                  onCheckedChange={() => handleCategoryChange(category.title)}
                                />
                                <Label
                                  htmlFor={`category-mobile-${category.id}`}
                                  className="flex-1 text-sm cursor-pointer"
                                >
                                  {category.title}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Цена */}
                        <div>
                          <h3 className="font-medium mb-3">Цена</h3>
                          <div className="pl-1">
                            <Slider
                              min={0}
                              max={1000000}
                              step={1000}
                              value={priceRange}
                              onValueChange={handlePriceChange}
                              className="mb-6"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Label htmlFor="price-from-mobile" className="text-xs mb-1 block">
                                От
                              </Label>
                              <Input
                                id="price-from-mobile"
                                type="number"
                                min={0}
                                max={priceRange[1]}
                                value={priceRange[0]}
                                onChange={(e) => handlePriceChange([Number.parseInt(e.target.value), priceRange[1]])}
                                className="h-8"
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor="price-to-mobile" className="text-xs mb-1 block">
                                До
                              </Label>
                              <Input
                                id="price-to-mobile"
                                type="number"
                                min={priceRange[0]}
                                max={1000000}
                                value={priceRange[1]}
                                onChange={(e) => handlePriceChange([priceRange[0], Number.parseInt(e.target.value)])}
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Цвет */}
                        <div>
                          <h3 className="font-medium mb-3">Цвет</h3>
                          <div className="space-y-2">
                            {COLORS.map((color) => (
                              <div key={color.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={`color-mobile-${color.id}`}
                                  checked={activeColors.includes(color.id)}
                                  onCheckedChange={() => handleColorChange(color.id)}
                                />
                                <Label htmlFor={`color-mobile-${color.id}`} className="flex-1 text-sm cursor-pointer">
                                  {color.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Дополнительные фильтры */}
                        <div>
                          <h3 className="font-medium mb-3">Дополнительно</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="in-stock-mobile"
                                checked={inStockOnly}
                                onCheckedChange={(checked) => handleInStockChange(checked === true)}
                              />
                              <Label htmlFor="in-stock-mobile" className="text-sm cursor-pointer">
                                Только в наличии
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="new-mobile"
                                checked={onlyNew}
                                onCheckedChange={(checked) => handleNewChange(checked === true)}
                              />
                              <Label htmlFor="new-mobile" className="text-sm cursor-pointer">
                                Только новинки
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="bestsellers-mobile"
                                checked={onlyBestsellers}
                                onCheckedChange={(checked) => handleBestsellersChange(checked === true)}
                              />
                              <Label htmlFor="bestsellers-mobile" className="text-sm cursor-pointer">
                                Только бестселлеры
                              </Label>
                            </div>
                          </div>
                        </div>

                        {/* Кнопки применения и сброса */}
                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" className="flex-1" onClick={clearAllFilters}>
                            Сбросить
                          </Button>
                          <SheetClose asChild>
                            <Button className="flex-1 bg-amber-700 hover:bg-amber-800">Применить</Button>
                          </SheetClose>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort-by" className="text-sm whitespace-nowrap">
                    Элементов на странице:
                  </Label>
                  <Select value={itemsPerPage} onValueChange={handleElementChange}>
                    <SelectTrigger id="elem-count" className="h-9 w-[60px]">
                      <SelectValue placeholder="По умолчанию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort-by" className="text-sm whitespace-nowrap">
                    Сортировать:
                  </Label>
                  <Select value={sortOption} onValueChange={handleSortChange}>
                    <SelectTrigger id="sort-by" className="h-9 w-[180px]">
                      <SelectValue placeholder="По умолчанию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">По популярности</SelectItem>
                      <SelectItem value="price-asc">По возрастанию цены</SelectItem>
                      <SelectItem value="price-desc">По убыванию цены</SelectItem>
                      <SelectItem value="rating">По рейтингу</SelectItem>
                      <SelectItem value="new">Сначала новинки</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Десктопные фильтры (слева) */}
            <div className="hidden lg:block space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Фильтры</h2>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-auto p-0 text-sm text-amber-700 hover:text-amber-800 hover:bg-transparent"
                  >
                    Сбросить все
                  </Button>
                )}
              </div>

              {/* Категории */}
              <div>
                <h3 className="font-medium mb-3">Категории</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={activeCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="flex-1 text-sm cursor-pointer">
                        {category.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Цена */}
              <div>
                <h3 className="font-medium mb-3">Цена</h3>
                <div className="pl-1">
                  <Slider
                    min={0}
                    max={1000000}
                    step={1000}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="mb-6"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="price-from" className="text-xs mb-1 block">
                      От
                    </Label>
                    <Input
                      id="price-from"
                      type="number"
                      min={0}
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange([Number.parseInt(e.target.value), priceRange[1]])}
                      className="h-8"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="price-to" className="text-xs mb-1 block">
                      До
                    </Label>
                    <Input
                      id="price-to"
                      type="number"
                      min={priceRange[0]}
                      max={1000000}
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Цвет */}
              <div>
                <h3 className="font-medium mb-3">Цвет</h3>
                <div className="space-y-2">
                  {COLORS.map((color) => (
                    <div key={color.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`color-${color.id}`}
                        checked={activeColors.includes(color.id)}
                        onCheckedChange={() => handleColorChange(color.id)}
                      />
                      <Label htmlFor={`color-${color.id}`} className="flex-1 text-sm cursor-pointer">
                        {color.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Дополнительные фильтры */}
              <div>
                <h3 className="font-medium mb-3">Дополнительно</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="in-stock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) => handleInStockChange(checked === true)}
                    />
                    <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                      Только в наличии
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="new"
                      checked={onlyNew}
                      onCheckedChange={(checked) => handleNewChange(checked === true)}
                    />
                    <Label htmlFor="new" className="text-sm cursor-pointer">
                      Только новинки
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="bestsellers"
                      checked={onlyBestsellers}
                      onCheckedChange={(checked) => handleBestsellersChange(checked === true)}
                    />
                    <Label htmlFor="bestsellers" className="text-sm cursor-pointer">
                      Только бестселлеры
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Список товаров */}
            <div className="lg:col-span-3">
              {PRODUCTS.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {PRODUCTS.map((product) => (
                    
                    <Link key={product.id} href={`/product/${product.id}`} className="group">
                      <div className="overflow-hidden rounded-md border border-border/50 bg-card transition-all hover:border-amber-800/50 hover:shadow-md group-hover:shadow-amber-800/5">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={`${API_URL}/uploads/${product.images[0]?.file}` || "/placeholder.svg"}
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
                              <p className="text-white font-medium">Нет в наличии</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-base mb-1">{product.title}</h3>
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
                            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{product.price.toLocaleString()} ₽</p>
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
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <X className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Товары не найдены</h3>
                  <p className="text-muted-foreground mb-4">
                    По вашему запросу не найдено товаров. Попробуйте изменить параметры фильтрации.
                  </p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Сбросить все фильтры
                  </Button>
                </div>
              )}

              {/* Пагинация */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) handlePageChange(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1
                      const showEllipsisBefore = pageNumber > 2 && currentPage > 3 && pageNumber === 2
                      const showEllipsisAfter =
                        pageNumber < totalPages - 1 && currentPage < totalPages - 2 && pageNumber === totalPages - 1

                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                console.log(pageNumber)
                                handlePageChange(pageNumber)
                              }}
                              isActive={pageNumber === currentPage}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      } else if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }

                      return null
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) handlePageChange(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

