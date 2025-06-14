'use client';

import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface GlassChartProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
  actions?: React.ReactNode;
}

export const GlassChart: React.FC<GlassChartProps> = ({
  title,
  subtitle,
  children,
  height = 350,
  actions
}) => {
  return (
    <div className="glass-card group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1 opacity-80">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {actions}
          </div>
        )}
      </div>
      
      <div 
        className="relative rounded-xl overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#A8D5E3]/20 to-[#5f5168]/20 p-[1px]">
          <div className="h-full w-full rounded-xl bg-white/50 backdrop-blur-sm" />
        </div>
        
        {/* Chart content */}
        <div className="relative z-10 h-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GlassChart;
