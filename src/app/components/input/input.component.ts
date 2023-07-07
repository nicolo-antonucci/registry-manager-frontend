import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() title!: string;
  @Input() formName!: string;
  @Input() required = false;
  @Input() invalid = false;
  @Input() requiredMessage!: string;
  @Input() invalidMessage!: string;
  @Input() value!: string;

  @Output() toggleEmitter: EventEmitter<void> = new EventEmitter();
  @Output() valueChange = new EventEmitter<string>();

  readonly faCancel = faXmark;

  ngOnInit(): void {
    if (this.value) {
      this.writeValue(this.value);
    }
  }

  onChange: (value: string) => void = () => null;

  onTouch: () => null = () => null;

  registerOnChange(fn: () => null): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => null): void {
    this.onTouch = fn;
  }

  writeValue(obj: string): void {
    this.value = obj;
    this.onTouch();
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }
}
