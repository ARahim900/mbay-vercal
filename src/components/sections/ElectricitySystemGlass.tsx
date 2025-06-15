'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, ScatterChart, Scatter, RadialBarChart, RadialBar } from 'recharts';
import { Zap, TrendingUp, BarChart2, Activity, DollarSign, AlertTriangle, CheckCircle, Calculator, Target, TrendingDown, Battery, Gauge, FlashOff, Power, Clock, Calendar, Award, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { GlassCard, GlassSummaryCard, GlassChart, GlassFilterBar, GlassSubNav } from '@/components/glassmorphism';

// ===============================
// DESIGN SYSTEM & CONSTANTS
// ===============================

const OMR_PER_KWH = 0.025;
const COLORS = {
  primary: '#5f5168',
  primaryLight: '#7E708A',
  primaryDark: '#3B3241',
  accent: '#A8D5E3',
  success: '#10B981',
  warning: '#BFA181',
  info: '#0A1828',
  error: '#EF4444',
  chart: ['#5f5168', '#A8D5E3', '#BFA181', '#0A1828', '#7E708A', '#C3FBF4', '#F2F0EA', '#10B981', '#EF4444', '#6A5ACD']
};

// ===============================
// SUPABASE DATA INTEGRATION
// ===============================

// Mock data structure matching your Supabase schema
const mockElectricityData = [
  {
    id: 1,
    name: "Beachwell",
    type: "D_Building",
    meter_account_no: "R51903",
    apr_2024_kwh: 15420,
    may_2024_kwh: 18650,
    jun_2024_kwh: 22130,
    jul_2024_kwh: 25890,
    aug_2024_kwh: 28420,
    sep_2024_kwh: 24680,
    oct_2024_kwh: 21340,
    nov_2024_kwh: 24383,
    dec_2024_kwh: 37236,
    jan_2025_kwh: 38168,
    feb_2025_kwh: 18422,
    mar_2025_kwh: 40,
    apr_2025_kwh: 27749,
    may_2025_kwh: 25856,
    total_kwh: 311962,
    total_cost_omr: 7799.05
  },
  {
    id: 2,
    name: "Central Park",
    type: "D_Building",
    meter_account_no: "R54672",
    apr_2024_kwh: 8520,
    may_2024_kwh: 12450,
    jun_2024_kwh: 18930,
    jul_2024_kwh: 21840,
    aug_2024_kwh: 25670,
    sep_2024_kwh: 22150,
    oct_2024_kwh: 19820,
    nov_2024_kwh: 9604,
    dec_2024_kwh: 19032,
    jan_2025_kwh: 22819,
    feb_2025_kwh: 19974,
    mar_2025_kwh: 14190,
    apr_2025_kwh: 13846,
    may_2025_kwh: 15420,
    total_kwh: 267022,
    total_cost_omr: 6675.55
  },
  {
    id: 3,
    name: "CIF Kitchen",
    type: "Retail",
    meter_account_no: "MISSING_METER",
    apr_2024_kwh: 14850,
    may_2024_kwh: 15230,
    jun_2024_kwh: 16890,
    jul_2024_kwh: 17240,
    aug_2024_kwh: 15680,
    sep_2024_kwh: 14920,
    oct_2024_kwh: 13580,
    nov_2024_kwh: 16742,
    dec_2024_kwh: 15554,
    jan_2025_kwh: 16788,
    feb_2025_kwh: 16154,
    mar_2025_kwh: 14971,
    apr_2025_kwh: 18446,
    may_2025_kwh: 17248,
    total_kwh: 184293,
    total_cost_omr: 4607.325
  },
  {
    id: 4,
    name: "Pumping Station 01",
    type: "PS",
    meter_account_no: "R52330",
    apr_2024_kwh: 1580,
    may_2024_kwh: 1850,
    jun_2024_kwh: 2180,
    jul_2024_kwh: 2420,
    aug_2024_kwh: 2680,
    sep_2024_kwh: 2290,
    oct_2024_kwh: 2150,
    nov_2024_kwh: 1629,
    dec_2024_kwh: 1640,
    jan_2025_kwh: 1903,
    feb_2025_kwh: 2095,
    mar_2025_kwh: 3032,
    apr_2025_kwh: 3940,
    may_2025_kwh: 3587,
    total_kwh: 36786,
    total_cost_omr: 919.65
  },
  {
    id: 5,
    name: "Street Light FP 01 (Z8)",
    type: "Street Light",
    meter_account_no: "R53197",
    apr_2024_kwh: 2890,
    may_2024_kwh: 3120,
    jun_2024_kwh: 3340,
    jul_2024_kwh: 3580,
    aug_2024_kwh: 3720,
    sep_2024_kwh: 3450,
    oct_2024_kwh: 3280,
    nov_2024_kwh: 3593,
    dec_2024_kwh: 3147,
    jan_2025_kwh: 787,
    feb_2025_kwh: 3228,
    mar_2025_kwh: 2663,
    apr_2025_kwh: 3230,
    may_2025_kwh: 3558,
    total_kwh: 41586,
    total_cost_omr: 1039.65
  }
];

const mockMonthlyData = [
  { month_year: "Apr 2024", month_order: 1, total_consumption_kwh: 72781, total_cost_omr: 1819.525, avg_consumption_per_unit: 1399.63 },
  { month_year: "May 2024", month_order: 2, total_consumption_kwh: 116032, total_cost_omr: 2900.800, avg_consumption_per_unit: 2275.14 },
  { month_year: "Jun 2024", month_order: 3, total_consumption_kwh: 116998, total_cost_omr: 2924.950, avg_consumption_per_unit: 2294.08 },
  { month_year: "Jul 2024", month_order: 4, total_consumption_kwh: 149968, total_cost_omr: 3749.200, avg_consumption_per_unit: 2829.58 },
  { month_year: "Aug 2024", month_order: 5, total_consumption_kwh: 166207, total_cost_omr: 4155.175, avg_consumption_per_unit: 3135.98 },
  { month_year: "Sep 2024", month_order: 6, total_consumption_kwh: 141470, total_cost_omr: 3536.750, avg_consumption_per_unit: 2720.62 },
  { month_year: "Oct 2024", month_order: 7, total_consumption_kwh: 129772, total_cost_omr: 3244.300, avg_consumption_per_unit: 2448.53 },
  { month_year: "Nov 2024", month_order: 8, total_consumption_kwh: 124691, total_cost_omr: 3117.275, avg_consumption_per_unit: 2397.90 },
  { month_year: "Dec 2024", month_order: 9, total_consumption_kwh: 124619, total_cost_omr: 3115.475, avg_consumption_per_unit: 2351.30 },
  { month_year: "Jan 2025", month_order: 10, total_consumption_kwh: 120631, total_cost_omr: 3015.775, avg_consumption_per_unit: 2319.83 },
  { month_year: "Feb 2025", month_order: 11, total_consumption_kwh: 107031, total_cost_omr: 2675.775, avg_consumption_per_unit: 2058.29 },
  { month_year: "Mar 2025", month_order: 12, total_consumption_kwh: 78479, total_cost_omr: 1961.975, avg_consumption_per_unit: 1509.21 },
  { month_year: "Apr 2025", month_order: 13, total_consumption_kwh: 133986.52, total_cost_omr: 3349.663, avg_consumption_per_unit: 2576.66 },
  { month_year: "May 2025", month_order: 14, total_consumption_kwh: 155366.88, total_cost_omr: 3884.172, avg_consumption_per_unit: 2774.41 }
];

// ===============================
// UTILITY FUNCTIONS
// ===============================

const extractCategory = (unitName, type) => {
  if (type === 'PS') return 'Pumping Station';
  if (type === 'LS') return 'Lifting Station';
  if (type === 'Street Light') return 'Street Light';
  if (type === 'IRR') return 'Irrigation Tank';
  if (type === 'DB') return 'Actuator DB';
  if (type === 'D_Building') {
    if (unitName.toLowerCase().includes('guard') || unitName.toLowerCase().includes('security') || unitName.toLowerCase().includes('rop')) return 'Ancillary Building';
    if (unitName.toLowerCase().includes('central park')) return 'Central Park';
    if (unitName.toLowerCase().includes('village square')) return 'Village Square';
    if (unitName.toLowerCase().includes('beachwell')) return 'Beachwell';
    return 'D Building';
  }
  if (type === 'Retail') return 'Commercial';
  if (type === 'FP-Landscape Lights Z3') return 'Landscape Light';
  return 'Other';
};

// ===============================
// MAIN COMPONENT
// ===============================

export const ElectricitySystemModule = () => {
  const [activeSubSection, setActiveSubSection] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState('All Months'); 
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Data processing for the entire dataset
  const processedData = useMemo(() => {
    return mockElectricityData.map(item => ({
      ...item,
      category: extractCategory(item.name, item.type),
      // Calculate seasonal metrics
      summer_avg: Math.round((item.may_2024_kwh + item.jun_2024_kwh + item.jul_2024_kwh + item.aug_2024_kwh) / 4),
      winter_avg: Math.round((item.dec_2024_kwh + item.jan_2025_kwh + item.feb_2025_kwh + item.mar_2025_kwh) / 4),
      // Calculate trends
      recent_trend: item.may_2025_kwh > item.apr_2025_kwh ? 'increasing' : 'decreasing',
      efficiency_score: Math.round((item.total_kwh / 14) / Math.max(item.may_2024_kwh, item.jul_2024_kwh, item.aug_2024_kwh) * 100),
    }));
  }, []);

  // Available months for filtering
  const availableMonths = [
    'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024',
    'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025',
    'Apr 2025', 'May 2025'
  ];

  const distinctCategories = useMemo(() => 
    [...new Set(processedData.map(d => d.category))].sort(), 
  [processedData]);

  // KPI Calculations
  const kpiData = useMemo(() => {
    const totalConsumption = processedData.reduce((acc, curr) => acc + curr.total_kwh, 0);
    const totalCost = totalConsumption * OMR_PER_KWH;
    const avgConsumptionPerUnit = totalConsumption / processedData.length;
    const activeMeters = processedData.filter(d => d.total_kwh > 0).length;

    // Peak demand analysis
    const peakMonth = mockMonthlyData.reduce((prev, current) => 
      prev.total_consumption_kwh > current.total_consumption_kwh ? prev : current
    );

    // Load factor calculation
    const avgMonthlyLoad = mockMonthlyData.reduce((acc, month) => acc + month.total_consumption_kwh, 0) / mockMonthlyData.length;
    const loadFactor = (avgMonthlyLoad / peakMonth.total_consumption_kwh) * 100;

    return {
      totalConsumption: Math.round(totalConsumption),
      totalCost: Math.round(totalCost * 100) / 100,
      avgConsumptionPerUnit: Math.round(avgConsumptionPerUnit),
      activeMeters,
      peakMonth: peakMonth.month_year,
      peakDemand: Math.round(peakMonth.total_consumption_kwh),
      loadFactor: Math.round(loadFactor * 10) / 10,
      avgMonthlyCost: Math.round((totalCost / 14) * 100) / 100
    };
  }, [processedData]);

  // Performance metrics for Performance section
  const performanceMetrics = useMemo(() => {
    const summerMonths = mockMonthlyData.filter(m => ['May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024'].includes(m.month_year));
    const winterMonths = mockMonthlyData.filter(m => ['Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025'].includes(m.month_year));
    
    const summerAvg = summerMonths.reduce((acc, m) => acc + m.total_consumption_kwh, 0) / summerMonths.length;
    const winterAvg = winterMonths.reduce((acc, m) => acc + m.total_consumption_kwh, 0) / winterMonths.length;
    
    const seasonalVariation = ((summerAvg - winterAvg) / winterAvg) * 100;
    
    // Calculate month-over-month growth
    const latestMonth = mockMonthlyData[mockMonthlyData.length - 1];
    const previousMonth = mockMonthlyData[mockMonthlyData.length - 2];
    const monthlyGrowth = ((latestMonth.total_consumption_kwh - previousMonth.total_consumption_kwh) / previousMonth.total_consumption_kwh) * 100;

    // Energy efficiency score based on trend analysis
    const recent6Months = mockMonthlyData.slice(-6);
    const avgRecent = recent6Months.reduce((acc, m) => acc + m.total_consumption_kwh, 0) / 6;
    const previous6Months = mockMonthlyData.slice(-12, -6);
    const avgPrevious = previous6Months.reduce((acc, m) => acc + m.total_consumption_kwh, 0) / 6;
    const efficiencyTrend = ((avgPrevious - avgRecent) / avgPrevious) * 100;

    return {
      seasonalVariation: Math.round(seasonalVariation * 10) / 10,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      summerPeakRatio: Math.round((summerAvg / kpiData.peakDemand) * 100),
      efficiencyScore: Math.max(0, Math.min(100, Math.round(75 + efficiencyTrend))),
      costPerformanceIndex: Math.round((kpiData.avgMonthlyCost / avgRecent) * 1000000) / 100, // Cost per MWh
      demandStability: Math.round(kpiData.loadFactor)
    };
  }, [kpiData, mockMonthlyData]);

  // Analytics data for Analytics section
  const analyticsData = useMemo(() => {
    // Predictive analysis for next 3 months
    const recentTrend = mockMonthlyData.slice(-3);
    const avgGrowth = recentTrend.reduce((acc, month, index) => {
      if (index === 0) return acc;
      const prevMonth = recentTrend[index - 1];
      return acc + ((month.total_consumption_kwh - prevMonth.total_consumption_kwh) / prevMonth.total_consumption_kwh);
    }, 0) / (recentTrend.length - 1);

    const lastMonth = mockMonthlyData[mockMonthlyData.length - 1];
    const predictedNext3Months = Array.from({ length: 3 }, (_, i) => {
      const predictedConsumption = lastMonth.total_consumption_kwh * Math.pow(1 + avgGrowth, i + 1);
      return {
        month: `Projected ${i + 1}`,
        predicted_kwh: Math.round(predictedConsumption),
        predicted_cost: Math.round(predictedConsumption * OMR_PER_KWH * 100) / 100,
        confidence: Math.max(60, 90 - (i * 15)) // Decreasing confidence over time
      };
    });

    // Cost optimization opportunities
    const highConsumers = processedData
      .filter(item => item.total_kwh > 50000)
      .map(item => ({
        name: item.name,
        current_cost: item.total_cost_omr,
        optimization_potential: Math.round(item.total_cost_omr * 0.15 * 100) / 100, // 15% potential savings
        efficiency_score: item.efficiency_score,
        priority: item.total_kwh > 200000 ? 'High' : item.total_kwh > 100000 ? 'Medium' : 'Low'
      }))
      .sort((a, b) => b.optimization_potential - a.optimization_potential);

    return {
      predictedNext3Months,
      totalOptimizationPotential: highConsumers.reduce((acc, item) => acc + item.optimization_potential, 0),
      highConsumers: highConsumers.slice(0, 8),
      avgGrowthRate: Math.round(avgGrowth * 100 * 10) / 10
    };
  }, [processedData, mockMonthlyData]);

  // Chart data
  const monthlyTrendData = useMemo(() => {
    return mockMonthlyData.map(month => ({
      name: month.month_year.replace('2024', '24').replace('2025', '25'),
      consumption: Math.round(month.total_consumption_kwh),
      cost: Math.round(month.total_cost_omr),
      avg_per_unit: Math.round(month.avg_consumption_per_unit),
      efficiency: Math.round((month.avg_consumption_per_unit / 3000) * 100) // Normalize to 100%
    }));
  }, []);

  const categoryBreakdownData = useMemo(() => {
    const categoryData = {};
    processedData.forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = { name: item.category, value: 0, count: 0, cost: 0 };
      }
      categoryData[item.category].value += item.total_kwh;
      categoryData[item.category].cost += item.total_cost_omr;
      categoryData[item.category].count += 1;
    });
    
    return Object.values(categoryData)
      .map(category => ({
        ...category,
        value: Math.round(category.value),
        cost: Math.round(category.cost * 100) / 100,
        avg_per_unit: Math.round(category.value / category.count)
      }))
      .sort((a, b) => b.value - a.value);
  }, [processedData]);

  const topConsumersData = useMemo(() => {
    return processedData
      .sort((a, b) => b.total_kwh - a.total_kwh)
      .slice(0, 10)
      .map((item, index) => ({
        rank: index + 1,
        name: item.name,
        type: item.type,
        consumption: item.total_kwh,
        cost: item.total_cost_omr,
        trend: item.recent_trend,
        efficiency: item.efficiency_score,
        summer_winter_ratio: Math.round((item.summer_avg / Math.max(item.winter_avg, 1)) * 100) / 100
      }));
  }, [processedData]);

  // AI Analysis function
  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiAnalysisResult("");
    
    setTimeout(() => {
      const seasonalInsight = performanceMetrics.seasonalVariation > 20 
        ? "HIGH seasonal variation detected - consider seasonal optimization strategies" 
        : "MODERATE seasonal variation - current load management is effective";
      
      const efficiencyInsight = performanceMetrics.efficiencyScore > 80 
        ? "EXCELLENT energy efficiency performance" 
        : performanceMetrics.efficiencyScore > 60 
        ? "GOOD efficiency with room for improvement" 
        : "ATTENTION NEEDED - efficiency below optimal levels";

      const costInsight = analyticsData.totalOptimizationPotential > 1000 
        ? "SIGNIFICANT cost optimization opportunities identified" 
        : "MODERATE optimization potential available";

      setAiAnalysisResult(`🔋 AI ELECTRICITY SYSTEM ANALYSIS

📊 PERFORMANCE SUMMARY:
• Total System Consumption: ${kpiData.totalConsumption.toLocaleString()} kWh
• Total System Cost: ${kpiData.totalCost.toLocaleString()} OMR
• Peak Demand Month: ${kpiData.peakMonth} (${kpiData.peakDemand.toLocaleString()} kWh)
• Load Factor: ${kpiData.loadFactor}% (${kpiData.loadFactor > 70 ? 'EFFICIENT' : 'NEEDS IMPROVEMENT'})
• Active Metering Points: ${kpiData.activeMeters} units

⚡ EFFICIENCY ANALYSIS:
• Energy Efficiency Score: ${performanceMetrics.efficiencyScore}/100 (${efficiencyInsight})
• Seasonal Variation: ${Math.abs(performanceMetrics.seasonalVariation)}% (${seasonalInsight})
• Monthly Growth Rate: ${performanceMetrics.monthlyGrowth > 0 ? '+' : ''}${performanceMetrics.monthlyGrowth}%
• Cost Performance: ${performanceMetrics.costPerformanceIndex} OMR/MWh
• Demand Stability: ${performanceMetrics.demandStability}%

🎯 TOP CONSUMERS INSIGHTS:
• Beachwell: ${((311962/kpiData.totalConsumption)*100).toFixed(1)}% of total consumption - CRITICAL infrastructure
• Central Park: ${((267022/kpiData.totalConsumption)*100).toFixed(1)}% of total - High irrigation/lighting loads
• CIF Kitchen: ${((184293/kpiData.totalConsumption)*100).toFixed(1)}% of total - Consistent commercial operation

💰 COST OPTIMIZATION:
• ${costInsight}
• Potential Annual Savings: ${analyticsData.totalOptimizationPotential.toLocaleString()} OMR
• ROI Period: 12-18 months for efficiency upgrades
• Priority Targets: Infrastructure units with >200,000 kWh/year

📈 PREDICTIVE FORECAST:
• Next 3-Month Trend: ${analyticsData.avgGrowthRate > 0 ? 'INCREASING' : 'DECREASING'} consumption
• Projected Growth Rate: ${analyticsData.avgGrowthRate > 0 ? '+' : ''}${analyticsData.avgGrowthRate}% monthly
• Budget Impact: Est. ${Math.round(analyticsData.predictedNext3Months.reduce((acc, m) => acc + m.predicted_cost, 0))} OMR next quarter

🔧 STRATEGIC RECOMMENDATIONS:
• IMMEDIATE: Implement demand response for Beachwell and Central Park (potential 15% savings)
• SHORT-TERM: Install smart meters on high-consumption infrastructure units
• MEDIUM-TERM: Consider solar integration for 30-40% of daytime peak loads
• LONG-TERM: Develop energy storage strategy for load balancing
• MONITORING: Enhanced real-time monitoring for top 10 consumers`);
      setIsAiLoading(false);
    }, 2500);
  };

  // Sub-navigation
  const subSections = [
    { name: 'Dashboard', id: 'Dashboard', icon: BarChart2 },
    { name: 'Performance', id: 'Performance', icon: TrendingUp },
    { name: 'Analytics', id: 'Analytics', icon: Calculator },
    { name: 'Optimization', id: 'Optimization', icon: Target },
  ];

  // Filter options
  const monthOptions = [
    { value: 'All Months', label: 'All Months' },
    ...availableMonths.map(m => ({ value: m, label: m }))
  ];
  
  const categoryOptions = [
    { value: 'All Categories', label: 'All Categories' },
    ...distinctCategories.map(c => ({ value: c, label: c }))
  ];

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <GlassSubNav
        sections={subSections}
        activeSection={activeSubSection}
        setActiveSection={setActiveSubSection}
      />

      {/* Filter Bar */}
      {activeSubSection === 'Dashboard' && (
        <GlassFilterBar
          filters={[
            {
              id: 'month',
              label: 'Month',
              value: selectedMonth,
              onChange: (value) => setSelectedMonth(value),
              options: monthOptions
            },
            {
              id: 'category',
              label: 'Category',
              value: selectedCategory,
              onChange: (value) => setSelectedCategory(value),
              options: categoryOptions
            }
          ]}
          actions={[
            {
              label: '🧠 AI Analysis',
              onClick: handleAiAnalysis,
              loading: isAiLoading,
              loadingText: 'Analyzing...'
            }
          ]}
        />
      )}

      {/* Dashboard Section */}
      {activeSubSection === 'Dashboard' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassSummaryCard
              title="Total Consumption"
              value={kpiData.totalConsumption.toLocaleString()}
              unit="kWh"
              icon={Zap}
              trend="System-wide total"
              trendColor="text-slate-500"
              iconBgColor={COLORS.primary}
              isLoading={isLoading}
            />
            <GlassSummaryCard
              title="Total Cost"
              value={kpiData.totalCost.toLocaleString()}
              unit="OMR"
              icon={DollarSign}
              trend={`Avg ${kpiData.avgMonthlyCost} OMR/month`}
              trendColor="text-slate-500"
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
            <GlassSummaryCard
              title="Peak Demand"
              value={kpiData.peakDemand.toLocaleString()}
              unit="kWh"
              icon={TrendingUp}
              trend={`${kpiData.peakMonth}`}
              trendColor="text-orange-600"
              iconBgColor={COLORS.warning}
              isLoading={isLoading}
            />
            <GlassSummaryCard
              title="Active Meters"
              value={kpiData.activeMeters}
              unit="units"
              icon={Activity}
              trend={`Load Factor: ${kpiData.loadFactor}%`}
              trendColor={kpiData.loadFactor > 70 ? "text-green-600" : "text-orange-600"}
              iconBgColor={COLORS.info}
              isLoading={isLoading}
            />
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassChart title="Monthly Consumption Trends" subtitle="14-month performance overview">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)'}}
                      formatter={(value, name) => [
                        name === 'consumption' ? `${value.toLocaleString()} kWh` :
                        name === 'cost' ? `${value.toLocaleString()} OMR` :
                        name === 'efficiency' ? `${value}%` : value,
                        name === 'consumption' ? 'Consumption' :
                        name === 'cost' ? 'Cost' :
                        name === 'efficiency' ? 'Efficiency' : name
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="consumption" fill={COLORS.chart[0]} name="Consumption (kWh)" />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={COLORS.success} strokeWidth={3} name="Efficiency %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </GlassChart>
            </div>

            <GlassChart title="Consumption by Category" subtitle="System breakdown">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdownData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {categoryBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value.toLocaleString()} kWh`, name]}
                    contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none'}}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </GlassChart>
          </div>

          {/* Top Consumers Table */}
          <GlassChart title="Top Electricity Consumers" subtitle="Highest consumption units">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Rank</th>
                    <th className="text-left p-3 font-semibold">Unit Name</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-right p-3 font-semibold">Consumption (kWh)</th>
                    <th className="text-right p-3 font-semibold">Cost (OMR)</th>
                    <th className="text-center p-3 font-semibold">Trend</th>
                    <th className="text-center p-3 font-semibold">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {topConsumersData.map((consumer) => (
                    <tr key={consumer.rank} className="border-b border-slate-100/50 hover:bg-slate-50/30">
                      <td className="p-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white ${
                          consumer.rank <= 3 ? 'bg-yellow-500' : 'bg-slate-400'
                        }`}>
                          {consumer.rank}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{consumer.name}</td>
                      <td className="p-3 text-slate-600">{consumer.type}</td>
                      <td className="p-3 text-right font-semibold">{consumer.consumption.toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold">{consumer.cost.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center space-x-1 ${
                          consumer.trend === 'increasing' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {consumer.trend === 'increasing' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                          <span className="text-xs font-medium">
                            {consumer.trend === 'increasing' ? 'Rising' : 'Falling'}
                          </span>
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          consumer.efficiency > 75 ? 'bg-green-100 text-green-800' :
                          consumer.efficiency > 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {consumer.efficiency}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassChart>
        </>
      )}

      {/* Performance Section */}
      {activeSubSection === 'Performance' && (
        <>
          {/* Performance KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassSummaryCard
              title="Efficiency Score"
              value={performanceMetrics.efficiencyScore}
              unit="/100"
              icon={Award}
              trend={performanceMetrics.efficiencyScore > 80 ? "Excellent performance" : performanceMetrics.efficiencyScore > 60 ? "Good performance" : "Needs improvement"}
              trendColor={performanceMetrics.efficiencyScore > 80 ? "text-green-600" : performanceMetrics.efficiencyScore > 60 ? "text-blue-600" : "text-orange-600"}
              iconBgColor={COLORS.success}
            />
            <GlassSummaryCard
              title="Load Factor"
              value={performanceMetrics.demandStability}
              unit="%"
              icon={Gauge}
              trend={performanceMetrics.demandStability > 70 ? "Optimal load distribution" : "Room for improvement"}
              trendColor={performanceMetrics.demandStability > 70 ? "text-green-600" : "text-orange-600"}
              iconBgColor={COLORS.info}
            />
            <GlassSummaryCard
              title="Seasonal Variation"
              value={Math.abs(performanceMetrics.seasonalVariation)}
              unit="%"
              icon={Clock}
              trend={Math.abs(performanceMetrics.seasonalVariation) > 30 ? "High seasonal impact" : "Stable seasonal pattern"}
              trendColor={Math.abs(performanceMetrics.seasonalVariation) > 30 ? "text-orange-600" : "text-green-600"}
              iconBgColor={COLORS.warning}
            />
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassChart title="Energy Efficiency Trend" subtitle="Monthly efficiency analysis">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke={COLORS.success} 
                    fill={COLORS.success}
                    fillOpacity={0.3}
                    name="Efficiency %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassChart>

            <GlassChart title="Peak Demand Analysis" subtitle="Load pattern identification">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="consumption" 
                    fill={COLORS.chart[0]}
                    name="Consumption (kWh)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </GlassChart>
          </div>

          {/* Performance Indicators */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-6">Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Energy Efficiency',
                  value: performanceMetrics.efficiencyScore,
                  target: 85,
                  unit: '%',
                  status: performanceMetrics.efficiencyScore >= 85 ? 'excellent' : performanceMetrics.efficiencyScore >= 70 ? 'good' : 'needs-improvement'
                },
                {
                  name: 'Load Factor',
                  value: performanceMetrics.demandStability,
                  target: 75,
                  unit: '%',
                  status: performanceMetrics.demandStability >= 75 ? 'excellent' : performanceMetrics.demandStability >= 60 ? 'good' : 'needs-improvement'
                },
                {
                  name: 'Cost Performance',
                  value: performanceMetrics.costPerformanceIndex,
                  target: 25,
                  unit: 'OMR/MWh',
                  status: performanceMetrics.costPerformanceIndex <= 25 ? 'excellent' : performanceMetrics.costPerformanceIndex <= 30 ? 'good' : 'needs-improvement'
                },
                {
                  name: 'Demand Stability',
                  value: 100 - Math.abs(performanceMetrics.seasonalVariation),
                  target: 80,
                  unit: '%',
                  status: (100 - Math.abs(performanceMetrics.seasonalVariation)) >= 80 ? 'excellent' : (100 - Math.abs(performanceMetrics.seasonalVariation)) >= 70 ? 'good' : 'needs-improvement'
                },
                {
                  name: 'Monthly Growth Control',
                  value: Math.max(0, 100 - Math.abs(performanceMetrics.monthlyGrowth * 10)),
                  target: 90,
                  unit: '%',
                  status: Math.abs(performanceMetrics.monthlyGrowth) <= 1 ? 'excellent' : Math.abs(performanceMetrics.monthlyGrowth) <= 3 ? 'good' : 'needs-improvement'
                },
                {
                  name: 'Peak Management',
                  value: performanceMetrics.summerPeakRatio,
                  target: 85,
                  unit: '%',
                  status: performanceMetrics.summerPeakRatio >= 85 ? 'excellent' : performanceMetrics.summerPeakRatio >= 75 ? 'good' : 'needs-improvement'
                }
              ].map((indicator, index) => (
                <div key={index} className="bg-slate-50/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-slate-700">{indicator.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      indicator.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      indicator.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {indicator.status === 'excellent' ? 'EXCELLENT' :
                       indicator.status === 'good' ? 'GOOD' : 'REVIEW'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-800">
                      {indicator.value.toFixed(1)}{indicator.unit}
                    </span>
                    <span className="text-sm text-slate-500">
                      Target: {indicator.target}{indicator.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        indicator.status === 'excellent' ? 'bg-green-500' :
                        indicator.status === 'good' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.max(0, (indicator.value / (indicator.target * 1.2)) * 100))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}

      {/* Analytics Section */}
      {activeSubSection === 'Analytics' && (
        <>
          {/* Analytics KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassSummaryCard
              title="Growth Rate"
              value={analyticsData.avgGrowthRate > 0 ? '+' : ''}
              unit={`${analyticsData.avgGrowthRate.toFixed(1)}%`}
              icon={TrendingUp}
              trend="Monthly trend"
              trendColor={analyticsData.avgGrowthRate > 5 ? "text-red-600" : analyticsData.avgGrowthRate > 0 ? "text-orange-600" : "text-green-600"}
              iconBgColor={COLORS.info}
            />
            <GlassSummaryCard
              title="Optimization Potential"
              value={analyticsData.totalOptimizationPotential.toFixed(0)}
              unit="OMR"
              icon={Target}
              trend="Annual savings potential"
              trendColor="text-green-600"
              iconBgColor={COLORS.success}
            />
            <GlassSummaryCard
              title="Forecast Confidence"
              value={analyticsData.predictedNext3Months[0]?.confidence || 90}
              unit="%"
              icon={Calculator}
              trend="Next month prediction"
              trendColor="text-blue-600"
              iconBgColor={COLORS.warning}
            />
            <GlassSummaryCard
              title="High Priority Units"
              value={analyticsData.highConsumers.filter(h => h.priority === 'High').length}
              unit="units"
              icon={AlertTriangle}
              trend="Requiring attention"
              trendColor="text-orange-600"
              iconBgColor={COLORS.error}
            />
          </div>

          {/* Predictive Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassChart title="3-Month Consumption Forecast" subtitle="AI-powered predictions">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[
                  ...monthlyTrendData.slice(-6),
                  ...analyticsData.predictedNext3Months.map(p => ({
                    name: p.month,
                    consumption: p.predicted_kwh,
                    predicted: true,
                    confidence: p.confidence
                  }))
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="consumption" 
                    stroke={COLORS.chart[0]} 
                    fill={COLORS.chart[0]}
                    fillOpacity={0.3}
                    name="Historical/Predicted (kWh)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke={COLORS.success} 
                    strokeDasharray="5 5"
                    name="Confidence %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </GlassChart>

            <GlassChart title="Cost Optimization Opportunities" subtitle="Prioritized savings potential">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.highConsumers.slice(0, 6)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(0)} OMR`, 'Savings Potential']}
                  />
                  <Bar 
                    dataKey="optimization_potential" 
                    fill={COLORS.success}
                    name="Potential Savings (OMR)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </GlassChart>
          </div>

          {/* Detailed Analytics Table */}
          <GlassChart title="High Consumer Analysis" subtitle="Detailed optimization targets">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Unit Name</th>
                    <th className="text-right p-3 font-semibold">Current Cost (OMR)</th>
                    <th className="text-right p-3 font-semibold">Savings Potential (OMR)</th>
                    <th className="text-center p-3 font-semibold">Efficiency Score</th>
                    <th className="text-center p-3 font-semibold">Priority</th>
                    <th className="text-center p-3 font-semibold">ROI Period</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.highConsumers.map((unit, index) => (
                    <tr key={index} className="border-b border-slate-100/50 hover:bg-slate-50/30">
                      <td className="p-3 font-medium">{unit.name}</td>
                      <td className="p-3 text-right">{unit.current_cost.toFixed(0)}</td>
                      <td className="p-3 text-right font-semibold text-green-600">{unit.optimization_potential.toFixed(0)}</td>
                      <td className="p-3 text-center">
                        <span className="text-lg font-bold">{unit.efficiency_score}%</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          unit.priority === 'High' ? 'bg-red-100 text-red-800' :
                          unit.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {unit.priority}
                        </span>
                      </td>
                      <td className="p-3 text-center text-slate-600">
                        {unit.priority === 'High' ? '12-18 months' : unit.priority === 'Medium' ? '18-24 months' : '24-36 months'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassChart>
        </>
      )}

      {/* Optimization Section */}
      {activeSubSection === 'Optimization' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-6">Energy Optimization Roadmap</h3>
                <div className="space-y-6">
                  {[
                    {
                      phase: "Phase 1: Immediate Actions (0-3 months)",
                      color: "bg-red-100 text-red-800",
                      items: [
                        "Implement demand response for Beachwell (potential 15% savings)",
                        "Optimize Central Park irrigation schedules",
                        "Install smart power strips in CIF Kitchen",
                        "Conduct energy audit on top 5 consumers"
                      ]
                    },
                    {
                      phase: "Phase 2: Short-term Improvements (3-12 months)",
                      color: "bg-yellow-100 text-yellow-800",
                      items: [
                        "Deploy smart meters on all infrastructure units",
                        "Implement automated load scheduling",
                        "Upgrade lighting systems to LED (if not done)",
                        "Install energy monitoring dashboards"
                      ]
                    },
                    {
                      phase: "Phase 3: Medium-term Strategy (1-2 years)",
                      color: "bg-blue-100 text-blue-800",
                      items: [
                        "Solar PV installation for 30-40% of peak loads",
                        "Battery energy storage system",
                        "Advanced building automation systems",
                        "Heat recovery systems for major consumers"
                      ]
                    },
                    {
                      phase: "Phase 4: Long-term Vision (2-5 years)",
                      color: "bg-green-100 text-green-800",
                      items: [
                        "Microgrid development",
                        "Electric vehicle charging infrastructure",
                        "Smart grid integration",
                        "Carbon neutral operations"
                      ]
                    }
                  ].map((phase, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${phase.color}`}>
                          {phase.phase}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Wins</h3>
                <div className="space-y-4">
                  {[
                    { action: "Peak Shaving", savings: "2,850 OMR/year", effort: "Low" },
                    { action: "Load Scheduling", savings: "1,920 OMR/year", effort: "Medium" },
                    { action: "Equipment Optimization", savings: "3,240 OMR/year", effort: "Medium" },
                    { action: "Behavioral Changes", savings: "1,080 OMR/year", effort: "Low" }
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-50/50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-700">{item.action}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.effort === 'Low' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.effort} Effort
                        </span>
                      </div>
                      <p className="text-lg font-bold text-green-600">{item.savings}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Investment ROI</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Smart Meters</span>
                    <span className="font-semibold">2.1 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Solar PV</span>
                    <span className="font-semibold">4.5 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Energy Storage</span>
                    <span className="font-semibold">6.8 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">LED Upgrades</span>
                    <span className="font-semibold">1.8 years</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </>
      )}

      {/* AI Analysis Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> 
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-white/20"> 
            <div className="flex justify-between items-center mb-6"> 
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">AI Electricity Analysis</h3>
                  <p className="text-slate-600">Comprehensive system performance insights</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAiModalOpen(false)} 
                className="p-2 rounded-full hover:bg-slate-200/50 transition-colors"
              > 
                <Power size={20} className="text-slate-600"/> 
              </button> 
            </div> 
            
            {isAiLoading ? ( 
              <div className="text-center py-12"> 
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <Zap size={48} className="animate-pulse text-purple-500" /> 
                  <Calculator size={48} className="animate-bounce text-blue-500" />
                  <TrendingUp size={48} className="animate-pulse text-green-500" />
                </div>
                <h4 className="text-xl font-semibold text-slate-700 mb-2">Analyzing Electricity System Performance</h4>
                <p className="text-slate-600 mb-4">Processing consumption patterns, efficiency metrics, and optimization opportunities...</p>
                <div className="w-64 mx-auto bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                </div>
              </div> 
            ) : ( 
              <div className="prose max-w-none">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 p-6 rounded-xl font-mono text-sm whitespace-pre-wrap leading-relaxed">
                  {aiAnalysisResult ? ( 
                    aiAnalysisResult.split('\n').map((line, index) => {
                      if (line.startsWith('🔋') || line.startsWith('📊') || line.startsWith('⚡') || line.startsWith('🎯') || line.startsWith('💰') || line.startsWith('📈') || line.startsWith('🔧')) {
                        return <h4 key={index} className="font-bold text-lg mt-6 mb-3 text-slate-800 border-l-4 border-purple-500 pl-3 bg-white/50 py-2 rounded">{line}</h4>;
                      }
                      if (line.startsWith('•')) {
                        return <p key={index} className="ml-6 text-slate-700 my-1 hover:bg-white/30 p-1 rounded transition-colors">{line}</p>;
                      }
                      return <p key={index} className="text-slate-700 my-1">{line}</p>;
                    })
                  ) : ( 
                    <p className="text-center text-slate-500">Analysis not available.</p> 
                  )} 
                </div>
              </div> 
            )} 
            
            <div className="mt-6 flex justify-end space-x-3"> 
              <button 
                onClick={() => setIsAiModalOpen(false)} 
                className="px-6 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg font-medium transition-all hover:from-slate-600 hover:to-slate-700 hover:shadow-lg"
              > 
                Close Analysis
              </button> 
            </div> 
          </div> 
        </div>
      )}
    </div>
  );
};

export default ElectricitySystemModule;