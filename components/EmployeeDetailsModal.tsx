
import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { User, UserRole, SalaryDetails } from '../types';
import { Mail, Briefcase, Calendar, MapPin, Phone, GraduationCap, Award, DollarSign, Home, Heart, Wifi, Plus, Trash2, Edit } from 'lucide-react';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: User;
  onUpdateEmployee: (updatedEmployee: User) => void;
  currentUserRole: UserRole;
}

export const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  isOpen,
  onClose,
  employee,
  onUpdateEmployee,
  currentUserRole,
}) => {
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [editedSalaryDetails, setEditedSalaryDetails] = useState<SalaryDetails>(employee.salaryDetails || {
    basic: 0,
    houseRent: 0,
    medical: 0,
    internetBill: 0,
    others: [],
  });
  const canEditSalary = currentUserRole === UserRole.SUPER_ADMIN || currentUserRole === UserRole.MANAGER;

  useEffect(() => {
    if (employee.salaryDetails) {
      setEditedSalaryDetails(employee.salaryDetails);
    } else {
      setEditedSalaryDetails({
        basic: 0,
        houseRent: 0,
        medical: 0,
        internetBill: 0,
        others: [],
      });
    }
    setIsEditingSalary(false); // Reset edit state on employee change
  }, [employee]);

  const handleSalaryChange = (field: keyof SalaryDetails | 'others-name' | 'others-amount', value: string | number, index?: number) => {
    if (field === 'others-name' && index !== undefined) {
      setEditedSalaryDetails(prev => {
        const newOthers = [...prev.others];
        newOthers[index] = { ...newOthers[index], name: value as string };
        return { ...prev, others: newOthers };
      });
    } else if (field === 'others-amount' && index !== undefined) {
      setEditedSalaryDetails(prev => {
        const newOthers = [...prev.others];
        newOthers[index] = { ...newOthers[index], amount: Number(value) };
        return { ...prev, others: newOthers };
      });
    } else if (typeof field === 'string' && field in editedSalaryDetails) {
      setEditedSalaryDetails(prev => ({ ...prev, [field]: Number(value) }));
    }
  };

  const addOtherAllowance = () => {
    setEditedSalaryDetails(prev => ({
      ...prev,
      others: [...prev.others, { name: '', amount: 0 }],
    }));
  };

  const removeOtherAllowance = (index: number) => {
    setEditedSalaryDetails(prev => ({
      ...prev,
      others: prev.others.filter((_, i) => i !== index),
    }));
  };

  const saveSalaryDetails = () => {
    onUpdateEmployee({ ...employee, salaryDetails: editedSalaryDetails });
    setIsEditingSalary(false);
  };

  const renderDetailItem = (icon: React.ReactNode, label: string, value: string | string[] | number | undefined) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-500 flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
          {Array.isArray(value) ? (
            <div className="space-y-0.5">
              {value.map((item, i) => <p key={i} className="text-sm font-medium text-gray-800">{item}</p>)}
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-800">{value}</p>
          )}
        </div>
      </div>
    );
  };

  const totalSalary = (sd: SalaryDetails) => {
    const othersSum = sd.others.reduce((sum, item) => sum + item.amount, 0);
    return sd.basic + sd.houseRent + sd.medical + sd.internetBill + othersSum;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Employee Details: ${employee.name}`} maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
        {/* Employee General Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {employee.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.role.replace('_', ' ')} (Level {employee.level})</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderDetailItem(<Mail size={16} />, 'Email', employee.email)}
            {renderDetailItem(<Briefcase size={16} />, 'Department', employee.department)}
            {renderDetailItem(<Briefcase size={16} />, 'Position', employee.position)}
            {renderDetailItem(<Calendar size={16} />, 'Join Date', employee.joinDate)}
            {renderDetailItem(<Calendar size={16} />, 'Date of Birth', employee.dateOfBirth)}
            {renderDetailItem(<Phone size={16} />, 'Contact', employee.contactNumber)}
            {renderDetailItem(<MapPin size={16} />, 'Present Address', employee.presentAddress)}
            {renderDetailItem(<MapPin size={16} />, 'Permanent Address', employee.permanentAddress)}
          </div>
          {renderDetailItem(<GraduationCap size={16} />, 'Educational Qualification', employee.educationalQualification)}
          {renderDetailItem(<Award size={16} />, 'Extra-curricular Activities', employee.extraCurricularActivity)}
        </div>

        {/* Salary Details Section */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" /> Salary Details
            </h4>
            {canEditSalary && !isEditingSalary && (
              <Button variant="secondary" size="sm" onClick={() => setIsEditingSalary(true)}>
                <Edit size={14} className="mr-2" /> Edit Salary
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Basic Salary', key: 'basic', icon: <DollarSign size={14} /> },
                { label: 'House Rent', key: 'houseRent', icon: <Home size={14} /> },
                { label: 'Medical Allowance', key: 'medical', icon: <Heart size={14} /> },
                { label: 'Internet Bill', key: 'internetBill', icon: <Wifi size={14} /> },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  {isEditingSalary ? (
                    <input
                      type="number"
                      value={editedSalaryDetails[item.key] || ''}
                      onChange={(e) => handleSalaryChange(item.key as keyof SalaryDetails, e.target.value)}
                      className="w-20 text-right text-sm font-bold text-gray-900 border-b border-gray-200 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <span className="font-bold text-gray-900">${employee.salaryDetails?.[item.key]?.toFixed(2) || '0.00'}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Other Allowances */}
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-4 flex items-center gap-2">
              Other Allowances {isEditingSalary && <Button variant="secondary" size="sm" onClick={addOtherAllowance}><Plus size={12} /></Button>}
            </h5>
            <div className="space-y-2">
              {editedSalaryDetails.others.length > 0 ? editedSalaryDetails.others.map((other, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-100">
                  {isEditingSalary ? (
                    <>
                      <input
                        type="text"
                        value={other.name}
                        onChange={(e) => handleSalaryChange('others-name', e.target.value, index)}
                        placeholder="Allowance Name"
                        className="flex-1 text-sm text-gray-800 border-b border-gray-200 focus:border-blue-500 outline-none"
                      />
                      <input
                        type="number"
                        value={other.amount || ''}
                        onChange={(e) => handleSalaryChange('others-amount', e.target.value, index)}
                        className="w-20 text-right text-sm font-bold text-gray-900 border-b border-gray-200 focus:border-blue-500 outline-none"
                      />
                      <Button variant="danger" size="sm" onClick={() => removeOtherAllowance(index)}>
                        <Trash2 size={12} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-600">{other.name}</span>
                      <span className="font-bold text-gray-900">${other.amount.toFixed(2)}</span>
                    </>
                  )}
                </div>
              )) : !isEditingSalary && (
                <p className="text-xs text-gray-400 text-center py-4">No other allowances.</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-lg font-black text-gray-900">Total Monthly Salary:</span>
              <span className="text-2xl font-black text-blue-600">
                ${totalSalary(isEditingSalary ? editedSalaryDetails : employee.salaryDetails || { basic:0,houseRent:0,medical:0,internetBill:0,others:[]}).toFixed(2)}
              </span>
            </div>

            {isEditingSalary && (
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditingSalary(false)}>Cancel</Button>
                <Button onClick={saveSalaryDetails}>Save Salary</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-gray-100">
        <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};