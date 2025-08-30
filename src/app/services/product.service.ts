import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/order.model';
import { PaginationResponse, PaginationParams } from '../models/customer.model';
import { environment } from '../../environments/environment';
import { ErrorHandlerUtil } from '../utils/error-handler.util';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private apiUrl = `${environment.apiUrl}/Products`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los productos
   */
  getProducts(): Observable<Product[]> {
    return this.getProductsPaginated({ pageNumber: 1, pageSize: 1000 }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene productos con paginación
   */
  getProductsPaginated(pagination?: PaginationParams): Observable<PaginationResponse<Product>> {
    let params = new HttpParams();
    
    if (pagination?.pageNumber) {
      params = params.set('pageNumber', pagination.pageNumber.toString());
    }
    
    if (pagination?.pageSize) {
      params = params.set('pageSize', pagination.pageSize.toString());
    }

    return this.http.get<PaginationResponse<Product>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   * @param error
   */
  private handleError = ErrorHandlerUtil.createErrorHandler('ProductService');
}
