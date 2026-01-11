
import React, { useState } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Supplier, PaymentMethod, PaymentRecord } from '../types';
import { Plus, Search, Phone, MapPin, Building2, CreditCard, Calendar, CheckCircle2, XCircle, History, Wallet } from 'lucide-react';

const INITIAL_SUPPLIERS: Supplier[] = [
  { 
    id: '1', 
    name: 'James Wilson', 
    companyName: 'Coffee Source Inc', 
    phone: '+1 555-0123', 
    location: 'Seattle, WA', 
    totalDue: 12500, 
    totalPaid: 45000, 
    status: 'active',
    payments: [
      { id: 'pay-1', amount: 5000, date: '2024-05-10', method: 'Bank' },
      { id: 'pay-2', amount: 2000, date: '2024-05-15', method: 'Cash' }
    ]
  },
  { 
    id: '2', 
    name: 'Maria Garcia', 
    companyName: 'Global Beans Co', 
    phone: '+1 555-0199', 
    location: 'New York, NY', 
    totalDue: 0, 
    totalPaid: 12000, 
    status: 'active',
    payments: [
      { id: 'pay-3', amount: 12000, date: '2024-04-20', method: 'Mobile Banking' }
    ]
  },
  { 
    id: '3', 
    name: 'Robert Chen', 
    companyName: 'Kitchen Masters Ltd', 
    phone: '+1 555-0245', 
    location: 'Austin, TX', 
    totalDue: 3400, 
    totalPaid: 8900, 
    status: 'inactive',
    payments: []
  },
];

export const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Form State for new supplier
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    companyName: '',
    phone: '',
    location: ''
  });

  // Form state for payment
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    method: 'Cash' as PaymentMethod
  });

  const handleAddSupplier = () => {
    const s: Supplier = {
      id: Math.random().toString(36).substr(2, 9),
      ...newSupplier,
      totalDue: 0,
      totalPaid: 0,
      status: 'active',
      payments: []
    };
    setSuppliers([...suppliers, s]);
    setIsAddModalOpen(false);
    setNewSupplier({ name: '', companyName: '', phone: '', location: '' });
  };

  const handlePayment = () => {
    if (!selectedSupplier || paymentData.amount <= 0) return;
    
    const newPayment: PaymentRecord = {
      id: `pay-${Math.random().toString(36).substr(2, 9)}`,
      amount: paymentData.amount,
      date: paymentData.date,
      method: paymentData.method
    };

    setSuppliers(suppliers.map(s => {
      if (s.id === selectedSupplier.id) {
        const updatedSupplier = {
          ...s,
          totalDue: Math.max(0, s.totalDue - paymentData.amount),
          totalPaid: s.totalPaid + paymentData.amount,
          payments: [newPayment, ...s.payments]
        };
        // Update selected supplier to refresh the modal view immediately
        setSelectedSupplier(updatedSupplier);
        return updatedSupplier;
      }
      return s;
    }));
    
    // Reset payment data but keep modal open to see history update
    setPaymentData({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: 'Cash'
    });
  };

  const toggleStatus = (id: string) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const columns = [
    { header: 'Supplier Info', key: 'name', render: (s: Supplier) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600">
          <Building2 size={20} />
        </div>
        <div>
          <div className="font-bold text-gray-900">{s.name}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.companyName}</div>
        </div>
      </div>
    )},
    { header: 'Contact', key: 'phone', render: (s: Supplier) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Phone size={12} className="text-gray-400" /> {s.phone}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <MapPin size={12} className="text-gray-400" /> {s.location}
        </div>
      </div>
    )},
    { header: 'Finances', key: 'totalDue', render: (s: Supplier) => (
      <div className="space-y-1">
        <div className="flex justify-between gap-4 text-xs font-medium">
          <span className="text-gray-400">Due:</span>
          <span className="text-red-600 font-bold">${s.totalDue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs font-medium">
          <span className="text-gray-400">Paid:</span>
          <span className="text-green-600 font-bold">${s.totalPaid.toLocaleString()}</span>
        </div>
      </div>
    )},
    { header: 'Status', key: 'status', render: (s: Supplier) => (
      <button 
        onClick={() => toggleStatus(s.id)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
          s.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-400 border border-gray-100'
        }`}
      >
        {s.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
        {s.status}
      </button>
    )},
    { header: 'Actions', key: 'id', render: (s: Supplier) => (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => { setSelectedSupplier(s); setIsPaymentModalOpen(true); }}
      >
        Details
      </Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
          <p className="text-sm text-gray-500">Manage your business partnerships and financial settlements.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add New Supplier
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" 
            placeholder="Search suppliers by name or company..."
          />
        </div>
      </div>

      <Table columns={columns} data={suppliers} />

      {/* Add Supplier Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Supplier">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Supplier Name</label>
            <input 
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm" 
              placeholder="e.g. John Doe"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Company Name</label>
            <input 
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm" 
              placeholder="e.g. Global Supplies Ltd"
              value={newSupplier.companyName}
              onChange={(e) => setNewSupplier({...newSupplier, companyName: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Phone Number</label>
              <input 
                className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm" 
                placeholder="+1 000-0000"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Location</label>
              <input 
                className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm" 
                placeholder="City, Country"
                value={newSupplier.location}
                onChange={(e) => setNewSupplier({...newSupplier, location: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAddSupplier}>Register Supplier</Button>
          </div>
        </div>
      </Modal>

      {/* Payment Details & History Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Supplier Settlement" maxWidth="max-w-4xl">
        {selectedSupplier && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Stats & New Payment */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-100">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold">{selectedSupplier.companyName}</h3>
                      <p className="text-blue-100 text-sm">{selectedSupplier.name}</p>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {selectedSupplier.status}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                      <p className="text-[10px] font-bold uppercase text-blue-100 mb-1">Current Balance</p>
                      <p className="text-2xl font-bold">${selectedSupplier.totalDue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                      <p className="text-[10px] font-bold uppercase text-blue-100 mb-1">Total Settled</p>
                      <p className="text-2xl font-bold">${selectedSupplier.totalPaid.toLocaleString()}</p>
                      {/* Progress bar for paid vs total */}
                      {selectedSupplier.totalPaid + selectedSupplier.totalDue > 0 && (
                        <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white transition-all duration-500" 
                            style={{ 
                              width: `${((selectedSupplier.totalPaid / (selectedSupplier.totalPaid + selectedSupplier.totalDue)) * 100).toFixed(1)}%` 
                            }} 
                          />
                        </div>
                      )}
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Payment Entry</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Payment Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                          type="date" 
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" 
                          value={paymentData.date}
                          onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Payment Method</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <select 
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm appearance-none outline-none"
                          value={paymentData.method}
                          onChange={(e) => setPaymentData({...paymentData, method: e.target.value as PaymentMethod})}
                        >
                          <option value="Bank">Bank Transfer</option>
                          <option value="Mobile Banking">Mobile Banking</option>
                          <option value="Cash">Cash Settlement</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Payment Amount ($)</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xl font-bold text-blue-600 text-center outline-none focus:ring-2 focus:ring-blue-100" 
                        placeholder="0.00"
                        value={paymentData.amount || ''}
                        onChange={(e) => setPaymentData({...paymentData, amount: Number(e.target.value)})}
                      />
                    </div>
                 </div>
                 <Button className="w-full py-4 shadow-lg shadow-blue-100" onClick={handlePayment}>Process Payment</Button>
              </div>
            </div>

            {/* Right Column: Payment History */}
            <div className="md:col-span-7 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <History size={18} className="text-gray-400" />
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment History</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-3">
                {selectedSupplier.payments && selectedSupplier.payments.length > 0 ? (
                  selectedSupplier.payments.map((payment) => (
                    <div key={payment.id} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 border border-gray-50 flex items-center justify-center text-gray-400">
                          {payment.method === 'Bank' ? <Building2 size={18} /> : 
                           payment.method === 'Cash' ? <Wallet size={18} /> : 
                           <CreditCard size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">${payment.amount.toLocaleString()}</p>
                          <p className="text-[10px] font-medium text-gray-500">{payment.method} • {payment.date}</p>
                        </div>
                      </div>
                      <div className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                        Success
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <History size={32} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">No payment history available.</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 mt-4">
                <Button variant="outline" className="w-full py-3" onClick={() => setIsPaymentModalOpen(false)}>Close Window</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
