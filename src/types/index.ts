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


export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
	generateOrderFromCart(cart: ICart): string;
}

export interface IOrderResult {
	id: string;
    total: number;
}

export interface IApi {
	getProductList(): Promise<IProductList>;
	getProduct(id: string): Promise<IProduct>;
	postOrder(order: IOrder): Promise<IOrderResult>;
}
