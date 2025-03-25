import { IBasketView } from "../types/index";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";
import { createElement } from '../utils/utils';
 
 
export class Basket extends Component<IBasketView> {
    protected _submit: HTMLButtonElement;
 	protected _price: HTMLElement;
 	protected _list: HTMLElement;
 
 	constructor(container: HTMLElement, protected events: EventEmitter) {
 		super(container);
 
 		this._submit = this.container.querySelector('.basket__button');
 		this._price = this.container.querySelector('.basket__price');
 		this._list = this.container.querySelector('.basket__list');
        if (this._submit) {
            this._submit.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
    }
 
    set products(products: HTMLElement[]) {
        if (products.length) {
            this._list.replaceChildren(...products);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста',
                })
            );
        }
    }

    set total(total: number) {
        this.setText(this._price, total);
    }
}