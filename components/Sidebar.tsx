
import React, { useState } from 'react';
import { UserRole } from '../types';
import { NAVIGATION_ITEMS, COLORS } from '../constants';
import { LogOut, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

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
  const [expandedParents, setExpandedParents] = useState<string[]>([]);

  const toggleParent = (path: string) => {
    setExpandedParents(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  return (
    <aside 
      className={`h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative z-40 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-50">
          <span className="text-white font-black text-xl italic">N</span>
        </div>
        {!collapsed && <span className="font-bold text-xl tracking-tight text-gray-800">NexusIMS</span>}
      </div>

      <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto">
        {items.map((item: any) => {
          const isActive = activePath === item.path || (item.children && item.children.some((child: any) => child.path === activePath));
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedParents.includes(item.path) || (hasChildren && item.children.some((child: any) => child.path === activePath)); // Keep parent expanded if a child is active

          return (
            <div key={item.path} className="space-y-1">
              <button
                onClick={() => {
                  if (hasChildren && !collapsed) {
                    toggleParent(item.path);
                  } else {
                    onNavigate(item.path);
                  }
                }}
                className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <>
                    <span className="text-sm flex-1 text-left">{item.label}</span>
                    {hasChildren && (
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    )}
                  </>
                )}
              </button>
              
              {!collapsed && hasChildren && isExpanded && (
                <div className="ml-6 space-y-1 border-l border-gray-100 pl-4 animate-in slide-in-from-top-1 duration-200">
                  {item.children.map((child: any) => {
                    const isChildActive = activePath === child.path;
                    return (
                      <button
                        key={child.path}
                        onClick={() => onNavigate(child.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all ${
                          isChildActive 
                          ? 'text-blue-600 font-bold bg-blue-50/50' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {child.icon}
                        <span>{child.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
