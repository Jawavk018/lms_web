import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/providers/api/api.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';
import { ConfirmedValidator } from 'src/app/providers/validators';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent {
  resetPasswordForm: FormGroup;
  userInfo:any;

  constructor(private api: ApiService, private toastr: ToastrService,private tokenService: TokenStorageService,private router: Router,
    private tokenStorage:TokenStorageService,private fb: FormBuilder) {
    this.resetPasswordForm = fb.group({
      newPassword: new FormControl(null, [Validators.required,Validators.minLength(8), Validators.maxLength(20)]),
      confirmPassword: new FormControl(null, [Validators.required,Validators.minLength(8), Validators.maxLength(20)]),
    }, {
      validator: ConfirmedValidator('newPassword', 'confirmPassword')
    });
  }

  ngOnInit() {
    this.userInfo = window.history.state;
  }

  onSubmit(){
    let body = {
      appUserSno: this.userInfo?.appUserSno,
      password: this.resetPasswordForm.value.newPassword
    }
    console.log(body);
    this.api.put("8000/api/ascend/learnhub/v1/update_user_password", body).subscribe(result => {
      console.log(result);
      if (result != null) {
        this.resetPasswordForm.reset();
        this.toastr.success("Reset password successfully");
        delete this.userInfo?.isForeceResetPassword;
        this.tokenStorage.saveUser(this.userInfo);
        let user = this.tokenStorage.getUser();
        if (user.selectedRole == 'Admin') {
          this.router.navigate(['/sidemenu'], { replaceUrl: true });
        } else {
          if (user.selectedRole == 'Trainer' && user?.isTrainer) {
            this.router.navigate(['/instructorPage'], { replaceUrl: true });
          }
          else {
            this.router.navigateByUrl('/');
          }
        }
        // window.location.reload();
      
      } else {
        this.toastr.warning("Password can't change");
      }
    });
  }

}
