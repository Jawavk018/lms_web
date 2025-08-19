import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { Router, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoriesComponent } from '../admin-menus/categories/categories.component';
import { TopicsComponent } from '../admin-menus/topics/topics.component';
import { TokenStorageService } from 'src/app/providers/token-storage.service';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/authGuard/authService.service';
import { SubCategoriesComponent } from '../admin-menus/sub-categories/sub-categories.component';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    CategoriesComponent,
    SubCategoriesComponent,
    TopicsComponent
  ],
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent {
  icon: any;
  isMobile$: Observable<boolean> | any;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  isCollapsed = true;
  timer: any;
  selectedMenuIndex = 0; 


  menuList: any = [
    { title: 'Category', icon: 'bi bi-folder-fill' },
    {title: 'Sub Category', icon: 'bi bi-bar-chart-fill'},
    { title: 'Topics', icon: 'bi bi-book-fill' }
  ];

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private api: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.timer = setInterval(() => {
      this.sidenav.open();
    }, 500);
  }


  toggleContent(index: number) {
    this.selectedMenuIndex = index;
  }

  toggleMenu() {
    if (this.isMobile$) {
      this.sidenav?.open();
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.sidenav?.open();
      this.icon;
      this.isCollapsed = !this.isCollapsed;
    }
  }

  navigatePage(i: number) {
    this.router.navigate([this.menuList[i].href]);
    // alert(1)
  }
  ngOnDestroy() {
    this.stopTimer();
  }
  stopTimer() {
    clearInterval(this.timer);
  }
  async LoggedOut() {
    Swal.fire({
      title: 'Are you sure want to Logout?',
      text: "You will require to enter your credetials again to LOGIN!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffb013',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Logged Out!',
          ' ',
          'success'
          
        )
        this.logout();

      }
      else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled!',
          'Your record is safe',
          'error'

        )
      }
    })
  }

  logout() {
    this.tokenStorage.removeStorage();
    this.router.navigate(['/signin']);
  }
}
