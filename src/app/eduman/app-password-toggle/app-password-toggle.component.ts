import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-app-password-toggle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './app-password-toggle.component.html',
  styleUrls: ['./app-password-toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppPasswordToggleComponent),
      multi: true
    }
  ]
})
export class AppPasswordToggleComponent {


  @Input() formControl!: FormControl;
  @Input() ngModelValue: any;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @Output() enterPressed: EventEmitter<void> = new EventEmitter<void>();
  value!: string;
  hide = true;

  private onChange!: (value: any) => void;
  private onTouched!: () => void;

  writeValue(value: any): void {
    this.value = value;
    this.ngModelValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  toggleVisibility(): void {
    this.hide = !this.hide;
    // Refocus input to ensure cursor position stays correct
    // setTimeout(() => this.passwordInput.nativeElement.focus(), 0);
  }

  onInputChange(event: any): void {
    this.value = event.target.value;
    if (this.onChange) {
      this.onChange(this.value);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  submitOnEnter(): void {
    this.enterPressed.emit();
  }

}
