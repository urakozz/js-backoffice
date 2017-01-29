import {
    Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy,
    ChangeDetectorRef
} from "@angular/core";
import {
    OrderSelectedAttributeList, ColorOptions, OrderSelectedAttribute,
    ProductSelectableAttribute
} from "../../_models/category";
import {Product} from "../../_models/product";
import {UserService} from "../../_services/user.service";
import {CartService} from "../../_services/cart.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {MetrikaService} from "../../_services/metrika.service";

@Component({
    selector: "app-product-block",
    templateUrl: "./product-block.component.html",
    styleUrls: ["./product-block.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductBlockComponent implements OnInit {

    public colorOptions = ColorOptions;
    selectedAmount: number = 1;
    defaultSelectedColor: number = 1;
    selectedAttributes: OrderSelectedAttributeList = new OrderSelectedAttributeList();
    justSaved: boolean = false;
    amount: number[] = Array.apply(null, Array(50)).map(function (_, i) {
        return i + 1;
    });

    @Input() item: Product;
    @Input() lazyImages: boolean = true;
    @Output() loginPopup = new EventEmitter();
    @Output() palette = new EventEmitter();

    constructor(protected basket: CartService,
                protected router: Router,
                protected _userService: UserService,
                protected cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.listAttributes.forEach(a => {
            this.selectedAttributes.push(new OrderSelectedAttribute(a, this.defaultSelectedColor));
        });
    }

    get listAttributes() {
        return this.item ? this.item.selectableAttributes.getList() : [];
    }

    get isAdmin(){
        return this._userService.isAdmin;
    }

    get isGuest(){
        return this._userService.isGuest;
    }

    getAttrCount(attr: ProductSelectableAttribute) {
        return this.selectedAttributes.getByName(attr.name).value;
    }

    changeColor(attr: ProductSelectableAttribute, n: number) {
        this.selectedAttributes.update(new OrderSelectedAttribute(attr, n));
        console.log(attr, n, this.selectedAttributes);
    }

    toPdp(){
        this.router.navigate(["/product",this.item.id])
    }

    showPalette() {
        this.palette.next({});
    }

    add() {
        if (this._userService.isGuest) {
            this.loginPopup.next({
                "successAction": () => {
                    this._doAdd();
                }
            });
            return;
        }
        this._doAdd();
        this.justSaved = true;
        Observable.of(false).delay(500).subscribe(b => {
            this.justSaved = b;
            this.cd.markForCheck();
        });
    }

    _doAdd(){
        console.log(this.item, this.selectedAttributes, this.selectedAmount);
        this.basket.add(this.item, this.selectedAttributes, this.selectedAmount);
        MetrikaService._add(this.item, this.selectedAmount);
    }


}
