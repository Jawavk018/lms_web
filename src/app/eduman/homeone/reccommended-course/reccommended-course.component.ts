import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from 'src/app/providers/token-storage.service';


@Component({
  selector: 'app-reccommended-course',
  templateUrl: './reccommended-course.component.html',
  styleUrls: ['./reccommended-course.component.scss']
})
export class ReccommendedCourseComponent {


  courseList: any = [];   
  appUser: any = this.tokenStorage.getUser();
  categoryList: any = [];
  selectedCourseCategory: any = "";
  filterCourseList: any = [];

  filterCourseChunks: any = [];
  currentSlideIndex: number = 0;
  chunkSize: number = 3; 

  constructor(private api: ApiService, private tokenStorage: TokenStorageService,
    private toastService: ToastService,
    private router: Router
    ) { }

  ngOnInit(): void {
  this.getCourse();
  }

  getCourse() {
    let params: any = {};
    if (this.appUser?.appUserSno) {
      params.appUserSno = this.appUser?.appUserSno;
    }
    params.skip = 0;
    params.limit = 12;
    this.api
      .get("8000/api/ascend/learnhub/v1/get_recommended_courses", params)
      .subscribe((result) => {
        console.log(result);
        if (result) {
          this.courseList = result?.data ?? [];
          this.filterCourseList = structuredClone(this.courseList.slice(0,12));
          this.filterCourseChunks = this.chunkArray(this.filterCourseList, this.chunkSize);
          console.log(this.courseList[0]);
        }
      });
    }

    chunkArray(array: any[], size: number): any[][] {
      const chunkedArr = [];
      let index = 0;
      while (index < array.length) {
        chunkedArr.push(array.slice(index, index + size));
        index += size;
      }
      return chunkedArr;
    }


  addToCart(i:any,j: any) {
    if (this.appUser?.appUserSno) {
      let body: any = {};
      // body.courseSno = this.courseList[i]?.courseSno;
      body.courseMasterSno = this.filterCourseChunks[i][j]?.courseMasterSno;
      body.appUserSno = this.appUser?.appUserSno;
      console.log(body);
      this.api.post("8000/api/ascend/learnhub/v1/insert_cart", body).subscribe(
        (result) => {
          console.log(result);
          if (result != null && !result?.data.msg) {

            // this.courseList[i].orderStatus = {
              this.filterCourseChunks[i][j].orderStatus = {
              cartCourseSno: result?.data?.cartCourseSno,
              isPurchase: false,
              cartSno: result?.data?.cartSno,
            };
            this.api.cartCount++;
            this.toastService.showSuccess("Course added to your cart");
          } else {
            this.toastService.showError(result?.data.msg);
          }
        },
        (err) => {
          this.toastService.showError(err);
        }
      );
    } else {
      this.router.navigate(["/signin"]);
    }
  }

  removeCart(i:number,j: number) {
    let body: any = {
      cartSno: this.filterCourseChunks[i][j].orderStatus?.cartSno,
      cartCourseSno: this.filterCourseChunks[i][j].orderStatus?.cartCourseSno,
    };
    this.api.delete("8000/api/ascend/learnhub/v1/delete_cart", body).subscribe(
      (result: any) => {
        console.log(result);
        if (result != null && result?.data?.isUpdate) {
          this.filterCourseChunks[i][j].orderStatus = null;
          this.api.cartCount--;
        } else {
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  selectedCourse(courseCategory: any) {
    this.selectedCourseCategory = courseCategory;
    this.filterCourseList = [];
    for (let i in this.courseList) {
      if (this.courseList[i].categoryName == courseCategory) {
        this.filterCourseList.push(structuredClone(this.courseList[i]));
      }
      if(courseCategory == ''){
        this.filterCourseList.push(structuredClone(this.courseList[i]));
      }
    }
  }

  // isFirstSlide(): boolean {
  //   return this.currentSlideIndex === 0;
  // }

  // // Function to check if the current slide is the last one
  // isLastSlide(): boolean {
  //   return this.currentSlideIndex === this.filterCourseChunks.length - 1;
  // }


  // prevSlide(): void {
  //   if (this.currentSlideIndex > 0) {
  //     this.currentSlideIndex--;
  //   }
  // }
  
  // nextSlide(): void {
  //   if (this.currentSlideIndex < this.filterCourseChunks.length - 1) {
  //     this.currentSlideIndex++;
  //   }
  // }
  
}
