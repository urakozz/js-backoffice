import {Component, OnInit} from '@angular/core';
import {UserService} from "../../_services/user.service";
import {MdDialogRef} from "@angular/material";

@Component({
    selector: 'app-dialog-login-block',
    templateUrl: './dialog-login-block.component.html',
    styleUrls: ['./dialog-login-block.component.scss']
})
export class DialogLoginBlockComponent implements OnInit {

    private signup = false;

    constructor(private dialog: MdDialogRef<DialogLoginBlockComponent>, private userService: UserService) {

    }

    ngOnInit() {
        let s = this.userService.getLoginStream().first().subscribe(e => {
            this.dialog.close(true);
            s.unsubscribe()
        })
    }

}

