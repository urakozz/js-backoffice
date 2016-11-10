import {Component, OnInit, ElementRef} from '@angular/core';
import {OrderStatuses, OrderStatus, OrderStatusName} from "../_models/enums/order-status.enum";
import {Order} from "../_models/order";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CartService} from "../_services/cart.service";
import {BackendOrderService} from "../_services/backend-order.service";
import {OrderService, StateAutomataConfig} from "../_services/order.service";
import {UserService} from "../_services/user.service";
import {MdDialog} from "@angular/material";
import {Location} from "@angular/common";
import {Observable} from "rxjs";
import * as Numeral from "numeral";

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
    private orders: Order[] = [];
    private ordersAll: Order[] = [];
    private loading: boolean = true;

    protected selectedStatus: OrderStatus;
    protected statusList: OrderStatus[] = OrderStatuses.asList.filter(s => s !== OrderStatuses.CART);

    constructor(private _router: Router,
                private _backend: BackendOrderService,
                private _basket: CartService,
                private _orderService: OrderService,
                private _userService: UserService,
                private _location: Location,
                public route: ActivatedRoute,
                public dialog: MdDialog,
                public element: ElementRef) {
    }

    ngOnInit() {

        let status: OrderStatus = undefined;
        this.route.params.forEach((params: Params) => {
            status = <OrderStatus>params['status'];
        });

        Observable.of(this._userService.getUser()).switchMap(u=> {
            console.log("Orders, user", u);
            if (!u) {
                console.log("Orders, listen login stream");
                return this._userService.getLoginStream()
            }
            return Observable.of(u)
        }).first().switchMap(u=> {
            console.log("Orders, have user", u);
            if (OrderStatuses.asList.indexOf(status) == -1) {
                status = undefined
            }
            return this._loadAndFilterOrders()
        }).subscribe((o: Order[]) => {
            this.loading = false
        })
    }

    changeFilterStatus(s: OrderStatus){
        if(s === this.selectedStatus) {
            this.selectedStatus = undefined
        } else {
            this.selectedStatus = s
        }
        this._location.go("/orders", "status=" + this.selectedStatus);
        this._updateVisibleOrders()
    }

    refresh() {
        this.loading = true;
        this._loadAndFilterOrders().subscribe((o: Order[]) => {
            this.loading = false;
        })
    }

    private _loadAndFilterOrders() {
        return this._getOrders().switchMap((o: Order[]) => {
            this._updateAllOrders(o);
            this._updateVisibleOrders();
            return Observable.of(o)
        })
    }

    getStatusName(s: OrderStatus): string {
        return OrderStatusName.getName(s)
    }

    getStatusActionName(s: OrderStatus): string {
        return OrderStatusName.getActionName(s)
    }

    delete(c: Order, orderc: any) {
        orderc.__loading = true
        this._backend.delete(c).switchMap(b => {
            return this._getOrders()
        }).subscribe((o: Order[]) => {
            this._updateAllOrders(o);
            this._updateVisibleOrders();
        }, err => {
            console.log("Orders: delete err:", err);
            orderc.__loading = false
        })
    }

    getReadableTime(o){
        if(!o.details) {
            return "-";
        }
        if(!o.details.date) {
            return "-";
        }
        return new Date(o.details.date).toLocaleDateString() + " " + new Date(o.details.date).toLocaleTimeString()
    }

    getTitle(c:Order){
        if(!this.isConfirmed(c)){
            return "Unconfirmed cart";
        }
        if(c.details.name) {
            return c.details.name;
        }
        let d = new Date(c.details.date);
        return d.toLocaleDateString() + " " + c.authorName
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

    private _updateAllOrders(o: Order[]) {
        if (!o.length) {
            return
        }
        this.ordersAll = o
    }

    private _updateVisibleOrders() {
        if (!this.selectedStatus) {
            this.orders = this.ordersAll;
            return
        }
        this.orders = this.ordersAll.filter((c: Order) => c.status === this.selectedStatus)
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

    changeOrderStatus(c:Order, s: OrderStatus, orderc:any){
        orderc.__loading = true;
        this._orderService.changeStatus(c, s);
        Observable.of(false).delay(1000).subscribe(b =>{
            c.status = s;
            orderc.__loading = b;
        })
    }

}
