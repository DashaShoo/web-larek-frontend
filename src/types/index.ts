export interface IPage {
	counter: number;
	cart: ICart;
	products: IProductList;
}

export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

export interface IProductList {
	items: IProduct[];
    setProductList(products: IProduct[]): void;
}

export interface ICart {
	products: Map<string, IProduct>;
    total: number;
	addProduct(product: IProduct): void;
	removeProduct(product: IProduct): void;
    getProducts(): IProduct[];
    clearCart(): void;
}
export interface IBasketView {
	products: HTMLElement[];
	total: number;
}


export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
	
}

export interface IOrderResult {
	id: string;
    total: number;
}

export type Payment = 'online' | 'offline';

export interface IOrderForm {
	payment: Payment;
	address: string;
}

export interface IContacts {
	phone: string;
	email: string;
}


export interface IApi {
	getProductList(): Promise<IProductList>;
	getProduct(id: string): Promise<IProduct>;
	postOrder(order: IOrder): Promise<IOrderResult>;
}

export interface IAppState {
	basket: IBasketView[];
	gallery: IProduct[];
	order: IOrder | null;
	loading: boolean;
}

export type formOrderErrors = Partial<Record<keyof IOrderForm, string>>;
export type formContactsErrors = Partial<Record<keyof IContacts, string>>;
