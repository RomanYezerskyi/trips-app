import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPage } from './user.page';
import {HomeComponent} from "./home/home.component";
import {SearchFormComponent} from "../shared/search-form/search-form.component";


const routes: Routes = [
  {
    path: '',
    component: UserPage,
    children: [
      {
        path: '',
        component: SearchFormComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
