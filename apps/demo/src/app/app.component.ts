import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BitcoinInputComponent } from './components/bitcoin-input/bitcoin-input.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BitcoinInputComponent],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent {}
