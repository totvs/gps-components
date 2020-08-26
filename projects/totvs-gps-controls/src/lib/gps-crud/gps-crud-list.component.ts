import { Component } from "@angular/core";
import { GpsCRUDNavigation } from "./gps-crud-navigation.service";
import { GpsCRUDCustomService } from "./gps-crud.service";
import { GpsPageListComponent } from "../gps-page/gps-page-list/gps-page-list.component";

@Component({
    selector: 'gps-crud-list',
    templateUrl: '../gps-page/gps-page-list/gps-page-list.component.html',
    providers: []
})
export class GpsCrudListComponent extends GpsPageListComponent {

} 