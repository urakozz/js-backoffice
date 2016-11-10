import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[uppercase]'
})
export class UppercaseDirective {

    constructor(private ref: ElementRef) {
    }

    @HostListener('input', ['$event']) onInput(e) {
        let v = e.target.value.toUpperCase();
        if(this.ref.nativeElement.tagName === "MD-INPUT") {
            this.ref.nativeElement.querySelector("input").value = v
        } else {
            this.ref.nativeElement.value = v;
        }
    }

}
