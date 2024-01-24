import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from "rxjs";
import { filter, switchMap, take } from 'rxjs/operators';
import { MenuDatasulService } from "totvs-gps-api";

export enum PermissionServiceOption {
  CREATE = "create",
  DELETE = "delete",
  DETAIL = "detail",
  UPDATE = "update",
  MASSUPDATE = "massUpdate",
}

export interface IPermissionService {
  permissions: { [key in PermissionServiceOption]?: boolean };
  hasPermission(permission :PermissionServiceOption): boolean;
}

@Injectable({ providedIn: 'root' })
export class PermissionService {
    
    private loadingSubject = new BehaviorSubject<boolean>(true);
    public loading$ = this.loadingSubject.asObservable();

    public permissions: { [key in PermissionServiceOption]?: boolean } = {};

    constructor(private menuService: MenuDatasulService) {
      this.initializePermissions();
    }

    private initializePermissions(): void {
        const actions = Object.values(PermissionServiceOption) as string[];
        actions.forEach((action) => {
            this.permissions[action as PermissionServiceOption] = false;
        });
    }

    loadPermissions(app: string){
      let promises = [];
  
      for (const permission in this.permissions) {
          if (this.permissions.hasOwnProperty(permission)) {
              let promise = this.menuService.getProgamPermission(app + "." + permission)
                  .then((result) => { 
                      this.permissions[permission] = (result['programPermission'] === true);
                  });
              promises.push(promise);
          }
      }
  
      Promise.all(promises).finally(() => {
          this.loadingSubject.next(false);
      });
    }
    
    hasPermission(action: PermissionServiceOption): boolean {
      return this.permissions[action] || false;
    }
}

@Injectable({ providedIn: 'root' })
export class PermissionResolver implements Resolve<any> {
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const app = route.data['app'];

    this.permissionService.loadPermissions(app);
    return this.permissionService.loading$.pipe(
      filter(loading => !loading),
      take(1),
      switchMap(() => {
        const requiredPermission = route.data['requiredPermission'] as PermissionServiceOption;

        if(requiredPermission !== undefined){

          if (!this.permissionService.hasPermission(requiredPermission)) {
            this.router.navigate(['']);
            return of(null);
          }
        }

        return of(this.permissionService.permissions);
      })
    );
  }
}