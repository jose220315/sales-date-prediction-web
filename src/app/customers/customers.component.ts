import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  sortColumn: string = 'customerName';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Estados para la UI
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.customerService.getCustomers().subscribe({
      next: (customers) => {

        this.customers = customers.map((customer, index) => ({
          ...customer,
          id: customer.id || `customer_${index + 1}`
        }));
        this.filteredCustomers = this.customers;
        this.totalItems = this.customers.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al cargar los clientes';
        this.isLoading = false;
        console.error('Error cargando clientes:', error);
      }
    });
  }

  onSearch(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (this.searchTerm.trim()) {
      this.customerService.getCustomersByName(this.searchTerm.trim()).subscribe({
        next: (customers) => {
          this.filteredCustomers = customers.map((customer, index) => ({
            ...customer,
            id: customer.id || `search_${index + 1}`
          }));
          this.totalItems = this.filteredCustomers.length;
          this.currentPage = 1;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error al buscar clientes';
          this.isLoading = false;
          console.error('Error en búsqueda:', error);
        }
      });
    } else {
      this.filteredCustomers = this.customers;
      this.totalItems = this.customers.length;
      this.currentPage = 1;
      this.isLoading = false;
    }
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredCustomers.sort((a, b) => {
      let valueA: any = a[column as keyof Customer];
      let valueB: any = b[column as keyof Customer];

      // Handle date sorting
      if (column.includes('Date') || column.includes('Order')) {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  get paginatedCustomers(): Customer[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCustomers.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
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

  onViewOrders(customer: Customer): void {
    // TODO: Implement view orders modal
    console.log('View orders for:', customer.customerName);
    alert(`Viewing orders for ${customer.customerName}`);
  }

  onNewOrder(customer: Customer): void {
    // TODO: Implement new order modal
    console.log('New order for:', customer.customerName);
    alert(`Creating new order for ${customer.customerName}`);
  }

  // Método para reintentar la carga en caso de error
  retryLoad(): void {
    this.loadCustomers();
  }
}
