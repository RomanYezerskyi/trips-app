import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth-service/auth-service.service";
import {AlertService} from "../../../core/services/alert.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoginModel} from "../../../core/models/auth-models/login-model";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  credentials: LoginModel = { email: '', password: '' };
  ionicForm!: FormGroup;
  isSubmitted = false;
  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router) {
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    })
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
      this.loginUser();
    }
  }

  loginUser(): void {
    this.credentials.email = this.ionicForm.controls['email'].value;
    this.credentials.password = this.ionicForm.controls['password'].value;
    this.authService.login(this.credentials)
      .pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
          this.router.navigateByUrl("/user");
      },
      (error: HttpErrorResponse) => {
        this.alertService.showMessage({show: true, message: "Something went wrong", error: true});
      }
    );
  }
}
