import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';


declare var $: any;
@Component({
  selector: 'app-course-discount',
  templateUrl: './course-discount.component.html',
  styleUrls: ['./course-discount.component.scss']
})
export class CourseDiscountComponent {

  discountPercentage: number = 0.0;
  discountPrice: number = 0.0;
  courseDiscountList: any =[]

  appUser: any = this.tokenStorage.getUser();

  // @HostListener('window:scroll', ['$event']) onScroll() {
  //   if (window.scrollY > 100) {
  //     this.isNavbarFixed = true;
  //   } else {
  //     this.isNavbarFixed = false;
  //   }
  // }

  [x: string]: any;

  constructor(private api: ApiService,
    private fb: FormBuilder,
    private toastService: ToastService,
    public dialog: MatDialog,
    private  tokenStorage:TokenStorageService) {

    this.discountForm = new FormGroup({
      courseDiscountSno: new FormControl(null),
      discountPercentage: new FormControl(null, [Validators.required]),
      discountPrice: new FormControl(null),
      activeFlag: new FormControl("true", Validators.required),

    });
  }

  ngOnInit(): void {
    this.data = window.history.state;
    // if()
    this.getCourseDiscount();

  }

  getCourseDiscount(){
    let params: any = {courseMasterSno: this.data?.courseMasterSno}
    console.log(params)
    this.api.get('8000/api/ascend/learnhub/v1/get_course_discount',params).subscribe((result) => {
      if(result != null && result.data != null){
        console.log(result)
        this.courseDiscountList = result.data;
        console.log(this.courseDiscountList)
        this.discountForm.setValue({
          courseDiscountSno: this.courseDiscountList[0]?.courseDiscountSno,
          discountPercentage: this.courseDiscountList[0]?.discountPercentage,
          discountPrice: this.courseDiscountList[0]?.discountPrice,
          activeFlag: this.courseDiscountList[0]?.activeFlag,
        });      
      }
    }) 
  }

  saveDiscount(){
    let params : any ={
      courseMasterSno: this.data?.courseMasterSno,
      appUserSno: this.appUser?.appUserSno,
      discountPercentage: this.discountForm.value.discountPercentage,
      discountPrice: this.discountForm.value.discountPrice,
      activeFlag: this.discountForm.value.activeFlag,
    }
    console.log(params)
    this.api.post('8000/api/ascend/learnhub/v1/insert_course_discount',params).subscribe((result) => {
      console.log(result)
      if(result != null && result.data != null){
        console.log(result)
        this.toastService.showSuccess("Discount is added Successfully");
        // this.discountForm.reset();
        this.getCourseDiscount();
      }else{
        this.toastService.showError("Discount is already applyed for this Course");
      }
    })
  }

  updateDiscount() {
    let params: any = {
      courseMasterSno: this.data?.courseMasterSno,
      appUserSno: this.appUser?.appUserSno,
      discountPercentage: this.discountForm.value.discountPercentage,
      discountPrice: this.discountForm.value.discountPrice,
      activeFlag: this.discountForm.value.activeFlag,
      courseDiscountSno:this.discountForm.value.courseDiscountSno// Ensure you have this property
    };
  
    console.log(params);
      this.isLoading = true;
      this.api.put('8000/api/ascend/learnhub/v1/update_course_discount', params).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          this.toastService.showSuccess("Discount is updated successfully");
          // this.discountForm.reset();
          this.getCourseDiscount();
        } else {
          this.toastService.showError("Failed to update discount for this course");
        }
        this.isLoading = false;
      }
    );
  }
  
  calculateDiscount() {
    let price: number;
    const discountPercentage = this.discountForm.value.discountPercentage;
  
    if (this.data?.price && discountPercentage !== undefined && discountPercentage !== null) {
      if (discountPercentage === 0) {
        this.discountPrice = this.data.price;
      } else {
        price = (this.data.price * discountPercentage) / 100;
        this.discountPrice = this.data.price - price;
      }
      // Round the discount price to the nearest integer
      this.discountPrice = Math.round(this.discountPrice);
      this.discountForm.get('discountPrice').setValue(this.discountPrice);
      console.log(this.discountPrice);
    }
  }
  

  trimToTwoDecimalPlaces(numberToTrim: number): number {
    return Number(numberToTrim.toFixed(2));
  }



}
