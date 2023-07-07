import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { RegistryForm } from "src/models/registry-form";

@Component({
  selector: "app-new-registry",
  templateUrl: "./new-registry.component.html",
  styleUrls: ["./new-registry.component.scss"],
})
export class NewRegistryComponent implements OnInit {
  form!: FormGroup<RegistryForm>;

  readonly nameRegex = /^[A-Za-z ,.'-]+$/;
  readonly addressRegex =
    /^(piazza|via|viale)\s[A-Z][A-Za-z']+(\s[A-Za-z']+)*$/;
  readonly cityRegex = /^([A-Z][A-Za-z']+(\s[A-Za-z']+)*)$/;

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder) {}

  get missingName(): boolean {
    return (
      this.form.controls.name.touched &&
      this.form.controls.name.errors?.["required"]
    );
  }

  get invalidName(): boolean {
    return (
      this.form.controls.name.touched &&
      this.form.controls.name.errors?.["pattern"]
    );
  }

  get missingSurname(): boolean {
    return (
      this.form.controls.surname.touched &&
      this.form.controls.surname.errors?.["required"]
    );
  }

  get invalidSurname(): boolean {
    return (
      this.form.controls.surname.touched &&
      this.form.controls.surname.errors?.["pattern"]
    );
  }

  get invalidAddress(): boolean {
    return (
      this.form.controls.address.touched &&
      this.form.controls.address.errors?.["pattern"]
    );
  }

  get invalidLocation(): boolean {
    return (
      this.form.controls.location.touched &&
      this.form.controls.location.errors?.["pattern"]
    );
  }

  get invalidCity(): boolean {
    return (
      this.form.controls.city.touched &&
      this.form.controls.city.errors?.["pattern"]
    );
  }

  get invalidProvince(): boolean {
    return (
      this.form.controls.province.touched &&
      this.form.controls.province.errors?.["pattern"]
    );
  }

  get missingEmail(): boolean {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.errors?.["required"]
    );
  }

  get invalidEmail(): boolean {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.errors?.["email"]
    );
  }

  ngOnInit(): void {
    this.form = this.fb.group<RegistryForm>({
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
    });
  }

  add(): void {
    this.activeModal.close(this.form.value);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
