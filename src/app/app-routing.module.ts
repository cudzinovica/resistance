import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { IngameComponent } from './ingame/ingame.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':gameId', component: IngameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
