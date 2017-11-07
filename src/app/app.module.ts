import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {ExecutionTreeModule} from './execution-tree/execution-tree.module';
import {DataManagementModule} from './data-management/data-management.module';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ExecutionTreeModule,
    DataManagementModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
