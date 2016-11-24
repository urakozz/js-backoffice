import {Injectable} from '@angular/core';
import {BackendService} from "./backend.service";
import {LoginUser, User, LoginUserInterface, SaveUser} from "../_models/user";
import {Observable} from "rxjs";
import {RequestMethod, Request, Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";

interface OkResponse{
    ok: string;
}
export interface SessionResponse extends OkResponse {
    name: string;
    roles: string[];
}
export interface UpdateResponse extends OkResponse {
    ok: string;
    id: string;
    rev: string;
}



@Injectable()
export class BackendUserService {

    private host = "https://couchdb.urakozz.me";

    constructor(private http: Http) {
    }

    session(u: LoginUserInterface): Observable<SessionResponse> {
        let o = new RequestOptions({
            method: RequestMethod.Post,
            url: this.host + "/_session",
            body: JSON.stringify(new LoginUser(u)),
            headers: this._getHeaders(u),
        });
        return this.http.request(new Request(o)).map(r => r.json())
    }

    deleteSession(u: LoginUserInterface): Observable<OkResponse>  {
        let o = new RequestOptions({
            method: RequestMethod.Delete,
            url: this.host + "/_session",
            body: JSON.stringify(new LoginUser(u)),
            headers: this._getHeaders(u),
        });
        return this.http.request(new Request(o)).map(r => r.json())
    }

    load(name:string, u: LoginUserInterface) {
        let o = new RequestOptions({
            method: RequestMethod.Get,
            url: this.host + "/_users/org.couchdb.user:" + name,
            headers: this._getHeaders(u),
        });
        return this.http.request(new Request(o)).map(r => r.json()).switchMap(obj => {
            let user = new User().deserialize(obj);
            return Observable.of(user);
        });
    }

    getUsers(u: LoginUserInterface): Observable<User[]> {
        let params = new URLSearchParams();
        // params.set("descending", "true");
        params.set("include_docs", "true");
        let o = new RequestOptions({
            method: RequestMethod.Get,
            url: this.host + "/_users/_all_docs",
            headers: this._getHeaders(u),
            search: params,
        });
        return this.http.request(new Request(o))
            .map(r => r.json())
            .map(data => data["rows"]
                .filter(row => !row["id"].startsWith("_"))
                .map(row => new User().deserialize(row["doc"]))
            );
    }

    create(u: User): Observable<UpdateResponse> {
        let o = new RequestOptions({
            method: RequestMethod.Put,
            url: this.host + "/_users/org.couchdb.user:" + u.name,
            body: JSON.stringify(new SaveUser(u)),
            headers: new Headers({"Content-Type": "application/json"}),
        });
        return this.http.request(new Request(o)).map(r => r.json());
    }

    update(u: User, auth: LoginUserInterface): Observable<UpdateResponse> {
        let o = new RequestOptions({
            method: RequestMethod.Put,
            url: this.host + "/_users/org.couchdb.user:" + u.name,
            body: JSON.stringify(new SaveUser(u)),
            headers: this._getHeaders(auth),
        });
        return this.http.request(new Request(o)).map(r => r.json());
    }

    delete(name:string, u: LoginUserInterface): Observable<UpdateResponse> {
        let o = new RequestOptions({
            method: RequestMethod.Delete,
            url: this.host + "/_users/org.couchdb.user:" + name,
            headers: this._getHeaders(u),
        });
        return this.http.request(new Request(o)).map(r => r.json());
    }

    private _getHeaders(u: LoginUserInterface): Headers {
        let h = new Headers({"Content-Type": "application/json"});
        h.append("Authorization", "Basic " + btoa(u.name + ":" + u.password));
        return h;
    }

}
