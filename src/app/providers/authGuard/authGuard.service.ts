import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./authService.service";
import { TokenStorageService } from "../token-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  // canActivate(): boolean {
  //   console.log('console from authguard',this.authService.authUser)

  //   if(this.authService.authUser.role == 'Anonymous User'){
  //     this.authService.isAnonymousUser()
  //     this.router.navigate(['/signin']);
  //     return false;
  //   }
  //   else if (this.authService.isLoggedIn()) {
  //     return true;

  //   } else {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userRole = this.tokenStorage.getUser();
    console.log("userRole", userRole);
    const requestedPath = state.url?.split("?")[0];
    const allowedRolesForPath = ([] as string[]).concat(
      ...this.authService.allowedTOAccess
        .filter((access) => access.menu === requestedPath)
        .map((access) => access.role)
    );
    const userRoleValue = userRole.selectedRole;
    if (requestedPath == "/") {
      if (userRoleValue == "Trainer") {
        this.router.navigate(["/instructorPage"], { replaceUrl: true });
        return true;
      } else if (userRoleValue == "Admin" || userRoleValue == "Super Admin") {
        this.router.navigate(["/admin-menus"], { replaceUrl: true });
        return true;
      } else if (userRoleValue == "Organization") {
        this.router.navigate(["/orgDashboard"], { replaceUrl: true });
        return true;
      }
    }
    if (
      allowedRolesForPath.some((role) =>
        [userRoleValue, "Anonymous User"].includes(role)
      )
    ) {
      return true;
    } else {
      if (userRole) {
        if (userRoleValue == "Trainer") {
          this.router.navigate(["/instructorPage"], { replaceUrl: true });
          return true;
        } else if (userRoleValue == "Admin" || userRoleValue == "Super Admin") {
          this.router.navigate(["/admin-menus"], { replaceUrl: true });
          return true;
        } else if (userRoleValue == "Organization") {
          this.router.navigate(["/orgDashboard"], { replaceUrl: true });
          return true;
        }
      }
      this.router.navigate(["/signin"]);
      return false;
    }
  }
}
