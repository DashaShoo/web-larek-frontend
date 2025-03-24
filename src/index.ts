import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekAPI } from './components/LarekAPI';
import {IApi, IOrder, IProductList, IProduct, IOrderResult} from "./types/index";

const api = new LarekAPI(CDN_URL, API_URL);

api.getProductList()
    .then((products: IProductList) => console.log(products))
    .catch(err => {
        console.error(err);
    });