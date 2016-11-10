import {Component, OnInit, OnDestroy} from '@angular/core';
import {Params, ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {Observable, Subscription} from "rxjs";
import {BackendOrderService} from "../_services/backend-order.service";
import {Order, OrderDetails} from "../_models/order";
import {CartService} from "../_services/cart.service";
import {OrderItem} from "../_models/order-item";
import {User, Address} from "../_models/user";
import {OrderStatuses} from "../_models/enums/order-status.enum";

@Component({
    selector: 'app-cart-confirm',
    templateUrl: './cart-confirm.component.html',
    styleUrls: ['./cart-confirm.component.scss']
})
export class CartConfirmComponent implements OnInit, OnDestroy {

    private loading = true;
    private user: User = new User();
    private _subscription: Subscription;
    private address:Address;
    private name:string;

    constructor(protected userService: UserService,
                protected cart: CartService,
                protected route: ActivatedRoute,
                protected router: Router,
                protected backend: BackendOrderService) {
    }

    ngOnInit() {
        let id = "";
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
        });
        if(this.cart.getOrder().details){
            this.address = this.cart.getOrder().details.address;
            this.name = this.cart.getOrder().details.name;
        }
        this._subscription = this.userService.loadUser().subscribe(u => {
            this.user = u;
            this.user.address.forEach(a => {
                if(!this.address && a.default){
                    this.address = a
                }
            });
            this.loading = false;
        });

    }

    get isAdmin(){
        return this.userService.isAdmin
    }

    confirm(){
        this.loading = true;
        let d = new OrderDetails();
        d.name = this.name;
        d.address = this.address;
        d.date = new Date().toISOString();
        this.cart.setDetails(d);
        this.cart.changeStatus(OrderStatuses.NEW);

        Observable.of(false).delay(500).subscribe(b => {
            this.loading = false;
            this.cart.setCart(new Order(this.userService.getUser().name));
            this.router.navigate(["/orders"])
        })
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    listAttributes(item: OrderItem) {
        return item ? item.selectedAttributes.getList() : []
    }

    get cartUuid() {
        return this.cart ? this.cart.getOrder().uuid : undefined
    }

    get totalCost(): number {
        return this.cart.getOrder().asList.reduce((caret, item) => caret + item.amount * item.product.price, 0)
    }

    get addresses() {
        return this.user.address || [];
    }


}
