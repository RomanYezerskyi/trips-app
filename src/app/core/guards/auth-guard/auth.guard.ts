import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth-service/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private jwtHelper: JwtHelperService, private http: HttpClient) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.authService.redirectUrl = state.url;
    if (await this.authService.IsLogged()) { return true }
    return false;
  }
}
