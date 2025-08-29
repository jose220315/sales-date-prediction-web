export interface Customer {
  id?: string;
  customerId: number;
  customerName: string;
  lastOrderDate: string; 
  nextPredictedOrder: string; 
}

export interface PaginationResponse<T> {
  data: T[];
  totalPages: number;
  totalRows: number;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}
