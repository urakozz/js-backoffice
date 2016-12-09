import {Directive, ElementRef, AfterContentInit} from "@angular/core";
import {I18nService} from "./i18n.service";

@Directive({
    selector: "[i18n]"
})
export class I18nDirective implements AfterContentInit {

    constructor(private el: ElementRef, private i18n: I18nService) {
    }
    ngAfterContentInit() {
        if (this.el.nativeElement.textContent === this.el.nativeElement.innerHTML) {
            this.el.nativeElement.textContent = this.i18n.translate(this.el.nativeElement.textContent.trim());
        }
    }

}
