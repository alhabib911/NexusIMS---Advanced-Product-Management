
import React, { useState, useEffect } from 'react';
import { User, UserRole, AccountStatus, Customer, SaleRecord, Product, PurchaseRecord, CostRecord, PayrollRecord, SalaryDetails, LeaveRequest } from './types';
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
import { EmployeeManagement } from './components/EmployeeManagement';
import { UserProfilePage } from './components/UserProfilePage'; 
import { PayrollForm } from './components/PayrollForm'; 
import { PayrollHistory } from './components/PayrollHistory'; 
import { SalaryHistory } from './components/SalaryHistory';
import { LeaveRequestForm } from './components/LeaveRequestForm';
import { MyLeaveHistory } from './components/MyLeaveHistory';       
import { LeaveAdminPage } from './components/LeaveAdminPage';       
import { ReportsPage } from './components/ReportsPage';             // New import for ReportsPage
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

const MOCK_EMPLOYEES: User[] = [
  { 
    id: '1', name: 'Arif Ahmed', email: 'admin@nexus.com', password: 'admin123', role: UserRole.SUPER_ADMIN, level: 4, status: AccountStatus.APPROVED, joinDate: '2023-01-15', salary: 45000,
    dateOfBirth: '1988-03-10', department: 'Operations', position: 'Senior Manager', contactNumber: '+8801712345678',
    presentAddress: '123 Main St, Dhaka', permanentAddress: '456 Village Rd, Comilla',
    educationalQualification: ['BSc in Management', 'MBA'], extraCurricularActivity: ['Cricket', 'Reading'],
    salaryDetails: { basic: 25000, houseRent: 10000, medical: 5000, internetBill: 1000, others: [{name: 'Travel', amount: 4000}] }
  },
  { 
    id: '2', name: 'Sara Khan', email: 'manager@nexus.com', password: 'manager123', role: UserRole.MANAGER, level: 3, status: AccountStatus.APPROVED, joinDate: '2023-05-10', salary: 32000,
    dateOfBirth: '1995-07-22', department: 'Sales', position: 'Sales Executive', contactNumber: '+8801812345678',
    presentAddress: '789 Oak Ave, Chittagong', permanentAddress: '101 Pine St, Sylhet',
    educationalQualification: ['BBA in Marketing'], extraCurricularActivity: ['Gardening'],
    salaryDetails: { basic: 20000, houseRent: 7000, medical: 3000, internetBill: 500, others: [] }
  },
  { 
    id: '3', name: 'Tanvir Hasan', email: 'sales@nexus.com', password: 'sales123', role: UserRole.EMPLOYEE, level: 2, status: AccountStatus.APPROVED, joinDate: '2023-08-22', salary: 28000,
    dateOfBirth: '1992-11-05', department: 'Sales', position: 'Sales Associate', contactNumber: '+8801912345678',
    presentAddress: '321 Elm Rd, Khulna', permanentAddress: '654 Birch Ct, Barisal',
    educationalQualification: ['Diploma in Sales'], extraCurricularActivity: ['Football'],
    salaryDetails: { basic: 18000, houseRent: 6000, medical: 2500, internetBill: 400, others: [] }
  },
  { 
    id: '4', name: 'Mitu Akter', email: 'mitu@nexus.com', password: 'mitu123', role: UserRole.EMPLOYEE, level: 1, status: AccountStatus.APPROVED, joinDate: '2024-02-01', salary: 22000,
    dateOfBirth: '1998-01-01', department: 'Support', position: 'Junior Associate', contactNumber: '+8801512345678',
    presentAddress: '555 River Dr, Rajshahi', permanentAddress: '777 Lake View, Rangpur',
    educationalQualification: ['HSC'], extraCurricularActivity: ['Volunteering'],
    salaryDetails: { basic: 15000, houseRent: 5000, medical: 2000, internetBill: 300, others: [] }
  },
  { 
    id: '5', name: 'Rahat Islam', email: 'pending@nexus.com', password: 'pending123', role: UserRole.EMPLOYEE, level: 1, status: AccountStatus.PENDING, joinDate: '2024-05-20', salary: 20000, // This user is PENDING for testing
    dateOfBirth: '2000-04-12', department: 'Support', position: 'Intern', contactNumber: '+8801612345678',
    presentAddress: '888 Hilltop Ln, Bogra', permanentAddress: '999 Valley Rd, Jessore',
    educationalQualification: ['SSC'], extraCurricularActivity: ['Gaming'],
    salaryDetails: { basic: 12000, houseRent: 4000, medical: 1500, internetBill: 200, others: [] }
  },
];


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePath, setActivePath] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showApprovalPending, setShowApprovalPending] = useState(false);
  const [loginFeedbackMessage, setLoginFeedbackMessage] = useState<string | null>(null);
  
  // Persistent shared state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(INITIAL_PURCHASES);
  const [costs, setCosts] = useState<CostRecord[]>([]);
  const [employees, setEmployees] = useState<User[]>(MOCK_EMPLOYEES);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
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

  const handleLogin = (email: string, password: string, role: UserRole) => {
    setLoginFeedbackMessage(null);
    
    const foundUser = employees.find(e => e.email === email && e.role === role);

    if (!foundUser) {
      setLoginFeedbackMessage("Invalid email or role. Please try again.");
      return;
    }
    
    // Check password
    if (foundUser.password !== password) {
      setLoginFeedbackMessage("Incorrect password. Please try again.");
      return;
    }

    if (foundUser.status === AccountStatus.PENDING) {
      setLoginFeedbackMessage("Your account is pending administrator approval.");
      setShowApprovalPending(true);
      return;
    }

    if (foundUser.status === AccountStatus.REJECTED) {
      setLoginFeedbackMessage("Your account has been rejected. Please contact an administrator.");
      return;
    }
    
    // If APPROVED and password matches
    setUser(foundUser);
    localStorage.setItem('nexus_user', JSON.stringify(foundUser));
    setEmployees(prev => {
      if (!prev.find(emp => emp.id === foundUser.id)) {
        return [...prev, foundUser];
      }
      return prev.map(emp => emp.id === foundUser.id ? foundUser : emp);
    });
  };

  const handleRegister = (name: string, email: string, password: string, role: UserRole) => {
    setLoginFeedbackMessage(null);
    if (employees.some(e => e.email === email)) {
        setLoginFeedbackMessage("An account with this email already exists.");
        setIsRegistering(false);
        return;
    }

    const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        password: password,
        role: role,
        status: AccountStatus.PENDING,
        level: 1,
        joinDate: new Date().toISOString().split('T')[0],
        salaryDetails: { basic: 0, houseRent: 0, medical: 0, internetBill: 0, others: [] }
    };
    
    setEmployees(prev => [...prev, newUser]);
    setLoginFeedbackMessage("Your account has been created and is awaiting administrator approval.");
    setIsRegistering(false);
    setShowApprovalPending(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    setActivePath('dashboard');
    setLoginFeedbackMessage(null);
  };

  const handleUpdateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
    setEmployees(prevEmployees => prevEmployees.map(emp => emp.id === updatedUser.id ? updatedUser : emp));
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
            {loginFeedbackMessage && (
              <div className={`p-3 mb-4 rounded-xl text-sm font-medium ${
                loginFeedbackMessage.includes("approval") || loginFeedbackMessage.includes("exists") ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
              }`}>
                {loginFeedbackMessage}
              </div>
            )}
            {isRegistering ? (
              <RegisterForm onSuccess={handleRegister} onSwitch={() => {setIsRegistering(false); setLoginFeedbackMessage(null);}} />
            ) : (
              <LoginForm onSuccess={handleLogin} onSwitch={() => {setIsRegistering(true); setLoginFeedbackMessage(null);}} />
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
            <h3 className="text-lg font-bold text-gray-900">Awaiting Administrator Approval</h3>
            <p className="text-sm text-gray-500">Your account request has been submitted. Please wait for an administrator to approve your access.</p>
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
      case 'roles': return <RoleManagement employees={employees} setEmployees={setEmployees} />;
      case 'purchase': return <PurchaseManagement 
                                products={products} 
                                setProducts={setProducts} 
                                purchases={purchases} 
                                setPurchases={setPurchases} 
                              />;
      case 'suppliers': return <SupplierManagement />;
      case 'sales': 
      case 'my-sales':
        return <SalesManagement 
                 products={products} 
                 sales={sales} 
                 onSaleComplete={handleSaleComplete} 
                 activePath={activePath}
                 currentUserId={user.id}
               />;
      case 'customers': return <CustomerManagement customers={customers} />;
      case 'company-cost': return <CompanyCostManagement costs={costs} setCosts={setCosts} />;
      case 'analytics': return <AnalyticsDashboard sales={sales} purchases={purchases} costs={costs} />;
      case 'employees': return <EmployeeManagement 
                                employees={employees} 
                                setEmployees={setEmployees}
                                currentUserRole={user.role}
                              />;
      case 'profile': return <UserProfilePage 
                                currentUser={user} 
                                onUpdateUser={handleUpdateCurrentUser}
                              />;
      case 'payroll': return <PayrollForm 
                                employees={employees} 
                                setPayrolls={setPayrolls}
                                onNavigate={setActivePath}
                              />;
      case 'payroll-history': return <PayrollHistory 
                                        payrolls={payrolls} 
                                        employees={employees} 
                                      />;
      case 'salary-history': return <SalaryHistory
                                      currentUser={user}
                                      payrolls={payrolls}
                                    />;
      // New Leave Management Routes
      case 'leave-new': return <LeaveRequestForm
                                  currentUser={user}
                                  setLeaveRequests={setLeaveRequests}
                                  onNavigate={setActivePath}
                                />;
      case 'leave-history': return <MyLeaveHistory
                                    currentUser={user}
                                    leaveRequests={leaveRequests}
                                  />;
      case 'leave-admin': return <LeaveAdminPage
                                    employees={employees}
                                    leaveRequests={leaveRequests}
                                    setLeaveRequests={setLeaveRequests}
                                    approverId={user.id}
                                  />;
      case 'reports':
        return (
          <ReportsPage 
            sales={sales} 
            purchases={purchases} 
            costs={costs} 
            payrolls={payrolls} 
          />
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
