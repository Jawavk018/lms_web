import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Editor } from "ngx-editor";
import { ApiService } from "src/app/providers/api/api.service";
import { PhotoService } from "src/app/providers/photoservice/photoservice.service";
import { FileUploadService } from "src/app/providers/socket/socket.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-organization-header",
  templateUrl: "./organization-header.component.html",
  styleUrls: ["./organization-header.component.scss"],
})
export class OrganizationHeaderComponent {
  onboardInstructorSno: any;
  appUser: any = this.tokenStorage.getUser();
  trainerList: any = [];
  UserData: any = {
    roles: ["Anonymous User"],
  };
  sidebarInfoActive: boolean = false;
  isSticky: boolean = false;
  showContent: boolean = false;
  isLinear: boolean = false;
  files: any = [];
  @ViewChild("images") images: ElementRef | any;
  orgForm: FormGroup;
  isLoad: boolean = false;
  isRegister: boolean = false;
  editor: Editor = new Editor();
  // description = "";

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private api: ApiService,
    private photoService: PhotoService,
    private fileUploadService: FileUploadService
  ) {
    this.orgForm = new FormGroup({
      media: new FormControl(null, [Validators.required]),
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    // this.editor = new Editor();
    this.isLoad = false;
    this.isRegister = false;
    if(this.appUser?.selectedRole == 'Organization'){
      this.getRegisterStatus();
    }
 
  }

  ngOnDestroy(): void {
    // this.editor?.destroy();
  }

  SignIn() {
    this.router.navigate(["/signin"]);
  }

  SignUp() {
    this.router.navigate(["/signup"]);
  }

  infoclick() {
    this.sidebarInfoActive = !this.sidebarInfoActive;
  }

  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  }

  async LoggedOut() {
    Swal.fire({
      title: "Are you sure want to Logout?",
      text: "You will require to enter your credetials again to LOGIN!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffb013",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Logged Out! See you soon As We have new Courses lined up for your interests.",
          " ",
          "success"
        );
        this.logout();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled!", "Your record is safe", "error");
      }
    });
  }

  logout() {
    this.tokenStorage.removeStorage();
    this.router.navigate(["/signin"]);
    this.appUser = this.UserData;
    this.tokenStorage.saveUser(this.appUser);
  }

  goToHome() {
    this.router.navigate(["/organization"]);
  }

  toggleContent() {
    this.showContent = true; // Toggle the boolean value
  }

  updateOrg() {
    $("#selectOrgImage").click();
  }

  changeProfileImg(e: any, fileFormat: any, type: any) {
    this.files = [];
    this.files.push(e.files[0]);
    this.photoService.onFileChange(e, fileFormat, type, (result: any) => {
      if (result != null) {
        result[0].isUploaded = null;
        result[0].mediaSize = null;
        result[0].azureId = result[0].fileType;
        this.orgForm?.patchValue({
          media: result[0],
        });
        this.images.nativeElement.value = "";
      }
    });
  }

  registerOrg() {
    this.fileUploadService.send(this.files, (result1: any) => {
      let body = this.orgForm.value;
      if (result1 && result1.length > 0) {
        if (this.orgForm.value.media) {
          let mediaObj1: any = {
            mediaSno: null,
            containerName: "OrgImage",
            mediaList: [],
            deleteMediaList: [],
          };
          mediaObj1.mediaList.push(result1[0]);
          body.media = mediaObj1;
        } else {
          delete body.media;
        }
        body.appUserSno = this.appUser?.appUserSno;
        this.isLoad = true;
        this.api
          .post("8000/api/ascend/learnhub/v1/create_entity", body)
          .subscribe((result: any) => {
            this.isLoad = false;
            if (result != null) {
              if (result?.data?.entitySno) {
                this.appUser.organization = result?.data?.organization;
                this.tokenStorage.saveUser(this.appUser);
                window.location.reload();
              }
            }
          });
      }
    });
  }

  getRegisterStatus() {
    let params: any = {};
    params.appUserSno = this.appUser?.appUserSno;
    this.isRegister = true;
    this.api
      .get("8000/api/ascend/learnhub/v1/get_org_status", params)
      .subscribe((result: any) => {
        this.isRegister = false;
        this.isLoad = false;
        if (result != null) {
          if (result?.data?.length) {
            this.appUser.organization = result?.data[0];
            let appUser = this.tokenStorage.getUser();
            appUser.organization = result?.data[0];
            this.tokenStorage.saveUser(appUser);
          }
          if (this.appUser?.organization?.entityStatus != "Active") {
            $(document).ready(() => {
              $("#orgtrigger").click();
            });
          }
        }
      });
  }
}
