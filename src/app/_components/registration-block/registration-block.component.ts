import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {UserService} from "../../_services/user.service";

@Component({
    selector: "app-registration-block",
    templateUrl: "./registration-block.component.html",
    styleUrls: ["./registration-block.component.scss"]
})
export class RegistrationBlockComponent implements OnInit {
    protected loading: boolean;
    protected form: FormGroup;

    constructor(private fb: FormBuilder,
                private _userService: UserService) {
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
        this.loading = true;
        this._userService.register(this.form.value).subscribe(d => {
            console.log("Directive Signup: success");
        }, err => {
            console.log("Err Directive signup", err);
            this.form.controls["name"].setErrors({exists: true});
            this.loading = false;
        });
    }

}
