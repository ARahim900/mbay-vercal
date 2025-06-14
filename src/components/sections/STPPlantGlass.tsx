'use client';

import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart, ResponsiveContainer
} from 'recharts';
import { 
  Droplets, Activity, CheckCircle, AlertCircle, Building, Filter, CalendarDays, 
  TrendingUp, Users2, Gauge, FlaskConical, Waves, Target, Database, Recycle, 
  Clock, Sparkles
} from 'lucide-react';
import { 
  GlassChart, GlassSummaryCard, GlassDropdown, GlassButton, GlassCard 
} from '@/components/glassmorphism';
import GlassFilterBar from '@/components/glassmorphism/GlassFilterBar';
import { COLORS } from '@/constants/colors';

// STP Plant Data (from your document)
const rawStpDataString = `Date:\tTotal Treated Water Produced - m³\tTotal TSE Water Output to Irrigation - m³\tTotal Inlet Sewage Received from (MB+Tnk) -m³\tNumber of Tankers Discharged:\tExpected Tanker Volume (m³) (20 m3)\tDirect In line Sewage (MB)
01/07/2024\t385\t340\t339\t10\t200\t139
02/07/2024\t519\t458\t526\t14\t280\t246
03/07/2024\t479\t425\t468\t13\t260\t208
04/07/2024\t547\t489\t464\t11\t220\t244
05/07/2024\t653\t574\t565\t15\t300\t265
01/01/2025\t601\t504\t493\t3\t60\t433
02/01/2025\t600\t491\t528\t3\t60\t468
03/01/2025\t577\t494\t450\t4\t80\t370
04/01/2025\t587\t486\t507\t4\t80\t427
05/01/2025\t532\t445\t473\t4\t80\t393`.trim();

// Parse STP data
const parseStpData = (rawData: string) => {
  try {
    const lines = rawData.split('\\n');
    const dataLines = lines.slice(1); // Skip header

    return dataLines.map((line, index) => {
      const values = line.split('\\t');
      const dateStr = values[0]?.trim();
      
      // Parse date safely
      let parsedDate = null;
      if (dateStr) {
        try {
          const [day, month, year] = dateStr.split('/');
          parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } catch (e) {
          console.error('Date parsing error:', e);
        }
      }

      const treatedWater = parseFloat(values[1]) || 0;
      const tseOutput = parseFloat(values[2]) || 0;
      const totalInlet = parseFloat(values[3]) || 0;

      return {
        id: index + 1,
        date: dateStr,
        parsedDate: parsedDate,
        month: parsedDate ? parsedDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : 'N/A',
        treatedWater,
        tseOutput,
        totalInlet,
        tankersDischarge: parseInt(values[4]) || 0,
        expectedTankerVolume: parseFloat(values[5]) || 0,
        directSewage: parseFloat(values[6]) || 0,
        treatmentEfficiency: totalInlet > 0 ? ((treatedWater / totalInlet) * 100) : 0,
        irrigationEfficiency: treatedWater > 0 ? ((tseOutput / treatedWater) * 100) : 0,
        tankerPercentage: totalInlet > 0 ? ((parseFloat(values[5]) / totalInlet) * 100) : 0,
      };
    }).filter(item => item.date && item.date !== 'N/A');
  } catch (error) {
    console.error('Error parsing STP data:', error);
    return [];
  }
};

const PLANT_DESIGN_CAPACITY = 750; // m³/day
const initialStpData = parseStpData(rawStpDataString);

export const STPPlantModule: React.FC = () => {
  const [activeSubSection, setActiveSubSection] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [isLoading, setIsLoading] = useState(false);

  // Extract available months
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    initialStpData.forEach(item => {
      if (item.parsedDate && item.month !== 'N/A') {
        const monthYear = item.parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthsSet.add(monthYear);
      }
    });
    return Array.from(monthsSet).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
  }, []);

  // Filter data by selected month
  const filteredStpData = useMemo(() => {
    if (selectedMonth === 'All Months') {
      return initialStpData;
    }
    
    return initialStpData.filter(item => {
      if (!item.parsedDate) return false;
      const itemMonth = item.parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return itemMonth === selectedMonth;
    });
  }, [selectedMonth]);

  // KPI Calculations
  const kpiData = useMemo(() => {
    const data = filteredStpData;
    const totalDays = data.length;
    
    if (totalDays === 0) {
      return {
        avgTreatedWater: 0,
        avgTseOutput: 0,
        avgEfficiency: 0,
        totalTankersDischarge: 0,
        avgTankerPercentage: 0,
        capacityUtilization: 0,
        totalDays: 0,
        totalTreatedWater: 0,
        totalTseOutput: 0,
        totalInputProcess: 0,
        avgTotalInput: 0
      };
    }

    const totalTreatedWater = data.reduce((acc, curr) => acc + curr.treatedWater, 0);
    const totalTseOutput = data.reduce((acc, curr) => acc + curr.tseOutput, 0);
    const totalInputProcess = data.reduce((acc, curr) => acc + curr.totalInlet, 0);
    
    return {
      avgTreatedWater: Math.round(totalTreatedWater / totalDays),
      avgTseOutput: Math.round(totalTseOutput / totalDays),
      avgEfficiency: Math.round(data.reduce((acc, curr) => acc + curr.treatmentEfficiency, 0) / totalDays * 10) / 10,
      totalTankersDischarge: data.reduce((acc, curr) => acc + curr.tankersDischarge, 0),
      avgTankerPercentage: Math.round(data.reduce((acc, curr) => acc + curr.tankerPercentage, 0) / totalDays * 10) / 10,
      capacityUtilization: Math.round((totalTreatedWater / totalDays / PLANT_DESIGN_CAPACITY) * 1000) / 10,
      totalDays,
      totalTreatedWater: Math.round(totalTreatedWater),
      totalTseOutput: Math.round(totalTseOutput),
      totalInputProcess: Math.round(totalInputProcess),
      avgTotalInput: Math.round(totalInputProcess / totalDays)
    };
  }, [filteredStpData]);

  // Recent trend data (last 10 days)
  const trendData = useMemo(() => {
    return filteredStpData.slice(-10).map(item => ({
      date: item.date ? item.date.substring(0, 5) : 'N/A',
      treated: item.treatedWater || 0,
      tse: item.tseOutput || 0,
      inlet: item.totalInlet || 0,
      efficiency: Math.round((item.treatmentEfficiency || 0) * 10) / 10
    }));
  }, [filteredStpData]);

  // Process efficiency data
  const processEfficiencyData = useMemo(() => {
    const data = filteredStpData;
    if (data.length === 0) {
      return [
        { name: 'Treatment Efficiency', value: 0, color: COLORS.success },
        { name: 'Irrigation Efficiency', value: 0, color: COLORS.info },
        { name: 'Tanker Input', value: 0, color: COLORS.warning },
        { name: 'Direct Sewage', value: 0, color: COLORS.accent }
      ];
    }
    
    const avgTreatmentEff = data.reduce((acc, curr) => acc + (curr.treatmentEfficiency || 0), 0) / data.length;
    const avgIrrigationEff = data.reduce((acc, curr) => acc + (curr.irrigationEfficiency || 0), 0) / data.length;
    const avgTankerRatio = data.reduce((acc, curr) => acc + (curr.tankerPercentage || 0), 0) / data.length;
    
    return [
      { name: 'Treatment Efficiency', value: Math.round(avgTreatmentEff * 10) / 10, color: COLORS.success },
      { name: 'Irrigation Efficiency', value: Math.round(avgIrrigationEff * 10) / 10, color: COLORS.info },
      { name: 'Tanker Input', value: Math.round(avgTankerRatio * 10) / 10, color: COLORS.warning },
      { name: 'Direct Sewage', value: Math.round((100 - avgTankerRatio) * 10) / 10, color: COLORS.accent }
    ];
  }, [filteredStpData]);

  // Filter options
  const monthOptions = [
    { value: 'All Months', label: 'All Months' },
    ...availableMonths.map(m => ({ value: m, label: m }))
  ];

  const subSections = [
    { name: 'Dashboard', id: 'Dashboard', icon: Activity },
    { name: 'Performance', id: 'Performance', icon: TrendingUp },
    { name: 'Process Flow', id: 'ProcessFlow', icon: FlaskConical },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent mb-2">
          STP Plant Operations
        </h1>
        <p className="text-gray-600">Sewage Treatment Plant Performance Analytics</p>
      </div>

      {/* Sub-navigation */}
      <div className="mb-6 flex justify-center">
        <div className="bg-white shadow-md rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
          {subSections.map((tab) => {
            const isActive = activeSubSection === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubSection(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                  isActive ? 'bg-[#5f5168] text-white' : 'bg-transparent text-[#5f5168]'
                }`}
              >
                <Icon size={18} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      {activeSubSection === 'Dashboard' && (
        <GlassFilterBar>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <GlassDropdown
              label="Select Month"
              options={monthOptions}
              value={selectedMonth}
              onChange={setSelectedMonth}
              icon={CalendarDays}
            />
            <GlassDropdown
              label="Focus Metrics"
              options={[
                { value: 'All Metrics', label: 'All Metrics' },
                { value: 'Treatment Efficiency', label: 'Treatment Efficiency' },
                { value: 'Water Production', label: 'Water Production' },
                { value: 'Capacity Utilization', label: 'Capacity Utilization' }
              ]}
              value="All Metrics"
              onChange={() => {}}
              icon={Target}
            />
            <GlassButton
              onClick={() => setSelectedMonth('All Months')}
              icon={Filter}
              variant="secondary"
            >
              Reset Filters
            </GlassButton>
          </div>
        </GlassFilterBar>
      )}

      {/* Dashboard Section */}
      {activeSubSection === 'Dashboard' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <GlassSummaryCard
              title={selectedMonth === 'All Months' ? "Total Treated Water" : `${selectedMonth} Total`}
              value={kpiData.totalTreatedWater.toLocaleString()}
              unit="m³"
              icon={Droplets}
              trend={`${kpiData.avgTreatedWater} m³/day avg`}
              trendColor="text-slate-500"
              iconBgColor={COLORS.info}
              isLoading={isLoading}
            />
            <GlassSummaryCard
              title={selectedMonth === 'All Months' ? "Total Input Process" : `${selectedMonth} Input`}
              value={kpiData.totalInputProcess.toLocaleString()}
              unit="m³"
              icon={Activity}
              trend={`${kpiData.avgTotalInput} m³/day avg`}
              trendColor="text-slate-600"
              iconBgColor={COLORS.accent}
              isLoading={isLoading}
            />
            <GlassSummaryCard
              title={selectedMonth === 'All Months' ? "Total TSE Production" : `${selectedMonth} TSE`}
              value={kpiData.totalTseOutput.toLocaleString()}
              unit="m³"
              icon={Recycle}
              trend={`${kpiData.avgTseOutput} m³/day avg`}
              trendColor="text-green-600"
              iconBgColor={COLORS.warning}
              isLoading={isLoading}
            />
            <GlassSummaryCard
              title="Capacity Utilization"
              value={kpiData.capacityUtilization}
              unit="%"
              icon={Gauge}
              trend={`${Math.max(0, PLANT_DESIGN_CAPACITY - kpiData.avgTreatedWater)} m³/day spare`}
              trendColor="text-slate-600"
              iconBgColor={COLORS.primary}
              isLoading={isLoading}
            />
            <GlassSummaryCard
              title={selectedMonth === 'All Months' ? "Total Tankers" : `${selectedMonth} Tankers`}
              value={kpiData.totalTankersDischarge}
              unit="units"
              icon={Database}
              trend={`${kpiData.avgTankerPercentage.toFixed(1)}% of input`}
              trendColor="text-slate-600"
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassChart 
                title="Daily Treatment Performance" 
                subtitle={`Recent 10 days - ${selectedMonth === 'All Months' ? 'Latest Data' : selectedMonth}`}
                height={400}
              >
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(95, 81, 104, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="treated" fill={COLORS.chart[0]} name="Treated Water (m³)" />
                  <Bar yAxisId="left" dataKey="tse" fill={COLORS.chart[1]} name="TSE Output (m³)" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={COLORS.success} strokeWidth={3} name="Efficiency %" />
                </ComposedChart>
              </GlassChart>
            </div>

            <GlassChart 
              title="Performance Metrics" 
              subtitle={`${selectedMonth} efficiency breakdown`}
              height={400}
            >
              <PieChart>
                <Pie
                  data={processEfficiencyData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {processEfficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(95, 81, 104, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </GlassChart>
          </div>
        </>
      )}

      {/* Performance Section */}
      {activeSubSection === 'Performance' && (
        <div className="space-y-6">
          <GlassChart 
            title="Treatment Efficiency Trend" 
            subtitle="Daily efficiency over time"
            height={400}
          >
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={[75, 105]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(95, 81, 104, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke={COLORS.success}
                strokeWidth={3}
                dot={{ r: 4, fill: COLORS.success }}
                activeDot={{ r: 7, strokeWidth: 2, fill: COLORS.success }}
                name="Treatment Efficiency %"
              />
            </LineChart>
          </GlassChart>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassChart 
              title="Input vs Output Analysis" 
              subtitle="Water flow comparison"
              height={350}
            >
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(95, 81, 104, 0.1)'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="inlet"
                  stackId="1"
                  stroke={COLORS.chart[2]}
                  fill={COLORS.chart[2]}
                  fillOpacity={0.6}
                  name="Total Inlet (m³)"
                />
                <Area
                  type="monotone"
                  dataKey="treated"
                  stackId="2"
                  stroke={COLORS.chart[0]}
                  fill={COLORS.chart[0]}
                  fillOpacity={0.8}
                  name="Treated Water (m³)"
                />
              </AreaChart>
            </GlassChart>

            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Performance Indicators</h3>
              <div className="space-y-4">
                {[
                  {
                    name: 'Treatment Efficiency',
                    value: kpiData.avgEfficiency,
                    target: 90,
                    unit: '%',
                    status: kpiData.avgEfficiency >= 90 ? 'excellent' : kpiData.avgEfficiency >= 80 ? 'good' : 'needs-improvement'
                  },
                  {
                    name: 'Daily Water Production',
                    value: kpiData.avgTreatedWater,
                    target: PLANT_DESIGN_CAPACITY,
                    unit: 'm³',
                    status: kpiData.avgTreatedWater >= (PLANT_DESIGN_CAPACITY * 0.9) ? 'excellent' : kpiData.avgTreatedWater >= (PLANT_DESIGN_CAPACITY * 0.7) ? 'good' : 'needs-improvement'
                  },
                  {
                    name: 'Capacity Utilization',
                    value: kpiData.capacityUtilization,
                    target: 80,
                    unit: '%',
                    status: kpiData.capacityUtilization >= 75 && kpiData.capacityUtilization <= 90 ? 'excellent' : kpiData.capacityUtilization >= 60 ? 'good' : 'needs-improvement'
                  },
                  {
                    name: 'TSE Recovery Rate',
                    value: kpiData.avgTreatedWater > 0 ? Math.round((kpiData.avgTseOutput / kpiData.avgTreatedWater) * 100) : 0,
                    target: 85,
                    unit: '%',
                    status: kpiData.avgTreatedWater > 0 && ((kpiData.avgTseOutput / kpiData.avgTreatedWater) * 100) >= 85 ? 'excellent' : kpiData.avgTreatedWater > 0 && ((kpiData.avgTseOutput / kpiData.avgTreatedWater) * 100) >= 75 ? 'good' : 'needs-improvement'
                  }
                ].map((indicator, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-700">{indicator.name}</h4>
                      <p className="text-sm text-slate-500">Target: {indicator.target}{indicator.unit}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-lg font-bold text-slate-800">
                        {typeof indicator.value === 'number' && !isNaN(indicator.value) ? indicator.value.toFixed(1) : '0'}{indicator.unit}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      indicator.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      indicator.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {indicator.status === 'excellent' ? 'EXCELLENT' :
                       indicator.status === 'good' ? 'GOOD' : 'REVIEW NEEDED'}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Process Flow Section */}
      {activeSubSection === 'ProcessFlow' && (
        <div className="space-y-6">
          <GlassCard className="p-8">
            <h3 className="text-2xl font-semibold text-slate-700 mb-6 text-center">STP Process Flow Diagram</h3>
            
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8">
              {/* Input Stage */}
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Droplets size={32} className="text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-700 mb-2">Raw Sewage Input</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>Tankers: {kpiData.avgTankerPercentage.toFixed(1)}%</p>
                  <p>Direct Line: {(100 - kpiData.avgTankerPercentage).toFixed(1)}%</p>
                  <p className="font-medium text-slate-800">
                    {kpiData.totalInputProcess.toLocaleString()} m³
                  </p>
                  <p className="text-xs text-blue-600">Avg: {kpiData.avgTotalInput} m³/day</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <div className="w-12 h-0.5 bg-slate-400 lg:w-16"></div>
                <div className="w-3 h-3 bg-slate-400 transform rotate-45 -ml-2"></div>
              </div>

              {/* Treatment Stage */}
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FlaskConical size={32} className="text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-700 mb-2">Treatment Process</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>Efficiency: {kpiData.avgEfficiency}%</p>
                  <p>Capacity: {kpiData.capacityUtilization}%</p>
                  <p className="font-medium text-slate-800">{kpiData.avgTreatedWater} m³/day</p>
                  <p className="text-xs text-green-600">Remaining: {PLANT_DESIGN_CAPACITY - kpiData.avgTreatedWater} m³/day</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <div className="w-12 h-0.5 bg-slate-400 lg:w-16"></div>
                <div className="w-3 h-3 bg-slate-400 transform rotate-45 -ml-2"></div>
              </div>

              {/* Output Stage */}
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Recycle size={32} className="text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-700 mb-2">TSE for Irrigation</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>Recovery: {kpiData.avgTreatedWater > 0 ? Math.round((kpiData.avgTseOutput / kpiData.avgTreatedWater) * 100) : 0}%</p>
                  <p>Quality: Excellent</p>
                  <p className="font-medium text-slate-800">
                    {kpiData.totalTseOutput.toLocaleString()} m³
                  </p>
                  <p className="text-xs text-purple-600">Avg: {kpiData.avgTseOutput} m³/day</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h5 className="font-semibold text-blue-800 mb-2">Primary Treatment</h5>
                <p className="text-sm text-blue-600">Physical separation of solids and liquids through screening and settling</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h5 className="font-semibold text-green-800 mb-2">Secondary Treatment</h5>
                <p className="text-sm text-green-600">Biological treatment using activated sludge process for organic matter removal</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <h5 className="font-semibold text-purple-800 mb-2">Tertiary Treatment</h5>
                <p className="text-sm text-purple-600">Advanced filtration and disinfection producing high-quality TSE water</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default STPPlantModule;
