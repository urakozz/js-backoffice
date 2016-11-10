import {Injectable} from "@angular/core";
import {BackendService} from "./backend.service";
import {Observable} from "rxjs";
import {URLSearchParams} from "@angular/http";
import {Order} from "../_models/order";

@Injectable()
export class BackendOrderService {

    private DB = "/mscrapcart/";

    constructor(private backend: BackendService) {

    }

    getAllOrders(): Observable<Order[]> {
        let params = new URLSearchParams();
        params.set("descending", "true");
        params.set("include_docs", "true");
        return this._getOrders(this.DB + "_all_docs", params);
    }

    getUserOrders(user: string) {
        let params = new URLSearchParams();
        params.set("key", `"${user}"`);
        params.set("descending", "true");
        params.set("include_docs", "true");
        let p = this.DB + "_design/alldocs/_view/by_user";
        return this._getOrders(p, params);
    }

    private _getOrders(url: string, search?: URLSearchParams): Observable<Order[]> {
        return this.backend.get(url, search)
            .map(res => res.json())
            .map(data => data["rows"].filter(row => !row["id"].startsWith("_")).map(row => Order.newFromJSON(row["doc"])));
    }

    getOrder(uuid: string): Observable<Order> {
        return this.backend.get(this.DB + uuid).map(res => res.json()).map(data => {
            let o = Order.newFromJSON(data);
            console.log("getOrder", uuid);
            return o;
        });
    }

    set(c: Order) {
        return this.backend.put(this.DB + c.uuid, JSON.stringify(c)).map(res => {
            c._rev = res.json()["rev"];
            return c;
        });
    }


    delete(c: Order): Observable<boolean> {
        let params = new URLSearchParams();
        params.set("rev", c._rev);
        console.log(c, params);

        return this.backend.delete(this.DB + c.uuid.toString(), params)
            .map(res => res.json());
    }

}
