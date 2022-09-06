import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxDirective } from './checkbox.directive';

@NgModule({
  imports: [CommonModule],
  exports: [CheckboxDirective],
  declarations: [CheckboxDirective],
})
export class CheckboxModule {}
