import { Component,Input } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-favorite-courses',
  templateUrl: './favorite-courses.component.html',
  styleUrls: ['./favorite-courses.component.scss']
})
export class FavoriteCoursesComponent {
  myCourseList: any = [];
  filterCourseChunks: any = [];
  appUser: any = this.storage.getUser();

  modalScrollDistance = 2;
  modalScrollThrottle = 200;
  isSrollDown: boolean = true;
  isNoMoreRecord: boolean = false;
  skip = 0;
  limit = 10;
  params: any;
  @Input() data: any;
  likesList:any=[];
  selectedIndex:number=0;
  constructor(private api: ApiService, private storage: TokenStorageService, 
              private toastService:ToastService, private router: Router,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getFavouritCourse();
    this.getMyLikes();
  }


  getFavouritCourse() {
    let params: any = {};
    params.appUserSno = this.appUser.appUserSno
    params.skip = this.skip;
    params.limit = this.limit;
    console.log(params);
    this.api.get('8000/api/ascend/learnhub/v1/get_my_favorite_courses', params)
      .subscribe((result) => {
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.myCourseList = result?.data ?? [];
            console.log(this.myCourseList);
          } else {
            this.isNoMoreRecord = true;
          }
        }else{
          this.isNoMoreRecord = true;
        }
      });
  }

  getMoreFavouritCourse(){
    let params: any = {};
    params.appUserSno = this.appUser.appUserSno
    params.skip = this.myCourseList.length;
    params.limit = this.limit;
    console.log(params);
    this.api.get("8000/api/ascend/learnhub/v1/get_my_favorite_courses", params).subscribe((result) => {
        console.log(result);  
        if (result) {
          if (result.data != null) {
            for(let i in result.data) {
              this.myCourseList.push(result.data[i]);
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

  removeFavorite(i:any, favoriteSno:any) {
    let body: any = {
      favoriteSno: favoriteSno,
    };
    console.log(body);
    this.api.post("8000/api/ascend/learnhub/v1/delete_favorite", body).subscribe((result) => {
      if (result != null && result.data != null) {
        console.log(result);
        this.myCourseList.splice(i,1);
        this.toastService.showError("Removed from Favourite");
      }
    });
  }

  selectedTabValue(event:any) {
    if (event.tab.textLabel == "FAVOURITES") {
      this.getMoreFavouritCourse()
    } else if (event.tab.textLabel == "LIKES") {
      this.getMyLikes();
    }
  }

  addToCart(i:any) {
    if (this.appUser?.appUserSno) {
      let body: any = {};
      // body.courseSno = this.courseList[i]?.courseSno;
      body.courseMasterSno = this.myCourseList[i]?.courseMasterSno;
      body.appUserSno = this.appUser?.appUserSno;
      console.log(body);
      this.api.post("8000/api/ascend/learnhub/v1/insert_cart", body).subscribe(
        (result) => {
          console.log(result);
          if (result != null && !result?.data.msg) {

            // this.courseList[i].orderStatus = {
              this.myCourseList[i].orderStatus = {
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

  removeCart(i:number) {
    let body: any = {
      cartSno: this.myCourseList[i].orderStatus?.cartSno,
      cartCourseSno: this.myCourseList[i].orderStatus?.cartCourseSno,
    };
    this.api.delete("8000/api/ascend/learnhub/v1/delete_cart", body).subscribe(
      (result: any) => {
        console.log(result);
        if (result != null && result?.data?.isUpdate) {
          this.myCourseList[i].orderStatus = null;
          this.api.cartCount--;
        } else {
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  
  getMyLikes(){
    let params: any = {};
    params.appUserSno = this.appUser?.appUserSno
    this.api.get('8000/api/ascend/learnhub/v1/get_liked_courses', params).subscribe((result) => {
      if (result != null) {
        if (result.data != null && result.data.length > 0) {
          this.likesList = result?.data ?? [];
          console.log(this.likesList);
        } else {
          this.isNoMoreRecord = true;
        }
      }else{
        this.isNoMoreRecord = true;
      }
  });
  }

  removeLike(i:any) {
    let body: any = {
      courseLikeSno: this.likesList[i].courseLikeSno,
    };
    console.log(body);
    this.api.post("8000/api/ascend/learnhub/v1/delete_course_like", body).subscribe((result) => {
 
      if (result != null && result.data != null) {
        console.log(result);
        this.likesList.splice(i,1);
        this.toastService.showError("Removed from Like");
      }
    });
  }

}
