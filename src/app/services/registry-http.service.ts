import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Observable, take } from "rxjs";
import { BaseError } from "src/models/base-error";
import { DeleteRegistryResponse } from "src/models/delete-registry";
import {
  ReadRegistriesDto,
  ReadRegistriesResponseSchema,
} from "../../models/read-registries";
import { CustomizableModalComponent } from "../components/customizable-modal/customizable-modal.component";

@Injectable({
  providedIn: "root",
})
export class RegistryHttpService {
  public registries: Observable<ReadRegistriesDto | null>;
  private registriesSubject: BehaviorSubject<ReadRegistriesDto | null> =
    new BehaviorSubject<ReadRegistriesDto | null>(null);

  private readonly baseUrl = "http://localhost:4200/api/";

  constructor(private http: HttpClient, private ngbModal: NgbModal) {
    this.registries = this.registriesSubject.asObservable();
  }

  getRegistries(page: number, elementsPerPage: number): void {
    this.http
      .post<ReadRegistriesResponseSchema>(
        `${this.baseUrl}registries`,
        JSON.stringify({ page, elementsPerPage }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.registriesSubject.next(res.payload);
        },
        error: () => {
          const modalRef = this.ngbModal.open(CustomizableModalComponent, {
            windowClass: "small-modal",
            backdrop: "static",
            centered: true,
          });
          modalRef.componentInstance.title = "Attenzione";
          modalRef.componentInstance.body =
            "Si è verificato un errore nel caricamento delle anagrafiche";
          modalRef.componentInstance.okBtnLabel = "Riprova";
          modalRef.componentInstance.cancelBtnLabel = "Chiudi";
          modalRef.result.then(
            () => {
              this.getRegistries(page, elementsPerPage);
            },
            () => this.registriesSubject.next(null)
          );
        },
      });
  }

  deleteRegistry(
    registryId: number,
    page: number,
    elementsPerPage: number
  ): void {
    this.http
      .delete<DeleteRegistryResponse>(`${this.baseUrl}${registryId}`, {
        headers: { "Content-Type": "application/json" },
      })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getRegistries(page, elementsPerPage);
        },
        error: (error: BaseError) => {
          const modalRef = this.ngbModal.open(CustomizableModalComponent, {
            windowClass: "small-modal",
            backdrop: "static",
            centered: true,
          });

          switch (error.code) {
            case HttpStatusCode.BadRequest:
              modalRef.componentInstance.title = "Attenzione";
              modalRef.componentInstance.body =
                "Non è stato possibile eliminare l'anagrafica, è stato passato un id invalido";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;

            case HttpStatusCode.Conflict:
              modalRef.componentInstance.title = "Attenzione";
              modalRef.componentInstance.body =
                "Non è stato possibile eliminare l'anagrafica, si è verificato un conflitto";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;

            case HttpStatusCode.NotFound:
              modalRef.componentInstance.title = "Attenzione";
              modalRef.componentInstance.body =
                "Non è stato possibile trovare ed eliminare l'anagrafica richiesta";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;

            default:
              modalRef.componentInstance.title = "Attenzione";
              modalRef.componentInstance.body =
                "Non è stato possibile eliminare l'anagrafica a causa di un errore interno";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;
          }
        },
      });
  }
}
