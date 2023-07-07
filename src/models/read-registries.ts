import { BaseError } from "./base-error";
import { Registry } from "./registry";

export interface ReadRegistriesBody {
  name?: string | null;
  surname?: string | null;
  address?: string | null;
  location?: string | null;
  city?: string | null;
  province?: string | null;
  email?: string | null;
  notes?: string | null;
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
