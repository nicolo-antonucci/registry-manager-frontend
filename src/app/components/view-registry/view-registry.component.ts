import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { RegistryHttpService } from "src/app/services/registry-http.service";
import { Registry } from "src/models/registry";
import { RegistryForm } from "src/models/registry-form";

@Component({
  selector: "app-view-registry",
  templateUrl: "./view-registry.component.html",
  styleUrls: ["./view-registry.component.scss"],
})
export class ViewRegistryComponent implements OnInit {
  registry$!: Observable<Registry | null>;
  registryId!: string | null;
  form!: FormGroup<RegistryForm>;
  editForm!: FormGroup<{
    name: FormControl<boolean | null>;
    surname: FormControl<boolean | null>;
    address: FormControl<boolean | null>;
    location: FormControl<boolean | null>;
    city: FormControl<boolean | null>;
    province: FormControl<boolean | null>;
    email: FormControl<boolean | null>;
    notes: FormControl<boolean | null>;
  }>;

  readonly nameRegex = /^[A-Za-z ,.'-]+$/;
  readonly addressRegex =
    /^(piazza|via|viale)\s[A-Z][A-Za-z']+(\s[A-Za-z']+)*$/;
  readonly cityRegex = /^([A-Z][A-Za-z']+(\s[A-Za-z']+)*)$/;

  constructor(
    private fb: FormBuilder,
    private registriesService: RegistryHttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get editName(): boolean {
    return !!this.editForm.value.name;
  }

  get editSurname(): boolean {
    return !!this.editForm.value.surname;
  }

  get editAddress(): boolean {
    return !!this.editForm.value.address;
  }

  get editCity(): boolean {
    return !!this.editForm.value.city;
  }

  get editLocation(): boolean {
    return !!this.editForm.value.location;
  }

  get editProvince(): boolean {
    return !!this.editForm.value.province;
  }

  get editNotes(): boolean {
    return !!this.editForm.value.notes;
  }

  get editEmail(): boolean {
    return !!this.editForm.value.email;
  }

  ngOnInit(): void {
    this.registryId = this.route.snapshot.paramMap.get("id");
    if (!this.registryId) {
      this.router.navigate([`../`]);
    } else {
      this.editForm = this.fb.group({
        address: this.fb.control(false),
        city: this.fb.control(false),
        email: this.fb.control(false),
        location: this.fb.control(false),
        name: this.fb.control(false),
        notes: this.fb.control(false),
        province: this.fb.control(false),
        surname: this.fb.control(false),
      });

      this.form = this.fb.group({
        address: this.fb.control("", Validators.pattern(this.addressRegex)),
        city: this.fb.control("", Validators.pattern(this.cityRegex)),
        email: this.fb.control(
          "",
          Validators.compose([Validators.required, Validators.email])
        ),
        location: this.fb.control("", Validators.pattern(this.cityRegex)),
        name: this.fb.control(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(this.nameRegex),
          ])
        ),
        notes: this.fb.control(""),
        province: this.fb.control("", Validators.pattern(this.cityRegex)),
        surname: this.fb.control(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(this.nameRegex),
          ])
        ),
        id: this.fb.control<number | null>(null, Validators.required),
      });

      this.registry$ = this.registriesService
        .getRegistry(+this.registryId)
        .pipe(
          tap((registry) => {
            if (registry)
              this.form.setValue({
                address: registry.address ?? null,
                city: registry.city ?? null,
                email: registry.email,
                id: registry.id,
                location: registry.location ?? null,
                name: registry.name,
                notes: registry.notes ?? null,
                province: registry.province ?? null,
                surname: registry.surname,
              });
          })
        );

      this.form.markAsUntouched();
    }
  }

  getFormChanged(registry: Registry): boolean {
    return Object.entries(this.form.controls).some(
      (f: [string, FormControl]) =>
        f[1].value !== registry[f[0] as keyof Registry]
    );
  }

  goBack(): void {
    this.router.navigate([`../`]);
  }

  save(): void {
    this.registriesService
      .updateRegistry(this.form.value as Registry)
      .subscribe({
        next: (res) =>
          this.router.navigate([`../`], {
            queryParams: {
              id: this.form.value.id,
              page: res.payload.page,
            },
          }),
      });
  }

  toggleEdit(formName: string, registry?: Registry): void {
    const form = this.editForm.get(formName);
    if (form) {
      form.setValue(!form.value);
      if (!form.value && registry)
        this.form.get(formName)?.setValue(registry[formName as keyof Registry]);
    }
  }
}
