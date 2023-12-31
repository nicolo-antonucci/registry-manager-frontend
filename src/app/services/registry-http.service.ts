import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Observable, map, take } from "rxjs";
import { BaseError } from "src/models/base-error";
import { DeleteRegistryResponseSchema } from "src/models/delete-registry";
import { GetRegistryResponse } from "src/models/get-registry";
import { NewRegistry, Registry } from "src/models/registry";
import { UpdateRegistryResponse } from "src/models/update-registry";
import {
  ReadRegistriesBody,
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

  private readonly baseUrl = "http://localhost:4200/api/registries";

  constructor(private http: HttpClient, private ngbModal: NgbModal) {
    this.registries = this.registriesSubject.asObservable();
  }

  readRegistries(
    readRegistriesBody: ReadRegistriesBody,
    pageParams?: {
      page: number | null;
      size: number | null;
      sort: string | null;
      dir: "asc" | "desc" | null;
    }
  ): void {
    const params: {
      [param: string]:
        | string
        | number
        | boolean
        | readonly (string | number | boolean)[];
    } = {};

    if (pageParams?.page) params["page"] = pageParams.page;

    if (pageParams?.size) params["size"] = pageParams.size;

    if (pageParams?.sort)
      params["sort"] = pageParams.dir
        ? `${pageParams.sort},${pageParams.dir}`
        : pageParams.sort;

    this.http
      .post<ReadRegistriesResponseSchema>(
        `${this.baseUrl}`,
        JSON.stringify(readRegistriesBody),
        {
          headers: { "Content-Type": "application/json" },
          params,
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
          modalRef.componentInstance.text =
            "Si è verificato un errore nel caricamento delle anagrafiche";
          modalRef.componentInstance.okBtnLabel = "Riprova";
          modalRef.result.then(
            () => {
              this.readRegistries(readRegistriesBody, pageParams);
            },
            () => this.registriesSubject.next(null)
          );
        },
      });
  }

  postRegistries(
    newRegistry: NewRegistry,
    readRegistriesBody: ReadRegistriesBody,
    pageParams?: {
      page: number | null;
      size: number | null;
      sort: string | null;
      dir: "asc" | "desc" | null;
    }
  ): void {
    const params: {
      [param: string]:
        | string
        | number
        | boolean
        | readonly (string | number | boolean)[];
    } = {};

    if (pageParams?.page) params["page"] = pageParams.page;

    if (pageParams?.size) params["size"] = pageParams.size;

    if (pageParams?.sort)
      params["sort"] = pageParams.dir
        ? `${pageParams.sort},${pageParams.dir}`
        : pageParams.sort;

    this.http
      .post<ReadRegistriesResponseSchema>(
        `${this.baseUrl}/new`,
        JSON.stringify({ newRegistry, readRegistriesBody }),
        {
          headers: { "Content-Type": "application/json" },
          params,
        }
      )
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.registriesSubject.next(res.payload);
        },
        error: (error) => {
          const modalRef = this.ngbModal.open(CustomizableModalComponent, {
            windowClass: "small-modal",
            backdrop: "static",
            centered: true,
          });

          switch (error.code) {
            case HttpStatusCode.BadRequest:
              modalRef.componentInstance.title = "Attenzione";
              modalRef.componentInstance.text =
                "Non è stato possibile creare l'anagrafica";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;

            case HttpStatusCode.Conflict:
              modalRef.componentInstance.title = "Attenzione";
              modalRef.componentInstance.text =
                "Non è stato possibile eliminare l'anagrafica, si è verificato un conflitto";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;
          }
        },
      });
  }

  deleteRegistry(
    registryId: number,
    readRegistriesBody: ReadRegistriesBody,
    pageParams?: {
      page: number | null;
      size: number | null;
      sort: string | null;
      dir: "asc" | "desc" | null;
    }
  ): void {
    this.http
      .delete<DeleteRegistryResponseSchema>(`${this.baseUrl}/${registryId}`, {
        headers: { "Content-Type": "application/json" },
      })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.readRegistries(readRegistriesBody, pageParams);
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
              modalRef.componentInstance.text =
                "Non è stato possibile eliminare l'anagrafica, è stato passato un id invalido";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;

            case HttpStatusCode.Conflict:
              modalRef.componentInstance.title = "Attenzione";
              modalRef.componentInstance.text =
                "Non è stato possibile eliminare l'anagrafica, si è verificato un conflitto";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;

            case HttpStatusCode.NotFound:
              modalRef.componentInstance.title = "Attenzione";
              modalRef.componentInstance.text =
                "Non è stato possibile trovare ed eliminare l'anagrafica richiesta";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;

            default:
              modalRef.componentInstance.title = "Attenzione";
              modalRef.componentInstance.text =
                "Non è stato possibile eliminare l'anagrafica a causa di un errore interno";
              modalRef.componentInstance.okBtnLabel = "Chiudi";
              break;
          }
        },
      });
  }

  getRegistry(id: number): Observable<Registry | null> {
    return this.http
      .get<GetRegistryResponse>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.payload));
  }

  updateRegistry(registry: Registry): Observable<UpdateRegistryResponse> {
    return this.http
      .post<UpdateRegistryResponse>(
        `${this.baseUrl}/${registry.id}`,
        JSON.stringify({ ...registry }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .pipe(take(1));
  }

  sendEmail(id: number): void {
    this.http
      .get(`${this.baseUrl}/send-mail/${id}`)
      .pipe(take(1))
      .subscribe({});
  }
}
