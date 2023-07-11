import { Pipe, PipeTransform } from "@angular/core";
import { Registry } from "src/models/registry";

@Pipe({
  name: "getValue",
})
export class GetValuePipe implements PipeTransform {
  transform(registry: Registry, property: string): string | null | undefined {
    if (!registry || !registry.hasOwnProperty(property)) return "N/A";

    const value = registry[property as keyof Registry];

    return typeof value === "string" && value.length > 0 ? value : "N/A";
  }
}
