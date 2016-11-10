import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[allow-numbers]'
})
export class AllowNumbersDirective {

    constructor(private ref: ElementRef) {
    }

    @HostListener('input', ['$event']) onInput(e) {
        let v = e.target.value.replace(/\D/, "");
        if (this.ref.nativeElement.tagName === "MD-INPUT") {
            this.ref.nativeElement.querySelector("input").value = v
        } else {
            this.ref.nativeElement.value = v;
        }
    }

}
