import {Component, OnInit, OnDestroy} from '@angular/core';
import {FirebaseDB} from "../_services/firebase-db.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription, Observable} from "rxjs";
import {UserService} from "../_services/user.service";

interface MessageObject {
    name: string;
    message: string;
}

@Component({
    selector: 'app-order-messages',
    templateUrl: './order-messages.component.html',
    styleUrls: ['./order-messages.component.scss']
})
export class OrderMessagesComponent implements OnInit, OnDestroy {

    public loading = true;
    public message;
    public messages:MessageObject[] = [];
    public uuid = "";

    private ref;
    private subscription: Subscription;

    constructor(private f: FirebaseDB,
                private route: ActivatedRoute,
                private us: UserService) {

    }

    ngOnInit() {
        this.subscription = this.route.params.first().switchMap((p: Params) => {
            this.uuid = p["id"];
            this.ref = this.f.ref("/orders/" + this.uuid);
            return Observable.of({});
        }).switchMap(() => {
            this.ref.on("child_added", (m) => this.onMessage(m.val()));
            this.loading = false;
            return Observable.of({});
        }).subscribe();
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.ref.off("child_added", this.onMessage);
    }

    send() {
        if (this.message === "") {
            return;
        }
        let m = this.message;
        this.message = "";
        this.ref.push().set(<MessageObject>{
            name: this.us.getUser().name,
            message: m,
        })
    }

    onMessage(message: MessageObject) {
        this.messages.push(message)
    }

}
