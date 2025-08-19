import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";

@Component({
  selector: "app-change-password-modal",
  templateUrl: "./change-password-modal.component.html",
  styleUrls: ["./change-password-modal.component.scss"],
  standalone:true,
  imports:[
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ChangePasswordModalComponent {
  appUser: any = this.tokenStorage.getUser();

  // Change Password Form

  changePasswordForm: FormGroup;
  @ViewChild("closeModal") closeModal: any;
  showCurrentPassword = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    public api: ApiService,
    private toastService: ToastService,
    private tokenStorage: TokenStorageService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // change password

  passwordMatchValidator(form: FormGroup) {
    return form.controls["newPassword"].value ===
      form.controls["confirmPassword"].value
      ? null
      : { mismatch: true };
  }

  changePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    const formValue = this.changePasswordForm.value;
    const body: any = {
      currentPassword: formValue.currentPassword,
      newPassword: formValue.newPassword,
    };
    body.appUserSno = this.appUser?.appUserSno;
    console.log(body);
    this.api.put("8000/api/ascend/learnhub/v1/change_password", body).subscribe(
      (result: any) => {
        if (result != null) {
          if (result.data != null) {
            if (result.data?.appUserSno) {
              this.toastService.showSuccess("Password changed successfully.");
              this.closeModal.nativeElement.click();
              this.changePasswordForm.reset();
            } else {
              this.toastService.showError("Current Password inValid.");
            }
          }
        } else {
        }
      },
      (error) => {
        this.toastService.showError("Error changing password.");
      }
    );
  }
   

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'currentPassword':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'newPassword':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirmPassword':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
      default:
        break;
    }
  }
  
}
