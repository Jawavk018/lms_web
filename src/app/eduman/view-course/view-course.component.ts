import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/providers/api/api.service';
import { PopupvideoComponent } from '../common/popupvideo/popupvideo.component';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss']
})
export class ViewCourseComponent implements OnInit {
  courseDetails:any;
  writeReviewActive: boolean = false;
  isNoRecord:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ViewCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api:ApiService,
  ) {}

  ngOnInit(): void {
    this.getCourseDetails();
  }

  getCourseDetails() {
    let params: any = {};
    params.courseSno = this.data?.courseSno;
    this.api.get('8000/api/ascend/learnhub/v1/get_courses_details', params).subscribe((result) => {
      if (result) {
        this.courseDetails = result?.data?.length ? result?.data[0] : null;
        console.log("Hii");
        console.log(this.courseDetails);
        let lectureLength: number = 0;
        let totalVideoLength: number = 0;
        let totalArticaleLength: number = 0;
        let totalResourceLength: number = 0;

        for (let curriculum of this.courseDetails?.curriculum) {
          lectureLength = lectureLength + (curriculum?.lecture?.length ?? 0);
          for (let lecture of curriculum?.lecture) {
            totalVideoLength = totalVideoLength + (lecture?.videoSno ? 1 : 0);
            totalArticaleLength = totalArticaleLength + (lecture?.articale ? 1 : 0);
            totalResourceLength = totalResourceLength + (lecture?.resourcesSno ? 1 : 0);
          }
        }
        this.courseDetails.lectureLength = lectureLength ?? 0;
        this.courseDetails.totalVideoLength = totalVideoLength ?? 0;
        this.courseDetails.totalArticaleLength = totalArticaleLength ?? 0;
        this.courseDetails.totalResourceLength = totalResourceLength ?? 0;
      }else{
        this.isNoRecord = true;
      }
    })
  }

  writeReview() {
    if (this.writeReviewActive == false) {
      this.writeReviewActive = true;
    }
    else {
      this.writeReviewActive = false;
    }
  }

 

}
