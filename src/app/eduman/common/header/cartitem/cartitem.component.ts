import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cartitem',
  templateUrl: './cartitem.component.html',
  styleUrls: ['./cartitem.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CartitemComponent {
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
}
