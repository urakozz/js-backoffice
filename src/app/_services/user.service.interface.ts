import {Observable} from "rxjs";
import {User} from "../_models/user";
import {Headers} from "@angular/http";

export interface IUserService {
    // getLoginStream(): Observable<User>;
    getLogoutStream(): Observable<User>;
    // getHeaders(): Observable<Headers>;
    getUser(): User;
    register(u: User): Observable<any>;
    login(u: User): Observable<boolean>;
    logout(): Observable<boolean>;
}
