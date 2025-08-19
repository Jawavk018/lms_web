import { Component } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';

@Component({
  selector: 'app-mylearning',
  templateUrl: './mylearning.component.html',
  styleUrls: ['./mylearning.component.scss'],
})
export class MylearningComponent {

  myCourseList: any = [];
  appUser: any = this.storage.getUser();

  constructor(private api: ApiService, private storage: TokenStorageService) { }

  ngOnInit(): void {
    this.getMyCourses();
  }


  getMyCourses() {
    let params: any = {};
    params.appUserSno = this.appUser.appUserSno
    this.api.get('8000/api/ascend/learnhub/v1/get_my_courses', params)
      .subscribe((result) => {
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.myCourseList = result?.data ?? [];
            console.log(this.myCourseList);
          } else {
          }
        }
      });
  }

}
