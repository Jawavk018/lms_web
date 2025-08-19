import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";

@Component({
  selector: "app-coursetab",
  templateUrl: "./coursetab.component.html",
  styleUrls: ["./coursetab.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CoursetabComponent implements OnInit {
  courseList: any = [];
  appUser: any = this.tokenStorage.getUser();
  categoryList: any = [];
  selectedCourseCategory: any = "";
  selectedCategory: any;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCourse();
    this.getcategoryList();
  }

  getcategoryList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_mapped_category", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.categoryList = result.data;
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

  getCourse() {
    let params: any = {};
    if (this.appUser?.appUserSno) {
      params.appUserSno = this.appUser?.appUserSno;
    }
    if (this.selectedCategory?.length) {
      params.categorySno = `{ ${this.selectedCategory} }`;
    }
    params.limit = 6;
    this.api
      .get("8000/api/ascend/learnhub/v1/get_filter_courses", params)
      .subscribe((result) => {
        console.log(result);
        if (result) {
          this.courseList = result?.data ?? [];
        }
      });
  }

  addToCart(i: any) {
    if (this.appUser?.appUserSno) {
      let body: any = {};
      // body.courseSno = this.courseList[i]?.courseSno;
      body.courseMasterSno = this.courseList[i]?.courseMasterSno;
      body.appUserSno = this.appUser?.appUserSno;
      console.log(body);
      this.api.post("8000/api/ascend/learnhub/v1/insert_cart", body).subscribe(
        (result) => {
          console.log(result);
          if (result != null && !result?.data.msg) {
            this.courseList[i].orderStatus = {
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

  removeCart(i: number) {
    let body: any = {
      cartSno: this.courseList[i]?.orderStatus?.cartSno,
      cartCourseSno: this.courseList[i]?.orderStatus?.cartCourseSno,
    };
    this.api.delete("8000/api/ascend/learnhub/v1/delete_cart", body).subscribe(
      (result: any) => {
        console.log(result);
        if (result != null && result?.data?.isUpdate) {
          this.courseList[i].orderStatus = null;
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
    this.selectedCategory = [];
    if (courseCategory == "") {
      this.getCourse();
    }else{
      for (let i in this.categoryList) {
        if (this.categoryList[i]?.categoryName == courseCategory) {
          this.selectedCategory.push(this.categoryList[i].categorySno);
          this.getCourse();
          break;
        }
      }
    }
  }
}
