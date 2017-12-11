import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DataManagementRoutingModule} from './data-management-routing.module';
import {DataManagementComponent} from './data-management/data-management.component';
import {DataManagementService} from './data-management.service';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataManagementRoutingModule
  ],
  declarations: [DataManagementComponent],
  providers: [DataManagementService]
})
export class DataManagementModule {
}
