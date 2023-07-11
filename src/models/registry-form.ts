import { FormControl } from "@angular/forms";

export interface NewRegistryForm {
  name: FormControl<string | null>;
  surname: FormControl<string | null>;
  email: FormControl<string | null>;
  address: FormControl<string | null>;
  location: FormControl<string | null>;
  city: FormControl<string | null>;
  province: FormControl<string | null>;
  notes: FormControl<string | null>;
}

export interface RegistryForm {
  name: FormControl<string | null>;
  surname: FormControl<string | null>;
  email: FormControl<string | null>;
  address: FormControl<string | null>;
  location: FormControl<string | null>;
  city: FormControl<string | null>;
  province: FormControl<string | null>;
  notes: FormControl<string | null>;
  id: FormControl<number | null>;
}
