
import React, { useState } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { User, UserRole, AccountStatus } from '../types';
import { Check, X, Shield, User as UserIcon } from 'lucide-react';

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: UserRole.SUPER_ADMIN, status: AccountStatus.APPROVED },
  { id: '2', name: 'Sarah Miller', email: 'sarah@example.com', role: UserRole.MANAGER, status: AccountStatus.APPROVED },
  { id: '3', name: 'Mike Ross', email: 'mike@example.com', role: UserRole.EMPLOYEE, status: AccountStatus.PENDING },
  { id: '4', name: 'Jane Smith', email: 'jane@example.com', role: UserRole.EMPLOYEE, status: AccountStatus.PENDING },
];

export const RoleManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleStatusChange = (userId: string, status: AccountStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
  };

  const columns = [
    { header: 'Name', key: 'name', render: (u: User) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
          {u.name.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-gray-900">{u.name}</div>
          <div className="text-xs text-gray-500">{u.email}</div>
        </div>
      </div>
    )},
    { header: 'Current Role', key: 'role', render: (u: User) => (
      <select 
        className="text-xs bg-gray-50 border border-gray-100 rounded px-2 py-1 outline-none"
        value={u.role}
        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
      >
        <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
        <option value={UserRole.MANAGER}>Manager</option>
        <option value={UserRole.EMPLOYEE}>Sales Man</option>
      </select>
    )},
    { header: 'Status', key: 'status', render: (u: User) => (
      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
        u.status === AccountStatus.APPROVED ? 'bg-green-50 text-green-600' : 
        u.status === AccountStatus.PENDING ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
      }`}>
        {u.status}
      </span>
    )},
    { header: 'Actions', key: 'id', render: (u: User) => (
      <div className="flex items-center gap-2">
        {u.status === AccountStatus.PENDING && (
          <>
            <button 
              onClick={() => handleStatusChange(u.id, AccountStatus.APPROVED)}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Approve"
            >
              <Check size={18} />
            </button>
            <button 
              onClick={() => handleStatusChange(u.id, AccountStatus.REJECTED)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Reject"
            >
              <X size={18} />
            </button>
          </>
        )}
        <button className="text-gray-400 hover:text-gray-600 p-1">Edit</button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">User & Role Management</h2>
        <Button size="sm">
          <Shield size={16} className="mr-2" />
          System Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center gap-4">
          <div className="bg-amber-100 p-2.5 rounded-lg">
            <UserIcon className="text-amber-600" size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Approval</p>
            <p className="text-2xl font-bold text-amber-900">{users.filter(u => u.status === AccountStatus.PENDING).length}</p>
          </div>
        </div>
      </div>

      <Table columns={columns} data={users} />
    </div>
  );
};
