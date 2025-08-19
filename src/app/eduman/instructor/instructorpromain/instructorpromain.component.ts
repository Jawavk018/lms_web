import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';

@Component({
  selector: 'app-instructorpromain',
  templateUrl: './instructorpromain.component.html',
  styleUrls: ['./instructorpromain.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstructorpromainComponent implements OnInit {
  followedActive:boolean=false;
  btnVal = "Follow";
  appUser: any = this.tokenStorage.getUser();
  instructorList:any=[];
  appUserSno: any;
  courseDetails: any;
  entitySno: any;

  followedClick(){
    if(this.followedActive==false){
      this.followedActive=true;
      this.btnVal = "Followed"
    }
    else {
      this.followedActive=false;
      this.btnVal = "Follow"
    }
  }

  constructor(private tokenStorage: TokenStorageService,private api:ApiService,private toastService: ToastService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.appUserSno = params['appUserSno'];
      this.entitySno = params["entitySno"];
        this.getInstructorDetails();
    });
  
  }


  getInstructorDetails() {
    let params: any = {};
    params.appUserSno = this.appUserSno;
    if(this.entitySno){
      params.entitySno = this.entitySno;
    }
    this.api.get('8000/api/ascend/learnhub/v1/get_instructor_details', params).subscribe((result) => {
      if (result) {
        this.courseDetails = (result?.data && result.data.length > 0) ? result?.data[0] : [];
        console.log("my courses");
        console.log(this.courseDetails);
    
      }
    })
  }

      
}
