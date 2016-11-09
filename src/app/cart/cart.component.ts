import {Component, OnInit, ViewContainerRef, ElementRef} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common'
import {CartService} from "../_services/cart.service";
import {BackendOrderService} from "../_services/backend-order.service";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {UserService} from "../_services/user.service";
import {Observable} from "rxjs";
import {Order} from "../_models/order";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


    cartc: any = {};
    loading: boolean;
    private _dialogClear:MdDialogRef<ClearCartDialog>;

    constructor(protected cart: CartService,
                protected viewContainerRef: ViewContainerRef,
                protected backend: BackendOrderService,
                protected dialog: MdDialog,
                protected element: ElementRef,
                protected userService: UserService,
                protected route: ActivatedRoute) {
    }

    ngOnInit() {
        this.loading = true;

        let id = "";
        this.route.params.forEach((params: Params) => {
            let id = params['id']; // (+) converts string 'id' to a number
            console.log('product', id);
        });

        Observable.of(id).switchMap(uuid => {
            if (!uuid || uuid === "current") {
                this.loading = false;
                return Observable.empty()
            }
            return this.backend.getOrder(uuid)
        }).subscribe((c: Order) => {
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
