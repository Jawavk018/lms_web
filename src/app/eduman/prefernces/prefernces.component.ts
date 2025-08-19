import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
import { FormsModule } from '@angular/forms';
import { TokenStorageService } from 'src/app/providers/token-storage.service';

@Component({
  selector: 'app-prefernces',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './prefernces.component.html',
  styleUrls: ['./prefernces.component.scss']
})
export class PreferncesComponent  {

  subCategoryList: any[] = [];
  anySelected:boolean = false;
  @ViewChild("closepreference") closePreference: ElementRef | any;
  @ViewChild("mymodal") myModal: ElementRef | any;

  appUser: any = this.tokenStorage.getUser();


  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private tokenStorage:TokenStorageService
  ) {
  }

  ngOnInit() {
  if(!this.appUser?.preferences &&  this.appUser?.selectedRole == "Learner" && !this.appUser?.isPopFirstTime){
    this.getSubCategoryList();
  }
}

  getSubCategoryList() {
    let param: any = {};
    // console.log(this.courseForm.value);
    // param.categorySno = this.courseForm.value.basicInfo?.categorySno;
    this.api.get("8000/api/ascend/learnhub/v1/get_sub_categories", param).subscribe(
      (result) => {
        if (result != null) {
          if (result.data != null) {
            this.subCategoryList = result?.data ?? [];
            this.myModal.nativeElement.click();
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

  update(){
    let body: any = {};
    const selectedIds = this.subCategoryList.filter(preference => preference.selected).map(preference => preference.subCategorySno);
    console.log(selectedIds);
    if(selectedIds.length){
        body.preferences = `{ ${selectedIds} }`;
    }
    body.profileSno = this.appUser?.profileSno;
    console.log(body);
    this.api.put('8000/api/ascend/learnhub/v1/update_preference', body).subscribe((result:any) => {
      console.log(result);
      if (result != null && result?.data) {
        this.toastService.showSuccess('Thanks For Choosing Your Prefered Course')
        this.closePreference.nativeElement.click();
        this.appUser.preferences = true;
        this.tokenStorage.saveUser(this.appUser);
     }
     else {
        this.toastService.showError('Something went wrong...')
      }
    }, err => {
        this.toastService.showError(err)
    });
  }

  toggleSelection(preference: any) {
    preference.selected = !preference.selected;
    this.anySelected = this.subCategoryList.some(preference => preference.selected);
  }

  closePreferenceModal(){
    this.appUser.isPopFirstTime = true;
    this.tokenStorage.saveUser(this.appUser);
    this.closePreference.nativeElement.click();

  }
}
