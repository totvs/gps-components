import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: '[gps-advanced-search]',
    standalone: false
})
export class GpsAdvancedSearchDirective {
    constructor(public templateRef: TemplateRef<any>) { }
}