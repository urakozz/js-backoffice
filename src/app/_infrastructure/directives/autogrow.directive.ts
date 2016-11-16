import {Directive, HostListener} from "@angular/core";

@Directive({
    selector: "textarea[autogrow]"
})
export class AutogrowDirective {

    constructor() {
    }

    @HostListener("input", ["$event"]) onInput(e) {
        let textArea = e.target;
        textArea.style.height = "auto";

        // set the height to scrollHeight minus some correction
        let correction = textArea.offsetHeight - textArea.clientHeight;
        let h = textArea.scrollHeight - correction;
        textArea.style.height = h + "px";
    }

}



