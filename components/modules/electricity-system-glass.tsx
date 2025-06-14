'use client';

import React, { useState, useMemo } from 'react';
import { 
  Zap, TrendingUp, Users2, BarChart2, DollarSign, 
  CalendarDays, Building, Filter, Sparkles 
} from 'lucide-react';
import { 
  GlassDropdown, 
  GlassMetricCard, 
  GlassChartCard, 
  GlassButton,
  GlassTabNavigation,
  GlassBadge,
  GlassProgress
} from '../ui/glass-index';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

// Import your existing electricity data and utilities
import { 
  rawDataString, 
  parseData, 
  OMR_PER_KWH,
  COLORS as CHART_COLORS 
} from './electricity-data';

const ElectricitySystemGlass = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  // Parse electricity data
  const electricityData = useMemo(() => parseData(rawDataString), []);
  const availableMonths = Object.keys(electricityData[0]?.consumption || {});
  
  // Create options for glassmorphism dropdowns
  const monthOptions = [
    { value: 'All Months', label: 'All Months' },
    ...availableMonths.map(month => ({
      value: month,
      label: month
    }))
  ];

  const categoryOptions = [
    { value: 'All Categories', label: 'All Categories' },
    { value: 'Pumping Station', label: 'Pumping Station' },
    { value: 'Street Light', label: 'Street Light' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Irrigation Tank', label: 'Irrigation Tank' },
    { value: 'Ancillary Building', label: 'Ancillary Building' }
  ];

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return electricityData.filter(item => {
      const categoryMatch = selectedCategory === 'All Categories' || item.category === selectedCategory;
      const monthMatch = selectedMonth === 'All Months' || item.consumption[selectedMonth] !== undefined;
      return categoryMatch && monthMatch;
    });
  }, [electricityData, selectedCategory, selectedMonth]);

  // Calculate KPIs
  const kpiData = useMemo(() => {
    const totalConsumption = filteredData.reduce((sum, item) => {
      if (selectedMonth === 'All Months') {
        return sum + item.totalConsumption;
      }
      return sum + (item.consumption[selectedMonth] || 0);
    }, 0);

    const totalCost = totalConsumption * OMR_PER_KWH;
    const avgConsumption = filteredData.length > 0 ? totalConsumption / filteredData.length : 0;
    const activeMeters = filteredData.filter(d => d.totalConsumption > 0).length;

    return {
      totalConsumption,
      totalCost,
      avgConsumption,
      activeMeters
    };
  }, [filteredData, selectedMonth]);

  // Monthly trend data
  const monthlyTrendData = useMemo(() => {
    return availableMonths.map(month => {
      const total = filteredData.reduce((sum, item) => sum + (item.consumption[month] || 0), 0);
      return {
        name: month.replace('-24', '').replace('-25', ''),
        consumption: Math.round(total)
      };
    });
  }, [filteredData, availableMonths]);

  // Category distribution data
  const categoryData = useMemo(() => {
    const categories = {};
    filteredData.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      if (selectedMonth === 'All Months') {
        categories[item.category] += item.totalConsumption;
      } else {
        categories[item.category] += item.consumption[selectedMonth] || 0;
      }
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredData, selectedMonth]);

  // Tab configuration
  const tabs = [
    { name: 'Dashboard', id: 'Dashboard', icon: BarChart2 },
    { name: 'Performance', id: 'Performance', icon: TrendingUp },
    { name: 'Analytics', id: 'Analytics', icon: Sparkles }
  ];

  const handleAiAnalysis = async () => {
    setIsAiAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAiAnalyzing(false);
      // Show analysis results
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Sub Navigation */}
      <GlassTabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Filters Section */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassDropdown
            label="Time Period"
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            icon={<CalendarDays size={18} />}
          />
          
          <GlassDropdown
            label="Category Filter"
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            icon={<Building size={18} />}
          />
          
          <div className="flex items-end gap-2">
            <GlassButton
              variant="secondary"
              icon={<Filter size={16} />}
              onClick={() => {
                setSelectedMonth('All Months');
                setSelectedCategory('All Categories');
              }}
              fullWidth
            >
              Reset Filters
            </GlassButton>
          </div>
          
          <div className="flex items-end">
            <GlassButton
              variant="primary"
              icon={<Sparkles size={16} />}
              onClick={handleAiAnalysis}
              loading={isAiAnalyzing}
              fullWidth
            >
              AI Analysis
            </GlassButton>
          </div>
        </div>
      </div>

      {activeTab === 'Dashboard' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassMetricCard
              title="Total Consumption"
              value={kpiData.totalConsumption.toLocaleString()}
              unit="kWh"
              icon={<Zap size={20} />}
              trend={{
                value: 12.5,
                label: 'vs last period',
                positive: true
              }}
              iconBgColor="#4E4456"
            />
            
            <GlassMetricCard
              title="Total Cost"
              value={kpiData.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              unit="OMR"
              icon={<DollarSign size={20} />}
              trend={{
                value: 8.3,
                label: 'vs last period'
              }}
              iconBgColor="#10B981"
            />
            
            <GlassMetricCard
              title="Avg. Consumption"
              value={Math.round(kpiData.avgConsumption).toLocaleString()}
              unit="kWh/unit"
              icon={<BarChart2 size={20} />}
              trend={{
                value: -2.1,
                label: 'efficiency gain',
                positive: true
              }}
              iconBgColor="#F59E0B"
            />
            
            <GlassMetricCard
              title="Active Meters"
              value={kpiData.activeMeters}
              unit="units"
              icon={<Users2 size={20} />}
              iconBgColor="#3B82F6"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassChartCard
                title="Monthly Consumption Trend"
                subtitle={`Showing data for ${selectedCategory}`}
              >
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4E4456" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4E4456" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#4E4456" 
                      fillOpacity={1} 
                      fill="url(#colorConsumption)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassChartCard>
            </div>

            <GlassChartCard
              title="Category Distribution"
              subtitle="Consumption by category"
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </GlassChartCard>
          </div>

          {/* Top Consumers */}
          <GlassChartCard
            title="Top Energy Consumers"
            subtitle="Units with highest consumption"
          >
            <div className="space-y-4">
              {filteredData
                .sort((a, b) => {
                  const aVal = selectedMonth === 'All Months' ? a.totalConsumption : (a.consumption[selectedMonth] || 0);
                  const bVal = selectedMonth === 'All Months' ? b.totalConsumption : (b.consumption[selectedMonth] || 0);
                  return bVal - aVal;
                })
                .slice(0, 5)
                .map((unit, index) => {
                  const consumption = selectedMonth === 'All Months' 
                    ? unit.totalConsumption 
                    : (unit.consumption[selectedMonth] || 0);
                  const maxConsumption = filteredData[0]?.totalConsumption || 1;
                  const percentage = (consumption / maxConsumption) * 100;

                  return (
                    <div key={unit.id} className="flex items-center gap-4">
                      <GlassBadge variant={index === 0 ? 'warning' : 'default'}>
                        #{index + 1}
                      </GlassBadge>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            {unit.unitName}
                          </span>
                          <span className="text-sm font-bold text-[#4E4456]">
                            {consumption.toLocaleString()} kWh
                          </span>
                        </div>
                        <GlassProgress
                          value={percentage}
                          size="sm"
                          color={index === 0 ? '#BFA181' : '#4E4456'}
                          showPercentage={false}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </GlassChartCard>
        </>
      )}

      {activeTab === 'Performance' && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-slate-700 mb-4">
            Performance Analytics Coming Soon
          </h3>
          <p className="text-slate-500">
            Advanced performance metrics and insights will be available here
          </p>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-slate-700 mb-4">
            AI-Powered Analytics Coming Soon
          </h3>
          <p className="text-slate-500">
            Deep learning insights and predictive analytics will be available here
          </p>
        </div>
      )}
    </div>
  );
};

export default ElectricitySystemGlass;
