import {Pipe, PipeTransform} from "@angular/core";
import * as Autolinker from "autolinker";

@Pipe({
    name: "linkly"
})
export class LinklyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return Autolinker.link(value, args);
    }

}
