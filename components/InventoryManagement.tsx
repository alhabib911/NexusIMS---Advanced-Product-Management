
import React, { useState } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Product, PurchaseRecord } from '../types';
import { Search, Filter, Info, Package, Calendar, User, DollarSign, Tag, TrendingDown, TrendingUp } from 'lucide-react';
import { Barcode } from './Barcode';

interface InventoryManagementProps {
  products: Product[];
  purchases: PurchaseRecord[];
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({ products, purchases }) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'stock' | 'price'; direction: 'asc' | 'desc' } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter and Sort Logic
  const filteredProducts = products
    .filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search)
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (direction === 'asc') return a[key] - b[key];
      return b[key] - a[key];
    });

  const productPurchases = selectedProduct 
    ? purchases.filter(p => p.productId === selectedProduct.id) 
    : [];

  const columns = [
    { header: 'Product Name', key: 'name', render: (p: Product) => (
      <div className="flex items-center gap-3">
        {p.image ? (
          <img src={p.image} className="h-8 w-8 rounded-lg object-cover bg-gray-50 border border-gray-100" />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
            <Package size={14} />
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900">{p.name}</div>
          <div className="text-[10px] text-gray-400 uppercase font-mono">{p.sku}</div>
        </div>
      </div>
    )},
    { header: 'Category', key: 'category' },
    { header: 'Stock Status', key: 'stock', render: (p: Product) => (
      <div className="flex flex-col gap-1">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex w-fit ${
          p.stock < 10 ? 'bg-red-50 text-red-600 border border-red-100' : 
          p.stock < 50 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
          'bg-green-50 text-green-600 border border-green-100'
        }`}>
          {p.stock} {p.unit}
        </span>
        {p.stock < 10 && <span className="text-[8px] font-black text-red-500 animate-pulse">CRITICAL STOCK</span>}
      </div>
    )},
    { header: 'Sale Price', key: 'price', render: (p: Product) => (
      <div className="font-bold text-gray-900">${p.price.toFixed(2)}</div>
    )},
    { header: 'Action', key: 'id', render: (p: Product) => (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => { setSelectedProduct(p); setIsDetailsOpen(true); }}
        className="flex items-center gap-1 text-[10px] uppercase tracking-widest"
      >
        <Info size={14} />
        Details
      </Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-sm text-gray-500">Real-time tracking of product stock and valuation.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by any detail..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none w-72 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-1 bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
             <button 
               onClick={() => setSortConfig({ key: 'stock', direction: sortConfig?.direction === 'asc' ? 'desc' : 'asc' })}
               className={`p-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase transition-all ${sortConfig?.key === 'stock' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
             >
               Qty {sortConfig?.key === 'stock' && (sortConfig.direction === 'asc' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>)}
             </button>
             <button 
               onClick={() => setSortConfig({ key: 'price', direction: sortConfig?.direction === 'asc' ? 'desc' : 'asc' })}
               className={`p-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase transition-all ${sortConfig?.key === 'price' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
             >
               Price {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>)}
             </button>
          </div>
        </div>
      </div>

      <Table columns={columns} data={filteredProducts} />

      {/* Product Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Product Information" maxWidth="max-w-4xl">
        {selectedProduct && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
               <div className="w-full md:w-1/3">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner mb-4">
                    {selectedProduct.image ? (
                      <img src={selectedProduct.image} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <Package size={64} />
                      </div>
                    )}
                  </div>
                  <Barcode value={selectedProduct.barcode} />
               </div>

               <div className="flex-1 space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{selectedProduct.category}</span>
                    <h3 className="text-3xl font-black text-gray-900 mt-2">{selectedProduct.name}</h3>
                    <p className="text-gray-400 font-mono text-sm">{selectedProduct.sku}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock Level</p>
                        <p className={`text-2xl font-black ${selectedProduct.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {selectedProduct.stock} <span className="text-sm font-medium uppercase">{selectedProduct.unit}</span>
                        </p>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Unit Price</p>
                        <p className="text-2xl font-black text-blue-600">${selectedProduct.price.toFixed(2)}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Calendar size={14} /> Purchase History
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {productPurchases.map((purchase, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-colors">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                 <User size={14} />
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-gray-800">{purchase.supplier}</p>
                                 <p className="text-[10px] text-gray-400">{purchase.date}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-bold text-blue-600">+{purchase.quantity} {selectedProduct.unit}</p>
                              <p className="text-[10px] text-gray-400">@ ${purchase.unitPrice.toFixed(2)}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-50">
               <Button variant="outline" className="flex-1" onClick={() => setIsDetailsOpen(false)}>Close Overview</Button>
               <Button className="flex-1 gap-2">
                  <TrendingUp size={16} />
                  Analyze Trends
               </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
