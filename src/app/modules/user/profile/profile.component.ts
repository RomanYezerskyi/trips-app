import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImgSanitizerService} from "../../../core/services/image-sanitizer-service/img-sanitizer.service";
import {UserService} from "../../../core/services/user-service/user.service";
import {Subject, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {SafeUrl} from "@angular/platform-browser";
import {UserModel} from "../../../core/models/user-models/user-model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent  implements  OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  user: UserModel = {} as UserModel;
  imagePath: any;
  changeUserPhoto = false;
  message: string | undefined;
  private formData = new FormData();
  isSpinner: boolean = false;

  constructor(
    private imgSanitaze: ImgSanitizerService,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changePhoto(): void {
    this.changeUserPhoto = !this.changeUserPhoto;
    if (this.imagePath != null) this.imagePath = null;
  }

  updateUserPhoto() {
    this.userService.updateUserPhoto(this.formData).pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        this.user.userImg = response.link;
        this.updateUserInNav();
        this.changeUserPhoto = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  onFileChanged(event: any): void {
    const file = event.target.files[0];
    if (file.type.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    this.formData.append('userProfileImage', file, file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imagePath = reader.result;
    }
  }

  sanitizeUserImg(img: string): SafeUrl {
    return this.imgSanitaze.sanitiizeUserImg(img);
  }

  getUser(): void {
    this.isSpinner = true;
    this.userService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        this.user = response;
        this.isSpinner = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.isSpinner = false;
      }
    );
  }

  updateUserInNav(): void {
    this.userService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        this.userService.userProfile = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }
}
