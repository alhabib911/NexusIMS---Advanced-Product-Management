
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from './ui/Button';
import { Mail, Lock, ShieldCheck, User as UserIcon, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onSuccess: (email: string, password: string, role: UserRole) => void;
  onSwitch: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // New state for password
  const [role, setRole] = useState<UserRole>(UserRole.SUPER_ADMIN);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSuccess(email || 'admin@nexus.com', password || 'admin123', role); // Pass password to onSuccess
      setLoading(false);
    }, 800);
  };

  const handleQuickLogin = (accEmail: string, accPassword: string, accRole: UserRole) => {
    setLoading(true);
    setEmail(accEmail);
    setPassword(accPassword); // Set password for quick login
    setRole(accRole);
    setTimeout(() => {
      onSuccess(accEmail, accPassword, accRole); // Pass password to onSuccess
      setLoading(false);
    }, 500);
  };

  const demoAccounts = [
    { role: 'Super Admin', email: 'admin@nexus.com', pass: 'admin123', type: UserRole.SUPER_ADMIN },
    { role: 'Manager', email: 'manager@nexus.com', pass: 'manager123', type: UserRole.MANAGER },
    { role: 'Sales Man', email: 'sales@nexus.com', pass: 'sales123', type: UserRole.EMPLOYEE },
    { role: 'Pending User', email: 'pending@nexus.com', pass: 'pending123', type: UserRole.EMPLOYEE }, // For testing pending approval
  ];

  return (
    <div className="space-y-6">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              required 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              required 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Login Role</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm appearance-none cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
              <option value={UserRole.MANAGER}>Manager</option>
              <option value={UserRole.EMPLOYEE}>Sales Man</option>
            </select>
          </div>
        </div>

        <Button className="w-full py-6 rounded-xl text-md shadow-lg shadow-blue-100" loading={loading} type="submit">
          Sign in
        </Button>
      </form>

      <div className="border-t border-gray-100 pt-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Quick Demo Login</p>
        <div className="grid grid-cols-1 gap-2">
          {demoAccounts.map((acc) => (
            <button 
              key={acc.role}
              onClick={() => handleQuickLogin(acc.email, acc.pass, acc.type)}
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-600 border border-gray-100 rounded-xl transition-all group hover:border-blue-600"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="h-9 w-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <UserIcon size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 group-hover:text-white transition-colors">{acc.role}</p>
                  <p className="text-[10px] text-gray-500 group-hover:text-blue-100 transition-colors">{acc.email}</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-white transition-colors translate-x-0 group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button type="button" onClick={onSwitch} className="text-sm text-blue-600 font-medium hover:underline">
          Request new account access
        </button>
      </div>
    </div>
  );
};

interface RegisterFormProps {
  onSuccess: (name: string, email: string, password: string, role: UserRole) => void;
  onSwitch: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // New state for password
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE); // Default to Employee role
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSuccess(name, email, password, role); // Pass password to onSuccess
      setLoading(false);
    }, 1200);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
        <input 
          type="text" 
          required 
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
          placeholder="John Doe" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Work Email</label>
        <input 
          type="email" 
          required 
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
          placeholder="name@company.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
        <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              required 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role Requested</label>
        <div className="relative">
          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm appearance-none cursor-pointer"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value={UserRole.MANAGER}>Manager</option>
            <option value={UserRole.EMPLOYEE}>Sales Man</option>
          </select>
        </div>
      </div>
      <Button className="w-full py-6 rounded-xl" loading={loading} type="submit">Submit Request</Button>
      <div className="text-center">
        <button type="button" onClick={onSwitch} className="text-sm text-blue-600 font-medium hover:underline">Back to Login</button>
      </div>
    </form>
  );
};