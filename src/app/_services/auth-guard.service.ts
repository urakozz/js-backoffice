import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate} from "@angular/router";
import {UserService} from "./user.service";

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(private authService: UserService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAdmin) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

}
