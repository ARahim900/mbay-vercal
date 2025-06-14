'use client';

import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Sun, Moon, Download, Settings, Wifi, WifiOff } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

export interface GlassHeaderProps {
  title?: string;
  subtitle?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  connectionStatus?: 'online' | 'offline';
  onSearch?: (query: string) => void;
  className?: string;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  title = 'Operations Dashboard',
  subtitle = 'Muscat Bay Utilities & Services Overview',
  isDarkMode = false,
  onToggleDarkMode,
  userName = 'Muscat Bay Admin',
  userRole = 'Administrator',
  userAvatar,
  connectionStatus = 'online',
  onSearch,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <GlassCard
      className={`sticky top-0 z-40 print:hidden ${className}`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: 0,
        borderBottom: '1px solid rgba(95, 81, 104, 0.1)',
        boxShadow: '0 4px 24px rgba(95, 81, 104, 0.05)'
      }}
      hover={false}
    >
      <div className="p-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left section - Title and Status */}
        <div className="mb-3 md:mb-0">
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-slate-500">{subtitle}</p>
            <div className="flex items-center space-x-1">
              {connectionStatus === 'online' ? (
                <>
                  <Wifi size={14} className="text-green-500" />
                  <span className="text-xs text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff size={14} className="text-red-500" />
                  <span className="text-xs text-red-600">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-5">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search systems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2.5 w-full sm:w-48 md:w-72 
                bg-white/70 backdrop-blur-xl
                border border-white/20 rounded-lg
                focus:ring-2 focus:ring-primary/20 outline-none text-sm
                transition-all duration-200
                hover:bg-white/80"
              style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            />
          </form>

          {/* Action Buttons */}
          <button 
            className="p-2.5 rounded-lg hover:bg-slate-100/50 backdrop-blur-sm transition-all group hidden sm:block"
            title="Export Data"
          >
            <Download size={22} className="text-slate-600 group-hover:text-slate-800" />
          </button>

          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-lg hover:bg-slate-100/50 backdrop-blur-sm transition-all group hidden md:block"
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun size={22} className="text-slate-600 group-hover:text-slate-800" />
              ) : (
                <Moon size={22} className="text-slate-600 group-hover:text-slate-800" />
              )}
            </button>
          )}

          <button 
            className="p-2.5 rounded-lg hover:bg-slate-100/50 backdrop-blur-sm transition-all group hidden lg:block"
            title="Settings"
          >
            <Settings size={22} className="text-slate-600 group-hover:text-slate-800" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-lg hover:bg-slate-100/50 backdrop-blur-sm relative transition-all group"
              title="Notifications"
            >
              <Bell size={22} className="text-slate-600 group-hover:text-slate-800" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 animate-glass-slide-down">
                <GlassCard className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Notifications</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50/50 backdrop-blur-sm rounded-lg">
                      <p className="text-sm font-medium text-slate-700">System Update</p>
                      <p className="text-xs text-slate-500">New features available</p>
                    </div>
                    <div className="p-3 bg-orange-50/50 backdrop-blur-sm rounded-lg">
                      <p className="text-sm font-medium text-slate-700">Alert</p>
                      <p className="text-xs text-slate-500">High water consumption detected</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <img
              src={userAvatar || `https://placehold.co/40x40/5f5168/FFFFFF?text=${userName.charAt(0)}&font=Inter`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-primary-light/50 transition-all group-hover:border-primary"
            />
            <div className="hidden md:block">
              <span className="text-sm text-slate-700 font-semibold block">{userName}</span>
              <span className="text-xs text-slate-500">{userRole}</span>
            </div>
            <ChevronDown size={18} className="text-slate-500 group-hover:text-slate-800 transition-colors hidden md:block" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default GlassHeader;
