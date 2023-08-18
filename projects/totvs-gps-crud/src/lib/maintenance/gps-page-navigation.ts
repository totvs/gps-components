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

    public newRegisterPage(stateObject?:any){
        this.navigate('/new', stateObject);
    }

    public detailRegisterPage(crudObject,stateObject?:any){
        this.navigate(GpsMaintenanceUrl.getNavigationUrl(crudObject,'/'), stateObject);
    }

    public editRegisterPage(crudObject, stateObject?:any){
        this.navigate(GpsMaintenanceUrl.getNavigationUrl(crudObject,'/edit'), stateObject);
    }

    public navigate(route:string, stateObject?:any){
        if(stateObject) {
            this.router.navigate([route], {state: stateObject});
        } else {
            this.router.navigate([route]);
        }
    }

}