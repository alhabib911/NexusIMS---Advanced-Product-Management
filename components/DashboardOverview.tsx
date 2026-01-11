
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';

const mockData = [
  { name: 'Jan', sales: 4000, purchase: 2400 },
  { name: 'Feb', sales: 3000, purchase: 1398 },
  { name: 'Mar', sales: 2000, purchase: 9800 },
  { name: 'Apr', sales: 2780, purchase: 3908 },
  { name: 'May', sales: 1890, purchase: 4800 },
  { name: 'Jun', sales: 2390, purchase: 3800 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend?: string; color: string }> = ({ 
  title, value, icon, trend, color 
}) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {trend && <p className="text-xs mt-2 text-green-600 font-medium">+{trend} from last month</p>}
    </div>
    <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
      {React.cloneElement(icon as React.ReactElement, { className: `text-${color.split('-')[1]}-600` })}
    </div>
  </div>
);

export const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$42,394" icon={<DollarSign />} trend="12%" color="bg-blue-500" />
        <StatCard title="Active Customers" value="1,284" icon={<Users />} trend="5.4%" color="bg-green-500" />
        <StatCard title="Total Orders" value="542" icon={<ShoppingBag />} trend="2.1%" color="bg-purple-500" />
        <StatCard title="Net Growth" value="18.2%" icon={<TrendingUp />} trend="4.3%" color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">Sales vs Purchase Overview</h3>
            <select className="bg-gray-50 border border-gray-200 text-xs rounded-lg p-1.5 focus:outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1a73e8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#1a73e8" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-6">Inventory Status</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="purchase" fill="#1a73e8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
