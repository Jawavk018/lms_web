import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/providers/api/api.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent {

  profile: any;
  appUser: any = this.storage.getUser();

  constructor(private api: ApiService, private storage: TokenStorageService,private route:Router) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    let params = {};
    // appUserSno: 1
    console.log(params)
    this.api
      .get('8000/api/ascend/learnhub/v1/get_profile', params)
      .subscribe((result) => {
        if (result != null && result.data != null) {
          this.profile = result.data[0];
        }
      });
  }

  goToEditProfile(){
    this.route.navigate(['/create-profile']);
  }
}
