# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

##Архитектура проекта
Проект разработан с использованием архитектурного паттерна MVP (Model-View-Presenter). Данный подход позволяет разделить логику представления, управления данными и бизнес-логику, обеспечивая лучшую поддержку и тестируемость кода.

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## UML диаграмма

![UML](./src/images/UML.png)

## Структура классов и интерфейсов:
- IPage: Контейнер для всей страницы, объединяющий список товаров и корзину.
counter: number — счётчик товаров на странице.
cart: ICart — корзина с товарами.
products: IProductList — список товаров.
```
export interface IPage {
	counter: number;
	cart: ICart;
	products: IProductList;
}
```

- IProduct: Интерфейс описания товара с полями (id, название, описание, цена, категория, изображение).
id: string — уникальный идентификатор товара.
title: string — название товара.
description: string — описание товара.
category: string — категория товара.
price: number — цена товара.
image: string — ссылка на изображение товара.
```
export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}
```

- IProductList: Отвечает за управление списком товаров, позволяет обновлять каталог.
items: IProduct[] — массив товаров.
setProductList(products: IProduct[]): void — метод обновления списка товаров.
```
export interface IProductList {
	items: IProduct[];
    setProductList(products: IProduct[]): void;
}
```

- ICart: Управляет корзиной, добавлением/удалением товаров, подсчётом итоговой суммы.
products: Map<string, IProduct> — коллекция товаров в корзине.
total: number — итоговая сумма заказа.
addProduct(product: IProduct): void — добавляет товар в корзину.
removeProduct(product: IProduct): void — удаляет товар из корзины.
getProducts(): IProduct[] — возвращает список товаров в корзине.
clearCart(): void — очищает корзину.
```
export interface ICart {
	products: Map<string, IProduct>;
    total: number;
	addProduct(product: IProduct): void;
	removeProduct(product: IProduct): void;
    getProducts(): IProduct[];
    clearCart(): void;
}
```

- IOrder: Хранит данные о заказе, включая способ оплаты, адрес и список товаров.
payment: string — способ оплаты.
email: string — email покупателя.
phone: string — телефон покупателя.
address: string — адрес доставки.
total: number — итоговая сумма заказа.
items: string[] — список идентификаторов товаров в заказе.
generateOrderFromCart(cart: ICart): string — создаёт заказ на основе корзины.
```
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
	generateOrderFromCart(cart: ICart): string;
}
```

- IOrderResult: Отвечает за результат заказа, включая уникальный идентификатор.
id: string — уникальный идентификатор заказа.
total: number — итоговая сумма заказа.
```
export interface IOrderResult {
	id: string;
    total: number;
}
```

- IApi: Реализует работу с сервером (загрузка товаров, отправка заказа).
getProductList(): Promise<IProductList> — загружает список товаров.
getProduct(id: string): Promise<IProduct> — загружает товар по идентификатору.
postOrder(order: IOrder): Promise<IOrderResult> — отправляет заказ на сервер.
```
export interface IApi {
	getProductList(): Promise<IProductList>;
	getProduct(id: string): Promise<IProduct>;
	postOrder(order: IOrder): Promise<IOrderResult>;
}
```
