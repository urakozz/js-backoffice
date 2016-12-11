import {ErrorHandler} from "@angular/core";
import * as Raven from 'raven-js';

Raven
    .config('https://d400d891cab8491da2779e7ca3504d17@sentry.io/121302')
    .install();

export class CustomErrorHandler implements ErrorHandler {
    handleError(error) {
        console.log("here  i am", error);
        Raven.captureException(error.originalError);
    }
}