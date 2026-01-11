
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { User, PayrollRecord, PaymentMethod, SalaryDetails } from '../types';
import { Plus, Calendar, User as UserIcon, Building2, Briefcase, DollarSign, Home, Heart, Wifi, Percent, Gift, Clock, CreditCard, PiggyBank, Receipt, Text, Trash2, Coins, CheckCircle2, CircleDashed } from 'lucide-react';

interface PayrollFormProps {
  employees: User[];
  setPayrolls: React.Dispatch<React.SetStateAction<PayrollRecord[]>>;
  onNavigate: (path: string) => void; // Added for navigation
}

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const PayrollForm: React.FC<PayrollFormProps> = ({ employees, setPayrolls, onNavigate }) => {
  const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    month: `${currentMonthName} ${currentYear}`,
    date: new Date().toISOString().split('T')[0],
    userId: '',
    userName: '',
    department: '',
    position: '',
    basicSalary: 0,
    houseRent: 0,
    medicalAllowance: 0,
    internetBillAllowance: 0,
    otherAllowances: [] as { name: string; amount: number }[],
    vatTaxDeduction: 0,
    bonus: 0,
    overtimePay: 0,
    method: 'Bank' as PaymentMethod,
  });

  const [status, setStatus] = useState<'PAID' | 'PENDING'>('PAID'); // New state for payment status

  const [selectedEmployeeSalaryDetails, setSelectedEmployeeSalaryDetails] = useState<SalaryDetails | null>(null);

  useEffect(() => {
    if (formData.userId) {
      const employee = employees.find(emp => emp.id === formData.userId);
      if (employee) {
        setFormData(prev => ({
          ...prev,
          userName: employee.name,
          department: employee.department || 'N/A',
          position: employee.position || 'N/A',
          basicSalary: employee.salaryDetails?.basic || 0,
          houseRent: employee.salaryDetails?.houseRent || 0,
          medicalAllowance: employee.salaryDetails?.medical || 0,
          internetBillAllowance: employee.salaryDetails?.internetBill || 0,
          otherAllowances: employee.salaryDetails?.others || [],
        }));
        setSelectedEmployeeSalaryDetails(employee.salaryDetails || null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        userName: '',
        department: '',
        position: '',
        basicSalary: 0,
        houseRent: 0,
        medicalAllowance: 0,
        internetBillAllowance: 0,
        otherAllowances: [],
      }));
      setSelectedEmployeeSalaryDetails(null);
    }
  }, [formData.userId, employees]);

  const calculateNetPay = () => {
    const totalAllowances = formData.basicSalary + formData.houseRent + formData.medicalAllowance + formData.internetBillAllowance +
      formData.otherAllowances.reduce((sum, o) => sum + o.amount, 0);
    const grossPay = totalAllowances + formData.bonus + formData.overtimePay;
    const netPay = grossPay - formData.vatTaxDeduction;
    return Math.max(0, netPay); // Ensure net pay isn't negative
  };

  const handleOtherAllowanceChange = (index: number, field: 'name' | 'amount', value: string | number) => {
    setFormData(prev => {
      const newOthers = [...prev.otherAllowances];
      if (field === 'name') {
        newOthers[index] = { ...newOthers[index], name: value as string };
      } else {
        newOthers[index] = { ...newOthers[index], amount: Number(value) };
      }
      return { ...prev, otherAllowances: newOthers };
    });
  };

  const handleAddOtherAllowance = () => {
    setFormData(prev => ({
      ...prev,
      otherAllowances: [...prev.otherAllowances, { name: '', amount: 0 }],
    }));
  };

  const handleRemoveOtherAllowance = (index: number) => {
    setFormData(prev => ({
      ...prev,
      otherAllowances: prev.otherAllowances.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || calculateNetPay() <= 0) {
      alert("Please select an employee and ensure Net Pay is greater than 0.");
      return;
    }

    const newPayroll: PayrollRecord = {
      id: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      month: formData.month,
      date: formData.date,
      userId: formData.userId,
      userName: formData.userName,
      department: formData.department,
      position: formData.position,
      basicSalary: formData.basicSalary,
      houseRent: formData.houseRent,
      medicalAllowance: formData.medicalAllowance,
      internetBillAllowance: formData.internetBillAllowance,
      otherAllowances: formData.otherAllowances,
      vatTaxDeduction: formData.vatTaxDeduction,
      bonus: formData.bonus,
      overtimePay: formData.overtimePay,
      netPay: calculateNetPay(),
      status: status, // Use the selected status here
      method: formData.method,
    };

    setPayrolls(prev => [newPayroll, ...prev]);
    // Reset form
    setFormData({
      month: `${currentMonthName} ${currentYear}`,
      date: new Date().toISOString().split('T')[0],
      userId: '',
      userName: '',
      department: '',
      position: '',
      basicSalary: 0,
      houseRent: 0,
      medicalAllowance: 0,
      internetBillAllowance: 0,
      otherAllowances: [],
      vatTaxDeduction: 0,
      bonus: 0,
      overtimePay: 0,
      method: 'Bank',
    });
    setStatus('PAID'); // Reset status to PAID after submission
    alert("Payroll entry added successfully!");
  };

  const currentNetPay = calculateNetPay();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll Entry</h2>
          <p className="text-sm text-gray-500">Add and manage monthly salary disbursements.</p>
        </div>
        <Button variant="outline" className="shadow-sm" onClick={() => onNavigate('payroll-history')}>
          <Receipt size={18} className="mr-2" />
          View Payroll History
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Row: Month, Date, Employee Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Month</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50 appearance-none cursor-pointer"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                >
                  {MONTH_OPTIONS.map((m, index) => (
                    <option key={index} value={`${m} ${currentYear}`}>{m} {currentYear}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Select Employee</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select
                  className="w-full pl-10 pr-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50 appearance-none cursor-pointer"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Employee Details & Allowances */}
          {formData.userId && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1"><Briefcase size={14} /> Department</label>
                  <p className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-800">{formData.department}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1"><Briefcase size={14} /> Position</label>
                  <p className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-800">{formData.position}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <PiggyBank size={20} className="text-blue-600" /> Allowances
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Basic Salary', key: 'basicSalary', icon: <DollarSign size={14} /> },
                  { label: 'House Rent', key: 'houseRent', icon: <Home size={14} /> },
                  { label: 'Medical Allowance', key: 'medicalAllowance', icon: <Heart size={14} /> },
                  { label: 'Internet Bill', key: 'internetBillAllowance', icon: <Wifi size={14} /> },
                ].map(item => (
                  <div key={item.key}>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                      {item.icon} {item.label}
                    </label>
                    <input
                      type="number"
                      className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-800 outline-none"
                      value={formData[item.key as keyof typeof formData] as number || 0}
                      readOnly // Auto-filled from employee details
                    />
                  </div>
                ))}
              </div>

              {/* Other Allowances Section */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                    <Text size={14} /> Other Allowances
                  </h4>
                  <Button variant="secondary" size="sm" onClick={handleAddOtherAllowance}><Plus size={12} className="mr-1" /> Add Custom</Button>
                </div>
                {formData.otherAllowances.length > 0 ? formData.otherAllowances.map((other, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={other.name}
                      onChange={(e) => handleOtherAllowanceChange(index, 'name', e.target.value)}
                      placeholder="Allowance name"
                      className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none"
                    />
                    <input
                      type="number"
                      value={other.amount || ''}
                      onChange={(e) => handleOtherAllowanceChange(index, 'amount', e.target.value)}
                      placeholder="Amount"
                      className="w-24 p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm text-right outline-none"
                    />
                    <Button variant="danger" size="sm" onClick={() => handleRemoveOtherAllowance(index)}><Trash2 size={12} /></Button>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400">No custom allowances added.</p>
                )}
              </div>

              {/* Deductions & Bonuses */}
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <Coins size={20} className="text-purple-600" /> Adjustments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1"><Percent size={14} /> VAT/Tax Deduction</label>
                  <input
                    type="number"
                    className="w-full p-2.5 bg-red-50/50 border border-red-100 rounded-xl text-sm font-bold text-red-600 outline-none"
                    value={formData.vatTaxDeduction || 0}
                    onChange={(e) => setFormData({ ...formData, vatTaxDeduction: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1"><Gift size={14} /> Bonus</label>
                  <input
                    type="number"
                    className="w-full p-2.5 bg-green-50/50 border border-green-100 rounded-xl text-sm font-bold text-green-600 outline-none"
                    value={formData.bonus || 0}
                    onChange={(e) => setFormData({ ...formData, bonus: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1"><Clock size={14} /> Overtime Pay</label>
                  <input
                    type="number"
                    className="w-full p-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm font-bold text-amber-600 outline-none"
                    value={formData.overtimePay || 0}
                    onChange={(e) => setFormData({ ...formData, overtimePay: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <CreditCard size={8} /> Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Bank', 'Mobile Banking', 'Cash'].map(method => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setFormData({...formData, method: method as PaymentMethod})}
                        className={`py-1.5 rounded-lg border text-[9px] font-bold transition-all ${
                          formData.method === method 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                          : 'bg-white text-gray-500 border-gray-100'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
               </div>

              {/* Status Selection */}
              <div className="space-y-1.5 pt-4">
                <label className="text-[8px] font-bold text-gray-400 uppercase flex items-center gap-1">
                  <CheckCircle2 size={8} /> Payment Status
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStatus('PAID')}
                    className={`py-1.5 rounded-lg border text-[9px] font-bold transition-all ${
                      status === 'PAID'
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-white text-gray-500 border-gray-100 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <CheckCircle2 size={12} className="inline mr-1" /> Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('PENDING')}
                    className={`py-1.5 rounded-lg border text-[9px] font-bold transition-all ${
                      status === 'PENDING'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-gray-500 border-gray-100 hover:bg-amber-50 hover:text-amber-600'
                    }`}
                  >
                    <CircleDashed size={12} className="inline mr-1" /> Pending
                  </button>
                </div>
              </div>


              {/* Net Pay & Submit */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6">
                <span className="text-xl font-black text-gray-900">Net Pay:</span>
                <span className="text-3xl font-black text-green-600">${currentNetPay.toFixed(2)}</span>
              </div>
              <Button type="submit" className="w-full py-4 rounded-xl shadow-lg shadow-blue-100" disabled={!formData.userId || currentNetPay <= 0}>
                <Plus size={18} className="mr-2" /> Record Payroll
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};