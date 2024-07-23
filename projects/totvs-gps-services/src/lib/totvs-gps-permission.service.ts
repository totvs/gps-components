import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { TotvsGpsServices } from "./totvs-gps-services.component";

export enum PermissionServiceOption {
  EDIT = "edit",
  MASSUPDATE = "massUpdate",
}

const createLoadBox = (message: string) => {
  const loadBox = document.createElement("div");
  loadBox.innerHTML = `
   <div class="po-overlay-fixed">
  <po-loading class="po-loading-overlay-content" ng-reflect-text="${message}"
    ><div class="po-loading">
      <po-loading-icon
        ><div class="po-loading-icon">
          <span class="po-loading-icon-bar po-loading-icon-bar-1"></span
          ><span class="po-loading-icon-bar po-loading-icon-bar-2"></span
          ><span class="po-loading-icon-bar po-loading-icon-bar-3"></span
          ><span class="po-loading-icon-bar po-loading-icon-bar-4"></span
          ><span class="po-loading-icon-bar po-loading-icon-bar-5"></span
          ><span class="po-loading-icon-bar po-loading-icon-bar-6"></span
          ><span class="po-loading-icon-bar po-loading-icon-bar-7"></span
          ><span
            class="po-loading-icon-bar po-loading-icon-bar-8"
          ></span></div></po-loading-icon
      ><span class="po-loading-label po-text-ellipsis">${message}</span>
    </div></po-loading
  >
</div>
`;
  return loadBox;
};

const showLoadBox = (message: string) => {
  const loadBox = createLoadBox(message);
  document.body.appendChild(loadBox);
  return loadBox;
}

const removeLoadBox = (loadBox: HTMLElement) => {
  loadBox.remove();
}

const PermisionKeys = Object.keys(PermissionServiceOption);

type PermissionValues = Partial<Record<PermissionServiceOption, boolean>>;

export interface IPermissionService {
  permissions: { [key in PermissionServiceOption]?: boolean };
  hasPermission(permission: PermissionServiceOption): boolean;
}

@Injectable({ providedIn: "root" })
export class PermissionService {
  private readonly userPermissionsUrl = "hgp/v1/userPermissions/";
  private readonly getProgamPermissionUrl =
    this.userPermissionsUrl + "{{programName}}";

  public permissionByApp = new Map<string, PermissionValues>();

  async loadPermissions(app: string) {
    if (this.permissionByApp.has(app)) {
      return this.permissionByApp.get(app);
    }
    let promises = [];
    let permissions: PermissionValues =  PermisionKeys.reduce((acc, key) => {
      acc[PermissionServiceOption[key]] = false;
      return acc;
    }, {});
    this.permissionByApp.set(app, permissions);
    for (const permission of PermisionKeys) {
      let promise = TotvsGpsServices.getInstance<Object>(
        Object,
        this.getProgamPermissionUrl
      )
        .setPathParams({ programName: app + "." + PermissionServiceOption[permission] })
        .get()
        .then((result) => {
          permissions[PermissionServiceOption[permission]] = result["programPermission"] === true;
        });
      promises.push(promise);
    }
    await Promise.all(promises);
    this.permissionByApp.set(app, permissions);
    return permissions;
  }

  hasPermission(app: string, action: PermissionServiceOption): boolean {
    if (this.permissionByApp.has(app)) {
      return this.permissionByApp.get(app)[action];
    }
    return false;
  }
}

@Injectable({ providedIn: "root" })
export class PermissionResolver implements Resolve<any> {
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  async resolve(route: ActivatedRouteSnapshot) {
    const app = route.data["app"];
    const requiredPermission = route.data[
      "requiredPermission"
    ] as PermissionServiceOption;
    
    const box = showLoadBox("Carregando...");
    await this.permissionService.loadPermissions(app);
    removeLoadBox(box);

    if (
      requiredPermission &&
      !this.permissionService.hasPermission(app, requiredPermission)
    ) {
      this.router.navigate([""]);
      return null;
    }

    return this.permissionService.permissionByApp.get(app);
  }
}
