import { Component } from "@angular/core";
import { ApiService } from "src/app/providers/api/api.service";

@Component({
  selector: "app-organization",
  templateUrl: "./organization.component.html",
  styleUrls: ["./organization.component.scss"],
})
export class OrganizationComponent {
  constructor(private apiService: ApiService) {}

  ngOnInit() {}
}
