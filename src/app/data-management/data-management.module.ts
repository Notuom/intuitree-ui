import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DataManagementComponent} from './data-management/data-management.component';
import {DataManagementRoutingModule} from "./data-management-routing.module";

@NgModule({
  imports: [
    CommonModule,
    DataManagementRoutingModule
  ],
  declarations: [DataManagementComponent]
})
export class DataManagementModule {
}
