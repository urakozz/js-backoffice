import {Component, OnInit, OnDestroy} from "@angular/core";
import {UserService} from "../_services/user.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["/login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {

    private _s: Subscription;

    constructor(private _router: Router, private _userService: UserService) {

    }

    ngOnInit() {
        this._s = this._userService.getLoginStream().subscribe(() => {
            this._router.navigate(["/"]);
            this._s.unsubscribe();
        });
    }

    ngOnDestroy() {
        this._s.unsubscribe();
    }

}
