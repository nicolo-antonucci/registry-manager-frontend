import { HttpStatusCode } from "@angular/common/http";
import { BaseError } from "./base-error";

export interface DeleteRegistryResponseSchema {
  code: HttpStatusCode;
  success: boolean;
  error: BaseError;
}
