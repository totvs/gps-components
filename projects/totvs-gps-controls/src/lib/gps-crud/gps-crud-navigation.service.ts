import { Router } from '@angular/router';
import { GpsMaintenanceUrl } from 'totvs-gps-utils';
import { Injectable } from '@angular/core';

@Injectable()
export class GpsCRUDNavigation {

    constructor(private router: Router) { }

    back(): Promise<boolean> {
        return this.navigate('/');
    }

    newRegisterPage(): Promise<boolean> {
        return this.navigate('/new');
    }

    detailRegisterPage(crudObject): Promise<boolean> {
        return this.navigate(GpsMaintenanceUrl.getNavigationUrl(crudObject, '/'));
    }

    editRegisterPage(crudObject): Promise<boolean> {
        return this.navigate(GpsMaintenanceUrl.getNavigationUrl(crudObject, '/edit'));
    }

    navigate(route: string): Promise<boolean> {
        return this.router.navigate([route]);
    }

}