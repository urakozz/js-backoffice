import {Directive, HostListener, ElementRef} from "@angular/core";

@Directive({
    selector: "[lowercase]"
})
export class LowercaseDirective {

    constructor(private ref: ElementRef) {
    }

    @HostListener("input", ["$event"]) onInput(e) {
        let v = e.target.value.toLowerCase();
        if (this.ref.nativeElement.tagName === "MD-INPUT") {
            this.ref.nativeElement.querySelector("input").value = v;
        } else {
            this.ref.nativeElement.value = v;
        }
    }

}
