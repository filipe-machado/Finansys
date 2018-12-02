import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // nomedosite.com/categories -> cai dentro do módulo passado
  { path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesModule' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// nomedosite.com/categories -> list (Master)
// nomedosite.com/categories/23 -> form (Detail)
