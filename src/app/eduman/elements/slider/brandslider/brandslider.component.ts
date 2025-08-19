import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, { Autoplay } from "swiper";

// install Swiper modules
SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-brandslider',
  templateUrl: './brandslider.component.html',
  styleUrls: ['./brandslider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrandsliderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
