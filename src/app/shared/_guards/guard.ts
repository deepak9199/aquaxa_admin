import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TokenStorageService } from "../_service/token-storage.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private token: TokenStorageService,
    private toster: ToastrService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.ValidatorChecker(this.token.getUser())) {
      return true;
    }
    else {

      this.router.navigate(['/logout'])
      return false;
    }
  }

  logout() {
    this.router.navigate(['/logout'])
  }
  private ValidatorChecker(data: any) {
    if (typeof data === "undefined" || data === null || data === '') {
      return false
    }
    else {
      return true
    }
  }
}

