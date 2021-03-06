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
import {OrderItem} from "../_models/order-item";
import {LocalStorageService} from "./local-storage.service";

@Injectable()
export class CartService {

    private LSKey = "cartUuid";

    protected cart: Order = new Order(undefined);

    constructor(private backend: BackendOrderService,
                private service: OrderService,
                private userService: UserService,
                private ls: LocalStorageService) {

        userService.getLoginStream().startWith(userService.getUser())
            .filter((u: User) => !!u)
            .subscribe((u: User) => {
                this.cart = new Order(u.name);
                this._AwesomeInitFromLocal();
                console.log("stream, cart for", u);
            });
    }


    private _AwesomeInitFromLocal() {
        this._loadLocalCartObservable(this.ls.getItem(this.LSKey)).catch((e: Error) => {
            this.ls.removeItem(this.LSKey);
            return this._loadLastCartObservable()
        }).subscribe((c:Order) => {
            this.setCart(c);
        })
    }

    private _loadLocalCartObservable(uuid): Observable<Order> {
        if (!uuid) {
            return Observable.throw(new Error("empty uuid"))
        }
        return this.backend.getOrder(uuid).switchMap(c => {
            if (c.authorName === this.userService.getUser().name) {
                return Observable.of(c);
            }
            if (this.userService.isAdmin) {
                return Observable.of(c);
            }
            return Observable.throw(new Error("cart belongs to other user"));
        })
    }

    private _loadLastCartObservable(): Observable<Order> {
        return this.backend.getUserOrders(this.userService.getUser().name).switchMap((o: Order[]) => {
            o = o.filter((c: Order) => c.status === OrderStatuses.CART);
            if (o.length === 0) {
                return Observable.empty();
            }
            return Observable.of(o[0]);
        })
    }

    changeStatus(s: OrderStatus) {
        this.service.changeStatus(this.cart, s);
    }

    setDetails(c: OrderDetails) {
        this.cart.setDetails(c);
    }

    setCart(c: Order) {
        this.cart = c;
        this.ls.setItem(this.LSKey, this.cart.uuid);
    }


    add(p: Product, l: OrderSelectedAttributeList, q?: number) {
        this.cart.add(p, l.clone(), q);
        this.persist();
    }

    clear() {
        this.cart.clear();
        this.persist();
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

    get asList():OrderItem[] {
        return this.cart.asList;
    }

    isEmpty(): boolean {
        return Object.keys(this.cart.getItems()).length === 0;
    }

    hasDetails() {
        return this.cart.details !== undefined;
    }

    persist() {
        this.ls.setItem(this.LSKey, this.cart.uuid);
        this.service.persist(this.cart);
    }
}
