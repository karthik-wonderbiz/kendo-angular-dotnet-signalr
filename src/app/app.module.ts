import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule, ButtonsModule, KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { ChartsModule } from "@progress/kendo-angular-charts";
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { KENDO_CHARTWIZARD } from "@progress/kendo-angular-chart-wizard";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RawMaterialComponent } from './components/raw-material/raw-material.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeviceComponent } from './components/device/device.component';
import { LayoutModule } from '@progress/kendo-angular-layout';

@NgModule({
  declarations: [
    AppComponent,
    RawMaterialComponent,
    DashboardComponent,
    DeviceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,

    LayoutModule,
    GridModule,
    InputsModule,
    ButtonModule,
    ButtonsModule,
    NotificationModule,
    ChartsModule,
    DateInputsModule,
    DropDownListModule,
    [KENDO_BUTTONS, KENDO_CHARTWIZARD],
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }