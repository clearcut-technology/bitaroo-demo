import BigNumber from 'bignumber.js';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-bitcoin-input',
  standalone: true,
  templateUrl: './bitcoin-input.component.html',
})
export class BitcoinInputComponent {
  @ViewChild('numberInput') numberInput?: ElementRef;

  @Input()
  set bitcoins(value: BigNumber) {
    if (value.isEqualTo(this.currentValue)) {
      return;
    }

    const inputValue = BigNumber.max(0, value);
    const valueString = inputValue.toFixed(8);
    const parts = valueString.split('.');
    this.wholeNumber.set(parts[0]);
    let decimalString = parts[1];
    while (decimalString.endsWith('0')) {
      decimalString = decimalString.slice(0, -1);
    }
    if (!decimalString) {
      this.hasDot.set(false);
      this.decimalNumber.set('');
    } else {
      this.hasDot.set(true);
      this.decimalNumber.set(decimalString);
    }

    this.updateOutput();
  }

  @Output() bitcoinsChange = new EventEmitter<BigNumber>();

  private wholeNumber = signal('');
  private hasDot = signal(false);
  private decimalNumber = signal('');

  private bigNumber = BigNumber.clone({ DECIMAL_PLACES: 8 });
  private currentValue = new BigNumber(0);

  hasFocus = false;

  inputValue = computed(() => {
    const whole = this.wholeNumber();
    const dot = this.hasDot();
    const decimal = this.decimalNumber();
    if (!whole && !dot) {
      return '';
    }
    if (!dot) {
      return whole;
    }
    if (decimal) {
      return `${whole || '0'}.${decimal}`;
    } else {
      return `${whole || 0}.`;
    }
  });

  blackValue = computed(() => {
    const whole = this.wholeNumber();
    const dot = this.hasDot();
    const decimal = this.decimalNumber();
    if (!whole && !dot) {
      return '0';
    }
    if (!dot) {
      return whole;
    }
    if (decimal) {
      return `${whole || 0}.${decimal}`;
    } else {
      return `${whole || 0}.`;
    }
  });

  greyValue = computed(() => {
    const dot = this.hasDot();
    const decimal = this.decimalNumber();
    if (!dot) {
      return '';
    }
    return new Array(Math.max(8 - decimal.length, 0)).fill('0').join('');
  });

  focusInput(): void {
    if (this.numberInput) {
      const inputElement = this.numberInput.nativeElement as HTMLInputElement;
      inputElement.focus();
      const value = inputElement.value;
      const numberOfCharacters = value ? value.length : 0;
      inputElement.setSelectionRange(numberOfCharacters, numberOfCharacters);
    }
  }

  numberInputChanged(event: Event): void {
    const newCharacter = (event as InputEvent).data;
    if (newCharacter === null) {
      if (this.decimalNumber()) {
        this.decimalNumber.update((value) => value.slice(0, -1));
      } else if (this.hasDot()) {
        this.hasDot.set(false);
      } else {
        this.wholeNumber.update((value) => value.slice(0, -1));
      }
    } else {
      if (/\d/.test(newCharacter)) {
        if (this.hasDot()) {
          if (this.decimalNumber().length < 8) {
            this.decimalNumber.update((value) => value + newCharacter);
          }
        } else {
          if (this.wholeNumber() !== '0' || newCharacter !== '0') {
            if (this.wholeNumber() === '0') {
              this.wholeNumber.set(newCharacter);
            } else {
              this.wholeNumber.update((value) => value + newCharacter);
            }
          }
        }
      }
      if ('.' === newCharacter) {
        this.hasDot.set(true);
        if (!this.wholeNumber()) {
          this.wholeNumber.set('0');
        }
      }
    }

    this.updateOutput();
  }

  private updateOutput(): void {
    const whole = this.wholeNumber();
    const dot = this.hasDot();
    const decimal = this.decimalNumber();
    const valueString = dot ? `${whole || 0}.${decimal || 0}` : `${whole || 0}`;
    const value = new this.bigNumber(valueString);
    this.currentValue = value;
    this.bitcoinsChange.emit(value);
  }
}
