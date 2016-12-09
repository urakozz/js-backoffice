import {NgModule} from "@angular/core";
import {I18nPipe} from "./i18n.pipe";
import {I18nDirective} from "./i18n.directive";
import {I18nService, TRANSLATION_DICT} from "./i18n.service";
import {TRANSLATION} from "./translations/translation";

@NgModule({
    declarations: [I18nPipe, I18nDirective],
    exports: [I18nPipe, I18nDirective],
    providers: [
        I18nService,
        {provide:TRANSLATION_DICT, useValue:TRANSLATION }
    ]
})
export class I18nModule {
}