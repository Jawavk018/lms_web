import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../header/header.component";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";

@Component({
  selector: "app-topics",
  standalone: true,
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./topics.component.html",
  styleUrls: ["./topics.component.scss"],
})
export class TopicsComponent implements OnInit {
  topicForm: FormGroup;
  categoryList: any = [];
  subCategoryList: any = [];
  isShowLoad: boolean = false;
  isLoad: boolean = false;
  topicsList: any = [];
  isNoRecord: boolean = false;
  topicsActiveCount: number = 0;
  selectedIndex: any;
  topicSno: any;

  constructor(private api: ApiService, private toastService: ToastService) {
    this.topicForm = new FormGroup({
      topicSno: new FormControl(null),
      categorySno: new FormControl(null, Validators.required),
      subCategorySno: new FormControl(null, Validators.required),
      topicName: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.getcategoryList();
    this.getTopics();
  }

  getcategoryList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_categories", param).subscribe(
      (result) => {
        console.log(result);
        this.isShowLoad = false;
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.categoryList = result.data;
            this.topicForm.patchValue({
              categorySno: this.categoryList[0].categorySno,
            });
            this.getSubCategoryList();
          } else {
          }
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  getSubCategoryList() {
    let param: any = {};
    param.categorySno = this.topicForm.value.categorySno;
    this.api.get("8000/api/ascend/learnhub/v1/get_sub_categories", param).subscribe(
      (result) => {
        console.log(result);
        this.isShowLoad = false;
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.subCategoryList = result.data;
          } else {
            this.subCategoryList = [];
          }
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  save() {
    this.isLoad = true;
    let body: any = this.topicForm.value;
    this.api.post("8000/api/ascend/learnhub/v1/insert_topic", body).subscribe(
      (result) => {
        console.log(result);
        this.isLoad = false;
        if (result != null && result?.data) {
          this.clear();
          this.getTopics();
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.isLoad = false;
        this.isShowLoad = false;
        this.isNoRecord = true;
        this.toastService.showError(err);
      }
    );
  }

  getTopics() {
    this.isNoRecord = false;
    this.isShowLoad = true;
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_topics", param).subscribe(
      (result) => {
        console.log(result);
        this.isShowLoad = false;
        if (result != null) {
          if (result.data != null && result?.data?.length > 0) {
            this.topicsList = result.data;
            this.topicsActiveCount = this.topicsList.filter(
              (topics: { status: any }) => topics.status
            ).length;
            // alert(JSON.stringify(this.categoryList))
          } else {
            this.isNoRecord = true;
          }
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.isShowLoad = false;
        this.isNoRecord = true;
        this.toastService.showError(err);
      }
    );
  }

  update() {
    let body: any = this.topicForm.value;
    console.log(body);
    this.isLoad = true;
    this.api.put("8000/api/ascend/learnhub/v1/update_topic", body).subscribe(
      (result: any) => {
        this.isLoad = false;
        if (result != null && !result?.data?.message) {
          this.clear();

          // this.topicsList[this.selectedIndex].topicSno = body.topicSno;
          // this.topicsList[this.selectedIndex].categorySno = body.categorySno;
          // this.topicsList[this.selectedIndex].subCategorySno = body.subCategorySno;
          // this.topicsList[this.selectedIndex].topicName = body.topicName;
          // this.topicsList[this.selectedIndex].status = (body.status == true || body.status == 'true') ? true : false;
          this.getTopics();
          this.toastService.showSuccess("Updated Successfully");
        } else {
          this.toastService.showError(result?.data?.message);
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  clear() {
    this.topicForm.reset();
  }

  edit(i: any) {
    this.selectedIndex = i;
    let obj = Object.assign({}, this.topicsList[i]);
    delete obj.categoryName;
    delete obj.subCategoryName;
    this.topicForm.setValue(obj);
  }
}
