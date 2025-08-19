import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminMenusRoutingModule } from './admin-menus-routing.module';
import { AdminMenusComponent } from './admin-menus.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HeaderComponent } from './header/header.component';
import { CategoriesComponent } from './categories/categories.component';
import { CreateSlidesComponent } from './create-slides/create-slides.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { TopicsComponent } from './topics/topics.component';


@NgModule({
  declarations: [
    AdminMenusComponent,
    CreateSlidesComponent,
  ],
  imports: [
    CommonModule,
    AdminMenusRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    HeaderComponent,
    CategoriesComponent,
    SubCategoriesComponent,
    TopicsComponent
  ]
})
export class AdminMenusModule { }
