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
    // category: CategoryType;
    categories: CategoryType[];
    sortingScore: number;
    selectableAttributes: ProductSelectableAttributeList;
    _rev: string;

    constructor() {
        this.selectableAttributes = new ProductSelectableAttributeList();
        this.categories = [];
        this.applyDefaultAttributes();
    }


    deserialize(jsonObj: Object): Product {
        let p = new Product();
        for (let propName in jsonObj) {
            p[propName] = jsonObj[propName];
            if (propName === "category") {
                if (jsonObj[propName] === null || jsonObj[propName] === "") {
                    jsonObj[propName] = null;
                } else {
                    jsonObj[propName] = Number.parseInt(jsonObj[propName]) || null;
                    p.categories = [jsonObj[propName]]
                }
            }
            if (propName === "categories" && Array.isArray(jsonObj["categories"])) {
                p.categories = jsonObj["categories"].map(v => Number.parseInt(v)).filter(v => !isNaN(v))
            }
            if (propName === "selectableAttributes") {
                p.selectableAttributes = ProductSelectableAttributeList.newFromJSON(p.selectableAttributes);
            }
        }
        p.sortingScore = Number.parseInt(<any>p.sortingScore) || 0;
        p.applyDefaultAttributes();
        return p;
    }

    hasOnlyDefaultAttributes(): boolean {
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


    getCategories(): CategoryType[] {
        return this.categories
    }
}
