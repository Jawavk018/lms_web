import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
// import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,HeaderComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent implements OnInit {

  categoryForm: any = FormGroup;
  isLoad: boolean = false;
  isShowLoad: boolean = false;
  isNoRecord: boolean = false;
  categoryList: any = [];
  categorySno: any;
  isDelete: boolean = false;
  selectedIndex: any;
  categoryActiveCount:number = 0;

  constructor(private api: ApiService, private toastService: ToastService) {
    this.categoryForm = new FormGroup({
      categorySno: new FormControl(null),
      categoryName: new FormControl(null, Validators.required),
      description: new FormControl(null),
      status: new FormControl('true', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getcategoryList();
  }

  save() {
    this.isLoad = true;
    let body: any = this.categoryForm.value;
    body.categoryName = this.categoryForm.get('categoryName').value.replace(/^\s+|\s+$/gm, '');
    this.api.post('8000/api/ascend/learnhub/v1/insert_category', body).subscribe(result => {
      this.isLoad = false;
      console.log(result);
      if (result != null && result?.data) {
        this.clear();
        body.categorySno = result.data.categorySno;
        this.categoryList.push(body);
        this.toastService.showSuccess('Saved Successfully')
      }
      else {
        this.toastService.showError('Category name is Already Exists')
      }
    }
      , err => {
        this.isLoad = false;
        this.isShowLoad = false;
        this.isNoRecord = true;
        this.toastService.showError(err)
      });
  }

  getcategoryList() {
    this.isNoRecord = false;
    this.isShowLoad=true;
    let param: any = {
        };
    this.api.get("8000/api/ascend/learnhub/v1/get_categories", param).subscribe(result => {
      console.log(result)
      this.isShowLoad=false;
      if (result != null) {
        if (result.data != null && result.data.length > 0) {
          this.categoryList = result.data;
          this.categoryActiveCount = this.categoryList.filter((category: { status: any; }) => category.status).length;
        } else {
          this.isNoRecord = true;
        }
      } 
      else {
        this.toastService.showError('Something went wrong');
      }
    },err=>{
      this.isShowLoad =false;
      this.isNoRecord = true;
      this.toastService.showError(err)
    });
  }

  update() {
    let body: any = {};  
    body = this.categoryForm.value;
    this.isLoad = true;
    this.api.put('8000/api/ascend/learnhub/v1/update_category', body).subscribe((result: any) => {
      this.isLoad = false;
      if (result != null && !result?.data?.message) {
        this.clear();
        this.categoryList[this.selectedIndex].categoryName = body.categoryName;
        this.categoryList[this.selectedIndex].status = (body.status == true || body.status == 'true')? true:false ;
        this.getcategoryList();
        this.toastService.showSuccess('Updated Successfully');
      } else {
        this.toastService.showError(result?.data?.message);
      }
    }, err => {
      this.isShowLoad = false;
      this.isNoRecord = true;
      this.isLoad = false;
      this.toastService.showError(err)
    }
    );
  }

  deleteAlert(i: any) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'lightgrey',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(i);
      }
      else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled!',
          'Your record is safe',
          'error'
        )
      }
    })
  }

  delete(i: any) {
    let body: any = {
      
      categorySno: this.categoryList[i].categorySno,
    };
    this.api.delete("8000/api/ascend/learnhub/v1/delete_category", body).subscribe(
      (result: any) => {
        console.log(result)
        if (result != null && result?.data?.isSuccess) {
          this.categoryList.splice(i, 1);
          this.toastService.showSuccess("Deleted Successfully");
          this.clear();
        } else{
          this.toastService.showError("Can't delete,Category Name is already mapped");
        }
        this.isNoRecord = true;

      },
      (err) => {
        this.isShowLoad = false;
        this.isNoRecord = true;
        this.toastService.showError(err);
      }
    );
  }

  clear() {
    this.categoryForm.reset();
    this.categoryForm.patchValue({
      status: 'true'
    });
  }

  edit(i: any) {
    this.selectedIndex = i;
    console.log(this.categoryList[i]);
    this.categoryForm.setValue({
      categorySno: this.categoryList[i]?.categorySno,
      categoryName: this.categoryList[i]?.categoryName,
      description: this.categoryList[i]?.description,
      status: this.categoryList[i]?.status,
    });
  }

}
