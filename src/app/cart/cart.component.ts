import {Component, OnInit, ViewContainerRef, ElementRef} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Location} from '@angular/common'
import {CartService} from "../_services/cart.service";
import {BackendOrderService} from "../_services/backend-order.service";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {UserService} from "../_services/user.service";
import {Observable, Subscription} from "rxjs";
import {Order} from "../_models/order";
import {User, Address} from "../_models/user";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {


    cartc: any = {};
    loading: boolean;
    private _dialogClear:MdDialogRef<ClearCartDialog>;
    private _dialogConfirm:MdDialogRef<ConfirmOrderDialog>;

    constructor(protected cart: CartService,
                protected viewContainerRef: ViewContainerRef,
                protected backend: BackendOrderService,
                protected dialog: MdDialog,
                protected userService: UserService,
                protected route: ActivatedRoute) {
    }

    ngOnInit() {
        this.loading = true;

        let id = "";
        this.route.params.forEach((params: Params) => {
            id = params['id'];
        });
        Observable.of(id).switchMap(uuid => {
            if (!uuid || uuid === "current") {
                this.loading = false;
                return Observable.empty()
            }
            console.log("loading", uuid);
            return this.backend.getOrder(uuid)
        }).delay(300).subscribe((c: Order) => {
            this.loading = false;
            this.cart.setCart(c);
        })
    }

    get order(){
        return this.cart.getOrder()
    }

    get isAdmin(){
        return this.userService.isAdmin
    }

    get cartUuid(){
        return this.cart ? this.cart.getOrder().uuid : undefined
    }

    get isEmptyCart(){
        return !this.cart || this.cart.isEmpty()
    }

    newCart() {
        this.cart.setCart(new Order(this.userService.getUser().name))
    }

    showClearConfirm(ev){
        console.log("cart clear");
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        this._dialogClear = this.dialog.open(ClearCartDialog, config);

        this._dialogClear.afterClosed().subscribe(result => {
            this._dialogClear = null;
            if(result){
                this.cart.clear();
            }
        });
    }

    showSaveConfirm(ev){
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        this._dialogConfirm = this.dialog.open(ConfirmOrderDialog, config);

        this._dialogConfirm.afterClosed().subscribe(result => {
            this._dialogClear = null;
            if(result){
                this.cart.clear();
            }
        });
    }


}

@Component({
    selector: 'clear-cart-dialog',
    template: `
  <md-card >
    <md-card-title>
       Empty cart?
    </md-card-title>
    <md-card-content>
    <p>This will clear the cart and will save it as empty one.</p>
    </md-card-content>
    <md-card-actions>
        <button md-button (click)="dialogRef.close(true)">Yes, empty cart.</button>
        <button md-button (click)="dialogRef.close(false)">Oh, no</button>
    </md-card-actions>
  </md-card>

  
  `
})
export class ClearCartDialog {
    constructor(public dialogRef: MdDialogRef<ClearCartDialog>) {
    }
}


@Component({
    selector: 'confirm-order-dialog',
    template: `
  <md-card >
    <md-card-title>
       Confirm order
    </md-card-title>
    <md-card-content>
    <p>Please select the address and confirm the order</p>
    </md-card-content>
    <md-card-actions>
        <button md-button (click)="dialogRef.close(true)">Yes, empty cart.</button>
        <button md-button (click)="dialogRef.close(false)">Oh, no</button>
    </md-card-actions>
  </md-card>


  `
})
export class ConfirmOrderDialog {
    private user:User;
    private showOptions = false;
    private loading:boolean = true;
    private _sub:Subscription;

    private address:Address;
    private name:string;

    constructor(public dialogRef: MdDialogRef<ConfirmOrderDialog>,
                private _userService:UserService,
                private _router: Router) {
        this.user = _userService.getUser()

    }

    ngOnInit(){
        this._sub = this._userService.loadUser().subscribe(u => {
            this.loading = false;
            this.user = u;
            this.user.address.forEach(a => {
                if(!this.address && a.default){
                    this.address = a
                }
            });
            this._sub.unsubscribe()
        })
    }

    save(){
        this.dialogRef.close({address:this.address, name:this.name})
    }

    get isAdmin(){
        return this._userService.isAdmin
    }

    get addresses(){
        return this.user.address || []
    }

    addAddress(){
        this._router.navigate(["/profile", {user: 'me'}])
    }

}
