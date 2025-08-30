import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🚀 Making request to:', req.url);
  console.log('🔍 Request method:', req.method);
  console.log('📋 Request headers:', req.headers.keys().map(key => `${key}: ${req.headers.get(key)}`));
  
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('❌ HTTP Error Details:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error,
        message: error.message
      });
      
      // Provide specific guidance based on the error
      if (error.status === 0) {
        console.error('� Connection Error: Cannot connect to backend');
        console.error('💡 Backend should be running on: http://localhost:5083');
      } else if (error.status === 404) {
        console.error('🔍 404 Error: Endpoint not found');
        console.error('💡 Check if the API endpoint exists on your backend');
        console.error('🎯 Trying to access:', error.url);
      } else if (error.status >= 400 && error.status < 500) {
        console.error('� Client Error:', error.status, error.statusText);
      } else if (error.status >= 500) {
        console.error('� Server Error:', error.status, error.statusText);
      }
      
      return throwError(() => error);
    })
  );
};
