import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {UserService} from "../../_services/user.service";
import {MailService} from "../../_services/mail.service";
import {User} from "../../_models/user";

@Component({
    selector: "app-registration-block",
    templateUrl: "./registration-block.component.html",
    styleUrls: ["./registration-block.component.scss"]
})
export class RegistrationBlockComponent implements OnInit {
    protected loading: boolean;
    protected form: FormGroup;

    constructor(private fb: FormBuilder,
                private _userService: UserService,
                private _ms: MailService) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: new FormControl("", [Validators.required, RegistrationBlockComponent.validateEmail]),
            realname: new FormControl("", [Validators.required]),
            passwordGroup: new FormGroup({
                password: new FormControl("", [Validators.required, Validators.minLength(8)]),
                password2: new FormControl("", [Validators.required])
            }, RegistrationBlockComponent.areEqual)
        });
    }

    static validateEmail(c: FormControl) {
        let EMAIL_REGEXP = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        return EMAIL_REGEXP.test(c.value) ? null : {
            validateEmail: {
                valid: false
            }
        };
    }

    static areEqual(group: FormGroup) {

        let passwordInput = group.controls["password"];
        let passwordConfirmationInput = group.controls["password2"];
        if (passwordInput.value !== passwordConfirmationInput.value) {
            passwordConfirmationInput.setErrors({notEquivalent: true});
        }
        return null;
    }

    register() {
        debugger;
        this.loading = true;
        let u = Object.assign(new User(), this.form.value);
        u.password = this.form.value.passwordGroup.password;
        this._userService.register(u).subscribe(d => {
            console.log("Directive Signup: success");
            this._sendConfirm();
        }, err => {
            console.log("Err Directive signup", err);
            this.form.controls["name"].setErrors({exists: true});
            this.loading = false;
        });
    }

    private _sendConfirm() {
        this._ms.sendConfirmation(
            this._userService.getUser().name,
            this._userService.getUser().realname,
            this._userService.getUser().details["activationCode"]).subscribe((r) => {
            console.log("_sendConfirm ok", r);
        }, (err) => {
            console.log("_sendConfirm err", err);
        });
    }

}
