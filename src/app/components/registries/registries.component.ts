import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faArrowDown,
  faArrowUp,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription, tap } from "rxjs";
import { Header } from "src/models/header";
import { NewRegistry, Registry } from "src/models/registry";
import { ReadRegistriesDto } from "../../../models/read-registries";
import { RegistryHttpService } from "../../services/registry-http.service";
import { CustomizableModalComponent } from "../customizable-modal/customizable-modal.component";
import { NewRegistryComponent } from "../new-registry/new-registry.component";

@Component({
  selector: "app-registries",
  templateUrl: "./registries.component.html",
  styleUrls: ["./registries.component.scss"],
})
export class RegistriesComponent implements OnDestroy, OnInit {
  data$!: Observable<ReadRegistriesDto | null>;
  headers: Header[] = [
    {
      label: "Nome",
      value: "name",
      searchValue: "",
    },
    {
      label: "Cognome",
      value: "surname",
      searchValue: "",
    },
    {
      label: "Indirizzo",
      value: "address",
      searchValue: "",
    },
    {
      label: "Località",
      value: "location",
      searchValue: "",
    },
    {
      label: "Città",
      value: "city",
      searchValue: "",
    },
    {
      label: "Provincia",
      value: "province",
      searchValue: "",
    },
    {
      label: "Email",
      value: "email",
      searchValue: "",
    },
    {
      label: "Note",
      value: "notes",
      searchValue: "",
    },
  ];
  searchForm!: FormGroup<{
    name: FormControl<string | null>;
    surname: FormControl<string | null>;
    address: FormControl<string | null>;
    location: FormControl<string | null>;
    city: FormControl<string | null>;
    province: FormControl<string | null>;
    email: FormControl<string | null>;
    notes: FormControl<string | null>;
  }>;
  pageForm!: FormGroup<{
    page: FormControl<number | null>;
    size: FormControl<number | null>;
  }>;
  selectedSort: {
    value: string;
    descending: boolean;
  } = {
    descending: false,
    value: "name",
  };

  readonly faUp = faArrowUp;
  readonly faDown = faArrowDown;
  readonly faSearch = faMagnifyingGlass;
  readonly faEdit = faPen;
  readonly faDelete = faTrash;
  readonly faAdd = faPlus;
  readonly faFirst = faAngleDoubleLeft;
  readonly faPrevious = faAngleLeft;
  readonly faNext = faAngleRight;
  readonly faLast = faAngleDoubleRight;

  private sub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private ngbModal: NgbModal,
    private registryHttp: RegistryHttpService,
    private router: Router
  ) {}

  get page(): number {
    return this.pageForm.value.page ?? 0;
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: this.fb.control<string>(""),
      surname: this.fb.control<string>(""),
      address: this.fb.control<string>(""),
      location: this.fb.control<string>(""),
      city: this.fb.control<string>(""),
      province: this.fb.control<string>(""),
      email: this.fb.control<string>(""),
      notes: this.fb.control<string>(""),
    });

    this.pageForm = this.fb.group({
      size: this.fb.control<number>(20, {
        validators: Validators.min(1),
      }),
      page: this.fb.control<number>(0, { validators: Validators.min(0) }),
    });

    this.data$ = this.registryHttp.registries.pipe(
      tap((data) => {
        if (data?.pages && this.page) {
          this.pageForm.controls.page.setValue(
            data.page < data.pages ? data.page : data.pages - 1
          );
        }

        if (data?.size) {
          this.pageForm.controls.size.setValue(data.size)
        }
      })
    );

    this.registryHttp.readRegistries(
      this.searchForm.value,
      this.page ?? 0,
      this.pageForm.value.size ?? 20,
      this.selectedSort.value ?? "name",
      this.selectedSort.descending ? "desc" : "asc"
    );
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  addRegistry(page: number, size: number): void {
    const modalRef = this.ngbModal.open(NewRegistryComponent, {
      windowClass: "auto-modal",
      backdrop: "static",
      centered: true,
    });
    modalRef.result.then((newRegistry: NewRegistry) =>
      this.registryHttp.postRegistries(
        newRegistry,
        this.searchForm.value,
        page,
        size,
        this.selectedSort.value ?? "name",
        this.selectedSort.descending ? "desc" : "asc"
      )
    );
  }

  deleteEntry(registry: Registry): void {
    const modalRef = this.ngbModal.open(CustomizableModalComponent, {
      windowClass: "small-modal",
      backdrop: "static",
      centered: true,
    });
    modalRef.componentInstance.title = "Attenzione";
    modalRef.componentInstance.text =
      "Sei certo di voler eliminare questa anagrafica? Non potrà essere recuperata";
    modalRef.componentInstance.okBtnLabel = "Conferma cancellazione";
    modalRef.componentInstance.cancelBtnLabel = "Annulla";
    modalRef.result.then(() =>
      this.registryHttp.deleteRegistry(
        registry.id,
        this.searchForm.value,
        this.page ?? 0,
        this.pageForm.value.size ?? 20,
        this.selectedSort.value ?? "name",
        this.selectedSort.descending ? "desc" : "asc"
      )
    );
  }

  edit(registry: Registry): void {
    this.router.navigate([`../registry/${registry.id}`]);
  }

  getPages(pages: number): number[] {
    return Array.from({ length: pages }, (value, index) => index + 1);
  }

  goToPage(page: number): void {
    this.registryHttp.readRegistries(
      this.searchForm.value,
      page,
      this.pageForm.value.size ?? 20,
      this.selectedSort.value ?? "name",
      this.selectedSort.descending ? "desc" : "asc"
    );
  }

  isSelectedSort(value: string, descending: boolean): boolean {
    if (!this.selectedSort) return false;

    return (
      this.selectedSort.value === value &&
      this.selectedSort.descending === descending
    );
  }

  search(): void {
    this.registryHttp.readRegistries(
      this.searchForm.value,
      this.page ?? 0,
      this.pageForm.value.size ?? 20,
      this.selectedSort.value ?? "name",
      this.selectedSort.descending ? "desc" : "asc"
    );
  }

  sort(value: string, descending = false): void {
    this.selectedSort = {
      descending,
      value,
    };
    this.registryHttp.readRegistries(
      this.searchForm.value,
      this.page ?? 0,
      this.pageForm.value.size ?? 20,
      this.selectedSort.value ?? "name",
      this.selectedSort.descending ? "desc" : "asc"
    );
  }
}
