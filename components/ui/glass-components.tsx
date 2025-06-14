'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
}) => {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/80 backdrop-blur-xl backdrop-saturate-150
        border border-white/20
        rounded-3xl
        shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
        transition-all duration-500 ease-out
        ${hover ? 'hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.25)] hover:bg-white/85 hover:-translate-y-1' : ''}
        ${glow ? 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#A8D5E3]/20 before:to-transparent before:blur-xl' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface GlassMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  iconBgColor?: string;
  isLoading?: boolean;
}

export const GlassMetricCard: React.FC<GlassMetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  iconBgColor = '#4E4456',
  isLoading = false,
}) => {
  const TrendIcon = trend?.value !== undefined 
    ? trend.value > 0 
      ? TrendingUp 
      : trend.value < 0 
        ? TrendingDown 
        : Minus
    : null;

  const trendColor = trend?.positive !== undefined
    ? trend.positive ? 'text-green-600' : 'text-red-600'
    : trend?.value !== undefined
      ? trend.value > 0 ? 'text-green-600' : trend.value < 0 ? 'text-red-600' : 'text-slate-600'
      : 'text-slate-600';

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        {icon && (
          <div
            className="p-3 rounded-2xl bg-gradient-to-br shadow-lg"
            style={{
              backgroundImage: `linear-gradient(135deg, ${iconBgColor}dd, ${iconBgColor}aa)`,
            }}
          >
            <div className="text-white">{icon}</div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-8 bg-slate-200/50 rounded-lg animate-pulse w-24" />
          <div className="h-4 bg-slate-200/50 rounded-lg animate-pulse w-16" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#4E4456]">
              {value}
            </span>
            {unit && (
              <span className="text-lg font-medium text-slate-500">
                {unit}
              </span>
            )}
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1.5 mt-3 ${trendColor}`}>
              {TrendIcon && <TrendIcon size={16} />}
              <span className="text-sm font-medium">
                {trend.value > 0 && '+'}{trend.value}%
              </span>
              <span className="text-sm text-slate-600">{trend.label}</span>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
};

interface GlassChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const GlassChartCard: React.FC<GlassChartCardProps> = ({
  title,
  subtitle,
  children,
  actions,
  className = '',
}) => {
  return (
    <GlassCard className={`p-6 ${className}`} hover={false}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-[#4E4456]">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>
      <div className="relative">{children}</div>
    </GlassCard>
  );
};

interface GlassTableProps {
  headers: string[];
  data: any[][];
  className?: string;
}

export const GlassTable: React.FC<GlassTableProps> = ({
  headers,
  data,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200/50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 text-sm text-slate-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface GlassProgressProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const GlassProgress: React.FC<GlassProgressProps> = ({
  value,
  max = 100,
  label,
  color = '#4E4456',
  showPercentage = true,
  size = 'md',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-slate-600">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-[#4E4456]">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className={`
        w-full bg-slate-200/50 rounded-full overflow-hidden
        backdrop-blur-sm ${sizeClasses[size]}
      `}>
        <div
          className={`
            ${sizeClasses[size]} rounded-full
            bg-gradient-to-r transition-all duration-500 ease-out
            relative overflow-hidden
          `}
          style={{
            width: `${percentage}%`,
            backgroundImage: `linear-gradient(90deg, ${color}dd, ${color}ff)`,
          }}
        >
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  const variants = {
    default: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
    success: 'bg-green-500/10 text-green-700 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    error: 'bg-red-500/10 text-red-700 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        backdrop-blur-sm border
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
};

interface GlassNotificationProps {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const GlassNotification: React.FC<GlassNotificationProps> = ({
  title,
  message,
  type = 'info',
  icon,
  onClose,
}) => {
  const typeStyles = {
    info: 'border-l-blue-500 bg-blue-500/5',
    success: 'border-l-green-500 bg-green-500/5',
    warning: 'border-l-amber-500 bg-amber-500/5',
    error: 'border-l-red-500 bg-red-500/5',
  };

  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/90 backdrop-blur-xl backdrop-saturate-150
        border border-white/20 border-l-4
        rounded-2xl p-4
        shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
        ${typeStyles[type]}
      `}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 mt-0.5">{icon}</div>
        )}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
          <p className="text-sm text-slate-600 mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
