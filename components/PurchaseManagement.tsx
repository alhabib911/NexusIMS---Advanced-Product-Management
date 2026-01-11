
import React, { useState, useEffect } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Product, PurchaseRecord, Supplier } from '../types';
import { Plus, Search, ChevronRight, Image as ImageIcon, Pencil, Hash, Tag, Layers, Briefcase, Ruler } from 'lucide-react';
import { Barcode } from './Barcode';

interface PurchaseManagementProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  purchases: PurchaseRecord[];
  setPurchases: React.Dispatch<React.SetStateAction<PurchaseRecord[]>>;
}

const REGISTERED_SUPPLIERS: Partial<Supplier>[] = [
  { id: '1', companyName: 'Coffee Source Inc', name: 'James Wilson' },
  { id: '2', companyName: 'Global Beans Co', name: 'Maria Garcia' },
  { id: '3', companyName: 'Kitchen Masters Ltd', name: 'Robert Chen' },
  { id: '4', companyName: 'BioFarm Foods', name: 'Lukas Bio' },
];

export const PurchaseManagement: React.FC<PurchaseManagementProps> = ({ 
  products, setProducts, purchases, setPurchases 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    supplier: '',
    productName: '',
    category: 'N/A',
    subCategory: 'N/A',
    brand: 'N/A',
    subBrand: 'N/A',
    unit: 'pcs',
    quantity: 0,
    unitPrice: 0,
    salePrice: 0,
    tax: 0,
    image: ''
  });

  const [productCode, setProductCode] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('');

  useEffect(() => {
    if (formData.productName && !isEditMode) {
      const prefix = formData.productName.split(' ').slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');
      const code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      setProductCode(code);
      setBarcodeValue(Math.floor(100000000000 + Math.random() * 900000000000).toString());
    }
  }, [formData.productName, isEditMode]);

  const handleOpenNewPurchase = () => {
    setIsEditMode(false);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    if (!selectedPurchase) return;
    setIsEditMode(true);
    const product = products.find(p => p.id === selectedPurchase.productId);
    setFormData({
      supplier: selectedPurchase.supplier,
      productName: selectedPurchase.productName,
      category: product?.category || 'N/A',
      subCategory: product?.subCategory || 'N/A',
      brand: selectedPurchase.brand || 'N/A',
      subBrand: product?.subBrand || 'N/A',
      unit: product?.unit || 'pcs',
      quantity: selectedPurchase.quantity,
      unitPrice: selectedPurchase.unitPrice,
      salePrice: selectedPurchase.salePrice,
      tax: product?.tax || 0,
      image: selectedPurchase.image || ''
    });
    setProductCode(selectedPurchase.productCode);
    setBarcodeValue(selectedPurchase.barcode);
    setIsDetailsOpen(false);
    setIsModalOpen(true);
  };

  const handleSavePurchase = () => {
    if (isEditMode && selectedPurchase) {
      setPurchases(prev => prev.map(p => p.id === selectedPurchase.id ? {
        ...p,
        supplier: formData.supplier,
        productName: formData.productName,
        brand: formData.brand,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
        salePrice: Number(formData.salePrice),
        image: formData.image
      } : p));
      
      setProducts(prev => prev.map(p => p.id === selectedPurchase.productId ? {
        ...p,
        name: formData.productName,
        category: formData.category,
        subCategory: formData.subCategory,
        brand: formData.brand,
        subBrand: formData.subBrand,
        price: Number(formData.salePrice),
        cost: Number(formData.unitPrice),
        unit: formData.unit as any,
        supplier: formData.supplier,
        tax: Number(formData.tax),
        image: formData.image
      } : p));
    } else {
      const existingIndex = products.findIndex(p => 
        p.name.toLowerCase() === formData.productName.toLowerCase()
      );

      const purchaseId = Math.random().toString(36).substr(2, 9);
      const productId = existingIndex !== -1 ? products[existingIndex].id : Math.random().toString(36).substr(2, 9);

      const newPurchase: PurchaseRecord = {
        id: purchaseId,
        date: new Date().toISOString().split('T')[0],
        supplier: formData.supplier,
        productId,
        productName: formData.productName,
        brand: formData.brand,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
        salePrice: Number(formData.salePrice),
        productCode: existingIndex !== -1 ? products[existingIndex].sku : productCode,
        barcode: existingIndex !== -1 ? products[existingIndex].barcode : barcodeValue,
        image: formData.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop'
      };

      if (existingIndex !== -1) {
        setProducts(prev => prev.map((p, i) => i === existingIndex ? {
          ...p,
          stock: p.stock + Number(formData.quantity),
          price: Number(formData.salePrice),
          cost: Number(formData.unitPrice)
        } : p));
      } else {
        const newProduct: Product = {
          id: productId,
          name: formData.productName,
          sku: productCode,
          barcode: barcodeValue,
          category: formData.category,
          subCategory: formData.subCategory,
          brand: formData.brand,
          subBrand: formData.subBrand,
          stock: Number(formData.quantity),
          price: Number(formData.salePrice),
          cost: Number(formData.unitPrice),
          unit: formData.unit as any,
          supplier: formData.supplier,
          tax: Number(formData.tax),
          image: newPurchase.image
        };
        setProducts(prev => [...prev, newProduct]);
      }
      setPurchases(prev => [newPurchase, ...prev]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      supplier: '', productName: '', category: 'N/A', subCategory: 'N/A',
      brand: 'N/A', subBrand: 'N/A', unit: 'pcs', quantity: 0,
      unitPrice: 0, salePrice: 0, tax: 0, image: ''
    });
    setProductCode('');
    setBarcodeValue('');
  };

  const handleNumericFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      const field = e.target.name;
      setFormData(prev => ({ ...prev, [field]: '' }));
    }
  };

  const columns = [
    { header: 'Product', key: 'productName', render: (p: PurchaseRecord) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
          {p.image ? <img src={p.image} className="h-full w-full object-cover" /> : <ImageIcon size={18} className="text-gray-400" />}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{p.productName}</div>
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{p.productCode}</div>
        </div>
      </div>
    )},
    { header: 'Supplier', key: 'supplier' },
    { header: 'Qty Added', key: 'quantity', render: (p: PurchaseRecord) => <span className="font-bold text-gray-900">+{p.quantity}</span> },
    { header: 'Date', key: 'date' },
    { header: 'Action', key: 'id', render: (p: PurchaseRecord) => (
      <button 
        onClick={() => { setSelectedPurchase(p); setIsDetailsOpen(true); }}
        className="text-blue-600 hover:text-blue-800"
      >
        <ChevronRight size={20} />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
          <p className="text-sm text-gray-500">Log new stock arrivals and supplier transactions.</p>
        </div>
        <Button onClick={handleOpenNewPurchase}>
          <Plus size={18} className="mr-2" />
          New Purchase
        </Button>
      </div>

      <Table columns={columns} data={purchases} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Purchase" : "New Purchase"} maxWidth="max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Supplier</label>
                <select className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})}>
                  <option value="">Select Supplier</option>
                  {REGISTERED_SUPPLIERS.map(s => <option key={s.id} value={s.companyName}>{s.companyName}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Product Name</label>
                <input className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" placeholder="e.g. Arabica Coffee" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1 flex items-center gap-1"><Tag size={10}/> Category</label>
                  <input className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1 flex items-center gap-1"><Layers size={10}/> Sub-Cat</label>
                  <input className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1 flex items-center gap-1"><Briefcase size={10}/> Brand</label>
                  <input className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1 flex items-center gap-1">Sub-Brand</label>
                  <input className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" value={formData.subBrand} onChange={e => setFormData({...formData, subBrand: e.target.value})} />
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Quantity</label>
                <input 
                  type="number" 
                  name="quantity"
                  className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" 
                  value={formData.quantity} 
                  onFocus={handleNumericFocus}
                  onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Unit Cost ($)</label>
                <input 
                  type="number" 
                  name="unitPrice"
                  className="w-full p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-sm outline-none" 
                  value={formData.unitPrice} 
                  onFocus={handleNumericFocus}
                  onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Sale Price ($)</label>
                <input 
                  type="number" 
                  name="salePrice"
                  className="w-full p-2.5 bg-green-50 border border-green-100 rounded-xl text-sm font-bold outline-none" 
                  value={formData.salePrice} 
                  onFocus={handleNumericFocus}
                  onChange={e => setFormData({...formData, salePrice: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Tax (%)</label>
                <input 
                  type="number" 
                  name="tax"
                  className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" 
                  value={formData.tax} 
                  onFocus={handleNumericFocus}
                  onChange={e => setFormData({...formData, tax: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 flex items-center gap-1"><Ruler size={10}/> Unit</label>
                <input 
                  className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" 
                  placeholder="e.g. Box, Kg"
                  value={formData.unit} 
                  onChange={e => setFormData({...formData, unit: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6 flex flex-col items-center justify-center p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
             <div className="w-full space-y-4">
                <div className="flex flex-col items-center gap-2">
                   <div className="bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                      <Hash size={12} className="text-blue-600" />
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Code: {productCode || 'AUTO'}</span>
                   </div>
                   <Barcode value={barcodeValue || '000000000000'} />
                </div>
                
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Inventory Valuation:</span>
                      <span className="font-bold text-gray-900">${(Number(formData.quantity) * Number(formData.unitPrice)).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Projected Margin:</span>
                      <span className="font-bold text-green-600">
                        {formData.unitPrice > 0 ? (((formData.salePrice - formData.unitPrice) / formData.unitPrice) * 100).toFixed(1) : 0}%
                      </span>
                   </div>
                </div>
             </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-8 mt-4 border-t border-gray-50">
          <Button variant="outline" className="px-8" onClick={() => setIsModalOpen(false)}>Discard</Button>
          <Button className="px-16 py-3 rounded-xl shadow-xl shadow-blue-100" onClick={handleSavePurchase}>
            {isEditMode ? 'Update Record' : 'Add to Inventory'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Purchase Details">
        {selectedPurchase && (
          <div className="space-y-6">
            <div className="flex gap-4 items-center border-b border-gray-50 pb-4">
              <img src={selectedPurchase.image} className="h-16 w-16 rounded-xl object-cover" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedPurchase.productName}</h3>
                <p className="text-sm text-gray-500">Supplier: {selectedPurchase.supplier}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
               <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Purchased Quantity</p>
                  <p className="text-xl font-bold text-gray-900">{selectedPurchase.quantity}</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Unit Cost</p>
                  <p className="text-xl font-bold text-blue-600">${selectedPurchase.unitPrice.toFixed(2)}</p>
               </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsDetailsOpen(false)}>Close</Button>
              <Button variant="secondary" onClick={handleOpenEdit} className="gap-2"><Pencil size={16}/> Edit</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
