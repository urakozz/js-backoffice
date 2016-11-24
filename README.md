# MadamScrapLive

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.19-3.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Couchdb notables


Nginx reverse proxy
https://gist.github.com/robbiet480/b1e9a2a22501b8304547

```
http://verbally.flimzy.com/install-couchdb-1-6-1-debian-8-2-jessie/
http://www.matteomattei.com/install-couchdb-1.6.x-on-debian-7-wheezy/
```

```
curl -X GET http://admin:xx@127.0.0.1:5984/_uuids
curl -X PUT http://admin:xx@127.0.0.1:5984/mscrap/123 -d '{"title":"test"}' //{"ok":true,"id":"123","rev":"1-c7695e1bd9ffb27259b45d7ce4e74693"}
curl -X PUT http://admin:xx@127.0.0.1:5984/mscrap/123 -d '{"title":"test", "rev":"1-c7695e1bd9ffb27259b45d7ce4e74693"}' // {"rev":4-fb761b61cff0bcf8c4f3134acef0baf4}

curl -X PUT http://admin:xx@127.0.0.1:5984/mscrap/123/image.png?rev=4-fb761b61cff0bcf8c4f3134acef0baf4 --data-binary @logo.png -H "Content-Type:image/png"

http://162.243.1.101:5984/mscrap/123/image.png



curl -X PUT http://admin:xx@localhost:5984/_users/org.couchdb.user:webadmin -H "Accept: application/json" -H "Content-Type: application/json" -d '{"name": "webadmin", "password": "apple", "roles": ["web_write"], "type": "user"}'
curl -vX PUT http://localhost:5984/mscrap/_security -u admin:xx -H "Content-Type: application/json" -d '{"admins": { "names": [], "roles": ["web_write"] }, "members": { "names": [], "roles": [] } }

curl -vX POST http://localhost:5984/_session -d 'name=webadmin&password=apple'

## couchdb read only
curl -XPUT http://localhost:5984/mscrap/_design/auth -u admin:xx -d '{"validate_doc_update":"function(newDoc, oldDoc, userCtx) {   if (userCtx.roles.indexOf(\"_admin\") >= 0 || userCtx.roles.indexOf(\"web_write\") >= 0 || newDoc.authorName === userCtx.name) { return }  {     throw({forbidden: \"This DB is read-only for your roles: [\" + userCtx.roles.join() + \"]\"});   }   }  "}'
```

#### Console
```
request.open('PUT', 'http://162.243.1.101:5984/mscrap/123', true);
request.setRequestHeader ("Authorization", "Basic " + btoa("webadmin" + ":" + "apple"));
request.send('{"_rev":"1-45fbabeb3b6c6ecfdf9e542b56522b10","data":"from_web"}')
request.responseText
```