import {IPage} from "../types/index";
import {IEvents} from "./base/events";
import {Component} from "./base/Component";

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _gallery: HTMLElement;
    protected _basket: HTMLButtonElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = this.container.querySelector('.header__basket-counter');
        this._gallery = this.container.querySelector('.gallery');
        this._basket = this.container.querySelector('.header__basket');
        this._wrapper = this.container.querySelector('.page__wrapper');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, value);
    }

    set gallery(products: HTMLElement[]) {
        this._gallery.replaceChildren(...products);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}