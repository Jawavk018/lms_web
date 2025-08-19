import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';

@Component({
  selector: 'app-course-coupons',
  templateUrl: './course-coupons.component.html',
  styleUrls: ['./course-coupons.component.scss']
})
export class CourseCouponsComponent {

  discountPercentage: number = 0.0;
  discountPrice: number = 0.0;
  courseCouponList: any = [];
  // selectedType: string = 'Absolute';
  // selectedCouponType: string ='Life Time'

  appUser: any = this.tokenStorage.getUser();
  expiryType: any = '';

  courseSettings: any = {
    singleSelection: false,
    idField: 'courseMasterSno',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: false,
  };

  [x: string]: any;

  constructor(private api: ApiService,
    private fb: FormBuilder,
    private toastService: ToastService,
    public dialog: MatDialog,
    private tokenStorage: TokenStorageService) {

    this.couponForm = new FormGroup({
      courseCouponSno: new FormControl(null),
      couponCode: new FormControl(null, Validators.required),
      isapplyToAllCourses: new FormControl(null, Validators.required),
      courseMasterSno: new FormControl(null),
      couponValueType: new FormControl(null, Validators.required),
      couponValue: new FormControl(null, Validators.required),
      expiryType: new FormControl(null, Validators.required),
      expiryTime: new FormControl(null),
      // couponProvider: new FormControl(null, Validators.required),
      description: new FormControl(null),
      activeFlag: new FormControl("true", Validators.required),
    });
  }

  ngOnInit(): void {
    this.data = window.history.state;
    this.getMyCourses();
    this.getCourseCoupon();
    this.getEnumCouponValueType();
    this.getEnumCouponExpiryType(); 
    this.setMinDate(); 
  }

  setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based, so add 1
    const day = ('0' + today.getDate()).slice(-2);
    this.minDate = `${year}-${month}-${day}`;
  }

  getEnumCouponValueType() {
    let param: any = { codeType: "coupon_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.couponValueTypeList = result.data;
        console.log(this.couponValueTypeList);
      }
    });
  }

  getEnumCouponExpiryType() {
    let param: any = { codeType: "coupon_expiry_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.couponExpityTypeList = result.data;
        console.log(this.couponExpityTypeList);
      }
    });
  }

  onCouponApplyChanges(value: any): void {
    const values = value.target.value
    const applyToAllCoursesControl = this.couponForm.get('courseMasterSno');
    if (values === 'false') {
      // Apply your validation logic here when 'No' is selected
      applyToAllCoursesControl.setValidators([Validators.required]);
    } else {
      // Clear validators when 'Yes' is selected
      applyToAllCoursesControl.clearValidators();
    }
    applyToAllCoursesControl.updateValueAndValidity();
  }

  // onCouponValueTypeChange(event: Event): void {
  //   const value = (event.target as HTMLSelectElement).value;
  //   if (value === 'true') {
  //     const allCourses = [];
  //     for (let i = 0; i < this.myCourseList.length; i++) {
  //       allCourses.push(this.myCourseList[i].title); 
  //     }
  //     this.couponForm.get('courseMasterSno').setValue(allCourses);
  //   } else {
  //     this.couponForm.get('courseMasterSno').setValue([]);
  //   }
  // }
  
  selectedCodeType(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    let selectedType = null;
    for (let i = 0; i < this.couponValueTypeList.length; i++) {
      if (this.couponValueTypeList[i].codesDtlSno == value) {
        selectedType = this.couponValueTypeList[i];
        break;
      }
    }
    if (selectedType) {
      this.selectedType = selectedType.cdValue;
      console.log(this.selectedType);
    } else {
      console.log('Selected item not found.');
    }
  }

  selectCouponExpiryType(event: Event): void {
    console.log(event)
    const value = (event.target as HTMLSelectElement).value;
    let selectedCouponType = null;
    for (let i = 0; i < this.couponExpityTypeList.length; i++) {
      if (this.couponExpityTypeList[i].codesDtlSno == value) {
        selectedCouponType = this.couponExpityTypeList[i];
        break;
      }
    }
    if (selectedCouponType) {
      this.selectedCouponType = selectedCouponType.cdValue;
      console.log(this.selectedCouponType);
      if(this.selectedCouponType == 'Limited'){
        this.isLimited()
      }
    } else {
      console.log('Selected item not found.');
    }
  }

  isLimited() {
    this.couponForm.get('expiryTime').addValidators(Validators.required);
  }


  getMyCourses() {
    let param: any = { appUserSno: this.appUser?.appUserSno };
    this.api.get("8000/api/ascend/learnhub/v1/get_all_courses", param).subscribe((result) => {
      if (result != null && result.data) {
        this.myCourseList = result.data[0].allCourseDetails;
        console.log(this.myCourseList);
      }
    });
  }

  openDialog(i: any) {
    let courseList: any = [];
    let selectedCoupon = this.courseCouponList[i];
    // alert(JSON.stringify(this.courseCouponList[i]?.isapplyToAllCourses))
    // if(this.courseCouponList[i]?.isapplyToAllCourses === false){
      for (let courseMasterSno of selectedCoupon.courseMasterSno) {
        for (let course of this.myCourseList) {
          if (course.courseMasterSno === courseMasterSno) {
            courseList.push({
              title: course.title,
              courseMasterSno: course.courseMasterSno
            });
          }
        }
      }
    // }
    
    console.log(courseList);
    console.log(this.courseCouponList[i]);
    if (this.courseCouponList.length > 0) {
      this.couponForm.setValue({
        courseCouponSno: this.courseCouponList[i]?.courseCouponSno,
        couponCode: this.courseCouponList[i]?.couponCode,
        couponValueType: this.courseCouponList[i]?.couponValueType,
        couponValue: this.courseCouponList[i]?.couponValue,
        description: this.courseCouponList[i]?.description,
        expiryTime: this.courseCouponList[i]?.expiryTime,
        // couponProvider: this.courseCouponList[i]?.couponProvider,
        activeFlag: this.courseCouponList[i]?.activeFlag,
        isapplyToAllCourses: this.courseCouponList[i]?.isapplyToAllCourses,
        expiryType: this.courseCouponList[i]?.expiryType,
        courseMasterSno: courseList ?? [],
      });
      this.expiryType = this.courseCouponList[i]?.couponExpiryTypeName
    }
  }

  getCourseCoupon() {
    let params: any = {appUserSno: this.appUser?.appUserSno};
    console.log(params);
    this.api.get('8019/api/ascend/learnhub/v1/get_course_coupon', params).subscribe((result) => {
      if (result != null && result.data != null) {
        console.log(result);
        this.courseCouponList = result.data;
        console.log(this.courseCouponList);
      }
    });
  }

  saveCourseCoupon() {
    let params: any = this.couponForm?.value
    let courseMasterSno: any = [];
    if(params.isapplyToAllCourses === 'true' || params.isapplyToAllCourses === true){
      params.courseMasterSno = null;
    }else{
      for (let courseMaster of params?.courseMasterSno) {
        courseMasterSno.push(courseMaster?.courseMasterSno);
        params.courseMasterSno = `{ ${courseMasterSno} }`;
        console.log(params.courseMasterSno)
      }
    }
    params.appUserSno = this.appUser?.appUserSno,
    params.couponProvider = 'Tutor',
    console.log(params)
    this.api.post('8019/api/ascend/learnhub/v1/insert_course_coupon', params).subscribe((result) => {
      console.log(result)
      if (result != null && result.data != null) {
        console.log(result)
        this.toastService.showSuccess("Coupon is added Successfully");
        this.couponForm.reset();
        this.message = '';
        this.getCourseCoupon();
      } else {
        this.toastService.showError("Something went wrong..");
      }
    })
  }

  updateCourseCoupon() {
    let params: any = this.couponForm?.value;
    let courseMasterSno: any = [];
    if(params.isapplyToAllCourses === 'true' || params.isapplyToAllCourses === true){
      params.courseMasterSno = null;
    }else{
      for (let courseMaster of params?.courseMasterSno) {
        courseMasterSno.push(courseMaster?.courseMasterSno);
        params.courseMasterSno = `{ ${courseMasterSno} }`;
        console.log(params.courseMasterSno)
      }
    }
    params.appUserSno = this.appUser?.appUserSno,
    console.log(params)
    this.api.put('8019/api/ascend/learnhub/v1/update_course_coupon', params).subscribe((result) => {
      if (result != null) {
        console.log(result)
        this.getCourseCoupon();
      }
    })

  }

  getCheckCode() {
    let params = { couponCode: this.couponForm.value.couponCode };
    console.log(params)
    this.api.get('8019/api/ascend/learnhub/v1/check_copoun_code', params).subscribe((result) => {
      if (result != null) {
        console.log(result);
        this.message = result.data[0]['msg'];
        console.log(this.message)
        if (this.message == 'This Coupon is not available.') {
          this.errorMessageClass = 'error-message-green';
        } else {
          this.errorMessageClass = 'error-message-red';
        }
      }
    });
  }




}
