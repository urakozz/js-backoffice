import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {Subscription} from "rxjs";

@Component({
    selector: "app-registration",
    templateUrl: "./registration.component.html",
    styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent implements OnInit, OnDestroy {

    private _s: Subscription;

    constructor(private _router: Router,
                private _userService: UserService) {

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
