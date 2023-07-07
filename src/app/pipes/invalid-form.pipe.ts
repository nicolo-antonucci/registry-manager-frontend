import { Pipe, PipeTransform } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Pipe({
  name: "invalidForm",
  pure: false,
})
export class InvalidFormPipe implements PipeTransform {
  transform(form: FormGroup, controlName: string): boolean {
    if (!form || !controlName || form.get(controlName)?.errors?.["required"])
      return false;

    return (
      form.get(controlName)?.touched &&
      (form.get(controlName)?.errors?.["pattern"] ||
        form.get(controlName)?.errors?.["email"])
    );
  }
}
