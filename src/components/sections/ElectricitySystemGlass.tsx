'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Label, Area, ComposedChart, ReferenceLine } from 'recharts';
import { 
  Zap, BarChart2, List, TrendingUp, Users2, DollarSign, Filter, 
  CalendarDays, Sparkles, X, Target, Clock, TrendingDown, Brain,
  Battery, Gauge, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown
} from 'lucide-react';
import { GlassCard, GlassButton, GlassSelect, GlassModal, GlassSubNav } from '../glassmorphism';

// Constants
const OMR_PER_KWH = 0.025;

// Mock data based on your actual database structure
const mockElectricityData = [
  { id: 1, name: 'Beachwell', type: 'Infrastructure', meter_account_no: 'R51903', apr_24: 20245, may_24: 25680, jun_24: 28945, jul_24: 32110, aug_24: 35620, sep_24: 31890, oct_24: 28450, nov_24: 24383, dec_24: 37236, jan_25: 38168, feb_25: 18422, mar_25: 40, apr_26: 27749 },
  { id: 2, name: 'Central Park', type: 'Amenity', meter_account_no: 'R54672', apr_24: 8500, may_24: 9200, jun_24: 10800, jul_24: 12400, aug_24: 13900, sep_24: 12100, oct_24: 10600, nov_24: 9604, dec_24: 19032, jan_25: 22819, feb_25: 19974, mar_25: 14190, apr_26: 13846 },
  { id: 3, name: 'CIF Kitchen', type: 'Commercial', meter_account_no: 'MISSING_METER', apr_24: 14200, may_24: 15100, jun_24: 15800, jul_24: 16200, aug_24: 16800, sep_24: 16100, oct_24: 15900, nov_24: 16742, dec_24: 15554, jan_25: 16788, feb_25: 16154, mar_25: 14971, apr_26: 18446 },
  { id: 4, name: 'Pumping Station 01', type: 'Infrastructure', meter_account_no: 'R52330', apr_24: 1200, may_24: 1350, jun_24: 1450, jul_24: 1580, aug_24: 1720, sep_24: 1650, oct_24: 1480, nov_24: 1629, dec_24: 1640, jan_25: 1903, feb_25: 2095, mar_25: 3032, apr_26: 3940 },
  { id: 5, name: 'Security Building', type: 'Ancillary', meter_account_no: 'R53649', apr_24: 4800, may_24: 5100, jun_24: 5400, jul_24: 5600, aug_24: 5900, sep_24: 5700, oct_24: 5300, nov_24: 5702, dec_24: 5131, jan_25: 5559, feb_25: 5417, mar_25: 4504, apr_26: 5978 }
];

const mockMonthlySummary = [
  { month: 'Apr 2024', total_consumption: 89240, total_cost: 2231.0, active_meters: 25, avg_consumption: 3569.6 },
  { month: 'May 2024', total_consumption: 95420, total_cost: 2385.5, active_meters: 25, avg_consumption: 3816.8 },
  { month: 'Jun 2024', total_consumption: 108650, total_cost: 2716.25, active_meters: 25, avg_consumption: 4346.0 },
  { month: 'Jul 2024', total_consumption: 118890, total_cost: 2972.25, active_meters: 25, avg_consumption: 4755.6 },
  { month: 'Aug 2024', total_consumption: 130240, total_cost: 3256.0, active_meters: 25, avg_consumption: 5209.6 },
  { month: 'Sep 2024', total_consumption: 119380, total_cost: 2984.5, active_meters: 25, avg_consumption: 4775.2 },
  { month: 'Oct 2024', total_consumption: 106850, total_cost: 2671.25, active_meters: 25, avg_consumption: 4274.0 },
  { month: 'Nov 2024', total_consumption: 98670, total_cost: 2466.75, active_meters: 25, avg_consumption: 3946.8 },
  { month: 'Dec 2024', total_consumption: 115420, total_cost: 2885.5, active_meters: 25, avg_consumption: 4616.8 },
  { month: 'Jan 2025', total_consumption: 125890, total_cost: 3147.25, active_meters: 25, avg_consumption: 5035.6 },
  { month: 'Feb 2025', total_consumption: 108760, total_cost: 2719.0, active_meters: 25, avg_consumption: 4350.4 },
  { month: 'Mar 2025', total_consumption: 95230, total_cost: 2380.75, active_meters: 25, avg_consumption: 3809.2 }
];

const ElectricitySystemGlass = () => {
  const [activeSubSection, setActiveSubSection] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Extract categories
  const categories = useMemo(() => {
    return [...new Set(mockElectricityData.map(item => item.type))].sort();
  }, []);

  const monthOptions = [
    { value: 'All Months', label: 'All Months' },
    ...mockMonthlySummary.map(item => ({ value: item.month, label: item.month }))
  ];

  const categoryOptions = [
    { value: 'All Categories', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  // KPI Calculations
  const kpiData = useMemo(() => {
    if (selectedMonth === 'All Months') {
      const totalConsumption = mockMonthlySummary.reduce((acc, curr) => acc + curr.total_consumption, 0);
      const totalCost = totalConsumption * OMR_PER_KWH;
      return {
        totalConsumption,
        totalCost,
        avgConsumption: Math.round(totalConsumption / mockMonthlySummary.length),
        activeMeters: 25
      };
    } else {
      const monthData = mockMonthlySummary.find(item => item.month === selectedMonth);
      return {
        totalConsumption: monthData?.total_consumption || 0,
        totalCost: (monthData?.total_consumption || 0) * OMR_PER_KWH,
        avgConsumption: monthData?.avg_consumption || 0,
        activeMeters: monthData?.active_meters || 0
      };
    }
  }, [selectedMonth]);

  // Chart data
  const trendData = useMemo(() => {
    return mockMonthlySummary.map(item => ({
      month: item.month.split(' ')[0],
      consumption: item.total_consumption,
      cost: item.total_cost
    }));
  }, []);

  const categoryData = useMemo(() => {
    const categoryTotals = {};
    mockElectricityData.forEach(item => {
      const total = item.apr_24 + item.may_24 + item.jun_24 + item.jul_24 + 
                   item.aug_24 + item.sep_24 + item.oct_24 + item.nov_24 + 
                   item.dec_24 + item.jan_25 + item.feb_25 + item.mar_25 + item.apr_26;
      categoryTotals[item.type] = (categoryTotals[item.type] || 0) + total;
    });
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.round(value),
      percentage: Math.round((value / Object.values(categoryTotals).reduce((a, b) => a + b, 0)) * 100)
    }));
  }, []);

  const topConsumers = useMemo(() => {
    return mockElectricityData.map(item => {
      const total = item.apr_24 + item.may_24 + item.jun_24 + item.jul_24 + 
                   item.aug_24 + item.sep_24 + item.oct_24 + item.nov_24 + 
                   item.dec_24 + item.jan_25 + item.feb_25 + item.mar_25 + item.apr_26;
      return {
        name: item.name,
        consumption: total,
        type: item.type,
        efficiency: Math.round(Math.random() * 40 + 60) // Mock efficiency score
      };
    }).sort((a, b) => b.consumption - a.consumption).slice(0, 5);
  }, []);

  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiAnalysisResult('');
    
    setTimeout(() => {
      setAiAnalysisResult(`🤖 AI Analysis Results for Electricity System (${selectedMonth}):

📊 CONSUMPTION ANALYSIS:
• Total Consumption: ${kpiData.totalConsumption.toLocaleString()} kWh
• Total Cost: ${kpiData.totalCost.toLocaleString()} OMR
• System Efficiency: 83/100 (Good Performance)
• Peak Usage: August 2024 (130,240 kWh - Summer cooling demand)
• Lowest Usage: March 2025 (95,230 kWh - Mild weather conditions)

⚡ TOP CONSUMERS INSIGHTS:
• Beachwell: 311,962 kWh (19.1% of total) - High pumping demand
• Central Park: 267,022 kWh (16.4% of total) - Irrigation & lighting
• CIF Kitchen: 184,293 kWh (11.3% of total) - Consistent commercial usage
• Infrastructure category dominates with 58% of total consumption

📈 EFFICIENCY OPPORTUNITIES:
• Load Factor Analysis: 76.4% system efficiency
• Peak Demand Optimization: 18% reduction potential during 10am-4pm
• Seasonal Variation: 42.8% difference between summer/winter consumption
• Equipment Efficiency: 3 units showing >90% load factor (optimal)

💡 STRATEGIC RECOMMENDATIONS:
• IMMEDIATE (0-3 months): Install smart meters on 5 highest consumers
• SHORT-TERM (3-6 months): Implement demand response program
• MEDIUM-TERM (6-12 months): Solar PV installation (estimated 15% reduction)
• LONG-TERM (1-2 years): Energy storage system for peak shaving

💰 COST OPTIMIZATION POTENTIAL:
• Energy Efficiency Upgrades: 8,240 OMR annual savings potential
• Peak Demand Management: 3,120 OMR annual savings
• Renewable Energy Integration: 12,500 OMR annual savings
• Total Annual Optimization: 23,860 OMR (22% cost reduction)

🎯 PERFORMANCE TARGETS:
• Reduce peak demand by 15% within 6 months
• Achieve 85/100 efficiency score by year-end
• Implement real-time monitoring on all critical infrastructure
• Establish energy baseline for new development phases`);
      setIsAiLoading(false);
    }, 2500);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-white/80 font-semibold text-sm">Total Consumption</h3>
            <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
              <Zap size={22} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {kpiData.totalConsumption.toLocaleString()}
            <span className="text-base font-medium text-white/60 ml-2">kWh</span>
          </p>
          <p className="text-xs text-green-400">
            {selectedMonth === 'All Months' ? 'Total System' : `For ${selectedMonth}`}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-white/80 font-semibold text-sm">Total Cost</h3>
            <div className="p-3 rounded-full bg-green-500/20 text-green-400">
              <DollarSign size={22} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {kpiData.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}
            <span className="text-base font-medium text-white/60 ml-2">OMR</span>
          </p>
          <p className="text-xs text-white/60">@ 0.025 OMR/kWh</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-white/80 font-semibold text-sm">Avg Consumption</h3>
            <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400">
              <BarChart2 size={22} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {Math.round(kpiData.avgConsumption).toLocaleString()}
            <span className="text-base font-medium text-white/60 ml-2">kWh</span>
          </p>
          <p className="text-xs text-white/60">Per period</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-white/80 font-semibold text-sm">Active Meters</h3>
            <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
              <Users2 size={22} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {kpiData.activeMeters}
            <span className="text-base font-medium text-white/60 ml-2">units</span>
          </p>
          <p className="text-xs text-green-400">All operational</p>
        </GlassCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Monthly Consumption Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#fff' }} />
                <YAxis tick={{ fontSize: 12, fill: '#fff' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  name="Consumption (kWh)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Consumption by Category</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Top Consumers Table */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Top Energy Consumers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-3 text-white/80 font-medium">Rank</th>
                <th className="text-left p-3 text-white/80 font-medium">Consumer</th>
                <th className="text-left p-3 text-white/80 font-medium">Type</th>
                <th className="text-right p-3 text-white/80 font-medium">Consumption (kWh)</th>
                <th className="text-center p-3 text-white/80 font-medium">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {topConsumers.map((consumer, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      index < 3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-white">{consumer.name}</td>
                  <td className="p-3 text-white/60">{consumer.type}</td>
                  <td className="p-3 text-right font-semibold text-white">{consumer.consumption.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      consumer.efficiency >= 80 ? 'bg-green-500/20 text-green-400' :
                      consumer.efficiency >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {consumer.efficiency}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Energy Efficiency Score</h3>
            <Battery className="text-green-400" size={24} />
          </div>
          <div className="flex items-end space-x-3">
            <span className="text-3xl font-bold text-white">83</span>
            <span className="text-lg text-white/60">/100</span>
          </div>
          <div className="mt-3 w-full bg-white/10 rounded-full h-2">
            <div className="bg-green-400 h-2 rounded-full" style={{ width: '83%' }}></div>
          </div>
          <p className="text-xs text-green-400 mt-2">Good Performance</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Load Factor</h3>
            <Gauge className="text-blue-400" size={24} />
          </div>
          <div className="flex items-end space-x-3">
            <span className="text-3xl font-bold text-white">76.4</span>
            <span className="text-lg text-white/60">%</span>
          </div>
          <div className="mt-3 w-full bg-white/10 rounded-full h-2">
            <div className="bg-blue-400 h-2 rounded-full" style={{ width: '76.4%' }}></div>
          </div>
          <p className="text-xs text-blue-400 mt-2">Optimal Range</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Peak Demand</h3>
            <TrendingUp className="text-yellow-400" size={24} />
          </div>
          <div className="flex items-end space-x-3">
            <span className="text-3xl font-bold text-white">4,251</span>
            <span className="text-lg text-white/60">kW</span>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUp className="text-red-400 w-4 h-4 mr-1" />
            <span className="text-xs text-red-400">+15% vs last month</span>
          </div>
        </GlassCard>
      </div>

      {/* Performance Chart */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Monthly Performance Metrics</h3>
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#fff' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#fff' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#fff' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="consumption" fill="#3B82F6" name="Consumption (kWh)" />
              <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={3} name="Cost (OMR)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Performance Indicators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">System Health Indicators</h3>
          <div className="space-y-4">
            {[
              { name: 'Power Quality', value: 98.5, target: 95, status: 'excellent' },
              { name: 'Equipment Uptime', value: 99.2, target: 98, status: 'excellent' },
              { name: 'Energy Utilization', value: 76.4, target: 80, status: 'good' },
              { name: 'Peak Optimization', value: 68.3, target: 75, status: 'needs_improvement' },
              { name: 'Cost Efficiency', value: 82.1, target: 85, status: 'good' }
            ].map((indicator, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">{indicator.name}</h4>
                  <p className="text-xs text-white/60">Target: {indicator.target}%</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{indicator.value}%</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    indicator.status === 'excellent' ? 'bg-green-500/20 text-green-400' :
                    indicator.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {indicator.status === 'excellent' ? 'EXCELLENT' :
                     indicator.status === 'good' ? 'GOOD' : 'NEEDS FOCUS'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Efficiency Breakdown</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Optimal Efficiency', value: 83, color: '#10B981' },
                    { name: 'Improvement Potential', value: 17, color: '#F59E0B' }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={450}
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#F59E0B" />
                  <Label 
                    value="83%" 
                    position="center" 
                    className="text-2xl font-bold fill-white"
                  />
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Brain className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-white/60">Predictive Accuracy</p>
              <p className="text-lg font-bold text-white">94.2%</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Target className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-white/60">Optimization Potential</p>
              <p className="text-lg font-bold text-white">23,860 OMR</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <TrendingUp className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-white/60">Growth Rate</p>
              <p className="text-lg font-bold text-white">+16.0%</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <AlertTriangle className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-white/60">High Consumers</p>
              <p className="text-lg font-bold text-white">8 Units</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Forecasting Chart */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">3-Month Consumption Forecast</h3>
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              ...trendData,
              { month: 'Jun', consumption: 118500, cost: 2962.5, forecast: true },
              { month: 'Jul', consumption: 124200, cost: 3105, forecast: true },
              { month: 'Aug', consumption: 129800, cost: 3245, forecast: true }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#fff' }} />
              <YAxis tick={{ fontSize: 12, fill: '#fff' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Historical (kWh)"
              />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke="#F59E0B" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#F59E0B', r: 3 }}
                name="Forecast (kWh)"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Cost Optimization Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white">Energy Efficiency Upgrades</span>
              <span className="text-green-400 font-bold">8,240 OMR/year</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white">Peak Demand Management</span>
              <span className="text-green-400 font-bold">3,120 OMR/year</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white">Renewable Integration</span>
              <span className="text-green-400 font-bold">12,500 OMR/year</span>
            </div>
            <div className="border-t border-white/20 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Potential</span>
                <span className="text-green-400 font-bold text-lg">23,860 OMR/year</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">High Consumer Analysis</h3>
          <div className="space-y-3">
            {topConsumers.slice(0, 4).map((consumer, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{consumer.name}</p>
                  <p className="text-xs text-white/60">{consumer.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{(consumer.consumption * 0.025).toLocaleString()} OMR</p>
                  <p className="text-xs text-white/60">{consumer.consumption.toLocaleString()} kWh</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Energy Optimization Roadmap</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              phase: 'Phase 1: Immediate',
              timeline: '0-3 months',
              items: ['Smart meter installation', 'Real-time monitoring', 'Energy audits'],
              investment: '15,000 OMR',
              savings: '2,400 OMR/year',
              roi: '6.25 years'
            },
            {
              phase: 'Phase 2: Short-term',
              timeline: '3-6 months',
              items: ['Demand response program', 'Equipment optimization', 'Staff training'],
              investment: '25,000 OMR',
              savings: '5,800 OMR/year',
              roi: '4.3 years'
            },
            {
              phase: 'Phase 3: Medium-term',
              timeline: '6-12 months',
              items: ['Solar PV installation', 'Energy storage', 'HVAC upgrades'],
              investment: '180,000 OMR',
              savings: '18,200 OMR/year',
              roi: '9.9 years'
            },
            {
              phase: 'Phase 4: Long-term',
              timeline: '1-2 years',
              items: ['Smart grid integration', 'EV charging stations', 'Building automation'],
              investment: '320,000 OMR',
              savings: '35,600 OMR/year',
              roi: '9.0 years'
            }
          ].map((phase, index) => (
            <GlassCard key={index} className="p-4">
              <div className="mb-4">
                <h4 className="font-semibold text-white mb-1">{phase.phase}</h4>
                <p className="text-xs text-white/60">{phase.timeline}</p>
              </div>
              
              <div className="space-y-2 mb-4">
                {phase.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center text-xs text-white/80">
                    <CheckCircle2 className="w-3 h-3 text-green-400 mr-2" />
                    {item}
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/20 pt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Investment:</span>
                  <span className="text-white">{phase.investment}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Annual Savings:</span>
                  <span className="text-green-400">{phase.savings}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">ROI Period:</span>
                  <span className="text-blue-400">{phase.roi}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      {/* Quick Wins */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Wins & Immediate Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Energy Monitoring</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                Install smart meters on top 5 consumers
              </div>
              <div className="flex items-center text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                Set up real-time dashboards
              </div>
              <div className="flex items-center text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                Implement automated alerts
              </div>
            </div>
            <p className="text-xs text-green-400">Potential: 1,200 OMR/year savings</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Operational Efficiency</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                Optimize equipment schedules
              </div>
              <div className="flex items-center text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                Regular maintenance programs
              </div>
              <div className="flex items-center text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                Staff energy awareness training
              </div>
            </div>
            <p className="text-xs text-green-400">Potential: 2,800 OMR/year savings</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Peak Management</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                Implement load scheduling
              </div>
              <div className="flex items-center text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                Demand response protocols
              </div>
              <div className="flex items-center text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                Critical equipment prioritization
              </div>
            </div>
            <p className="text-xs text-green-400">Potential: 3,120 OMR/year savings</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const subSections = [
    { name: 'Dashboard', id: 'Dashboard', icon: BarChart2 },
    { name: 'Performance', id: 'Performance', icon: TrendingUp },
    { name: 'Analytics', id: 'Analytics', icon: Brain },
    { name: 'Optimization', id: 'Optimization', icon: Target },
  ];

  const renderContent = () => {
    switch(activeSubSection) {
      case 'Dashboard': return renderDashboard();
      case 'Performance': return renderPerformance();
      case 'Analytics': return renderAnalytics();
      case 'Optimization': return renderOptimization();
      default: return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      <GlassSubNav
        sections={subSections}
        activeSection={activeSubSection}
        onSectionChange={setActiveSubSection}
      />
      
      {/* Filter Bar */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <GlassSelect
            label="Filter by Month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={monthOptions}
          />
          <GlassSelect
            label="Filter by Category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
          />
          <GlassButton
            onClick={() => {
              setSelectedMonth('All Months');
              setSelectedCategory('All Categories');
            }}
            className="h-[46px] flex items-center justify-center space-x-2"
          >
            <Filter size={16} />
            <span>Reset Filters</span>
          </GlassButton>
          <GlassButton
            onClick={handleAiAnalysis}
            disabled={isAiLoading}
            className="h-[46px] flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
          >
            <Sparkles size={16} />
            <span>{isAiLoading ? 'Analyzing...' : 'AI Analysis'}</span>
          </GlassButton>
        </div>
      </GlassCard>

      {renderContent()}

      {/* AI Analysis Modal */}
      <GlassModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="🤖 AI Electricity System Analysis"
      >
        {isAiLoading ? (
          <div className="text-center py-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <Zap size={48} className="animate-pulse text-blue-400" />
              <Brain size={48} className="animate-bounce text-purple-400" />
            </div>
            <p className="text-white/80">AI is analyzing electricity system data...</p>
            <p className="text-sm text-white/60 mt-1">Processing consumption patterns, efficiency metrics, and optimization opportunities</p>
          </div>
        ) : (
          <div className="text-sm text-white/80 space-y-3 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
            {aiAnalysisResult.split('\n').map((line, index) => {
              if (line.startsWith('📊') || line.startsWith('⚡') || line.startsWith('📈') || line.startsWith('💡') || line.startsWith('💰') || line.startsWith('🎯')) {
                return <h4 key={index} className="font-bold text-lg mt-4 mb-2 text-blue-400">{line}</h4>;
              }
              if (line.startsWith('•')) {
                return <p key={index} className="ml-4 text-white/80">{line}</p>;
              }
              return <p key={index} className="text-white/80">{line}</p>;
            })}
          </div>
        )}
      </GlassModal>
    </div>
  );
};

export default ElectricitySystemGlass;