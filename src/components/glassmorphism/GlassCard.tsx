'use client';

import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
  blur?: number;
  opacity?: number;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  style,
  hover = true,
  blur = 16,
  opacity = 0.9,
  onClick
}) => {
  const baseStyles: React.CSSProperties = {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    border: '1px solid rgba(255, 255, 255, 0.125)',
    borderRadius: '1rem',
    boxShadow: '0 4px 24px rgba(95, 81, 104, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...style
  };

  const hoverStyles = hover ? 'hover:shadow-xl hover:scale-[1.02] hover:bg-white/95' : '';

  return (
    <div
      className={`glass-card ${className} ${hoverStyles} ${onClick ? 'cursor-pointer' : ''}`}
      style={baseStyles}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
