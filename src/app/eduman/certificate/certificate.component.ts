import { Component } from "@angular/core";
import { CertificateDialogComponent } from "../certificate-dialog/certificate-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-certificate",
  templateUrl: "./certificate.component.html",
  styleUrls: ["./certificate.component.scss"],
})
export class CertificateComponent {
  [x: string]: any;
  titleName: string = "Certificate of Achievement";
  content: string = "This is to certify that";
  recipientName: string = "";
  courseName: string = "";

  completionDate: string = "";
  para: string = "has successfully completed the course in";
  instructor: string = "Instructor";
  organization: string = "Organization";
  instructorSignature: boolean = false;
  organizationSignature: boolean = false;
  instructorImageSrc: string | ArrayBuffer | null = null;
  organizationImageSrc: string | ArrayBuffer | null = null;
  logoImage: string = "/assets/img/LOGO2.webp";
  image: any = {
    logo: null,
    instructor: null,
    organization: null,
  };

  constructor(private dialog: MatDialog) {}

  previewLogo(event: any) {
    this.image.logo = event.target.files[0];
    this.readImageFile(event.target.files[0], (result: string) => {
      this.logoImage = result;
    });
  }

  readImageFile(file: File, callback: (result: string) => void) {
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  previewImage(event: any, imageId: string) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imageElement = document.getElementById(imageId) as HTMLImageElement;
      imageElement.src = reader.result as string;
      imageElement.style.display = "block";

      if (imageId === "instructor-image") {
        this.instructorSignature = true;
        this.instructorImageSrc = reader.result;
        this.image.instructor = file;
      } else if (imageId === "organization-image") {
        this.organizationSignature = true;
        this.organizationImageSrc = reader.result;
        this.image.organization = file;
      }
    };
    reader.readAsDataURL(file);
  }

  updateTitle(event: any) {
    this.titleName = event.target.innerText;
  }

  updateContent(event: any) {
    this.content = event.target.innerText;
  }

  updatePara(event: any) {
    this.para = event.target.innerText;
  }

  updateInstructor(event: any) {
    this.instructor = event.target.innerText;
  }

  updateOrganisation(event: any) {
    this.organization = event.target.innerText;
  }

  openCertificateDialog() {
    const dialogRef = this.dialog.open(CertificateDialogComponent, {
      width: "500px",
      data: {
        title: this.titleName,
        content: this.content,
        recipientName: this.recipientName,
        courseName: this.courseName,
        logoImage: this.logoImage,
        completionDate: this.completionDate,
        para: this.para,
        instructor: this.instructor,
        organization: this.organization,
        instructorImage: this.instructorImageSrc,
        organizationImage: this.organizationImageSrc,
        imageFile: this.image,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log("The dialog was closed");
      // Handle any actions after the dialog is closed
    });
  }

  editTitle() {
    const titleElement =
      this.el.nativeElement.querySelector("#certificate-title");
    titleElement.contentEditable = "true";
    titleElement.focus();

    // Limit text to 60 characters
    this.renderer.listen(titleElement, "input", () => {
      if (titleElement.innerText.length > 60) {
        titleElement.innerText = titleElement.innerText.substring(0, 60);
      }
    });
  }

  editContent() {
    const contentElement = this.el.nativeElement.querySelector(
      "#certificate-content"
    );
    contentElement.contentEditable = "true";
    contentElement.focus();
  }
  editPara() {
    const paraElement =
      this.el.nativeElement.querySelector("#certificate-para");
    paraElement.contentEditable = "true";
    paraElement.focus();
  }

  editInstructor() {
    const instructorElement = this.el.nativeElement.querySelector(
      "#certificate-instructor"
    );
    instructorElement.contentEditable = "true";
    instructorElement.focus();
  }

  editOrganisation() {
    const organisationElement = this.el.nativeElement.querySelector(
      "#certificate-organisation"
    );
    organisationElement.contentEditable = "true";
    organisationElement.focus();
  }
}
