import {Component} from "@angular/core";
import {UserService} from "./_services/user.service";
import {Router} from "@angular/router";
import {CartService} from "./_services/cart.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {

    constructor(private userService: UserService,
                private router: Router,
                private cart: CartService) {

    }

    get isAdmin() {
        return this.userService.isAdmin;
    }

    get isGuest() {
        return this.userService.isGuest;
    }

    logout() {
        this.userService.logout();
        this.router.navigate(["/"]);
    }

}
