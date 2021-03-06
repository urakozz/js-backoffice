import {Component, OnInit, OnDestroy} from "@angular/core";
import {Params, ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {Observable, Subscription} from "rxjs";
import {BackendOrderService} from "../_services/backend-order.service";
import {Order, OrderDetails} from "../_models/order";
import {CartService} from "../_services/cart.service";
import {OrderItem} from "../_models/order-item";
import {User, Address} from "../_models/user";
import {OrderStatuses} from "../_models/enums/order-status.enum";
import {BackendUserService} from "../_services/backend-user-service.service";
import {MetrikaService} from "../_services/metrika.service";
import {OrderSelectedAttribute} from "../_models/category";

@Component({
    selector: "app-cart-confirm",
    templateUrl: "./cart-confirm.component.html",
    styleUrls: ["./cart-confirm.component.scss"]
})
export class CartConfirmComponent implements OnInit, OnDestroy {

    private loading = true;
    private user: User = new User();
    private _subscription: Subscription;
    private address: Address;
    private custom_address: Address;
    private name: string;
    private add_address = false;

    constructor(protected userService: UserService,
                protected userBackend: BackendUserService,
                protected cart: CartService,
                protected route: ActivatedRoute,
                protected router: Router,
                protected backend: BackendOrderService) {
    }

    ngOnInit() {
        let id = "";
        this.route.params.forEach((params: Params) => {
            id = params["id"];
        });
        if (this.cart.getOrder().details){
            this.address = this.cart.getOrder().details.address;
            this.name = this.cart.getOrder().details.name;
        }
        this._subscription = this.userService.getUserStream().subscribe(u => {
            this.user = u;
            this._activateUserDefaultAddress();
            this.loading = false;
        });

    }

    private _activateUserDefaultAddress(){
        this.user.address.forEach(a => {
            if (!this.address && a.default) {
                this.address = a;
            }
        });
    }

    get isAdmin(){
        return this.userService.isAdmin;
    }

    confirm(){
        this.loading = true;
        let d = new OrderDetails();
        d.name = this.name;
        d.address = this.address;
        d.customer = this.userService.getUser();
        d.date = new Date().toISOString();
        this.cart.setDetails(d);
        this._saveCustomAddress();
        this.cart.changeStatus(OrderStatuses.NEW);
        MetrikaService._purchase(this.cart.getOrder());

        Observable.of(false).delay(500).subscribe(b => {
            this.loading = false;
            this.cart.setCart(new Order(this.userService.getUser().name));
            this.router.navigate(["/cart",this.cart.getOrder().uuid, "success"]);
        })
    }

    private _saveCustomAddress(){
        if(this.user.address.length === 0 && this.custom_address) {
            let user = new User().deserialize(JSON.parse(JSON.stringify(this.user)));
            user.addAddress(this.custom_address);
            this.userBackend.update(user, user).subscribe(o => {
                console.log("User saved", o);
            }, err => {
                console.log("Saving error", err);
            });
        }
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    listAttributes(item: OrderItem):OrderSelectedAttribute[] {
        return item ? item.selectedAttributes.getList() : [];
    }

    get cartUuid() {
        return this.cart ? this.cart.getOrder().uuid : undefined;
    }

    get totalCost() {
        return this.cart.getOrder().asList.reduce((caret, item) => caret + item.amount * item.product.price, 0);
    }

    get addresses() {
        return this.user.address || [];
    }

    addCustomAddress(a){
        this.add_address = false;
        this.custom_address = a;
        this.address = a;
        // this.router.navigate(["/profile", 'me'])
    }
    deleteCustomAddress(){
        this.custom_address = null;
        this.address = null;
        this._activateUserDefaultAddress();
    }


}
