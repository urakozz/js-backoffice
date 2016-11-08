import {Injectable} from "@angular/core";
import {OrderStatus, OrderStatuses} from "../_models/enums/order-status.enum";
import {UserService} from "./user.service";
import {Order} from "../_models/order";
import {BackendOrderService} from "./backend-order.service";

@Injectable()

export class OrderService {

    constructor(private backend: BackendOrderService) {

    }

    persist(o: Order) {
        this.backend.set(o).subscribe(c => {
            console.log("Cart, saved", c);
        });
    }

    changeStatus(o: Order, s: OrderStatus) {
        let a = new StateAutomata(o);
        if (a.canChangeTo(s)) {
            a.changeTo(s);
            this.persist(o);
        }
    }
}


export class StateAutomataConfig {

    static userAllowedStatuses = [OrderStatuses.NEW, OrderStatuses.RECEIVED];

    static getPossibleStatuses(c: Order, userService: UserService) {
        if (!userService.getUser()) {
            return [];
        }
        return StateAutomataConfig.getPossibleTransitions(c)
            .filter(s => userService.isAdmin || StateAutomataConfig.userAllowedStatuses.indexOf(s) > -1);
    }


    static getPossibleTransitions(c: Order): OrderStatus[] {
        if (c.status === OrderStatuses.CART) {
            if (c.details) {
                return [OrderStatuses.NEW];
            }
        }
        if (c.status === OrderStatuses.NEW) {
            return [OrderStatuses.PAYED, OrderStatuses.CANCELLED]
        }
        if (c.status === OrderStatuses.PAYED) {
            return [OrderStatuses.PAYMENT_RECIEVED, OrderStatuses.CANCELLED]
        }
        if (c.status === OrderStatuses.PAYMENT_RECIEVED) {
            return [OrderStatuses.SENT];
        }
        if (c.status === OrderStatuses.SENT) {
            return [OrderStatuses.RECEIVED, OrderStatuses.ARCHIVE];
        }
        if (c.status === OrderStatuses.RECEIVED) {
            return [OrderStatuses.ARCHIVE];
        }
        if (c.status === OrderStatuses.CANCELLED) {
            return [OrderStatuses.ARCHIVE];
        }
        return [];

    }
}

class StateAutomata {
    private _check: boolean = false

    constructor(private c: Order) {

    }

    canChangeTo(s: OrderStatus): boolean {
        if (!this._doCheck(s)) {
            throw Error("check failed, unable change status " + this.c.status + " to " + s);
        }
        this._check = true;
        return true;
    }

    changeTo(s: OrderStatus) {
        if (!this._check) {
            throw Error("no check");
        }
        this.c.status = s;
    }


    _doCheck(s: OrderStatus): boolean {
        return StateAutomataConfig.getPossibleTransitions(this.c).indexOf(s) !== -1;
    }


}