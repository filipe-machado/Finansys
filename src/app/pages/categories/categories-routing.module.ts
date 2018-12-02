import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';

const routes: Routes = [
  // deixado em branco para entrar diretamente pela URI, do contrário seria nomedosite.com/categories/caminhoEspecificado
  { path: '', component: CategoryListComponent },
  // quando for passado o ID, cairá diretamente no form
  { path: 'new', component: CategoryFormComponent },
  { path: ':id/edit', component: CategoryFormComponent }
];

// nomedosite.com/categories -> list (Master) carrega a lista
// nomedosite.com/categories/new -> form (Detail) novo recurso
// nomedosite.com/categories/:id/edit -> form (Detail) edita o recurso

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
