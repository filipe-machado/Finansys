import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// importação necessária para a aplicação não realizar busca numa api externa
// deve ser removido em uma api real
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
// deve ser removido em uma api real
import { InMemoryDatabase } from "./in-memory-database";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase) // deve ser removido em uma api real
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
