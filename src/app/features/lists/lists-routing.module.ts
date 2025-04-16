import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOverviewComponent } from './list-overview/list-overview.component';
import { ListDetailComponent } from './list-detail/list-detail.component';

const routes: Routes = [
  { path: '', component: ListOverviewComponent },
  { path: ':id', component: ListDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListsRoutingModule { }
