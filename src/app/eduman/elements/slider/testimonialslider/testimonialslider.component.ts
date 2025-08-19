import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, { Pagination, Autoplay } from "swiper";

// install Swiper modules
SwiperCore.use([ Pagination, Autoplay])

@Component({
  selector: 'app-testimonialslider',
  templateUrl: './testimonialslider.component.html',
  styleUrls: ['./testimonialslider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestimonialsliderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

}
