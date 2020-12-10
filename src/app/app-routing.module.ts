import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from "./page/index/index.component";
import {HomeComponent} from "./page/home/home.component";

const routes: Routes = [
  {
    path: "index",
    component: IndexComponent,
    // canActivate: [LoginCheckService],
    children: [
      {
        path: "home",
        component: HomeComponent
      }
    ]
  },
  // {
  //   path: "login",
  //   component: LoginComponent
  // },
  {
    path: "**",
    redirectTo: "index/home"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
