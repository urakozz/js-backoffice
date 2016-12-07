import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Product} from "../_models/product";
import {Subject, Observable} from "rxjs";
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from "@angular/forms";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {AttributeTypes, ProductSelectableAttribute} from "../_models/category";
import {CategoryList} from "../_models/enums/category.enum";
import {BackendProductService} from "../_services/backend-product.service";
import {Uuid} from "../_infrastructure/uuid";

@Component({
    selector: "app-product-edit",
    templateUrl: "./product-edit.component.html",
    styleUrls: ["./product-edit.component.css"]
})
export class ProductEditComponent implements OnInit {

    private product: Product = new Product();
    private _skuTerm = new Subject<string>();
    private skuSuggest = [];
    private justSaved = false;
    private useCustomAttributes = false;

    public form: FormGroup;
    private attributesDefault: FormArray;
    private attributes: FormArray;

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _sp: BackendProductService,
                private _fb: FormBuilder,
                private _location: Location) {
    }

    ngOnInit() {
        this.attributes = new FormArray([]);
        this.attributesDefault = new FormArray([]);
        this.form = this._fb.group({
            name: new FormControl(this.product.name, Validators.required),
            description: new FormControl(this.product.description, Validators.nullValidator),
            image: new FormControl(this.product.image, Validators.nullValidator),
            sku: new FormControl(this.product.sku, Validators.required),
            category: new FormControl(this.product.category, Validators.required),
            price: new FormControl(this.product.price, Validators.required),
            attributes: this.attributes,
            attributesDefault: this.attributesDefault,
        });
        this.product.selectableAttributes.getList().forEach(a => {
            this.attributesDefault.push(new FormControl(a.name, Validators.nullValidator));
        });

        this.form.controls["sku"].valueChanges.distinct().filter(v => !!v).subscribe((v: string) => {
            this._skuTerm.next(v);
        });
        this.attributes.valueChanges.subscribe(e => {
            if (e.length === 0) {
                this.useCustomAttributes = false;
            }
        });
        this._initSkuStream();

        this._loadProduct().subscribe(p => {
            this._setProduct(p);
        }, (err) => {
            console.log("error get product: ", err);
            this._router.navigate(["/product-edit", "new"]);
        });
    }

    applyProduct() {
        console.log(this.product);
        console.log(this.form.value);
        this.product.name = this.form.value.name;
        this.product.description = this.form.value.description;
        this.product.image = this.form.value.image;
        this.product.sku = this.form.value.sku;
        this.product.category = Number.parseInt(this.form.value.category);
        this.product.price = Number.parseInt(this.form.value.price);


        let attrs = this.attributes.value.filter(s => (s + "").length > 0);
        if (attrs.length === 0) {
            this.useCustomAttributes = false;
        }
        if (!this.useCustomAttributes) {
            attrs = this.attributesDefault.value;
        }
        console.log(attrs);
        this.product.selectableAttributes.reset();

        attrs.forEach(v => {
            this.product.selectableAttributes.push(
                new ProductSelectableAttribute(AttributeTypes.OPTION, v)
            );
        });
    }

    save() {
        this.applyProduct();
        let wasNew = false;
        if (!this.product.id) {
            this.product.id = Uuid.random();
            wasNew = true;
        }
        this._sp.set(this.product).subscribe((p: Product) => {
            this._setProduct(p);
            if (wasNew) {
                this._router.navigate(["/product-edit", p.id]);
            }
            this._justSaved();
        }, (e) => {
            console.log("error on save", e);
        });
    }

    get colorKeys() {
        return Object.keys(this.attributes.controls);
    }

    get catList() {
        return CategoryList;
    }

    delete(e) {
        e.preventDefault();
        e.stopPropagation();
        this._sp.delete(this.product).subscribe(b => {
            this.product.id = undefined;
            this._location.go("/product-edit/new");
        });
    }

    addAttribute(e) {
        e.stopPropagation();
        e.preventDefault();
        this._addAttributeControl("");
        // this.attributes.updateValueAndValidity({emitEvent: true});
    }

    deleteAttribute(e, i): void {
        e.stopPropagation();
        e.preventDefault();
        this.attributes.removeAt(i);
        // this.attributes.updateValueAndValidity({emitEvent: true})
    }

    setUseCustomAttributes(b: boolean) {
        this.useCustomAttributes = b;
        if (b && this.attributes.controls.length === 0) {
            this._addAttributeControl("");
        }
    }

    private _loadProduct(): Observable<Product> {
        let id = "";
        this._route.params.forEach((params: Params) => {
            id = params["id"];
        });
        if (!id) {
            return Observable.of(new Product());
        }
        return this._sp.get(id);
    }

    private _setDetailsFromProduct(p: Product) {
        this.form.patchValue({
            name: p.name,
            description: p.description,
            image: p.image,
            sku: p.sku,
            category: p.category,
            price: p.price,
        });
    }

    private _setAttributesFromProduct(p: Product) {

        Object.keys(this.attributes.controls).forEach(() => {
            this.attributes.removeAt(0);
        });
        if (p.hasOnlyDefaultAttributes()) {
            this.useCustomAttributes = false;
        } else {
            this.useCustomAttributes = true;
            p.selectableAttributes.getList().forEach(a => {
                this._addAttributeControl(a.name);
            });
        }

        // this.attributes.updateValueAndValidity({emitEvent: true})
    }

    private  _addAttributeControl(value: string) {
        this.attributes.push(new FormControl(value, Validators.nullValidator));
    }

    private _initSkuStream() {
        this._skuTerm
            .debounceTime(100)
            .distinctUntilChanged()
            .switchMap(term => {
                let t = (<string>term).toLowerCase();
                console.log("stream", term);
                return this._sp.getAllDocs()
                    .map(docs => docs.map(doc => doc.sku))
                    .map(docs => docs.filter(sku => sku && sku.toLowerCase().indexOf(t) === 0))
                    .map(docs => {
                        if (docs.length > 10) {
                            return docs.slice(0, 10);
                        }
                        return docs;
                    });
            })
            .subscribe(data => {
                this.skuSuggest = <string[]>data;
            });
    }


    private _setProduct(p: Product) {
        this.product = p;
        this._setAttributesFromProduct(p);
        this._setDetailsFromProduct(p);
    }

    private _justSaved() {
        this.justSaved = true;
        Observable.of(false).delay(1000).subscribe(b => {
            this.justSaved = b;
        });
    }

}
