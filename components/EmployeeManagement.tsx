
import React, { useState } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { User, UserRole, AccountStatus } from '../types';
import { Users, UserPlus, Search, Filter, Shield, MoreHorizontal, Mail, Calendar } from 'lucide-react';

const MOCK_EMPLOYEES: User[] = [
  { id: '1', name: 'Arif Ahmed', email: 'arif@nexus.com', role: UserRole.MANAGER, level: 4, status: AccountStatus.APPROVED, joinDate: '2023-01-15', salary: 45000 },
  { id: '2', name: 'Sara Khan', email: 'sara@nexus.com', role: UserRole.EMPLOYEE, level: 3, status: AccountStatus.APPROVED, joinDate: '2023-05-10', salary: 32000 },
  { id: '3', name: 'Tanvir Hasan', email: 'tanvir@nexus.com', role: UserRole.EMPLOYEE, level: 2, status: AccountStatus.APPROVED, joinDate: '2023-08-22', salary: 28000 },
  { id: '4', name: 'Mitu Akter', email: 'mitu@nexus.com', role: UserRole.EMPLOYEE, level: 1, status: AccountStatus.APPROVED, joinDate: '2024-02-01', salary: 22000 },
  { id: '5', name: 'Rahat Islam', email: 'rahat@nexus.com', role: UserRole.EMPLOYEE, level: 1, status: AccountStatus.PENDING, joinDate: '2024-05-20', salary: 20000 },
  { id: '6', name: 'Nusrat Jahan', email: 'nusrat@nexus.com', role: UserRole.EMPLOYEE, level: 2, status: AccountStatus.APPROVED, joinDate: '2023-11-01', salary: 27000 },
  { id: '7', name: 'Fahim Rahman', email: 'fahim@nexus.com', role: UserRole.MANAGER, level: 3, status: AccountStatus.APPROVED, joinDate: '2022-09-01', salary: 38000 },
];

export const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>(MOCK_EMPLOYEES);
  const [search, setSearch] = useState('');

  const stats = {
    total: employees.length,
    level1: employees.filter(e => e.level === 1).length,
    level2: employees.filter(e => e.level === 2).length,
    level3: employees.filter(e => e.level === 3).length,
    level4: employees.filter(e => e.level === 4).length,
  };

  const columns = [
    { header: 'Employee', key: 'name', render: (u: User) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
          {u.name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-gray-900">{u.name}</div>
          <div className="text-[10px] text-gray-400 font-medium">{u.email}</div>
        </div>
      </div>
    )},
    { header: 'Role', key: 'role', render: (u: User) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        u.role === UserRole.MANAGER ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
      }`}>
        {u.role.replace('_', ' ')}
      </span>
    )},
    { header: 'Level', key: 'level', render: (u: User) => (
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {[1,2,3,4].map(l => (
            <div key={l} className={`h-3 w-1.5 rounded-sm ${u.level && u.level >= l ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-[10px] font-bold text-gray-600">L{u.level || 'N/A'}</span>
      </div>
    )},
    { header: 'Status', key: 'status', render: (u: User) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        u.status === AccountStatus.APPROVED ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
      }`}>
        {u.status}
      </span>
    )},
    { header: 'Join Date', key: 'joinDate', render: (u: User) => (
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Calendar size={12} /> {u.joinDate || 'N/A'}
      </div>
    )},
    { header: 'Action', key: 'id', render: (u: User) => (
      <button className="p-1 hover:bg-gray-50 rounded text-gray-400">
        <MoreHorizontal size={16} />
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-sm text-gray-500">Overview of staff hierarchy and performance levels.</p>
        </div>
        <Button className="shadow-lg shadow-blue-50">
          <UserPlus size={18} className="mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Staff</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-black text-gray-900">{stats.total}</h3>
            <span className="text-[10px] text-gray-400 pb-1">People</span>
          </div>
        </div>
        {[1, 2, 3, 4].map(lvl => (
          <div key={lvl} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">Level {lvl}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-black text-gray-900">{stats[`level${lvl}` as keyof typeof stats]}</h3>
              <span className="text-[10px] text-gray-400 pb-1">Active</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" 
            placeholder="Search by name, email or join date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter size={14} className="mr-2" /> Filter
        </Button>
      </div>

      <Table columns={columns} data={employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))} />
    </div>
  );
};
