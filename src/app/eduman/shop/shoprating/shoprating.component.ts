import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shoprating',
  templateUrl: './shoprating.component.html',
  styleUrls: ['./shoprating.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopratingComponent implements OnInit {
  shopRatingActive:boolean=false;
  shopRating(){
    if(this.shopRatingActive==false){
      this.shopRatingActive=true;
    }
    else {
      this.shopRatingActive=false;
    }
  }
  constructor() { }

  ngOnInit(): void {}

}
