import {Injectable} from "@angular/core";
import {Http, URLSearchParams, Response, RequestMethod, Request, RequestOptions, Headers} from "@angular/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs";

@Injectable()
export class BackendService {

    private host = "https://couchdb.urakozz.me";

    constructor(private http: Http,
                private _userService: UserService) {

    }

    get(path: string, search?: URLSearchParams): Observable<Response> {
        let o = new RequestOptions({
            method: RequestMethod.Get,
            url: this.host + path,
        });
        if (search) {
            o.search = search;
        }
        return this.http.request(new Request(o));
    }

    put(path: string, body: string): Observable<Response> {
        return this._userService.getHeaders().switchMap((h: Headers) => {
            return this.http.request(new Request(new RequestOptions({
                method: RequestMethod.Put,
                url: this.host + path,
                headers: h,
                body: body,
            })));
        });
    }

    delete(path: string, params: URLSearchParams): Observable<Response> {
        return this._userService.getHeaders().switchMap((h: Headers) => {
            return this.http.request(new Request(new RequestOptions({
                method: RequestMethod.Delete,
                url: this.host + path,
                headers: h,
                search: params,
            })));
        });
    }

}
