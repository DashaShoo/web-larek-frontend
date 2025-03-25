import {IApi, IOrder, IProductList, IProduct, IOrderResult} from "../types/index";
import { Api } from './base/api';

export class LarekAPI extends Api implements IApi {
    readonly cdn: string;
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn=cdn;
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