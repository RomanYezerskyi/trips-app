import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UpdateUserDocuments } from 'src/app/core/models/user-models/update-user-documents';
import { UserDocumentsModel } from 'src/app/core/models/user-models/user-documents-model';
import { UserModel } from 'src/app/core/models/user-models/user-model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseApiUrl = environment.baseApiUrl;
  private baseIdentityServerUrl = environment.baseIdentityServerUrl;
  public userProfile: UserModel = {} as UserModel;
  constructor(private http: HttpClient) {
  }
  async chekIfUserExist(): Promise<any> {
    const url = this.baseApiUrl + 'User/add-user';
    return await new Promise<any>((resolve, reject) => {
      this.http.get<any>(url, {headers: { "ngrok-skip-browser-warning":"any"}}).subscribe({
        next: (res) => resolve(res),
        error: (_) => resolve(_)
      });
    });
  }
  searchUsers(userData: string): Observable<UserModel[]> {
    const url = this.baseApiUrl + 'User/users/' + userData;
    return this.http.get<UserModel[]>(url, {headers: { "ngrok-skip-browser-warning":"any"}});
  }
  getUserFromApi(userId: string): Observable<UserModel> {
    const url = this.baseApiUrl + 'User/';
    return this.http.get<UserModel>(url + userId, {headers: { "ngrok-skip-browser-warning":"any"}});
  }

  getCurrentUser(): Observable<UserModel> {
    const url = this.baseApiUrl + 'User';
    return this.http.get<UserModel>(url, {headers: { "ngrok-skip-browser-warning":"any"}});
  }
  updateUserPassword(newPasswordModel: { userId: string, currentPassword: string, newPassword: string }): Observable<any> {
    const url = this.baseIdentityServerUrl + 'User/update-password'
    return this.http.post(url, newPasswordModel, {headers: { "ngrok-skip-browser-warning":"any"}});
  }
  updateUserInfo(userModel: {
    id: string,
    email: string,
    firstName: string,
    phoneNumber: string
  }): Observable<any> {
    const url = this.baseApiUrl + 'User/update';
    return this.http.put(url, userModel, {headers: { "ngrok-skip-browser-warning":"any"}});
  }
  updateUserPhoto(formData: FormData): Observable<any> {
    const url = this.baseApiUrl + 'User/user-profile-image'
    return this.http.put(url, formData, {headers: { "ngrok-skip-browser-warning":"any"}});
  }
  addDrivingLicense(documents: FormData): Observable<any> {
    const url = this.baseApiUrl + 'User/license';
    return this.http.post(url, documents, {headers: { "ngrok-skip-browser-warning":"any"}})
  }
  getUserStatistics(): Observable<any> {
    const url = this.baseApiUrl + 'User/statistics';
    return this.http.get<any>(url, {headers: { "ngrok-skip-browser-warning":"any"}});
  }
  getUserDrivingDocuments(): Observable<UserDocumentsModel[]> {
    const url = this.baseApiUrl + 'User/documents';
    return this.http.get<UserDocumentsModel[]>(url, {headers: { "ngrok-skip-browser-warning":"any"}});
  }
}
