import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OficinaIndexComponent } from './oficina-index/oficina-index.component';

const routes: Routes = [
  {
    path: '',
    component: OficinaIndexComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OficinaListRoutingModule { }
