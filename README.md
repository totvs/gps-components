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

### Build
- Change the version number in projects/totvs-gps-utils/package.json.
- Run `npm run build_utils` to build the project. The build artifacts will be stored in the `dist/totvs-gps-utils` directory.
- Run `npm publish ./dist/totvs-gps-utils/totvs-gps-utils-X.Y.Z.tgz` to publish the pachage.
