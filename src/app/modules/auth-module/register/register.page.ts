import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegisterModel} from "../../../core/models/auth-models/register-model";
import {AuthService} from "../../../core/services/auth-service/auth-service.service";
import {AlertService} from "../../../core/services/alert.service";
import {environment} from "../../../../environments/environment";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  credentials: RegisterModel = {} as RegisterModel;
  ionicForm!: FormGroup;
  isSubmitted = false;

  constructor(public formBuilder: FormBuilder, private authService: AuthService, private alertService: AlertService) {
    this.ionicForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  submitForm(): void {
    this.isSubmitted = true;
    if (this.ionicForm.valid) {
      this.registerNewUser();
    }
  }

  registerNewUser(): void {
    this.credentials.clientURI = environment.emailConfirmation;
    this.credentials.email = this.ionicForm.controls['email'].value;
    this.credentials.firstName = this.ionicForm.controls['firstName'].value;
    this.credentials.password = this.ionicForm.controls['password'].value;
    this.credentials.phoneNum = this.ionicForm.controls['phoneNumber'].value;
    this.authService.Register(this.credentials).pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        this.alertService.showMessage({show: true, message: "You have successfully registered!\n Now go to your email and verify it", error: false});
      },
      (error: HttpErrorResponse) => {
        this.alertService.showMessage({show: true, message: "Something went wrong", error: true})
      }
    )
  }
}
