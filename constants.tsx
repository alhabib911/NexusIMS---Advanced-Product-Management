
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Wallet, 
  Calendar, 
  Clock, 
  UserCircle, 
  FileText,
  Boxes,
  ClipboardList,
  History,
  Truck,
  Receipt
} from 'lucide-react';
import { UserRole } from './types';

export const COLORS = {
  primary: '#1a73e8',
  sidebarBg: '#ffffff',
  headerBg: '#ffffff',
  border: '#e0e0e0',
  textMain: '#1f1f1f',
  textSecondary: '#5f6368',
};

export const NAVIGATION_ITEMS = {
  [UserRole.SUPER_ADMIN]: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: 'dashboard' },
    { label: 'Role Management', icon: <Users size={20} />, path: 'roles' },
    { label: 'Sales', icon: <TrendingUp size={20} />, path: 'sales' },
    { label: 'Purchase', icon: <ShoppingCart size={20} />, path: 'purchase' },
    { label: 'Suppliers', icon: <Truck size={20} />, path: 'suppliers' },
    { label: 'Stock Management', icon: <Boxes size={20} />, path: 'stock' },
    { label: 'Customer List', icon: <UserCircle size={20} />, path: 'customers' },
    { label: 'Company Cost', icon: <Receipt size={20} />, path: 'company-cost' },
    { label: 'Loss & Profit', icon: <Wallet size={20} />, path: 'analytics' },
    { label: 'Employee Leave', icon: <Calendar size={20} />, path: 'leave-admin' },
    { label: 'Reports', icon: <FileText size={20} />, path: 'reports' },
  ],
  [UserRole.MANAGER]: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: 'dashboard' },
    { label: 'Sales', icon: <TrendingUp size={20} />, path: 'sales' },
    { label: 'Purchase', icon: <ShoppingCart size={20} />, path: 'purchase' },
    { label: 'Suppliers', icon: <Truck size={20} />, path: 'suppliers' },
    { label: 'Customer Management', icon: <UserCircle size={20} />, path: 'customers' },
    { label: 'Stock Management', icon: <Boxes size={20} />, path: 'stock' },
    { label: 'Company Cost', icon: <Receipt size={20} />, path: 'company-cost' },
    { label: 'Employee Mgmt', icon: <Users size={20} />, path: 'employees' },
    { label: 'Leave Requests', icon: <Calendar size={20} />, path: 'leave-requests' },
    { label: 'Reports', icon: <FileText size={20} />, path: 'reports' },
  ],
  [UserRole.EMPLOYEE]: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: 'dashboard' },
    { label: 'My Sales', icon: <TrendingUp size={20} />, path: 'my-sales' },
    { label: 'Attendance', icon: <Clock size={20} />, path: 'attendance' },
    { label: 'Salary History', icon: <Wallet size={20} />, path: 'salary' },
    { label: 'Leave Request', icon: <ClipboardList size={20} />, path: 'leave-new' },
    { label: 'Leave History', icon: <History size={20} />, path: 'leave-history' },
  ],
};
