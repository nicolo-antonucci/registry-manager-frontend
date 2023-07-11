import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
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
import { HandleRegistryEvent } from "src/models/enums";
import { Header } from "src/models/header";
import {
  ReadRegistriesBody,
  ReadRegistriesDto,
} from "src/models/read-registries";
import { Registry } from "src/models/registry";
import { SearchModalComponent } from "../search-modal/search-modal.component";

@Component({
  selector: "app-registry-table",
  templateUrl: "./registry-table.component.html",
  styleUrls: ["./registry-table.component.scss"],
})
export class RegistryTableComponent
  implements AfterViewInit, OnInit, OnChanges
{
  @ViewChild("table") tableEl!: ElementRef<HTMLDivElement>;

  @Input() data!: ReadRegistriesDto | null;

  @Output() dataRequested: EventEmitter<{
    readRegistriesBody: ReadRegistriesBody;
    pageParams: {
      page: number | null;
      size: number | null;
      sort: string | null;
      dir: "asc" | "desc" | null;
    };
  }> = new EventEmitter();
  @Output() actionRequested: EventEmitter<{
    registry: Registry;
    type: HandleRegistryEvent;
  }> = new EventEmitter();
  @Output() addRegistryRequested: EventEmitter<{
    page: number | null;
    size: number | null;
    sort: string | null;
    dir: "asc" | "desc" | null;
  }> = new EventEmitter();

  id!: number | null;
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
  sortForm!: FormGroup<{
    sort: FormControl<string | null>;
    dir: FormControl<"asc" | "desc" | null>;
  }>;
  colWidth!: string;
  actions = HandleRegistryEvent;

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

  constructor(
    private fb: FormBuilder,
    private ngbModal: NgbModal,
    private route: ActivatedRoute
  ) {}

  get getHeaders(): Header[] {
    if (window.innerWidth >= 1600) return this.headers;

    return this.headers.filter(
      (h) => h.value === "name" || h.value === "surname" || h.value === "email"
    );
  }

  get dir(): "asc" | "desc" | null {
    return this.sortForm.value.dir ?? null;
  }

  get page(): number | null {
    return this.pageForm.value.page ?? null;
  }

  get size(): number | null {
    return this.pageForm.value.size ?? null;
  }

  get sort(): string | null {
    return this.sortForm.value.sort ?? null;
  }

  @HostListener("window:resize", ["$event"])
  getColWidth(): void {
    const headerCols = this.getHeaders.length;
    const colWidth = Math.floor(
      (this.tableEl.nativeElement.clientWidth - 144) / headerCols
    );
    this.colWidth = `${colWidth}px`;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get("id")
      ? +(this.route.snapshot.queryParamMap.get("id") as string)
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
      size: this.fb.control<number>(this.data?.size ?? 10, {
        validators: Validators.min(1),
      }),
      page: this.fb.control<number>(this.data?.page ?? 0, {
        validators: Validators.min(0),
      }),
    });

    this.sortForm = this.fb.group({
      dir: this.fb.control<"asc" | "desc">("asc"),
      sort: this.fb.control("name"),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes) return;

    if (!changes["data"]?.isFirstChange()) {
      this.pageForm.controls.page.setValue(this.data?.page ?? 0);
      this.pageForm.controls.size.setValue(this.data?.size ?? 10);
    }
  }

  ngAfterViewInit(): void {
    const attempt = (): void => {
      if (this.tableEl) this.getColWidth();
      else setTimeout(() => attempt(), 100);
    };

    setTimeout(() => attempt(), 100);
  }

  applySearch(): void {
    this.dataRequested.emit({
      readRegistriesBody: {
        address: this.searchForm.value.address ?? null,
        city: this.searchForm.value.city ?? null,
        email: this.searchForm.value.email ?? null,
        location: this.searchForm.value.location ?? null,
        name: this.searchForm.value.name ?? null,
        notes: this.searchForm.value.notes ?? null,
        province: this.searchForm.value.province ?? null,
        surname: this.searchForm.value.surname ?? null,
      },
      pageParams: {
        dir: this.dir,
        page: this.page,
        size: this.size,
        sort: this.sort,
      },
    });
  }

  applySort(sort: string, dir: "asc" | "desc"): void {
    this.sortForm.setValue({ sort, dir });
    this.dataRequested.emit({
      readRegistriesBody: {
        address: this.searchForm.value.address ?? null,
        city: this.searchForm.value.city ?? null,
        email: this.searchForm.value.email ?? null,
        location: this.searchForm.value.location ?? null,
        name: this.searchForm.value.name ?? null,
        notes: this.searchForm.value.notes ?? null,
        province: this.searchForm.value.province ?? null,
        surname: this.searchForm.value.surname ?? null,
      },
      pageParams: {
        dir: this.dir,
        page: this.page,
        size: this.size,
        sort: this.sort,
      },
    });
  }

  getPages(pages: number): number[] {
    return Array.from({ length: pages }, (value, index) => index + 1);
  }

  goToPage(page: number | null): void {
    this.pageForm.controls.page.setValue(page);
    this.dataRequested.emit({
      readRegistriesBody: {
        address: this.searchForm.value.address ?? null,
        city: this.searchForm.value.city ?? null,
        email: this.searchForm.value.email ?? null,
        location: this.searchForm.value.location ?? null,
        name: this.searchForm.value.name ?? null,
        notes: this.searchForm.value.notes ?? null,
        province: this.searchForm.value.province ?? null,
        surname: this.searchForm.value.surname ?? null,
      },
      pageParams: {
        dir: this.dir,
        page: this.page,
        size: this.size,
        sort: this.sort,
      },
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

      this.id = null;

      this.dataRequested.emit({
        readRegistriesBody: searchValues,
        pageParams: {
          page: this.pageForm.value.page ?? null,
          size: this.pageForm.value.size ?? null,
          sort: this.sortForm.value.sort ?? null,
          dir: this.sortForm.value.dir ?? null,
        },
      });
    });
  }

  isSelectedSort(sort: string, dir: "asc" | "desc"): boolean {
    return this.sortForm.value.sort === sort && this.sortForm.value.dir === dir;
  }
}
