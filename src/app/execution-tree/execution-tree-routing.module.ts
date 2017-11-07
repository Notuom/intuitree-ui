import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {ExecutionTreeComponent} from './execution-tree/execution-tree.component';

const executionTreeRoutes: Routes = [
  {
    path: '',
    component: ExecutionTreeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(executionTreeRoutes)],
  exports: [RouterModule]
})
export class ExecutionTreeRoutingModule {
}
