'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '../glassmorphism/GlassCard';

interface GlassFilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassFilterBar: React.FC<GlassFilterBarProps> = ({ children, className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Placeholder to maintain layout when filter bar is fixed */}
      <div className="filter-placeholder" style={{ height: '88px' }} />
      
      {/* Fixed filter bar */}
      <div 
        className={`fixed-filter-bar ${isScrolled ? 'scrolled' : ''} ${className}`}
        style={{
          position: 'fixed',
          top: '72px', // Adjust based on your header height
          left: 0,
          right: 0,
          zIndex: 30,
          transition: 'all 0.3s ease',
          paddingLeft: 'inherit',
          paddingRight: 'inherit'
        }}
      >
        <div className="max-w-full mx-auto px-6 md:px-8">
          <GlassCard className="p-4 shadow-lg border-b border-slate-200">
            {children}
          </GlassCard>
        </div>
      </div>
    </>
  );
};

export default GlassFilterBar;
