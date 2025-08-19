import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popupvideo',
  templateUrl: './popupvideo.component.html',
  styleUrls: ['./popupvideo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupvideoComponent implements OnInit {

  videoUrl: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.videoUrl = this.data;
  }

}
