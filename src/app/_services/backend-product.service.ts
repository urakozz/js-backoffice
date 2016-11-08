import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Product} from "../_models/product";
import {BackendService} from "./backend.service";
import {URLSearchParams} from "@angular/http";

@Injectable()
export class BackendProductService {

    private DB = "/mscrap/";

    constructor(private backend: BackendService) {

    }

    get(id: number): Observable<Product> {
        return this.backend.get(this.DB + id.toString()).map(res => res.json()).map(data => {
            let p = Product.newFromJSON(data);
            console.log(p);
            return p;
        });
    }

    set(p: Product): Observable<Product> {
        return this.backend.put(this.DB + p.id.toString(), JSON.stringify(p)).map(res => {
            p._rev = res.json()["rev"];
            return p;
        });

    }

    // getAll(): Observable<Product[]> {
    //     return this.getAllStream().toArray();
    // }


    // getAllStream(): Observable<Product> {
    //     return this.getDocsList()
    //         .flatMap((x: number[], i: number) => {
    //             return this.getByKeys(x);
    //         });
    // }

    getUpdatesList() {
        return this.backend.get(this.DB + "_changes?descending=true")
            .map(res => res.json()["rows"].map(r => parseInt(r["key"], 10)));
    }

    // getDocsList(): Observable<number[]> {
    //     return this.backend.get(this.DB + "_all_docs?descending=true&skip=1")
    //         .map(res => res.json()["rows"].map(r => parseInt(r["key"])));
    // }

    getAllDocs(): Observable<Product[]> {
        let p = this.DB + "_all_docs?descending=true&include_docs=true";
        return this.backend.get(p)
            .map(res => res.json())
            .map(data => data["rows"].filter(row => !row["id"].startsWith("_")).map(row => Product.newFromJSON(row["doc"])))
    }

    delete(p: Product): Observable<boolean> {
        let params = new URLSearchParams();
        params.set("rev", p._rev);

        return this.backend.delete(this.DB + p.id.toString(), params)
            .map(res => res.json());
    }

    // getByKeys(x: number[]): Observable<Product> {
    //     return Observable.from(x).map(k => {
    //         console.log("stream, from array", k);
    //         return this.get(k);
    //     }).concatAll();
    // }

}
