import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientOrderSummary, OrderRead, CreateOrderCommand } from '../models/order.model';
import { environment } from '../../environments/environment';
import { ErrorHandlerUtil } from '../utils/error-handler.util';

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
   * Obtiene los detalles de una orden
   * @param orderId 
   */
  getOrderDetails(orderId: number): Observable<OrderRead> {
    return this.http.get<OrderRead>(`${this.apiUrl}/Orders/${orderId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva orden
   * @param order 
   */
  createOrder(order: CreateOrderCommand): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Orders`, order).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   * @param error
   */
  private handleError = ErrorHandlerUtil.createErrorHandler('OrderService');
}
