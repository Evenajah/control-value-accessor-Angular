import {
  Directive,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  AsyncSubject,
  BehaviorSubject,
  combineLatest,
  fromEvent,
  ReplaySubject,
  takeUntil,
} from 'rxjs';
import { map, switchMap, tap, share } from 'rxjs/operators';

@Directive({
  selector: '[appCheckbox]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxDirective),
    },
  ],
})
export class CheckboxDirective
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() appCheckboxCheckedValue: any = true;
  @Input() appCheckboxUnCheckedValue: any = false;

  /**
   * internal only don't use it
   */
  _onDestroy$ = new AsyncSubject<void>();

  onModelChange?: (value: any) => void;
  onModelTouched?: () => void;

  get checkboxEl() {
    return this.el.nativeElement;
  }

  onCheckboxChecked$ = fromEvent(this.checkboxEl, 'input').pipe(
    map(() => this.checkboxEl.checked),
    share()
  );

  constructor(public el: ElementRef<HTMLInputElement>, public rd2: Renderer2) {}

  ngOnInit(): void {
    fromEvent(this.checkboxEl, 'blur')
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(() => {
        if (this.onModelTouched) {
          this.onModelTouched();
        }
      });

    this.onCheckboxChecked$
      .pipe(
        tap((checked) => {
          if (this.onModelChange) {
            if (checked) {
              this.onModelChange(this.appCheckboxCheckedValue);
            } else {
              this.onModelChange(this.appCheckboxUnCheckedValue);
            }
          }
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  writeValue(value: any): void {
    if (value === null || value === this.appCheckboxUnCheckedValue) {
      this.checkboxEl.checked = false;
    } else if (value === this.appCheckboxCheckedValue) {
      this.checkboxEl.checked = true;
    }
  }
  registerOnChange(onModelChange: (value: any) => void): void {
    this.onModelChange = onModelChange;
  }

  registerOnTouched(onModelTouched: () => void): void {
    this.onModelTouched = onModelTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.rd2.setAttribute(this.checkboxEl, 'disabled', '');
    } else {
      this.rd2.removeAttribute(this.checkboxEl, 'disabled');
    }
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }
}
