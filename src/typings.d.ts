// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare let System: any;

// Loader tool
// http://github.hubspot.com/pace/
interface Pace {
    start();
    restart();
    stop();
    track();
    ignore();
    trigger(event: string);
}

// declare module 'raven-js';


interface Window { Pace: Pace; dataLayer: Array<any>; URLPolyfill: any}
