
import React, { useState, useRef, useEffect } from 'react';
import { User, Product } from '../types';
import { Bell, Search, AlertCircle, ChevronRight, Settings } from 'lucide-react';

interface HeaderProps {
  user: User;
  activePath: string;
  lowStockItems: Product[];
  onNavigate: (path: string) => void;
  notificationsCleared: boolean;
  onClearNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  activePath, 
  lowStockItems, 
  onNavigate, 
  notificationsCleared, 
  onClearNotifications 
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathTitle = activePath.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      onClearNotifications();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center text-sm text-gray-400">
          <span>Nexus</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{pathTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 gap-2 w-64 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search commands..." 
            className="bg-transparent border-none text-xs outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-4 relative">
          <div ref={dropdownRef}>
            <button 
              onClick={handleToggleNotif}
              className="text-gray-400 hover:text-gray-600 relative p-1 transition-colors"
            >
              <Bell size={20} />
              {!notificationsCleared && lowStockItems.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">
                  {lowStockItems.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden transform transition-all animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                  <button onClick={onClearNotifications} className="text-xs text-blue-600 font-semibold hover:underline">Mark all as read</button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {lowStockItems.length > 0 ? (
                    lowStockItems.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => {
                          onNavigate('stock');
                          setIsNotifOpen(false);
                        }}
                        className="w-full p-4 flex gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 group"
                      >
                        <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                          <AlertCircle size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Low Stock Alert: {item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">Only {item.stock} {item.unit} left in inventory.</p>
                          <p className="text-[10px] text-blue-600 font-bold mt-1">RESTOCK NOW</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 self-center" />
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-3">
                        <Bell size={24} />
                      </div>
                      <p className="text-sm text-gray-500">No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gray-50 text-center">
                  <button 
                    onClick={() => { onNavigate('stock'); setIsNotifOpen(false); }}
                    className="text-xs font-bold text-gray-500 hover:text-gray-700 tracking-widest uppercase"
                  >
                    View All Stock
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button className="text-gray-400 hover:text-gray-600">
            <Settings size={20} />
          </button>
          
          <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

          <button 
            onClick={() => onNavigate('profile')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};