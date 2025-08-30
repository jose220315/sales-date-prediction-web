import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Shipper } from '../models/order.model';
import { PaginationResponse, PaginationParams } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipperService {
  
  private apiUrl = `${environment.apiUrl}/Shippers`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los enviadores
   */
  getShippers(): Observable<Shipper[]> {
    return this.getShippersPaginated({ pageNumber: 1, pageSize: 1000 }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene enviadores con paginación
   */
  getShippersPaginated(pagination?: PaginationParams): Observable<PaginationResponse<Shipper>> {
    let params = new HttpParams();
    
    if (pagination?.pageNumber) {
      params = params.set('pageNumber', pagination.pageNumber.toString());
    }
    
    if (pagination?.pageSize) {
      params = params.set('pageSize', pagination.pageSize.toString());
    }

    return this.http.get<PaginationResponse<Shipper>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   * @param error
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en ShipperService:', error);
    
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión a internet.';
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
          errorMessage = 'Enviadores no encontrados.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message || 'Error desconocido'}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
