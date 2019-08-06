# GPS Components

> TOTVS Healthcare Components

## TotvsGpsServices

### Features
- Get/Post/Put/Delete service factory
- Http Interceptor for Datasul-REST
- GenericZoom

### Changelog
#### v0.1.0
- Add GenericZoom feature
- Fix in Date type in Path/Query params
#### v0.0.12
- Fix PathParam with Date
#### v0.0.11
- Omit undefined values in query params
#### v0.0.10
- Omit null values in query params
#### v0.0.9
- PathParam with Boolean
#### v0.0.8
- PathParam with Date
#### v0.0.7
- Add setOrder() to build path
#### v0.0.6
- Fix Interceptor's URL Pattern for T-Talk
#### v0.0.5
- Add `setPathParams` method to build path URL with objects
#### v0.0.4
- Add TotvsGpsInterceptorService
#### v0.0.3
- Fix error on empty response

### Build
- Change the version number in projects/totvs-gps-services/package.json.
- Run `npm run build_services` to build the project. The build artifacts will be stored in the `dist/totvs-gps-services` directory.
- Run `npm publish ./dist/totvs-gps-services/totvs-gps-services-X.Y.Z.tgz` to publish the pachage.


## TotvsGpsControls

### Features
- Form validator
- GPS components

### Changelog
#### v0.1.0
- Add gps-order-list component

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

### Changelog
#### v0.1.1
- Add getSeparators() in TotvsStringUtils
#### v0.1.0
- TotvsMaskString
#### v0.0.2
- isISODate() fix

### Build
- Change the version number in projects/totvs-gps-utils/package.json.
- Run `npm run build_utils` to build the project. The build artifacts will be stored in the `dist/totvs-gps-utils` directory.
- Run `npm publish ./dist/totvs-gps-utils/totvs-gps-utils-X.Y.Z.tgz` to publish the pachage.
