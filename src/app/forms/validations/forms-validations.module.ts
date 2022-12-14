import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';
import { FormsValidationsPage } from './forms-validations.page';

import { ReportCrudService } from './report-crud.service';

const routes: Routes = [
  {
    path: '',
    component: FormsValidationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  providers: [ReportCrudService],
  declarations: [FormsValidationsPage]
})
export class FormsValidationsPageModule {}
