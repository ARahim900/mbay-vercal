'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '../glassmorphism/GlassCard';

interface GlassFilterBarProps {
  children: React.ReactNode;
  className?: string;
  sidebarWidth?: number; // Width of sidebar in pixels
  isCollapsed?: boolean; // Is sidebar collapsed
}

export const GlassFilterBar: React.FC<GlassFilterBarProps> = ({ 
  children, 
  className = '',
  sidebarWidth = 256, // Default sidebar width (16rem = 256px)
  isCollapsed = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const actualSidebarWidth = isCollapsed ? 64 : sidebarWidth; // 4rem = 64px when collapsed

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Placeholder to maintain layout space */}
      <div style={{ height: '88px' }} />
      
      {/* Fixed filter bar */}
      <div 
        className={`filter-bar-fixed ${isScrolled ? 'scrolled' : ''} ${className}`}
        style={{
          position: 'fixed',
          top: '88px', // Below header (adjust this based on your actual header height)
          left: `${actualSidebarWidth}px`,
          right: 0,
          zIndex: 30,
          backgroundColor: 'transparent',
          transition: 'all 0.3s ease',
          width: `calc(100% - ${actualSidebarWidth}px)`
        }}
      >
        <div className="px-6 md:px-8">
          <GlassCard 
            className="p-4 shadow-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.125)',
              boxShadow: isScrolled ? '0 8px 32px rgba(95, 81, 104, 0.12)' : '0 4px 16px rgba(95, 81, 104, 0.08)'
            }}
          >
            {children}
          </GlassCard>
        </div>
      </div>
    </>
  );
};

// Export a wrapper component that can be used in sections that don't have sidebar info
export const FilterBarWrapper: React.FC<GlassFilterBarProps & { hasSidebar?: boolean }> = ({ 
  hasSidebar = true,
  ...props 
}) => {
  if (!hasSidebar) {
    return (
      <div className="mb-6">
        <GlassCard className="p-4 shadow-lg">
          {props.children}
        </GlassCard>
      </div>
    );
  }
  
  return <GlassFilterBar {...props} />;
};

export default GlassFilterBar;
