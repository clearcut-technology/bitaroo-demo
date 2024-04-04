import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-bitcoin-input',
  standalone: true,
  templateUrl: './bitcoin-input.component.html',
})
export class BitcoinInputComponent {}
