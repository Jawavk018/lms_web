import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import Swal from "sweetalert2";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { ChangePasswordModalComponent } from "../change-password-modal/change-password-modal.component";

@Component({
  selector: "app-common-header",
  standalone: true,
  imports: [CommonModule,RouterModule, ChangePasswordModalComponent],
  templateUrl: "./common-header.component.html",
  styleUrls: ["./common-header.component.scss"],
})
export class CommonHeaderComponent {
  onboardInstructorSno: any;
  appUser: any = this.tokenStorage.getUser();
  trainerList: any = [];
  @ViewChild("trainerTips") trainerTips: any;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private api: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  UserData = {
    roles: ["Anonymous User"],
  };

  SignIn() {
    this.router.navigate(["/signin"]);
  }

  SignUp() {
    this.router.navigate(["/signup"]);
  }
  //cart sidebar activation end

  //sidebar info click activation start
  sidebarInfoActive: boolean = false;
  infoclick() {
    if (this.sidebarInfoActive == false) {
      // this.sidebarCartActive = false;
      this.sidebarInfoActive = true;
    } else {
      this.sidebarInfoActive = false;
    }
  }
  //sidebar info click activation end

  isSticky: boolean = false;

  // @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  }

  // generateTrainer() {
  //   if (this.trainerList.instructorLevelSno != null) {
  //     this.router.navigate(['/add-course-content']);
  //   }
  //   else {
  //     $('#trainerTips').click();
  //   }
  // }

  async LoggedOut() {
    Swal.fire({
      title: "Are you sure want to Logout?",
      text: "You will require to enter your credetials again to LOGIN!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffb013",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Logged Out! See you soon As We have new Courses lined up for your interests.",
          " ",
          "success"
        );
        this.logout();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled!", "Your record is safe", "error");
      }
    });
  }

  logout() {
    this.tokenStorage.removeStorage();
    this.router.navigate(["/signin"]);
    this.appUser = this.UserData;
    this.tokenStorage.saveUser(this.appUser);
  }

  toBecomeLearner() {
    if (this.appUser.role.length == 1) {
      let body = {
        appUserSno: this.appUser?.appUserSno,
        roleCdValue: "Learner",
      };
      this.api.post("8000/api/ascend/learnhub/v1/insert_app_user_role", body).subscribe(
        (result) => {
          if (result != null) {
            let obj = {
              appUserRoleSno: result.data?.appUserRoleSno,
              roleValue: "Learner",
              roleSno: 3,
            };
            this.appUser = this.tokenStorage.getUser();
            this.appUser.role.push(obj);
            this.appUser.roles.push("Learner");
            this.appUser.selectedRole = "Learner";
            this.tokenStorage.saveUser(this.appUser);
            // window.location.reload();
            this.toastService.showSuccess('Your role changed as Learner"');
            this.router.navigate(["/"], { replaceUrl: true });
          } else {
            // this.toastService.showError('Category name is Already Exists')
          }
        },
        (err) => {
          this.toastService.showError(err);
        }
      );
    } else {
      this.appUser.selectedRole = "Learner";
      this.tokenStorage.saveUser(this.appUser);
      // window.location.reload();
      this.router.navigate(["/"], { replaceUrl: true });
    }
  }

  goToHome() {
    this.appUser.selectedRole = "Learner";
    this.tokenStorage.saveUser(this.appUser);
    // window.location.reload();
    this.router.navigate(["/instructorPage"]);
  }

  goToProfile() {
    this.router.navigate(["/create-profile"]);
  }

  goToCourses() {
    // this.appUser.selectedRole = 'Learner';
    // this.tokenStorage.saveUser(this.appUser);
    // window.location.reload();
    this.router.navigate(["/instructorPage"]);
  }

  goToCourseCoupon() {
    // this.appUser.selectedRole = 'Learner';
    // this.tokenStorage.saveUser(this.appUser);
    // window.location.reload();
    this.router.navigate(["/course-coupons"]);
  }
  
  gotoSurveyAndPolls(){
    this.router.navigate(['/survey-polls']);
  }
}
