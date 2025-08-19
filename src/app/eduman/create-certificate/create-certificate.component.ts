import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "src/app/providers/api/api.service";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { TokenStorageService } from "src/app/providers/token-storage.service";
declare var $: any;

@Component({
  selector: "app-create-certificate",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: "./create-certificate.component.html",
  styleUrls: ["./create-certificate.component.scss"],
})
export class CreateCertificateComponent {
  certificateList: any = [];
  selectedIndex: number = 0;
  appUser: any = this.tokenStorage.getUser();
  isUpload: boolean = false;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<CreateCertificateComponent>,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    this.getCertificate();
  }

  getCertificate() {
    let params: any = {};
    params.appUserSno = this.appUser?.appUserSno;
    params.isOrg = this.appUser?.organization ?  true : false;
    this.api.get("8000/api/ascend/learnhub/v1/get_certificate", params).subscribe((result) => {
      if (result) {
        this.certificateList = result?.data ?? [];
      }
      console.log(this.certificateList);
    });
  }

  selectCertificate(i: number) {
    this.selectedIndex = i;
  }

  insertCertificate() {
    let selectCertificateList: any = [];
    this.certificateList.forEach((certificate: any) => {
      if (certificate.selected) {
        selectCertificateList.push(certificate.certificateSno);
      }
    });
    let body: any = {};
    body.certificateList = selectCertificateList;
    body.appUserSno = this.appUser?.appUserSno;
    if (this.appUser?.organization) {
      body.isOrg = true;
    }
    this.isUpload = true;
    this.api
      .post("8000/api/ascend/learnhub/v1/insert_my_certificate", body)
      .subscribe((result) => {
        if (result != null) {
          if (result.data.tutorCertificateSno) {
            this.dialogRef.close(true);
          }
        }
      });
  }
}
