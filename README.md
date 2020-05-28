# GPS Components

> TOTVS Healthcare Components

## Versions

### 0.X / 1.X
Angular 6/7 compatibility

### 2.X
Angular 8 compatibility

### 3.X
Angular 9 compatibility

## Breaking changes

### 3.0.0
- gps-page-list: removed p-filter property

## TotvsGpsServices

### Features
- Get/Post/Put/Delete service factory
- Http Interceptor for Datasul-REST
- GenericZoom
- Cache Service

### Build
- Change the version number in projects/totvs-gps-services/package.json.
- Run `npm run build_services` to build the project. The build artifacts will be stored in the `dist/totvs-gps-services` directory.
- Run `npm publish ./dist/totvs-gps-services/totvs-gps-services-X.Y.Z.tgz` to publish the pachage.


## TotvsGpsControls

### Features
- Form validator
- GPS components

### Build
- Change the version number in projects/totvs-gps-controls/package.json.
- Run `npm run build_controls` to build the project. The build artifacts will be stored in the `dist/totvs-gps-controls` directory.
- Run `npm publish ./dist/totvs-gps-controls/totvs-gps-controls-X.Y.Z.tgz` to publish the pachage.


## TotvsGpsUtils

### Features
- TotvsGpsDateUtils to manipulate Date objects
- TotvsGpsJsonUtils to manipulate JSON objects
- TotvsStringUtils
- TotvsMaskString
- GpsMaintenanceUrl to manipulate and generate url's used on CRUD

### Build
- Change the version number in projects/totvs-gps-utils/package.json.
- Run `npm run build_utils` to build the project. The build artifacts will be stored in the `dist/totvs-gps-utils` directory.
- Run `npm publish ./dist/totvs-gps-utils/totvs-gps-utils-X.Y.Z.tgz` to publish the pachage.

## TotvsGpsCRUD

### Features
- GPSPageFilter - controller for page filter (size,page,disclairmer) and other properties sended on GET request e.g. fiels, expands, query
- GPSPageNavigation - Controller used to navigate through page routes
- GpsCRUDListModel - Model used on CRUD list page
- GpsCRUDMaintenancePage - Controller that is responsible to store active route and to instanciate object on CRUD Edit\Detail Pages.

### Build
- Change the version number in projects/totvs-gps-crud/package.json.
- Run `npm run build_crud` to build the project. The build artifacts will be stored in the `dist/totvs-gps-crud` directory.
- Run `npm publish ./dist/totvs-gps-crud/totvs-gps-crud-X.Y.Z.tgz` to publish the pachage.
