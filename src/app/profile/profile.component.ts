import {Component, OnInit, OnDestroy} from "@angular/core";
import {User} from "../_models/user";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../_services/user.service";
import {Subscription, Observable} from "rxjs";
import {BackendUserService} from "../_services/backend-user-service.service";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit, OnDestroy {

    private user: User = new User();
    private _userBackup: User;
    private loading: boolean = true;
    private editmode: boolean = false;
    private editpass: boolean = false;
    private add_address: boolean = false;
    private saving: boolean = false;
    private _subscription: Subscription;


    constructor(private _router: Router,
                private _active: ActivatedRoute,
                private _userService: UserService,
                private _backend: BackendUserService) {
    }

    ngOnInit() {
        let name = "";
        this._active.params.forEach((p: Params) => {
            name = p["id"];
        });

        this._subscription = this._userService.getUserStream().switchMap((u: User) => {
            if(!name || name === "me") {
                name = u.name;
            }
            return this._backend.load(name, u);
        }).switchMap((u:User) => {
            if(this._userService.getUser().name === u.name) {
                u.password = this._userService.getUser().password;
            }
            return Observable.of(u);
        }).subscribe(u => {
            console.log("load profile", u);
            this.user = u;
            this._userBackup = Object.assign(new User(), u);
            this.loading = false;
        });
    }

    get isUserEdit(){
        return this._userService.getUser() && this._userService.getUser().name === this.user.name;
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

    protected _save() {
        this.saving = true;
        this._backend.update(this.user, this._userService.getUser()).switchMap((o)=>{
            if(this._userService.isAdmin){
                return Observable.of(o);
            }
            return this._userService.login(this.user)
        }).subscribe(o => {
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
