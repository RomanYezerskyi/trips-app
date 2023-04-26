import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthenticatedResponseModel } from 'src/app/core/models/auth-models/authenticated-response-model';
import { LoginModel } from 'src/app/core/models/auth-models/login-model';
import { map } from 'rxjs/operators';
import { RegisterModel } from 'src/app/core/models/auth-models/register-model';
import { environment } from 'src/environments/environment';
import { UserService } from '../user-service/user.service';
import { UserModel } from '../../models/user-models/user-model';
import { ForgotPasswordModel } from '../../models/auth-models/forgot-password-model';
import { ResetPasswordModel } from '../../models/auth-models/reset-password-model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseIdentityServerUrl = environment.baseIdentityServerUrl;
  public redirectUrl: string | undefined;
  private token: string | null = localStorage.getItem("jwt");
  constructor(private router: Router, private jwtHelper: JwtHelperService,
    private http: HttpClient, private userService: UserService) { }

  async IsLogged(): Promise<boolean> {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    const isRefreshSuccess = await this.tryRefreshingTokens(token as string);
    console.log("try refresh " + isRefreshSuccess);
    if (!isRefreshSuccess) {
      this.logOut();
      this.router.navigate(["auth/login"], { queryParams: { returnUrl: this.redirectUrl } });
    }
    return isRefreshSuccess;
  }
  private async tryRefreshingTokens(token: string): Promise<boolean> {
    const url = this.baseIdentityServerUrl + 'token/refresh'
    const refreshToken = localStorage.getItem("refreshToken");
    if (!token || !refreshToken) {
      return false;
    }
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
    let isRefreshSuccess = true;
    const refreshRes = await new Promise<AuthenticatedResponseModel>((resolve, reject) => {
      this.http.post<AuthenticatedResponseModel>(url, credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (res: AuthenticatedResponseModel) => resolve(res),
        error: (_: AuthenticatedResponseModel) => resolve(_)
      });
    });
    if (refreshRes.token == undefined || refreshRes.refreshToken == undefined) return !isRefreshSuccess
    localStorage.setItem("jwt", refreshRes.token);
    localStorage.setItem("refreshToken", refreshRes.refreshToken);
    isRefreshSuccess = true;
    return isRefreshSuccess;
  }
  logOut(): void {
    this.token = null;
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    this.userService.userProfile = {} as UserModel;
    this.router.navigate(["auth/login"]);
  }
  login(credentials: LoginModel): Observable<AuthenticatedResponseModel> {
    const url = this.baseIdentityServerUrl + "auth/login";
    return this.http.post<AuthenticatedResponseModel>(url, credentials, {
      headers: new HttpHeaders({ "Content-Type": "application/json" })

    }).pipe(map(response => {
      const token = response.token;
      const refreshToken = response.refreshToken;
      localStorage.setItem("jwt", token);
      localStorage.setItem("refreshToken", refreshToken);
      return response;
    }));
  }
  Register(credentials: RegisterModel): Observable<any> {
    const url = this.baseIdentityServerUrl + "auth/register";
    return this.http.post<any>(url, credentials, {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    }).pipe(map(response => {
      return response;
    }));
  }
  isAdmin = (): boolean => {
    this.token = localStorage.getItem("jwt");
    if (this.token && !this.jwtHelper.isTokenExpired(this.token)) {
      let check = this.jwtHelper.decodeToken(this.token).role == 'blablacar.admin';
      let check1 = this.jwtHelper.decodeToken(this.token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'blablacar.admin';
      if (check || check1) {
        return true;
      }
    }
    return false
  }
  forgotPassword(body: ForgotPasswordModel): Observable<any> {
    const url = this.baseIdentityServerUrl + 'auth/forgot-password';
    return this.http.post<any>(url, body);
  }
  resetPassword(body: ResetPasswordModel): Observable<any> {
    const url = this.baseIdentityServerUrl + 'auth/reset-password';
    return this.http.post(url, body);
  }
  confirmEmail(token: string, email: string): Observable<any> {
    const url = this.baseIdentityServerUrl + "auth/email-confirmation";
    let params = new HttpParams();
    params = params.append('token', token);
    params = params.append('email', email);
    return this.http.get(url, { params: params });
  }
}
