import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DataManagementRoutingModule} from './data-management-routing.module';
import {DataManagementComponent} from './data-management/data-management.component';
import {DataManagementService} from './data-management.service';

@NgModule({
  imports: [
    CommonModule,
    DataManagementRoutingModule
  ],
  declarations: [DataManagementComponent],
  providers: [DataManagementService]
})
export class DataManagementModule {
}
