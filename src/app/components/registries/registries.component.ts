import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  faArrowDown,
  faArrowUp,
  faMagnifyingGlass,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { Header } from "src/models/header";
import { Registry } from "src/models/registry";
import { ReadRegistriesDto } from "../../../models/read-registries";
import { RegistryHttpService } from "../../services/registry-http.service";
import { CustomizableModalComponent } from "../customizable-modal/customizable-modal.component";

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
    elementsPerPage: FormControl<number | null>;
  }>;
  selectedSort!: {
    value: string;
    descending: boolean;
  };

  readonly faUp = faArrowUp;
  readonly faDown = faArrowDown;
  readonly faSearch = faMagnifyingGlass;
  readonly faEdit = faPen;
  readonly faDelete = faTrash;

  private sub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private ngbModal: NgbModal,
    private registryHttp: RegistryHttpService,
    private router: Router
  ) {}

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
      elementsPerPage: this.fb.control<number>(5, {
        validators: Validators.min(1),
      }),
      page: this.fb.control<number>(1, { validators: Validators.min(1) }),
    });
    this.sub = this.pageForm.valueChanges.subscribe({
      next: (value) => {
        this.registryHttp.getRegistries(
          value.page ?? 1,
          value.elementsPerPage ?? 5
        );
      },
    });

    this.data$ = this.registryHttp.registries;
    this.registryHttp.getRegistries(1, 5);
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
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
        this.pageForm.value.page ?? 1,
        this.pageForm.value.elementsPerPage ?? 5
      )
    );
  }

  edit(registry: Registry): void {
    this.router.navigate([`../registry/${registry.id}`]);
  }

  getPages(pages: number): number[] {
    return Array.from({ length: pages }, (value, index) => index + 1);
  }

  isSelectedSort(value: string, descending: boolean): boolean {
    if (!this.selectedSort) return false;

    return (
      this.selectedSort.value === value &&
      this.selectedSort.descending === descending
    );
  }

  search(header: string): void {}

  sort(header: string, descending = false): void {}
}
