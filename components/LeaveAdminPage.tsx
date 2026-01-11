
import React, { useState } from 'react';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { User, LeaveRequest, AccountStatus } from '../types';
// Fix: Add Search to the lucide-react import list
import { Calendar, ClipboardList, Check, X, User as UserIcon, Clock, Filter, ChevronDown, Info, DollarSign, Search } from 'lucide-react';
import { Modal } from './ui/Modal';

interface LeaveAdminPageProps {
  employees: User[];
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  approverId: string; // The ID of the currently logged-in admin/manager
}

export const LeaveAdminPage: React.FC<LeaveAdminPageProps> = ({ employees, leaveRequests, setLeaveRequests, approverId }) => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [paidStatus, setPaidStatus] = useState<'PAID' | 'UNPAID'>('PAID');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');

  const getEmployeeName = (userId: string) => employees.find(emp => emp.id === userId)?.name || 'Unknown User';

  const pendingRequests = leaveRequests.filter(req => req.status === 'PENDING')
    .sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()); // Oldest first

  const filteredHistory = leaveRequests
    .filter(req => {
      const matchesSearch = getEmployeeName(req.userId).toLowerCase().includes(search.toLowerCase()) ||
                            req.type.toLowerCase().includes(search.toLowerCase()) ||
                            req.reason.toLowerCase().includes(search.toLowerCase()) ||
                            req.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()); // Most recent first

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const handleApproveClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setPaidStatus('PAID'); // Default to PAID
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (selectedRequest) {
      setLeaveRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: 'APPROVED', approverId: approverId, paidStatus: paidStatus } 
          : req
      ));
      setIsApproveModalOpen(false);
      setSelectedRequest(null);
      alert(`Leave request ${selectedRequest.id} approved as ${paidStatus}.`);
    }
  };

  const handleDeny = (requestId: string) => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'REJECTED', approverId: approverId } 
        : req
    ));
    alert(`Leave request ${requestId} denied.`);
  };

  const pendingColumns = [
    { header: 'Employee', key: 'userName', render: (req: LeaveRequest) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
          {req.userName.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-gray-900">{req.userName}</div>
          <div className="text-[10px] text-gray-400 font-medium">Requested: {req.requestDate}</div>
        </div>
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
    { header: 'Period', key: 'period', render: (req: LeaveRequest) => (
      <div>
        <div className="text-xs text-gray-800 font-medium">{req.startDate} - {req.endDate}</div>
        <div className="text-[10px] text-gray-500">{calculateDuration(req.startDate, req.endDate)}</div>
      </div>
    )},
    { header: 'Reason', key: 'reason', render: (req: LeaveRequest) => (
      <p className="text-xs text-gray-600 line-clamp-2 w-48">{req.reason}</p>
    )},
    { header: 'Actions', key: 'id', render: (req: LeaveRequest) => (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleApproveClick(req)}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
          title="Approve"
        >
          <Check size={18} />
        </button>
        <button 
          onClick={() => handleDeny(req.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Deny"
        >
          <X size={18} />
        </button>
      </div>
    )},
  ];

  const historyColumns = [
    { header: 'Employee', key: 'userName', render: (req: LeaveRequest) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
          {req.userName.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-gray-900">{req.userName}</div>
          <div className="text-[10px] text-gray-400 font-medium">Req: {req.requestDate}</div>
        </div>
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
    { header: 'Period', key: 'period', render: (req: LeaveRequest) => (
      <div>
        <div className="text-xs text-gray-800 font-medium">{req.startDate} - {req.endDate}</div>
        <div className="text-[10px] text-gray-500">{calculateDuration(req.startDate, req.endDate)}</div>
      </div>
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Request Management</h2>
          <p className="text-sm text-gray-500">Review and approve employee leave applications.</p>
        </div>
        <Button onClick={() => alert('Feature coming soon!')} variant="outline" className="shadow-sm">
          <Calendar size={18} className="mr-2" />
          Export Data
        </Button>
      </div>

      {/* Pending Requests Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-amber-600 flex items-center gap-2 mb-4">
          <Clock size={20} /> Pending Leave Requests ({pendingRequests.length})
        </h3>
        {pendingRequests.length > 0 ? (
          <Table columns={pendingColumns} data={pendingRequests} />
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">No new leave requests pending approval.</div>
        )}
      </div>

      {/* All Leave History Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
          <ClipboardList size={20} /> All Leave History
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" 
              placeholder="Search by employee, type or reason..."
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

        {filteredHistory.length > 0 ? (
          <Table columns={historyColumns} data={filteredHistory} />
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">No leave history available.</div>
        )}
      </div>

      {/* Approve Leave Modal */}
      <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="Approve Leave Request">
        {selectedRequest && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600"><strong>Employee:</strong> {selectedRequest.userName}</p>
            <p className="text-sm text-gray-600"><strong>Leave Type:</strong> {selectedRequest.type}</p>
            <p className="text-sm text-gray-600"><strong>Period:</strong> {selectedRequest.startDate} to {selectedRequest.endDate}</p>
            <p className="text-sm text-gray-600"><strong>Reason:</strong> {selectedRequest.reason}</p>
            
            <div className="space-y-1.5 pt-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                <DollarSign size={10} /> Paid Status
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaidStatus('PAID')}
                  className={`py-1.5 rounded-lg border text-[9px] font-bold transition-all ${
                    paidStatus === 'PAID'
                      ? 'bg-green-600 text-white border-green-600 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-100 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Check size={12} className="inline mr-1" /> Paid
                </button>
                <button
                  type="button"
                  onClick={() => setPaidStatus('UNPAID')}
                  className={`py-1.5 rounded-lg border text-[9px] font-bold transition-all ${
                    paidStatus === 'UNPAID'
                      ? 'bg-gray-600 text-white border-gray-600 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-600'
                  }`}
                >
                  <X size={12} className="inline mr-1" /> Unpaid
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-100 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleConfirmApprove}>Confirm Approval</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
