import { BaseError } from "./base-error";
import { Registry } from "./registry";

export interface GetRegistryResponse {
  success: boolean;
  payload: Registry | null;
  error?: BaseError | null;
}
