import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { HostListener } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import Swal from "sweetalert2";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { SpinnerVisibilityService } from "ng-http-loader";
import { Subject, debounceTime } from "rxjs";
declare var $: any;

@Component({
  selector: "app-headerone",
  templateUrl: "./headerone.component.html",
  styleUrls: ["./headerone.component.scss"],
  encapsulation: ViewEncapsulation.None,  
})
export class HeaderoneComponent implements OnInit {
  firstStep: any;
  secondStep: any;
  thirdStep: any;
  fourStep: any;

  teachingTypeList: any = [];
  editingLevelTypeList: any = [];
  reachTypeList: any = [];
  onboardList: any[] = [];

  onboardingForm: any = FormGroup;
  isLoad: boolean = false;
  isShowLoad: boolean = false;
  isNoRecord: boolean = false;

  onboardInstructorSno: any;
  isLinear: boolean = false;
  showContent = false;
  teachType: any = FormGroup;
  editingType: any = FormGroup;
  audienceLevelType: any = FormGroup;
  openModal: boolean = false;
  trainerList: any = [];
  searchKey: String = "";
  searchList: any = [];
  profile: any;
  // profileDetails: any = this.tokenStorage.getUserProfile();
  appUser: any = this.tokenStorage.getUser();

  @ViewChild("trainerTips") trainerTips: any;
  searchTermChange: Subject<any> = new Subject<any>();

  UserData = {
    roles: ["Anonymous User"],
    // role: [{ 'roleValue': 'Anonymous User' }],
    // selectedRole: "Anonymous User",
  };

  constructor(
    public api: ApiService,
    private toastService: ToastService,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private spinner: SpinnerVisibilityService,

  ) {
    this.onboardingForm = new FormGroup({
      onboardInstructorSno: new FormControl(),
      appUserSno: new FormControl(),
      teachingTypeCd: new FormControl(null, Validators.required),
      videoEditingLevelTypeCd: new FormControl(null, Validators.required),
      audienceLevelTypeCd: new FormControl(null, Validators.required),
    });
    console.log(this.appUser);
    this.searchTermChange.pipe(debounceTime(300)).subscribe((searchTerm) => {
      this.search(searchTerm);
    });

    
  }

  

  ngOnInit(): void {
    if (this.appUser?.appUserSno) {
      this.getCarCount();
    }
    this.appUser = this.tokenStorage.getUser();
    // this.profileDetails = this.tokenStorage.getUserProfile();
    // alert(JSON.stringify(this.profileDetails));
    this.getEnumTeaching();
    this.getEnumEditing();
    this.getEnumAudience();
    $(document).ready(() => {
      const textInput: any = document.getElementById("textInput");
      textInput.addEventListener("focus", () => {
        // $('#textInput').addClass('w-100');
        // $('.header-search').addClass('w-100');
      });

      textInput.addEventListener("focusout", () => {
        if (!this.searchKey?.trim()?.length) {
          this.searchList = [];
          // $('#textInput').removeClass('w-100');
          // $('.header-search').removeClass('w-100');
        }
      });
    });
  }

  toggleContent() {
    this.showContent = true; // Toggle the boolean value
  }

  save() {
    this.isLoad = true;
    let body: any = this.onboardingForm.value;
    body.appUserSno = this.appUser.appUserSno;
    console.log(body);
    this.api.post("8000/api/ascend/learnhub/v1/insert_instructor_level", body).subscribe(
      (result) => {
        this.isLoad = false;
        console.log(result);
        if (result != null && result?.data) {
          this.clear();
          // body.onboardInstructorSno = result.data.onboardInstructorSno;
          // this.onboardList.push(body);
          this.appUser.isTrainer = true;
          this.appUser.selectedRole = "Trainer";
          this.appUser?.roles?.push("Trainer");
          this.appUser?.role.push({
            appUserRoleSno: result.data.appUserRoleSno,
            roleSno: result.data.roleSno,
            roleValue: "Trainer",
          });
          this.appUser.onboardInstructorSno = result.data?.onboardInstructorSno;
          this.tokenStorage.saveUser(this.appUser);
          this.router.navigate(["/instructorPage"], { replaceUrl: true });
          // this.toastService.showSuccess("Let's add course content");
        } else {
        }
      },
      (err) => {
        this.isLoad = false;
        this.isShowLoad = false;
        this.isNoRecord = true;
        this.toastService.showError(err);
      }
    );
  }

  isTeachTypeSelected(): boolean {
    return this.onboardingForm.get("teachingTypeCd").value !== null;
  }

  isEditTypeSelected(): boolean {
    return this.onboardingForm.get("videoEditingLevelTypeCd").value !== null;
  }

  isAudienceTypeSelected(): boolean {
    return this.onboardingForm.get("audienceLevelTypeCd").value !== null;
  }

  clear() {
    this.onboardingForm.reset();
    this.onboardingForm.patchValue({
      appUserSno: "",
      teachingTypeCd: "",
      videoEditingLevelTypeCd: "",
      audienceLevelTypeCd: "",
    });
  }

  generateTrainer() {
    if (this.appUser.role.length == 1) {
      $("#trainerTips").click();
    } else {
      this.appUser.selectedRole = "Trainer";
      this.tokenStorage.saveUser(this.appUser);
      this.router.navigate(["/instructorPage"], { replaceUrl: true });
    }
  }

  // getTrainerDetails() {
  //   let param: any = {};
  //   param.appUserSno = this.appUser.appUserSno;
  //   console.log(param);
  //   this.api.get("8000/api/ascend/learnhub/v1/get_instructor_level", param).subscribe(
  //     (result) => {
  //       console.log(result);
  //       if (result != null) {
  //         if (result.data != null && result.data.length > 0) {
  //           this.trainerList = result.data[0];
  //           console.log(this.trainerList);
  //         } else {
  //         }
  //       } else {
  //         this.toastService.showError("Something went wrong");
  //       }
  //     },
  //     (err) => {
  //       this.toastService.showError(err);
  //     }
  //   );
  // }

  getEnumTeaching() {
    let param: any = { codeType: "teaching_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.teachingTypeList = result.data;
      }
    });
  }
  getEnumEditing() {
    let param: any = { codeType: "video_editing_level_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.editingLevelTypeList = result.data;
      }
    });
  }
  getEnumAudience() {
    let param: any = { codeType: "audience_level_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.reachTypeList = result.data;
      }
    });
  }

  //topbar hide
  noteContentActive: boolean = false;
  noteButton() {
    if (this.noteContentActive == false) {
      this.noteContentActive = true;
    } else {
      this.noteContentActive = false;
    }
  }
  //topbar hide

  //cart sidebar activation start
  sidebarCartActive: boolean = false;

  // cartclick() {
  //   alert('in')
  //   if (this.sidebarCartActive == false) {
  //     this.sidebarCartActive = true;
  //     this.sidebarInfoActive = false;
  //   } else {
  //     this.sidebarCartActive = false;
  //   }
  // }

  cartclick() {
    this.router.navigate(["/add-cart"], { replaceUrl: true });
  }

  //cart sidebar activation end

  //sidebar info click activation start
  sidebarInfoActive: boolean = false;
  infoclick() {
    if (this.sidebarInfoActive == false) {
      this.sidebarCartActive = false;
      this.sidebarInfoActive = true;
    } else {
      this.sidebarInfoActive = false;
    }
  }
  //sidebar info click activation end

  isSticky: boolean = false;

  @HostListener("window:scroll", ["$event"])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  }

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
        Swal.fire({
          title: "Logged Out!",
          html: "You have successfully logged out. <br> See you soon as we have lined up new Courses for your interests.",
          icon: "success",
        });
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

  goToProfile() {
    this.router.navigate(["/create-profile"]);
  }

  search(key: any) {
    let param: any = { searchKey: key };
    this.api
      .get("8000/api/ascend/learnhub/v1/get_search_course", param)
      .subscribe((result) => {
        this.spinner.hide();
        if (result != null) {
          this.searchList = result?.data ?? [];
        }
      });
  }

  onSelectionChange(event: any) {
    let index: number = this.searchList.findIndex(
      (search: any) => search.key == event.option.value
    );
    if (index != -1) {
      if (this.appUser?.appUserSno) {
        this.router.navigate(["/course-details"], {
          queryParams: { courseSno: this.searchList[index]?.courseSno },
        });
      } else {
        this.router.navigate(["/signin"], { replaceUrl: true });
      }
    }
  }

  searchkeys(event: String) {
    if (event?.trim().length) {
      this.searchTermChange.next(event);
    }
  }

  getFavoriteCourses() {
    this.router.navigate(["/favorite-courses"]);
  }

  getCarCount() {
    let params: any = { appUserSno: this.appUser?.appUserSno };
    this.api.get('8000/api/ascend/learnhub/v1/get_cart_count', params).subscribe((result) => {
      console.log(result);
      if (result != null) {
        this.api.cartCount = result?.data?.length ? (result?.data[0]?.count ?? 0) : 0;
        console.log(this.api.cartCount);
      }
    });
  }

  notificationclick(){
    this.router.navigate(["/notification"], { replaceUrl: true });
  }
 gotoSurveyAndPolls(){
    this.router.navigate(['/survey-polls']);
  }

  gotoSurveyPage(){
    this.router.navigate(['/survey']);
  }

  
   

}
