import {Injectable, Inject} from "@angular/core";
import {Http, Headers, RequestMethod, RequestOptions, Request} from "@angular/http";
import {DOCUMENT} from "@angular/platform-browser";
import {environment} from "../../environments/environment"

export interface HostDetails {
    schema: any;
    host: any;
}

@Injectable()
export class MailService {

    private host = "https://api.sendgrid.com";
    private template = "937c1969-01ff-4c6d-a145-26d93946f52a";

    constructor(private http: Http, @Inject(DOCUMENT) private document) {
    }

    sendConfirmation(email, name, code) {
        return this.http.request(new Request(new RequestOptions({
            method: RequestMethod.Put,
            url: this.host + "/v3/mail/send",
            headers: this._getHeaders(),
            body: JSON.stringify(this._getConfirmationBody(email, name, code, this.document)),
        })));
    }

    private _getHeaders(): Headers {
        let h = new Headers({
            "Content-Type": "application/json",
            "Authorization": "Basic " + environment.MAIL_KEY
        });

        return h;
    }

    private _getConfirmationBody(email, name, code, host: HostDetails) {
        return {
            "personalizations": [{
                "to": [{"email": email}],
                "substitutions": {
                    "-username-": name,
                    "-link-": host.schema + "://" + host.host + "/registration/confirmation?code=" + code
                }
            }],
            "from": {"email": "madamscrap@outlook.com", "name": "Madam Scrap"},

            "subject": "Registration confirmation",
            "content": [
                {"type": "text/plain", "value": ""},
                {"type": "text/html", "value": ""}
            ],
            "template_id": this.template
        };
    }

}
