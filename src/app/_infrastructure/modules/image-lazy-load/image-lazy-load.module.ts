import {NgModule} from "@angular/core";
import {ImageLazyLoadDirective} from "./image-lazy-load.directive";
/**
 * Created by yury on 06/12/2016.
 */
@NgModule({
    declarations: [ ImageLazyLoadDirective ],
    exports: [ ImageLazyLoadDirective ]
})
export class LazyLoadImageModule {}