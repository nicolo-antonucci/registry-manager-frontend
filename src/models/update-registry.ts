import { BaseError } from "./base-error";

export interface UpdateRegistryResponse {
  success: boolean;
  payload: { page: number };
  error: BaseError;
}
