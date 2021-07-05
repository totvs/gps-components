import { Router } from '@angular/router';
import { GpsMaintenanceUrl } from 'totvs-gps-utils';

export class GpsPageNavigation {

    private route:string;
    private router:Router;

    constructor(){
        this.route = '';
    }

    public getRoute():string{
        return this.route;
    }

    public setRoute(route:string){
        this.route = route;
    }

    public getRouter():Router{
        return this.router;
    }

    public setRouter(router:Router){
        this.router = router;
    }

    public back(){
        this.navigate('/');
    }

    public newRegisterPage(){
        this.navigate('/new');
    }

    public detailRegisterPage(crudObject){
        this.navigate(GpsMaintenanceUrl.getNavigationUrl(crudObject,'/'));
    }

    public editRegisterPage(crudObject){
        this.navigate(GpsMaintenanceUrl.getNavigationUrl(crudObject,'/edit'));
    }

    public navigate(route:string){
        this.router.navigate([route]);
    }

}