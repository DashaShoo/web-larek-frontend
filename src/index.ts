import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekAPI } from './components/LarekAPI';
import {IApi, IOrder, IProductList, IProduct, IOrderResult} from "./types/index";
import { EventEmitter } from './components/base/events';
import { AppState, ProductItem } from './components/AppData';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';


const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);



const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');


events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});


const page = new Page(document.body, events);



events.on('items:changed', () => {
	page.gallery = appData.gallery.map((item: IProduct) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: api.cdn + item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		});
	});

	page.counter = appData.basket.length;
});



api.getProductList()
    .then((products: IProductList) => {
		appData.setGallery(products);
	})
    .catch(err => {
        console.error(err);
    });