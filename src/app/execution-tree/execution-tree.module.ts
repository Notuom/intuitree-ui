import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutionTreeComponent } from './execution-tree/execution-tree.component';
import {ExecutionTreeRoutingModule} from "./execution-tree-routing.module";

@NgModule({
  imports: [
    CommonModule,
    ExecutionTreeRoutingModule
  ],
  declarations: [ExecutionTreeComponent]
})
export class ExecutionTreeModule { }
