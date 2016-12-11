import {Injectable, OpaqueToken, Inject} from '@angular/core';
import * as Raven from 'raven-js';

export const RAVEN_URL = new OpaqueToken("logger.raven.url");

@Injectable()
export class RavenLoggerService {

    private static initialized = false;

    constructor(@Inject(RAVEN_URL) url: string ) {
        console.log("url", url);
        if(url) {
            Raven
                .config(url)
                .install();
            RavenLoggerService.initialized = true;
        }
    }

    static log(error){
        if(RavenLoggerService.initialized) {
            Raven.captureException(error.originalError);
        }
    }

}
