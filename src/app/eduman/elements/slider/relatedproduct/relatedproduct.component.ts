import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductpopupComponent } from 'src/app/eduman/shop/productpopup/productpopup.component';

// import Swiper core and required modules
import SwiperCore, { Autoplay } from "swiper";

// install Swiper modules
SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-relatedproduct',
  templateUrl: './relatedproduct.component.html',
  styleUrls: ['./relatedproduct.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RelatedproductComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  productPopup() {
    this.dialog.open(ProductpopupComponent);
  }

  ngOnInit(): void {}

}
