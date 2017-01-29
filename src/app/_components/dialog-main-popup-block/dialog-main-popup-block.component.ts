import {Component, OnInit} from '@angular/core';
import {MdDialogRef} from "@angular/material";

@Component({
    selector: 'app-dialog-main-popup-block',
    templateUrl: './dialog-main-popup-block.component.html',
    styleUrls: ['./dialog-main-popup-block.component.scss']
})
export class DialogMainPopupBlockComponent implements OnInit {

    constructor(public dialogRef: MdDialogRef<DialogMainPopupBlockComponent>) {
    }

    ngOnInit() {
    }

}
