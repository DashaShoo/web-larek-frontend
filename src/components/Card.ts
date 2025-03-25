import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	id: string;
	title: string;
	description?: string | string[];
	image: string;
	category: string;
	price: number | null;
	disabled: boolean;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category?: HTMLElement;
	protected _price?: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__description`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set category(val: string) {
		this.setText(this._category, val);
		const categoryMap: { [key: string]: string } = {
			'софт-скил': 'soft',
			'дополнительное': 'additional',
			'другое': 'other',
			'кнопка': 'button',
			'хард-скил': 'hard',
		};

		const category = categoryMap[val] || '';
		this._category.classList.add(`card__category_${category}`);
	}

	set price(val: number | null) {
		if (val) {
			this.setText(this._price, `${val} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
		}
	}

	set disabled(flag: boolean) {
		this._button.disabled = flag;
	}
}



export interface IBasketElement {
	id: string;
	index: number;
	title: string;
	price: number;
}

export class BasketElement extends Component<IBasketElement> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._index = this.container.querySelector('.basket__item-index');
		this._price = this.container.querySelector('.card__price');
		this._title = this.container.querySelector('.card__title');
		this._button = this.container.querySelector('.basket__item-delete');

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('basket:delete', { index: Number(this._index.textContent) });
			});
		}
	}

	set index(val: number) {
		this.setText(this._index, val);
	}

	set title(title: string) {
		this.setText(this._title, title);
	}
	set price(val: number) {
		this.setText(this._price, `${val} синапсов`);
	}
}