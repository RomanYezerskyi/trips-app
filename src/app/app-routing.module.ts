import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./core/guards/auth-guard/auth.guard";

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth-module/auth-module.module').then( m => m.AuthModulePageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then( m => m.UserPageModule),
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
