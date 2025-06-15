import React from 'react';
import { GlassCard } from '../glassmorphism/GlassCard';

// Performance Metrics Component for Electricity System

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

interface ProgressBarProps {
  label: string;
  value: number;
  target: number;
  color?: string;
  showPercentage?: boolean;
}

interface PerformanceIndicatorProps {
  indicators: Array<{
    name: string;
    current: number;
    target: number;
    unit: string;
    trend: 'up' | 'down' | 'neutral';
    color?: string;
  }>;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon, 
  subtitle,
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  return (
    <GlassCard className={`p-6 ${colorClasses[color]} border`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {icon && <div className="text-xl">{icon}</div>}
            <h3 className="text-sm font-medium text-white/70">{title}</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-white/50">{subtitle}</p>
          )}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${trendColors[trend]}`}>
            <span className="text-lg">{trendIcons[trend]}</span>
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  label, 
  value, 
  target, 
  color = '#0EA5E9',
  showPercentage = true 
}) => {
  const percentage = Math.min((value / target) * 100, 100);
  const isOverTarget = value > target;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/80">{label}</span>
        <div className="text-right">
          <span className="text-sm font-medium text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          <span className="text-xs text-white/60 ml-1">
            / {typeof target === 'number' ? target.toLocaleString() : target}
          </span>
          {showPercentage && (
            <span className={`text-xs ml-2 ${isOverTarget ? 'text-red-400' : 'text-green-400'}`}>
              ({percentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            isOverTarget ? 'bg-red-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: !isOverTarget ? color : undefined
          }}
        />
      </div>
    </div>
  );
};

export const PerformanceIndicators: React.FC<PerformanceIndicatorProps> = ({ indicators }) => {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Performance Indicators</h3>
      <div className="space-y-6">
        {indicators.map((indicator, index) => (
          <ProgressBar
            key={index}
            label={indicator.name}
            value={indicator.current}
            target={indicator.target}
            color={indicator.color}
            showPercentage={true}
          />
        ))}
      </div>
    </GlassCard>
  );
};

// Key Performance Metrics Grid
export const PerformanceMetricsGrid: React.FC = () => {
  const metrics = [
    {
      title: "Energy Efficiency Score",
      value: "83/100",
      change: "+5.2%",
      trend: 'up' as const,
      icon: "⚡",
      subtitle: "Above industry avg",
      color: 'green' as const
    },
    {
      title: "Load Factor",
      value: "76.4%",
      change: "+2.1%",
      trend: 'up' as const,
      icon: "📊",
      subtitle: "Optimal range",
      color: 'blue' as const
    },
    {
      title: "Peak Demand",
      value: "1,847 kW",
      change: "-8.3%",
      trend: 'down' as const,
      icon: "📈",
      subtitle: "vs last month",
      color: 'orange' as const
    },
    {
      title: "Power Factor",
      value: "0.92",
      change: "+0.05",
      trend: 'up' as const,
      icon: "⚙️",
      subtitle: "Excellent",
      color: 'green' as const
    },
    {
      title: "Outage Duration",
      value: "0.8 hrs",
      change: "-45%",
      trend: 'down' as const,
      icon: "🔌",
      subtitle: "Significant improvement",
      color: 'green' as const
    },
    {
      title: "System Reliability",
      value: "99.7%",
      change: "+0.3%",
      trend: 'up' as const,
      icon: "🛡️",
      subtitle: "Industry leading",
      color: 'green' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

// Efficiency Score Component
export const EfficiencyScoreCard: React.FC = () => {
  const score = 83;
  const scoreColor = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
  const scoreText = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement';

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Overall Efficiency Score</h3>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={scoreColor}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${(score / 100) * 314} 314`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{score}</div>
              <div className="text-xs text-white/60">/ 100</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-white mb-2">{scoreText}</p>
        <p className="text-sm text-white/60">
          Based on energy efficiency, load factors, and system performance
        </p>
      </div>
    </GlassCard>
  );
};

// Load Factor Analysis Component
export const LoadFactorAnalysis: React.FC = () => {
  const loadFactors = [
    { location: 'Beachwell', factor: 78.5, status: 'optimal' },
    { location: 'Central Park', factor: 72.3, status: 'good' },
    { location: 'CIF Kitchen', factor: 85.1, status: 'excellent' },
    { location: 'Marina Plaza', factor: 68.9, status: 'moderate' },
    { location: 'Residential Block A', factor: 65.2, status: 'moderate' },
    { location: 'Swimming Pool', factor: 89.3, status: 'excellent' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400 bg-green-500/10';
      case 'optimal': return 'text-blue-400 bg-blue-500/10';
      case 'good': return 'text-yellow-400 bg-yellow-500/10';
      case 'moderate': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Load Factor Analysis</h3>
      <div className="space-y-4">
        {loadFactors.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div className="flex-1">
              <h4 className="text-white font-medium">{item.location}</h4>
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.factor}%` }}
                  />
                </div>
                <span className="text-sm text-white font-medium min-w-[60px]">
                  {item.factor}%
                </span>
              </div>
            </div>
            <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default {
  MetricCard,
  ProgressBar,
  PerformanceIndicators,
  PerformanceMetricsGrid,
  EfficiencyScoreCard,
  LoadFactorAnalysis
};