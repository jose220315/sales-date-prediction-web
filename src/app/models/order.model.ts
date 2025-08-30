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

export interface CreateOrderDetail {
  productId: number;
  unitPrice?: number;
  qty: number;
  discount: number;
}

export interface CreateOrderCommand {
  custId?: number;
  empId: number;
  shipperId: number;
  shipName?: string;
  shipAddress?: string;
  shipCity?: string;
  shipCountry?: string;
  orderDate?: string;
  requiredDate?: string;
  shippedDate?: string;
  freight: number;
  details?: CreateOrderDetail[];
}

export interface Employee {
  empId: number;
  fullName: string;
}

export interface Shipper {
  shipperId: number;
  companyName: string;
}

export interface Product {
  productId: number;
  productName: string;
}
