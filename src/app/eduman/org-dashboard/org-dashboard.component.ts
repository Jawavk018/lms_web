import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { PhotoService } from "src/app/providers/photoservice/photoservice.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";

@Component({
  selector: "app-org-dashboard",
  templateUrl: "./org-dashboard.component.html",
  styleUrls: ["./org-dashboard.component.scss"],
})
export class OrgDashboardComponent {

  orgDetails: any;
  lectureList: any = [];
  courseList: any = [];
  appUser: any = this.tokenStorage.getUser();
  entitySno: any;
  modalScrollDistance = 2;
  modalScrollThrottle = 200;
  isNoMoreRecord: boolean = false;
  files: any = [];
  
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tokenStorage: TokenStorageService,
    private toastService: ToastService,
    private router: Router,
    private photoService: PhotoService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.entitySno = this.appUser?.organization?.entitySno;
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

  viewTutor(i: number) {
    this.router.navigate(["/instructor-profile"], {
      queryParams: {
        appUserSno: this.lectureList[i]?.appUserSno,
        entitySno: this.entitySno,
      },
    });
  }
}
