import {Component, OnInit} from "@angular/core";
import {UserService} from "../_services/user.service";
import {ActivatedRoute, Params} from "@angular/router";
import {User} from "../_models/user";

@Component({
    selector: "app-registration-confirmation",
    templateUrl: "./registration-confirmation.component.html",
    styleUrls: ["./registration-confirmation.component.scss"]
})
export class RegistrationConfirmationComponent implements OnInit {

    loading = true;
    success = false;
    private _code: string;

    constructor(private _userService: UserService,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this._route.queryParams.forEach((params: Params) => {
            this._code = params["code"];
        });
        if (!this._userService.getUser()) {
            this.loading = false;
        }
        this._userService.loadUser().subscribe((u: User) => {
            this.loading = false;
        });
    }

    get isGuest() {
        return this._userService.isGuest;
    }

    get isCodeOk() {
        return this._code
            && this._userService.getUser()
            && this._userService.getUser().details
            && this._userService.getUser().details["activationCode"] === this._code;
    }

    confirm() {
        this._userService.activate().subscribe(() => {
            this.success = true;
        });
    }

}
