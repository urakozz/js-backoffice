/**
 * Created by yury on 25/11/2016.
 */

import * as firebase from "firebase";


export class FirebaseDB {
    ref(path?: string):any{

    }
}

export function firebaseDbInitializer(key) {
    let config = {
        apiKey: key,
        authDomain: "madam-scrap.firebaseapp.com",
        databaseURL: "https://madam-scrap.firebaseio.com/",
    };
    //noinspection TypeScriptUnresolvedFunction
    firebase.initializeApp(config);
    //noinspection TypeScriptUnresolvedFunction
    return firebase.database()
}
