import { Pipe, PipeTransform } from "@angular/core";
import { Registry } from "src/models/registry";

@Pipe({
  name: "getValue",
})
export class GetValuePipe implements PipeTransform {
  transform(value: Registry, property: string): string | null | undefined {
    if (!value || !value.hasOwnProperty(property)) return "N/A";

    return (value[property as keyof Registry] as string) ?? "N/A";
  }
}
