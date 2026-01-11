
import React, { useState } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { User, UserRole, AccountStatus } from '../types';
import { Users, UserPlus, Search, Filter, Shield, MoreHorizontal, Mail, Calendar, ChevronDown } from 'lucide-react';
import { EmployeeDetailsModal } from './EmployeeDetailsModal';

interface EmployeeManagementProps {
  employees: User[];
  setEmployees: React.Dispatch<React.SetStateAction<User[]>>;
  currentUserRole: UserRole;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, setEmployees, currentUserRole }) => {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<1 | 2 | 3 | 4 | 'all'>('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);

  const stats = {
    total: employees.length,
    level1: employees.filter(e => e.level === 1).length,
    level2: employees.filter(e => e.level === 2).length,
    level3: employees.filter(e => e.level === 3).length,
    level4: employees.filter(e => e.level === 4).length,
  };

  const filteredEmployees = employees
    .filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = filterLevel === 'all' || e.level === filterLevel;
      return matchesSearch && matchesLevel;
    });

  const handleUpdateEmployee = (updatedEmployee: User) => {
    setEmployees(employees.map(e => (e.id === updatedEmployee.id ? updatedEmployee : e)));
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
      <button 
        onClick={() => { setSelectedEmployee(u); setIsDetailsModalOpen(true); }}
        className="p-1 hover:bg-gray-50 rounded text-gray-400"
      >
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
        {/* Removed "Add Employee" Button as per request */}
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
        <div className="relative">
          <Button variant="outline" size="sm" className="w-full justify-between pr-8">
            <Filter size={14} className="mr-2" /> Filter by Level
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2" />
          </Button>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={filterLevel}
            onChange={(e) => setFilterLevel(Number(e.target.value) as 1 | 2 | 3 | 4 | 'all')}
          >
            <option value="all">All Levels</option>
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
            <option value={4}>Level 4</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={filteredEmployees} />

      {selectedEmployee && (
        <EmployeeDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          employee={selectedEmployee}
          onUpdateEmployee={handleUpdateEmployee}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  );
};