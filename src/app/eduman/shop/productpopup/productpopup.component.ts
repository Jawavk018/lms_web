import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-productpopup',
  templateUrl: './productpopup.component.html',
  styleUrls: ['./productpopup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductpopupComponent {
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
}
