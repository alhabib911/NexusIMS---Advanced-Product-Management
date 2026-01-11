
import React, { useState, useRef } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Product, SaleRecord, SaleItem, PaymentMethod, MobilePaymentProvider } from '../types';
import { Plus, Search, ShoppingCart, Trash2, Tag, Percent, Package, User, Phone, CreditCard, ChevronRight, ScanLine, Printer, FileText, Download } from 'lucide-react';

interface SalesManagementProps {
  products: Product[];
  sales: SaleRecord[];
  onSaleComplete: (sale: SaleRecord) => void;
}

export const SalesManagement: React.FC<SalesManagementProps> = ({ products, sales, onSaleComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SaleRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: 'Guest User', phone: '' });
  const [settlement, setSettlement] = useState({
    discount: 0,
    vatPercent: 5,
    bagCount: 0,
    paymentMethod: 'Cash' as PaymentMethod,
    provider: 'Bkash' as MobilePaymentProvider
  });

  const subTotal = cart.reduce((acc, item) => acc + item.total, 0);
  const vatAmount = (subTotal * settlement.vatPercent) / 100;
  const grandTotal = subTotal + vatAmount - settlement.discount;

  const addToCart = (product: Product) => {
    const existingInCart = cart.find(item => item.productId === product.id);
    const currentQtyInCart = existingInCart ? existingInCart.quantity : 0;
    
    if (currentQtyInCart >= product.stock) {
      alert(`Insufficient stock for ${product.name}. Only ${product.stock} units available.`);
      return;
    }

    if (existingInCart) {
      setCart(cart.map(item => item.productId === product.id ? {
        ...item,
        quantity: item.quantity + 1,
        total: (item.quantity + 1) * item.price
      } : item));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.productId !== id));
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    if (!customerInfo.phone.trim()) {
      alert("Customer contact number is mandatory!");
      return;
    }
    
    const newSale: SaleRecord = {
      id: `SALE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toISOString().split('T')[0],
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      items: [...cart],
      subTotal,
      discount: settlement.discount,
      vatPercent: settlement.vatPercent,
      vatAmount,
      bagCount: settlement.bagCount,
      grandTotal,
      paymentMethod: settlement.paymentMethod,
      provider: settlement.paymentMethod === 'Mobile Banking' ? settlement.provider : undefined
    };

    onSaleComplete(newSale);
    setCart([]);
    setCustomerInfo({ name: 'Guest User', phone: '' });
    setSettlement({ discount: 0, vatPercent: 5, bagCount: 0, paymentMethod: 'Cash', provider: 'Bkash' });
    setIsModalOpen(false);
    setSelectedInvoice(newSale);
    setIsInvoiceOpen(true);
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=500,top=500,width=900,height=900');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice - ${selectedInvoice?.id}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { padding: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery)
  );

  const columns = [
    { header: 'Sale ID', key: 'id', render: (s: SaleRecord) => <span className="font-mono font-bold text-blue-600">{s.id}</span> },
    { header: 'Date', key: 'date' },
    { header: 'Customer', key: 'customerName', render: (s: SaleRecord) => (
      <div>
        <div className="font-medium">{s.customerName}</div>
        <div className="text-[10px] text-gray-400">{s.customerPhone}</div>
      </div>
    )},
    { header: 'Items', key: 'items', render: (s: SaleRecord) => <span>{s.items.length} items</span> },
    { header: 'Total', key: 'grandTotal', render: (s: SaleRecord) => <span className="font-bold text-gray-900">${s.grandTotal.toFixed(2)}</span> },
    { header: 'Method', key: 'paymentMethod', render: (s: SaleRecord) => (
      <span className="text-xs px-2 py-1 bg-gray-50 border border-gray-100 rounded-full font-medium">
        {s.paymentMethod} {s.provider && `(${s.provider})`}
      </span>
    )},
    { header: 'Actions', key: 'id', render: (s: SaleRecord) => (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => { setSelectedInvoice(s); setIsInvoiceOpen(true); }}
        className="flex items-center gap-1"
      >
        <FileText size={12} />
        Invoice
      </Button>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales History</h2>
          <p className="text-sm text-gray-500">Overview of all transactions and customer purchases.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-blue-100">
          <Plus size={18} className="mr-2" />
          Add New Sales
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" 
            placeholder="Search sales records by ID or customer..."
          />
        </div>
      </div>

      <Table columns={columns} data={sales} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Sales Transaction" maxWidth="max-w-[1100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[500px]">
          {/* Left Side: Product Selection */}
          <div className="lg:col-span-7 flex flex-col space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" 
                  placeholder="Scan or Search..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="secondary" size="sm" className="px-3 py-1">
                <ScanLine size={16} />
              </Button>
            </div>

            <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex flex-col">
               <div className="p-2 bg-white border-b border-gray-100">
                  <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Products</h4>
               </div>
               <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[350px] overflow-y-auto">
                  {filteredProducts.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className={`p-2.5 rounded-xl border text-left transition-all group ${
                        product.stock <= 0 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60' 
                        : 'bg-white border-gray-100 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">{product.sku}</span>
                        <span className="text-xs font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      </div>
                      <h5 className={`text-xs font-bold transition-colors line-clamp-1 ${product.stock <= 0 ? 'text-gray-400' : 'text-gray-800 group-hover:text-blue-600'}`}>{product.name}</h5>
                      <div className="flex justify-between items-center mt-0.5">
                        <p className={`text-[9px] ${product.stock < 10 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                          {product.stock <= 0 ? 'Out of Stock' : `${product.stock} ${product.unit}`}
                        </p>
                      </div>
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Side: Cart & Customer */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-[250px]">
              <div className="p-2 border-b border-gray-50 flex items-center justify-between bg-blue-50/20">
                <div className="flex items-center gap-1.5">
                  <ShoppingCart size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-gray-800">Order</span>
                </div>
                <span className="text-[8px] font-bold text-blue-600 bg-white border border-blue-100 px-1.5 py-0.5 rounded-full">{cart.length} ITEMS</span>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[180px] p-2 space-y-1.5">
                {cart.length > 0 ? cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg border border-gray-50 group">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.productName}</p>
                      <p className="text-[9px] text-gray-400">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">${item.total.toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.productId)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-400 opacity-30">
                    <ShoppingCart size={20} className="mb-1" />
                    <p className="text-[9px]">Empty</p>
                  </div>
                )}
              </div>

              <div className="p-2 bg-gray-50 border-t border-gray-100 rounded-b-xl space-y-1.5">
                <div className="grid grid-cols-3 gap-1.5">
                   <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-gray-400 uppercase">Discount</label>
                      <input 
                        type="number" 
                        className="w-full p-1.5 bg-white border border-gray-200 rounded text-xs outline-none" 
                        value={settlement.discount || ''}
                        onChange={(e) => setSettlement({...settlement, discount: Number(e.target.value)})}
                      />
                   </div>
                   <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-gray-400 uppercase">VAT %</label>
                      <input 
                        type="number" 
                        className="w-full p-1.5 bg-white border border-gray-200 rounded text-xs outline-none" 
                        value={settlement.vatPercent || ''}
                        onChange={(e) => setSettlement({...settlement, vatPercent: Number(e.target.value)})}
                      />
                   </div>
                   <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-gray-400 uppercase">Bags</label>
                      <input 
                        type="number" 
                        className="w-full p-1.5 bg-white border border-gray-200 rounded text-xs outline-none" 
                        value={settlement.bagCount || ''}
                        onChange={(e) => setSettlement({...settlement, bagCount: Number(e.target.value)})}
                      />
                   </div>
                </div>

                <div className="pt-1">
                  <div className="flex justify-between text-[9px] text-gray-500">
                    <span>Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-900 border-t border-gray-200 mt-1 pt-1">
                    <span className="text-[10px]">Total</span>
                    <span className="text-lg text-blue-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
               <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[8px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <User size={8} /> Name
                    </label>
                    <input 
                      className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-100" 
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[8px] font-bold text-red-500 uppercase flex items-center gap-1">
                      <Phone size={8} /> Phone*
                    </label>
                    <input 
                      className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-100" 
                      placeholder="Required"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <CreditCard size={8} /> Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Cash', 'Mobile Banking', 'Bank'].map(method => (
                      <button
                        key={method}
                        onClick={() => setSettlement({...settlement, paymentMethod: method as PaymentMethod})}
                        className={`py-1.5 rounded-lg border text-[9px] font-bold transition-all ${
                          settlement.paymentMethod === method 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                          : 'bg-white text-gray-500 border-gray-100'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  
                  {settlement.paymentMethod === 'Mobile Banking' && (
                    <div className="flex gap-1 pt-0.5">
                      {['Bkash', 'G-Pay', 'Rocket', 'Nagad'].map(prov => (
                        <button
                          key={prov}
                          onClick={() => setSettlement({...settlement, provider: prov as MobilePaymentProvider})}
                          className={`flex-1 py-1 rounded-lg border text-[8px] font-black uppercase tracking-tighter ${
                            settlement.provider === prov 
                            ? 'bg-pink-50 text-pink-600 border-pink-200' 
                            : 'bg-white text-gray-400 border-gray-100'
                          }`}
                        >
                          {prov}
                        </button>
                      ))}
                    </div>
                  )}
               </div>

               <Button className="w-full py-3 rounded-xl shadow-md shadow-blue-50 text-sm" size="sm" onClick={handleCompleteSale}>
                  Complete Transaction
                  <ChevronRight size={16} className="ml-1" />
               </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Invoice View Modal */}
      <Modal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} title="Invoice" maxWidth="max-w-xl">
        {selectedInvoice && (
          <div className="space-y-4">
            <div ref={invoiceRef} className="bg-white p-6 rounded-lg border border-gray-100">
               <div className="flex justify-between items-start border-b border-gray-50 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-black text-lg">N</span>
                    </div>
                    <div>
                      <h1 className="text-sm font-bold text-gray-900 tracking-tight">NexusIMS</h1>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-black text-gray-900 uppercase">Invoice</h2>
                    <p className="text-[10px] font-mono text-gray-500"># {selectedInvoice.id}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Date: {selectedInvoice.date}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bill To</h4>
                    <p className="text-xs font-bold text-gray-900">{selectedInvoice.customerName}</p>
                    <p className="text-[9px] text-gray-500">{selectedInvoice.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Method</h4>
                    <p className="text-xs font-bold text-blue-600">{selectedInvoice.paymentMethod}</p>
                  </div>
               </div>

               <div className="mb-4">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="text-left py-2 text-gray-400 uppercase">Item</th>
                        <th className="text-center py-2 text-gray-400 uppercase">Qty</th>
                        <th className="text-right py-2 text-gray-400 uppercase">Price</th>
                        <th className="text-right py-2 text-gray-400 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-medium text-gray-800">{item.productName}</td>
                          <td className="py-2 text-center font-mono">{item.quantity}</td>
                          <td className="py-2 text-right font-mono">${item.price.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>

               <div className="flex justify-end pt-2 border-t border-gray-50">
                  <div className="w-48 space-y-1">
                    <div className="flex justify-between text-[9px] text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-mono">${selectedInvoice.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-500">
                      <span>VAT</span>
                      <span className="font-mono text-red-500">+${selectedInvoice.vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-500">
                      <span>Discount</span>
                      <span className="font-mono text-green-500">-${selectedInvoice.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black text-gray-900 border-t border-gray-50 pt-2 mt-1">
                      <span className="uppercase text-[8px]">Net Amount</span>
                      <span className="text-md text-blue-600">${selectedInvoice.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsInvoiceOpen(false)}>Close</Button>
              <Button size="sm" onClick={handlePrint} className="flex-1 gap-1">
                <Printer size={12} />
                Print
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
