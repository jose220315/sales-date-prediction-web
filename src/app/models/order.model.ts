export interface ClientOrderSummary {
  orderId: number;
  requiredDate: string;
  shippedDate?: string;
  shipName?: string;
  shipAddress?: string;
  shipCity?: string;
}

export interface OrderDetail {
  productId: number;
  productName?: string;
  unitPrice: number;
  qty: number;
  discount: number;
}

export interface OrderRead {
  orderId: number;
  custId?: number;
  empId: number;
  shipperId: number;
  orderDate: string;
  requiredDate: string;
  shippedDate?: string;
  freight: number;
  shipName?: string;
  shipAddress?: string;
  shipCity?: string;
  shipCountry?: string;
  details?: OrderDetail[];
}
