
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

export interface SalaryDetails {
  basic: number;
  houseRent: number;
  medical: number;
  internetBill: number;
  others: { name: string; amount: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for authentication
  role: UserRole;
  status: AccountStatus;
  avatar?: string;
  salary?: number; // General salary for simplicity if not using detailed breakdown
  level?: 1 | 2 | 3 | 4;
  joinDate?: string;
  dateOfBirth?: string;
  department?: string;
  position?: string;
  presentAddress?: string;
  permanentAddress?: string;
  contactNumber?: string;
  educationalQualification?: string[];
  extraCurricularActivity?: string[];
  salaryDetails?: SalaryDetails;
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
  employeeId?: string; // Added for 'My Sales' feature
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

export interface PayrollRecord {
  id: string;
  userId: string;
  userName: string;
  department?: string;
  position?: string;
  month: string;
  date: string;
  basicSalary: number;
  houseRent: number;
  medicalAllowance: number;
  internetBillAllowance: number;
  otherAllowances: { name: string; amount: number }[];
  vatTaxDeduction: number;
  bonus: number;
  overtimePay: number;
  netPay: number;
  status: 'PAID' | 'PENDING';
  method: PaymentMethod;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'Casual' | 'Sick' | 'Annual' | 'Unpaid';
  reason: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverId?: string;
  requestDate: string; // New field
  paidStatus?: 'PAID' | 'UNPAID'; // New field for approved leaves
}
