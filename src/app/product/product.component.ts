import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Location} from "@angular/common"
import {BackendProductService} from "../_services/backend-product.service";
import {Product} from "../_models/product";
import {MdDialogConfig, MdDialog, MdDialogRef} from "@angular/material";
import {DialogLoginBlockComponent} from "../_components/dialog-login-block/dialog-login-block.component";
import {DialogPaletteBlockComponent} from "../_components/dialog-palette-block/dialog-palette-block.component";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    protected loading: boolean = true;
    protected product:Product = new Product();

    private _dialogPalette: MdDialogRef<DialogPaletteBlockComponent>;
    private _dialogLogin: MdDialogRef<DialogLoginBlockComponent>;

    constructor(private route: ActivatedRoute,
                private location: Location,
                private dialog: MdDialog,
                private viewContainerRef: ViewContainerRef,
                private productService: BackendProductService) {
    }

    ngOnInit() {
        let id = "";
        this.route.params.forEach((params: Params) => {
            id = params['id'];
        });
        this.productService.get(id).first().subscribe((p:Product)=>{
            this.product = p;
        }, (err) => {
            console.log("Error loading product", err);
        },()=>{
            this.loading = false;
        })

    }

    public showPalette(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log("main show palette");
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        this._dialogPalette = this.dialog.open(DialogPaletteBlockComponent, config);

        this._dialogPalette.afterClosed().subscribe(result => {
            console.log('result: ' + result);
            this._dialogPalette = null;
        });

    }

    public loginPopup(e) {
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        this._dialogLogin = this.dialog.open(DialogLoginBlockComponent, config);
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
