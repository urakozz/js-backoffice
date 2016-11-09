import {Injectable} from "@angular/core";
import {Order, OrderDetails} from "../_models/order";
import {OrderService} from "./order.service";
import {UserService} from "./user.service";
import {BackendOrderService} from "./backend-order.service";
import {User} from "../_models/user";
import {Observable} from "rxjs";
import {OrderStatuses, OrderStatus} from "../_models/enums/order-status.enum";
import {Product} from "../_models/product";
import {OrderSelectedAttributeList} from "../_models/category";

@Injectable()
export class CartService {

    private LSKey = "cartUuid";

    protected cart: Order = new Order(undefined);

    constructor(private backend: BackendOrderService,
                private service: OrderService,
                private userService: UserService) {

        Observable.concat(Observable.of(userService.getUser()), userService.getLoginStream())
            .filter((u: User) => !!u)
            .subscribe((u: User) => {
                this.cart = new Order(u.name);
                this._initFromLocal();
                console.log("stream, cart for", u);
            });
    }

    private _initFromLocal() {
        let uuid = localStorage.getItem(this.LSKey);
        if (uuid) {
            this._loadLocalCart(uuid);
        } else {
            this._loadLastCart();
        }
    }

    private _loadLocalCart(uuid) {
        console.log("loc uuid", uuid);
        this.backend.getOrder(uuid).switchMap(c => {
            if (c.authorName !== this.userService.getUser().name) {
                throw new Error("cart belongs to other user");
            }
            return Observable.of(c);
        }).subscribe(c => {
            this.setCart(c);
        }, err => {
            localStorage.removeItem(this.LSKey);
        });
    }

    private _loadLastCart() {
        this.backend.getUserOrders(this.userService.getUser().name).switchMap((o: Order[]) => {
            o = o.filter((c: Order) => c.status === OrderStatuses.CART);
            if (o.length === 0) {
                return Observable.empty();
            }
            return Observable.of(o[0]);
        }).subscribe((c: Order) => {
            this.setCart(c);
        });
    }

    changeStatus(s: OrderStatus) {
        this.service.changeStatus(this.cart, s);
    }

    setDetails(c: OrderDetails) {
        this.cart.setDetails(c);
    }

    setCart(c: Order) {
        this.cart = c;
        localStorage.setItem(this.LSKey, this.cart.uuid);
    }


    add(p: Product, l: OrderSelectedAttributeList, q?: number) {
        this.cart.add(p, l, q);
        this.persist();
    }


    changeAmount2(p: Product, l: OrderSelectedAttributeList, q?: number) {
        this.cart.changeAmount(p, l, q);
        this.persist();
    }

    clear() {
        this.cart.clear();
        this.persist();
    }

    /**
     * @deprecated
     * @returns {Order}
     */
    getCart(): Order {
        return this.getOrder();
    }

    getOrder() {
        return this.cart;
    }

    get count() {
        let i = 0;
        let items = this.getOrder().getItems();
        Object.keys(items).forEach(k => {
            i = i + items[k].amount;
        });
        return i;
    }

    get cost() {
        let i = 0;
        let items = this.getOrder().getItems();
        Object.keys(items).forEach(k => {
            i = i + (items[k].amount * items[k].product.price);
        });
        return i;
    }

    get asList() {
        return this.cart.asList;
    }

    isEmpty(): boolean {
        return Object.keys(this.cart.getItems()).length === 0;
    }

    hasDetails() {
        return this.cart.details !== undefined;
    }

    persist() {
        localStorage.setItem(this.LSKey, this.cart.uuid);
        this.service.persist(this.cart);
    }
}
