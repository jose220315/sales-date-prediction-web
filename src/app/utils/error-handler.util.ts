import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export class ErrorHandlerUtil {
  /**
   * Manejo centralizado de errores HTTP que funciona tanto en browser como en SSR
   * @param serviceName - Nombre del servicio para el log
   */
  static createErrorHandler(serviceName: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`Error en ${serviceName}:`, error);
      
      let errorMessage = 'Ha ocurrido un error inesperado';
      
      // Check if we're in a browser environment before using ErrorEvent
      if (typeof window !== 'undefined' && error.error instanceof ErrorEvent) {
        // Error del lado del cliente (solo en browser)
        errorMessage = `Error: ${error.error.message}`;
      } else if (error.status !== undefined) {
        // Error del lado del servidor
        switch (error.status) {
          case 0:
            if (error.error?.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
              errorMessage = 'Error de certificado SSL. Configurar certificados válidos o usar HTTP para desarrollo.';
            } else {
              errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión a internet o configuración SSL.';
            }
            break;
          case 400:
            errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
            break;
          case 401:
            errorMessage = 'No tienes autorización para realizar esta acción.';
            break;
          case 403:
            errorMessage = 'Acceso prohibido.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor.';
            break;
          case 502:
            errorMessage = 'Error de gateway. El servidor no está disponible.';
            break;
          case 503:
            errorMessage = 'Servicio no disponible temporalmente.';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.message || error.statusText || 'Error desconocido'}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return throwError(() => new Error(errorMessage));
    };
  }
}
