
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { User, LeaveRequest } from '../types';
import { Calendar, ClipboardList, Send, User as UserIcon, MessageSquare } from 'lucide-react';

interface LeaveRequestFormProps {
  currentUser: User;
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  onNavigate: (path: string) => void;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ currentUser, setLeaveRequests, onNavigate }) => {
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Annual' | 'Unpaid'>('Casual');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      alert('Please fill in all fields.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date.');
      return;
    }

    setLoading(true);
    const newLeaveRequest: LeaveRequest = {
      id: `LR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: leaveType,
      reason: reason,
      startDate: startDate,
      endDate: endDate,
      status: 'PENDING',
      requestDate: new Date().toISOString().split('T')[0],
    };

    setLeaveRequests(prev => [...prev, newLeaveRequest]);
    
    setTimeout(() => {
      setLoading(false);
      alert('Leave request submitted successfully and is awaiting approval!');
      setReason('');
      setStartDate('');
      setEndDate('');
      setLeaveType('Casual');
      onNavigate('leave-history'); // Navigate to my leave history after submission
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Apply for Leave</h2>
          <p className="text-sm text-gray-500">Submit your leave requests for approval.</p>
        </div>
        <Button variant="outline" className="shadow-sm" onClick={() => onNavigate('leave-history')}>
          <ClipboardList size={18} className="mr-2" />
          My Leave History
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Employee Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none cursor-not-allowed"
                  value={currentUser.name}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Leave Type</label>
              <div className="relative">
                <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50 appearance-none cursor-pointer"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as 'Casual' | 'Sick' | 'Annual' | 'Unpaid')}
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Annual">Annual Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Reason for Leave</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-4 text-gray-400" size={16} />
              <textarea
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50 min-h-[120px]"
                placeholder="Briefly explain your reason for leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-4 rounded-xl shadow-lg shadow-blue-100" loading={loading}>
            <Send size={18} className="mr-2" /> Submit Leave Request
          </Button>
        </form>
      </div>
    </div>
  );
};
