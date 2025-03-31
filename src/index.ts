import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekAPI } from './components/LarekAPI';
import {IApi, IOrder, IProductList, IProduct, IOrderResult} from "./types/index";
import { EventEmitter } from './components/base/events';
import { AppState, ProductItem } from './components/AppData';
import { Card , IBasketElement, BasketElement} from './components/Card';
import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import {Modal} from "./components/common/Modal";
import {Form} from "./components/common/Form";
import {Basket} from "./components/Basket"


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
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);


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

events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: ProductItem) => {
	const showItem = (item: ProductItem) => {
		const product = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('basket:push', item),
		});

		modal.render({
			content: product.render({
				title: item.title,
				image: api.cdn + item.image,
				category: item.category,
				description: item.description,
				price: item.price,
				disabled: !item.price || appData.hasInBasket(item.id) ? true : false,
			}),
		});
	};

	if (item) {
		api
			.getProduct(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});


events.on('basket:push', (item: ProductItem) => {
	appData.addProduct({
		id: item.id,
		index: appData.basket.length,
		title: item.title,
		price: item.price,
	});
	page.counter = appData.basket.length;
	modal.close();
	
});



events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basket.render({
				products: appData.basket.reduce((array, item: IBasketElement, i) => {
					const cardBasket = new BasketElement(cloneTemplate(cardBasketTemplate), events);
					return [
						...array,
						cardBasket.render({
							index: i + 1,
							title: item.title,
							price: item.price,
						}),
					];
				}, []),
				total: appData.basket.reduce((total, item) => total + item.price, 0),
			}),
		]),
	});
});

events.on('basket:delete', (item: IBasketElement) => {
	appData.deleteProduct(item.index);
	page.counter = appData.basket.length;
});



api.getProductList()
    .then((products: IProductList) => {
		appData.setGallery(products);
	})
    .catch(err => {
        console.error(err);
    });