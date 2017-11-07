import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {DataManagementComponent} from './data-management/data-management.component';

const dataManagementRoutes: Routes = [
  {
    path: '',
    component: DataManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(dataManagementRoutes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule {
}
