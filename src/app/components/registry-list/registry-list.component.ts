import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ReadRegistriesBody,
  ReadRegistriesDto,
} from "src/models/read-registries";
import { Registry } from "src/models/registry";
import { SearchModalComponent } from "../search-modal/search-modal.component";

@Component({
  selector: "app-registry-list",
  templateUrl: "./registry-list.component.html",
  styleUrls: ["./registry-list.component.scss"],
})
export class RegistryListComponent implements OnInit, OnChanges {
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
  @Output() handleRegistryRequested: EventEmitter<Registry> =
    new EventEmitter();
  @Output() addRegistryRequested: EventEmitter<{
    page: number | null;
    size: number | null;
    sort: string | null;
    dir: "asc" | "desc" | null;
  }> = new EventEmitter();

  id!: number | null;
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

  readonly faSearch = faMagnifyingGlass;
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

  get dir(): "asc" | "desc" | null {
    return this.sortForm.value.dir ?? null;
  }

  get page(): number | null {
    return this.pageForm.value.page ?? null;
  }

  get size(): number | null {
    return this.pageForm.value.page ?? null;
  }

  get sort(): string | null {
    return this.sortForm.value.sort ?? null;
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

  goToPage(page: number): void {
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
}
