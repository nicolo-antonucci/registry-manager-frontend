import { BaseError } from "./base-error";
import { Registry } from "./registry";

export interface ReadRegistriesResponseSchema {
  success: boolean;
  payload: ReadRegistriesDto | null;
  error?: BaseError | null;
}

export interface ReadRegistriesDto {
  registries: Set<Registry>;
  page: number;
  pages: number;
  elementsPerPage: number;
  totalElements: number;
}
