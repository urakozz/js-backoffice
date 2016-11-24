import {Component, OnInit, ElementRef} from '@angular/core';
import {OrderStatuses, OrderStatus, OrderStatusName} from "../_models/enums/order-status.enum";
import {Order} from "../_models/order";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CartService} from "../_services/cart.service";
import {BackendOrderService} from "../_services/backend-order.service";
import {OrderService, StateAutomataConfig} from "../_services/order.service";
import {UserService} from "../_services/user.service";
import {MdDialog} from "@angular/material";
import {Observable, Subscription, Subject} from "rxjs";

interface OrdersQueryAttributes {
    user: string;
    status: OrderStatus;
}

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
    private ordersAll: Order[] = [];
    private loading: boolean = true;

    protected filterQueryActive: OrdersQueryAttributes = {user: "", status: null};
    protected modelUser;
    protected orders: Order[] = [];

    private _subscription: Subscription;
    private _filterQuery: Observable<OrdersQueryAttributes>;

    constructor(private _router: Router,
                private _backend: BackendOrderService,
                private _basket: CartService,
                private _orderService: OrderService,
                private _userService: UserService,
                public route: ActivatedRoute,
                public dialog: MdDialog,
                public element: ElementRef) {

        this._filterQuery = this.route.queryParams
            .map((params: Params) => {
                let status = <OrderStatus>params['status'];
                return {
                    status: (OrderStatuses.asList.indexOf(status) >= 0) ? status : null,
                    user: params['user'] || "",
                };
            })
            .distinctUntilChanged();
    }

    ngOnInit() {
        this._filterQuery.first().subscribe((q) => {
            this.modelUser = q.user;
        });

        this._subscription = this._userService.getUserStream().switchMap(u => {
            return this._getOrders()
        }).switchMap((o: Order[]) => {
            this._setAllOrders(o);
            this.loading = false;
            return this._filterQuery;
        }).subscribe((o: OrdersQueryAttributes) => {
            this.filterQueryActive = o;
            this._filterVisibleOrders(o);
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    changeName(v) {
        this._navigate({user: v, status: this.filterQueryActive.status})
    }

    changeFilterStatus(s: OrderStatus) {
        let status = (s === this.filterQueryActive.status) ? null : s;
        this._navigate({user: this.filterQueryActive.user, status: status})
    }

    private _navigate(q: OrdersQueryAttributes) {
        this._router.navigate(["/orders"], {queryParams: q});
    }

    // refresh() {
    //     this.loading = true;
    //     this._loadAndFilterOrders().subscribe((o: Order[]) => {
    //         this.loading = false;
    //     })
    // }

    // private _loadAndFilterOrders() {
    //     return this._getOrders().switchMap((o: Order[]) => {
    //         this._setAllOrders(o);
    //         this._updateVisibleOrders();
    //         return Observable.of(o)
    //     })
    // }

    getStatusName(s: OrderStatus): string {
        return OrderStatusName.getName(s)
    }

    getStatusActionName(s: OrderStatus): string {
        return OrderStatusName.getActionName(s)
    }

    delete(c: Order, orderc: any) {
        orderc.__loading = true;
        this._backend.delete(c).switchMap(b => {
            return this._getOrders()
        }).subscribe((o: Order[]) => {
            this._setAllOrders(o);
            this._filterVisibleOrders(this.filterQueryActive);
        }, err => {
            console.log("Orders: delete err:", err);
            orderc.__loading = false
        })
    }

    getReadableTime(o) {
        if (!o.details) {
            return "-";
        }
        if (!o.details.date) {
            return "-";
        }
        return new Date(o.details.date).toLocaleDateString() + " " + new Date(o.details.date).toLocaleTimeString()
    }

    getTitle(c: Order) {
        if (!this.isConfirmed(c)) {
            return "Unconfirmed cart";
        }
        if (c.details.name) {
            return c.details.name;
        }
        let d = new Date(c.details.date);
        return d.toLocaleDateString() + " " + c.authorName
    }


    changeOrderStatus(c: Order, s: OrderStatus, orderc: any) {
        orderc.__loading = true;
        this._orderService.changeStatus(c, s);
        Observable.of(false).delay(1000).subscribe(b => {
            c.status = s;
            orderc.__loading = b;
        })
    }

    isConfirmed(c: Order) {
        return c.status !== OrderStatuses.CART
    }

    isActive(c: Order) {
        return c.uuid === this._basket.getOrder().uuid
    }

    getPossibleStatuses(c: Order) {
        return StateAutomataConfig.getPossibleStatuses(c, this._userService)
    }

    get isAdmin() {
        return this._userService.isAdmin
    }

    get statusList() {
        return OrderStatuses.asList.filter(s => s !== OrderStatuses.CART);
    }

    private _setAllOrders(o: Order[]) {
        if (!o.length) {
            return
        }
        this.ordersAll = o
    }

    private _filterVisibleOrders(q: OrdersQueryAttributes) {
        let o = this.ordersAll;
        if (q.user) {
            o = o.filter((c: Order) => c.authorName === q.user);
        }
        if (q.status) {
            o = o.filter((c: Order) => c.status === q.status);
        }
        this.orders = o;
    }

    private _getOrders(): Observable<Order[]> {
        let obs = this._backend.getAllOrders();
        if (!this._userService.isAdmin) {
            obs = this._backend.getUserOrders(this._userService.getUser().name)
        }
        return obs.switchMap((o: Order[])=> {
            if (!this._userService.isAdmin) {
                o = o.filter((c: Order) => this.isConfirmed(c))
            }
            o = o.sort(function (a, b) {
                let adate = a.details ? new Date(a.details.date).getTime() : new Date().getTime();
                let bdate = b.details ? new Date(b.details.date).getTime() : new Date().getTime();
                return bdate - adate;
            });
            return Observable.of(o)
        })
    }

}
