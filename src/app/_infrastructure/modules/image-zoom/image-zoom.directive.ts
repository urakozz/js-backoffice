import {
    Directive, ElementRef, ComponentFactoryResolver, ViewContainerRef, Input, OnInit,
    OnDestroy, OnChanges, SimpleChanges, ComponentRef, HostListener, HostBinding, Injector
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

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent) {
        this.imageZoomContainer.setVisibility(true);
    }

}
