import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AboutpopupvideoComponent } from '../../common/aboutpopupvideo/aboutpopupvideo.component';


@Component({
  selector: 'app-aboutfeaturevideo',
  templateUrl: './aboutfeaturevideo.component.html',
  styleUrls: ['./aboutfeaturevideo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutfeaturevideoComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openDialogA() {
    this.dialog.open(AboutpopupvideoComponent);
  }

  ngOnInit(): void {
  }

}
