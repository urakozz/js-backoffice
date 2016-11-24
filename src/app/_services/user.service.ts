import {Injectable} from "@angular/core";
import {User, LoginUser, SaveUser, LoginUserInterface} from "../_models/user";
import {Subject, Observable} from "rxjs";
import {Http, RequestMethod, Headers, Request, RequestOptions} from "@angular/http";
import {IUserService} from "./user.service.interface";
import {Uuid} from "../_infrastructure/uuid";
import {SessionResponse, BackendUserService} from "./backend-user-service.service";

export enum Role {
    Guest = 0,
    User = 1,
    Admin = 2,
}

@Injectable()
export class UserService implements IUserService {
    private _role: Role = Role.Guest;
    private _user: User;

    private _loginStream = new Subject<User>();
    private _logoutStream = new Subject<boolean>();

    constructor(private backend: BackendUserService) {
        this._initFromLocal();
    }

    activate(): Observable<any> {
        this._user.active = true;
        delete this._user.details["activationCode"];
        return this.backend.update(this._user, this._user);
    }

    login(u: LoginUserInterface): Observable<boolean> {
        return this.backend.session(u).switchMap((data, ix) => {
            return this._authenticate(u, data);
        }).switchMap(() => {
            return this.backend.load(u.name, u);
        }).switchMap((user: User) => {
            user.password = u.password;
            return Observable.of(user);
        }).switchMap((user: User) => {
            this._user = user;
            this._loginStream.next(user);
            return Observable.of(true);
        });
    }

    logout(): Observable<boolean> {
        this.backend.deleteSession(this._user).subscribe();
        this._user = undefined;
        this._role = Role.Guest;
        localStorage.removeItem("userObject");
        this._logoutStream.next(true);

        return Observable.of(true);
    }

    register(u: User): Observable<any> {
        u.uuid = Uuid.random();
        u.details = u.details || {};
        u.details["activationCode"] = Uuid.random();
        return this.backend.create(u);
    }

    getUserStream(): Observable<User> {
        return Observable.concat(Observable.of(this._user), this._loginStream)
            .filter((u: User) => !!u).first()
    }

    getLoginStream(): Observable<User> {
        return this._loginStream;
    }

    getLogoutStream(): Observable<User> {
        return this._loginStream;
    }

    getUser(): User {
        return this._user;
    }

    get role() {
        return this._role;
    }

    get isAdmin() {
        return this._role === Role.Admin;
    }

    get isUser() {
        return this._role === Role.User;
    }

    get isGuest() {
        return this._role === Role.Guest;
    }

    private _authenticate(u: LoginUserInterface, data: SessionResponse): Observable<boolean> {
        localStorage.setItem("userObject", JSON.stringify(u));
        this._role = Role.User;
        if (data.roles.indexOf("_admin") >= 0) {
            this._role = Role.Admin;
        }
        return Observable.of(true);
    }

    getHeaders(): Observable<Headers> {
        return this.getUserStream().switchMap(u => {
            return Observable.of(this._getHeaders());
        });
    }

    private _getHeaders(): Headers {
        let h = new Headers({"Content-Type": "application/json"});
        if (this._user) {
            h.append("Authorization", "Basic " + btoa(this._user.name + ":" + this._user.password));
        }
        return h;
    }

    private _initFromLocal() {
        let userStr = localStorage.getItem("userObject");
        if (userStr) {
            let obj = JSON.parse(userStr);
            let user = new User();
            user.name = obj.name;
            user.password = obj.password;
            this.login(user).subscribe(c => {
                console.log("logged from local");
            }, err => {
                console.log("error logging from local", err);
                this.logout();
            });
        }
    }

}
