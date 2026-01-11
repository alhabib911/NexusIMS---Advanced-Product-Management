
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Button } from './ui/Button';
import { Mail, Briefcase, Calendar, MapPin, Phone, GraduationCap, Award, User as UserIcon, Save, Edit, Plus, Trash2, DollarSign } from 'lucide-react';

interface UserProfilePageProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ currentUser, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(currentUser);

  useEffect(() => {
    setFormData(currentUser); // Reset form data if currentUser changes
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: 'educationalQualification' | 'extraCurricularActivity', value: string, index: number) => {
    setFormData(prev => {
      const currentArray = (prev[name] || []) as string[];
      const newArray = [...currentArray];
      newArray[index] = value;
      return { ...prev, [name]: newArray };
    });
  };

  const addArrayItem = (name: 'educationalQualification' | 'extraCurricularActivity') => {
    setFormData(prev => ({
      ...prev,
      [name]: [...((prev[name] || []) as string[]), ''],
    }));
  };

  const removeArrayItem = (name: 'educationalQualification' | 'extraCurricularActivity', index: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: ((prev[name] || []) as string[]).filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onUpdateUser(formData as User);
    setIsEditing(false);
  };

  const renderEditableField = (label: string, name: keyof User, icon: React.ReactNode, type: string = 'text', readOnly?: boolean) => (
    <div>
      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
        {icon} {label}
      </label>
      {isEditing && !readOnly ? (
        <input
          type={type}
          name={name}
          value={(formData[name] as string) || ''}
          onChange={handleChange}
          className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-100"
        />
      ) : (
        <p className="text-sm font-medium text-gray-800">{formData[name] as string || 'N/A'}</p>
      )}
    </div>
  );

  const renderArrayField = (label: string, name: 'educationalQualification' | 'extraCurricularActivity', icon: React.ReactNode) => (
    <div>
      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
        {icon} {label}
        {isEditing && <Button variant="secondary" size="sm" onClick={() => addArrayItem(name)}><Plus size={12} /></Button>}
      </label>
      <div className="space-y-1">
        {(formData[name] as string[] || []).length > 0 ? (
          (formData[name] as string[]).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(name, e.target.value, index)}
                    className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-100"
                  />
                  <Button variant="danger" size="sm" onClick={() => removeArrayItem(name, index)}>
                    <Trash2 size={12} />
                  </Button>
                </>
              ) : (
                <p className="text-sm font-medium text-gray-800">{item}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">{isEditing ? 'Add items above' : 'N/A'}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-sm text-gray-500">Manage your personal and professional information.</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setIsEditing(false); setFormData(currentUser); }}>Cancel</Button>
            <Button onClick={handleSave} className="shadow-lg shadow-blue-50">
              <Save size={18} className="mr-2" /> Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="shadow-lg shadow-blue-50">
            <Edit size={18} className="mr-2" /> Edit Profile
          </Button>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="text-2xl font-black text-gray-900 p-1 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-blue-100"
                />
              ) : (
                <h3 className="text-2xl font-black text-gray-900">{currentUser.name}</h3>
              )}
              <p className="text-sm text-gray-500">{currentUser.role.replace('_', ' ')} (Level {currentUser.level})</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                <Mail size={14} /> Email
              </label>
              <p className="text-sm font-medium text-gray-800">{currentUser.email}</p>
            </div>
            <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                <Calendar size={14} /> Join Date
              </label>
              <p className="text-sm font-medium text-gray-800">{currentUser.joinDate || 'N/A'}</p>
            </div>
             <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                <DollarSign size={14} /> Basic Salary
              </label>
              <p className="text-sm font-medium text-gray-800">${currentUser.salaryDetails?.basic?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Editable Details */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
             <UserIcon size={18} className="text-blue-600" /> Personal Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderEditableField('Date of Birth', 'dateOfBirth', <Calendar size={14} />, 'date')}
            {renderEditableField('Contact Number', 'contactNumber', <Phone size={14} />)}
            {renderEditableField('Department', 'department', <Briefcase size={14} />)}
            {renderEditableField('Position', 'position', <Briefcase size={14} />)}
          </div>
          {renderEditableField('Present Address', 'presentAddress', <MapPin size={14} />)}
          {renderEditableField('Permanent Address', 'permanentAddress', <MapPin size={14} />)}
          {renderArrayField('Educational Qualification', 'educationalQualification', <GraduationCap size={14} />)}
          {renderArrayField('Extra-curricular Activities', 'extraCurricularActivity', <Award size={14} />)}
        </div>
      </div>
    </div>
  );
};
