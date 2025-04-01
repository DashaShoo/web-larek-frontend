import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekAPI } from './components/LarekAPI';
import {IApi, IOrder, IProductList, IProduct, IOrderResult, Payment, IOrderForm, IContacts} from "./types/index";
import { EventEmitter } from './components/base/events';
import { AppState, ProductItem } from './components/AppData';
import { Card , IBasketElement, BasketElement} from './components/Card';
import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import {Modal} from "./components/common/Modal";
import {Form} from "./components/common/Form";
import {Basket} from "./components/Basket";
import {Order} from "./components/Order";
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';


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
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);


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


events.on('order:open', () => {
	appData.order.items = appData.basket.map((item) => item.id);
	appData.order.total = appData.basket.reduce((sum, item) => item.price + sum, 0);

	console.log(appData.order);

	modal.render({
		content: order.render({
			payment: 'online',
			address: '',
			valid: false,
			errors: []
		}),
	});
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm; value: string & Payment }) => {
	appData.setOrderField(data.field, data.value);
});


events.on('formOrderErrors:change', (errors: Partial<IOrderForm>) => {
	const { address } = errors;
	order.valid = !address;
	order.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('; ');
});


events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});


events.on('formContactsErrors:change', (errors: Partial<IContacts>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContacts; value: string }) => {
	appData.setContactsField(data.field, data.value);
});


events.on('contacts:submit', () => {
	api
		.postOrder(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.setTotal(result.total);
			modal.render({
				content: success.render({}),
			});

			appData.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
});



api.getProductList()
    .then((products: IProductList) => {
		appData.setGallery(products);
	})
    .catch(err => {
        console.error(err);
    });