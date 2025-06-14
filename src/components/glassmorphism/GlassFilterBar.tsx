'use client';

import React from 'react';
import { GlassCard } from '../glassmorphism/GlassCard';

interface GlassFilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassFilterBar: React.FC<GlassFilterBarProps> = ({ children, className = '' }) => {
  return (
    <div className="sticky top-20 z-30 mb-6">
      <GlassCard className={`p-4 shadow-lg ${className}`}>
        {children}
      </GlassCard>
    </div>
  );
};

export default GlassFilterBar;
