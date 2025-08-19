import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api/api.service';
import { PopupvideoComponent } from '../../common/popupvideo/popupvideo.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-coursecurriculam',
  templateUrl: './coursecurriculam.component.html',
  styleUrls: ['./coursecurriculam.component.scss']
})
export class CoursecurriculamComponent implements OnInit {

  @Input() data: any;

  @Input() courseDetails: any;

  panelOpenState = false;

  getIconColor(lecture:any): string {
    return lecture.isForFree ? 'blue' : 'gray';
  }
 
  getTitleColor(lecture:any): string {
    return lecture.isForFree ? 'blue' : 'gray';
  }

  constructor(private api:ApiService,private router:Router,public dialog: MatDialog) { }

  ngOnInit(): void {
    setTimeout(() => {
    console.log("data"+JSON.stringify(this.data));
    }, 2000);
  }
  // goToTest(i:any){
  //   console.log(this.data[i]);
  //   let navigationExtras: NavigationExtras = {
  //     state: {
  //       courseSno: this.courseSno,
  //       courseCurriculumSno: this.data[i]?.courseCurriculumSno,
  //     },
  //   };
  //   this.router.navigate(['/assessment-test'],navigationExtras);
  // }

  goToTest(i: any){
    let navigationExtras: NavigationExtras = {
      state: {
        subCategoryName: this.courseDetails.subCategoryName,
        title: this.courseDetails.title,
        courseSno: this.courseDetails.courseSno,
        courseCurriculumSno: this.data[i].courseCurriculumSno,
        section: this.data[i].section
      }
    };
    this.router.navigate(['/assessment-test'], navigationExtras)
  }

  openDialog(lecture:any) {
    this.dialog.open(PopupvideoComponent, {
      data: lecture?.videoSno
    });
  }

}
