
import {Serializable} from "./serializable";
export type AttributeType = "OPTION" | "undefined"
export class AttributeTypes {
    public static get OPTION(): AttributeType {
        return "OPTION";
    }

    public static get asList(): AttributeType[] {
        return [AttributeTypes.OPTION];
    }
}

export const ProductAttributeName = "color";
export class ProductAttributes {
    static getNewColorAttribute(): ProductSelectableAttribute {
        return new ProductSelectableAttribute(AttributeTypes.OPTION, ProductAttributeName);
    }
}

export class ProductSelectableAttribute implements Serializable<ProductSelectableAttribute> {

    static newFromJSON(jsonObj: Object): ProductSelectableAttribute {
        return new ProductSelectableAttribute().deserialize(jsonObj);
    }

    constructor(public type?: AttributeType, public name?: string) {

    }


    deserialize(jsonObj: Object): ProductSelectableAttribute {
        return Object.assign(new ProductSelectableAttribute(), jsonObj);
    }

    get readableName() {
        if (this.name === "color") {
            return "Основной";
        }
        return this.name;
    }
}

export class OrderSelectedAttribute implements Serializable<OrderSelectedAttribute> {

    static newFromJSON(jsonObj: Object): OrderSelectedAttribute {
        return new OrderSelectedAttribute().deserialize(jsonObj);
    }

    constructor(public attribute?: ProductSelectableAttribute, public value?: any) {

    }


    deserialize(jsonObj: Object) {
        let o = Object.assign(new OrderSelectedAttribute(), jsonObj);
        o.attribute = ProductSelectableAttribute.newFromJSON(o.attribute);
        return o;
    }
}

export class ProductSelectableAttributeList implements Serializable<ProductSelectableAttributeList> {
    private list: ProductSelectableAttribute[];

    static newFromJSON(jsonObj: Object): ProductSelectableAttributeList {
        return new ProductSelectableAttributeList().deserialize(jsonObj);
    }

    deserialize(jsonObj: Object): ProductSelectableAttributeList {
        let o = new ProductSelectableAttributeList();
        o.list = (<any>jsonObj).list || [];
        o.list.forEach((v, k) => {
            o.list[k] = ProductSelectableAttribute.newFromJSON(v);
        });
        return o;
    }

    constructor(list?: ProductSelectableAttribute[]) {
        this.list = list || [];
    }

    get length() {
        return this.list.length;
    }

    push(a: ProductSelectableAttribute) {
        this.list.push(a);
    }

    getList(): ProductSelectableAttribute[] {
        return this.list;
    }

    getByName(n: string): ProductSelectableAttribute {
        for (let idx in this.list) {
            if (this.list[idx].name === n) {
                return this.list[idx];
            }
        }
        return null;
    }

    reset() {
        this.list = [];
    }

    resetToDefaultAttributes() {
        this.reset();
        this.list.push(ProductAttributes.getNewColorAttribute());
    }

}


export class OrderSelectedAttributeList implements Serializable<OrderSelectedAttributeList> {
    private list: OrderSelectedAttribute[];

    static newFromJSON(jsonObj: Object): OrderSelectedAttributeList {
        return new OrderSelectedAttributeList().deserialize(jsonObj);
    }

    deserialize(jsonObj: Object): OrderSelectedAttributeList {
        let o = new OrderSelectedAttributeList();
        o.list = (<any>jsonObj).list || [];
        o.list.forEach((v, k) => {
            o.list[k] = OrderSelectedAttribute.newFromJSON(v);
        });
        return o;
    }

    constructor(list?: OrderSelectedAttribute[]) {
        this.list = list || [];
    }

    getByName(n: string): OrderSelectedAttribute {
        for (let idx in this.list) {
            if (this.list[idx].attribute.name === n) {
                return this.list[idx];
            }
        }
        return null;
    }

    get length() {
        return this.list.length;
    }

    push(a: OrderSelectedAttribute) {
        this.list.push(a);
    }

    update(a: OrderSelectedAttribute) {
        this.list.forEach((v, k) => {
            if (v.attribute.name === a.attribute.name) {
                v.value = a.value;
            }
        });
    }

    getList(): OrderSelectedAttribute[] {
        return this.list;
    }

    get hashCode() {
        let key = ":";

        let namelist = this.list.map(v => v.attribute.name);
        let revdict = {};
        namelist.forEach((v, k) => {
            revdict[v] = k;
        });
        namelist.sort();
        let idx = [];
        namelist.forEach(v => {
            idx.push(revdict[v]);
        });

        idx.forEach(k => {
            let v = this.list[k];
            key += v.attribute.name + "-" + v.value.toString() + ":";
        })
        return key;
    }

    private _hashStr(str: string): number {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            let ch = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

}

export const ColorOptions = Array.apply(null, Array(31)).map(function (_, i) {
    return i;
});
