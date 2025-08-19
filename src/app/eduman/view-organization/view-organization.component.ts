import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";

@Component({
  selector: "app-view-organization",
  templateUrl: "./view-organization.component.html",
  styleUrls: ["./view-organization.component.scss"],
})
export class ViewOrganizationComponent {
  orgDetails: any;
  lectureList: any = [];
  courseList: any = [];
  appUser: any = this.tokenStorage.getUser();
  entitySno: any;
  modalScrollDistance = 2;
  modalScrollThrottle = 200;
  isNoMoreRecord: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tokenStorage: TokenStorageService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.entitySno = params["entitySno"];
        if (this.entitySno) {
          this.getOrgDetails();
          this.getOrgLecture();
          this.getOrgVideo();
        }
      }
    });
  }

  getOrgDetails() {
    let params: any = {};
    params.entitySno = this.entitySno;
    this.api.get("8000/api/ascend/learnhub/v1/get_org_details", params).subscribe((result) => {
      if (result) {
        this.orgDetails = result?.data?.length ? result?.data[0] : null;
        console.log(this.orgDetails);
      }
    });
  }

  getOrgLecture() {
    let params: any = {};
    params.entitySno = this.entitySno;
    this.api.get("8000/api/ascend/learnhub/v1/get_org_lecture", params).subscribe((result) => {
      if (result) {
        this.lectureList = result?.data ?? [];
        console.log(this.lectureList);
      }
    });
  }

  getOrgVideo() {
    let params: any = {};
    params.entitySno = this.entitySno;
    params.skip = this.courseList?.length ?? 0;
    params.limit = 10;
    this.api.get("8000/api/ascend/learnhub/v1/get_org_video", params).subscribe((result) => {
      if (result) {
        if (result?.data) {
          for (let i in result.data) {
            this.courseList.push(result.data[i]);
          }
        } else {
          this.isNoMoreRecord = true;
        }
      } else {
        this.isNoMoreRecord = true;
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

  viewTutor(i: number) {
    this.router.navigate(["/instructor-profile"], {
      queryParams: {
        appUserSno: this.lectureList[i]?.appUserSno,
        entitySno: this.entitySno,
      },
    });
  }
}
