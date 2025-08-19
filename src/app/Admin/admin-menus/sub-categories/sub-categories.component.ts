import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';

@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,HeaderComponent],
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent implements OnInit {
  
  subCategoryForm: any = FormGroup;
  isLoad: boolean = false;
  isShowLoad: boolean = false;
  isNoRecord: boolean = false;
  subCategoryList: any = [];
  subCategorySno: any;
  isDelete: boolean = false;
  selectedIndex: any;
  categoryList: any = [];
  subCategoryActiveCount:number = 0;

  constructor(private api: ApiService, private toastService: ToastService){
    this.subCategoryForm = new FormGroup({
      subCategorySno: new FormControl(null),
      categorySno:new FormControl(null,Validators.required),
      subCategoryName: new FormControl(null, Validators.required),
      description:new FormControl(null,Validators.required),
      seqNo:new FormControl(null,Validators.required),
      status: new FormControl('true', Validators.required),
    });
  }

  ngOnInit() {
    this.getcategoryList();
    this.getSubCategoryList();
  }

  save() {
    this.isLoad = true;
    let body: any = this.subCategoryForm.value;
    this.api.post('8000/api/ascend/learnhub/v1/insert_sub_category', body).subscribe(result => {
      this.isLoad = false;
      console.log(result);
      if (result != null) {
        this.clear();
        this.getName(body.categorySno, (data:any) => {
          body.subCategorySno = result.data.subCategorySno;

          body.categoryName = data;
          body.status = (body.status == true || body.status == 'true')? true:false;
  
          this.subCategoryList.push(body);
          this.toastService.showSuccess('Saved Successfully')
        });
        
      }
      else {
        // this.toastService.showError('Category name is Already Exists')
      }
    }
      , err => {
        this.isLoad = false;
        this.isShowLoad = false;
        this.isNoRecord = true;
        this.toastService.showError(err)
      });
  }

  getName(id:any,callback:any){
   for(let i in this.categoryList){
      if(this.categoryList[i].categorySno == id){
            callback(this.categoryList[i].categoryName);
      }
   }
  }

  async getSubCategoryList() {
    this.isNoRecord = false;
    this.isShowLoad=true;
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_sub_categories", param).subscribe(result => {
      console.log(result);
      this.isShowLoad = false;
      if (result != null) {
        if (result.data != null && result.data.length > 0) {
          this.subCategoryList = result.data;

          this.subCategoryActiveCount = this.subCategoryList.filter((subCategory: { status: any; }) => subCategory.status).length;
        } else {
          this.isNoRecord = true;
        }
      }
      else {
        this.toastService.showError('Something went wrong');
      }
    }, err => {
      this.isShowLoad = false;
      this.isNoRecord = true;
      this.toastService.showError(err);
    });
  }

  update() {
    let body: any = this.subCategoryForm.value;
    console.log(body);
    this.isLoad = true;
    this.api.put("8000/api/ascend/learnhub/v1/update_sub_category", body).subscribe(
      (result: any) => {
        this.isLoad = false;
        if (result != null && !result?.data?.message) {
          this.clear();
          this.getName(body.categorySno, (data:any) => {
            body.subCategorySno = result.data.subCategorySno;
            body.categoryName =  data
          });
          this.subCategoryList[this.selectedIndex].subCategorySno = body.subCategorySno;
          this.subCategoryList[this.selectedIndex].categorySno = body.categorySno;
          this.subCategoryList[this.selectedIndex].categoryName = body.categoryName;
          this.subCategoryList[this.selectedIndex].description = body.description;
          this.subCategoryList[this.selectedIndex].seqNo = body.seqNo;
          this.subCategoryList[this.selectedIndex].subCategoryName = body.subCategoryName;
          this.subCategoryList[this.selectedIndex].status = (body.status == true || body.status == 'true')? true:false ;
          this.getcategoryList();
          this.toastService.showSuccess('Updated Successfully');
        } else {
          this.toastService.showError(result?.data?.message);
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  deleteAlert(i: any) {
    Swal
    .fire({
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
      subCategorySno: this.subCategoryList[i].subCategorySno,
    };
    this.api.delete("8000/api/ascend/learnhub/v1/delete_sub_category", body).subscribe(
      (result: any) => {
        console.log(result)
        if (result != null) {
          this.subCategoryList.splice(i, 1);
          this.toastService.showSuccess("Deleted Successfully");
        } else{
          this.toastService.showError("Can't delete,Sub Category Name is already mapped");
        }
        this.isNoRecord = true;

      },
      (err) => {
        this.isShowLoad = false;
        this.isNoRecord = true;
        this.isLoad = false;
        this.toastService.showError(err);
      }
    );
  }

  clear() {
    this.subCategoryForm.reset();
  }

  edit(i: any) {
    this.selectedIndex = i;
    let obj = Object.assign({},this.subCategoryList[i]);
    delete obj.categoryName;
    alert(JSON.stringify(obj))
    this.subCategoryForm.setValue(obj);
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
}
