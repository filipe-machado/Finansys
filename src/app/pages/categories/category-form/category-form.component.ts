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

  submitForm() {
    this.submittingForm = true; // O formulário está sendo enviado
    
    // se está editando ou criando uma nova categoria
    if(this.currentAction == "new") {
      this.createCategory();
    } else {
      this.updateCategory();
    }
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

  private createCategory() { 
    // Criando um objeto Category novo, que será atribuido à ele os valores de categoryForm (utilizando o Object.assign), o resultado será atribuido à constante criada
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category) // Passando o objeto que foi criado
    .subscribe( // Subscrevendo o objeto
      category => this.actionsForSuccess(category), 
      error => this.actionsForError(error)
    )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    
    this.categoryService.update(category)
    .subscribe( // Subscrevendo o objeto
      category => this.actionsForSuccess(category), 
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(category: Category) {
    toastr.success("Solicitação processada com sucesso!");

    /* retorna uma Promise
    ** param1: redireciona rapidamente a rota de forma forçada para a url passada 
    ** param2: não passa a url para o histórico do navegador, ou seja, não retornará para essa página naturalmente
    ** função: then() aguarda a resposta da Promise e retorna uma função passando as rotas dentro do array
    */
    this.router.navigateByUrl("categories", {skipLocationChange: true}).then( 
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error) {
    toastr.error("Ocorreu um erro ao processa sua solicitação!");

    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Tente mais tarde."];
    }
  }
}
