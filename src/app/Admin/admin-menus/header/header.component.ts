import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TokenStorageService } from 'src/app/providers/token-storage.service';
declare var $: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  userInfo: any = this.tokenService.getUser();
  restaurantstatus: any;
  orderstatus: any;
  entitySno: any;
  @ViewChild("sidenav") public sidenav: MatSidenav | any;

  constructor(private tokenService: TokenStorageService) { }
  openMenu() {
    $(document).ready(() => {
      console.log($("#sidenav"))
      $("#sidenav").click();
    });
  }

  ngOnInit() { }

  goToProfile() {
    // this.router.navigate(["/profile"]);
  }

  goToNotification() {
    // this.router.navigate(["/swomb/notifications"]);
  }

}
