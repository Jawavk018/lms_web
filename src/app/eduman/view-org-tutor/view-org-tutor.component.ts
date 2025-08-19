import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";

@Component({
  selector: "app-view-org-tutor",
  templateUrl: "./view-org-tutor.component.html",
  styleUrls: ["./view-org-tutor.component.scss"],
})
export class ViewOrgTutorComponent {
  tutorAppUserSno: any;
  appUser: any = this.tokenStorage.getUser();
  tutorDetails:any;

  constructor(
    public route: ActivatedRoute,
    private toastService: ToastService,
    private tokenStorage: TokenStorageService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params) {
        this.tutorAppUserSno = params["tutorAppUserSno"];
        this.getTutorDetails();
      }
    });
  }

  getTutorDetails() {
    let params: any = {};
    params.tutorAppUserSno = this.tutorAppUserSno;
    params.entitySno = this.appUser?.organization?.entitySno;
    console.log(params);
    this.api.get("8000/api/ascend/learnhub/v1/get_org_tutor_details", params).subscribe((result: any) => {
      if(result){
        if(result?.data?.length){
          this.tutorDetails = result?.data[0];
        }
      }
    });
  }
}
