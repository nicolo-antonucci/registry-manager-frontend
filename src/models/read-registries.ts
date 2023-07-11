import { FormControl } from "@angular/forms";
import { BaseError } from "./base-error";
import { Registry } from "./registry";

export interface ReadRegistriesBody {
  name: string | null;
  surname: string | null;
  address: string | null;
  location: string | null;
  city: string | null;
  province: string | null;
  email: string | null;
  notes: string | null;
}

export interface ReadRegistriesResponseSchema {
  success: boolean;
  payload: ReadRegistriesDto | null;
  error?: BaseError | null;
}

export interface ReadRegistriesDto {
  registries: Set<Registry>;
  page: number;
  pages: number;
  size: number;
  totalElements: number;
  highlightedElement: number | null;
}

export interface ReadRegistriesForm {
  name: FormControl<string | null>;
  surname: FormControl<string | null>;
  address: FormControl<string | null>;
  location: FormControl<string | null>;
  city: FormControl<string | null>;
  province: FormControl<string | null>;
  email: FormControl<string | null>;
  notes: FormControl<string | null>;
}
