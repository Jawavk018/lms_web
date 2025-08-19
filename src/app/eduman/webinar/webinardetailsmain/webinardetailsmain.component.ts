import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WebinarvideopopupComponent } from '../../common/webinarvideopopup/webinarvideopopup.component';

@Component({
  selector: 'app-webinardetailsmain',
  templateUrl: './webinardetailsmain.component.html',
  styleUrls: ['./webinardetailsmain.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WebinardetailsmainComponent {
  onFormSubmit(event: Event) {
    event.preventDefault();
  }
  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(WebinarvideopopupComponent);
  }
}
