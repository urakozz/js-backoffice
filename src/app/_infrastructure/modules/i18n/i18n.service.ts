import {Injectable, OpaqueToken, Inject} from "@angular/core";

export let TRANSLATION_DICT = new OpaqueToken("translation.dict");

@Injectable()
export class I18nService {


    private conf: any;
    private userLang: string;

    constructor(@Inject(TRANSLATION_DICT) dict) {
        this.init(dict)
    }

    setUserLang(lang: string): void {
        this.userLang = lang;
    }

    init(lang: any): I18nService {
        this.conf = lang;
        this.setUserLang(lang.defaultLang);
        return this;
    }

    translate(key: string): string {
        if (typeof this.conf.lang !== "undefined" && this.conf.lang.hasOwnProperty(key)) {
            return this.conf.lang[key][this.userLang] || key;
        } else {
            return key;
        }
    }

}
