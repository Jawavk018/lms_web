import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  showCardDetail: boolean = false;
  showUPIDetail: boolean = false;
  showNetBankingDetail: boolean = false;
  showMobileBankingDetail: boolean = false;
  showVirtualPay: boolean = true
  selectedPaymentMethod: string = '';
  selectedUPI: string = '';

  cardMediaList = [
    {"mediaUrl":"assets/img/checkout/visa.svg"},
    {"mediaUrl":"assets/img/checkout/mc.svg"},
    {"mediaUrl":"assets/img/checkout/amex.svg"},
    {"mediaUrl":"assets/img/checkout/card-dinersclub.svg"},
    {"mediaUrl":"assets/img/checkout/rupay.svg"}
  ]


showCardDetails() {
    this.selectedPaymentMethod = 'card';
    this.resetDetails();
    this.showCardDetail = true;
}

showUPI() {
    this.selectedPaymentMethod = 'upi';
    this.resetDetails();
    this.showUPIDetail = true;
}

showNetBanking() {
    this.selectedPaymentMethod = 'netbanking';
    this.resetDetails();
    this.showNetBankingDetail = true;
}

showMobileBanking() {
    this.selectedPaymentMethod = 'mobilebanking';
    this.resetDetails();
    this.showMobileBankingDetail = true;
}

resetDetails() {
    this.showCardDetail = false;
    this.showUPIDetail = false;
    this.showNetBankingDetail = false;
    this.showMobileBankingDetail = false;
}

virtualPay(string: any){
    if(this.selectedUPI == 'virtualAddress'){
        this.showVirtualPay = true;
    }else{
        this.showVirtualPay = false;
    }
}

// UPIPay(){
//     this.selectedUPI = 'ORCode';
//     this.showVirtualPay = false;

// }





}
