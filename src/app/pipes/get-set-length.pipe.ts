import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "getSetLength",
})
export class GetSetLengthPipe implements PipeTransform {
  transform(value: Set<unknown>): number {
    if (!value) return 0;

    return Array.from(value).length;
  }
}
