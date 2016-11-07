import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {User} from "../../_models/user";
import {UserService} from "../../_services/user.service";

@Component({
    selector: "app-login-block",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginBlockComponent implements OnInit {

    protected loading: boolean;
    protected form: FormGroup;

    constructor(private fb: FormBuilder,
                private _userService: UserService) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ["", Validators.required],
            password: ["", Validators.required],
        });
    }

    login() {
        this.loading = true;
        let login = this._userService.login(new User().deserialize(this.form.value));

        login.subscribe(d => {
            console.log("Directive: logged in");
        }, err => {
            console.log("Err login", err);
            this.loading = false;
            this.form.controls["password"].setErrors({invalid: true});
        });
    }

}
