
import React from 'react';
import { Table } from './ui/Table';
import { Customer } from '../types';
import { Search, UserCircle, Phone, Calendar, DollarSign } from 'lucide-react';

interface CustomerManagementProps {
  customers: Customer[];
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers }) => {
  const columns = [
    { header: 'Customer Info', key: 'name', render: (c: Customer) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <UserCircle size={20} />
        </div>
        <div>
          <div className="font-bold text-gray-900">{c.name}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {c.id}</div>
        </div>
      </div>
    )},
    { header: 'Contact', key: 'phone', render: (c: Customer) => (
      <div className="flex items-center gap-1.5 text-sm text-gray-600">
        <Phone size={14} className="text-gray-400" /> {c.phone || 'N/A'}
      </div>
    )},
    { header: 'Financials', key: 'totalSpent', render: (c: Customer) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <DollarSign size={12} className="text-green-500" />
          <span className="font-bold text-gray-900">Spent: ${c.totalSpent.toFixed(2)}</span>
        </div>
        {c.dueAmount > 0 && (
          <div className="text-[10px] font-bold text-red-600">Due: ${c.dueAmount.toFixed(2)}</div>
        )}
      </div>
    )},
    { header: 'Last Activity', key: 'lastVisit', render: (c: Customer) => (
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Calendar size={14} className="text-gray-400" /> {c.lastVisit}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer List</h2>
          <p className="text-sm text-gray-500">Database of all customers registered via sales transactions.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" 
            placeholder="Search customers by name or phone..."
          />
        </div>
      </div>

      <Table columns={columns} data={customers} />
    </div>
  );
};
