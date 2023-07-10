import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ReadRegistriesBody,
  ReadRegistriesForm,
} from "src/models/read-registries";

@Component({
  selector: "app-search-modal",
  templateUrl: "./search-modal.component.html",
  styleUrls: ["./search-modal.component.scss"],
})
export class SearchModalComponent implements OnInit {
  @Input() initialValue!: ReadRegistriesBody;

  form!: FormGroup<ReadRegistriesForm>;
  readonly faSearch = faMagnifyingGlass;
  readonly faCancel = faXmark;

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {}

  get formKeys(): string[] {
    return this.form ? Object.keys(this.form.controls) : [];
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: this.fb.control<string | null>(""),
      surname: this.fb.control<string | null>(""),
      email: this.fb.control<string | null>(""),
      address: this.fb.control<string | null>(""),
      location: this.fb.control<string | null>(""),
      city: this.fb.control<string | null>(""),
      province: this.fb.control<string | null>(""),
      notes: this.fb.control<string | null>(""),
    });

    if (this.initialValue) {
      Object.keys(this.initialValue).forEach((k) => {
        const val = this.initialValue[k as keyof ReadRegistriesBody];
        if (val) this.form.get(k)?.setValue(val);
      });
    }
  }

  close(): void {
    this.activeModal.close(this.form.value);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
