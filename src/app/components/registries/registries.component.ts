import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faArrowDown,
  faArrowUp,
  faEnvelope,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription, tap } from "rxjs";
import { Header } from "src/models/header";
import { NewRegistry, Registry } from "src/models/registry";
import {
  ReadRegistriesBody,
  ReadRegistriesDto,
} from "../../../models/read-registries";
import { RegistryHttpService } from "../../services/registry-http.service";
import { CustomizableModalComponent } from "../customizable-modal/customizable-modal.component";
import { NewRegistryComponent } from "../new-registry/new-registry.component";
import { SearchModalComponent } from "../search-modal/search-modal.component";
import { HandleRegistryModalComponent } from "../handle-registry-modal/handle-registry-modal.component";
import { HandleRegistryEvent } from "src/models/enums";

@Component({
  selector: "app-registries",
  templateUrl: "./registries.component.html",
  styleUrls: ["./registries.component.scss"],
})
export class RegistriesComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild("table") tableEl!: ElementRef<HTMLDivElement>;

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
    sort: string;
    dir: "asc" | "desc";
  } = {
    dir: "asc",
    sort: "name",
  };

  id!: number | null;
  pageToShow!: number | null;
  colWidth!: string;

  readonly faUp = faArrowUp;
  readonly faDown = faArrowDown;
  readonly faSearch = faMagnifyingGlass;
  readonly faEdit = faPen;
  readonly faDelete = faTrash;
  readonly faMail = faEnvelope;
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get shortHeaders(): Header[] {
    return this.headers.filter(
      (h) => h.value === "name" || h.value === "surname" || h.value === "email"
    );
  }

  get page(): number {
    return this.pageForm.value.page ?? 0;
  }

  @HostListener("window:resize", ["$event"])
  getColWidth(): void {
    const width = window.innerWidth;
    let actionWidth = 120;

    if (width < 1600) actionWidth = 108;

    if (width <= 1200) actionWidth = 96;

    const headerCols =
      width <= 1200 ? this.shortHeaders.length : this.headers.length;

    const colWidth = Math.floor(
      (this.tableEl.nativeElement.clientWidth - actionWidth) / headerCols
    );
    this.colWidth = `${colWidth}px`;
  }

  @HostListener("window:resize", ["$event"])
  getRowsNumber(): void {
    const height = window.innerHeight;
    const width = window.innerWidth;

    if (width < height) {
      this.pageForm.controls.size.setValue(Math.floor((height - 300) / 100));
    }
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get("id")
      ? +(this.route.snapshot.queryParamMap.get("id") as string)
      : null;
    this.pageToShow = this.route.snapshot.queryParamMap.get("page")
      ? +(this.route.snapshot.queryParamMap.get("page") as string)
      : null;

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
      size: this.fb.control<number>(10, {
        validators: Validators.min(1),
      }),
      page: this.fb.control<number>(this.pageToShow ? +this.pageToShow : 0, {
        validators: Validators.min(0),
      }),
    });

    this.data$ = this.registryHttp.registries.pipe(
      tap((data) => {
        if (data?.pages && this.page) {
          this.pageForm.controls.page.setValue(
            data.page < data.pages ? data.page : data.pages - 1
          );
        }

        if (data?.size) {
          this.pageForm.controls.size.setValue(data.size);
        }

        if (data?.highlightedElement) this.id = data.highlightedElement;
      })
    );

    this.getRowsNumber();

    this.registryHttp.readRegistries(this.searchForm.value, {
      page: this.page ?? null,
      size: this.pageForm.value.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });
  }

  ngAfterViewInit(): void {
    const attempt = (): void => {
      if (this.tableEl) this.getColWidth();
      else setTimeout(() => attempt(), 100);
    };

    setTimeout(() => attempt(), 100);
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  addRegistry(page: number, size: number): void {
    const modalRef = this.ngbModal.open(NewRegistryComponent, {
      backdrop: "static",
      centered: true,
    });
    modalRef.result.then((newRegistry: NewRegistry) =>
      this.registryHttp.postRegistries(newRegistry, this.searchForm.value, {
        page,
        size,
        sort: this.selectedSort.sort ?? null,
        dir: this.selectedSort.dir ?? null,
      })
    );
  }

  cleanupRoute(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
    this.id = null;
    this.pageToShow = null;
  }

  deleteEntry(registry: Registry): void {
    const modalRef = this.ngbModal.open(CustomizableModalComponent, {
      backdrop: "static",
      centered: true,
    });
    modalRef.componentInstance.title = "Attenzione";
    modalRef.componentInstance.text =
      "Sei certo di voler eliminare questa anagrafica? Non potrà essere recuperata";
    modalRef.componentInstance.okBtnLabel = "Conferma cancellazione";
    modalRef.componentInstance.cancelBtnLabel = "Annulla";
    modalRef.result.then(() =>
      this.registryHttp.deleteRegistry(registry.id, this.searchForm.value, {
        page: this.page ?? null,
        size: this.pageForm.value.size ?? null,
        sort: this.selectedSort.sort,
        dir: this.selectedSort.dir,
      })
    );
  }

  edit(registry: Registry): void {
    this.router.navigate([`../registry/${registry.id}`]);
  }

  getPages(pages: number): number[] {
    return Array.from({ length: pages }, (value, index) => index + 1);
  }

  goToPage(page: number): void {
    this.registryHttp.readRegistries(this.searchForm.value, {
      page,
      size: this.pageForm.value.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });

    this.cleanupRoute();
  }

  handleRegistry(registry: Registry): void {
    const modalRef = this.ngbModal.open(HandleRegistryModalComponent, {
      backdrop: "static",
      centered: true,
    });
    modalRef.result.then((result) => {
      switch (result) {
        case HandleRegistryEvent.DELETE:
          this.deleteEntry(registry);
          break;
        case HandleRegistryEvent.EDIT:
          this.edit(registry);
          break;
        case HandleRegistryEvent.MAIL:
          this.sendEmail(registry);
          break;
      }
    });
  }

  isSelectedSort(sort: string, dir: "asc" | "desc"): boolean {
    if (!this.selectedSort) return false;

    return this.selectedSort.sort === sort && this.selectedSort.dir === dir;
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

    this.registryHttp.readRegistries(this.searchForm.value, {
      page: this.page ?? null,
      size: this.pageForm.value.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });
  }

  openSearch(): void {
    const modalRef = this.ngbModal.open(SearchModalComponent, {
      backdrop: "static",
      centered: true,
    });
    modalRef.componentInstance.initialValue = this.searchForm.value;
    modalRef.result.then((searchValues: ReadRegistriesBody) => {
      Object.keys(searchValues).forEach((k) => {
        const val = searchValues[k as keyof ReadRegistriesBody];
        if (val) this.searchForm.get(k)?.setValue(val);
      });

      this.registryHttp.readRegistries(searchValues, {
        page: this.pageForm.value.page ?? null,
        size: this.pageForm.value.size ?? null,
        sort: this.selectedSort.sort,
        dir: this.selectedSort.dir,
      });
    });
  }

  search(): void {
    this.cleanupRoute();

    this.registryHttp.readRegistries(this.searchForm.value, {
      page: this.page ?? null,
      size: this.pageForm.value.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });
  }

  sendEmail(registry: Registry): void {
    this.registryHttp.sendEmail(registry.id);
  }

  sort(sort: string, dir: "asc" | "desc"): void {
    this.selectedSort = {
      dir,
      sort,
    };

    this.cleanupRoute();

    this.registryHttp.readRegistries(this.searchForm.value, {
      page: this.page ?? null,
      size: this.pageForm.value.size ?? null,
      sort: this.selectedSort.sort,
      dir: this.selectedSort.dir,
    });
  }
}
