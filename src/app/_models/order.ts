import {Address} from "./user";
import {Serializable} from "./serializable";
import {OrderStatus, OrderStatuses} from "./enums/order-status.enum";
import {OrderItem} from "./order-item";
import {Uuid} from "../_infrastructure/uuid";
import {Product} from "./product";
import {OrderSelectedAttributeList, ProductAttributes, OrderSelectedAttribute} from "./category";

export class Order {
    uuid: string;
    _rev: string;
    items: {[key: string]: OrderItem} = {};
    details: OrderDetails;
    authorName: string;
    status: OrderStatus;

    static newFromJSON(jsonObj): Order {
        return new Order(jsonObj.authorName).deserialize(jsonObj);
    }

    constructor(authorName?: string) {
        this.authorName = authorName;
        this.status = OrderStatuses.CART;
        this.ensureUuid();
    }


    deserialize(jsonObj: Object) {
        let o = Object.assign(new Order(), jsonObj);
        o.items = o.items || {};
        o.details = o.details || undefined;
        o.status = o.status || OrderStatuses.CART;

        o._processItems();
        o._processDetails();
        return o;
    }

    ensureUuid() {
        this.uuid = this.uuid || Uuid.random();
    }

    _processItems() {
        Object.keys(this.items).forEach(k => {
            if (!(this.items[k] instanceof OrderItem)) {
                this.items[k] = OrderItem.newFromJSON(this.items[k]);
            }
            // Migration
            let key = this._getKey(this.items[k].product, this.items[k].selectedAttributes);
            if (key !== k) {
                this.items[key] = this.items[k];
                delete(this.items[k]);
            }
        });
    }

    _processDetails() {
        if (!this.details) {
            return;
        }
        if (!(this.details instanceof OrderDetails)) {
            this.details = OrderDetails.newFromJSON(this.details);
        }
    }

    setDetails(c: OrderDetails) {
        this.details = c;
    }

    add(p: Product, attributes: OrderSelectedAttributeList, q?: number) {
        if (q <= 0) {
            q = 1;
        }
        if (!attributes || (!attributes.getByName("color") && attributes.length === 0)) {
            attributes.push(new OrderSelectedAttribute(
                ProductAttributes.getNewColorAttribute(),
                0
            ));
        }
        let bi = new OrderItem();
        let key = this._getKey(p, attributes);
        if (this.items[key]) {
            bi = this.items[key];
            bi.amount = Number(q) + Number(bi.amount);
        } else {
            bi.amount = Number(q);
            bi.product = p;
            bi.selectedAttributes = attributes;
            this.items[key] = bi;
        }

    }

    changeAmount(p: Product, attributes: OrderSelectedAttributeList, q?: number) {
        if (q < 0) {
            q = 0;
        }
        let key = this._getKey(p, attributes);
        if (this.items[key]) {
            let bi = this.items[key];
            bi.amount = q;
            if (q <= 0) {
                delete this.items[key];
            }
        }
    }

    _getKey(p: Product, attributes: OrderSelectedAttributeList): string {
        return p.id.toString() + ":" + attributes.hashCode;
    }

    clear() {
        this.items = {};
    }

    isEmpty(): boolean {
        return Object.keys(this.items).length === 0;
    }

    getItems(): {[key: string]: OrderItem} {
        return this.items;
    }

    get asList(): OrderItem[] {
        let l = [];
        Object.keys(this.items).forEach(k => {
            l.push(this.items[k]);
        });
        return l;
    }

    get totalPrice() {
        return this.asList.reduce((caret, item) => caret + item.amount * item.product.price, 0)
    }
}


export class OrderDetails implements Serializable<OrderDetails> {
    name: string;
    date: string;
    address: Address;

    static newFromJSON(jsonObj: Object): OrderDetails {
        return new OrderDetails().deserialize(jsonObj);
    }

    deserialize(o) {
        let d = Object.assign(new OrderDetails(), o);
        if (o.address instanceof Object) {
            d.address = Address.newFromJSON(o.address);
        }
        return d;
    }
}
