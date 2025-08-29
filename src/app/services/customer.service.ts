import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer, PaginationResponse, PaginationParams } from '../models/customer.model';
import { environment } from '../../environments/environment';

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
  private handleError(error: any): Observable<never> {
    console.error('Error en CustomerService:', error);
    
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
          errorMessage = 'Recurso no encontrado.';
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
