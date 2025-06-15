import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Enhanced Chart Components for Electricity System

interface ChartProps {
  data: any[];
  className?: string;
}

// Custom colors for Muscat Bay theme
const COLORS = {
  primary: '#0EA5E9',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6'
};

const PIE_COLORS = ['#0EA5E9', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#6366F1'];

// Monthly Consumption Trend Chart
export const MonthlyConsumptionChart: React.FC<ChartProps> = ({ data, className = '' }) => (
  <div className={`w-full h-80 ${className}`}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="month" 
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
          tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: any) => [`${value.toLocaleString()} kWh`, 'Consumption']}
        />
        <Area 
          type="monotone" 
          dataKey="consumption" 
          stroke={COLORS.primary}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#consumptionGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// Category Breakdown Pie Chart
export const CategoryBreakdownChart: React.FC<ChartProps> = ({ data, className = '' }) => (
  <div className={`w-full h-80 ${className}`}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: any) => [`${value.toLocaleString()} kWh`, 'Consumption']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

// Performance Efficiency Chart
export const PerformanceEfficiencyChart: React.FC<ChartProps> = ({ data, className = '' }) => (
  <div className={`w-full h-80 ${className}`}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="month" 
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: any) => [`${value}%`, 'Efficiency']}
        />
        <Line 
          type="monotone" 
          dataKey="efficiency" 
          stroke={COLORS.success}
          strokeWidth={3}
          dot={{ fill: COLORS.success, strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: COLORS.success, strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="target" 
          stroke={COLORS.warning}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Cost Analysis Chart
export const CostAnalysisChart: React.FC<ChartProps> = ({ data, className = '' }) => (
  <div className={`w-full h-80 ${className}`}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <defs>
          <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="month" 
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
          tickFormatter={(value) => `${value.toLocaleString()} OMR`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: any) => [`${value.toLocaleString()} OMR`, 'Cost']}
        />
        <Bar 
          dataKey="cost" 
          fill="url(#costGradient)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Forecast Chart
export const ForecastChart: React.FC<ChartProps> = ({ data, className = '' }) => (
  <div className={`w-full h-80 ${className}`}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="month" 
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
          tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: any, name: string) => [
            `${value.toLocaleString()} kWh`, 
            name === 'actual' ? 'Actual' : name === 'forecast' ? 'Forecast' : 'Confidence Interval'
          ]}
        />
        <Line 
          type="monotone" 
          dataKey="actual" 
          stroke={COLORS.primary}
          strokeWidth={3}
          dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="forecast" 
          stroke={COLORS.secondary}
          strokeWidth={3}
          strokeDasharray="8 4"
          dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 4 }}
        />
        <Area 
          type="monotone" 
          dataKey="upperBound" 
          stroke="transparent"
          fill={COLORS.secondary}
          fillOpacity={0.1}
        />
        <Area 
          type="monotone" 
          dataKey="lowerBound" 
          stroke="transparent"
          fill={COLORS.secondary}
          fillOpacity={0.1}
        />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Load Factor Chart
export const LoadFactorChart: React.FC<ChartProps> = ({ data, className = '' }) => (
  <div className={`w-full h-80 ${className}`}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          type="number"
          domain={[0, 100]}
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis 
          type="category"
          dataKey="location"
          stroke="rgba(255,255,255,0.7)"
          fontSize={12}
          width={120}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: any) => [`${value}%`, 'Load Factor']}
        />
        <Bar 
          dataKey="loadFactor" 
          fill={COLORS.info}
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default {
  MonthlyConsumptionChart,
  CategoryBreakdownChart,
  PerformanceEfficiencyChart,
  CostAnalysisChart,
  ForecastChart,
  LoadFactorChart
};