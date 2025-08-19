import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shopprice',
  templateUrl: './shopprice.component.html',
  styleUrls: ['./shopprice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShoppriceComponent implements OnInit {
  shopPriceActive:boolean=false;
  shopPrice(){
    if(this.shopPriceActive==false){
      this.shopPriceActive=true;
    }
    else {
      this.shopPriceActive=false;
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
