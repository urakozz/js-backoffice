import {Injectable} from "@angular/core";
/**
 * Created by yury on 19/01/2017.
 */

interface IStorage {
    readonly length: number;
    clear(): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
}

@Injectable()
export class LocalStorageService implements IStorage {

    protected _st : {[key: string]: any} = {};
    private lsLocked = false;

    constructor(){
        try {
            localStorage.setItem("_test", "ok");
            localStorage.removeItem("_test");
        } catch (e) {
            this.lsLocked = true;
        }
    }

    getItem(key: string): string|any {
        if(this.lsLocked) {
            return this._st[key];
        }
        return localStorage.getItem(key);
    }

    removeItem(key: string): void {
        if(this.lsLocked) {
            delete this._st[key];
            return;
        }
        localStorage.removeItem(key)
    }

    setItem(key: string, data: string): void {
        if(this.lsLocked){
            this._st[key] = data;
            return
        }
        localStorage.setItem(key, data)
    }

    clear(): void{
        this._st = {};
        if(!this.lsLocked) {
            localStorage.clear()
        }
    }

    get length(): number {
        if(this.lsLocked) {
            return Object.keys(this._st).length;
        }
        return localStorage.length
    }

}