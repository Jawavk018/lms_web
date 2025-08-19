import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
import { FileUploadService } from 'src/app/providers/socket/socket.service';
import { PhotoService } from 'src/app/providers/photoservice/photoservice.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';
import { Router } from '@angular/router';
import { EdumanModule } from '../eduman.module';
declare var $: any;

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent {
  profileForm: any = FormGroup;
  profileList: any = [];
  genderList: any = [];
  languageList: any = [];
  isLoad: boolean = false;
  mediArr: any = [];
  // media: any;
  files: any = [];
  mediaSno: any;
  deletemediaList: any = [];
  profileUrl: any;
  profile: any;
  isShowLoad: boolean = false;
  profileImage: any;
  profileImgUrl: any;
  deleteMediaList: any = [];
  upload = { image: null, video: null };
  @ViewChild('images') images: ElementRef | any;
  @ViewChild('myInputVariable') myInputVariable: ElementRef | any;

  mediaUrl: string = ''

  appUser: any = this.storage.getUser();

  subCategoryList: any[] = [];
  settings: any = {
    singleSelection: false,
    idField: "subCategorySno",
    textField: "subCategoryName",
    enableCheckAll: true,
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: "Search preferences",
    noDataAvailablePlaceholderText: "No Data Found",
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toastService: ToastService,
    private photoService: PhotoService,
    private fileUploadService: FileUploadService,
    private storage: TokenStorageService
  ) {
    this.profileForm = new FormGroup({
      profileSno: new FormControl(null),
      appUserSno: new FormControl(null),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      genderCd: new FormControl(null),
      mobile: new FormControl(),
      dob: new FormControl(null),
      media: new FormControl(null),
      specialization: new FormControl(null),
      profileImageSno: new FormControl(null),
      languageCd: new FormControl(null),
      count: new FormControl(null),
      alternateMobileNumber: new FormControl(null),
      isPartner: new FormControl(null),
      about: new FormControl(null),
      preferences:new FormControl(null), // Initialize as an empty array
      socialLinks: this.fb.group({
        website: [null],
        twitter: [null],
        facebook: [null],
        linkedIn: [null],
        youtube: [null],
      }),
    });
  }

  ngOnInit() {
    this.getProfile();
    this.getEnumGender();
    this.getEnumLanguage();
    this.profileForm.patchValue({
      appUserSno: this.appUser.appUserSno,
      firstName: this.appUser.firstName,
      lastName: this.appUser.lastName
    });
    this.getSubCategoryList();
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

  getEnumGender() {
    let param: any = { codeType: 'gender_cd' };
    this.api.get('8000/api/ascend/learnhub/v1/get_enum', param).subscribe((result) => {
      if (result != null && result.data) {
        this.genderList = result.data;
      }
    });
  }

  getEnumLanguage() {
    let param: any = { codeType: 'language_type_cd' };
    this.api.get('8000/api/ascend/learnhub/v1/get_enum', param).subscribe((result) => {
      if (result != null && result.data) {
        this.languageList = result.data;
      }
    });
  }

  // onFileChange(event: any, type: any, fileFormat: any) {
  //   // const files: FileList = event.files;
  //   // this.files = files;
  //   this.files = [];
  //   this.files.push(...event.files);
  //   console.log(this.files);
  //   this.photoService.onFileChange(event, fileFormat, type, (result: any) => {
  //     if (result != null && result != undefined) {
  //       result[0].isUploaded = null;
  //       result[0].mediaSize = null;
  //       result[0].azureId = result[0].fileType;
  //       if (this.profileForm.value.media?.mediaDetailSno) {
  //         this.mediaSno = this.profileForm.value.media?.mediaSno;
  //         this.deletemediaList.push({
  //           mediaDetailSno: this.profileForm.value.media.mediaDetailSno,
  //         });
  //       }
  //       this.profileForm.patchValue({
  //         media: result[0],
  //       });

  //       // this.media = result[0];
  //       // this.myInputVariable.nativeElement.value = "";
  //     }
  //   });
  // }

  getProfile() {
    let params: any = {};
    params.appUserSno = this.appUser?.appUserSno;
    this.api.get('8000/api/ascend/learnhub/v1/get_profile', params).subscribe((result) => {
      console.log(result)
      if (result != null) {
        if (result?.data != null && result.data.length > 0) {
          this.profile = result.data[0];
          console.log("profile");
          console.log(this.profile);
          // this.storage.saveUser(this.profile);
          // alert(JSON.stringify(this.profile));
          delete this.profile.genderCdValue;
          delete this.profile.languageCdValue;
          if (!this.profile.socialLinks) {
            this.profile.socialLinks = {
              website: null,
              twitter: null,
              facebook: null,
              linkedIn: null,
              youtube: null,
            }
          }
          this.profileForm.setValue(this.profile);       

        } else {
        }
      } else {
        this.toastService.showError('Something went wrong');
      }
    });
  }

  clear() {
    this.profileForm.reset();
  }

  update() {
    this.isLoad = true;
    let body: any = this.profileForm.value;
    if(body?.preferences != null){
       let preference: any = [];
      for (let data of body?.preferences) {
        preference.push(data?.subCategorySno);
      }
      body.preferences = `{${preference}}`;
    }
    console.log(this.files);
    this.fileUploadService.send(this.files, (result1: any) => {
      console.log(result1);
      var mediaUrl: any;
      if (result1 && result1.length > 0) {
        if (this.profileForm.value.media) {
          mediaUrl = result1[0]?.mediaUrl
          let mediaObj1: any = {
            mediaSno: this.profileForm.value.profileImageSno || this.mediaSno || null,
            containerName: 'Profile',
            mediaList: [],
            deleteMediaList: [],
          };
          if (this.deleteMediaList) {
            mediaObj1.deleteMediaList = this.deleteMediaList;
          }
          mediaObj1.mediaList.push(result1[0]);
          body.media = mediaObj1
        } else {
          delete body.media;
        }
      }
      delete body.profileImageSno;
      console.log(body);
      // this.api.put('8000/api/ascend/learnhub/v1/update_profile_details', body).subscribe((result: any) => {
      //   console.log("profile result");
      //   console.log(result);
      //   this.isLoad = false;
      //   if (result != null) {
      //     // alert(mediaUrl)
      //     if (mediaUrl) {
      //       // alert(mediaUrl)
      //       this.appUser.profileImage = mediaUrl;
      //     }
      //     this.appUser.firstName = body.firstName;
      //     this.appUser.firstName = body.firstName;
      //     this.appUser.lastName = body.lastName;
      //     if (this.appUser.selectedRole == 'Learner') {
      //       this.getProfile();
      //       this.storage.saveUser(this.appUser);
      //       this.router.navigate(['/']);
      //     }
      //     else if (this.appUser.selectedRole == 'Trainer') {
      //       this.storage.saveUser(this.appUser);
      //       this.getProfile();

      //       this.router.navigate(['/instructorPage']);
      //     }
      //     // this.router.navigate(['/instructorPage'], { replaceUrl: true });
      //     this.toastService.showSuccess("Profile Updated Successfully");
      //   }
      //   else {
      //     this.toastService.showError("Something went wrong");
      //   }
      // });

    });
  }

  uploadProfileImg() {
    let element: HTMLElement = document.querySelector(
      'input[name="profileImg"]'
    ) as HTMLElement;
    element.click();
  }

  selectProfileImage(type: String) {
    if (type == 'profileImage') {
      $('#selectProfileImage').click();
    }
  }

  removeFile(type: any): void {
    if (type == 'profileImage') {
      this.profileImage = 'null';
    }
  }

  changeProfileImg(e: any, fileFormat: any, type: any) {
    this.files = [];
    // this.upload.image = structuredClone(e.files[0]);
    this.files.push(e.files[0]);
    console.log(this.files);
    this.photoService.onFileChange(e, fileFormat, type, (result: any) => {
      // if (type == 'profile') {
      if (result != null) {
        console.log(this.profileForm?.value)
        // this.profileImgUrl = result[0].mediaUrl;
        if (this.profileForm?.value.media?.mediaSno) {
          this.mediaSno = this.profileForm.value.profileImageSno;

          this.deleteMediaList.push({
            mediaDetailSno: this.profileForm?.value.media.mediaDetailSno,
          });
        }
        console.log(this.profileForm?.value)
        result[0].isUploaded = null;
        result[0].mediaSize = null;
        result[0].azureId = result[0].fileType;

        this.profileForm?.patchValue({
          'media': result[0]
        });
        // this.profileImage = result[0];
        // console.log(this.profileForm.value);
        this.images.nativeElement.value = '';
      }
      // }
    });
  }
}
