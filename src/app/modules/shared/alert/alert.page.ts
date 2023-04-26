import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {AlertService} from "../../../core/services/alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AlertPage implements OnInit {

  isToastOpen = false;
  message: string | undefined = ""

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.setOpen();
  }

  setOpen() {
    this.alertService._showAlert.subscribe((data)=>{
      this.message = data.message;
      this.isToastOpen = data.show;
    })
  }

}
