import {Injectable} from '@angular/core';

@Injectable()
export class I18nService {


    private conf: any;
    private userLang: string;
    // private lang: any;

    constructor() {
    }

    setUserLang(lang: string): void {
        this.userLang = lang;
    }

    init(lang: any): void {
        this.conf = lang;
        this.setUserLang(lang.defaultLang);
    }

    translate(key: string): string {
        if (typeof this.conf.lang !== "undefined" && this.conf.lang.hasOwnProperty(key)) {
            return this.conf.lang[key][this.userLang] || key;
        } else {
            return key;
        }
    }

}
