
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum AccountStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatar?: string;
  salary?: number;
}

export type PaymentMethod = 'Bank' | 'Mobile Banking' | 'Cash';
export type MobilePaymentProvider = 'G-Pay' | 'Bkash' | 'Rocket' | 'Nagad';

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  location: string;
  totalDue: number;
  totalPaid: number;
  status: 'active' | 'inactive';
  payments: PaymentRecord[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  subCategory?: string;
  brand: string;
  subBrand?: string;
  stock: number;
  price: number;
  cost: number;
  image?: string;
  unit: string;
  supplier: string;
  tax: number;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  supplier: string;
  productId: string;
  productName: string;
  image?: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  salePrice: number;
  productCode: string;
  barcode: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface SaleRecord {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  subTotal: number;
  discount: number;
  vatPercent: number;
  vatAmount: number;
  bagCount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  provider?: MobilePaymentProvider;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  dueAmount: number;
  lastVisit: string;
}

export interface CostRecord {
  id: string;
  date: string;
  category: string;
  amount: number;
  note: string;
}
