import {Component, OnInit} from "@angular/core";
import {UserService} from "./_services/user.service";
import {Router} from "@angular/router";
import {CartService} from "./_services/cart.service";
import {Observable} from "rxjs";
import {MdMenu} from "@angular/material";
import { environment } from '../environments/environment';

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {


    constructor(private userService: UserService,
                private router: Router,
                private cart: CartService) {

    }

    ngOnInit(): void {
        console.log(environment);
        Observable.of(null).delay(250).subscribe(v => {
            if (window.Pace) {
                window.Pace.stop();
                window.Pace = null;
            }
            document.querySelector("app-loading").remove();
        });
    }

    get userName(){
        return this.userService.getUser() ? this.userService.getUser().name : null
    }

    get isAdmin() {
        return this.userService.isAdmin;
    }

    get isGuest() {
        return this.userService.isGuest;
    }

    logout(m: MdMenu) {
        let s = m.close.subscribe(() => {
            s.unsubscribe();
            this.userService.logout();
            this.router.navigate(["/"]);
        });
    }

}
