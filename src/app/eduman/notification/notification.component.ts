import { Component } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Swal from "sweetalert2";


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {


  appUser: any = this.tokenStorage.getUser();
  notificationList: any = [];

  constructor(private api: ApiService, private toastService: ToastService, private tokenStorage: TokenStorageService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getNotification();
  }

  getSanitizedHtml(htmlContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }


  getNotification() {
    let params: any = { appUserSno: this.appUser.appUserSno }
    console.log(params)
    this.api.get("8000/api/ascend/learnhub/v1/get_notification", params).subscribe((result) => {
      console.log(result)
      if (result != null) {
        this.notificationList = result?.data;
        console.log(this.notificationList);
      }

    });
  }

  deleteNotification(i: any) {
    let params: any = { notificationSno: this.notificationList[i].notificationSno }
    console.log(params)
    this.api.delete("8000/api/ascend/learnhub/v1/delete_notification", params).subscribe((result) => {
      console.log(result)
      if (result != null) {
        console.log(result)
        this.notificationList.splice(i, 1);
        this.api.notificationCount--;
        this.toastService.showSuccess("Deleted Successfully");
      }else{
        this.toastService.showError("Something went wrong...");
      }

    });

  }


  confirmation(event: MouseEvent, i: number) {
    event.stopPropagation(); 
    Swal.fire({
      title: "Do you want to delete the notification?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        this.deleteNotification(i);
      }
    });
  }

  checkStatus(i: any){
    let params: any = { notificationSno: this.notificationList[i].notificationSno }
    console.log(params)
    this.api.put("8000/api/ascend/learnhub/v1/update_notification_status", params).subscribe((result) => {
      console.log(result)
      if (result != null) {
        console.log(result)
        this.api.notificationCount--;
        this.getNotification();
      }

    });
  }



}
