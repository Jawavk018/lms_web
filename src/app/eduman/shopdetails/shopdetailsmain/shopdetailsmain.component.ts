import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shopdetailsmain',
  templateUrl: './shopdetailsmain.component.html',
  styleUrls: ['./shopdetailsmain.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopdetailsmainComponent implements OnInit {
  //counter
  counters: { [key: string]: number } = {
    count: 1,
  };

  counter(key: string, type: string) {
    if (type === 'add') {
      this.counters[key]++;
    } else if (type === 'subtract' && this.counters[key] > 1) {
      this.counters[key]--;
    }
  }
  constructor() { }

  ngOnInit(): void {}

}
