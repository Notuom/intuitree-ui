import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DataManagementRoutingModule} from './data-management-routing.module';
import {DataManagementComponent} from './data-management/data-management.component';
import {ImportService} from './import.service';
import {FormsModule} from '@angular/forms';
import {ExportService} from './export.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataManagementRoutingModule
  ],
  declarations: [DataManagementComponent],
  providers: [ImportService, ExportService]
})
export class DataManagementModule {
}
