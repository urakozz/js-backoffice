import {
    Directive, ElementRef, ComponentFactoryResolver, ViewContainerRef, Input, OnInit,
    OnDestroy, OnChanges, SimpleChanges, ComponentRef, HostListener, HostBinding
} from '@angular/core';
import {ImageZoomContainer} from "./image-zoom-container.component";

@Directive({
    selector: 'img[imageZoom]'
})
export class ImageZoomDirective implements OnInit, OnDestroy, OnChanges{

    @Input() protected imageZoom: string;

    @HostBinding('style.cursor')
    cursor: string = 'pointer';

    public img: HTMLImageElement;
    public imageZoomContainer: ImageZoomContainer;
    protected _imageZoomContainerRef: ComponentRef<ImageZoomContainer>;

    constructor(private _elementRef: ElementRef,
                private _componentFactoryResolver: ComponentFactoryResolver,
                private _viewContainerRef: ViewContainerRef) {

    }

    ngOnInit(): void {

        this.img = this._elementRef.nativeElement;

        let imageZoomContainerFactory = this._componentFactoryResolver.resolveComponentFactory(ImageZoomContainer);
        this._imageZoomContainerRef = this._viewContainerRef.createComponent(imageZoomContainerFactory);
        this.imageZoomContainer = this._imageZoomContainerRef.instance;
        this.imageZoomContainer.setParentImageContainer(this);
    }

    ngOnDestroy(): void {
        this._imageZoomContainerRef.destroy();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(changes)
    }


    @HostListener('mouseenter', ['$event'])
    public onMouseenter(event: MouseEvent) {

        // console.log("mouseenter", event);
        // if(!this.isZooming) {
        //     if(this.allowZooming()) {
        //         this.calculateOffsets();
        //         if(this._mouseEnterDebounce !== 0) {
        //             clearTimeout(this._mouseEnterDebounce);
        //         }
        //         this._mouseEnterDebounce = window.setTimeout(() => {
        //             this.isZooming = true;
        //             clearTimeout(this._mouseEnterDebounce);
        //             this._previousCursor = this.img.style.cursor;
        //             this.img.style.cursor = 'pointer';
        //             this.setImageZoomContainerVisiblity(true);
        //             this.setImageZoomLensVisibility(true);
        //         }, this.delay);
        //     }
        // }
    }

    @HostListener('mouseleave', ['$event'])
    public onMouseleave(event: MouseEvent) {
        // console.log("mouseleave", event);
        // let x: number = event.clientX;
        // let y: number = event.clientY;
        // if(y <= this.img.y || y >= (this.img.y + this.img.height) || x <= this.img.x || x >= (this.img.x + this.img.width)) {
        //     if(this._mouseEnterDebounce !== 0) {
        //         clearTimeout(this._mouseEnterDebounce);
        //     }
        //     if(this.isZooming) {
        //         this.img.style.cursor = this._previousCursor;
        //         this.setImageZoomContainerVisiblity(false);
        //         this.setImageZoomLensVisibility(false);
        //         this.isZooming = false;
        //     }
        // } else {
        //     this.onMousemove(event); // "mouseleave" event was just the mouse focus going to the lens
        // }

    }

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent) {
        // console.log("click", event);
        this.imageZoomContainer.setVisibility(true);
    }


    // @HostListener('mousemove', ['$event'])
    // public onMousemove(event: MouseEvent) {
    //     console.log("mousemove", event);
    //     // if(this.allowZooming()) {
    //     //     this._lastEvent = event; // Make sure we end up at the right place, without calling too frequently
    //     //     if(this._mouseMoveDebounce !== 0) {
    //     //         return;
    //     //     }
    //     //     this._mouseMoveDebounce = window.setTimeout(() => {
    //     //         if(!this.isZooming && this._mouseEnterDebounce === 0) {
    //     //             this.onMouseenter(event);
    //     //         }
    //     //
    //     //         this.calculateBoundaries(this._lastEvent.clientX, this._lastEvent.clientY);
    //     //         this.setImageBackgroundPosition();
    //     //         this.setImageZoomLensPosition();
    //     //         this.setWindowPosition();
    //     //         clearTimeout(this._mouseMoveDebounce);
    //     //     }, 10); // Wait 10ms to be more performant
    //     // }
    // }

}
