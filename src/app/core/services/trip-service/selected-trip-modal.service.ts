import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SelectedTripModalService {
  public _modalOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() { }
}
