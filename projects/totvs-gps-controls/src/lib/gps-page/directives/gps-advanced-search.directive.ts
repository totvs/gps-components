import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: '[gps-advanced-search]'
})
export class GpsAdvancedSearchDirective {
    constructor(public templateRef: TemplateRef<any>) { }
}