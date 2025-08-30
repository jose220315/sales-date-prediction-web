import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee } from '../models/order.model';
import { PaginationResponse, PaginationParams } from '../models/customer.model';
import { environment } from '../../environments/environment';
import { ErrorHandlerUtil } from '../utils/error-handler.util';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  private apiUrl = `${environment.apiUrl}/Employees`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los empleados
   */
  getEmployees(): Observable<Employee[]> {
    return this.getEmployeesPaginated({ pageNumber: 1, pageSize: 1000 }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene empleados con paginación
   */
  getEmployeesPaginated(pagination?: PaginationParams): Observable<PaginationResponse<Employee>> {
    let params = new HttpParams();
    
    if (pagination?.pageNumber) {
      params = params.set('pageNumber', pagination.pageNumber.toString());
    }
    
    if (pagination?.pageSize) {
      params = params.set('pageSize', pagination.pageSize.toString());
    }

    return this.http.get<PaginationResponse<Employee>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   * @param error
   */
  private handleError = ErrorHandlerUtil.createErrorHandler('EmployeeService');
}
