/*
 * Public API Surface of totvs-gps-services
 */

export { TTalkCollection, OrderField, OrderSort, HTTPMethod } from './lib/totvs-gps-services.model';
export { TotvsGpsServices } from './lib/totvs-gps-services.component';
export { TotvsGpsInterceptorService } from './lib/totvs-gps-interceptor.service';
export { TotvsGpsMockRequest } from './lib/totvs-gps-mock-request.component';
export { TotvsGpsDataService } from './lib/totvs-gps-services.service';
export { TotvsGpsServicesModule } from './lib/totvs-gps-services.module';
// zoom generico
export * from './lib/totvs-gps-zoom.model';
export * from './lib/totvs-gps-zoom.service';
// serviço de cache de dados
export * from './lib/totvs-gps-cache.model';
export * from './lib/totvs-gps-cache.service';
