'use client';

import React, { useState } from 'react';
import { 
  Droplets, Activity, CheckCircle, AlertCircle,
  Building, CalendarDays, TrendingUp, BarChart2
} from 'lucide-react';
import { 
  GlassDropdown, 
  GlassMetricCard, 
  GlassChartCard, 
  GlassButton,
  GlassTabNavigation,
  GlassBadge,
  GlassProgress,
  GlassTable
} from '../ui/glass-index';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

const WaterAnalysisGlass = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedMonth, setSelectedMonth] = useState('Mar-25');
  const [selectedZone, setSelectedZone] = useState('All Zones');

  // Tab configuration
  const tabs = [
    { name: 'Overview', id: 'Overview', icon: BarChart2 },
    { name: 'Water Loss', id: 'WaterLoss', icon: TrendingUp },
    { name: 'Quality', id: 'Quality', icon: CheckCircle }
  ];

  // Sample data for water analysis
  const waterFlowData = [
    { month: 'Jan', supply: 32580, consumption: 31200, loss: 1380 },
    { month: 'Feb', supply: 44043, consumption: 42100, loss: 1943 },
    { month: 'Mar', supply: 34915, consumption: 33500, loss: 1415 },
    { month: 'Apr', supply: 46039, consumption: 44200, loss: 1839 },
  ];

  const zoneConsumptionData = [
    { name: 'Zone 3A', value: 4545, color: '#4E4456' },
    { name: 'Zone 3B', value: 4277, color: '#A8D5E3' },
    { name: 'Zone 5', value: 3082, color: '#BFA181' },
    { name: 'Zone 8', value: 2010, color: '#0A1828' },
    { name: 'Village Square', value: 873, color: '#5f5168' },
  ];

  const waterQualityData = [
    { parameter: 'pH Level', value: 7.2, unit: '', status: 'normal', range: '6.5-8.5' },
    { parameter: 'Turbidity', value: 0.8, unit: 'NTU', status: 'good', range: '<1.0' },
    { parameter: 'Chlorine', value: 0.5, unit: 'mg/L', status: 'normal', range: '0.2-0.6' },
    { parameter: 'TDS', value: 245, unit: 'mg/L', status: 'normal', range: '<500' },
    { parameter: 'Temperature', value: 24.5, unit: '°C', status: 'normal', range: '20-30' },
  ];

  const monthOptions = [
    { value: 'Jan-25', label: 'January 2025' },
    { value: 'Feb-25', label: 'February 2025' },
    { value: 'Mar-25', label: 'March 2025' },
    { value: 'Apr-25', label: 'April 2025' },
  ];

  const zoneOptions = [
    { value: 'All Zones', label: 'All Zones' },
    { value: 'Zone 3A', label: 'Zone 3A' },
    { value: 'Zone 3B', label: 'Zone 3B' },
    { value: 'Zone 5', label: 'Zone 5' },
    { value: 'Zone 8', label: 'Zone 8' },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassDropdown
            label="Select Month"
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            icon={<CalendarDays size={18} />}
          />
          
          <GlassDropdown
            label="Filter by Zone"
            options={zoneOptions}
            value={selectedZone}
            onChange={setSelectedZone}
            icon={<Building size={18} />}
          />
          
          <div className="flex items-end">
            <GlassButton
              variant="primary"
              fullWidth
              icon={<Activity size={16} />}
            >
              Generate Report
            </GlassButton>
          </div>
        </div>
      </div>

      {activeTab === 'Overview' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassMetricCard
              title="Total Water Supply"
              value="46,039"
              unit="m³"
              icon={<Droplets size={20} />}
              trend={{
                value: 31.8,
                label: 'vs last month',
                positive: true
              }}
              iconBgColor="#3B82F6"
            />
            
            <GlassMetricCard
              title="Total Consumption"
              value="44,200"
              unit="m³"
              icon={<Activity size={20} />}
              trend={{
                value: 28.5,
                label: 'vs last month',
                positive: true
              }}
              iconBgColor="#10B981"
            />
            
            <GlassMetricCard
              title="Water Loss"
              value="1,839"
              unit="m³"
              icon={<AlertCircle size={20} />}
              trend={{
                value: 4.0,
                label: 'loss rate',
                positive: false
              }}
              iconBgColor="#F59E0B"
            />
            
            <GlassMetricCard
              title="System Efficiency"
              value="96.0"
              unit="%"
              icon={<CheckCircle size={20} />}
              trend={{
                value: 0.5,
                label: 'improvement',
                positive: true
              }}
              iconBgColor="#4E4456"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassChartCard
              title="Water Supply & Consumption Trend"
              subtitle="Monthly water flow analysis"
            >
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={waterFlowData}>
                  <defs>
                    <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="supply" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSupply)" name="Supply (m³)" />
                  <Area type="monotone" dataKey="consumption" stroke="#10B981" fillOpacity={1} fill="url(#colorConsumption)" name="Consumption (m³)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassChartCard>

            <GlassChartCard
              title="Zone-wise Consumption"
              subtitle="Water usage by zone"
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={zoneConsumptionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {zoneConsumptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
        </>
      )}

      {activeTab === 'WaterLoss' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassChartCard
            title="Water Loss Analysis"
            subtitle="Stage-wise water loss breakdown"
          >
            <div className="space-y-6 mt-4">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-6 rounded-2xl">
                  <h4 className="font-semibold text-blue-800 mb-2">A1 - Main Source</h4>
                  <p className="text-3xl font-bold text-blue-900">46,039 m³</p>
                  <p className="text-sm text-blue-700 mt-1">Total Water Supply</p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="text-center">
                  <div className="text-2xl text-slate-400">↓</div>
                  <GlassBadge variant="warning">Stage 1 Loss: 756 m³ (1.6%)</GlassBadge>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-6 rounded-2xl">
                  <h4 className="font-semibold text-amber-800 mb-2">A2 - Primary Distribution</h4>
                  <p className="text-3xl font-bold text-amber-900">45,283 m³</p>
                  <p className="text-sm text-amber-700 mt-1">Zone Bulk Meters</p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="text-center">
                  <div className="text-2xl text-slate-400">↓</div>
                  <GlassBadge variant="warning">Stage 2 Loss: 1,083 m³ (2.4%)</GlassBadge>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 p-6 rounded-2xl">
                  <h4 className="font-semibold text-green-800 mb-2">A3 - End Users</h4>
                  <p className="text-3xl font-bold text-green-900">44,200 m³</p>
                  <p className="text-sm text-green-700 mt-1">Total Consumption</p>
                </div>
              </div>
            </div>
          </GlassChartCard>

          <GlassChartCard
            title="Loss Reduction Progress"
            subtitle="Monthly water loss percentage"
          >
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={[
                { month: 'Jan', loss: 4.2 },
                { month: 'Feb', loss: 4.4 },
                { month: 'Mar', loss: 4.1 },
                { month: 'Apr', loss: 4.0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', r: 6 }}
                  name="Loss %"
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassChartCard>
        </div>
      )}

      {activeTab === 'Quality' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassChartCard
            title="Water Quality Parameters"
            subtitle="Current quality metrics"
          >
            <div className="space-y-4 mt-4">
              {waterQualityData.map((param, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-slate-700">{param.parameter}</h4>
                      <p className="text-sm text-slate-500">Range: {param.range}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">
                        {param.value} {param.unit}
                      </p>
                      <GlassBadge 
                        variant={param.status === 'good' ? 'success' : 'info'}
                        size="sm"
                      >
                        {param.status.toUpperCase()}
                      </GlassBadge>
                    </div>
                  </div>
                  <GlassProgress
                    value={param.parameter === 'pH Level' ? 72 : 
                           param.parameter === 'Turbidity' ? 80 :
                           param.parameter === 'Chlorine' ? 83 :
                           param.parameter === 'TDS' ? 49 : 82}
                    size="sm"
                    color={param.status === 'good' ? '#10B981' : '#3B82F6'}
                    showPercentage={false}
                  />
                </div>
              ))}
            </div>
          </GlassChartCard>

          <GlassChartCard
            title="Quality Trend Analysis"
            subtitle="30-day quality metrics"
          >
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={[
                { day: '1', ph: 7.1, turbidity: 0.9, chlorine: 0.45 },
                { day: '7', ph: 7.2, turbidity: 0.8, chlorine: 0.50 },
                { day: '14', ph: 7.0, turbidity: 0.7, chlorine: 0.48 },
                { day: '21', ph: 7.3, turbidity: 0.8, chlorine: 0.52 },
                { day: '30', ph: 7.2, turbidity: 0.8, chlorine: 0.50 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="ph" stroke="#4E4456" name="pH Level" strokeWidth={2} />
                <Line type="monotone" dataKey="turbidity" stroke="#A8D5E3" name="Turbidity (NTU)" strokeWidth={2} />
                <Line type="monotone" dataKey="chlorine" stroke="#BFA181" name="Chlorine (mg/L)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </GlassChartCard>
        </div>
      )}
    </div>
  );
};

export default WaterAnalysisGlass;
