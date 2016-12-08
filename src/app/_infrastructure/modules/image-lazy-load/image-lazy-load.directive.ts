import {Directive, Input, ElementRef, AfterContentInit} from '@angular/core';
import {Observable} from "rxjs";

@Directive({
    selector: '[lazyLoad]'
})
export class ImageLazyLoadDirective implements AfterContentInit {

    @Input('lazyLoad') lazyImage; // The image to be lazy loaded
    @Input('src') defaultImg;     // The default image, this image will be displayed before the lazy-loded-image has been loaded
    @Input('errorImage') errorImg; // The image to be displayed if lazyImage load fails
    // Chnage the node we should listen for scroll events on, default is window
    _scrollTarget = window;
    @Input() set scrollTarget(target) {
        this._scrollTarget = target || this._scrollTarget;
    };

    @Input() offset: number;      // The number of px a image should be loaded before it is in view port
    elementRef: ElementRef;
    scrollSubscription;

    constructor(el: ElementRef) {
        this.elementRef = el;
    }

    ngAfterContentInit() {
        this.scrollSubscription = getScrollListener(this._scrollTarget)

            .filter(() => this.isVisible())
            // .do((x)=>console.log("scrollSubscription", x))
            .take(1)
            .switchMap(() => this.loadImage(this.lazyImage))
            .do(() => this.setImage(this.lazyImage))
            .finally(() => this.setLoadedStyle())
            .subscribe(
                () => this.ngOnDestroy(),
                error => {
                    // Set error image if was set, otherwise use default image
                    this.setImage(this.errorImg || this.defaultImg);
                    this.ngOnDestroy();
                }
            );
    }

    loadImage(image) {
        return Observable
            .create(observer => {
                const img = new Image();
                img.src = image;
                if(img.complete) {
                    observer.next(img);
                    observer.complete();
                }
                img.onload = () => {
                    observer.next(img);
                    observer.complete();
                };
                img.onerror = err => {
                    observer.error(err);
                    observer.complete();
                };
            });
    }

    setImage(image) {
        const element = this.elementRef.nativeElement;
        const isImgNode = this.elementRef.nativeElement.nodeName.toLowerCase() === 'img';
        if (isImgNode) {
            element.src = image;
        } else {
            element.style.backgroundImage = `url('${image}')`;
        }
    }

    setLoadedStyle() {
        const styles = this.elementRef.nativeElement.className
            .split(' ')
            .filter(s => !!s)
            .filter(s => s !== 'ng2-lazyloading');
        styles.push('ng2-lazyloaded');
        this.elementRef.nativeElement.className = styles.join(' ');
    }

    isVisible() {
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        const threshold = (this.offset | 0);
        // Is the element in viewport but larger then viewport itself
        const elementLargerThenViewport = rect.top <= threshold && rect.bottom >= -threshold;
        // Is the top of the element in the viewport
        const topInsideViewport = rect.top >= 0 && rect.top <= window.innerHeight+threshold;
        // Is the bottom of the element in the viewport
        const belowInsideViewport = rect.bottom >= 0 && rect.bottom <= window.innerHeight+threshold;
        // Is the right side of the element in the viewport
        const rightsideInViewport = rect.right >= -threshold && (rect.right - threshold) <= window.innerWidth;
        // Is the left side of the element is the viewport
        const leftsideInViewport = rect.left >= -threshold && (rect.left - threshold) <= window.innerWidth;

        return (
            elementLargerThenViewport ||
            ((topInsideViewport || belowInsideViewport) &&
            (rightsideInViewport || leftsideInViewport))
        );
    }

    ngOnDestroy() {
        [this.scrollSubscription]
            .filter(subscription => subscription && !subscription.isUnsubscribed)
            .forEach(subscription => subscription.unsubscribe());
    }

}

const scrollListeners = new WeakMap<any, Observable<any>>();

function sampleObservable(obs: Observable<any>, scheduler?: any) {
    return obs
        .sampleTime(50, scheduler)
        .share()
        .startWith('');
}

// Only create one scroll listener per target and share the observable.
// Typical, there will only be one observable per application
const getScrollListener = (scrollTarget): Observable<any> => {
    if (!scrollTarget || typeof scrollTarget.addEventListener !== 'function') {
        console.warn('`addEventListener` on ' + scrollTarget + ' (scrollTarget) is not a function. Skipping this target');
        return Observable.empty();
    }
    if (scrollListeners.has(scrollTarget)) {
        return scrollListeners.get(scrollTarget);
    }

    const srollEvent = Observable.create(observer => {
        const eventName = 'scroll';
        const handler = event => observer.next(event);
        const options = {passive: true, capture: false};
        scrollTarget.addEventListener(eventName, handler, options);
        return () => {
            scrollTarget.removeEventListener(eventName, handler, options);
        }
    });

    const listener = sampleObservable(srollEvent);
    scrollListeners.set(scrollTarget, listener);
    return listener;
};
