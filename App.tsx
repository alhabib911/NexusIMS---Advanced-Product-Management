
import React, { useState, useEffect } from 'react';
import { User, UserRole, AccountStatus, Customer, SaleRecord, Product, PurchaseRecord, CostRecord, PayrollRecord } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { InventoryManagement } from './components/InventoryManagement';
import { RoleManagement } from './components/RoleManagement';
import { PurchaseManagement } from './components/PurchaseManagement';
import { SupplierManagement } from './components/SupplierManagement';
import { SalesManagement } from './components/SalesManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { CompanyCostManagement } from './components/CompanyCostManagement';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EmployeeManagement } from './components/EmployeeManagement'; // Import EmployeeManagement
import { LoginForm, RegisterForm } from './components/AuthForms';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';

const INITIAL_PURCHASES: PurchaseRecord[] = [
  {
    id: '1',
    date: '2024-05-20',
    supplier: 'Coffee Source Inc',
    productId: 'p1',
    productName: 'Premium Espresso Beans',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop',
    brand: 'Nespresso',
    quantity: 100,
    unitPrice: 28.0,
    salePrice: 45.0,
    productCode: 'ESP-1249',
    barcode: '978123456789'
  }
];

const INITIAL_PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Premium Espresso Beans', 
    sku: 'ESP-1249', 
    barcode: '978123456789',
    category: 'Coffee', 
    brand: 'Nespresso', 
    stock: 124, 
    price: 45.0, 
    cost: 28.0,
    unit: 'kg',
    supplier: 'Coffee Source Inc',
    tax: 5
  },
  {
    id: 'p2',
    name: 'Organic Milk',
    sku: 'MLK-001',
    barcode: '111222333444',
    category: 'Dairy',
    brand: 'BioFarm',
    stock: 5,
    price: 4.5,
    cost: 2.1,
    unit: 'pcs',
    supplier: 'BioFarm Foods',
    tax: 0
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePath, setActivePath] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showApprovalPending, setShowApprovalPending] = useState(false);
  
  // Persistent shared state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(INITIAL_PURCHASES);
  const [costs, setCosts] = useState<CostRecord[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]); // New payroll state
  const [notificationsCleared, setNotificationsCleared] = useState(false);

  const lowStockItems = products.filter(p => p.stock < 10);
  
  useEffect(() => {
    if (lowStockItems.length > 0) {
      setNotificationsCleared(false);
    }
  }, [lowStockItems.length]);

  const handleClearNotifications = () => {
    setNotificationsCleared(true);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (email: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      role,
      status: AccountStatus.APPROVED,
      level: 4 // Default level for logged-in user for now
    };
    setUser(newUser);
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
  };

  const handleRegister = (email: string) => {
    setShowApprovalPending(true);
    setIsRegistering(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    setActivePath('dashboard');
  };

  const handleSaleComplete = (newSale: SaleRecord) => {
    setSales(prev => [newSale, ...prev]);

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const saleItem = newSale.items.find(item => item.productId === p.id);
        if (saleItem) {
          return { ...p, stock: Math.max(0, p.stock - saleItem.quantity) };
        }
        return p;
      });
    });

    setCustomers(prev => {
      const existing = prev.find(c => c.phone === newSale.customerPhone);
      if (existing) {
        return prev.map(c => c.phone === newSale.customerPhone ? {
          ...c,
          totalSpent: c.totalSpent + newSale.grandTotal,
          lastVisit: newSale.date
        } : c);
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        name: newSale.customerName,
        phone: newSale.customerPhone,
        totalSpent: newSale.grandTotal,
        dueAmount: 0,
        lastVisit: newSale.date
      }];
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <span className="text-white font-black text-2xl italic">N</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">NexusIMS</h1>
            <p className="text-gray-500 mt-2">Intelligent Product Management System</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            {isRegistering ? (
              <RegisterForm onSuccess={handleRegister} onSwitch={() => setIsRegistering(false)} />
            ) : (
              <LoginForm onSuccess={handleLogin} onSwitch={() => setIsRegistering(true)} />
            )}
          </div>
        </div>
        <Modal isOpen={showApprovalPending} onClose={() => setShowApprovalPending(false)} title="Account Created">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Waiting for Approval</h3>
            <Button className="w-full" onClick={() => setShowApprovalPending(false)}>Close</Button>
          </div>
        </Modal>
      </div>
    );
  }

  const renderContent = () => {
    switch (activePath) {
      case 'dashboard': return <DashboardOverview />;
      case 'stock': return <InventoryManagement products={products} purchases={purchases} />;
      case 'roles': return <RoleManagement />;
      case 'purchase': return <PurchaseManagement 
                                products={products} 
                                setProducts={setProducts} 
                                purchases={purchases} 
                                setPurchases={setPurchases} 
                              />;
      case 'suppliers': return <SupplierManagement />;
      case 'sales': 
      case 'my-sales':
        return <SalesManagement products={products} sales={sales} onSaleComplete={handleSaleComplete} />;
      case 'customers': return <CustomerManagement customers={customers} />;
      case 'company-cost': return <CompanyCostManagement costs={costs} setCosts={setCosts} />;
      case 'analytics': return <AnalyticsDashboard sales={sales} purchases={purchases} costs={costs} />;
      case 'employees': return <EmployeeManagement />; // Render EmployeeManagement
      case 'payroll':
      case 'payroll-history':
      case 'mgmt-cost':
      case 'leave-admin':
      case 'leave-requests':
        return (
          <div className="h-96 flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Module Under Development</h2>
            <p className="text-gray-500 mt-2">The <span className="font-bold text-blue-600 uppercase">{activePath}</span> module is being integrated.</p>
          </div>
        );
      default: return (
        <div className="h-96 flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Module Under Construction</h2>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfcfc]">
      <Sidebar 
        role={user.role} 
        activePath={activePath} 
        onNavigate={setActivePath} 
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          user={user} 
          activePath={activePath} 
          lowStockItems={lowStockItems}
          onNavigate={setActivePath}
          notificationsCleared={notificationsCleared}
          onClearNotifications={handleClearNotifications}
        />
        <main className="flex-1 overflow-y-auto p-8 max-w-[1400px] mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
