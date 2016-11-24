import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {Address} from "../../_models/user";


@Component({
    selector: "app-address-read-block",
    templateUrl: "./address-read-block.component.html"
})
export class AddressReadBlockComponent {


    @Input() address: Address = new Address(true);

    constructor() {
    }

    ngOnInit(){

    }

}
