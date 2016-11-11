import {CategoryType} from "./enums/category.enum";
import {ProductSelectableAttributeList, ProductAttributes, ProductAttributeName} from "./category";
import {Serializable} from "./serializable";


export class Product implements Serializable<Product> {
    id: string;
    price: number;
    name: string;
    sku: string;
    description: string;
    image: string;
    category: CategoryType;
    selectableAttributes: ProductSelectableAttributeList;
    _rev: string;

    static newFromJSON(jsonObj: Object): Product {
        return new Product().deserialize(jsonObj);
    }

    constructor() {
        this.selectableAttributes = new ProductSelectableAttributeList();
        this.applyDefaultAttributes();
    }


    deserialize(jsonObj: Object): Product {
        let p = new Product();
        for (let propName in jsonObj) {
            p[propName] = jsonObj[propName];
            if (propName === "category") {
                if (jsonObj[propName] === null || jsonObj[propName] === "") {
                    p[propName] = undefined;
                } else {
                    p[propName] = parseInt(jsonObj[propName], 10);
                }
            }
            if (propName === "selectableAttributes") {
                p[propName] = ProductSelectableAttributeList.newFromJSON(p[propName]);
            }
        }
        p.applyDefaultAttributes();
        return p;
    }

    hasOnlyDefaultAttributes():boolean{
        return this.selectableAttributes.length === 1 && !!this.selectableAttributes.getByName(ProductAttributeName)
    }

    private applyDefaultAttributes() {
        let attr = this.selectableAttributes.getByName(ProductAttributeName);
        if (!attr && this.selectableAttributes.length === 0) {
            this.selectableAttributes.push(ProductAttributes.getNewColorAttribute());
        }
    }

    getPrice(): number {
        return Number.parseFloat(<any>this.price);
    }
}
