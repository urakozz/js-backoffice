import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from "../_services/user.service";
import {User} from "../_models/user";
import {BackendUserService} from "../_services/backend-user-service.service";
import {Subscription, Observable} from "rxjs";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

    private _allUsers: User[] = [];
    private _subsctionion: Subscription;
    private loading=true;

    constructor(private backend: BackendUserService,
                private _us: UserService) {
    }

    ngOnInit() {
        this._subsctionion = this._us.getUserStream().switchMap((u: User) => {
            return this.backend.getUsers(u);
        }).subscribe(u => {
            this._allUsers = u;
            this.loading = false;
        })

    }

    get selectedUsers():User[]{
        return this._allUsers;
    }

    ngOnDestroy(){
        this._subsctionion.unsubscribe()
    }

}
