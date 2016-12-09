/**
 * Created by yury on 08/12/2016.
 */
import {Component, HostListener, ElementRef, Input} from '@angular/core';
import {ImageZoomDirective} from './image-zoom.directive';

@Component({
    selector: 'image-zoom-container',
    template: `
<div class="image-zoom-wrapper" [style.height]="displayHeight + 'px'" [style.margin-top]="marginTop + 'px'">
    <img class="image-zoom-wrapper__img" [src]="src" *ngIf="src">
</div>`,
    styles: [`
        :host {
            pointer-events: none;
            opacity: 0;
            -webkit-transition:    opacity 300ms;
               -o-transition:      opacity 300ms;
                  transition:      opacity 300ms;
            z-index: 420;
            /*background: rgba(255,255,255,.85);*/
            background-color: rgba(0, 0, 0, 0.8);
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: scroll; 
            
            position: fixed;

            
        }
        :host.open {
            opacity: 1;
        }
        .image-zoom-wrapper{
            cursor: pointer;
            cursor: -webkit-zoom-out;
            cursor: -moz-zoom-out;
            display: flex;
            
        /*overflow: scroll;*/
        }
        .image-zoom-wrapper__img{
        height: 90%; width: 90%; object-fit: contain;
        padding-top: 2%;
        border-radius: 5px;
            margin: auto;
            cursor: pointer;
            cursor: -webkit-zoom-out;
            cursor: -moz-zoom-out;
            /*width: 70vmin; */
    /*height: 70vmin;*/
    /*max-width: 500px; */
    /*max-height: 500px;*/
        }
    `]
})
export class ImageZoomContainer {

    public src: string;
    public marginTop: number = 0;
    public displayHeight: number = 0;

    private _el: HTMLElement;

    private _parentImageContainer: ImageZoomDirective;

    constructor(private _elementRef: ElementRef) {
        this._el = this._elementRef.nativeElement;
    }

    public setParentImageContainer(parentImageContainer: ImageZoomDirective) {
        this._parentImageContainer = parentImageContainer;
    }

    public setVisibility(visible: boolean) {
        this.src = this.src || this._parentImageContainer.img.src;
        if (visible) {
            this._el.classList.add("open");
            this._el.style["pointer-events"] = "auto";
            this.marginTop = -this._el.getBoundingClientRect().top;
            this.displayHeight = window.innerHeight
        } else {
            this._el.classList.remove("open");
            this._el.style["pointer-events"] = null;
        }
    }

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent) {
        this.setVisibility(false)
    }

}