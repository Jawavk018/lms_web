import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  constructor(private toastr: ToastrService) {
  }

  public showSuccess(msg: any, title?: any) {
    this.toastr.success(msg, title);
  }

  showError(msg: any, title?: any) {
    this.toastr.error(msg, title);
  }

  showInfo(msg: any, title?: any) {
    this.toastr.info(msg, title);
  }

  showWarning(msg: any, title?: any) {
    this.toastr.warning(msg, title);
  }

}