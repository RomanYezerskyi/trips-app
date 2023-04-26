import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { CarStatus } from '../../models/car-models/car-status';
import { UserModel } from '../../models/user-models/user-model';
import { UserStatus } from '../../models/user-models/user-status';
import { AuthGuard } from '../auth-guard/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class PageAccessGuard implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService,
    private http: HttpClient, private _authGuard: AuthGuard) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let result = false;
    const authRes = await this._authGuard.canActivate(route, state);

    if (!authRes) return result;

    if (route.routeConfig?.path == 'add-trip') {
      result = await this.AddTripAccess();
    }
    return result;
  }

  private async AddTripAccess(): Promise<boolean> {

    const token = localStorage.getItem("jwt");
    var user = await this.GetUser();
    switch (user.userStatus) {
      case UserStatus.WithoutCar:
        this.router.navigate(['info'],
          { queryParams: { message: "Go to your profile and add your documents to verify your identity!" } });
        return false;
        break;
      case UserStatus.Pending:
        this.router.navigate(['info'],
          { queryParams: { message: "You need to wait for your driver's license to be verified!" } });
        return false;
        break;
      case UserStatus.Rejected:
        this.router.navigate(['info'],
          { queryParams: { message: "You cannot add a trip. Try adding your driver's license again!" } });
        return false;
        break;
      case UserStatus.NeedMoreData:
        this.router.navigate(['info'],
          { queryParams: { message: "You cannot add a trip. You need add more data!" } });
        return false;
        break;
      case UserStatus.Confirmed:
        let checkIfcarConfirmed = user.cars.some(car => car.carStatus == CarStatus.Confirmed);
        if (!checkIfcarConfirmed) {
          this.router.navigate(['info'],
            { queryParams: { message: "You need to add car or wait for the documents to be confirmed!" } });
        }
        return checkIfcarConfirmed;
        break;
      default:
        break;
    }
    return false;
  }

  private async GetUser(): Promise<UserModel> {
    const user = await new Promise<UserModel>((resolve, reject) => {
      this.http.get<UserModel>("https://localhost:6001/api/User/").subscribe({
        next: (res: UserModel) => resolve(res),
        error: (_) => {
          reject(_);
        }
      });
    });
    return user;
  }

}
