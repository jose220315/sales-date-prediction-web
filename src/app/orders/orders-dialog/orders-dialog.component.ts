import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientOrderSummary } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-dialog.component.html',
  styleUrl: './orders-dialog.component.scss'
})
export class OrdersDialogComponent implements OnInit {
  @Input() customerId!: number;
  @Input() customerName!: string;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  orders: ClientOrderSummary[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Propiedades para paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  // Propiedades para ordenamiento
  sortColumn: string = 'orderId';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    if (this.isOpen && this.customerId) {
      this.loadOrders();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen && this.customerId) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    if (!this.customerId) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.orderService.getCustomerOrders(this.customerId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al cargar las órdenes';
        this.isLoading = false;
        console.error('Error cargando órdenes:', error);
      }
    });
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.orders.sort((a, b) => {
      let valueA: any = a[column as keyof ClientOrderSummary];
      let valueB: any = b[column as keyof ClientOrderSummary];

      // Handle date sorting
      if (column.includes('Date')) {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      // Handle null/undefined values
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return this.sortDirection === 'asc' ? 1 : -1;
      if (valueB == null) return this.sortDirection === 'asc' ? -1 : 1;

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  get paginatedOrders(): ClientOrderSummary[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.orders.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.orders.length);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onItemsPerPageChange(items: number): void {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  onClose(): void {
    this.close.emit();
  }

  retryLoad(): void {
    this.loadOrders();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }
}
