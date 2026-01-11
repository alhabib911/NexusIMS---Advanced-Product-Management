
import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { PayrollRecord } from '../types';
import { User, Briefcase, Calendar, DollarSign, Home, Heart, Wifi, Percent, Gift, Clock, CreditCard, Banknote, FileText, CheckCircle2, XCircle } from 'lucide-react';

interface PayrollDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollRecord;
}

export const PayrollDetailsModal: React.FC<PayrollDetailsModalProps> = ({ isOpen, onClose, payroll }) => {
  if (!payroll) return null;

  const totalAllowancesSum = payroll.basicSalary + payroll.houseRent + payroll.medicalAllowance + payroll.internetBillAllowance +
                             payroll.otherAllowances.reduce((sum, o) => sum + o.amount, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Payroll Details: ${payroll.userName}`} maxWidth="max-w-3xl">
      <div className="space-y-6 py-4">
        {/* Header Section */}
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
            {payroll.userName.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">{payroll.userName}</h3>
            <p className="text-sm text-gray-500">{payroll.department} - {payroll.position}</p>
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Payroll ID</p>
            <p className="text-sm font-bold text-gray-800 font-mono">{payroll.id}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Month</p>
            <p className="text-sm font-bold text-gray-800">{payroll.month}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
            <p className="text-sm font-bold text-gray-800">{payroll.date}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
            <p className={`text-sm font-bold uppercase ${payroll.status === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
              {payroll.status}
            </p>
          </div>
        </div>

        {/* Allowances Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Banknote size={20} className="text-blue-600" /> Allowances
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Basic Salary', value: payroll.basicSalary, icon: <DollarSign size={14} /> },
              { label: 'House Rent', value: payroll.houseRent, icon: <Home size={14} /> },
              { label: 'Medical Allowance', value: payroll.medicalAllowance, icon: <Heart size={14} /> },
              { label: 'Internet Bill', value: payroll.internetBillAllowance, icon: <Wifi size={14} /> },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="font-bold text-gray-900">${item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {payroll.otherAllowances.length > 0 && (
            <div className="space-y-2 mt-4">
              <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Other Allowances
              </h5>
              {payroll.otherAllowances.map((other, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                  <span className="flex-1 text-sm text-gray-600">{other.name}</span>
                  <span className="font-bold text-gray-900">${other.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
           <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-4">
            <span className="text-sm font-bold text-gray-700">Total Gross Allowances:</span>
            <span className="text-lg font-black text-blue-600">${totalAllowancesSum.toFixed(2)}</span>
          </div>
        </div>

        {/* Adjustments Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CreditCard size={20} className="text-purple-600" /> Adjustments
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-red-100">
              <div className="flex items-center gap-2">
                <Percent size={14} className="text-red-500" />
                <span className="text-sm text-gray-600">VAT/Tax Deduction</span>
              </div>
              <span className="font-bold text-red-600">-${payroll.vatTaxDeduction.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-green-100">
              <div className="flex items-center gap-2">
                <Gift size={14} className="text-green-500" />
                <span className="text-sm text-gray-600">Bonus</span>
              </div>
              <span className="font-bold text-green-600">+{payroll.bonus.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-500" />
                <span className="text-sm text-gray-600">Overtime Pay</span>
              </div>
              <span className="font-bold text-amber-600">+{payroll.overtimePay.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay & Payment Method */}
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-gray-900">Net Pay:</span>
            <span className="text-3xl font-black text-green-600">${payroll.netPay.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-blue-600" />
              <span className="text-sm font-bold text-gray-800">Payment Method:</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{payroll.method}</span>
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-gray-100">
        <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};