import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shopduration',
  templateUrl: './shopduration.component.html',
  styleUrls: ['./shopduration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopdurationComponent implements OnInit {
  shopDurationActive:boolean=false;
  shopDuration(){
    if(this.shopDurationActive==false){
      this.shopDurationActive=true;
    }
    else {
      this.shopDurationActive=false;
    }
  }

  constructor() { }

  ngOnInit(): void {}

}
