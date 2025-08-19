import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Editor, NgxEditorModule } from "ngx-editor";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Subscription } from "rxjs";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { PhotoService } from "src/app/providers/photoservice/photoservice.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { NavigationStart, Router } from "@angular/router";
import { ConfirmedValidator } from "src/app/providers/validators/validators";
import { MatCheckboxModule } from "@angular/material/checkbox";

declare var $: any;

@Component({
  selector: "app-course-create",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEditorModule,
    NgMultiSelectDropDownModule,MatCheckboxModule
  ],
  templateUrl: "./course-create.component.html",
  styleUrls: ["./course-create.component.scss"],
})
export class CourseCreateComponent {
  // form: FormGroup;

  inputLength!: number;
  isNewInput: boolean[] = [];
  languageList: any = [];
  expLevelTypeList: any = [];
  categoryList: any = [];
  subCategoryList: any = [];
  topicsList: any = [];
  courseImgUrl: any;
  courseFileUrl: any;
  courseVideoUrl: any;
  courseImage: any;
  courseVideo: any;
  courseFile: any;

  files: any = [];
  deleteMediaList: any = [];
  currencyList: any = [];

  editor: Editor = new Editor();
  editorTwo: Editor = new Editor();
  editorThree: Editor = new Editor();
  editorFour: Editor = new Editor();

  html = "";
  welcomeMessage: string = "";
  upload = { image: null, video: null, file: null };

  @ViewChild("images") images: ElementRef | any;
  @ViewChild("videos") videos: ElementRef | any;
  @ViewChild("pdf") pdf: ElementRef | any;

  private routerSubscription: any = Subscription;

  showIntro: boolean = false;
  extensionVisible: boolean = false;
  lectureDescrip: boolean = false;
  showArticle: boolean = false;

  sentedCount: number = 0;
  totalCount: number = 0;

  editors: { id: number; instance: Editor }[] = [];
  htmls: string[] = [];
  nextId = 0;

  editorObjects: any = [];

  settings: any = {
    singleSelection: false,
    idField: "topicSno",
    textField: "topicName",
    enableCheckAll: true,
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: "Search topic",
    noDataAvailablePlaceholderText: "No Data Found",
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
  };
  appUser: any = this.storage.getUser();
  isCurriculum: boolean = false;

  @Output() courseForms = new EventEmitter();
  @Output() courseMedia = new EventEmitter();

  @Input() form!: FormGroup;
  @Input() media!: any;
  @Input() isLast!: boolean;
  @Input() disabled!: boolean;
  @Input() isLoading!: boolean;

  navigationConfirmed: boolean = false;

  @HostListener("window:beforeunload")
  unloadNotification() {
    // Cancel navigation if user confirms the warning
    if (!this.navigationConfirmed) {
      return false;
    }
    return true;
  }

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private photoService: PhotoService,
    private fb: FormBuilder,
    private storage: TokenStorageService,
    private router: Router
  ) {}

  subscribeToRouterEvents() {
    // this.routerSubscription = this.router.events.subscribe((event: any) => {
    //   if (event instanceof NavigationStart && !this.navigationConfirmed) {
    //     window.onbeforeunload = () => true;
    //     const confirmNavigation = window.confirm(
    //       "Are you sure you want to leave?"
    //     );
    //     if (confirmNavigation) {
    //       this.confirmNavigation();
    //     } else {
    //       this.navigationConfirmed = true;
    //     }
    //   }
    // });
  }
  
  confirmNavigation() {
    this.navigationConfirmed = true;
    window.onbeforeunload = null;
  }

  ngOnInit(): void {
    this.subscribeToRouterEvents();
    this.isCurriculum = false;
    $(document).ready(() => {
      $(`#intended-learners`).addClass("actives");
      const subCategory: any = document.getElementById("subCategory");
      subCategory.addEventListener("change", (event: any) => {
        this.getTopics();
      });
    });
    this.getEnumExpLevel();
    this.getcategoryList();
    this.getEnumLanguage();
    this.getCurrencyList();
    if (!this.getLearnerDetails().value?.length) {
      for (let i = 0; i < 4; i++) {
        const control = this.intendedLearnerForm.get(
          "studentsLearn"
        ) as FormArray;
        control.push(this.createRequirementsDetails());
      }
      this.addRequirementsInfo();
      this.addCourseForInfo();
      this.curriculum.push(
        this.createCurriculumDetails({
          section: "Introduction",
          endOfSection: "",
        })
      );
      this.getCurriculumItem(this.curriculum.length - 1).push(
        this.createeCurriculumItem({
          lecture: "Introduction",
        })
      );
    }
    if (this.media) {
      this.courseFile = this.media?.courseFile;
      this.courseImage = this.media?.courseImage;
      this.courseVideo = this.media?.courseVideo;
      this.courseFileUrl = this.courseFile?.mediaUrl;
      this.courseImgUrl = this.courseImage?.mediaUrl;
      this.courseVideoUrl = this.courseVideo?.mediaUrl;
      this.upload.image = this.media?.fileImage;
      this.upload.video = this.media?.fileVideo;
      this.upload.file = this.media?.fileDocument;
    }
    // this.addCurriculum();'
  }

  ngOnDestroy(): void {
    this.editors?.forEach((editor) => editor?.instance?.destroy());
    this.editorTwo?.destroy();
    // if (this.routerSubscription) {
    //   this.routerSubscription?.unsubscribe();
    // }
  }

  get intendedLearnerForm(): FormGroup {
    return this.form.get("intendedLearnerForm") as FormGroup;
  }

  get courseForm(): FormGroup {
    return this.form.get("courseForm") as FormGroup;
  }

  get msgForm(): FormGroup {
    return this.form.get("msgForm") as FormGroup;
  }

  get priceForm(): FormGroup {
    return this.form.get("priceForm") as FormGroup;
  }

  get curriculum(): FormArray {
    return this.form.get("curriculum") as FormArray;
  }

  getLearnerDetails(): FormArray {
    return this.intendedLearnerForm.controls["studentsLearn"] as FormArray;
  }

  getRequirementsDetails(): FormArray {
    return this.intendedLearnerForm.controls["requirements"] as FormArray;
  }

  getCourseForDetails(): FormArray {
    return this.intendedLearnerForm.controls["courseFor"] as FormArray;
  }

  getCurriculumItem(index: number): FormArray {
    return this.curriculum.at(index).get("curriculumItem") as FormArray;
  }

  addCurriculum() {
    this.curriculum.push(this.createCurriculumDetails());
    this.showSectionTab(this.curriculum.length - 1);
    this.getCurriculumItem(this.curriculum.length - 1).push(
      this.createeCurriculumItem()
    );
    this.showCurriculumTab(
      this.curriculum.length - 1,
      this.getCurriculumItem(this.curriculum.length - 1).length - 1
    );
    // this.editorObject();
  }

  addCurriculumItem(i: number) {
    const newCurriculumItem = this.createeCurriculumItem();
    this.getCurriculumItem(i).push(newCurriculumItem);

    this.showCurriculumTab(i, this.getCurriculumItem(i).length - 1);
    // this.editorObject(i);
  }

  editorObject(index: any) {
    const curriculumItems = this.getCurriculumItem(index).controls;
    for (let j = 0; j < curriculumItems.length; j++) {
      this.editorObjects[j] = {
        id: "editor" + j /* any other properties needed by ngx-editor */,
      };
    }
  }

  createCurriculumDetails(data?: any): FormGroup {
    return this.fb.group({
      section: [data?.section ?? "", [Validators.required]],
      endOfSection: [data?.endOfSection ?? "", [Validators.nullValidator]],
      curriculumItem: new FormArray([]),
      isEdit: [false],
    });
  }

  createeCurriculumItem(data?: any): FormGroup {
    return this.fb.group(
      {
        lecture: [data?.lecture ?? "", [Validators.required]],
        description: [data?.description ?? "", [Validators.nullValidator]],
        video: [data?.video, [Validators.required]],
        articale: [data?.articale ?? "", [Validators.required]],
        resources: [data?.resources, [Validators.nullValidator]],
        isEdit: [false],
        isShowContent: [false],
        isShowArticale: [false],
        editorInstance: new Editor(),
        isForFree: [data?.isForFree ?? false]
      },
      {
        validator: ConfirmedValidator("video", "articale"),
      }
    );
  }

  addLearnersInfo() {
    if (this.getLearnerDetails().valid) {
      const control = this.intendedLearnerForm.get(
        "studentsLearn"
      ) as FormArray;
      control.push(this.createRequirementsDetails());
    } else {
      // msg -- please fill all field after add new learn
    }
  }

  addRequirementsInfo() {
    if (this.getRequirementsDetails().valid) {
      const control = this.intendedLearnerForm.get("requirements") as FormArray;
      control.push(this.createLearnDetails());
    } else {
      // msg -- please fill all field after add new learn
    }
  }

  addCourseForInfo() {
    if (this.getCourseForDetails().valid) {
      const control = this.intendedLearnerForm.get("courseFor") as FormArray;
      control.push(this.createCourseForDetails());
    } else {
      // msg -- please fill all field after add new learn
    }
  }

  createRequirementsDetails(): FormGroup {
    return this.fb.group({
      learn: [null, [Validators.required]],
    });
  }

  createLearnDetails(): FormGroup {
    return this.fb.group({
      prerequisites: ["", Validators.required],
    });
  }

  createCourseForDetails(): FormGroup {
    return this.fb.group({
      courseFor: ["", Validators.required],
    });
  }

  changePhoto1Img(e: any, fileFormat: any, type: any) {
    console.log(e.files);
    this.upload.image = structuredClone(e.files[0]);
    console.log(this.upload.image);
    this.photoService.onFileChange(e, fileFormat, type, (result: any) => {
      if (type == "courseImage") {
        if (result != null) {
          this.courseImgUrl = result[0].mediaUrl;
          if (this.courseImage?.mediaSno) {
            this.deleteMediaList.push({
              mediaDetailSno: this.courseImage?.mediaDetailSno,
            });
          }
          this.courseImage = result[0];
          this.courseMedia.emit({
            courseImage: this.courseImage,
            courseVideo: this.courseVideo,
            courseFile: this.courseFile,
            fileImage: this.upload.image,
            fileVideo: this.upload.video,
            fileDocument: this.upload.file,
          });
          console.log(this.courseImage);
          this.images.nativeElement.value = "";
        }
      }
    });
  }

  changeVideo(e: any, fileFormat: any, type: any) {
    this.upload.video = structuredClone(e.files[0]);
    console.log(e.files[0]);
    // this.getVideoDuration(e.files[0]);
    this.photoService.onFileChange(e, fileFormat, type, (result: any) => {
      if (type == "courseVideo") {
        if (result != null) {
          this.courseVideoUrl = result[0].mediaUrl;
          if (this.courseVideo?.mediaSno) {
            this.deleteMediaList.push({
              mediaDetailSno: this.courseVideo?.mediaDetailSno,
            });
          }
          this.courseVideo = result[0];
          this.courseMedia.emit({
            courseImage: this.courseImage,
            courseVideo: this.courseVideo,
            courseFile: this.courseFile,
            fileImage: this.upload.image,
            fileVideo: this.upload.video,
            fileDocument: this.upload.file,
          });
          console.log(this.courseVideo);
          this.videos.nativeElement.value = "";
        }
      }
    });
  }

  changeFile(e: any, fileFormat: any, type: any) {
    console.log(e.files);
    this.upload.file = structuredClone(e.files[0]);
    console.log(this.upload.file);
    this.photoService.onFileChange(e, fileFormat, type, (result: any) => {
      if (type == "courseFile") {
        console.log(result);
        if (result != null) {
          this.courseFileUrl = result[0].mediaUrl;
          if (this.courseFile?.mediaSno) {
            this.deleteMediaList.push({
              mediaDetailSno: this.courseFile?.mediaDetailSno,
            });
          }
          this.courseFile = result[0];
          this.courseMedia.emit({
            courseImage: this.courseImage,
            courseVideo: this.courseVideo,
            courseFile: this.courseFile,
            fileImage: this.upload.image,
            fileVideo: this.upload.video,
            fileDocument: this.upload.file,
          });
          console.log(this.courseFile);
          this.pdf.nativeElement.value = "";
        }
      }
    });
  }

  next(type: any) {
    this.isCurriculum = true;
    console.log(type);
    $(".nav-link").removeClass("actives");
    $(`#${type}`).addClass("actives");

    $(".tab-pane").removeClass("show active");
    var targetTabId = $(`#${type}`).data("bs-target");
    console.log(targetTabId);
    $(targetTabId).addClass("show active");
  }

  selectImage(type: String) {
    if (type == "courseImage") {
      $("#selectImage").click();
    }
  }

  selectVideo(type: String) {
    if (type == "courseVideo") {
      $("#selectVideo").click();
    }
  }

  selectFile(type: String) {
    if (type == "courseFile") {
      $("#selectFile").click();
    }
  }

  removeFile(type: any): void {
    if (type == "courseImage") {
      this.courseImage = "null";
    }
  }

  removeVideo(type: any): void {
    if (type == "courseVideo") {
      this.courseVideo = "null";
    }
  }

  removePdf(type: any): void {
    if (type == "courseFile") {
      this.courseFile = "null";
    }
  }

  getcategoryList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_categories", param).subscribe(
      (result) => {
        if (result != null) {
          this.categoryList = result?.data ?? [];
          if (this.categoryList?.length) {
            this.courseForm.get("basicInfo")?.patchValue({
              categorySno: this.categoryList[0]?.categorySno,
            });
            this.getSubCategoryList();
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

  getCurrencyList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_currency", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.currencyList = result.data;
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
    console.log(this.courseForm.value);
    param.categorySno = this.courseForm.value.basicInfo?.categorySno;
    this.api.get("8000/api/ascend/learnhub/v1/get_sub_categories", param).subscribe(
      (result) => {
        if (result != null) {
          if (result.data != null) {
            this.subCategoryList = result?.data ?? [];
            if (this.subCategoryList?.length) {
              this.courseForm.get("basicInfo")?.patchValue({
                subCategorySno: this.subCategoryList[0]?.subCategorySno,
              });
              this.getTopics();
            } else {
            }
          } else {
            this.subCategoryList = result?.data ?? [];
            this.courseForm.get("basicInfo")?.patchValue({
              subCategorySno: this.subCategoryList[0]?.subCategorySno,
            });
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

  getTopics() {
    let param: any = {};
    param.subCategorySno = this.courseForm.value.basicInfo?.subCategorySno;
    this.api.get("8000/api/ascend/learnhub/v1/get_topics", param).subscribe(
      (result) => {
        if (result != null) {
          this.topicsList = result?.data ?? [];
          // setTimeout(() => {
          //   new MultiSelectTag('topics', {
          //     placeholder: 'Select Topics',
          //     rounded: true,    // default true
          //     shadow: true,      // default false
          //     tagColor: {
          //       textColor: '#327b2c',
          //       borderColor: '#92e681',
          //       bgColor: '#eaffe6',
          //     },
          //     onChange: (values: any) => {
          //       let topicsSno = [];
          //       for (let i in values) {
          //         topicsSno.push(values[i]?.value);
          //       }
          //       this.courseForm.get('basicInfo')?.patchValue({
          //         topicsSno: topicsSno
          //       });
          //     }
          //   });
          // }, 1000);
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  getEnumExpLevel() {
    let param: any = { codeType: "exp_level_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.expLevelTypeList = result.data;
      }
    });
  }

  getEnumLanguage() {
    let param: any = { codeType: "language_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.languageList = result.data;
      }
    });
  }

  clear() {
    this.msgForm.reset();
  }

  showSectionTab(i: number) {
    console.log(this.curriculum.at(i).value);
    console.log(!this.curriculum.at(i).value.isEdit);
    this.curriculum.at(i).patchValue({
      isEdit: !this.curriculum.at(i).value.isEdit,
    });
  }

  showCurriculumTab(i: number, j: number) {
    console.log(this.getCurriculumItem(i).at(j).value);
    console.log(!this.getCurriculumItem(i).at(j).value.isEdit);
    this.getCurriculumItem(i)
      .at(j)
      .patchValue({
        isEdit: !this.getCurriculumItem(i).at(j).value.isEdit,
      });
  }

  showExtension() {}

  addArticle() {
    const newEditor = new Editor();
    this.editors.push({ id: this.nextId++, instance: newEditor });
    this.htmls.push("");
    this.showArticle = !this.showArticle;
  }

  removeCurriculum(i: number) {
    this.curriculum.removeAt(i);
  }

  addVideo(i: number, j: number) {
    const file = document.createElement("input");
    var fileInput = `lecture_${i}_${j}`
    file.setAttribute("type", "file");
    file.setAttribute("accept", ".mp4");
    file.setAttribute("id", fileInput);
    file.onchange = (event: any) => {
      const files: File = event.target.files[0];
      this.getCurriculumItem(i).at(j).patchValue({
        video: files,
      });
      console.log(this.getCurriculumItem(i).at(j).value.video);
      this.showContentType(i, j);
    };
    file.click();
  }

  addResource(i: number, j: number) {
    const file = document.createElement("input");
    file.setAttribute("type", "file");
    file.setAttribute("accept", ".pdf");
    file.onchange = (event: any) => {
      const files: File = event.target.files[0];
      this.getCurriculumItem(i).at(j).patchValue({
        resources: files,
      });
      console.log(this.getCurriculumItem(i).at(j).value.resources);
      this.showContentType(i, j);
    };
    file.click();
  }

  removeVideoLec(i: number, j: number) {
    this.getCurriculumItem(i).at(j).patchValue({
      video: null,
    });
  }

  removeArticale(i: number, j: number) {
    this.getCurriculumItem(i)
      .at(j)
      .patchValue({
        articale: null,
        isShowArticale: !this.getCurriculumItem(i).at(j).value.isShowArticale,
      });
  }

  removeResourceLec(i: number, j: number) {
    this.getCurriculumItem(i).at(j).patchValue({
      resources: null,
    });
  }

  removeLec(i: number, j: number) {
    this.getCurriculumItem(i).removeAt(j);
  }

  removeVideoArc(i: number, j: number) {
    this.getCurriculumItem(i)
      .at(j)
      .patchValue({
        articale: null,
        isShowArticale: !this.getCurriculumItem(i).at(j).value.isShowArticale,
      });
  }

  saveArticale(i: number, j: number) {
    this.getCurriculumItem(i)
      .at(j)
      .patchValue({
        isShowArticale: !this.getCurriculumItem(i).at(j).value.isShowArticale,
      });
  }

  trackById(index: number, editor: { id: number; instance: Editor }): any {
    return editor.id;
  }

  showArticale(i: number, j: number) {
    this.getCurriculumItem(i)
      .at(j)
      .patchValue({
        isShowArticale: !this.getCurriculumItem(i).at(j).value.isShowArticale,
      });
    console.log(!this.getCurriculumItem(i).at(j).value.isShowArticale);
    this.showContentType(i, j);
  }

  showContentType(i: number, j: number) {
    this.getCurriculumItem(i)
      .at(j)
      .patchValue({
        isShowContent: !this.getCurriculumItem(i).at(j).value.isShowContent,
      });
    console.log(this.getCurriculumItem(i).at(j).value.isShowContent);
  }

  save() {
    let body: any = this.form.value;
    body.isLast = this.isLast;
    this.courseForms.emit(body);
  }

  removeCourse(index: number): void {
    this.getCourseForDetails().removeAt(index);
  }

  removeRequirements(index: number): void {
    this.getRequirementsDetails().removeAt(index);
  }

  removeLearners(index: number): void {
    this.getLearnerDetails().removeAt(index);
  }

  getEditor(i: number, j: number) {
    return this.getCurriculumItem(i).at(j).get("editorInstance")?.value;
  }
}
