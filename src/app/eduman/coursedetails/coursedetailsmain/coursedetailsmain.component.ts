import { DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { formatDistance } from "date-fns";
import { ApiService } from "src/app/providers/api/api.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-coursedetailsmain",
  templateUrl: "./coursedetailsmain.component.html",
  styleUrls: ["./coursedetailsmain.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CoursedetailsmainComponent implements OnInit {
  writeReviewActive: boolean = false;
  courseSno: any;
  courseDetails: any;
  appUser: any = this.tokenStorage.getUser();
  selectedLanguageTypeCd: any;
  reviewList: any = [];
  @ViewChild("myTextarea") myTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild("editedTextarea") editedTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild("replyTextarea") replyTextarea!: ElementRef<HTMLTextAreaElement>;

  commentsList: any = [];
  isFinish: boolean = false;

  writeReview() {
    if (this.writeReviewActive == false) {
      this.writeReviewActive = true;
    } else {
      this.writeReviewActive = false;
    }
  }
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tokenStorage: TokenStorageService,
    public sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.courseSno = params["courseSno"];
        this.getCourseDetails();
      }
    });
  }

  getCourseDetails() {
    let params: any = {};
    params.courseSno = this.courseSno;
    if (this.appUser?.appUserSno) {
      params.appUserSno = this.appUser?.appUserSno;
    }
    if (this.selectedLanguageTypeCd) {
      params.languageTypeCd = this.selectedLanguageTypeCd;
      params.courseMasterSno = this.courseDetails?.courseMasterSno;
    }
    this.api
      .get("8000/api/ascend/learnhub/v1/get_courses_details", params)
      .subscribe((result) => {
        console.log("get_courses_details");
        console.log(JSON.stringify(result));
        console.log(result);
        if (result) {
          this.courseDetails = result?.data?.length ? result?.data[0] : null;
          if (this.selectedLanguageTypeCd) {
            console.log(this.courseDetails);
            let index: number = this.courseDetails.languageTypeList?.findIndex(
              (language: any) =>
                language?.languageTypeCd == this.selectedLanguageTypeCd
            );
            if (index != -1) {
              for (let j in this.courseDetails.languageTypeList) {
                this.courseDetails.languageTypeList[j].isDefault = false;
              }
              this.courseDetails.languageTypeList[index].isDefault = true;
            }
          }
          console.log(this.courseDetails);
          let lectureLength: number = 0;
          let totalVideoLength: number = 0;
          let totalArticaleLength: number = 0;
          let totalResourceLength: number = 0;

          for (let curriculum of this.courseDetails?.curriculum) {
            lectureLength = lectureLength + (curriculum?.lecture?.length ?? 0);
            for (let lecture of curriculum?.lecture) {
              totalVideoLength = totalVideoLength + (lecture?.videoSno ? 1 : 0);
              totalArticaleLength =
                totalArticaleLength + (lecture?.articale ? 1 : 0);
              totalResourceLength =
                totalResourceLength + (lecture?.resourcesSno ? 1 : 0);
            }
          }
          this.courseDetails.lectureLength = lectureLength ?? 0;
          this.courseDetails.totalVideoLength = totalVideoLength ?? 0;
          this.courseDetails.totalArticaleLength = totalArticaleLength ?? 0;
          this.courseDetails.totalResourceLength = totalResourceLength ?? 0;
          console.log(this.courseDetails);
          this.commentsList = this.courseDetails?.comments;
          console.log(this.commentsList);
        }
      });
  }

  changeCourseLanguage(i: number) {
    for (let j in this.courseDetails.languageTypeList) {
      this.courseDetails.languageTypeList[j].isDefault = false;
    }
    this.courseDetails.languageTypeList[i].isDefault = true;
    this.selectedLanguageTypeCd =
      this.courseDetails.languageTypeList[i].languageTypeCd;
    this.getCourseDetails();
  }

  viewSyllabus(url: any) {
    $(document).ready(() => {
      window.open(url, "_blank");
    });
  }

  loadMoreReviews() {
    let params: any = {};
    params.skip = this.reviewList?.length ?? 0;
    params.limit = 10;
    params.courseSno = this.courseDetails?.courseSno;
    this.api.get("8000/api/ascend/learnhub/v1/get_review", params).subscribe((result) => {
      if (result) {
        if (result?.data?.length) {
          for (let review of result?.data) {
            this.reviewList.push(review);
          }
        }
      }
    });
  }

  getFirstAndLastCharacters(str: string): string {
    if (str.length > 0) {
      const firstChar = str[0];
      const lastChar = str[str.length - 1];
      return `${firstChar}${lastChar}`?.toUpperCase();
    } else {
      return ""; // Return an empty string if the input string is empty
    }
  }

  handleEnterKeyPress(
    comment: HTMLTextAreaElement | any,
    commentSno?: any,
    isReply: boolean = false,
    parentCommentSno?: any
  ) {
    this.insertComment(comment?.value, commentSno, isReply, parentCommentSno);
  }

  handleEscKeyPress() {
    this.myTextarea.nativeElement.blur(); // Remove focus from textarea
    this.myTextarea.nativeElement.value = ""; // Clear textarea value
    console.log("Esc key pressed");
    // Your logic for handling Esc key press here
  }

  editedHandleEscKeyPress(i: number, j?: number) {
    if (j === undefined) {
      this.commentsList[i].isEdit = !this.commentsList[i].isEdit;
    } else {
      this.commentsList[i].replies[j].isEdit =
        !this.commentsList[i].replies[j].isEdit;
    }
  }

  insertComment(
    comment: any,
    commentSno?: any,
    isReply: boolean = false,
    parentCommentSno?: any
  ) {
    let body: any = {};
    body.appUserSno = this.appUser?.appUserSno;
    body.courseSno = this.courseDetails?.courseSno;
    body.comment = comment;
    if (commentSno) {
      body.commentSno = commentSno;
    }
    if (isReply) {
      body.parentCommentSno = parentCommentSno;
    }
    console.log(body);
    this.api.post("8000/api/ascend/learnhub/v1/set_comment", body).subscribe((result) => {
      if (result && result?.data) {
        if (commentSno) {
          this.updateCommentInList(
            commentSno,
            body.comment,
            isReply,
            parentCommentSno
          );
        } else {
          this.addNewComment(
            result.data.commentSno,
            body.comment,
            isReply,
            parentCommentSno
          );
        }
        this.handleEscKeyPress();
      }
    });
  }

  updateCommentInList(
    commentSno: any,
    newComment: string,
    isReply: boolean,
    parentCommentSno: any
  ) {
    if (isReply) {
      const parentComment = this.commentsList.find(
        (comment: any) => comment.commentSno === parentCommentSno
      );
      if (parentComment) {
        const replyIndex = parentComment.replies.findIndex(
          (reply: any) => reply.commentSno === commentSno
        );
        if (replyIndex !== -1) {
          parentComment.replies[replyIndex].comment = newComment;
          parentComment.replies[replyIndex].isEdit = false;
        }
      }
    } else {
      const index = this.commentsList.findIndex(
        (comment: any) => comment.commentSno === commentSno
      );
      if (index !== -1) {
        this.commentsList[index].comment = newComment;
        this.commentsList[index].isEdit = false;
      }
    }
  }

  addNewComment(
    commentSno: any,
    comment: string,
    isReply: boolean,
    parentCommentSno: any
  ) {
    const newComment = {
      commentSno,
      comment,
      name: this.appUser?.firstName + " " + this.appUser?.lastName,
      createdOn: this.currentTime(),
      appUserSno: this.appUser?.appUserSno,
      replies: [],
    };

    if (isReply) {
      const parentComment = this.commentsList.find(
        (comment: any) => comment.commentSno === parentCommentSno
      );
      if (parentComment) {
        if (parentComment?.replies?.length) {
          parentComment.replies.unshift(newComment);
        } else {
          parentComment.replies = [];
          parentComment.replies.push(newComment);
        }
      }
      const parentCommentIndex = this.commentsList.findIndex(
        (comment: any) => comment.commentSno === parentCommentSno
      );
      if (parentCommentIndex != -1) {
        this.commentsList[parentCommentIndex].replay = false;
      }
    } else {
      if (this.commentsList?.length) {
        this.commentsList.unshift(newComment);
      } else {
        this.commentsList = [];
        this.commentsList.push(newComment);
      }
    }
  }

  deleteAlert(i: any) {
    Swal.fire({
      title: "Are you sure want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "lightgrey",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteComment(i);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled!", "Your record is safe", "error");
      }
    });
  }

  deleteAlertReply(i: any, j: any) {
    Swal.fire({
      title: "Are you sure want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "lightgrey",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteReplyComment(i, j);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled!", "Your record is safe", "error");
      }
    });
  }

  deleteComment(i: number) {
    let params: any = {};
    params.commentSno = this.commentsList[i]?.commentSno;
    this.api
      .delete("8000/api/ascend/learnhub/v1/delete_comment", params)
      .subscribe((result: any) => {
        console.log(result);
        if (result) {
          if (result?.data) {
            this.commentsList?.splice(i, 1);
          }
        }
      });
  }

  deleteReplyComment(i: number, j: number) {
    let params: any = {};
    params.commentSno = this.commentsList[i].replies[j]?.commentSno;
    this.api
      .delete("8000/api/ascend/learnhub/v1/delete_comment", params)
      .subscribe((result: any) => {
        if (result && result?.data) {
          this.commentsList[i].replies?.splice(j, 1);
        }
      });
  }

  replayTextArea(i: number) {
    this.commentsList[i].replay = !this.commentsList[i]?.replay;
  }

  formatTimestamp(timestamp: string): string {
    const parsedTimestamp = new Date(timestamp);
    const currentDate = new Date();
    return formatDistance(parsedTimestamp, currentDate, { addSuffix: true });
  }

  currentTime() {
    const timestamp = new Date();
    return this.datePipe.transform(timestamp, "yyyy-MM-ddTHH:mm:ss.SSSSSS");
  }

  loadMoreComments() {
    let params: any = {};
    params.skip = this.commentsList?.length ?? 0;
    params.limit = 10;
    params.courseSno = this.courseDetails?.courseSno;
    this.api.get("8000/api/ascend/learnhub/v1/get_comment", params).subscribe((result) => {
      if (result) {
        if (result?.data?.length) {
          this.isFinish = false;
          if (result?.data?.length > 9) {
            this.isFinish = true;
          }
          for (let review of result?.data) {
            this.commentsList.push(review);
          }
        } else {
          this.isFinish = true;
        }
      }
    });
  }

  getReplayComment(i: number) {
    let params:any = {};
    params.commentSno = this.commentsList[i].commentSno;
    this.api.get("8000/api/ascend/learnhub/v1/get_replay_comment", params).subscribe((result) => {
      if (result) {
        if (result?.data?.length) {
          this.commentsList[i].replies = result?.data;
        }else{
          this.commentsList[i].replies = [];
        }
      }
    });
  }
}
