import {Serializable} from "./serializable";

export class User implements Serializable<User> {
    name: string;
    password: string;
    realname: string;
    linkVk: string;
    address: Address[];
    uuid: string;
    active: boolean;
    _rev: string;
    details: any;

    constructor() {
    }


    deserialize(o): User {
        o.details = o.details || {};
        o.address = Array.isArray(o.address) ? o.address : [];
        o.address = o.address.map(a => new Address().deserialize(a));
        return Object.assign(new User(), o);
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

export class SaveUser extends User {
    type: string = "user";
    roles: string[] = [];

    constructor(u: User) {
        super();
        this._rev = u._rev;
        this.name = u.name;
        this.active = u.active;
        this.address = u.address;
        this.password = u.password;
        this.realname = u.realname;
        this.uuid = u.uuid;
        this.details = u.details;
    }
}

export interface LoginUserInterface {
    name: string;
    password: string;
}

export class LoginUser extends User {

    constructor(u: LoginUserInterface) {
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
