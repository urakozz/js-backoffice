import {NgModule} from "@angular/core";
import {I18nPipe} from "./i18n.pipe";
import {I18nDirective} from "./i18n.directive";
import {I18nService} from "./i18n.service";

@NgModule({
    declarations: [I18nPipe, I18nDirective],
    exports: [I18nPipe, I18nDirective],
    providers: [
        I18nService
    ]
})
export class I18nModule {
}