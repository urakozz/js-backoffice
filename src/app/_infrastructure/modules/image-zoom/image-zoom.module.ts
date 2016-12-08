/**
 * Created by yury on 08/12/2016.
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageZoomDirective} from './image-zoom.directive';
import {ImageZoomContainer} from './image-zoom-container.component';

export {ImageZoomDirective, ImageZoomContainer};

@NgModule({
    imports : [CommonModule],
    exports : [ImageZoomDirective],
    declarations : [ImageZoomDirective, ImageZoomContainer],
    entryComponents: [ImageZoomContainer]
})
export class ImageZoomModule {
}