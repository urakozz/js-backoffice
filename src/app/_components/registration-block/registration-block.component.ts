import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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
            name: ["", Validators.required],
            realname: ["", Validators.required],
            password: ["", Validators.required],
        });
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
