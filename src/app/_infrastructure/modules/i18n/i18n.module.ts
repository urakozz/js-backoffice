import {NgModule} from "@angular/core";
import {I18nPipe} from "./i18n.pipe";
import {I18nDirective} from "./i18n.directive";
import {I18nService} from "./i18n.service";
import {TRANSLATION} from "./translations/translation";

@NgModule({
    declarations: [I18nPipe, I18nDirective],
    exports: [I18nPipe, I18nDirective, I18nService],
    providers:[
        {provide: I18nService, useFactory: () => new I18nService().init(TRANSLATION)},
    ]
})
export class I18nModule {
}