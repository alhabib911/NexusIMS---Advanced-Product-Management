
import React, { useState } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { PayrollRecord, User } from '../types';
import { FileText, MoreHorizontal, Search, DollarSign, Calendar, Users as UsersIcon, ChevronDown } from 'lucide-react';
import { PayrollDetailsModal } from './PayrollDetailsModal';

interface PayrollHistoryProps {
  payrolls: PayrollRecord[];
  employees: User[]; // To get employee names/details if needed
}

export const PayrollHistory: React.FC<PayrollHistoryProps> = ({ payrolls, employees }) => {
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);

  const getEmployeeName = (userId: string) => {
    return employees.find(emp => emp.id === userId)?.name || 'Unknown Employee';
  };

  const filteredPayrolls = payrolls
    .filter(p => {
      const matchesSearch = getEmployeeName(p.userId).toLowerCase().includes(search.toLowerCase()) || 
                            p.month.toLowerCase().includes(search.toLowerCase()) ||
                            p.id.toLowerCase().includes(search.toLowerCase());
      const matchesMonth = filterMonth === 'all' || p.month === filterMonth;
      return matchesSearch && matchesMonth;
    });

  const totalNetPay = filteredPayrolls.reduce((acc, p) => acc + p.netPay, 0);

  const columns = [
    { header: 'Employee', key: 'userName', render: (p: PayrollRecord) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
          {p.userName.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-gray-900">{p.userName}</div>
          <div className="text-[10px] text-gray-400 font-medium">{p.department}</div>
        </div>
      </div>
    )},
    { header: 'Month & Date', key: 'month', render: (p: PayrollRecord) => (
      <div>
        <div className="font-medium text-gray-900">{p.month}</div>
        <div className="text-[10px] text-gray-400 font-medium">{p.date}</div>
      </div>
    )},
    { header: 'Net Pay', key: 'netPay', render: (p: PayrollRecord) => (
      <span className="font-bold text-green-600">${p.netPay.toFixed(2)}</span>
    )},
    { header: 'Status', key: 'status', render: (p: PayrollRecord) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        p.status === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
      }`}>
        {p.status}
      </span>
    )},
    { header: 'Action', key: 'id', render: (p: PayrollRecord) => (
      <button 
        onClick={() => { setSelectedPayroll(p); setIsDetailsModalOpen(true); }}
        className="p-1 hover:bg-gray-50 rounded text-gray-400"
      >
        <MoreHorizontal size={16} />
      </button>
    )}
  ];

  // Fix: Explicitly cast 'a' and 'b' to string to allow .split()
  const monthOptions = Array.from(new Set(payrolls.map(p => p.month))).sort((a, b) => {
    const [monthA, yearA] = (a as string).split(' ');
    const [monthB, yearB] = (b as string).split(' ');
    if (yearA !== yearB) return Number(yearB) - Number(yearA);
    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthOrder.indexOf(monthB) - monthOrder.indexOf(monthA);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll History</h2>
          <p className="text-sm text-gray-500">Overview of all payroll disbursements.</p>
        </div>
        <Button variant="outline" className="shadow-sm">
          <DollarSign size={18} className="mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Disbursements</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-black text-green-600">${totalNetPay.toFixed(2)}</h3>
            <span className="text-[10px] text-gray-400 pb-1">Total</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Records</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-black text-gray-900">{payrolls.length}</h3>
            <span className="text-[10px] text-gray-400 pb-1">Entries</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paid Status</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-black text-green-600">{payrolls.filter(p => p.status === 'PAID').length}</h3>
            <span className="text-[10px] text-gray-400 pb-1">Paid</span>
            <h3 className="text-2xl font-black text-amber-600">{payrolls.filter(p => p.status === 'PENDING').length}</h3>
            <span className="text-[10px] text-gray-400 pb-1">Pending</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" 
            placeholder="Search by employee, month, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Button variant="outline" size="sm" className="w-full justify-between pr-8">
            <Calendar size={14} className="mr-2" /> Filter by Month
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2" />
          </Button>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {monthOptions.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      <Table columns={columns} data={filteredPayrolls} />

      {selectedPayroll && (
        <PayrollDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          payroll={selectedPayroll}
        />
      )}
    </div>
  );
};
