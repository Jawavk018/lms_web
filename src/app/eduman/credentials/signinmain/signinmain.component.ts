import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/providers/api/api.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';
import { AppPasswordToggleComponent } from '../../app-password-toggle/app-password-toggle.component';
import { MessagingService } from 'src/app/providers/fire/messaging.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
declare var $: any;

@Component({
  selector: "app-signinmain",
  templateUrl: "./signinmain.component.html",
  styleUrls: ["./signinmain.component.scss"],
})
export class SigninmainComponent {
  isShow: boolean = false;
  loginForm: FormGroup;
  loginSubscribe!: Subscription;
  @ViewChild("passwordInput") passwordInput: AppPasswordToggleComponent | any; // Assuming your password toggle component has 'passwordInput' as a template reference variable

  currentToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toast: ToastrService,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private messagingService: MessagingService,
    private authService: SocialAuthService
  ) {
    this.loginForm = this.fb.group({
      userId: [null, [Validators.required, this.emailOrMobileValidator]],
      password: [null, [Validators.required]],
    });
    this.messagingService.currentToken$.subscribe(token => {
      this.currentToken = token;
      console.log('Current Token in AppComponent:', this.currentToken);
  });
  }

  ngAfterViewInit() {
    this.isShow = true;
    if (this.authService && this.authService.authState) {
      this.authService.authState.subscribe((user) => {
        console.log(user);
        if (user?.id) {
          this.oauthLogin(user?.idToken, "google");
        }
      });
    }else{
      console.error('authService or authService.authState is not initialized.');
    }
  }

  oauthLogin(token: any, oauthProvider: any) {
    let body: any = this.loginForm.value;
    body.signInInfo = {
      pushToken: this.currentToken,
      deviceTypeCdValue: "web",
      // topicName: "Purchase Course",
    };
    body.token = token;
    body.oauthProvider = oauthProvider;
    console.log(body);
    this.loginSubscribe = this.api
      .post("8000/api/ascend/learnhub/v1/login", body)
      .subscribe((result) => {
        console.log(result);
        if (result != null) {
          console.log(result.data);
          if (result?.data != null) {
            if (!result?.data?.isLoginSuccess) {
              this.toast.warning(result?.data?.msg);
            } else {
              result.data.selectedRole = result.data?.role[0]?.roleValue;
              console.log(result.data);
              this.tokenStorage.saveUser(result?.data);
              this.toast.success("Signed In Succeesfully");
              let user = this.tokenStorage.getUser();
              if (user.selectedRole == "Admin") {
                this.router.navigate(["/sidemenu"], { replaceUrl: true });
              } else {
                if (user.selectedRole == "Trainer" && user?.isTrainer) {
                  this.router.navigate(["/instructorPage"], {
                    replaceUrl: true,
                  });
                } else {
                  this.router.navigateByUrl("/");
                }
              }
            }
          }
        }
      });
  }

  emailOrMobileValidator(control: FormControl) {
    const value = control.value;
    if (!value) {
      return null;
    }
    // Check if the value is either a valid email or a valid mobile number
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isValidMobileNumber = /^\d{10}$/.test(value);

    if (!isValidEmail && !isValidMobileNumber) {
      return { invalidEmailOrMobile: true };
    }

    return null;
  }

  login() {
    let body: any = this.loginForm.value;
    body.signInInfo = {
      // pushToken: '',
      pushToken: this.currentToken,
      deviceTypeCdValue: 'web',
      topicName: 'Purchase Course',

    };
    console.log(body);
    this.loginSubscribe = this.api.post('8084/api/ascend/learnhub/v1/login', body).subscribe((result) => {
      console.log(result);
      if (result != null) {
        console.log(result.data);
        if (result?.data != null) {
          if (!result?.data?.isLoginSuccess) {
            this.toast.warning(result?.data?.msg);
          } else {
              result.data.selectedRole = result.data?.role[0]?.roleValue;
              console.log(result.data);
              if(result.data.selectedRole == 'Learner' && !result.data.preferences){
                result.data.isPopFirstTime = false;
              }
              this.tokenStorage.saveUser(result?.data);
              this.toast.success("Signed In Succeesfully");
              let user = this.tokenStorage.getUser();
              if (user.selectedRole == "Admin") {
                this.router.navigate(["/sidemenu"], { replaceUrl: true });
              } else {
                if (user.selectedRole == "Trainer" && user?.isTrainer) {
                  this.router.navigate(["/instructorPage"], {
                    replaceUrl: true,
                  });
                } else {
                  this.router.navigateByUrl("/");
                }
              }
            }
          }
        }
      });
  }

  moveToPassword() {
    this.passwordInput.focus();
  }

  ngOnDestroy() {
    this.loginSubscribe?.unsubscribe();
  }
}
