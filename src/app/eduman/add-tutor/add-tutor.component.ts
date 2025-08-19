import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { Validators } from "ngx-editor";
import { Subject, debounceTime } from "rxjs";
import { ApiService } from "src/app/providers/api/api.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-tutor",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./add-tutor.component.html",
  styleUrls: ["./add-tutor.component.scss"],
})
export class AddTutorComponent {
  loginForm: FormGroup;
  @Output() heightChange = new EventEmitter<number>();
  selectedTutorList: any = [];
  searchTutor: Subject<any> = new Subject<any>();
  tutorList: any = [];
  appUser: any = this.tokenStorage.getUser();
  nodata:boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private tokenStorage: TokenStorageService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<AddTutorComponent>
  ) {
    this.loginForm = this.fb.group({
      userId: [null, [Validators.required, this.emailOrMobileValidator]],
    });
    this.searchTutor
      .pipe(debounceTime(300))
      .subscribe((searchTutor: string) => {
        this.nodata = false;
        if (this.loginForm.valid && searchTutor?.trim()?.length) {
          this.search(searchTutor);
        } else {
          this.heightChange.emit(0);
          this.tutorList = [];
        }
      });
  }

  ngOnInit() {}

  emailOrMobileValidator(control: FormControl) {
    const value = control.value;
    if (!value) {
      return null;
    }
    // Check if the value is either a valid email or a valid mobile number
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isValidMobileNumber = /^\d{10}$/.test(value);

    if (!isValidEmail && !isValidMobileNumber) {
      return { invalidEmailOrMobile: true };
    }

    return null;
  }

  search(key: any) {
    let param: any = { userId: key };
    param.entitySno = this.appUser?.organization?.entitySno;
    this.api.get("8000/api/ascend/learnhub/v1/get_search_tutor", param).subscribe((result) => {
      if (result != null) {
        this.tutorList = result?.data ?? [];
        if (!this.tutorList?.length) {
          this.nodata = true;
        }
        this.heightChange.emit(1);
        console.log(this.tutorList);
      }
    });
  }

  addTutor(i: number) {
    this.selectedTutorList = [];
    this.tutorList.forEach((element: any) => {
      element.isSelected = false;
    });
    this.tutorList[i].isSelected = !this.tutorList[i]?.isSelected;
    this.selectedTutorList.push(this.tutorList[i]?.userId);
  }

  close() {
    this.dialogRef.close();
  }

  inviteTutor() {
    let body: any = {};
    body.entitySno = this.appUser?.organization?.entitySno;
    body.tutorList = this.selectedTutorList;
    this.api.post("8000/api/ascend/learnhub/v1/invite_tutor", body).subscribe((result) => {
      if (result != null) {
        if (result?.data) {
          if (result?.data?.isSuccess) {
            this.toastService.showSuccess(result?.data?.msg);
            this.dialogRef.close(true);
          } else {
            this.toastService.showWarning(result?.data?.msg);
          }
        }
      }
    });
  }
}
