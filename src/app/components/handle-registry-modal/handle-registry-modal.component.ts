import { Component } from "@angular/core";
import {
  faEnvelope,
  faPen,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HandleRegistryEvent } from "src/models/enums";

@Component({
  selector: "app-handle-registry-modal",
  templateUrl: "./handle-registry-modal.component.html",
  styleUrls: ["./handle-registry-modal.component.scss"],
})
export class HandleRegistryModalComponent {
  readonly faEdit = faPen;
  readonly faMail = faEnvelope;
  readonly faDelete = faTrash;
  readonly faXmark = faXmark;

  constructor(private activeModal: NgbActiveModal) {}

  deleteRegistry(): void {
    this.activeModal.close(HandleRegistryEvent.DELETE);
  }

  edit(): void {
    this.activeModal.close(HandleRegistryEvent.EDIT);
  }

  sendMail(): void {
    this.activeModal.close(HandleRegistryEvent.MAIL);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
