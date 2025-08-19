import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { ApiService } from "src/app/providers/api/api.service";
declare var $: any;

@Component({
  selector: "app-signupmain",
  templateUrl: "./signupmain.component.html",
  styleUrls: ["./signupmain.component.scss"],
})
export class SignupmainComponent {
  registerForm: FormGroup;
  registerSubscribe!: Subscription;
  otpSubscribe!: Subscription;
  otp_visible: boolean = false;
  otp: any = new FormControl("");
  appUserSno: any;
  roleList: any = ["Learner","Trainer","Organization"];

  // [y:string]:any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      userId: [null, [Validators.required, this.emailOrMobileValidator]],
      roleCdValue: ["Learner", [Validators.required]],
      isPrivacy: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.otp_visible = false;
    $(document).ready(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>(".otp");
      inputs.forEach((input, index) => {
        input.addEventListener("input", () => {
          this.digitValidate(input);
        });
        input.addEventListener("keyup", () => {
          this.tabChange(index);
        });
      });
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

  registerUser() {
    let body: any = this.registerForm.value;
    body.deviceId = "12345";
    this.registerSubscribe = this.api
      .post("8000/api/ascend/learnhub/v1/verify_user", body)
      .subscribe((result) => {
        if (result?.data != null) {
          console.log(result?.data)
          const otp = result?.data.otp;
          if (result?.data?.isAlready) {
            this.toast.warning("This UserId is already exists.");
          } else {
            this.toast.success("Your OTP is " + otp);
            this.appUserSno = result?.data?.appUserSno;
            this.otp_visible = true;
          }
        }
      });
  }

  digitValidate = (ele: HTMLInputElement) => {
    ele.value = ele.value.replace(/[^0-9]/g, "");
  };

  tabChange = (nextInput: number) => {
    const inputs = document.querySelectorAll<HTMLInputElement>(".otp");
    const currentInput = nextInput;
    const nextIndex = currentInput + 1;
    console.log(currentInput);
    console.log(nextIndex);
    if (nextIndex >= 0) {
      if (inputs[nextIndex] && inputs[nextIndex]?.value === "") {
        inputs[nextIndex].focus();
      } else if (inputs[currentInput]?.value === "") {
        inputs[currentInput - 1].focus();
      }
    }
  };

  verifyOtp() {
    let body: any = {};
    body.appUserSno = this.appUserSno;
    body.otp = this.otp.value;
    body.deviceId = "12345";
    console.log(body);
    this.otpSubscribe = this.api
      .put("8000/api/ascend/learnhub/v1/verify_otp", body)
      .subscribe((result: any) => {
        if (result?.data != null) {
          if (result?.data?.isInValid) {
            this.toast.warning("Please enter valid OTP.");
          } else {
            this.toast.success("Verification Success.");
            // this.toast.success('Please check your mail for password.');
            // this.router.navigate(['/signin'], { replaceUrl: true })
            let navigationExtras: NavigationExtras = {
              state: {
                appUserSno: this.appUserSno, // Pass appUserSno in state
              },
            };
            this.router.navigate(["/set-password"], navigationExtras);
          }
        }
      });
  }

  ngOnDestroy() {
    this.registerSubscribe?.unsubscribe();
    this.otpSubscribe?.unsubscribe();
  }
}
