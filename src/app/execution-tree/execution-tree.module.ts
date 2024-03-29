import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ExecutionTreeComponent} from './execution-tree/execution-tree.component';
import {ExecutionTreeRoutingModule} from './execution-tree-routing.module';
import {SharedModule} from '../shared/shared.module';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';
import {TreeViewComponent} from './tree-view/tree-view.component';
import {LogDetailsComponent} from './log-details/log-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    SharedModule,
    ExecutionTreeRoutingModule
  ],
  declarations: [ExecutionTreeComponent, TreeViewComponent, LogDetailsComponent]
})
export class ExecutionTreeModule {
}
