import {IApi, IOrder, IProductList, IProduct, IOrderResult} from "../types/index";
import { Api } from './base/api';

export class LarekAPI extends Api implements IApi {
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    getProductList(): Promise<IProductList> {
        return this.get(`/product`).then((products: IProductList) => ({
            ...products,
        }));
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then((product: IProduct) => product);
    }

    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.post(`/order`, order).then((res: IOrderResult) => res);
    }

}