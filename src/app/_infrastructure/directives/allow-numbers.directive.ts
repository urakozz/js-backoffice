import {Directive, ElementRef, HostListener, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {isNumber} from "util";
import {isString} from "util";

interface AllowNumberOptions{
    min?:number
    // max?:number
}

@Directive({
    selector: '[allow-numbers]'
})
export class AllowNumbersDirective implements OnInit{

    @Input('allow-numbers') private options:AllowNumberOptions;
    @Output("clearedOutput") out = new EventEmitter();

    private value:number;

    constructor(private ref: ElementRef) {
    }

    ngOnInit(){
        if(this.options && typeof(this.options) === "string") {
            try{
                this.options = JSON.parse(<any>this.options)
            }catch(e){
                this.options = {min:0}
            }
        }
    }

    @HostListener('input', ['$event'])
    onInput(e) {
        let el:HTMLInputElement = this.ref.nativeElement;
        if (this.ref.nativeElement.tagName === "MD-INPUT") {
            el = this.ref.nativeElement.querySelector("input")
        }
        let v = e.target.value.replace(/\D/, "");
        let n = Number.parseInt(v) || 0;
        el.value = n.toString(10);
        this.value = n

    }

    @HostListener('blur', ['$event'])
    onBlur(e) {
        if(this.value >= this.options.min){
            this.out.next(this.value.toString(10))
        }
    }

}
