import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Product} from "../_models/product";
import {Subject, Observable, Subscription} from "rxjs";
import {CategoryList, CategoryType} from "../_models/enums/category.enum";
import {BackendProductService} from "../_services/backend-product.service";
import {ProductSorter} from "../_infrastructure/product-sorter";
import {MdDialog, MdDialogConfig, MdDialogRef} from "@angular/material";
import {UserService} from "../_services/user.service";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit, OnDestroy {
    private _searchTermStream = new Subject<string>();
    private _searchTerm: string;
    private _lastSelectedCategory: CategoryType;
    private _sub: Subscription;
    private _dialogPalette: MdDialogRef<PaletteDialog>;
    private _dialogLogin: MdDialogRef<LoginDialog>;

    protected productsAll: Product[] = [];
    categoryList = CategoryList;
    products: Product[] = [];

    loading = true;
    selectedCategory: CategoryType;

    constructor(private _storage: BackendProductService,
                private dialog: MdDialog,
                private viewContainerRef: ViewContainerRef,
                private _route: ActivatedRoute,
                private _location: Location) {
    }

    ngOnInit() {
        let category = 0;
        this._route.queryParams.forEach((params: Params) => {
            category = +params["category"] || 0;
        });
        this._storage.getAllDocs().first().subscribe(docs => {
            this.productsAll = docs.sort(ProductSorter.sort);
            this.loading = false;
            this.categoryChange(category);
        });
        this._sub = this.initSearchStream();
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }

    asyncSearch(term: string): void {
        this._searchTermStream.next(term);
    }

    categoryChange(cat: CategoryType) {
        if (cat === undefined || isNaN(cat) || <string><any>cat === "") {
            this.selectedCategory = undefined;
            this.products = [];
        } else {
            this._location.go("/", "category=" + cat);
            this.selectedCategory = cat;
            this._lastSelectedCategory = cat;
            // funny hacks
            this._searchTerm = "";
            Observable.of(this.productsAll).subscribe(p => {
                this.products = p.filter(p => p.category === cat);
            });
        }
    }

    private initSearchStream(): Subscription {
        return this._searchTermStream
            .debounceTime(100)
            .distinctUntilChanged()
            .subscribe(term => {
                console.log("search", term)
                let t = (<string>term).toLowerCase()
                if (t === "") {
                    console.log("empty term, select last", this._lastSelectedCategory)
                    return this.categoryChange(this._lastSelectedCategory)
                }

                let p = this.productsAll
                this.categoryChange(undefined)

                Observable.of(p).subscribe((arr) => {

                    let f = arr.filter(prod => this._indexOf(prod.sku, t, true));
                    if (f.length === 0) {
                        f = arr.filter(prod => this._indexOf(prod.name, t) || this._indexOf(prod.description, t));
                    }
                    f = f.slice(0, 40);
                    this.products = f;
                });
            }, err => {
                console.error("translation stream error:", err)
            });
    }

    private _indexOf(field, term, start?: boolean): boolean {
        if (typeof(field) !== "string") {
            return false;
        }
        return start ? field.toLowerCase().indexOf(term) === 0 : field.toLowerCase().indexOf(term) > -1;
    }


    public showPalette(e) {
        // let config = new MdDialogConfig().targetEvent(e);
        // this.dialog.open(DialogPalette, this.element, config)
        console.log("main show palette");
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        this._dialogPalette = this.dialog.open(PaletteDialog, config);

        this._dialogPalette.afterClosed().subscribe(result => {
            console.log('result: ' + result);
            this._dialogPalette = null;
        });

    }

    public loginPopup(e) {
        console.log("main show popup");
        console.log(e);


        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        this._dialogLogin = this.dialog.open(LoginDialog, config);
        this._dialogLogin.afterClosed().subscribe(result => {
            console.log('result: ' + result);
            this._dialogLogin = null;
            if(result && typeof(e["successAction"]) === "function" ){
                console.log(e);
                e["successAction"]()
            }
        });
    }
}

@Component({
    selector: 'pizza-dialog',
    template: `
  <md-card style="max-width: 300px;">

    <img md-card-image src="https://pp.vk.me/c629305/v629305041/22672/36-00Z7xGiw.jpg">
    <md-card-actions>
        <button md-button (click)="dialogRef.close(false)">
          <span>Close</span>
        </button>
    </md-card-actions>
  </md-card>

  
  `
})
export class PaletteDialog {
    constructor(public dialogRef: MdDialogRef<PaletteDialog>) {
    }
}

@Component({
    selector: 'login-dialog',
    template: `
<md-card>
    <md-card-header>
        <md-card-title>
            {{signup ? "Registration" : "Login" }}
        </md-card-title>
    </md-card-header>
    <md-card-content>
      <section *ngIf="!signup">
        <app-login-block></app-login-block>
        <p>
            Do not have an account yet? Let's register&nbsp;<a href="javascript:void(0)" (click)="signup = !signup">now</a>!
        </p>
      </section>
      <section *ngIf="signup">
        <app-registration-block></app-registration-block>
        <p>
            Already have an account? Let's login&nbsp;<a href="javascript:void(0)" (click)="signup = !signup">now</a>!
        </p>
      </section>
    </md-card-content>
    <md-card-actions>
        <button md-button (click)="dialog.close(false)">
          <span>Cancel</span>
        </button>
    </md-card-actions>
</md-card>
`,
})
export class LoginDialog {
    private signup = false;

    constructor(private dialog: MdDialogRef<LoginDialog>, private userService:UserService) {

    }

    ngOnInit(){
        let s = this.userService.getLoginStream().first().subscribe(e => {
            this.dialog.close(true);
            s.unsubscribe()
        })
    }
}
