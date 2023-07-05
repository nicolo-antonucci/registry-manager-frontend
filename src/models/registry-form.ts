import { FormControl } from "@angular/forms";

export interface RegistryForm {
  name: FormControl<string>;
  surname: FormControl<string>;
  email: FormControl<string>;
  address: FormControl<string>;
  location: FormControl<string>;
  city: FormControl<string>;
  province: FormControl<string>;
  notes: FormControl<string>;
}
