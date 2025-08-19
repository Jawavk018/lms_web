import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  TOKEN_KEY: string = "token";
  USER_KEY: string = "user";
  PROFILE_KEY: string = "profileInfo";

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public saveUser(user: any): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public getUserProfile(): any {
    const profile = localStorage.getItem(this.USER_KEY);
    if (profile) {
      return JSON.parse(profile);
    }
    return {};
  }

  public profileInfo(): any {
    const user: any = localStorage.getItem(this.USER_KEY);
    const profile = JSON.parse(user);
    if (profile.profileInfo) {
      return profile.profileInfo;
    }
    return {};
  }

  public saveProfile(profileInfo: any): void {
    localStorage.removeItem(this.PROFILE_KEY);
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profileInfo));
  }

  public getUserMenus(): any {
    let user: any = localStorage.getItem(this.USER_KEY);
    user = JSON.parse(user);
    if (user) {
      return user.menus;
    }
    return {};
  }
  public removeUser() {
    localStorage.removeItem(this.USER_KEY);
  }

  public removeStorage() {
    localStorage.clear();
  }

  public removeClient() {
    localStorage.removeItem(this.PROFILE_KEY);
  }
}
