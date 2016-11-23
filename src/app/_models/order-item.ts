import {Product} from "./product";

import {Serializable} from "./serializable";
import {OrderSelectedAttributeList, ProductAttributes, OrderSelectedAttribute} from "./category";

export class OrderItem implements Serializable<OrderItem> {
    amount: number;
    product: Product;
    selectedAttributes: OrderSelectedAttributeList;


    static newFromJSON(jsonObj: Object): OrderItem {
        return new OrderItem().deserialize(jsonObj);
    }

    constructor() {
        this.selectedAttributes = new OrderSelectedAttributeList()
    }

    deserialize(jsonObj: Object): OrderItem {
        let o = new OrderItem();
        o.product = new Product().deserialize(jsonObj["product"]);
        o.amount = parseInt(jsonObj["amount"], 10);
        if (jsonObj["selectedAttributes"]) {
            o.selectedAttributes = OrderSelectedAttributeList.newFromJSON(jsonObj["selectedAttributes"]);
        } else if (jsonObj["color"] !== undefined) {
            o.migrateColor(parseInt(jsonObj["color"], 10));
        }

        return o;
    }

    protected migrateColor(c: number) {
        let attr = this.selectedAttributes.getByName("color");
        if (!attr || attr.value !== c) {
            this.selectedAttributes.push(new OrderSelectedAttribute(
                ProductAttributes.getNewColorAttribute(),
                c
            ));
        }
    }

    hasSelectableAttributes(): boolean {
        return this.selectedAttributes && this.selectedAttributes.length > 0;
    }
}
