import { Component, Inject, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { ApiService } from "src/app/providers/api/api.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { ReplaySubject, Subject, takeUntil } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ToastService } from "src/app/providers/toast/toast.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";

@Component({
  selector: "app-report",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent {
  fromDate: any = moment().subtract(6, "d").format("YYYY-MM-DD");
  toDate: any = moment().format("YYYY-MM-DD");
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = "Account Name";
  public showYAxisLabel = true;
  public yAxisLabel = "time (mins)";
  appUser: any = this.tokenStorage.getUser();
  courseList: any = [];
  public courseCtrl: FormControl = new FormControl();
  public courseFilterCtrl: FormControl = new FormControl();
  public filteredCourse: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  report = ["courseName", "createdOn", "count"];
  @ViewChild("reportPaginator") reportPaginator!: MatPaginator;
  reportSource!: MatTableDataSource<any>;
  isSearch: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenStorage: TokenStorageService,
    private api: ApiService,
    private toastService: ToastService
  ) {
    this.reportSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.courseFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCourse();
      });
    this.getOrgMyCourse();
  }

  ngAfterViewInit() {
    this.reportSource.paginator = this.reportPaginator;
  }

  getOrgMyCourse() {
    let params: any = {};
    params.tutorAppUserSno = this.data?.tutorAppUserSno;
    this.api
      .get("8000/api/ascend/learnhub/v1/get_org_tutor_course_name", params)
      .subscribe((result) => {
        if (result != null) {
          this.courseList = result?.data ?? [];
          this.filteredCourse.next(this.courseList.slice());
        }
      });
  }

  protected filterCourse() {
    if (!this.courseList) {
      return;
    }
    // get the search keyword
    let search = this.courseFilterCtrl.value;
    if (!search) {
      this.filteredCourse.next(this.courseList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the cars
    this.filteredCourse.next(
      this.courseList.filter(
        (course: any) => course.courseName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  search() {
    var a = moment(this.fromDate);
    var b = moment(this.toDate);
    let diff = b.diff(a, "days"); // 1
    if (diff >= 0) {
      let params: any = {};
      params.fromDate = this.fromDate;
      params.toDate = this.toDate;
      params.tutorAppUserSno = this.data?.tutorAppUserSno;
      if (this.courseCtrl.value?.length) {
        params.courseMasterSno = "[" + this.courseCtrl.value + "]";
      }
      this.api
        .get("8000/api/ascend/learnhub/v1/get_org_tutor_course_report", params)
        .subscribe((result) => {
          this.isSearch = false;
          if (result != null) {
            this.reportSource.data = result?.data ?? [];
          }
        });
    } else {
      this.toastService.showError("startdate should earlier than end date");
    }
  }
}
