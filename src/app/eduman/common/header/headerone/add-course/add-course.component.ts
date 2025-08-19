import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import Stepper from 'bs-stepper';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
declare var $: any;

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatStepperModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {

  categoryList:any=[];
  courseIniateList:any=[];
  courseIniateForm:any=FormGroup;
  // curriculumForm:any=FormGroup;

  spendHoursTypeList:any=[];
  isLoad: boolean = false;
  isShowLoad: boolean = false;
  isNoRecord: boolean = false;

  isLinear = false;
  inputLength!: number;

  constructor(private router:Router,private api:ApiService,private toastService:ToastService) {
    this.courseIniateForm = new FormGroup({
      courseSno: new FormControl(null),
      title: new FormControl(null),
      subtitle: new FormControl(null),
      description: new FormControl(null),
      primarilyTaught: new FormControl(null),
      courseImage:new FormControl(null),
      promotionalVideo:new FormControl(null),
      categorySno:new FormControl(null),
      subCategorySno:new FormControl(null),
      topicsSno:new FormControl(null),
      availableHoursTypeCd:new FormControl(null),
      statusTypeCd:new FormControl(43),
      welcomeMsg:new FormControl(null),
      congratulationsMsg:new FormControl(null)
    });

    // this.curriculumForm = new FormGroup({

    // });
  }

  ngOnInit() {

    $(document).ready(() => {
      $("#inputText").on("input", () => {
        $("#inputLength").text($(this).val().length);
      });
    });
    this.getcategoryList();
    this.getEnumSpendHours();

  }

  updateInputLength(input: HTMLInputElement): void {
    this.inputLength = input.value.length;
  }

  getcategoryList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_categories", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.categoryList = result.data;
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

  getEnumSpendHours() {
    let param: any = { codeType: "available_hours_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.spendHoursTypeList = result.data;
      }
    });
  }

  save(){
    this.isLoad = true;
    let body: any = this.courseIniateForm.value;
    this.api.post('8000/api/ascend/learnhub/v1/create_course', body).subscribe(result => {
      this.isLoad = false;
      console.log(result);
      if (result != null && result?.data) {
        this.clear();
        body.courseSno = result.data.courseSno;
        this.courseIniateList.push(body);        
        this.router.navigate(['/add-course-content']);
        this.toastService.showSuccess('Let`s add course content');
      }
      else {
      }
    }
      , err => {
        this.isLoad = false;
        this.isShowLoad = false;
        this.isNoRecord = true;
        this.toastService.showError(err)
      });
  }

  clear() {
    this.courseIniateForm.reset();
  }

}

