import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-cotegory-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  currentAction: string; // Ação atual
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category(); /* Se o currentAction for "editando", procura a requisição no
  servidor pra pegar o categories/id e o servidor tras o objeto, que é carregado no category para editar */

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.setCurrentAction(); /* Define qual ação está sendo executada */
    this.buildCategoryForm(); /* Constrói um formulário */
    this.loadCategory(); /* Carrega a cetegoria em questão */
  }

  // É invocado após mudanças serem detectadas na página
  ngAfterContentChecked(): void {
    // Utiliza os dados para serem colocados no título, setando o título com o nome da categoria, mesmo após ela sendo editada
    this.setPageTitle();
  }

  // PRIVATE METHODS

  private setCurrentAction() {
    // tira uma 'imagem' da rota, recurando a url na posição 0 do caminho (/categories/12/edit) e compara com a string
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    }) ;
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id'))) // O '+' faz casting do valor recebido para número
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(this.category); // binds loaded category data to CategoryForm
        },
        (error) => alert('Ocorreu algum erro no servidor')
      );
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de nova categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

}
