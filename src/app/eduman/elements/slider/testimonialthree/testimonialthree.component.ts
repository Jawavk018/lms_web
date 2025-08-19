import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, { Autoplay } from "swiper";

// install Swiper modules
SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-testimonialthree',
  templateUrl: './testimonialthree.component.html',
  styleUrls: ['./testimonialthree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestimonialthreeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
