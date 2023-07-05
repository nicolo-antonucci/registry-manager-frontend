import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegistriesComponent } from "./components/registries/registries.component";
import { ViewRegistryComponent } from "./components/view-registry/view-registry.component";

const routes: Routes = [
  { path: "registries", component: RegistriesComponent },
  { path: "registry/:id", component: ViewRegistryComponent },
  {
    path: "",
    redirectTo: "registries",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
