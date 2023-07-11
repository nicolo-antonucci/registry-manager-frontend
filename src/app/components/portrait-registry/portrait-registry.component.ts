import { Component, Input } from "@angular/core";
import { Registry } from "src/models/registry";

@Component({
  selector: "app-portrait-registry",
  templateUrl: "./portrait-registry.component.html",
  styleUrls: ["./portrait-registry.component.scss"],
})
export class PortraitRegistryComponent {
  @Input() registry!: Registry;
}
