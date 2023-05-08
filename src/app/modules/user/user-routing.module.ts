import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPage } from './user.page';
import {HomeComponent} from "./home/home.component";
import {TripsListComponent} from "./trips-list/trips-list.component";
import {ProfileComponent} from "./profile/profile.component";
import {CurrentTripsComponent} from "./current-trips/current-trips.component";


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
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'search',
        component: TripsListComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'current',
        component: CurrentTripsComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
