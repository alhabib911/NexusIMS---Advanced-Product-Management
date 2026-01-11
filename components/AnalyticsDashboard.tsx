
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import { TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { SaleRecord, PurchaseRecord, CostRecord } from '../types';

interface AnalyticsDashboardProps {
  sales: SaleRecord[];
  purchases: PurchaseRecord[];
  costs: CostRecord[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ sales, purchases, costs }) => {
  const totalRevenue = useMemo(() => sales.reduce((acc, s) => acc + s.grandTotal, 0), [sales]);
  const totalPurchase = useMemo(() => purchases.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0), [purchases]);
  const totalExpenses = useMemo(() => costs.reduce((acc, c) => acc + c.amount, 0), [costs]);
  
  const netProfit = totalRevenue - (totalPurchase + totalExpenses);
  const isProfit = netProfit >= 0;

  // Aggregate daily or date-based data for charts
  const chartData = useMemo(() => {
    const datesMap: Record<string, { revenue: number; purchase: number; cost: number }> = {};

    sales.forEach(s => {
      datesMap[s.date] = datesMap[s.date] || { revenue: 0, purchase: 0, cost: 0 };
      datesMap[s.date].revenue += s.grandTotal;
    });

    purchases.forEach(p => {
      datesMap[p.date] = datesMap[p.date] || { revenue: 0, purchase: 0, cost: 0 };
      datesMap[p.date].purchase += (p.quantity * p.unitPrice);
    });

    costs.forEach(c => {
      datesMap[c.date] = datesMap[c.date] || { revenue: 0, purchase: 0, cost: 0 };
      datesMap[c.date].cost += c.amount;
    });

    // Convert map to sorted array
    const sortedDates = Object.keys(datesMap).sort();
    
    // Fallback data if no real data yet for a smoother empty state
    if (sortedDates.length === 0) {
      return [
        { name: 'Jan', revenue: 0, purchase: 0, cost: 0, profit: 0 },
        { name: 'Feb', revenue: 0, purchase: 0, cost: 0, profit: 0 },
        { name: 'Mar', revenue: 0, purchase: 0, cost: 0, profit: 0 },
      ];
    }

    return sortedDates.map(date => {
      const { revenue, purchase, cost } = datesMap[date];
      const totalOutflow = purchase + cost;
      return {
        name: date.split('-').slice(1).join('/'), // Show MM/DD
        revenue,
        purchase,
        cost,
        outflow: totalOutflow,
        profit: revenue - totalOutflow
      };
    });
  }, [sales, purchases, costs]);

  const pieData = [
    { name: 'Inventory Purchase', value: totalPurchase, color: '#1a73e8' },
    { name: 'Operational Costs', value: totalExpenses, color: '#f59e0b' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{label}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profit & Loss Center</h2>
          <p className="text-sm text-gray-500">Real-time performance analytics derived from all transactions.</p>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl px-3 py-1.5 flex items-center gap-2">
           <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gross Revenue</p>
           <h3 className="text-3xl font-black text-gray-900">${totalRevenue.toLocaleString()}</h3>
           <div className="mt-2 flex items-center gap-1 text-green-600 font-bold text-xs">
              <TrendingUp size={14} /> Sales Inflow
           </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Cost Outflow</p>
           <h3 className="text-3xl font-black text-gray-900">${(totalPurchase + totalExpenses).toLocaleString()}</h3>
           <div className="mt-2 flex items-center gap-1 text-red-500 font-bold text-xs">
              <ArrowDownRight size={14} /> Purch + Expenses
           </div>
        </div>

        <div className={`p-5 rounded-3xl border shadow-lg flex flex-col justify-center transition-all ${
          isProfit ? 'bg-blue-600 border-blue-600 text-white' : 'bg-red-600 border-red-600 text-white'
        }`}>
           <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Net {isProfit ? 'Profit' : 'Loss'}</p>
           <h3 className="text-4xl font-black">${Math.abs(netProfit).toLocaleString()}</h3>
           <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white transition-all duration-1000" style={{ width: `${Math.min(100, (Math.abs(netProfit) / (totalRevenue || 1)) * 100)}%` }} />
              </div>
              <span className="text-[9px] font-bold">Margin: {((netProfit / (totalRevenue || 1)) * 100).toFixed(1)}%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Graph 1: Revenue vs Cost Comparison */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
               <DollarSign size={16} className="text-blue-600" /> Revenue vs Costs Over Time
            </h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#1a73e8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} />
                     <Tooltip content={<CustomTooltip />} />
                     <Area type="monotone" dataKey="revenue" stroke="#1a73e8" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Revenue" />
                     <Area type="monotone" dataKey="outflow" stroke="#ef4444" fillOpacity={1} fill="url(#colorOutflow)" strokeWidth={2} name="Total Cost" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Graph 2: Profit Line Chart */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
               <TrendingUp size={16} className="text-green-600" /> Net Profit Growth Trajectory
            </h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} />
                     <Tooltip content={<CustomTooltip />} />
                     <Legend iconType="circle" verticalAlign="top" height={30} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                     <Line 
                       type="monotone" 
                       dataKey="profit" 
                       stroke="#10b981" 
                       strokeWidth={3} 
                       dot={{ r: 4, fill: '#10b981', strokeWidth: 1.5, stroke: '#fff' }} 
                       activeDot={{ r: 6 }} 
                       name="Net Profit" 
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Graph 3: Expenditure Pie Chart */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-8 items-center">
               <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                     <Wallet size={16} className="text-orange-500" /> Capital Expenditure Breakdown
                  </h3>
                  <p className="text-xs text-gray-500 mb-6">Distribution of funds between raw inventory and overheads.</p>
                  <div className="space-y-2">
                     {pieData.map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all cursor-default group">
                           <div className="flex items-center gap-2.5">
                              <div className="w-2.5 h-2.5 rounded-full group-hover:scale-125 transition-transform" style={{ backgroundColor: d.color }} />
                              <span className="text-[11px] font-bold text-gray-600">{d.name}</span>
                           </div>
                           <span className="font-black text-gray-900 text-xs">${d.value.toLocaleString()}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="h-[220px] w-full md:w-[40%] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={pieData}
                           cx="50%"
                           cy="50%"
                           innerRadius={50}
                           outerRadius={80}
                           paddingAngle={6}
                           dataKey="value"
                        >
                           {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
