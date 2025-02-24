import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RawMaterialComponent } from './components/raw-material/raw-material.component';
import { DeviceComponent } from './components/device/device.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'raw-material',
    component: RawMaterialComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
