import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {Address} from "../../_models/user";


@Component({
    selector: "app-address-block",
    templateUrl: "./address-block.component.html",
    styleUrls: ["./address-block.component.scss"]
})
export class AddressBlockComponent implements OnInit {
    private _backup: Address;


    @Input() editable: boolean = true;
    @Input() addressDefaultEditable: boolean = false;
    @Input() addressDefaultShowCheckbox: boolean = true;
    @Input() address: Address = new Address(true);
    @Output() saved: EventEmitter<Address> = new EventEmitter<Address>();
    @Output() canceled: EventEmitter<any> = new EventEmitter<Address>();

    constructor() {
    }

    ngOnInit() {

        this._backup = Object.assign(new Address(), this.address);
    }

    save() {
        this.saved.next(this.address);
    }

    cancel() {
        this.address = Object.assign(this.address, this._backup);
        this.canceled.next({});
    }

}
