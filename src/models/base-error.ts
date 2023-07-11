import { HttpStatusCode } from "@angular/common/http";

export interface BaseError {
  code: HttpStatusCode;
  message: string;
}
