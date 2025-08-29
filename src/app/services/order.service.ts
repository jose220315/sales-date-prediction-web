import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientOrderSummary, OrderRead } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene las órdenes de un cliente
   * @param customerId 
   */
  getCustomerOrders(customerId: number): Observable<ClientOrderSummary[]> {
    return this.http.get<ClientOrderSummary[]>(`${this.apiUrl}/Customers/${customerId}/orders`).pipe(
      catchError(this.handleError)
    );
  }

  /**

   * @param orderId 
   */
  getOrderDetails(orderId: number): Observable<OrderRead> {
    return this.http.get<OrderRead>(`${this.apiUrl}/Orders/${orderId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   * @param error
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en OrderService:', error);
    
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
          errorMessage = 'Cliente no encontrado o no tiene órdenes.';
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
