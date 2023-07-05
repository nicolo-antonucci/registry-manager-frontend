import { BaseError } from "./base-error";

export interface DeleteRegistryResponseSchema {
  success: boolean;
  payload: DeleteRegistryResponse | null;
  error?: BaseError | null;
}

export interface DeleteRegistryResponse {
  deleted: boolean;
}
