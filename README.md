# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

## Архитектура проекта
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

## Структура классов и интерфейсов:

### Интерфейс страницы
```ts
export interface IPage {
    counter: number;
    cart: ICart;
    products: IProductList;
}
```

### Интерфейс товара
```ts
export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
}
```

### Интерфейс списка товаров
```ts
export interface IProductList {
    items: IProduct[];
    setProductList(products: IProduct[]): void;
}
```

### Интерфейс корзины
```ts
export interface ICart {
    products: Map<string, IProduct>;
    total: number;
    addProduct(product: IProduct): void;
    removeProduct(product: IProduct): void;
    getProducts(): IProduct[];
    clearCart(): void;
}
```

### Интерфейс представления корзины
```ts
export interface IBasketView {
    products: HTMLElement[];
    total: number;
}
```

### Интерфейс заказа
```ts
export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
```

### Интерфейс результата заказа
```ts
export interface IOrderResult {
    id: string;
    total: number;
}
```

### Тип оплаты
```ts
export type Payment = 'online' | 'offline';
```

### Интерфейс формы заказа
```ts
export interface IOrderForm {
    payment: Payment;
    address: string;
}
```

### Интерфейс контактов
```ts
export interface IContacts {
    phone: string;
    email: string;
}
```

### Интерфейс API
```ts
export interface IApi {
    getProductList(): Promise<IProductList>;
    getProduct(id: string): Promise<IProduct>;
    postOrder(order: IOrder): Promise<IOrderResult>;
}
```

### Интерфейс состояния приложения
```ts
export interface IAppState {
    basket: IBasketView[];
    gallery: IProduct[];
    order: IOrder | null;
    loading: boolean;
}
```

### Ошибки формы заказа и контактов
```ts
export type formOrderErrors = Partial<Record<keyof IOrderForm, string>>;
export type formContactsErrors = Partial<Record<keyof IContacts, string>>;
```


## События (Events)

### `items:changed`
Триггерится при изменении списка товаров. Обновляет галерею товаров и счётчик корзины.

### `card:select`
Триггерится при выборе карточки товара. Устанавливает товар для предпросмотра.

### `preview:changed`
Триггерится при изменении предпросмотра товара. Загружает полное описание товара и открывает модальное окно.

### `modal:open` / `modal:close`
Блокирует и разблокирует страницу при открытии/закрытии модального окна.

### `basket:push`
Добавляет товар в корзину и обновляет счётчик товаров.

### `basket:open`
Открывает корзину в модальном окне.

### `basket:delete`
Удаляет товар из корзины и обновляет счётчик.

### `order:open`
Открывает форму заказа с текущими товарами корзины.

### `order:submit`
Открывает форму контактов перед отправкой заказа.

### `formOrderErrors:change` / `formContactsErrors:change`
Обновляет валидацию форм заказа и контактов.

### `contacts:submit`
Отправляет заказ на сервер и очищает корзину при успешном оформлении.

### `order.*:change` / `contacts.*:change`
Обрабатывает изменения полей в формах заказа и контактов.