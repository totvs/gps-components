import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PoSwitchLabelPosition } from '@po-ui/ng-components';


@Component({
  selector: 'gps-lookup-toggle',
  templateUrl: './gps-lookup-toggle.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpsLookupToggleComponent),
      multi: true
    }
  ]
})
export class GpsLookupToggleComponent implements ControlValueAccessor {
  @Input() input: any;
  isAll: boolean;
  @Input() filterParams: string[] = [];
  @Input() isDisable: boolean = false;
  @Input() zoomService: any;
  @Input() label: string;
  @Input() name: string;
  @Input() toggleLabel: string = 'Todos';
  @Input() labelPosition: PoSwitchLabelPosition = PoSwitchLabelPosition.Right;
  @Input() lookupClass: string = "po-sm-10 po-md-10 po-lg-10 po-xl-10";

  @Output() onChangeToggle = new EventEmitter<any>();
  @Output() onChangeValue = new EventEmitter<any>();



  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {
    if (Number(this.input) === 0) this.isAll = true;
    else this.isAll = false;
  }

  handlerToggleChange(active: boolean) {
    this.isAll = active;
    this.input = active ? '0' : undefined;
    this.onChange(this.input);
    if(this.onChangeToggle){
      this.onChangeToggle.emit(this.input)
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(input: any) {
    this.input = input;
  }

  handlerLookupChange(event){
    if(this.onChangeValue){
      this.onChangeValue.emit(event)
    }
  }

}
