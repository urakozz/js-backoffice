import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";
import {ProductBlockComponent} from "../product-block/product-block.component";
import {UserService} from "../../_services/user.service";
import {CartService} from "../../_services/cart.service";
import {Product} from "../../_models/product";
import {Router} from "@angular/router";

@Component({
    selector: 'app-product-pdp-block',
    templateUrl: './product-pdp-block.component.html',
    styleUrls: ['./product-pdp-block.component.scss']
})
export class ProductPdpBlockComponent extends ProductBlockComponent implements OnInit {
    @Input() item: Product;
    @Output() loginPopup = new EventEmitter();
    @Output() palette = new EventEmitter();

    constructor(protected basket: CartService,
                protected router: Router,
                protected _userService: UserService,
                protected cd: ChangeDetectorRef) {
        super(basket, router, _userService, cd);
    }

}
