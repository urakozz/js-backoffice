import {Directive, ElementRef, Renderer, AfterContentInit} from "@angular/core";
import {I18nService} from "./i18n.service";

@Directive({
    selector: "[i18n]"
})
export class I18nDirective implements AfterContentInit {

    constructor(private el: ElementRef, private renderer: Renderer, private i18n: I18nService) {
    }
    ngAfterContentInit() {
        if (this.el.nativeElement.textContent === this.el.nativeElement.innerHTML) {
            this.renderer.setText(this.el.nativeElement, this.i18n.translate(this.el.nativeElement.innerHTML.trim()));
        }
    }

}
