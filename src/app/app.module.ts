import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { GetPropPipe } from './pipes/get-prop.pipe';
import { InfoComponent } from './components/info/info.component';
import { InputComponent } from './components/input/input.component';
import { RequiredFormPipe } from './pipes/required-form.pipe';
import { InvalidFormPipe } from './pipes/invalid-form.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RegistriesComponent,
    NewRegistryComponent,
    ViewRegistryComponent,
    CustomizableModalComponent,
    GetSetLengthPipe,
    GetValuePipe,
    GetPropPipe,
    InfoComponent,
    InputComponent,
    RequiredFormPipe,
    InvalidFormPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
