import {Observable} from "rxjs";
import {User} from "../_models/user";
export interface IUserService {
    getLoginStream(): Observable<User>;
    getLogoutStream(): Observable<User>;
    getUser(): User;
    save(u: User): Observable<any>;
    register(u: User): Observable<any>
    login(u: User): Observable<boolean>;
    logout(): Observable<boolean>;
}
