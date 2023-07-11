import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "toFormTitle",
})
export class ToFormTitlePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case "address":
        return "Indirizzo";
      case "city":
        return "Città";
      case "email":
        return "Email";
      case "location":
        return "Località";
      case "name":
        return "Nome";
      case "notes":
        return "Note";
      case "province":
        return "Provincia";
      case "surname":
        return "Cognome";
      default:
        return "";
    }
  }
}
