import {Component, OnInit, ElementRef, OnDestroy} from "@angular/core";
import {User} from "../_models/user";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {MdDialog} from "@angular/material";
import {Subscription} from "rxjs";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit, OnDestroy {

    private user: User = new User();
    private _userBackup: User
    private loading: boolean = true;
    private editmode: boolean = false;
    private editpass: boolean = false;
    private add_address: boolean = false;
    private saving: boolean = false;
    private _subscription: Subscription;


    constructor(private _router: Router,
                private _userService: UserService) {
    }

    ngOnInit() {
        this._subscription = this._userService.loadUser().subscribe(u => {
            console.log("load profile", u);
            this.user = u;
            this._userBackup = Object.assign(new User(), u);
            this.loading = false;
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    submit(f) {
        this.editmode = false;
        this.editpass = false;
        this._save();
    }

    toggleMode() {
        if (this.editmode) {
            this.editpass = false;
            this.user = Object.assign(new User(), this._userBackup);
        }
        this.editmode = !this.editmode;
    }

    logout() {
        this._userService.logout();
        this._router.navigate(["/"]);
    }

    addAddress(e) {

        this.user.addAddress(e);
        this.add_address = false;
        this._save();
    }

    deleteAddress(i) {
        this.user.removeAddress(i);
        this._save();
    }

    saveAddress(i, container) {
        this.user.address.forEach((a, ix) => {
            if (this.user.address[i].default && ix !== i) {
                a.default = false;
            }
        });
        this._save();
        container.__editing = false;
    }

    _save() {
        this.saving = true;
        this._userService.register(this.user).subscribe(o => {
            console.log("User saved", o);
            this.saving = false;
        }, err => {
            console.log("Saving error", err);
            this.saving = false;
        });
    }

    hasDefaultAddress(): boolean {
        return this.user.address.reduce((p, a) => p || a.default, false);
    }

}
