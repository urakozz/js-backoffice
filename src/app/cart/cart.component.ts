import {Component, OnInit, ViewContainerRef, ElementRef} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common'
import {CartService} from "../_services/cart.service";
import {BackendOrderService} from "../_services/backend-order.service";
import {MdDialog} from "@angular/material";
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

    }

    showSaveConfirm(ev){

    }


}
