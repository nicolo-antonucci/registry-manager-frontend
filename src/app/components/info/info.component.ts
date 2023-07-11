import { Component, EventEmitter, Input, Output } from "@angular/core";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Registry } from "src/models/registry";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"],
})
export class InfoComponent {
  @Input() title!: string;
  @Input() registry!: Registry;
  @Input() propName!: string;

  @Output() toggleEmitter: EventEmitter<void> = new EventEmitter();

  readonly faPen = faPen;
}
