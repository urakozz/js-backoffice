import {Injectable} from '@angular/core';
import {CategoryName} from "../_models/enums/category.enum";
import {OrderItem} from "../_models/order-item";
import {Order} from "../_models/order";
import {Product} from "../_models/product";

@Injectable()
export class MetrikaService {

    constructor() {
    }

    static _detail(item: Product) {
        let data = {
            "ecommerce": {
                "currencyCode": "RUB",
                "detail": {
                    "products": [{
                        "id": item.sku,
                        "name": item.name,
                        "price": item.getPrice(),
                        "category": CategoryName[item.getCategories()[0]] || "default"
                    }]
                }
            }
        };
        window.dataLayer.push(data);
    }

    static _add(item: Product, quantity: number) {
        let data = {
            "ecommerce": {
                "currencyCode": "RUB",
                "add": {
                    "products": [{
                        "id": item.sku,
                        "name": item.name,
                        "price": item.getPrice(),
                        "category": CategoryName[item.getCategories()[0]] || "default",
                        "quantity": quantity
                    }]
                }
            }
        };
        window.dataLayer.push(data)
    }

    static _remove(item: Product, quantity?: number){
        window.dataLayer.push({
            "ecommerce": {
                "currencyCode": "RUB",
                "remove": {
                    "products": [{
                        "id": item.sku,
                        "name": item.name,
                        "price": item.getPrice(),
                        "category": CategoryName[item.getCategories()[0]] || "default",
                        "quantity": quantity || 1
                    }]
                }
            }
        });
    }

    static _purchase(order: Order) {
        let data = {
            "ecommerce": {
                "currencyCode": "RUB",
                "purchase": {
                    "actionField": {
                        "id": order.uuid
                    },
                    "products": order.asList.map((o: OrderItem) => {
                        return {
                            "id": o.product.sku,
                            "name": o.product.name,
                            "price": o.product.getPrice(),
                            "category": CategoryName[o.product.getCategories()[0]] || "default",
                            "quantity": o.amount
                        };
                    })
                }
            }
        };
        window.dataLayer.push(data);
    }


}
