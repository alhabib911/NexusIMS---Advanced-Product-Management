import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend 
} from 'recharts';
import { ShoppingCart, DollarSign, Wallet, TrendingUp, Receipt, Banknote } from 'lucide-react';
import { SaleRecord, PurchaseRecord, CostRecord, PayrollRecord } from '../types';
import { Button } from './ui/Button';
import { Table } from './ui/Table'; // Import Table component

interface ReportsPageProps {
  sales: SaleRecord[];
  purchases: PurchaseRecord[];
  costs: CostRecord[];
  payrolls: PayrollRecord[];
}

// Helper for consistent tooltip style
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
              <span className="text-[10px] font-medium text-gray-500">{p.name}:</span>
            </div>
            <span className="text-xs font-bold text-gray-900">${p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Helper to aggregate data by month
const aggregateDataByMonth = <T extends { date: string }>(
  records: T[], 
  amountFn: (item: T) => number
): Record<string, number> => {
  const aggregated: Record<string, number> = {};
  records.forEach(record => {
    const month = record.date.substring(0, 7); // YYYY-MM
    aggregated[month] = (aggregated[month] || 0) + amountFn(record);
  });
  return aggregated;
};

export const ReportsPage: React.FC<ReportsPageProps> = ({ sales, purchases, costs, payrolls }) => {
  // Calculate total summary figures for the boxes
  const totalSalesRevenue = useMemo(() => sales.reduce((acc, s) => acc + s.grandTotal, 0), [sales]);
  const totalPurchasesAmount = useMemo(() => purchases.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0), [purchases]);
  const totalCompanyCostsAmount = useMemo(() => costs.reduce((acc, c) => acc + c.amount, 0), [costs]);
  const totalPayrollsAmount = useMemo(() => payrolls.reduce((acc, p) => acc + p.netPay, 0), [payrolls]);

  const monthlyData = useMemo(() => {
    // Fix: Explicitly specify the generic type for aggregateDataByMonth
    const monthlySales = aggregateDataByMonth<SaleRecord>(sales, s => s.grandTotal);
    const monthlyPurchases = aggregateDataByMonth<PurchaseRecord>(purchases, p => p.quantity * p.unitPrice);
    const monthlyCosts = aggregateDataByMonth<CostRecord>(costs, c => c.amount);
    const monthlyPayrolls = aggregateDataByMonth<PayrollRecord>(payrolls, p => p.netPay);

    const allMonths = Array.from(new Set([
      ...Object.keys(monthlySales),
      ...Object.keys(monthlyPurchases),
      ...Object.keys(monthlyCosts),
      ...Object.keys(monthlyPayrolls)
    ])).sort();

    return allMonths.map(month => ({
      name: month,
      sales: monthlySales[month] || 0,
      purchases: monthlyPurchases[month] || 0,
      costs: monthlyCosts[month] || 0,
      payrolls: monthlyPayrolls[month] || 0,
      // Calculate total outflow for the month
      totalOutflow: (monthlyPurchases[month] || 0) + (monthlyCosts[month] || 0) + (monthlyPayrolls[month] || 0),
    }));
  }, [sales, purchases, costs, payrolls]);

  // Define columns for the expenditure table
  const expenditureTableColumns = [
    { header: 'Month', key: 'name' },
    { header: 'Purchases', key: 'purchases', render: (row: any) => `$${row.purchases.toLocaleString()}` },
    { header: 'Company Costs', key: 'costs', render: (row: any) => `$${row.costs.toLocaleString()}` },
    { header: 'Payrolls', key: 'payrolls', render: (row: any) => `$${row.payrolls.toLocaleString()}` },
    { header: 'Total Outflow', key: 'totalOutflow', render: (row: any) => <span className="font-bold text-red-600">-${row.totalOutflow.toLocaleString()}</span> },
  ];

  // Define columns for the sales table
  const salesTableColumns = [
    { header: 'Month', key: 'name' },
    { header: 'Sales Revenue', key: 'sales', render: (row: any) => <span className="font-bold text-green-600">${row.sales.toLocaleString()}</span> },
  ];


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
          <p className="text-sm text-gray-500">Comprehensive overview of sales, expenditures, and payroll.</p>
        </div>
        <Button variant="outline" className="shadow-sm">
          <TrendingUp size={18} className="mr-2" />
          Generate Custom Report
        </Button>
      </div>

      {/* New: Summary Cards (Boxes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sales Revenue</p>
              <h3 className="text-2xl font-black text-green-600">${totalSalesRevenue.toLocaleString()}</h3>
           </div>
           <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <DollarSign size={20} />
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Purchases</p>
              <h3 className="text-2xl font-black text-blue-600">${totalPurchasesAmount.toLocaleString()}</h3>
           </div>
           <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingCart size={20} />
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Company Costs</p>
              <h3 className="text-2xl font-black text-orange-600">${totalCompanyCostsAmount.toLocaleString()}</h3>
           </div>
           <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <Receipt size={20} />
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Payrolls</p>
              <h3 className="text-2xl font-black text-purple-600">${totalPayrollsAmount.toLocaleString()}</h3>
           </div>
           <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Banknote size={20} />
           </div>
        </div>
      </div>

      {/* Graph 1: Expenditure Trends (Purchase, Company Cost, Payroll) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Wallet size={20} className="text-purple-600" /> Monthly Expenditure Breakdown
        </h3>
        <p className="text-sm text-gray-500 -mt-4">Visualize the trends of your operational spending over time.</p>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1a73e8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPayrolls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="purchases" stroke="#1a73e8" fillOpacity={1} fill="url(#colorPurchases)" strokeWidth={2} name="Purchases" />
              <Area type="monotone" dataKey="costs" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCosts)" strokeWidth={2} name="Company Costs" />
              <Area type="monotone" dataKey="payrolls" stroke="#ef4444" fillOpacity={1} fill="url(#colorPayrolls)" strokeWidth={2} name="Payrolls" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* New: Expenditure Data Table */}
        <h4 className="text-base font-bold text-gray-800 pt-4 flex items-center gap-2">
            <Receipt size={16} className="text-gray-500" /> Monthly Expenditure Details
        </h4>
        <Table columns={expenditureTableColumns} data={monthlyData} />
      </div>

      {/* Graph 2: Sales Overview (Sales Revenue) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign size={20} className="text-green-600" /> Monthly Sales Revenue
        </h3>
        <p className="text-sm text-gray-500 -mt-4">Track your sales performance and revenue generation month over month.</p>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} name="Sales Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* New: Sales Data Table */}
        <h4 className="text-base font-bold text-gray-800 pt-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-gray-500" /> Monthly Sales Details
        </h4>
        <Table columns={salesTableColumns} data={monthlyData} />
      </div>
    </div>
  );
};