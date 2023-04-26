import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsUserGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAdmin()) {
      return true;

    }
    this.router.navigate(["admin"]);
    return false;
  }

}
