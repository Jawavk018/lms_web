import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { CommonHeaderComponent } from "src/app/eduman/common-header/common-header.component";
import { CourseCreateComponent } from "../course-create/course-create.component";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiService } from "src/app/providers/api/api.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { FileUploadService } from "src/app/providers/socket/socket.service";
import { Router } from "@angular/router";
import { ToastService } from "src/app/providers/toast/toast.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-course-content",
  standalone: true,
  imports: [CommonModule, CommonHeaderComponent, CourseCreateComponent],
  templateUrl: "./add-course-content.component.html",
  styleUrls: ["./add-course-content.component.scss"],
})
export class AddCourseContentComponent {
  languageList: any = [];
  selectedLanguage: any = "English";
  appUser: any = this.storage.getUser();
  isLoad: boolean = false;
  data: any;
  sentedCount: number = 0;
  totalCount: number = 0;
  isLast: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private storage: TokenStorageService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private toastService: ToastService
  ) {}

  successAlert() {
    Swal.fire({
      title: "Course Created",
      text: "Your course has been created successfully.",
      icon: "success",
    }).then(() => {
      this.router.navigate(["/instructorPage"], { replaceUrl: true });
    });
  }

  ngOnInit() {
    this.data = window.history.state;
    console.log(this.data);
    for (let i in this.data.code) {
      this.languageList.push({
        code: this.capitalizeFirstLetter(this.data.code[i].code),
        form: this.form(
          this.capitalizeFirstLetter(this.data.code[i].code),
          this.data.code[i]?.isDefaultLanguage
        ),
      });
      console.log(this.data.code[i]?.isDefaultLanguage);
    }
    if (this.data?.code?.length) {
      this.selectedLanguage = this.data.code[0].code;
    }
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  form(code: any, isDefaultLanguage: boolean) {
    return this.fb.group({
      courseSno: new FormControl(null),
      intendedLearnerForm: this.fb.group({
        courseIntendedSno: new FormControl(null),
        studentsLearn: new FormArray([]),
        requirements: new FormArray([]),
        courseFor: new FormArray([]),
      }),
      curriculum: new FormArray([]),
      courseForm: new FormGroup({
        title: new FormControl(
          this.data?.courseTitle ?? "",
          Validators.required
        ),
        subtitle: new FormControl("", Validators.required),
        description: new FormControl("", Validators.required),
        basicInfo: new FormGroup({
          languageTypeCd: new FormControl("", Validators.required),
          expLevelTypeCd: new FormControl("", Validators.required),
          categorySno: new FormControl("", Validators.required),
          subCategorySno: new FormControl("", Validators.required),
          topicsSno: new FormControl("", Validators.required),
        }),
      }),
      priceForm: new FormGroup({
        currencySno: new FormControl(null, Validators.required),
        price: new FormControl(null, Validators.pattern("^[0-9]*$")),
      }),
      msgForm: new FormGroup({
        welcomeMsg: new FormControl("", Validators.required),
        congratulationsMsg: new FormControl("", Validators.required),
      }),
      isDefault: new FormControl(isDefaultLanguage),
    });
  }

  setCourse(event: any, i: any) {
    this.isLast = event?.isLast;
    if (this.languageList?.length != i + 1) {
      this.selectLanguage(i + 1);
    }
  }

  setCourseMedia(event: any, i: any) {
    this.languageList[i].media = event;
  }

  selectLanguage(i: number) {
    this.selectedLanguage = this.languageList[i]?.code;
  }

  getValidCourseForm() {
    return (
      !this.languageList.every((item: any) => this.getFrom(item.form).valid) ||
      this.isLoad
    );
  }

  getFrom(item: any) {
    return item as FormGroup;
  }

  createCourse() {
    this.isLoad = true;
    this.uploadCourse(this.languageList, 0);
  }

  uploadCourse(courseList: any, index: number) {
    let course = courseList[index]?.form as FormGroup;
    let body: any = {};
    body = course.value;
    body.media = courseList[index].media;
    console.log(body);
    for (let i in body.curriculum) {
      for (let j in body.curriculum[i].curriculumItem) {
        if (body.curriculum[i].curriculumItem[j].editorInstance) {
          delete body.curriculum[i].curriculumItem[j].editorInstance;
        }
      }
    }
    let files = [];
    if (body?.media?.fileImage) {
      files.push(body?.media?.fileImage);
    }
    if (body?.media?.fileVideo) {
      files.push(body?.media?.fileVideo);
    }
    if (body?.media?.fileDocument) {
      files.push(body?.media?.fileDocument);
    }

    console.log(body);
    if(!body.priceForm?.price || body.priceForm?.price == null){
      body.priceForm.price = 0;
    }
    this.fileUploadService.send(files, (result: any) => {
      let mediaList: any = [];
      if (result && result.length > 0) {
        if (body?.media?.fileImage) {
          let mediaObj1: any = {
            containerName: "courseImage",
            mediaList: [],
            deleteMediaList: [],
          };
          mediaObj1.mediaList.push(result[0]);
          mediaList.push(mediaObj1);
        }
        if (body?.media?.fileVideo) {
          let mediaObj2: any = {
            containerName: "courseVideo",
            mediaList: [],
            deleteMediaList: [],
          };
          mediaObj2.mediaList.push(result[1]);
          mediaList.push(mediaObj2);
        }
        if (body?.media?.fileDocument) {
          let mediaObj3: any = {
            containerName: "courseFile",
            mediaList: [],
            deleteMediaList: [],
          };
          mediaObj3.mediaList.push(result[2]);
          mediaList.push(mediaObj3);
        }
      }

      let topics: any = [];
      for (let topic of body?.courseForm?.basicInfo?.topicsSno) {
        topics.push(topic?.topicSno);
      }
      body.courseForm.basicInfo.topicsSno = `{${topics}}`;
      body.appUserSno = this.appUser?.appUserSno;
      console.log(body);
      if (courseList?.length == index + 1) {
        this.totalCount = 0;
        this.sentedCount = 0;
        this.uploadCurriculum(body?.curriculum, index);
        let interval = setInterval(() => {
          if (this.totalCount == this.sentedCount) {
            clearInterval(interval);
            for (let i in body?.curriculum) {
              for (let j in body?.curriculum[i]?.curriculumItem) {
                if (body?.curriculum[i]?.curriculumItem[j]?.video) {
                  let mediaObj3: any = {
                    containerName: `${i}-${j}-video`,
                    mediaList: [],
                    deleteMediaList: [],
                  };
                  mediaObj3.mediaList.push(
                    body?.curriculum[i]?.curriculumItem[j]?.video
                  );
                  mediaList.push(mediaObj3);
                }
                if (body?.curriculum[i]?.curriculumItem[j]?.resources) {
                  let mediaObj3: any = {
                    containerName: `${i}-${j}-resources`,
                    mediaList: [],
                    deleteMediaList: [],
                  };
                  mediaObj3.mediaList.push(
                    body?.curriculum[i]?.curriculumItem[j]?.resources
                  );
                  mediaList.push(mediaObj3);
                }
              }
            }

            if (mediaList.length > 0) {
              body.media = {
                mediaList: mediaList,
              };
            }
            courseList[index].body = body;
            let data: any = [];
            for (let i in courseList) {
              data.push(courseList[i].body);
            }
            this.upload(data);
          }
        }, 1000);
      } else {
        this.totalCount = 0;
        this.sentedCount = 0;
        this.uploadCurriculum(body?.curriculum, index);
        let interval = setInterval(() => {
          if (this.totalCount == this.sentedCount) {
            clearInterval(interval);
            for (let i in body?.curriculum) {
              for (let j in body?.curriculum[i]?.curriculumItem) {
                if (body?.curriculum[i]?.curriculumItem[j]?.video) {
                  let mediaObj3: any = {
                    containerName: `${i}-${j}-video`,
                    mediaList: [],
                    deleteMediaList: [],
                  };
                  mediaObj3.mediaList.push(
                    body?.curriculum[i]?.curriculumItem[j]?.video
                  );
                  mediaList.push(mediaObj3);
                }
                if (body?.curriculum[i]?.curriculumItem[j]?.resources) {
                  let mediaObj3: any = {
                    containerName: `${i}-${j}-resources`,
                    mediaList: [],
                    deleteMediaList: [],
                  };
                  mediaObj3.mediaList.push(
                    body?.curriculum[i]?.curriculumItem[j]?.resources
                  );
                  mediaList.push(mediaObj3);
                }
              }
            }

            if (mediaList.length > 0) {
              body.media = {
                mediaList: mediaList,
              };
            }
            courseList[index].body = body;
            this.uploadCourse(courseList, index + 1);
          }
        }, 1000);
      }
    });
  }

  upload(data: any) {
    let body: any = {};
    body.courseList = JSON.stringify(data);
    body.title = this.data?.courseTitle;
    if (this.data?.entityUsersSno) {
      body.entityUsersSno = this.data?.entityUsersSno;
    }
    this.api.post("8000/api/ascend/learnhub/v1/insert_course", body).subscribe(
      (result) => {
        this.isLoad = false;
        if (result != null && result.data != null) {
          this.successAlert();
          // this.toastService.showSuccess("Successfully created");
        }
      },
      (err) => {
        this.isLoad = false;
        this.toastService.showError(err);
      }
    );
  }

  async uploadCurriculum(curriculum: any, i: number) {
    this.uploadCurriculumItem(curriculum, curriculum[i]?.curriculumItem, i, 0);
  }

  async uploadCurriculumItem(
    curriculum: any,
    curriculumItem: any,
    i: number,
    j: number
  ) {
    let files: any = [];
    if (curriculumItem[j]?.video) {
      files.push(curriculumItem[j]?.video);
    }
    if (curriculumItem[j]?.resources) {
      files.push(curriculumItem[j]?.resources);
    }
    if (files?.length) {
      ++this.totalCount;
      this.fileUploadService.send(files, (result: any) => {
        ++this.sentedCount;
        if (curriculumItem[j]?.video) {
          console.log(curriculumItem[j]?.video);
          this.getVideoDuration(curriculumItem[j]?.video, (result1: any) => {
            result[0].duration = result1;
            curriculumItem[j].video = result[0];
          });
        }
        if (curriculumItem[j]?.resources) {
          curriculumItem[j].resources = result[files?.length == 2 ? 1 : 0];
        }

        if (curriculumItem?.length - 1 == j) {
          this.uploadCurriculum(curriculum, i + 1);
        } else {
          this.uploadCurriculumItem(curriculum, curriculumItem, i, j + 1);
        }
      });
    } else {
      if (curriculumItem?.length - 1 == j) {
        this.uploadCurriculum(curriculum, i + 1);
      } else {
        this.uploadCurriculumItem(curriculum, curriculumItem, i, j + 1);
      }
    }
  }

  getVideoDuration(file: any, callback: any) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      var duration = this.formatDuration(video.duration);
      console.log("Video duration:", duration);
      callback(duration);
    };
  }

  formatDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    const formattedHours = hours > 0 ? `${hours}:` : ""; // Include hours only if they are greater than 0
    const formattedMinutes = `${minutes.toString().padStart(2, "0")}`;
    const formattedSeconds = `${seconds.toString().padStart(2, "0")}`;
    // alert(`${formattedHours}${formattedMinutes}:${formattedSeconds}`)
    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  }
}
