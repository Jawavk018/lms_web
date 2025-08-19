import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.scss']
})
export class PaymentGatewayComponent {

  public video !: HTMLVideoElement;
  public player: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    console.log(this.data);
    $(document).ready(() => {
      var iframe: any = document.getElementById('payment');
      iframe.contentWindow.history.forward = () => { };
      iframe.contentWindow.history.back = () => { };
    });
  }
}
