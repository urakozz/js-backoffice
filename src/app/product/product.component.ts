import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Location} from "@angular/common"

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private location: Location) {
    }

    ngOnInit() {
        let id = "";
        this.route.params.forEach((params: Params) => {
            id = params['id'];
        });

    }

}
