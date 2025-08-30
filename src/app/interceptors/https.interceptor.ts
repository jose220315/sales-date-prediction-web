// This is an alternative HTTP interceptor for HTTPS with self-signed certificates
// Replace the current interceptor if you need to use HTTPS with self-signed certs

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpsInterceptor: HttpInterceptorFn = (req, next) => {
  // For HTTPS with self-signed certificates, we need to modify the request
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    // Add any specific configuration needed for HTTPS
    setParams: {
      // You can add query parameters if needed
    }
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTPS Error:', error);
      
      // Special handling for SSL certificate errors
      if (error.status === 0) {
        if (error.error?.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
          console.warn('Self-signed certificate detected. For production, use valid SSL certificates.');
          // You could potentially retry with different configuration here
        } else if (error.error?.message?.includes('fetch failed')) {
          console.warn('Fetch failed - likely SSL/CORS issue. Consider using HTTP for development.');
        }
      }
      
      return throwError(() => error);
    })
  );
};
