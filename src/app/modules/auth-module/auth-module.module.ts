import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthModulePageRoutingModule } from './auth-module-routing.module';
import { AuthModulePage } from './auth-module.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthModulePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthModulePage,
  ]
})
export class AuthModulePageModule {}
