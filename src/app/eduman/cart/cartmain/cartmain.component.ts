import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cartmain',
  templateUrl: './cartmain.component.html',
  styleUrls: ['./cartmain.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CartmainComponent implements OnInit {
  //counter
  counters: { [key: string]: number } = {
    count: 1,
    count1: 1,
    count2: 1,
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
