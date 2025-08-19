import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AddTutorComponent } from "../add-tutor/add-tutor.component";
import { ApiService } from "src/app/providers/api/api.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ReportComponent } from "../report/report.component";
declare var $:any;

@Component({
  selector: "app-tutor",
  templateUrl: "./tutor.component.html",
  styleUrls: ["./tutor.component.scss"],
})
export class TutorComponent {
  inviteTutor = ["userId", "name", "createdDate", "expiryStatus", "action"];
  tutors = [
    "photo",
    "userId",
    "name",
    "publishedCourse",
    "totalSubcription",
    "action",
  ];
  invitationSource!: MatTableDataSource<any>;
  tutorSource!: MatTableDataSource<any>;
  @ViewChild("inviteTutors") inviteTutorPaginator!: MatPaginator;
  @ViewChild("tutor") tutorPaginator!: MatPaginator;

  appUser: any = this.tokenStorage.getUser();

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private tokenStorage: TokenStorageService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.invitationSource = new MatTableDataSource();
    this.tutorSource = new MatTableDataSource();
  }

  ngOnInit() {
    if (this.appUser?.organization) {
      this.getInviteTutor();
      this.getOrgTutor();
    }
  }

  getInviteTutor() {
    let params: any = {};
    params.entitySno = this.appUser?.organization?.entitySno;
    this.api
      .get("8000/api/ascend/learnhub/v1/get_invite_tutor", params)
      .subscribe((result) => {
        if (result != null) {
          this.invitationSource.data = result?.data ?? [];
        }
      });
  }

  getOrgTutor() {
    let params: any = {};
    params.entitySno = this.appUser?.organization?.entitySno;
    this.api.get("8000/api/ascend/learnhub/v1/get_org_tutor", params).subscribe((result) => {
      if (result != null) {
        this.tutorSource.data = result?.data ?? [];
      }
    });
  }

  ngAfterViewInit() {
  }

  addTutor() {
    const dialogRef = this.dialog.open(AddTutorComponent, {
      data: {},
      width: "50rem",
      height: "20rem",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getInviteTutor();
      }
    });
    dialogRef.componentInstance.heightChange.subscribe((newHeight: number) => {
      if (newHeight) {
        dialogRef.updateSize("50rem", "28rem");
      } else {
        dialogRef.updateSize("50rem", "20rem");
      }
    });
  }

  deleteAlert(i: any) {
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
        this.removeInvite(i);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled!", "Your record is safe", "error");
      }
    });
  }

  removeInvite(i: number) {
    let params: any = {};
    params.entityInvitationSno =
      this.invitationSource?.data[i]?.entityInvitationSno;
    this.api
      .delete("8000/api/ascend/learnhub/v1/remove_invite_tutor", params)
      .subscribe((result: any) => {
        if (result != null) {
          if (result?.data) {
            if (result?.data?.isSuccess) {
              this.toastService.showSuccess(result?.data?.msg);
              const data = this.invitationSource.data;
              data.splice(i, 1);
              this.invitationSource.data = data;
            } else {
              this.toastService.showWarning(result?.data?.msg);
            }
          }
        }
      });
  }

  viewTutor(i: number) {
    this.router.navigate(["/viewOrgTutor"], {
      queryParams: {
        tutorAppUserSno: this.tutorSource.data[i]?.appUserSno,
      },
    });
  }

  viewReport(i: number) {
    const dialogRef = this.dialog.open(ReportComponent, {
      data: {
        userId: this.tutorSource.data[i]?.userId,
        tutorAppUserSno: this.tutorSource.data[i]?.appUserSno,
        photo: this.tutorSource.data[i]?.photo,
        name: this.tutorSource.data[i]?.name,
      },
      width: "100%",
      height: "100%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getInviteTutor();
      }
    });
  }
}
