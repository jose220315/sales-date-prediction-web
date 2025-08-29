export interface Customer {
  id?: string;
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
