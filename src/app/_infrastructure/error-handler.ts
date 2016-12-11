import {ErrorHandler} from "@angular/core";
import * as Raven from 'raven-js';
import {environment} from '../../environments/environment';

Raven
    .config(environment.RAVEN_URL)
    .install();

export class CustomErrorHandler implements ErrorHandler {
    handleError(error) {
        console.log("here  i am", error);
        Raven.captureException(error.originalError);
    }
}