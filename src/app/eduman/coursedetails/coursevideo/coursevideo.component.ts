import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PopupvideoComponent } from "../../common/popupvideo/popupvideo.component";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-coursevideo",
  templateUrl: "./coursevideo.component.html",
  styleUrls: ["./coursevideo.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CoursevideoComponent implements OnInit {
  @Input() data: any;
  appUser: any = this.tokenStorage.getUser();
  coursesCouponList: any = [];
  myCourseCoupon: any = [];
  likesList: any = [];
  currentIndex: number = 0;
  courseMasterSno: number = 0;

  // isFavorite: boolean = false;
  // favoriteList: any = [];
  // favoriteSno: any;

  constructor(
    public dialog: MatDialog,
    private tokenStorage: TokenStorageService,
    private api: ApiService,
    private toastService: ToastService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {}

  openDialog() {
    this.dialog.open(PopupvideoComponent, {
      data: this.data?.promotionalVideo,
    });
  }

  ngOnInit(): void {
   
  }

  addToCart() {
    if (this.appUser?.appUserSno) {
      let body: any = {};
      // body.courseSno = this.data?.courseSno;
      body.courseMasterSno = this.data?.courseMasterSno;
      body.appUserSno = this.appUser?.appUserSno;
      console.log(body);
      this.api.post("8000/api/ascend/learnhub/v1/insert_cart", body).subscribe(
        (result) => {
          console.log(result);
          if (result != null && !result?.data.msg) {
            this.data.orderStatus = {
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

  removeCart() {
    let body: any = {
      cartSno: this.data.orderStatus?.cartSno,
      cartCourseSno: this.data.orderStatus?.cartCourseSno,
    };
    this.api.delete("8000/api/ascend/learnhub/v1/delete_cart", body).subscribe(
      (result: any) => {
        console.log(result);
        if (result != null && result?.data?.isUpdate) {
          this.data.orderStatus = null;
          this.api.cartCount--;
        } else {
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  // getFavorite() {
  //   let body: any = {
  //     appUserSno: this.appUser.appUserSno
  //   };

  //   this.api.get('8000/api/ascend/learnhub/v1/get_favorite', body).subscribe((result) => {
  //     if (result != null && result.data != null) {
  //       console.log(result.data);
  //       this.favoriteList = result.data;
  //       console.log(this.favoriteList);

  //       // Check if the current course is in the favorites list
  //       this.isFavorite = this.favoriteList.some((item: { courseSno: any; }) => item.courseSno === this.data?.courseSno);
  //       console.log(this.isFavorite);

  //       // Extract favoriteSno for the specific course
  //       const favoriteItem = this.favoriteList.find((item: { courseSno: any; }) => item.courseSno === this.data?.courseSno);
  //       if (favoriteItem) {
  //         this.favoriteSno = favoriteItem.favoriteSno;
  //         console.log(this.favoriteSno);
  //       } else {
  //         console.log("Favorite not found for the current course");
  //       }
  //     } else {
  //       this.favoriteList = [];
  //       console.log(this.favoriteList);
  //     }
  //   });
  // }

  addToFavorite() {
    if (this.appUser?.appUserSno && this.data?.courseSno) {
      let body: any = {
        courseSno: this.data.courseSno,
        appUserSno: this.appUser.appUserSno,
      };

      console.log(body);
      this.api.post("8000/api/ascend/learnhub/v1/insert_favorite", body).subscribe(
        (result) => {
          if (result != null && result.data != null) {
            console.log(result.data);
            // this.isFavorite = true;
            // this.getFavorite();
            this.data.favoriteSno = result.data?.favoriteSno;
            this.toastService.showSuccess("Added to Favourite");
          } else {
            this.toastService.showError("Failed add to Favourite");
          }
        },
        (err) => {
          this.toastService.showError("Failed add to Favourite");
        }
      );
    }
  }

  removeFavorite() {
    let body: any = {
      favoriteSno: this.data?.favoriteSno,
    };
    console.log(body);
    this.api.post("8000/api/ascend/learnhub/v1/delete_favorite", body).subscribe((result) => {
      if (result != null && result.data != null) {
        console.log(result);
        this.data.favoriteSno = null;
        this.toastService.showError("Removed from Favourite");
      }
    });
  }


  currentTime() {
    const timestamp = new Date();
    return this.datePipe.transform(timestamp, "yyyy-MM-ddTHH:mm:ss.SSSSSS");
  }

  addLike(){
    if (this.appUser?.appUserSno && this.data?.courseMasterSno) {
      let body: any = {
        courseMasterSno: this.data.courseMasterSno,
        appUserSno: this.appUser.appUserSno,
        createdOn: this.currentTime(),
      };

      console.log(body);
      this.api.post("8000/api/ascend/learnhub/v1/insert_course_like", body).subscribe(
        (result) => {
          if (result != null && result.data != null) {
            console.log(result.data);
            this.data.courseLikeSno = result.data?.courseLikeSno;
            if (this.data.likeCount) {
              this.data.likeCount.count += 1;
            }
            this.toastService.showSuccess("You Liked this course");
          } else {
            // this.toastService.showError("Failed add to Like");
          }
        },
        (err) => {
          // this.toastService.showError("Failed add to Like");
        }
      );
    }

  }

  removeLike() {
    let body: any = {
      courseLikeSno: this.data?.courseLikeSno,
    };
    console.log(body);
    this.api.post("8000/api/ascend/learnhub/v1/delete_course_like", body).subscribe((result) => {
      if (result != null && result.data != null) {
        console.log(result);
        if(result.isSuccess) {
          // Reduce the like count
          if (this.data.likeCount && this.data.likeCount.count > 0) {
            this.data.likeCount.count -= 1;
          }
          this.data.courseLikeSno = null;
          // this.toastService.showError("Removed from Like");
        }
      }
    });
  }
  

  showPrev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  showNext(): void {
    if (this.currentIndex < this.data.myCourseCoupons.length - 1) {
      this.currentIndex++;
    }
  }

}
