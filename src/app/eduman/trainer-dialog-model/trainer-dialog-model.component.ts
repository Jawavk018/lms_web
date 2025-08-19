// import { Component } from '@angular/core';

import {
  Component,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { MatStepperModule } from "@angular/material/stepper";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-trainer-dialog-model',
  templateUrl: './trainer-dialog-model.component.html',
  styleUrls: ['./trainer-dialog-model.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatStepperModule, CommonModule]
})
export class TrainerDialogModelComponent {

  firstStep: any;
  secondStep: any;
  thirdStep: any;
  teachingTypeList: any = [];
  editingLevelTypeList: any = [];
  reachTypeList: any = [];

  onboardingForm: any = FormGroup;
  isLoad: boolean = false;
  isShowLoad: boolean = false;
  isNoRecord: boolean = false;

  isLinear: boolean = false;
  showContent = false;
  appUser: any = this.tokenStorage.getUser();

  constructor(
    public api: ApiService,
    private toastService: ToastService,
    private router: Router,
    private tokenStorage: TokenStorageService,
  ) {
    this.onboardingForm = new FormGroup({
      onboardInstructorSno: new FormControl(),
      appUserSno: new FormControl(),
      teachingTypeCd: new FormControl(null, Validators.required),
      videoEditingLevelTypeCd: new FormControl(null, Validators.required),
      audienceLevelTypeCd: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.getEnumTeaching();
    this.getEnumEditing();
    this.getEnumAudience();
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
          // this.appUser?.roles?.push("Trainer");
          // this.appUser?.role.push({
          //   appUserRoleSno: result.data.appUserRoleSno,
          //   roleSno: result.data.roleSno,
          //   roleValue: "Trainer",
          // });
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

  clear() {
    this.onboardingForm.reset();
    this.onboardingForm.patchValue({
      appUserSno: "",
      teachingTypeCd: "",
      videoEditingLevelTypeCd: "",
      audienceLevelTypeCd: "",
    });
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


}
