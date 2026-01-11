
import React from 'react';
import { UserRole } from '../types';
import { NAVIGATION_ITEMS, COLORS } from '../constants';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activePath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  role, 
  activePath, 
  onNavigate, 
  collapsed, 
  onToggleCollapse,
  onLogout 
}) => {
  const items = NAVIGATION_ITEMS[role];

  return (
    <aside 
      className={`h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative z-40 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-black text-xl">N</span>
        </div>
        {!collapsed && <span className="font-bold text-xl tracking-tight text-gray-800">NexusIMS</span>}
      </div>

      <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-blue-50 text-blue-600 font-medium' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}>
                {item.icon}
              </div>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50 space-y-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut size={20} className="group-hover:text-red-600 text-gray-400" />
          {!collapsed && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>

      <button 
        onClick={onToggleCollapse}
        className="absolute -right-3 top-10 h-6 w-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 shadow-sm transition-all z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};
