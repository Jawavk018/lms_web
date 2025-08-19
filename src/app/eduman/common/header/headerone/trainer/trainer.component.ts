import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NavigationExtras, Router } from "@angular/router";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CommonHeaderComponent } from "src/app/eduman/common-header/common-header.component";
import { TrainerDialogModelComponent } from "src/app/eduman/trainer-dialog-model/trainer-dialog-model.component";
import { ViewCourseComponent } from "src/app/eduman/view-course/view-course.component";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-trainer",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CommonHeaderComponent,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    TrainerDialogModelComponent,
  ],
  templateUrl: "./trainer.component.html",
  styleUrls: ["./trainer.component.scss"],
})
export class TrainerComponent {
  courseSno: any;
  languageList: any = [];
  isDelete: boolean = false;
  appUser: any = this.tokenStorage.getUser();

  courseList: any = [];

  isLoad: boolean = false;
  isShowLoad: boolean = false;
  isNoRecord: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 10; // Adjust items per page as needed
  // totalPages: number = 0;
  totalPages: number = Math.ceil(this.courseList.length / this.itemsPerPage);
  public loadContent: boolean = false;
  public form: any = FormGroup;

  settings: any = {
    singleSelection: false,
    idField: "codesDtlSno",
    textField: "cdValue",
    enableCheckAll: true,
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: "Search topic",
    noDataAvailablePlaceholderText: "No Data Found",
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
  };
  invitationList: any = [];
  certificateList: any = [];
  selectedTutorCertificateSno: any;
  selectedCourseIndex: any;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private api: ApiService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {
    this.setForm();
  }

  ngOnInit() {
    if (
      this.appUser?.selectedRole == "Trainer" &&
      this.appUser?.isTrainer == false
    ) {
      $(document).ready(() => {
        $("#trainerTips").click();
      });
    } else {
      this.getMyInvitation();
      this.getTrainerCourses();
    }
    this.getEnumLanguage();
    this.getMyCertificate();
  }

  getMyCertificate() {
    let params: any = {};
    params.appUserSno = this.appUser?.appUserSno;
    params.isActive = true;
    if (!this.appUser?.organization) {
      params.isOrg = false;
    }
    this.api
      .get("8000/api/ascend/learnhub/v1/get_my_certificate", params)
      .subscribe((result) => {
        if (result) {
          console.log(result);
          let certificateList = result?.data.length
            ? result?.data[0].myCertificateList?.length
              ? result?.data[0].myCertificateList
              : []
            : [];
          for (let obj of certificateList) {
            obj.isOrg = false;
          }
          let orgCertificateList = result?.data.length
            ? result?.data[0].orgCertificateList?.length
              ? result?.data[0].orgCertificateList
              : []
            : [];
            for (let obj of orgCertificateList) {
              obj.isOrg = true;
            }
          this.certificateList = [...certificateList, ...orgCertificateList];
        }
      });
  }

  getMyInvitation() {
    let params: any = {};
    params.userId = this.appUser?.userId;
    this.api
      .get("8000/api/ascend/learnhub/v1/get_my_invitation", params)
      .subscribe((result) => {
        if (result != null) {
          this.invitationList = result?.data ?? [];
        }
      });
  }

  createCourse() {
    this.form.reset();
  }

  getCourseControl() {
    return this.form.get("courseControl") as FormControl;
  }

  setForm() {
    if (this.appUser?.orgTrainer) {
      this.form = new FormGroup({
        courseControl: new FormControl("", Validators.required),
        languageTypeCd: new FormControl("", Validators.required),
        defaultLanguageSno: new FormControl("", Validators.required),
        entityUsersSno: new FormControl(""),
      });
    } else {
      this.form = new FormGroup({
        courseControl: new FormControl("", Validators.required),
        languageTypeCd: new FormControl("", Validators.required),
        defaultLanguageSno: new FormControl("", Validators.required),
      });
    }

    this.loadContent = true;
  }

  onItemSelect() {
    this.form.patchValue({
      defaultLanguageSno: this.form.value.languageTypeCd[0].cdValue,
    });
  }

  navigateCourse() {
    const courseTitle = this.form.value.courseControl;
    const languageTypeCd = this.form.value.languageTypeCd;
    const formattedCode = languageTypeCd.map((language: { cdValue: any }) => ({
      code: language.cdValue,
      isDefaultLanguage:
        language?.cdValue == this.form.value.defaultLanguageSno,
    }));
    let navigationExtras: NavigationExtras = {
      state: {
        courseTitle: courseTitle,
        code: formattedCode,
        entityUsersSno: this.form.value.entityUsersSno,
      },
    };
    console.log(navigationExtras);
    this.router.navigate(["/add-course-content"], navigationExtras);
  }

  getEnumLanguage() {
    let param: any = { codeType: "language_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.languageList = result.data;
        console.log(this.languageList);
      }
    });
  }

  async deleteAlert(i: any) {
    Swal.fire({
      title: "Are you sure want to delete this course?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#38d39f",
      cancelButtonColor: "lightgrey",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your record has been deleted.", "success");
        this.delete(i);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled!", "Your record is safe", "error");
      }
    });
  }

  delete(i: any) {
    let body: any = {
      courseSno: this.courseList[i].courseSno,
    };
    this.api.delete("8000/api/ascend/learnhub/v1/delete_course_details", body).subscribe(
      (result: any) => {
        console.log(result);
        if (result != null && result.data.message) {
          this.courseList.splice(i, 1);
          // this.getCourseDetails();

          this.toastService.showSuccess("Deleted Successfully");
        } else {
          this.toastService.showError(
            "Course details not found or failed to delete"
          );
        }
        this.isNoRecord = true;
      },
      (err) => {
        this.isShowLoad = false;
        this.isNoRecord = true;
        this.toastService.showError(err);
      }
    );
  }

  getTrainerCourses() {
    let param: any = {};
    param.appUserSno = this.appUser.appUserSno;
    console.log(param);
    this.api.get("8000/api/ascend/learnhub/v1/get_trainer_courses", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.courseList = result.data[0].allCourseDetails;
            console.log("course List");
            console.log(this.courseList);
            //  alert((this.courseList))
          } else {
          }
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  changeCertificate(i: number) {
    this.selectedCourseIndex = i;
    this.selectedTutorCertificateSno = this.courseList[i]?.tutorCertificateSno;
  }

  getPaginatedCourses() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.courseList.length
    );
    return this.courseList.slice(startIndex, endIndex);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  openDialog(index: any): void {
    const dialogRef = this.dialog.open(ViewCourseComponent, {
      data: this.courseList[index],
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  gotoQuestionersPage(index: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        courseSno: this.courseList[index].courseSno,
        title: this.courseList[index].title,
      },
    };
    this.router.navigate(["/questioners"], navigationExtras);
  }

  gotoDiscountPage(index: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        courseSno: this.courseList[index].courseSno,
        title: this.courseList[index].title,
        price: this.courseList[index].price,
        courseMasterSno: this.courseList[index].courseMasterSno,
        currencySymbol: this.courseList[index].currencySymbol,
      },
    };
    console.log(navigationExtras);
    this.router.navigate(["/course-discount"], navigationExtras);
  }

  addOrg(i: number) {
    let body: any = {};
    body.invitationSno = this.invitationList[i]?.invitationSno;
    body.status = "Accept";
    this.api
      .put("8000/api/ascend/learnhub/v1/change_invitation_status", body)
      .subscribe((result: any) => {
        if (result) {
          if (result?.data?.isSuccess) {
            this.appUser.orgTrainer = result?.data?.orgTrainer;
            this.tokenStorage.saveUser(this.appUser);
            this.toastService.showSuccess(result?.data?.msg);
            this.invitationList.splice(i, 1);
          } else {
            this.toastService.showSuccess(result?.data?.msg);
          }
        }
      });
  }

  rejOrg(i: number) {
    let body: any = {};
    body.invitationSno = this.invitationList[i]?.invitationSno;
    body.status = "Denied";
    this.api
      .put("8000/api/ascend/learnhub/v1/change_invitation_status", body)
      .subscribe((result: any) => {
        if (result) {
          if (result?.data?.isSuccess) {
            this.toastService.showSuccess(result?.data?.msg);
            this.invitationList.splice(i, 1);
          } else {
            this.toastService.showSuccess(result?.data?.msg);
          }
        }
      });
  }

  navigateCertificateCreate() {
    this.router.navigate(["/certificateHome"]);
  }

  updateCertificate() {
    let body: any = {};
    body.tutorCertificateSno = this.selectedTutorCertificateSno;
    if (
      this.courseList[this.selectedCourseIndex]?.courseCertificateMappingSno
    ) {
      body.courseCertificateMappingSno =
        this.courseList[this.selectedCourseIndex]?.courseCertificateMappingSno;
    } else {
      body.courseSno = this.courseList[this.selectedCourseIndex]?.courseSno;
      body.appUserSno = this.appUser?.appUserSno;
    }
    this.api
      .put("8000/api/ascend/learnhub/v1/course_certificate_mapping", body)
      .subscribe((result: any) => {
        if (result) {
          console.log(result);
          if (result && result?.data?.courseCertificateMappingSno) {
            this.courseList[
              this.selectedCourseIndex
            ].courseCertificateMappingSno =
              result?.data?.courseCertificateMappingSno;
            this.courseList[this.selectedCourseIndex].tutorCertificateSno =
              this.selectedTutorCertificateSno;
            $("#close").click();
          }
        }
      });
  }
}
