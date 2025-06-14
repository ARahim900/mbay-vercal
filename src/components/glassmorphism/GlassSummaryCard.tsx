'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassSummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  unit?: string;
  trend?: string;
  trendColor?: string;
  iconBgColor?: string;
  isLoading?: boolean;
}

export const GlassSummaryCard: React.FC<GlassSummaryCardProps> = ({
  title,
  value,
  icon: Icon,
  unit,
  trend,
  trendColor = 'text-gray-600',
  iconBgColor = '#5f5168',
  isLoading = false
}) => {
  return (
    <div className="glass-card group transform transition-all duration-300 hover:scale-[1.02]">
      <div className="relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A8D5E3]/10 to-[#5f5168]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {title}
            </h3>
            <div 
              className="relative p-3 rounded-xl shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${iconBgColor}20 0%, ${iconBgColor}40 100%)`,
                boxShadow: `0 8px 32px ${iconBgColor}20`
              }}
            >
              <Icon 
                size={24} 
                style={{ color: iconBgColor }}
                className="relative z-10"
              />
              {/* Icon glow effect */}
              <div 
                className="absolute inset-0 rounded-xl blur-xl opacity-50"
                style={{ background: iconBgColor }}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-8 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-lg animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-lg w-2/3 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
                {unit && (
                  <span className="text-lg font-medium text-gray-500 ml-2">
                    {unit}
                  </span>
                )}
              </div>
              
              {trend && (
                <div className="flex items-center space-x-2">
                  <div className={`text-xs font-medium ${trendColor} flex items-center`}>
                    {trend}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlassSummaryCard;
