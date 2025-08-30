import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer, PaginationResponse, PaginationParams } from '../models/customer.model';
import { environment } from '../../environments/environment';
import { ErrorHandlerUtil } from '../utils/error-handler.util';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  private apiUrl = `${environment.apiUrl}/Predictions`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los clientes
   */
  getCustomers(): Observable<Customer[]> {
    return this.getPredictions().pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Busca clientes por nombre
   * @param searchTerm 
   */
  getCustomersByName(searchTerm: string): Observable<Customer[]> {
    if (!searchTerm) {
      return this.getCustomers();
    }
    
    const params = new HttpParams().set('search', searchTerm);
    
    return this.http.get<PaginationResponse<Customer>>(this.apiUrl, { params }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene clientes con paginación
   */
  getPredictions(pagination?: PaginationParams): Observable<PaginationResponse<Customer>> {
    let params = new HttpParams();
    
    if (pagination?.pageNumber) {
      params = params.set('pageNumber', pagination.pageNumber.toString());
    }
    
    if (pagination?.pageSize) {
      params = params.set('pageSize', pagination.pageSize.toString());
    }

    return this.http.get<PaginationResponse<Customer>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un cliente específico por ID
   * @param customerId 
   */
  getCustomerById(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea un nuevo cliente 
   * @param customer
   */
  createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   * @param error
   */
  private handleError = ErrorHandlerUtil.createErrorHandler('CustomerService');
}
