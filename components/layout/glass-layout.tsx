'use client';

import React, { useState } from 'react';
import { 
  Menu, X, Search, Bell, Settings, Sun, Moon, 
  Download, Wifi, WifiOff, ChevronDown, Power 
} from 'lucide-react';
import { GlassIconButton } from '../ui/glass-buttons';
import { GlassBadge } from '../ui/glass-components';

interface GlassSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  sections: Array<{
    name: string;
    icon: React.ElementType;
    sectionId: string;
  }>;
  isDarkMode: boolean;
}

export const GlassSidebar: React.FC<GlassSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  activeSection,
  setActiveSection,
  sections,
  isDarkMode,
}) => {
  return (
    <div
      className={`
        relative ${isCollapsed ? 'w-20' : 'w-72'}
        min-h-screen transition-all duration-500 ease-out
        bg-gradient-to-b from-[#4E4456]/95 to-[#3B3241]/95
        backdrop-blur-2xl backdrop-saturate-150
        border-r border-white/10
        shadow-[4px_0_48px_0_rgba(0,0,0,0.25)]
        ${isDarkMode ? 'bg-opacity-95' : ''}
      `}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#A8D5E3]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-40 h-40 bg-[#BFA181]/10 rounded-full blur-3xl" />
      
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className={`
          absolute -right-5 top-8 z-50
          w-10 h-10 rounded-full
          bg-white/90 backdrop-blur-xl
          border border-white/30
          shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]
          flex items-center justify-center
          transition-all duration-300
          hover:shadow-[0_12px_48px_0_rgba(31,38,135,0.35)]
          hover:scale-110
        `}
      >
        <Menu size={16} className="text-[#4E4456]" />
      </button>

      {/* Logo section */}
      <div className="p-6 flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A8D5E3] to-[#4E4456] flex items-center justify-center shadow-lg">
            <Power size={24} className="text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in-up">
            <h1 className="text-xl font-bold text-white">Muscat Bay</h1>
            <p className="text-xs text-white/60">Operations Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-4 mt-8 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.sectionId;
          
          return (
            <button
              key={section.sectionId}
              onClick={() => setActiveSection(section.sectionId)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl
                transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? 'bg-white/20 backdrop-blur-xl shadow-lg' 
                  : 'hover:bg-white/10'
                }
              `}
              title={isCollapsed ? section.name : ''}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#A8D5E3] to-[#BFA181]" />
              )}
              
              <Icon 
                size={22} 
                className={`
                  ${isActive ? 'text-white' : 'text-white/70'} 
                  group-hover:text-white transition-colors
                  ${isCollapsed ? 'mx-auto' : ''}
                `} 
              />
              
              {!isCollapsed && (
                <span className={`
                  font-medium transition-colors
                  ${isActive ? 'text-white' : 'text-white/70'} 
                  group-hover:text-white
                `}>
                  {section.name}
                </span>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <p className="text-xs text-white/60 text-center mb-3">Version 2.0.1</p>
            <button className="w-full py-2 bg-gradient-to-r from-[#A8D5E3]/20 to-[#BFA181]/20 text-white text-sm font-medium rounded-xl hover:from-[#A8D5E3]/30 hover:to-[#BFA181]/30 transition-all">
              Global Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface GlassHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  isDarkMode,
  toggleDarkMode,
  userName = 'Muscat Bay Admin',
  userRole = 'Administrator',
  userAvatar,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div>
              <h1 className="text-2xl font-bold text-[#4E4456]">Operations Dashboard</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-slate-600">Muscat Bay Utilities & Services Overview</p>
                <div className="flex items-center gap-1.5">
                  {connectionStatus === 'online' ? (
                    <>
                      <Wifi size={14} className="text-green-500" />
                      <span className="text-xs font-medium text-green-600">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={14} className="text-red-500" />
                      <span className="text-xs font-medium text-red-600">Offline</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative group">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4E4456]" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search systems..."
                  className="
                    pl-11 pr-4 py-2.5 w-64
                    bg-white/60 backdrop-blur-xl
                    border border-white/30
                    rounded-2xl
                    text-sm text-[#4E4456]
                    placeholder:text-slate-400
                    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.06)]
                    transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-[#A8D5E3]/30
                    focus:border-[#A8D5E3]/50 focus:bg-white/80
                    focus:shadow-[0_8px_32px_0_rgba(168,213,227,0.2)]
                  "
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <GlassIconButton
                  icon={<Download size={20} />}
                  variant="ghost"
                  size="md"
                  className="hidden sm:flex"
                  title="Export Data"
                />
                <GlassIconButton
                  icon={isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  variant="ghost"
                  size="md"
                  onClick={toggleDarkMode}
                  className="hidden md:flex"
                  title="Toggle Theme"
                />
                <GlassIconButton
                  icon={<Settings size={20} />}
                  variant="ghost"
                  size="md"
                  className="hidden lg:flex"
                  title="Settings"
                />
                
                {/* Notifications */}
                <div className="relative">
                  <GlassIconButton
                    icon={<Bell size={20} />}
                    variant="ghost"
                    size="md"
                    title="Notifications"
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    <span className="text-[10px] text-white font-bold">3</span>
                  </div>
                </div>

                {/* User profile */}
                <div className="flex items-center gap-3 ml-2 cursor-pointer group">
                  <div className="relative">
                    <img
                      src={userAvatar || `https://placehold.co/40x40/4E4456/FFFFFF?text=${userName.charAt(0)}&font=Inter`}
                      alt={userName}
                      className="w-10 h-10 rounded-full border-2 border-[#A8D5E3]/30 group-hover:border-[#A8D5E3]/50 transition-all"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-[#4E4456]">{userName}</p>
                    <p className="text-xs text-slate-500">{userRole}</p>
                  </div>
                  <ChevronDown size={16} className="text-slate-400 group-hover:text-[#4E4456] transition-colors hidden md:block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

interface GlassTabNavigationProps {
  tabs: Array<{
    name: string;
    id: string;
    icon: React.ElementType;
  }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const GlassTabNavigation: React.FC<GlassTabNavigationProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-full p-1.5 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-5 py-2.5 rounded-full
                  flex items-center gap-2
                  text-sm font-medium
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#4E4456] to-[#5f5168] text-white shadow-lg' 
                    : 'text-[#4E4456] hover:bg-white/50'
                  }
                `}
              >
                <Icon size={18} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
