import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NewRegistryComponent } from "./components/new-registry/new-registry.component";
import { RegistriesComponent } from "./components/registries/registries.component";
import { ViewRegistryComponent } from "./components/view-registry/view-registry.component";
import { CustomizableModalComponent } from './components/customizable-modal/customizable-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GetSetLengthPipe } from './pipes/get-set-length.pipe';
import { GetValuePipe } from './pipes/get-value.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RegistriesComponent,
    NewRegistryComponent,
    ViewRegistryComponent,
    CustomizableModalComponent,
    GetSetLengthPipe,
    GetValuePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
