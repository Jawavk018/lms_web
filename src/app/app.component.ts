import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ApiService } from "./providers/api/api.service";
import { TokenStorageService } from "./providers/token-storage.service";
import Swal from "sweetalert2/dist/sweetalert2.all.js";

import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { MessagingService } from "./providers/fire/messaging.service";
// initializeApp(environment.firebase);

declare var $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "eduman";
  appUser: any = this.tokenStorage.getUser();

  // title = 'af-notification';
  message: any = null;
  currentToken: string | null = null;

  constructor(
    private router: Router,
    public api: ApiService,
    private tokenStorage: TokenStorageService,
    private messageService: MessagingService
  ) {
    // const app = initializeApp(environment.firebase);
  }

  UserData = {
    roles: ["Anonymous User"],
  };

  // Extracting role values into a string array

  ngOnInit() {
    if (this.appUser?.appUserSno && this.appUser?.selectedRole == "Learner") {
      this.getCarCount();
    }

    if (this.appUser?.appUserSno) {
      this.getNotificationCount();
    }
    if (!this.appUser?.appUserSno) {
      this.appUser = this.UserData;
      this.tokenStorage.saveUser(this.appUser);
    }

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    $(document).ready(() => {
      if (this.appUser?.appUserSno) {
        let isTrainer: boolean = false;
        for (let i in this.appUser?.role) {
          if (this.appUser?.role[i]?.roleValue == "Trainer") {
            isTrainer = true;
          }
        }
        if (
          !this.appUser?.isTrainer &&
          isTrainer &&
          this.appUser?.selectedRole == "Trainer"
        ) {
          $(document).ready(() => {
            $("#trainerTips").click();
          });
        }
      }
    });
    // this.getDeviceId();
    // this.requestPermission();
    // this.listen();
    // console.log(this.messageService.currentToken)
    this.messageService.currentToken$.subscribe((token) => {
      this.currentToken = token;
      console.log("Current Token in AppComponent:", this.currentToken);
    });
  }

  requestPermission() {
    const messaging = getMessaging();
    // console.log(environment.firebase.vapidKey);
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log("Hurraaa!!! we got the token.....");
          console.log(currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      this.message = payload;
    });
  }

  getDeviceId() {
    let params: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_device_id", params).subscribe((result) => {
      console.log(result);
      if (result) {
      }
    });
  }

  getCarCount() {
    let params: any = { appUserSno: this.appUser?.appUserSno };
    this.api.get("8000/api/ascend/learnhub/v1/get_cart_count", params).subscribe((result) => {
      console.log(result);
      if (result != null) {
        this.api.cartCount = result?.data?.length
          ? result?.data[0]?.count ?? 0
          : 0;
      }
    });
  }

  getNotificationCount() {
    let params: any = { appUserSno: this.appUser?.appUserSno };
    this.api
      .get("8000/api/ascend/learnhub/v1/get_notification_count", params)
      .subscribe((result) => {
        console.log(result);
        if (result != null) {
          this.api.notificationCount = result?.data[0]?.notificationCount;
          console.log(this.api.notificationCount);
        }
      });
  }
}
