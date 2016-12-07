import {Component, OnInit, Input} from '@angular/core';
import {User} from "../../_models/user";

@Component({
    selector: 'app-user-read-block',
    templateUrl: './user-read-block.component.html',
    styleUrls: ['./user-read-block.component.scss']
})
export class UserReadBlockComponent implements OnInit {

    @Input() user: User;

    constructor() {
    }

    ngOnInit() {
    }

}
