'use client';

import React, { useState } from 'react';
import { Menu, X, Power } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface GlassSidebarProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const GlassSidebar: React.FC<GlassSidebarProps> = ({
  children,
  isCollapsed,
  onToggle,
  logo,
  footer,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        glass-sidebar
        ${isCollapsed ? 'w-16' : 'w-64'}
        min-h-screen
        transition-all duration-300 ease-in-out
        relative
        ${className}
      `}
      style={{
        backgroundColor: 'rgba(59, 50, 65, 0.95)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          absolute -right-4 top-6
          bg-white/90 backdrop-blur-xl
          rounded-full p-2 shadow-lg
          border border-white/20
          hover:shadow-xl hover:scale-110
          transition-all duration-200
          z-50
        `}
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px rgba(95, 81, 104, 0.15)'
        }}
      >
        {isCollapsed ? (
          <Menu size={16} className="text-primary" />
        ) : (
          <X size={16} className="text-primary" />
        )}
      </button>

      {/* Logo Section */}
      {logo && (
        <div className={`p-5 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? (
            <div className="flex justify-center">
              <Power size={32} className="text-primary-light animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-white">
              <Power size={32} className="text-primary-light animate-pulse flex-shrink-0" />
              {logo}
            </div>
          )}
        </div>
      )}

      {/* Navigation Content */}
      <nav className="p-5 pt-0 space-y-2">
        {children}
      </nav>

      {/* Footer */}
      {footer && !isCollapsed && (
        <div className="mt-auto p-5">
          <GlassCard
            className="p-4 text-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            hover={false}
          >
            {footer}
          </GlassCard>
        </div>
      )}

      {/* Hover indicator */}
      {isHovered && isCollapsed && (
        <div
          className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-primary-light/50 to-transparent"
          style={{
            animation: 'pulse 2s infinite'
          }}
        />
      )}
    </div>
  );
};

export interface GlassSidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

export const GlassSidebarItem: React.FC<GlassSidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  isCollapsed = false,
  onClick,
  badge
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center
        ${isCollapsed ? 'justify-center' : 'space-x-3'}
        p-3 rounded-lg
        transition-all duration-200 ease-in-out
        group relative
        ${isActive ? 'bg-primary/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}
      `}
      title={isCollapsed ? label : ''}
    >
      <span className="flex-shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      
      {!isCollapsed && (
        <>
          <span className="font-medium">{label}</span>
          {badge && (
            <span className="ml-auto bg-primary-light/20 text-white text-xs px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
          {badge && <span className="ml-2 text-xs">({badge})</span>}
        </div>
      )}
    </button>
  );
};

export default GlassSidebar;
