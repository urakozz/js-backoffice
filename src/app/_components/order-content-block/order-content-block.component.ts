import {
    Component, OnInit, Input, trigger,
    state,
    style,
    transition,
    animate, OnDestroy
} from '@angular/core';
import {Order} from "../../_models/order";
import {OrderItem} from "../../_models/order-item";
import {OrderStatuses} from "../../_models/enums/order-status.enum";
import {OrderService} from "../../_services/order.service";
import {UserService} from "../../_services/user.service";
import {Product} from "../../_models/product";
import {MetrikaService} from "../../_services/metrika.service";
import {OrderSelectedAttribute} from "../../_models/category";


@Component({
    selector: 'app-order-content-block',
    templateUrl: './order-content-block.component.html',
    styleUrls: ['./order-content-block.component.scss'],
    animations: [
        trigger('flyInOut', [
            state('in', style({height: '*', opacity: 1, transform: 'translateX(0)'})),
            transition('* => void', [
                animate('0.3s ease-out', style({height: 0, opacity: 0, transform: 'translateX(-100%)'}))
            ])
        ])
    ]
})
export class OrderContentBlockComponent implements OnInit, OnDestroy {
    @Input() order: Order;
    states = [];

    public amount: number[] = Array.apply(null, Array(50)).map(function (_, i) {
        return i + 1;
    });

    constructor(public service: OrderService, public _userService: UserService) {
    }

    ngOnInit() {
        // console.log("init");
        // this.states = Array.apply(null, Array(this.order.asList.length)).map(i => "in")
    }

    ngOnDestroy() {
        // console.log("destroy");
    }

    getSelectedAttributeValue(item: OrderItem, a: string) {
        let attr = item.selectedAttributes.getByName("color");
        return attr ? attr.value : null;
    }

    listAttributes(item: OrderItem):OrderSelectedAttribute[] {
        return item ? item.selectedAttributes.getList() : []
    }

    get totalCost(): number {
        return this.order.totalPrice;
    }

    get editable() {
        return this.order.status === OrderStatuses.CART || this._userService.isAdmin;
    }

    changeAmount(p: Product, q, attrs) {
        q = Number.parseInt(q);
        this.order.changeAmount(p, attrs, q);
        this.service.persist(this.order);
        if(q < 1) {
            MetrikaService._remove(p);
        }
    }


}
