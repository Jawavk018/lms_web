import { Component, ElementRef, Renderer2, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CommonHeaderComponent } from "../common-header/common-header.component";
import { ApiService } from "src/app/providers/api/api.service";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { CreateCertificateComponent } from "../create-certificate/create-certificate.component";
import { DomSanitizer } from "@angular/platform-browser";
import { UpdateCertificateComponent } from "src/app/update-certificate/update-certificate.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-certificate-home",
  templateUrl: "./certificate-home.component.html",
  styleUrls: ["./certificate-home.component.scss"],
})
export class CertificateHomeComponent {
  certificateList: any = [];
  myCertificateList: any = [];
  orgCertificateList: any = [];
  appUser: any = this.tokenStorage.getUser();
  selectedCertificate: any;
  @ViewChild("iframeElement") iframeElement!: ElementRef;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private tokenStorage: TokenStorageService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.getMyCertificate();
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

  getMyCertificate() {
    let params: any = {};
    params.appUserSno = this.appUser?.appUserSno;
    if (!this.appUser?.organization) {
      params.isOrg = false;
    }
    this.api
      .get("8000/api/ascend/learnhub/v1/get_my_certificate", params)
      .subscribe((result) => {
        if (result) {
          this.myCertificateList = result?.data.length
          ? result?.data[0].myCertificateList?.length
            ? result?.data[0].myCertificateList
            : []
          : [];
          this.selectedCertificate = this.myCertificateList?.length
            ? this.myCertificateList[0]
            : null;
          this.orgCertificateList = result?.data.length
            ? result?.data[0].orgCertificateList?.length
              ? result?.data[0].orgCertificateList
              : []
            : [];
          if (!this.selectedCertificate) {
            this.selectedCertificate = this.orgCertificateList?.length
            ? this.orgCertificateList[0]
            : null;
          }
          console.log(this.selectedCertificate);
        }
        console.log(this.myCertificateList);
        if (!this.myCertificateList?.length && !this.orgCertificateList?.length) {
          this.createCertificate();
        }
      });
  }

  createCertificate() {
    let certificate = this.dialog.open(CreateCertificateComponent, {
      width: "50%",
      height: "75%",
      disableClose: false,
    });
    certificate.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.getMyCertificate();
      }
    });
  }

  selectCertificate(i: number) {
    this.selectedCertificate = this.myCertificateList[i];
  }

  selectOrgCertificate(i: number) {
    this.selectedCertificate = this.orgCertificateList[i];
  }

  editCertificate() {
    let certificate = this.dialog.open(UpdateCertificateComponent, {
      width: "50%",
      height: "75%",
      data: this.selectedCertificate,
      disableClose: true,
    });
    certificate.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.getMyCertificate();
      }
    });
  }

  deleteAlert() {
    Swal.fire({
      title: "Are you sure want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "lightgrey",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCertificate();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled!", "Your record is safe", "error");
      }
    });
  }

  deleteCertificate() {
    let params: any = {};
    params.tutorCertificateSno = this.selectedCertificate?.tutorCertificateSno;
    this.api
      .delete("8000/api/ascend/learnhub/v1/delete_my_certificate", params)
      .subscribe((result) => {
        if (result) {
          let index: number = this.myCertificateList.findIndex(
            (cert: any) =>
              cert?.tutorCertificateSno ==
              this.selectedCertificate?.tutorCertificateSno
          );
          if (index != -1) {
            this.myCertificateList.splice(index, 1);
            if (this.myCertificateList?.length) {
              this.selectedCertificate = this.myCertificateList[0];
            } else {
              this.selectedCertificate = null;
              this.getMyCertificate();
            }
          }
        }
      });
  }

  sanitizerUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
