
import React, { useState } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { User, LeaveRequest } from '../types';
import { Calendar, ClipboardList, Search, Filter, CheckCircle2, XCircle, Clock, Info, ChevronDown } from 'lucide-react';
import { Modal } from './ui/Modal';

interface MyLeaveHistoryProps {
  currentUser: User;
  leaveRequests: LeaveRequest[];
}

export const MyLeaveHistory: React.FC<MyLeaveHistoryProps> = ({ currentUser, leaveRequests }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const myLeaveRequests = leaveRequests.filter(req => req.userId === currentUser.id);

  const filteredLeaves = myLeaveRequests
    .filter(req => {
      const matchesSearch = req.type.toLowerCase().includes(search.toLowerCase()) ||
                            req.reason.toLowerCase().includes(search.toLowerCase()) ||
                            req.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()); // Sort by most recent

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const columns = [
    { header: 'Request Date', key: 'requestDate', render: (req: LeaveRequest) => (
      <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
        <Calendar size={14} className="text-gray-400" /> {req.requestDate}
      </div>
    )},
    { header: 'Leave Type', key: 'type', render: (req: LeaveRequest) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        req.type === 'Sick' ? 'bg-red-50 text-red-600' :
        req.type === 'Annual' ? 'bg-blue-50 text-blue-600' :
        req.type === 'Unpaid' ? 'bg-gray-50 text-gray-600' : 'bg-green-50 text-green-600'
      }`}>
        {req.type}
      </span>
    )},
    { header: 'Duration', key: 'duration', render: (req: LeaveRequest) => (
      <span className="text-sm font-medium text-gray-800">
        {calculateDuration(req.startDate, req.endDate)}
      </span>
    )},
    { header: 'Status', key: 'status', render: (req: LeaveRequest) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        req.status === 'APPROVED' ? 'bg-green-50 text-green-600' :
        req.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
      }`}>
        {req.status}
      </span>
    )},
    { header: 'Paid Status', key: 'paidStatus', render: (req: LeaveRequest) => (
      req.status === 'APPROVED' ? (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          req.paidStatus === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
        }`}>
          {req.paidStatus}
        </span>
      ) : (
        <span className="text-[10px] text-gray-400">N/A</span>
      )
    )},
    { header: 'Actions', key: 'id', render: (req: LeaveRequest) => (
      <button 
        onClick={() => { setSelectedLeave(req); setIsDetailsModalOpen(true); }}
        className="p-1 hover:bg-gray-50 rounded text-gray-400"
      >
        <Info size={16} />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Leave History</h2>
          <p className="text-sm text-gray-500">Overview of your submitted leave requests.</p>
        </div>
        <Button onClick={() => alert('Feature coming soon!')} variant="outline" className="shadow-sm">
          <Calendar size={18} className="mr-2" />
          Export History
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" 
            placeholder="Search by type or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Button variant="outline" size="sm" className="w-full justify-between pr-8">
            <Filter size={14} className="mr-2" /> Filter by Status
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2" />
          </Button>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'PENDING' | 'APPROVED' | 'REJECTED')}
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={filteredLeaves} />

      {selectedLeave && (
        <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Leave Request Details">
          <div className="space-y-4">
            <p className="text-sm text-gray-600"><strong>Employee:</strong> {selectedLeave.userName}</p>
            <p className="text-sm text-gray-600"><strong>Request Date:</strong> {selectedLeave.requestDate}</p>
            <p className="text-sm text-gray-600"><strong>Leave Type:</strong> {selectedLeave.type}</p>
            <p className="text-sm text-gray-600"><strong>Period:</strong> {selectedLeave.startDate} to {selectedLeave.endDate} ({calculateDuration(selectedLeave.startDate, selectedLeave.endDate)})</p>
            <p className="text-sm text-gray-600"><strong>Reason:</strong> {selectedLeave.reason}</p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> 
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                selectedLeave.status === 'APPROVED' ? 'bg-green-50 text-green-600' :
                selectedLeave.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
              }`}>
                {selectedLeave.status}
              </span>
            </p>
            {selectedLeave.status === 'APPROVED' && (
              <p className="text-sm text-gray-600">
                <strong>Paid Status:</strong> 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedLeave.paidStatus === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                }`}>
                  {selectedLeave.paidStatus}
                </span>
              </p>
            )}
            {selectedLeave.approverId && <p className="text-sm text-gray-600"><strong>Approved/Denied By:</strong> {selectedLeave.approverId}</p>}
          </div>
          <div className="pt-6 border-t border-gray-100 mt-4">
            <Button className="w-full" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
