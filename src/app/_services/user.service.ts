import {Injectable} from "@angular/core";
import {User, LoginUser, RegisterUser} from "../_models/user";
import {Subject, Observable} from "rxjs";
import {Http, RequestMethod, Headers, Request, RequestOptions} from "@angular/http";
import {IUserService} from "./i-user-service";
import {Uuid} from "../_infrastructure/uuid";

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

    private host = "https://couchdb.urakozz.me";

    constructor(private http: Http) {
        this._initFromLocal();
    }

    login(u: User): Observable<boolean> {
        let o = new RequestOptions({
            method: RequestMethod.Post,
            url: this.host + "/_session",
            body: JSON.stringify(new LoginUser(u)),
            headers: this._getHeaders(),
        });
        return this.http.request(new Request(o)).map(r => r.json()).switchMap((data, ix) => {
            return this._authenticate(u, data);
        });
    }

    logout(): Observable<boolean> {
        this._user = undefined;
        this._role = Role.Guest;
        localStorage.removeItem("userObject");
        this._logoutStream.next(true);
        return Observable.of(true);
    }

    save(u: User): Observable<any> {
        u.uuid = u.uuid || Uuid.random();
        let o = new RequestOptions({
            method: RequestMethod.Put,
            url: this.host + "/_users/org.couchdb.user:" + u.name,
            body: JSON.stringify(new RegisterUser(u)),
            headers: this._getHeaders(),
        });
        return this.http.request(new Request(o)).map(r => r.json());
    }

    register(u: User): Observable<any> {
        return this.save(u).switchMap((data, ix) => {
            return this.login(u);
        });
    }

    loadUser(): Observable<User> {
        return Observable.of(this._user).switchMap(u => {
            if (u) {
                return Observable.of(u);
            }
            return this._loginStream;
        }).switchMap(u => {
            return this._loadUser();
        });

    }

    private _loadUser(): Observable<User> {
        let o = new RequestOptions({
            method: RequestMethod.Get,
            url: this.host + "/_users/org.couchdb.user:" + this._user.name,
            headers: this._getHeaders(),
        });
        return this.http.request(new Request(o)).map(r => r.json()).switchMap(o => {
            let u = User.newFromJSON(o);
            u.password = this._user.password;
            return Observable.of(u);
        });
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

    private _authenticate(u: User, data): Observable<boolean> {
        this._user = u;
        localStorage.setItem("userObject", JSON.stringify(u))
        this._role = Role.User;
        if (data.roles.indexOf("web_write") >= 0) {
            this._role = Role.Admin;
        }
        this._loginStream.next(u);
        return Observable.of(true);
    }

    getHeaders(): Observable<Headers> {
        return Observable.of(this._user).switchMap(u => {
            if (u) {
                return Observable.of(u);
            }
            return this._loginStream;
        }).first().switchMap(u => {
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
                console.log("error logging from local", err)
                this.logout();
            });
        }
    }

}
