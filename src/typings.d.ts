// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

// Loader tool
// http://github.hubspot.com/pace/
interface Pace {
    start();
    restart();
    stop();
    track();
    ignore();
}

interface Window { Pace: Pace; }
