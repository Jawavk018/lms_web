import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-admin-menus',
  templateUrl: './admin-menus.component.html',
  styleUrls: ['./admin-menus.component.scss']
})
export class AdminMenusComponent {
  links: any = [];
  menus: any = [];
  userInfo: any;
  @ViewChild("sidenav") public sidenav: MatSidenav | any;
  selectedMenu:any = 'Category';

  constructor(private router: Router){
    this.menus = [
      {
        id: 1,
        menuName: "Category",
        navigateUrl: "/categories",
        hasSubMenu: false,
        isActive: true,
        icon: "humbleicons:dashboard",
        subMenus: [],
      },
      {
        id: 2,
        menuName: "Sub Categories",
        navigateUrl: "/sub-category",
        hasSubMenu: false,
        icon: "bx:dock-top",
        isActive: false,
      },
      {
        id: 3,
        menuName: "Topics",
        navigateUrl: "/topics",
        hasSubMenu: false,
        icon: "material-symbols:person",
        isActive: false,
      },
    ];
  }

  ngOnInit(): void {
    $(document).ready(() => {
      this.loadScripts();
    });
  }

  async loadScripts() {
    this.links = [];
    await this.loadScript("assets/vendor/js/menu.js", "menu");
    await this.loadScript("assets/js/main.js", "main");
    await this.loadScript("assets/menu/js/helpers.js", "helper");
  }

  loadScript(scriptUrl: string, id: any) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement("script");
      scriptElement.setAttribute("id", id);
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
      this.links.push(scriptElement);
    });
  }

  navigateRouter(url: any, iIndex: any, jIndex: any) {
    this.selectedMenu = this.menus[iIndex].menuName
    // for (let i in this.menus) {
    //   this.menus[i].isActive = false;
    //   if (i == iIndex) {
    //     this.menus[i].isActive = true;
    //   }
    //   if (this.menus[i].subMenus?.length > 0) {
    //     for (let j in this.menus[i].subMenus) {
    //       this.menus[i].subMenus[j].isActive = false;
    //       if (i == iIndex && j == jIndex) {
    //         this.menus[i].subMenus[j].isActive = true;
    //       }
    //     }
    //   }
    // }
    // this.router.navigateByUrl(url);
  }

  open() {
    this.sidenav.toggle();
  }

  logout(){
    localStorage.removeItem('user');
    window.location.reload();
  }
}
