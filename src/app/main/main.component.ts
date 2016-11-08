import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Product} from "../_models/product";
import {Subject, Observable, Subscription} from "rxjs";
import {CategoryList, CategoryType} from "../_models/enums/category.enum";
import {BackendProductService} from "../_services/backend-product.service";
import {ProductSorter} from "../_infrastructure/product-sorter";

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

    protected productsAll: Product[] = [];
    categoryList = CategoryList;
    products: Product[] = [];

    loading = true;
    selectedCategory: CategoryType;

    constructor(private _storage: BackendProductService,
                private _router: Router,
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
    }

    public loginPopup(e) {
        console.log("main show popup");
    }
}
