import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/core/services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private userService: UserService) {


  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    return await this.userService.chekIfUserExist();

  }

}
