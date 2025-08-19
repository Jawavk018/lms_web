import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, { Autoplay, Navigation } from "swiper";

// install Swiper modules
SwiperCore.use([Autoplay, Navigation]);

@Component({
  selector: 'app-categoriessectiontwo',
  templateUrl: './categoriessectiontwo.component.html',
  styleUrls: ['./categoriessectiontwo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoriessectiontwoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
