import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {ExecutionTreeComponent} from './execution-tree/execution-tree.component';
import {ExecutionTreeRoutingModule} from "./execution-tree-routing.module";
import {SharedModule} from "../shared/shared.module";
import {AlertModule, TooltipModule} from "ngx-bootstrap";

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
  declarations: [ExecutionTreeComponent]
})
export class ExecutionTreeModule {
}
