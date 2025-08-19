import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from 'src/app/custom-snackbar/custom-snackbar.component';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private currentTokenSubject = new BehaviorSubject<string | null>(null);
  currentToken$ = this.currentTokenSubject.asObservable();

  constructor(
    private afFunctions: AngularFireFunctions, private snackBar: MatSnackBar
  ) {
    // this.requestPermission();
    // this.listen();
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey }).then(
      (currentToken) => {
        if (currentToken) {
          console.log("Token acquired:", currentToken);
          this.currentTokenSubject.next(currentToken);
          // this.subscribeToTopic(currentToken, 'Purchase');
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
        console.error('Error while retrieving token:', err);
      });
  }

  // subscribeToTopic(token: string, topic: string) {
  //   const subscribeToTopicFn = this.afFunctions.httpsCallable('subscribeToTopic');
  //   subscribeToTopicFn({ token: token, topic: topic }).subscribe(
  //     (response:any) => {
  //       console.log('Successfully subscribed to topic:', topic);
  //     },
  //     (error:any) => {
  //       console.error('Error subscribing to topic:', error);
  //     }
  //   );
  // }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      if (payload?.notification?.body) {
        console.log('Notification Body:', payload.notification.body);
        this.showSnackbar(payload.notification?.title,payload.notification?.body);
      }
    });
  }

  showSnackbar(title: string | undefined, body: string | undefined) {
    const defaultTitle = 'Notification';
    const defaultBody = 'You have a new notification';
    
    const config = new MatSnackBarConfig();
    config.duration = 20000;
    config.horizontalPosition = 'right';
    config.verticalPosition = 'top';
    config.panelClass = ['custom-snackbar'];
    config.data = { 
      title: title || defaultTitle, 
      body: body || defaultBody 
    };

    this.snackBar.openFromComponent(CustomSnackbarComponent, config);
  }


}
