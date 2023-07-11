import { Pipe, PipeTransform } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Pipe({
  name: "requiredForm",
  pure: false,
})
export class RequiredFormPipe implements PipeTransform {
  transform(form: FormGroup, controlName: string): boolean {
    if (!form || !controlName) return false;

    return (
      form.get(controlName)?.touched &&
      form.get(controlName)?.errors?.["required"]
    );
  }
}
