import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";

@Component({
  selector: "app-organizations",
  templateUrl: "./organizations.component.html",
  styleUrls: ["./organizations.component.scss"],
})
export class OrganizationsComponent {
  organizationList: any = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.getPopularOrg();
  }

  getPopularOrg() {
    let params: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_popular_org", params).subscribe((result) => {
      if (result) {
        this.organizationList = result?.data ?? [];
        console.log(this.organizationList);
      }
    });
  }

  viewOrg(i: number) {
    this.router.navigate(["/ViewOrganization"], {
      queryParams: {
        entitySno: this.organizationList[i]?.entitySno,
      },
    });
  }
}
