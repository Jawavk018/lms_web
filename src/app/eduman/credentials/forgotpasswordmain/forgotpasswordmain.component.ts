import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/providers/api/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgotpasswordmain',
  templateUrl: './forgotpasswordmain.component.html',
  styleUrls: ['./forgotpasswordmain.component.scss'],
})
export class ForgotpasswordmainComponent {
  forgotPasswordForm: FormGroup;
  appUserSno: any;
  otp_visible: boolean = false;
  otp: any = new FormControl('');
  otpSubscribe !: Subscription;


  constructor(private api: ApiService, private toastr: ToastrService,private router:Router,
    private fb: FormBuilder, private toast: ToastrService) {
    this.forgotPasswordForm = fb.group({
      // userId: new FormControl(null, [Validators.required, Validators.email]),
      userId: [null, [Validators.required, this.emailOrMobileValidator]],
    });
  }
  ngOnIt(){
    this.otp_visible = false;

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

  onSubmit() {
    let body = { userId: this.forgotPasswordForm.value.userId ,deviceId:"12345"};
    console.log(body);
    this.api
      .post('8000/api/ascend/learnhub/v1/verify_email', body ) 
      .subscribe(
        (result) => {
          if (result != null) {
            if (result.data != null && !result.data?.msg) {
              const otp = result?.data.otp
              this.toast.success('Your OTP is ' + otp);
              console.log(result);
              // this.toastr.success('The Otp is sent your UserId...');
              // this.router.navigate(['/signin'], { replaceUrl: true });
              this.appUserSno = result?.data?.appUserSno;
              this.otp_visible = true;
            } else {
              this.toastr.error('Invalid user id...');
            }
          } else {
          }
          // Success!
        },
        (error) => {
          // Error!
        }
      );
  }
  verifyOtp() {
    let body: any = {};
    body.appUserSno = this.appUserSno;
    body.otp = this.otp.value;
    body.deviceId = "12345";
    console.log(body);
    this.otpSubscribe = this.api.put('8000/api/ascend/learnhub/v1/verify_otp', body).subscribe((result: any) => {
      if (result?.data != null) {
        if (result?.data?.isInValid) {
          this.toast.warning('Please enter valid OTP.');
        } else {
          this.toast.success('Verification Success.');
          // this.toast.success('Please check your mail for password.');
          // this.router.navigate(['/signin'], { replaceUrl: true })
          let navigationExtras: NavigationExtras = {
            state: {
              appUserSno: this.appUserSno // Pass appUserSno in state
            }
          };
          this.router.navigate(['/set-password'], navigationExtras)
        }
      }
    });
  }
}
