import {Component} from "@angular/core";
import {UserService} from "./_services/user.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    title = "app works!";

    constructor(private userService: UserService) {

    }

    get isAdmin() {
        return this.userService.isAdmin;
    }

    get isGuest() {
        return this.userService.isGuest;
    }
}
