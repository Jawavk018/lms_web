import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { TokenStorageService } from 'src/app/providers/token-storage.service';
import { ApiService } from 'src/app/providers/api/api.service';
declare var $:any;
import Swal from 'sweetalert2';
import { Subject, debounceTime } from 'rxjs';
import { SpinnerVisibilityService } from 'ng-http-loader';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-mobilemenu',
  templateUrl: './mobilemenu.component.html',
  styleUrls: ['./mobilemenu.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None
})
export class MobilemenuComponent implements OnInit {

  @ViewChild('trainerTips') trainerTips: any;
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;
  searchKey: String = '';
  searchList: any = [];
  searchTermChange: Subject<any> = new Subject<any>();

  appUser: any = this.tokenStorage.getUser();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  constructor(public router: Router,private tokenStorage:TokenStorageService,public api:ApiService, private spinner: SpinnerVisibilityService) {
    this.searchTermChange.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.search(searchTerm);
    });
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    $(document).ready(() => {
      const textInput: any = document.getElementById('textInput');
      textInput.addEventListener('focus', () => {
        // $('#textInput').addClass('w-100');
        // $('.header-search').addClass('w-100');
      });

      textInput.addEventListener('focusout', () => {
        if (!this.searchKey?.trim()?.length) {
          this.searchList = [];
          // $('#textInput').removeClass('w-100');
          // $('.header-search').removeClass('w-100');
        }
      });
    });
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }


  cartclick() {
    this.router.navigate(['/add-cart'], { replaceUrl: true });
  }

  generateTrainer(){
    if(this.appUser.role.length == 1){
    $('#trainerTips').click();
    }
  else{
    this.appUser.selectedRole = 'Trainer';
    this.tokenStorage.saveUser(this.appUser);
    window.location.reload();
  }
}

LoggedOut() {
  Swal.fire({
    title: 'Are you sure want to Logout?',
    text: "You won't be able to revert this!",
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

searchkeys(event: String) {
  if (event?.trim().length) {
    this.searchTermChange.next(event);
  }
}

onSelectionChange(event: any) {
  let index: number = this.searchList.findIndex((search: any) => search.key == event.option.value);
  if (index != -1) {
    this.router.navigate(['/course-details'], { queryParams: { courseSno: this.searchList[index]?.courseSno } });
  }
}

search(key: any) {
  let param: any = { searchKey: key };
  this.api.get("8000/api/ascend/learnhub/v1/get_search_course", param).subscribe((result) => {
    this.spinner.hide();
    if (result != null) {
      this.searchList = result?.data ?? [];
    }
  });
}

}
