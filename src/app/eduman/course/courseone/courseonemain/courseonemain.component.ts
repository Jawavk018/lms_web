import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";

@Component({
  selector: "app-courseonemain",
  templateUrl: "./courseonemain.component.html",
  styleUrls: ["./courseonemain.component.scss"],
})
export class CourseonemainComponent implements OnInit {
  params: any;
  appUser: any = this.tokenStorage.getUser();
  courseList: any = [];
  categoryList: any = [];
  languageTypeList: any = [];
  expLevelTypeList: any = [];
  costList: any = [];
  durationList: any = [];
  ratingList: any = [];

  shopLanguageActive: boolean = false;
  shopCostActive: boolean = false;

  modalScrollDistance = 2;
  modalScrollThrottle = 200;
  isSrollDown: boolean = true;
  isNoMoreRecord: boolean = false;
  skip = 0;
  limit = 10;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (params) {
        this.params = params;
        if (this.params?.categorySno) {
          this.categoryList = [this.params?.categorySno];
        }
        this.getCourse();
      }
    });
  }

  changeCategory(event: any) {
    this.categoryList = event;
    this.getCourse();
    this.skip = 0;
    this.limit = 10;
    this.isNoMoreRecord = false;
  }

  changeLanguage(event: any) {
    this.languageTypeList = event;
    this.getCourse();
    this.skip = 0;
    this.limit = 10;
    this.isNoMoreRecord = false;
  }

  changeLevel(event: any) {
    this.expLevelTypeList = event;
    this.getCourse();
    this.skip = 0;
    this.limit = 10;
    this.isNoMoreRecord = false;
  }

  changeCost(event: any) {
    this.costList = event;
    this.getCourse();
    this.skip = 0;
    this.limit = 10;
    this.isNoMoreRecord = false;
  }

  changeDuration(event: any) {
    this.durationList = event;
    this.getCourse();
    this.skip = 0;
    this.limit = 10;
    this.isNoMoreRecord = false;
  }

  changeRating(event: any) {
    this.ratingList = event;
    this.getCourse();
    this.skip = 0;
    this.limit = 10;
    this.isNoMoreRecord = false;
  }

  getCourse() {
    let params: any = {};
    if (this.appUser?.appUserSno) {
      params.appUserSno = this.appUser?.appUserSno;
    }
    if (this.categoryList?.length) {
      params.categorySno = `{ ${this.categoryList} }`;
    }
    if (this.params?.subCategorySno) {
      params.subCategorySno = `{ ${this.params?.subCategorySno} }`;
    }
    if (this.params?.topicSno) {
      params.topicSno = `{ ${this.params?.topicSno} }`;
    }
    if (this.languageTypeList?.length) {
      params.languageTypeCdSno = `{ ${this.languageTypeList} }`;
    }
    if (this.expLevelTypeList?.length) {
      params.expLevelTypeCdSno = `{ ${this.expLevelTypeList} }`;
    }
    if (this.costList?.length) {
      params.costList  = '';
      for(let i in this.costList){
        params.costList = params.costList + this.costList[i] + ((this.costList?.length ?? 0) == parseInt(i)+1 ? '' : ',')
      }
    }
    if (this.durationList?.length) {
      params.durationList  = '';
      for(let i in this.durationList){
        params.durationList = params.durationList + this.durationList[i] + ((this.durationList?.length ?? 0) == parseInt(i)+1 ? '' : ',')
      }
    }
    if (this.ratingList?.length) {
      params.ratingList = `[ ${this.ratingList} ]`;
    }
    params.skip = this.skip;
    params.limit = this.limit;
    params.courseVerifyStatusCd = 'Verified'
    console.log(params);
    this.api
      .get("8000/api/ascend/learnhub/v1/get_filter_courses", params)
      .subscribe((result) => {
        console.log(result);
        if (result) {
          if (result.data != null) {
              this.courseList = [];
              this.courseList = result.data ?? [];
              this.params = null;
          } else {
            this.courseList = [];
            this.isNoMoreRecord = true;
          }
        } else {
          this.courseList = [];
          this.isNoMoreRecord = true;
        }
      });
  }

  shopDuration() {
    if (this.shopLanguageActive == false) {
      this.shopLanguageActive = true;
    } else {
      this.shopLanguageActive = false;
    }
  }
  shopCost() {
    if (this.shopCostActive == false) {
      this.shopCostActive = true;
    } else {
      this.shopCostActive = false;
    }
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
            this.toastService.showSuccess("Add Cart Successfully");
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
      cartSno: this.courseList[i].orderStatus?.cartSno,
      cartCourseSno: this.courseList[i].orderStatus?.cartCourseSno,
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

  getMoreCourse(){
    let params: any = {};
    if (this.appUser?.appUserSno) {
      params.appUserSno = this.appUser?.appUserSno;
    }
    if (this.categoryList?.length) {
      params.categorySno = `{ ${this.categoryList} }`;
    }
    if (this.params?.subCategorySno) {
      params.subCategorySno = `{ ${this.params?.subCategorySno} }`;
    }
    if (this.params?.topicSno) {
      params.topicSno = `{ ${this.params?.topicSno} }`;
    }
    if (this.languageTypeList?.length) {
      params.languageTypeCdSno = `{ ${this.languageTypeList} }`;
    }
    if (this.expLevelTypeList?.length) {
      params.expLevelTypeCdSno = `{ ${this.expLevelTypeList} }`;
    }
    if (this.costList?.length) {
      params.costList  = '';
      for(let i in this.costList){
        params.costList = params.costList + this.costList[i] + ((this.costList?.length ?? 0) == parseInt(i)+1 ? '' : ',')
      }
    }
    if (this.durationList?.length) {
      params.durationList  = '';
      for(let i in this.durationList){
        params.durationList = params.durationList + this.durationList[i] + ((this.durationList?.length ?? 0) == parseInt(i)+1 ? '' : ',')
      }
    }
    if (this.ratingList?.length) {
      params.ratingList = `[ ${this.ratingList} ]`;
    }
    params.skip = this.courseList.length;
    params.limit = this.limit;
    params.courseVerifyStatusCd = 'Verified'
    this.api.get("8000/api/ascend/learnhub/v1/get_filter_courses", params).subscribe((result) => {
        console.log(result);
        if (result) {
          if (result.data != null) {
            for(let i in result.data) {
              this.courseList.push(result.data[i]);
            }
            this.params = null;
          } else {
            this.isNoMoreRecord = true;
          }
        } else {
          this.isNoMoreRecord = true;
        }
      });
  }

}
