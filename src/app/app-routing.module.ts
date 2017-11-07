import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PageNotFoundComponent} from './core/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {
    path: 'execution-tree',
    loadChildren: 'app/execution-tree/execution-tree.module#ExecutionTreeModule'
  },
  {
    path: 'data-management',
    loadChildren: 'app/data-management/data-management.module#DataManagementModule'
  },
  // Default path
  {
    path: '',
    redirectTo: '/execution-tree',
    pathMatch: 'full'
  },
  // Path not found
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        preloadingStrategy: PreloadAllModules
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
