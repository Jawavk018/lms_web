import { Injectable } from "@angular/core";
import { TokenStorageService } from "../token-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  authUser: any;

  allowedTOAccess = [
    { menu: "/", role: ["Anonymous User", "Learner", "Trainer"] },
    { menu: "/about", role: ["Anonymous User", "Learner", "Trainer"] },
    { menu: "/contact", role: ["Anonymous User", "Learner", "Trainer"] },
    { menu: "/instructor-profile", role: ["Learner","Organization"] },
    // { menu: '/become-instructor', role: ['Learner'] },
    { menu: "/cart", role: ["Learner"] },
    { menu: "/course", role: ["Anonymous User", "Learner"] },
    { menu: "/course-details", role: ["Anonymous User", "Learner"] },
    // { menu: '/signin', role: ['Anonymous User', 'Learner', 'Trainer'] },
    // { menu: '/signup', role: ['Anonymous User','Learner', 'Trainer'] },
    {
      menu: "/forgot-password",
      role: ["Anonymous User", "Learner", "Trainer"],
    },
    { menu: "/reset-password", role: ["Anonymous User", "Learner", "Trainer"] },
    { menu: "/set-password", role: ["Anonymous User", "Learner", "Trainer"] },
    { menu: "/login", role: ["Learner", "Trainer"] },
    { menu: "/instructorPage", role: ["Learner", "Trainer"] },
    { menu: "/add-course", role: ["Trainer"] },
    { menu: "/add-course-content", role: ["Trainer"] },
    { menu: "/gotocourse", role: ["Learner", "Organization"] },
    { menu: "/add-cart", role: ["Learner"] },
    { menu: "/viewprofile", role: ["Learner", "Trainer"] },
    { menu: "/header", role: ["Trainer", "Learner"] },
    { menu: "/create-profile", role: ["Learner", "Trainer"] },
    { menu: "/cart-checkout", role: ["Learner"] },
    { menu: "/mylearning", role: ["Learner"] },
    // { menu: '/create-slide', role: ['Learner', 'Trainer'] },
    { menu: "/category", role: ["Admin", "Super Admin"] },
    { menu: "/sub-category", role: ["Admin", "Super Admin"] },
    { menu: "/topics", role: ["Admin", "Super Admin"] },
    { menu: "/sidemenu", role: ["Admin", "Super Admin"] },
    { menu: "/admin-menus", role: ["Admin", "Super Admin"] },
    { menu: "/success", role: ["Learner"] },
    { menu: "/terms", role: ["Anonymous User", "Learner", "Trainer"] },
    { menu: "/refund-policy", role: ["Anonymous User", "Learner", "Trainer"] },
    { menu: "/privacy-policy", role: ["Anonymous User", "Learner", "Trainer"] },
    { menu: "/organization", role: ["Organization"] },
    { menu: "/tutor", role: ["Organization"] },
    { menu: "/viewOrgTutor", role: ["Organization"] },
    { menu: "/notification", role: ["Learner", "Trainer"] },
  ];

  constructor(private tokenStorage: TokenStorageService) {
    this.authUser = this.tokenStorage.getUser();
  }

  isAnonymousUser(): boolean {
    return this.authUser.appUserSno == null;
  }

  isLoggedIn(): boolean {
    return this.authUser.appUserSno != null;
  }

  //   // Method to perform user login
  //   login(username: string, password: string): boolean {
  //     // Logic to authenticate user (e.g., call an API, check credentials)
  //     if (username === 'example' && password === 'password') {
  //       this.loggedIn = true;
  //       return true;
  //     }
  //     return false;
  //   }

  //   logout(): void {
  //     this.loggedIn = false;
  //   }
}
