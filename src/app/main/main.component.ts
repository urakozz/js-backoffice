import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Params} from "@angular/router";
import {Product} from "../_models/product";
import {Subject, Observable, Subscription} from "rxjs";
import {CategoryList, CategoryType} from "../_models/enums/category.enum";
import {BackendProductService} from "../_services/backend-product.service";
import {ProductSorter} from "../_infrastructure/product-sorter";
import {MdDialog, MdDialogConfig, MdDialogRef} from "@angular/material";
import {DialogPaletteBlockComponent} from "../_components/dialog-palette-block/dialog-palette-block.component";
import {DialogLoginBlockComponent} from "../_components/dialog-login-block/dialog-login-block.component";
import {isNullOrUndefined} from "util";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit, OnDestroy {
    private _searchTermStream = new Subject<string>();
    private _searchTerm: string;
    private _lastSelectedCategory: CategoryType;
    private _sub: Subscription;
    private _dialogPalette: MdDialogRef<DialogPaletteBlockComponent>;
    private _dialogLogin: MdDialogRef<DialogLoginBlockComponent>;

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
        let search = "";
        this._route.queryParams.forEach((params: Params) => {
            category = +params["category"] || 0;
            search = params["search"] || "";
        });
        this._storage.getAllDocs().first().subscribe(docs => {
            this.productsAll = docs.sort(ProductSorter.sort);
            this.loading = false;
            this.categoryChange(category);
            if (search.length > 0) {
                this._searchTerm = search;
                this.searchTermChange(search);
            }
        });
        this._sub = this.initSearchStream();
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }

    asyncSearch(term: string) {
        this._searchTermStream.next(term);
    }

    searchTermChange(t: string) {
        console.log("searchTermChange", t);
        this._location.go("/", "search=" + encodeURIComponent(t));
        Observable.of(this.productsAll).subscribe((arr) => {
            let f = arr.filter((prod: Product) => this._indexOf(prod.sku, t, true));
            if (f.length === 0) {
                f = arr.filter((prod: Product) => this._indexOf(prod.name, t) || this._indexOf(prod.description, t));
            }
            f = f.slice(0, 40);
            this.products = f;
        });
    }


    categoryChange(cat: CategoryType) {
        if (isNullOrUndefined(cat) || isNaN(cat) || <string><any>cat === "") {
            this.selectedCategory = null;
            this.products = [];
        } else {
            this._location.go("/", "category=" + cat);
            this.selectedCategory = cat;
            this._lastSelectedCategory = cat;
            // funny hacks
            this._searchTerm = "";
            Observable.of(this.productsAll).subscribe(p => {
                this.products = p.filter((p_: Product) => p_.category === cat);
            });
        }
    }

    private initSearchStream(): Subscription {
        return this._searchTermStream
            .debounceTime(100)
            .distinctUntilChanged()
            .subscribe((term: string) => {
                console.log("search", term);
                let t = term.toLowerCase();
                if (t === "") {
                    this.searchTermChange(null);
                    this.categoryChange(this._lastSelectedCategory);
                } else {
                    this.categoryChange(null);
                    this.searchTermChange(t);
                }
            }, err => {
                console.error("translation stream error:", err);
            });
    }

    private _indexOf(field, term, start?: boolean): boolean {
        if (typeof(field) !== "string") {
            return false;
        }
        return start ? field.toLowerCase().indexOf(term) === 0 : field.toLowerCase().indexOf(term) > -1;
    }


    public showPalette(e) {
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        this._dialogPalette = this.dialog.open(DialogPaletteBlockComponent, config);

        let s = this._dialogPalette.afterClosed().subscribe(result => {
            console.log("result: " + result);
            this._dialogPalette = null;
            s.unsubscribe();
        });

    }

    public loginPopup(e) {
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        this._dialogLogin = this.dialog.open(DialogLoginBlockComponent, config);
        let s = this._dialogLogin.afterClosed().subscribe(result => {
            console.log("result: " + result);
            this._dialogLogin = null;
            if (result && typeof(e["successAction"]) === "function") {
                console.log(e);
                e["successAction"]();
            }
            s.unsubscribe();
        });
    }
}

