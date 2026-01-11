
import React, { useState } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { CostRecord } from '../types';
import { Plus, Search, Receipt, Calendar, Tag, DollarSign, FileText } from 'lucide-react';

interface CompanyCostManagementProps {
  costs: CostRecord[];
  setCosts: React.Dispatch<React.SetStateAction<CostRecord[]>>;
}

const DEFAULT_CATEGORIES = [
  'Office Rent',
  'Snacks',
  'Employee Salary',
  'Electricity Bill',
  'Internet Bill',
  'Miscellaneous'
];

export const CompanyCostManagement: React.FC<CompanyCostManagementProps> = ({ costs, setCosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: 0,
    note: ''
  });

  const [customCategory, setCustomCategory] = useState(false);

  const handleSave = () => {
    if (!formData.category || formData.amount <= 0) return;
    
    const newCost: CostRecord = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData
    };
    
    setCosts([newCost, ...costs]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      note: ''
    });
    setCustomCategory(false);
  };

  const filteredCosts = costs.filter(c => 
    c.category.toLowerCase().includes(search.toLowerCase()) || 
    c.note.toLowerCase().includes(search.toLowerCase())
  );

  const totalCost = filteredCosts.reduce((acc, curr) => acc + curr.amount, 0);

  const columns = [
    { header: 'Date', key: 'date' },
    { header: 'Category', key: 'category', render: (c: CostRecord) => (
      <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 uppercase">
        {c.category}
      </span>
    )},
    { header: 'Note', key: 'note' },
    { header: 'Amount', key: 'amount', render: (c: CostRecord) => (
      <span className="font-bold text-red-600">-${c.amount.toFixed(2)}</span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Expenses</h2>
          <p className="text-sm text-gray-500">Track and manage operational costs and employee payouts.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-blue-50">
          <Plus size={18} className="mr-2" />
          Add Cost
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Expenses</p>
               <h3 className="text-3xl font-black text-red-600">${totalCost.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
               <Receipt size={24} />
            </div>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" 
            placeholder="Search by category or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table columns={columns} data={filteredCosts} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Company Cost">
        <div className="space-y-4">
           <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Expense Date</label>
              <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type="date" 
                   className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm" 
                   value={formData.date}
                   onChange={e => setFormData({...formData, date: e.target.value})}
                 />
              </div>
           </div>

           <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Cost Category</label>
              <div className="space-y-2">
                 {!customCategory ? (
                   <div className="flex gap-2">
                      <select 
                        className="flex-1 p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        {DEFAULT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <Button variant="outline" size="sm" onClick={() => setCustomCategory(true)}>Other</Button>
                   </div>
                 ) : (
                   <div className="flex gap-2">
                      <input 
                        className="flex-1 p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none"
                        placeholder="Type category name..."
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      />
                      <Button variant="outline" size="sm" onClick={() => setCustomCategory(false)}>List</Button>
                   </div>
                 )}
              </div>
           </div>

           <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Amount ($)</label>
              <div className="relative">
                 <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type="number" 
                   className="w-full pl-10 pr-4 py-2.5 bg-red-50/50 border border-red-100 rounded-xl text-sm font-bold text-red-600" 
                   placeholder="0.00"
                   value={formData.amount || ''}
                   onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                 />
              </div>
           </div>

           <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Note / Description</label>
              <div className="relative">
                 <FileText className="absolute left-3 top-4 text-gray-400" size={16} />
                 <textarea 
                   className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm min-h-[100px] outline-none"
                   placeholder="Enter details about this expense..."
                   value={formData.note}
                   onChange={e => setFormData({...formData, note: e.target.value})}
                 />
              </div>
           </div>

           <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="flex-1 py-3" onClick={handleSave}>Save Expense</Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};
