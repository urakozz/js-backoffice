interface Serializable<T> {
    deserialize(input: Object): T;
}

export class User implements Serializable<User> {
    name: string;
    password: string;
    realname: string;
    address: Address[];
    orders: string[];
    uuid: string;
    _rev: string;

    static newFromJSON(jsonObj: Object): User {
        return new User().deserialize(jsonObj);
    }

    constructor() {
    }


    deserialize(o): User {
        o.orders = Array.isArray(o.orders) ? o.orders : [];
        o.address = Array.isArray(o.address) ? o.address : [];
        o.address = o.address.map(a => Address.newFromJSON(a));
        return Object.assign(new User(), o);
    }

    addOrderID(id: string) {
        this.orders.push(id);
    }

    addAddress(a: Address) {
        if (a.default) {
            this.address.forEach(a => {
                a.default = false;
            });
        }
        this.address.push(a);
    }

    removeAddress(i: number) {
        if (this.address.length < i) {
            throw new Error("invalid address position");
        }
        if (this.address[i].default) {
            throw new Error("unable delete default address");
        }
        this.address = this.address.filter((_, ix) => ix !== i);
    }
}

export class RegisterUser extends User {
    type: string = "user";
    roles: string[] = [];

    constructor(u: User) {
        super();
        this._rev = u._rev;
        this.name = u.name;
        this.address = u.address;
        this.password = u.password;
        this.realname = u.realname;
        this.uuid = u.uuid;
    }
}

export class LoginUser extends User {

    constructor(u: User) {
        super();
        this.name = u.name;
        this.password = u.password;
    }
}

export class Address implements Serializable<Address> {
    zip: string;
    city: string;
    address: string;
    address2: string;
    default: boolean;
    fullname: string;

    static newFromJSON(jsonObj: Object): Address {
        return new Address().deserialize(jsonObj);
    }

    constructor(def?: boolean) {
        if (def) {
            this.default = true;
        }
    }

    deserialize(o): Address {
        return Object.assign(new Address(), o);
    }

    toString() {
        return [this.fullname, this.zip, this.city, (this.address + " " + (this.address2 || ""))].join(", ");
    }

}