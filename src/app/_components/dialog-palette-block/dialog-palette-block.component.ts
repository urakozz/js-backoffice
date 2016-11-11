import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog-palette-block',
  templateUrl: './dialog-palette-block.component.html',
  styleUrls: ['./dialog-palette-block.component.scss']
})
export class DialogPaletteBlockComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<DialogPaletteBlockComponent>) {
  }

  ngOnInit() {
  }

}


