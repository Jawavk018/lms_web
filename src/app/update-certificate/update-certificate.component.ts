import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "../providers/api/api.service";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { TokenStorageService } from "../providers/token-storage.service";
import { MatButtonModule } from "@angular/material/button";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FileUploadService } from "../providers/socket/socket.service";
import { PhotoService } from "../providers/photoservice/photoservice.service";
declare var $: any;
@Component({
  selector: "app-update-certificate",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./update-certificate.component.html",
  styleUrls: ["./update-certificate.component.scss"],
})
export class UpdateCertificateComponent {
  files: any = [];
  isUpload: boolean = false;
  form: FormGroup;
  appUser: any = this.tokenStorage.getUser();

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<UpdateCertificateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileUploadService: FileUploadService,
    private photoService: PhotoService,
    private fb: FormBuilder,
    private tokenStorage: TokenStorageService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.isUpload = false;
    this.data.certificate = this.data?.details ?? this.data?.replaceKeys;
    console.log(this.data);
    this.createForm();
  }

  createForm() {
    this.data?.certificate?.forEach((field: any) => {
      const control = this.fb.control(
        field.value,
        field.required && !(field?.disabled || (field?.isOrg ? !this.appUser?.organization : false) || (field?.isTutor ? this.appUser?.organization : false)) ? Validators.required : null
      );
      this.form.addControl(field.key, control);
    });
    console.log(this.form.value);
  }

  changeImg(e: any, i: number) {
    this.photoService.acceptOnly(
      this.data?.certificate[i]?.acceptOnly,
      e.files[0]?.name,
      (res: any) => {
        if (res) {
          let exists = this.files.some((obj: any) => obj.index === i);
          if (exists) {
            let index = this.files.findIndex((obj: any) => obj.index == i);
            if (index != -1) {
              this.files[index].file = e.files[0];
            }
          } else {
            this.files.push({
              file: e.files[0],
              index: i,
            });
          }
          var reader = new FileReader();
          reader.onload = (res:any) => {
            this.data.certificate[i].value = res.target?.result;
            this.form.get(this.data?.certificate[i].key)?.setValue(res.target.result);
          };
          reader.readAsDataURL(e.files[0]);
        }
      }
    );
  }

  saveCertificate() {
    this.isUpload = true;
    let files: any = [];
    for (let file of this.files) {
      files.push(file.file);
    }
    this.fileUploadService.send(files, (result: any) => {
      let body: any = {};
      body.tutorCertificateSno = this.data?.tutorCertificateSno;
      for (let certificate of this.data?.certificate) {
        certificate.value = this.form.value[certificate.key];
      }
      body.replaceKeys = structuredClone(this.data?.certificate);
      for (let i = 0; i < this.files?.length; i++) {
        body.replaceKeys[this.files[i]?.index].value = result[i]?.mediaUrl;
      }
      body.html = this.data?.certificateHtml;
      this.api
        .put("8000/api/ascend/learnhub/v1/update_my_certificate", body)
        .subscribe((result: any) => {
          this.isUpload = false;
          if (result != null && result?.data != null) {
            this.dialogRef.close(result?.data?.tutorCertificateSno);
          }
        });
    });
  }

  changeImage(i: number) {
    $("#file-" + i).click();
  }
}
