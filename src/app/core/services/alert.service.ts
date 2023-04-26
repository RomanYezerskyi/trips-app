import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";


export interface IAlertInterface{
  show: boolean,
  message?: string,
  error: boolean,
  icon?: string
}

const EMPTY_ALERT: IAlertInterface = { show: false, message: undefined, error: false, icon: undefined }


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public _showAlert: BehaviorSubject<IAlertInterface> = new BehaviorSubject(EMPTY_ALERT);

  constructor() { }

  public showMessage(value: IAlertInterface) {
    this._showAlert.next(value);
    setTimeout(() => this._showAlert.next(EMPTY_ALERT), 5000);
  }

}
