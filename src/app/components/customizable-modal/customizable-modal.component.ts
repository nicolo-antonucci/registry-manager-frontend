import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-customizable-modal",
  templateUrl: "./customizable-modal.component.html",
  styleUrls: ["./customizable-modal.component.scss"],
})
export class CustomizableModalComponent {
  title = "Attenzione";
  text = "Errore";
  okBtnLabel = "Chiudi";
  cancelBtnLabel!: string;

  constructor(private activeModal: NgbActiveModal) {}

  close(): void {
    this.activeModal.close();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
