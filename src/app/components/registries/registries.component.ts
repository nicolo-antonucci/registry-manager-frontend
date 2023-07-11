import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { HandleRegistryEvent } from "src/models/enums";
import { NewRegistry, Registry } from "src/models/registry";
import {
  ReadRegistriesBody,
  ReadRegistriesDto,
} from "../../../models/read-registries";
import { RegistryHttpService } from "../../services/registry-http.service";
import { CustomizableModalComponent } from "../customizable-modal/customizable-modal.component";
import { HandleRegistryModalComponent } from "../handle-registry-modal/handle-registry-modal.component";
import { NewRegistryComponent } from "../new-registry/new-registry.component";

@Component({
  selector: "app-registries",
  templateUrl: "./registries.component.html",
  styleUrls: ["./registries.component.scss"],
})
export class RegistriesComponent implements OnDestroy, OnInit {
  data$!: Observable<ReadRegistriesDto | null>;
  selectedSort: {
    sort: string;
    dir: "asc" | "desc";
  } = {
    dir: "asc",
    sort: "name",
  };
  readRegistriesBody: ReadRegistriesBody = {
    address: null,
    city: null,
    email: null,
    location: null,
    name: null,
    notes: null,
    province: null,
    surname: null,
  };
  page: number | null = 0;
  size = 10;

  private sub!: Subscription;

  constructor(
    private ngbModal: NgbModal,
    private registryHttp: RegistryHttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @HostListener("window:resize", ["$event"])
  getRowsNumber(): void {
    const height = window.innerHeight;
    const width = window.innerWidth;

    if (width < height) {
      this.size = Math.floor((height - 300) / 100);
    } else {
      if (width < 1200) this.size = Math.floor((height - 200) / 36);
      else this.size = Math.floor((height - 300) / 36);
    }
  }

  ngOnInit(): void {
    this.page = this.route.snapshot.queryParamMap.get("page")
      ? +(this.route.snapshot.queryParamMap.get("page") as string)
      : null;

    this.data$ = this.registryHttp.registries;

    this.getRowsNumber();

    this.registryHttp.readRegistries(this.readRegistriesBody, {
      page: this.page ?? null,
      size: this.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  addRegistry(pageParams: {
    page: number | null;
    size: number | null;
    sort: string | null;
    dir: "asc" | "desc" | null;
  }): void {
    const modalRef = this.ngbModal.open(NewRegistryComponent, {
      backdrop: "static",
      centered: true,
    });
    modalRef.result.then((newRegistry: NewRegistry) =>
      this.registryHttp.postRegistries(newRegistry, this.readRegistriesBody, {
        page: pageParams.page,
        size: pageParams.size,
        sort: pageParams.sort,
        dir: pageParams.dir,
      })
    );
  }

  cleanupRoute(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
    this.page = null;
  }

  deleteEntry(registry: Registry): void {
    const modalRef = this.ngbModal.open(CustomizableModalComponent, {
      backdrop: "static",
      centered: true,
    });
    modalRef.componentInstance.title = "Attenzione";
    modalRef.componentInstance.text =
      "Sei certo di voler eliminare questa anagrafica? Non potrà essere recuperata";
    modalRef.componentInstance.okBtnLabel = "Conferma";
    modalRef.componentInstance.cancelBtnLabel = "Annulla";
    modalRef.result.then(() =>
      this.registryHttp.deleteRegistry(registry.id, this.readRegistriesBody, {
        page: this.page ?? null,
        size: this.size ?? null,
        sort: this.selectedSort.sort,
        dir: this.selectedSort.dir,
      })
    );
  }

  edit(registry: Registry): void {
    this.router.navigate([`../registry/${registry.id}`]);
  }

  goToPage(page: number): void {
    this.registryHttp.readRegistries(this.readRegistriesBody, {
      page,
      size: this.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });

    this.cleanupRoute();
  }

  handleActionRequest(action: {
    registry: Registry;
    type: HandleRegistryEvent;
  }): void {
    switch (action.type) {
      case HandleRegistryEvent.DELETE:
        this.deleteEntry(action.registry);
        break;
      case HandleRegistryEvent.EDIT:
        this.edit(action.registry);
        break;
      case HandleRegistryEvent.MAIL:
        this.sendEmail(action.registry);
        break;
    }
  }

  handleRegistry(registry: Registry): void {
    const modalRef = this.ngbModal.open(HandleRegistryModalComponent, {
      backdrop: "static",
      centered: true,
    });
    modalRef.result.then((type) =>
      this.handleActionRequest({ registry, type })
    );
  }

  mobileSort(value: string): void {
    this.selectedSort = {
      dir:
        this.selectedSort.sort === value
          ? "asc"
          : this.selectedSort.dir === "asc"
          ? "desc"
          : "asc",
      sort: value,
    };

    this.cleanupRoute();

    this.registryHttp.readRegistries(this.readRegistriesBody, {
      page: this.page ?? null,
      size: this.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });
  }

  requestData(request: {
    readRegistriesBody: ReadRegistriesBody;
    pageParams: {
      page: number | null;
      size: number | null;
      sort: string | null;
      dir: "asc" | "desc" | null;
    };
  }): void {
    this.registryHttp.readRegistries(
      request.readRegistriesBody,
      request.pageParams
    );
  }

  search(): void {
    this.cleanupRoute();

    this.registryHttp.readRegistries(this.readRegistriesBody, {
      page: this.page ?? null,
      size: this.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });
  }

  sendEmail(registry: Registry): void {
    this.registryHttp.sendEmail(registry.id);
    const modalRef = this.ngbModal.open(CustomizableModalComponent, {
      backdrop: "static",
      centered: true,
    });
    modalRef.componentInstance.title = "Invio di email";
    modalRef.componentInstance.text = `Email inviata a ${registry.email}`;
    modalRef.componentInstance.okBtnLabel = "Chiudi";
  }

  sort(sort: string, dir: "asc" | "desc"): void {
    this.selectedSort = {
      dir,
      sort,
    };

    this.cleanupRoute();

    this.registryHttp.readRegistries(this.readRegistriesBody, {
      page: this.page ?? null,
      size: this.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });
  }
}
