import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateOrderCommand, CreateOrderDetail, Employee, Shipper, Product } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { EmployeeService } from '../../services/employee.service';
import { ShipperService } from '../../services/shipper.service';
import { ProductService } from '../../services/product.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-new-order-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-order-dialog.component.html',
  styleUrl: './new-order-dialog.component.scss'
})
export class NewOrderDialogComponent implements OnInit {
  @Input() customerId?: number;
  @Input() customerName!: string;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() orderCreated = new EventEmitter<void>();

  // Datos para los dropdowns
  employees: Employee[] = [];
  shippers: Shipper[] = [];
  products: Product[] = [];

  // Estados de carga
  isLoadingData: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Formulario principal
  orderForm: CreateOrderCommand = {
    custId: undefined,
    empId: 0,
    shipperId: 0,
    shipName: '',
    shipAddress: '',
    shipCity: '',
    shipCountry: '',
    orderDate: this.getCurrentDate(),
    requiredDate: this.getDefaultRequiredDate(),
    shippedDate: '',
    freight: 0,
    details: [this.createEmptyOrderDetail()]
  };

  constructor(
    private orderService: OrderService,
    private employeeService: EmployeeService,
    private shipperService: ShipperService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    if (this.isOpen) {
      this.loadFormData();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen && !this.employees.length) {
      this.loadFormData();
    }
    
    if (this.isOpen && this.customerId) {
      this.orderForm.custId = this.customerId;
    }
  }

  loadFormData(): void {
    this.isLoadingData = true;
    this.errorMessage = '';

    forkJoin({
      employees: this.employeeService.getEmployees(),
      shippers: this.shipperService.getShippers(),
      products: this.productService.getProducts()
    }).subscribe({
      next: (data) => {
        this.employees = data.employees || [];
        this.shippers = data.shippers || [];
        this.products = data.products || [];
        this.isLoadingData = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos del formulario: ' + error.message;
        this.isLoadingData = false;
      }
    });
  }

  createEmptyOrderDetail(): CreateOrderDetail {
    return {
      productId: 0,
      unitPrice: 0,
      qty: 1,
      discount: 0
    };
  }

  addOrderDetail(): void {
    if (!this.orderForm.details) {
      this.orderForm.details = [];
    }
    this.orderForm.details.push(this.createEmptyOrderDetail());
  }

  removeOrderDetail(index: number): void {
    if (this.orderForm.details && this.orderForm.details.length > 1) {
      this.orderForm.details.splice(index, 1);
    }
  }

  onProductChange(index: number): void {
    const detail = this.orderForm.details?.[index];
    if (detail && detail.productId && !detail.unitPrice) {
      // Aquí podrías cargar el precio del producto desde el backend
      // Por ahora, lo dejamos para que el usuario lo ingrese manualmente
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isSubmitting) {
      return;
    }

    // Validar que hay al menos un detalle válido
    const validDetails = this.orderForm.details?.filter(detail => 
      detail.productId > 0 && detail.qty > 0
    );

    if (!validDetails || validDetails.length === 0) {
      this.errorMessage = 'Debe agregar al menos un producto válido a la orden.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Preparar los datos para el envío
    const orderToSubmit: CreateOrderCommand = {
      ...this.orderForm,
      details: validDetails,
      // Asegurar que las fechas estén en formato ISO
      orderDate: this.orderForm.orderDate ? new Date(this.orderForm.orderDate).toISOString() : undefined,
      requiredDate: this.orderForm.requiredDate ? new Date(this.orderForm.requiredDate).toISOString() : undefined,
      shippedDate: this.orderForm.shippedDate ? new Date(this.orderForm.shippedDate).toISOString() : undefined
    };

    this.orderService.createOrder(orderToSubmit).subscribe({
      next: () => {
        this.successMessage = 'Orden creada exitosamente';
        this.isSubmitting = false;
        
        // Resetear formulario después de un breve delay
        setTimeout(() => {
          this.resetForm();
          this.orderCreated.emit();
          this.onClose();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Error al crear la orden: ' + error.message;
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.orderForm = {
      custId: this.customerId,
      empId: 0,
      shipperId: 0,
      shipName: '',
      shipAddress: '',
      shipCity: '',
      shipCountry: '',
      orderDate: this.getCurrentDate(),
      requiredDate: this.getDefaultRequiredDate(),
      shippedDate: '',
      freight: 0,
      details: [this.createEmptyOrderDetail()]
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getDefaultRequiredDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 días desde hoy
    return date.toISOString().split('T')[0];
  }

  // Getters para facilitar el acceso en el template
  get isFormValid(): boolean {
    return !!(this.orderForm.empId && this.orderForm.empId > 0 && 
           this.orderForm.shipperId && this.orderForm.shipperId > 0 &&
           this.orderForm.shipName && this.orderForm.shipName.trim() !== '' &&
           this.orderForm.details && 
           this.orderForm.details.length > 0 &&
           this.orderForm.details.some(detail => detail.productId > 0 && detail.qty > 0));
  }

  get hasValidDetails(): boolean {
    return this.orderForm.details ? 
           this.orderForm.details.some(detail => detail.productId > 0 && detail.qty > 0) : 
           false;
  }

  calculateDetailTotal(detail: CreateOrderDetail): number {
    const unitPrice = detail.unitPrice || 0;
    const qty = detail.qty || 0;
    const discount = detail.discount || 0;
    
    const subtotal = unitPrice * qty;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  }

  get orderTotal(): number {
    if (!this.orderForm.details) return this.orderForm.freight || 0;
    
    const detailsTotal = this.orderForm.details.reduce((total, detail) => {
      return total + this.calculateDetailTotal(detail);
    }, 0);
    
    return detailsTotal + (this.orderForm.freight || 0);
  }
}
