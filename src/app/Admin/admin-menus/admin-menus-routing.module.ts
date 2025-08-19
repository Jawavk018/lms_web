import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMenusComponent } from './admin-menus.component';

const routes: Routes = [{ path: '', component: AdminMenusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminMenusRoutingModule { }
