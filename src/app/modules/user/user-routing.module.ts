import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPage } from './user.page';
import {HomeComponent} from "./home/home.component";
import {TripsListComponent} from "./trips-list/trips-list.component";


const routes: Routes = [
  {
    path: '',
    component: UserPage,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'search',
        component: TripsListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
