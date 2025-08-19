import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import html2canvas from "html2canvas";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { ApiService } from "src/app/providers/api/api.service";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { PdfViewerModule } from "ng2-pdf-viewer";
@Component({
  selector: "app-certificate-template",
  templateUrl: "./certificate-template.component.html",
  standalone: true,
  imports: [CommonModule, PdfViewerModule, MatDialogModule],
  styleUrls: ["./certificate-template.component.scss"],
})
export class CertificateTemplateComponent {
  appUser: any = this.tokenStorage.getUser();
  pdf: any;
  noCertificateFound: boolean = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenStorage: TokenStorageService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.getCertificate();
  }

  getCertificate() {
    let params: any = {};
    params.courseSno = this.data?.courseSno;
    params.appUserSno = this.appUser?.appUserSno;
    // params.courseSno = 1;
    // params.appUserSno = 6;
    this.api
      .get("8000/api/ascend/learnhub/v1/course_complete_certificate", params)
      .subscribe((result) => {
        if (result != null) {
          if (result?.data) {
            this.pdf =
              "data:application/pdf;base64," + result?.data[0]?.certificate;
          } else {
            this.noCertificateFound = true;
          }
        }
      });
  }

  downloadPDF() {
    const base64WithoutPrefix = this.pdf.replace(/^data:application\/pdf;base64,/, '');
    const byteCharacters = atob(base64WithoutPrefix);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.data?.courseName}.pdf`;
    a.click();
  }
}
