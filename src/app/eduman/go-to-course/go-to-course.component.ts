import { Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EdumanModule } from "../eduman.module";
import { ApiService } from "src/app/providers/api/api.service";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { VideoService } from "src/app/providers/video/video.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { MatDialog } from "@angular/material/dialog";
import { RatingReviewComponent } from "../rating-review/rating-review.component";
import Swal from "sweetalert2";
import { CertificateTemplateComponent } from "../certificate-template/certificate-template.component";
import { ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
  selector: "app-go-to-course",
  templateUrl: "./go-to-course.component.html",
  styleUrls: ["./go-to-course.component.scss"],
})
export class GoToCourseComponent {
  @ViewChild("myVideo") videoPlayerDuration: ElementRef | any;
  courseList: any = [];
  courseSno: any;
  appUserSno: any;
  courseDetails: any;
  // videoPlayer: any;
  isShowVideo: boolean = false;
  // videoDuration: number = 0.0;
  remainder: number = 0.0;
  quotient: number = 0.0;
  cartTotalHours: string = "00:03:15.471";
  dateTime = new Date();
  videoUrl: any;

  videoSegments: VideoSegment[] = [];
  totalDuration = 0;
  currentTime = 0;
  progress = 0;
  isPlay = false;
  isMuted = false;
  isFullScreen = false;
  videoElement: HTMLVideoElement | any;
  currentSegmentIndex: number = 0;
  @ViewChild("videoPlayer") videoPlayer!: ElementRef;
  @ViewChild("progressBar") progressBar!: ElementRef;
  isDragging = false;
  isLoading = false;

  isBuffer: boolean = false;
  networkSpeed: any;
  appUser: any = this.tokenStorage.getUser();
  port: any = "8000";
  selectedLecture: any;
  courseComplete: boolean = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoService,
    private tokenStorage: TokenStorageService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    if (this.api.isLive) {
      this.port = "8000";
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        // this.networkService.getMbps().then((speed) => {
        //   this.networkSpeed = speed;
        this.courseSno = params["courseSno"];
        this.getCourseDetails();
        // });
      }
    });

  }

  toggleSection(curriculum: any) {
    curriculum.isExpanded = !curriculum?.isExpanded; // Toggle the expanded state
  }

  selectVideo(lectures: any): void {
    console.log(this.courseDetails);
    this.courseDetails?.curriculum.forEach((curriculum: any) => {
      curriculum?.lecture.forEach((lecture: any) => {
        lecture.isSelected = false;
        if (lecture?.duration) {
          this.calculateCompletionPercentage(
            lecture.seekingTime,
            lecture.duration
          );
        }
      });
    });
    lectures.isSelected = true;
    this.selectedLecture = lectures;
    console.log(this.selectedLecture);
    if (lectures?.videoSno) {
      this.isShowVideo = true;
      $(document).ready(() => {
        if (!this.videoElement) {
          this.videoElement = this.videoPlayer?.nativeElement;
          this.loadPlayer();
        }
      });
      let video = lectures?.videoSno?.split("/");
      this.selectedLecture.fileName = video[video?.length - 1];
      this.currentSegmentIndex = 0;
      this.totalDuration = 0;
      this.currentTime = 0;
      this.progress = 0;
      this.videoElement?.pause();
      this.updateDuration(this.currentTime).then(() => {
        this.getVideoDuration();
      });
    } else {
      // if(this.videoElement){
      //   this.videoElement.pause();
      // }
      this.isShowVideo = false;
    }
  }

  getCourseDetails() {
    let params: any = {};
    if (this.appUser?.appUserSno) {
      params.appUserSno = this.appUser?.appUserSno;
    }
    params.courseSno = this.courseSno;
    this.api
      .get("8000/api/ascend/learnhub/v1/get_purchased_courses", params)
      .subscribe((result) => {
        if (result) {
          this.courseDetails = result?.data?.length ? result?.data[0] : null;
          console.log(this.courseDetails)
          let totalLectureCount: number = 0;
          let completedLectureCount: number = 0;
          this.courseDetails?.curriculum.forEach((curriculum: any) => {
            curriculum?.lecture.forEach((lecture: any) => {
              if (lecture?.duration) {
                totalLectureCount++;
                lecture.completePercentage = this.calculateCompletionPercentage(
                  lecture.seekingTime,
                  lecture.duration
                );
                if (lecture.completePercentage > 75) {
                  completedLectureCount++;
                }
              }
            });
          });
          if (totalLectureCount == completedLectureCount) {
            this.courseComplete = true;
          }
          if (this.courseDetails?.purchasedUser == false) {
            // alert("failed");
            // this.router.navigzsate(['/course-details'], { replaceUrl: true });
            $("#nopurchasedata").click();
          } else {
            let lectureLength: number = 0;
            let totalVideoLength: number = 0;
            let totalArticaleLength: number = 0;
            let totalResourceLength: number = 0;
            // if (this.courseDetails?.curriculum[0]?.lecture?.length) {
            $(document).ready(() => {
              this.videoElement = this.videoPlayer?.nativeElement;
              this.loadPlayer();
            });
            let index: String = "";
            console.log(this.courseDetails);
            this.courseDetails?.curriculum.forEach(
              (curriculum: any, i: number) => {
                curriculum?.lecture.forEach((lecture: any, j: number) => {
                  if (lecture?.isWatched) {
                    index = i + "-" + j;
                    return; // Exit the inner loop when the index is found
                  }
                });
                if (index !== "") {
                  return; // Exit the outer loop when the index is found
                }
              }
            );
            console.log(index);
            let i =
              index?.trim()?.length && index?.split("-")?.length
                ? index?.split("-")[0] ?? 0
                : 0;
            let j =
              index?.trim()?.length && index?.split("-")?.length
                ? index?.split("-")[1] ?? 0
                : 0;
            this.courseDetails.curriculum[i].isExpanded = true;
            this.selectVideo(this.courseDetails?.curriculum[i]?.lecture[j]);
            // this.videoPlayer?.pause();
            // }
            for (let curriculum of this.courseDetails?.curriculum) {
              lectureLength =
                lectureLength + (curriculum?.lecture?.length ?? 0);
              for (let lecture of curriculum?.lecture) {
                totalVideoLength =
                  totalVideoLength + (lecture?.videoSno ? 1 : 0);
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
          }
        }
      });
  }

  roundDuration(durationString: any) {
    const parts = durationString.split(":");
    const seconds = parseInt(parts[2]);
    const roundedSeconds = Math.round(seconds / 100) * 100; // Round to nearest hundredth
    return (
      parts[0] +
      ":" +
      parts[1] +
      ":" +
      roundedSeconds.toString().padStart(2, "0")
    );
  }

  downloadResources(url: any) {
    window.open(url, "_blank");
    // const download = document.createElement('a');
    // download.href = url;
    // download.download = url.split('/').pop();
    // download.click();
  }

  startVideoStreaming(): void {
    this.videoService.getVideoChunk().subscribe((blob: any) => {
      const videoBlob = new Blob([blob], { type: "video/mp4" });
      this.videoUrl = URL.createObjectURL(videoBlob);
    });
  }

  async getVideoDuration(): Promise<void> {
    const params = {
      fileName: this.selectedLecture.fileName,
    };
    try {
      const result: any = await this.api
        .get("8000/api/ascend/learnhub/v1/get_video_duration", params)
        .toPromise();
      const duration = result?.duration ?? 0;
      this.totalDuration = duration;
      let segmentCount = duration / 30;
      if (!segmentCount && duration < 30) {
        segmentCount = 1;
      }
      this.videoSegments = [];
      for (let i = 0; i < segmentCount; i++) {
        const startTime = i * 30;
        const endTime = startTime + 30;
        this.videoSegments.push({
          startTime,
          endTime,
          data: null,
        });
      }
      this.isLoading = true;
      this.isBuffer = true;
      if (!parseInt(this.selectedLecture?.completePercentage)) {
        this.onProgressBarMouseDown(null, 0);
      } else {
        this.videoResume();
      }
    } catch (error) {
      console.error("Error fetching video duration:", error);
    }
  }

  async getVideo(): Promise<void> {
    try {
      this.isLoading = true;
      this.fetchVideoSegment(
        this.videoSegments[this.currentSegmentIndex].startTime,
        this.videoSegments[this.currentSegmentIndex].endTime,
        this.selectedLecture.fileName
      ).then((newBlobUrl: any) => {
        this.isLoading = false;
        this.isBuffer = false;
        this.videoSegments[0].data = newBlobUrl;
        this.videoElement.src = this.videoSegments[0].data;
        this.videoElement.play();
      });
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  }

  loadPlayer(): void {
    let lastAlertTime = 0;
    if (!this.videoElement) return;
    this.videoElement.addEventListener("timeupdate", () => {
      if (!this.isDragging && this.videoElement) {
        this.progress =
          ((this.videoSegments[this.currentSegmentIndex].startTime +
            this.videoElement.currentTime) /
            this.totalDuration) *
          100 || 0;
        this.selectedLecture.seekingTime = this.videoElement.currentTime;
        this.currentTime =
          this.videoSegments[this.currentSegmentIndex].startTime +
          this.videoElement.currentTime;
        if (this.currentTime >= lastAlertTime + 5) {
          // console.log("Current time: " + this.currentTime);
          lastAlertTime = Math.floor(this.currentTime / 5) * 5;
          this.updateDuration(this.currentTime);
        }
        if (
          !this.isLoading &&
          !this.videoSegments[this.currentSegmentIndex + 1]?.data &&
          this.videoElement.currentTime > 1 &&
          Math.floor(this.videoElement.currentTime) >= 10 &&
          this.currentSegmentIndex < this.videoSegments?.length - 1
        ) {
          this.isLoading = true;
          this.fetchVideoSegment(
            this.videoSegments[this.currentSegmentIndex + 1].startTime,
            this.videoSegments[this.currentSegmentIndex + 1].endTime,
            this.selectedLecture.fileName
          ).then((newBlobUrl: any) => {
            this.isLoading = false;
            this.videoSegments[this.currentSegmentIndex + 1].data = newBlobUrl;
            this.nextIndexVideo();
          });
        }
        if (
          this.isLoading &&
          this.videoElement.currentTime > 1 &&
          !this.videoSegments[this.currentSegmentIndex + 1]?.data &&
          Math.floor(this.videoElement.currentTime) > 25 &&
          this.currentSegmentIndex < this.videoSegments?.length - 1
        ) {
          this.isBuffer = true;
        } else {
          this.isBuffer = false;
        }
        this.nextIndexVideo();
      }
    });

    this.videoElement.addEventListener("play", () => {
      this.isPlay = true;
    });

    this.videoElement.addEventListener("pause", () => {
      this.isPlay = false;
    });

    $(".popover-area").on("click", () => {
      if (this.videoElement.paused) {
        if (
          this.currentSegmentIndex === this.videoSegments?.length - 1 &&
          Math.floor(this.progress) % 100 === 0
        ) {
          this.currentSegmentIndex = 0;
          this.videoElement.src =
            this.videoSegments[this.currentSegmentIndex].data;
          this.videoElement.play();
        } else {
          this.videoElement.play().catch((error: any) => {
            console.error("Error playing video:", error);
          });
        }
      } else {
        this.videoElement.pause();
      }
    });

    $(".button-popper .fa-play")
      .parent()
      .click(() => {
        if (this.videoElement.paused) {
          this.videoElement.play().catch((error: any) => {
            console.error("Error playing video:", error);
          });
        } else {
          this.videoElement.pause();
        }
      });

    $(".button-popper .fa-forward")
      .parent()
      .click(() => {
        this.videoElement.currentTime += 10;
        if (
          Math.floor(this.videoElement.currentTime) >= 29 &&
          this.videoSegments[this.currentSegmentIndex + 1]?.data
        ) {
          this.currentSegmentIndex++;
          this.videoElement.src =
            this.videoSegments[this.currentSegmentIndex].data;
          this.videoElement.currentTime += 10;
          this.videoElement.play();
        }
      });

    $(".button-popper .fa-backward")
      .parent()
      .click(() => {
        if (
          this.currentSegmentIndex > 0 &&
          Math.floor(this.videoElement.currentTime) === 0 &&
          this.videoSegments[this.currentSegmentIndex]?.data
        ) {
          this.currentSegmentIndex--;
          this.videoElement.src =
            this.videoSegments[this.currentSegmentIndex]?.data;
          this.videoElement.currentTime = 20;
          this.videoElement.play();
        } else {
          this.videoElement.currentTime -= 10;
          this.videoElement.play();
        }
      });
  }

  nextIndexVideo() {
    if (
      !this.isLoading &&
      this.videoElement.currentTime > 1 &&
      Math.floor(this.videoElement.currentTime) % 30 === 0 &&
      this.currentSegmentIndex < this.videoSegments?.length - 1
    ) {
      if (
        Math.floor(this.videoElement.currentTime) % 30 === 0 &&
        this.videoSegments[this.currentSegmentIndex + 1]?.data
      ) {
        this.currentSegmentIndex++;
        this.isLoading = false;
        this.isBuffer = false;
        this.videoElement.src =
          this.videoSegments[this.currentSegmentIndex].data;
        this.videoElement.play();
      }
    }
  }

  async fetchVideoSegment(
    startTime: number,
    endTime: number,
    fileName: string
  ): Promise<string> {
    const url =
      this.api.url +
      this.port +
      `/video?startTime=${startTime}&endTime=${endTime}&fileName=${fileName}`;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = new Blob([uint8Array], { type: "video/mp4" });
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
    } catch (error) {
      console.error("Error fetching video segment:", error);
      throw error;
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.videoElement) {
      this.videoElement.muted = this.isMuted;
    }
  }

  toggleFullScreen(): void {
    if (this.videoElement && !document.fullscreenElement) {
      if (this.videoElement.requestFullscreen) {
        this.videoElement.requestFullscreen();
      } else if ((this.videoElement as any).msRequestFullscreen) {
        (this.videoElement as any).msRequestFullscreen();
      } else if ((this.videoElement as any).mozRequestFullScreen) {
        (this.videoElement as any).mozRequestFullScreen();
      } else if ((this.videoElement as any).webkitRequestFullscreen) {
        (this.videoElement as any).webkitRequestFullscreen();
      }
      this.isFullScreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullScreen = false;
    }
  }

  onProgressBarMouseDown(event?: MouseEvent | any, seekingTime?: any): void {
    this.isDragging = true;
    let seekTime: any;
    if (!seekingTime) {
      const progressBar = this.progressBar.nativeElement as HTMLDivElement;
      const rect = progressBar.getBoundingClientRect();
      const offsetX: any = event && event.clientX - rect.left;
      const progressPercentage = (offsetX / progressBar.offsetWidth) * 100;
      seekTime = (progressPercentage * this.totalDuration) / 100;
    } else {
      seekTime = seekingTime;
    }
    // console.log(seekTime);
    let relativeSeekTime = seekTime;

    for (let i = 0; i < this.videoSegments.length; i++) {
      if (
        seekTime >= this.videoSegments[i].startTime &&
        seekTime <= this.videoSegments[i].endTime
      ) {
        this.currentSegmentIndex = i;
        this.videoElement?.pause();
        if (!this.videoSegments[i]?.data) {
          this.isLoading = true;
          this.isBuffer = true;
          this.fetchVideoSegment(
            this.videoSegments[i].startTime,
            this.videoSegments[i].endTime,
            this.selectedLecture.fileName
          ).then((newBlobUrl: any) => {
            this.isLoading = false;
            this.isBuffer = false;
            this.videoSegments[i].data = newBlobUrl;
            if (this.videoElement) {
              this.videoElement.src = this.videoSegments[i]?.data;
              relativeSeekTime = seekTime - this.videoSegments[i].startTime;
              this.videoElement.currentTime = relativeSeekTime;
              this.videoElement.play();
              this.currentTime =
                this.videoSegments[this.currentSegmentIndex].startTime +
                this.videoElement.currentTime;
              console.log(this.currentTime);
              this.selectedLecture.seekingTime = this.currentTime;
              this.updateDuration(this.currentTime).then(() => {
                this.isDragging = false;
              });
            }
          });
        } else {
          this.videoElement.src = this.videoSegments[i].data;
          relativeSeekTime = seekTime - this.videoSegments[i].startTime;
          this.videoElement.currentTime = relativeSeekTime;
          this.videoElement.play();
          this.currentTime =
            this.videoSegments[this.currentSegmentIndex].startTime +
            this.videoElement.currentTime;
          console.log(this.currentTime);

          this.selectedLecture.seekingTime = this.currentTime;
          this.updateDuration(this.currentTime).then(() => {
            this.isDragging = false;
          });
        }
        break;
      }
    }
  }

  onProgressBarMouseUp(): void {
    this.isDragging = false;
  }

  playVideo() {
    if (
      !this.isLoading &&
      this.videoSegments[this.currentSegmentIndex]?.data &&
      this.currentSegmentIndex < this.videoSegments?.length - 1
    ) {
      this.videoElement.play();
    }
  }

  goToPurchase() {
    if (!this.appUser.appUserSno) {
      this.router.navigate(["/signin"], { replaceUrl: true });
    } else {
      let navigationExtras: any = {
        courseSno: this.courseDetails.courseSno,
        replaceUrl: true,
      };
      this.router.navigate(["/course-details"], navigationExtras);
    }
  }

  async updateWatchedVideo() {
    let body: any = {};
    body.appUserSno = this.appUser?.appUserSno;
    body.lectureSno = this.selectedLecture?.lectureSno;
    body.courseSno = this.courseDetails?.courseSno;
    await fetch(this.api.url + "8000/api/ascend/learnhub/v1/update_watched_video", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem with your fetch operation:", error);
      });
  }

  async updateDuration(duration: any) {
    let body: any = {};
    body.appUserSno = this.appUser?.appUserSno;
    body.lectureSno = this.selectedLecture?.lectureSno;
    body.duration = duration;
    await fetch(this.api.url + "8000/api/ascend/learnhub/v1/update_video_progress", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem with your fetch operation:", error);
      });
    // this.api.put("8000/api/ascend/learnhub/v1/update_video_progress", body).subscribe(
    //   (result: any) => {
    //     this.spinner.hide();
    //     if (result?.data) {
    //     }
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );
  }

  viewInstructors() {
    this.router.navigate(["/instructor-profile"], {
      queryParams: {
        appUserSno: this.courseDetails?.instructor?.appUserSno,
      },
    });
  }

  calculateCompletionPercentage(currentDuration: any, totalDuration: any) {
    console.log(totalDuration);
    return (
      (currentDuration / this.convertToSeconds(totalDuration)) *
      100
    ).toFixed(0);
  }

  convertToSeconds(timeString: any) {
    const parts = timeString?.split(":");
    const hoursInSeconds = parseInt(parts[0]) * 3600;
    const minutesInSeconds = parseInt(parts[1]) * 60;
    const totalSeconds = hoursInSeconds + minutesInSeconds + parseInt(parts[2]);
    return totalSeconds;
  }

  convertToMinutes(timeString: any) {
    const parts = timeString.split(":");
    const hoursInMinutes = parseInt(parts[0]) * 60;
    const totalMinutes =
      hoursInMinutes + parseInt(parts[1]) + parseInt(parts[2]) / 60;
    return totalMinutes;
  }

  setRatingReview() {
    this.videoElement?.pause();
    const dialogRef = this.dialog.open(RatingReviewComponent, {
      data: {
        courseSno: this.courseSno,
        ratingReview: this.courseDetails?.myReview,
        appUserSno: this.appUser?.appUserSno,
      },
      width: "50%",
      height: "75%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (result?.rating) {
        this.courseDetails.myReview = {
          rating: result.rating,
          review: result.review,
        };
      }
    });
  }

  goToTest(i: any) {
    console.log(this.courseDetails);
    let navigationExtras: NavigationExtras = {
      state: {
        subCategoryName: this.courseDetails.subCategoryName,
        title: this.courseDetails.title,
        courseSno: this.courseDetails.courseSno,
        courseCurriculumSno:
          this.courseDetails.curriculum[i].courseCurriculumSno,
        section: this.courseDetails.curriculum[i].section,
      },
    };
    console.log(navigationExtras);
    this.router.navigate(["/assessment-test"], navigationExtras);
  }

  videoResume() {
    Swal.fire({
      title: "Do you want to resume the video?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.onProgressBarMouseDown(
          null,
          this.selectedLecture?.seekingTime ?? 0
        );
      } else if (result.isDenied) {
        this.onProgressBarMouseDown(null, 0);
      } else {
        this.onProgressBarMouseDown(
          null,
          this.selectedLecture?.seekingTime ?? 0
        );
      }
    });
  }

  openCertificateModal() {
    // Open the modal
    const modal = document.getElementById('certificateModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeCertificateModal() {
    // Close the modal
    const modal = document.getElementById('certificateModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  // downloadAsPDF() {
  //   // Create PDF using jsPDF library
  //   const doc = new jsPDF();
  //   const img = new Image();
  //   img.src = '/assets/img/template2.html'; // Certificate image path

  //   // Wait for image to load before adding to PDF
  //   img.onload = () => {
  //     const imgWidth = 210; // A4 size width in mm
  //     const imgHeight = img.height * imgWidth / img.width;
  //     doc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
  //     doc.save('certificate.pdf');
  //   };
  // }


  downloadAsPDF() {
    
  }

  ngOnDestroy() {
    Swal.close();
    this.videoElement = null;
  }

  openModal() {
    this.dialog.open(CertificateTemplateComponent, {
      width: '50%',
      height: '80%',
      data: {
        courseSno: this.courseDetails.courseSno,
        courseName: this.courseDetails?.title
      }
    });
  }
  // openModal() {
  //   if (this.completePercentage === 100) {
  //     const data = {
  //       instructorName: this.courseDetails?.instructor?.firstName,
  //       lastName: this.courseDetails?.instructor?.lastName,
  //       courseName: this.courseDetails?.title
  //     };
  //     this.dialog.open(CertificateTemplateComponent, {
  //       width: '70%',
  //       height: '80%',
  //       data: data
  //     });
  //   } else {
  //     this.toastr.warning(`Please complete the remaining Course video to download the certificate.`);

  //     // this.toastr.warning(`Please complete the remaining ${100 - this.lecture.completePercentage}% to download the certificate.`);
  //   }
  // }

}

interface VideoSegment {
  startTime: number;
  endTime: number;
  data: string | null;
}
