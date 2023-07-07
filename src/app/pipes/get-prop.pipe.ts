import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "getProp",
})
export class GetPropPipe implements PipeTransform {
  transform(value: unknown, prop: string): unknown {
    if (!value || !prop) return null;

    return value[prop as keyof typeof value];
  }
}
