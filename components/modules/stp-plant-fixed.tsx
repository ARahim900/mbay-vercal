import React, { useState, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, 
    Area, AreaChart, ComposedChart, Label
} from 'recharts';
import { 
    ChevronDown, ChevronUp, Filter, TrendingUp, TrendingDown, Droplet, 
    AlertTriangle, ChevronLeft, ChevronRight, LayoutDashboard, Wrench, Sparkles, 
    X, CalendarDays, Database, Recycle, Gauge, Activity, Combine, FlaskConical, 
    FileText, CheckCircle 
} from 'lucide-react';

// Import data from the external data file instead of embedding it
import { 
  stpPlantData, 
  availableStpMonths, 
  monthlyStpData, 
  PLANT_DESIGN_CAPACITY,
  type STPDataEntry 
} from '@/lib/stp-data';

// ===============================
// DESIGN SYSTEM & CONSTANTS
// ===============================

// Muscat Bay Brand Colors
const COLORS = {
  primary: '#4E4456',        // Main brand color - Deep purple-gray
  primaryLight: '#5f5168',   // Muted deep purple/gray from logo
  primaryDark: '#3B3241',    // Darker variant for active states
  accent: '#A8D5E3',         // Soft teal for highlights
  success: '#10B981',        // Green for positive metrics
  warning: '#BFA181',        // Muted gold for warnings
  info: '#0A1828',          // Deep classic blue for information
  error: '#EF4444',         // Red for errors
  rose: '#f43f5e',           // A rose color for consistency
  
  // Chart colors palette - Muscat Bay themed
  chart: ['#4E4456', '#A8D5E3', '#BFA181', '#0A1828', '#5f5168', '#f43f5e', '#F2F0EA', '#10B981', '#EF4444']
};

// ===============================
// SHARED COMPONENTS
// ===============================

const SummaryCard = ({ title, value, icon, unit, trend, trendColor, iconBgColor, isLoading }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-100">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-slate-500 font-semibold text-md">{title}</h3>
        <div className={`p-3 rounded-full text-white shadow-md`} style={{backgroundColor: iconBgColor || COLORS.primary }}>
          <IconComponent size={22} />
        </div>
      </div>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      ) : (
        <>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1.5">
            {value} <span className="text-base font-medium text-slate-500">{unit}</span>
          </p>
          {trend && <p className={`text-xs sm:text-sm font-medium ${trendColor}`}>{trend}</p>}
        </>
      )}
    </div>
  );
};

const ChartWrapper = ({ title, children, subtitle, actions }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
    <div className="mt-4" style={{ height: '350px' }}>
      {children}
    </div>
  </div>
);

const StyledSelect = ({ label, value, onChange, options, id, icon: Icon, disabled }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <div className="relative">
                <select 
                  id={id} 
                  value={value} 
                  onChange={onChange} 
                  disabled={disabled}
                  className="appearance-none w-full p-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:outline-none bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                  style={{ '--tw-ring-color': COLORS.primaryLight, borderColor: 'rgb(203 213 225 / 1)', ringColor: COLORS.primaryLight }} 
                >
                    {options.map(option => ( <option key={option.value} value={option.value}>{option.label}</option> ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    {Icon ? <Icon size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>
        </div>
    );
};

// ===============================
// ENHANCED STP PLANT MODULE
// ===============================

export const STPPlantModule = () => {
  const [activeSubSection, setActiveSubSection] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMaintenanceDay, setSelectedMaintenanceDay] = useState(null);

  // Use the imported data instead of parsing inline
  const initialStpData = stpPlantData;

  // Extract available months from the imported data
  const availableMonths = useMemo(() => {
    return availableStpMonths;
  }, []);

  // Data processing for selected month
  const filteredStpData = useMemo(() => {
    if (selectedMonth === 'All Months') {
      return initialStpData;
    }
    return initialStpData.filter(item => item.month === selectedMonth);
  }, [selectedMonth, initialStpData]);
  
  // Reset selected day when month changes
  React.useEffect(() => {
      setSelectedMaintenanceDay(null);
  }, [selectedMonth]);

  // Monthly summary data for all months
  const monthlyData = useMemo(() => {
    return monthlyStpData;
  }, []);

  // KPI Calculations
  const kpiData = useMemo(() => {
    const data = filteredStpData;
    const totalDays = data.length;
    
    if (totalDays === 0) {
      return {
        avgTreatedWater: 0, avgTseOutput: 0, avgEfficiency: 0, totalTankersDischarge: 0,
        avgTankerPercentage: 0, capacityUtilization: 0, totalDays: 0, totalTreatedWater: 0,
        totalTseOutput: 0, totalInputProcess: 0, avgTotalInput: 0
      };
    }

    const totalTreatedWater = data.reduce((acc, curr) => acc + curr.treatedWater, 0);
    const totalTseOutput = data.reduce((acc, curr) => acc + curr.tseOutput, 0);
    const totalInputProcess = data.reduce((acc, curr) => acc + curr.totalInlet, 0);
    const totalExpectedTankerVolume = data.reduce((acc, curr) => acc + curr.expectedTankerVolume, 0);

    const avgTreatedWater = totalTreatedWater / totalDays;
    const avgTseOutput = totalTseOutput / totalDays;
    const avgTotalInput = totalInputProcess / totalDays;
    const avgEfficiency = totalInputProcess > 0 ? (totalTreatedWater / totalInputProcess) * 100 : 0;
    const totalTankersDischarge = data.reduce((acc, curr) => acc + curr.tankersDischarge, 0);
    const avgTankerPercentage = totalInputProcess > 0 ? (totalExpectedTankerVolume / totalInputProcess) * 100 : 0;
    const capacityUtilization = (avgTreatedWater / PLANT_DESIGN_CAPACITY) * 100;

    return {
      avgTreatedWater: Math.round(avgTreatedWater),
      avgTseOutput: Math.round(avgTseOutput),
      avgEfficiency: Math.round(avgEfficiency * 10) / 10,
      totalTankersDischarge,
      avgTankerPercentage: Math.round(avgTankerPercentage * 10) / 10,
      capacityUtilization: Math.round(capacityUtilization * 10) / 10,
      totalDays,
      totalTreatedWater: Math.round(totalTreatedWater),
      totalTseOutput: Math.round(totalTseOutput),
      totalInputProcess: Math.round(totalInputProcess),
      avgTotalInput: Math.round(avgTotalInput)
    };
  }, [filteredStpData]);

  // Recent trend data
  const trendData = useMemo(() => {
    const dataSlice = filteredStpData.length > 30 ? filteredStpData.slice(-30) : filteredStpData;
    return dataSlice.map(item => ({
      date: item.date ? item.date.substring(0, 5) : 'N/A', // Show DD/MM
      treated: item.treatedWater || 0,
      tse: item.tseOutput || 0,
      inlet: item.totalInlet || 0,
      efficiency: Math.round((item.treatmentEfficiency || 0) * 10) / 10,
      tankers: item.tankersDischarge || 0
    }));
  }, [filteredStpData]);

  // Process efficiency breakdown
  const processEfficiencyData = useMemo(() => {
    if (kpiData.totalDays === 0) return [];
    
    const avgIrrigationEff = kpiData.totalTreatedWater > 0 ? (kpiData.totalTseOutput / kpiData.totalTreatedWater) * 100 : 0;

    return [
      { name: 'Treatment Efficiency', value: kpiData.avgEfficiency, color: COLORS.success },
      { name: 'TSE Recovery', value: Math.round(avgIrrigationEff * 10) / 10, color: COLORS.info },
      { name: 'Tanker Input Ratio', value: kpiData.avgTankerPercentage, color: COLORS.warning },
      { name: 'Direct Sewage Ratio', value: Math.round((100 - kpiData.avgTankerPercentage) * 10) / 10, color: COLORS.accent }
    ];
  }, [kpiData]);

  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiAnalysisResult("");
    
    setTimeout(() => {
        const monthText = selectedMonth === 'All Months' ? 'the entire dataset' : `the month of ${selectedMonth}`;
        const performanceStatus = kpiData.capacityUtilization > 95 ? 'CRITICAL CAPACITY' :
                                  kpiData.capacityUtilization > 85 ? 'NEAR CAPACITY' :
                                  kpiData.capacityUtilization > 70 ? 'HIGH UTILIZATION' :
                                  kpiData.capacityUtilization > 50 ? 'MODERATE UTILIZATION' : 'LOW UTILIZATION';

        // Dynamic analysis of maintenance and performance
        let maintenanceSummary = 'No critical maintenance events (repairs, changes) were found in the log for this period.';
        if (filteredStpData.length > 0) {
            const criticalMaintenance = filteredStpData
                .filter(d => {
                    const maintenanceText = [d.maintenanceAction1, d.maintenanceAction2, d.maintenanceAction3]
                        .filter(Boolean).join(' ');
                    return /repair|changed|leak|open|fixed|problem|issue/i.test(maintenanceText) && 
                           !/check|clean/i.test(maintenanceText);
                })
                .map(d => {
                    const actions = [d.maintenanceAction1, d.maintenanceAction2, d.maintenanceAction3]
                        .filter(Boolean);
                    return `On ${d.date}: ${actions[0] || 'Maintenance activity'}`;
                });

            if (criticalMaintenance.length > 0) {
                maintenanceSummary = `Key interventions noted:\n• ` + criticalMaintenance.slice(0, 4).join('\n• ');
            }
        }
        
        let performanceSummary = 'Data not available for performance highs/lows.';
        if (filteredStpData.length > 1) {
            const maxProdDay = filteredStpData.reduce((max, day) => day.treatedWater > max.treatedWater ? day : max, filteredStpData[0]);
            const minProdDay = filteredStpData.reduce((min, day) => day.treatedWater < min.treatedWater ? day : min, filteredStpData[0]);
            performanceSummary = `Peak Production: ${maxProdDay.treatedWater} m³ on ${maxProdDay.date}\n• Lowest Production: ${minProdDay.treatedWater} m³ on ${minProdDay.date}`;
        }
      
      const analysisText = `🔬 AI Analysis for STP Plant (${selectedMonth}):\n\n📊 PERFORMANCE SUMMARY:\n• Period Analyzed: ${monthText} (${kpiData.totalDays} days)\n• Total Water Treated: ${kpiData.totalTreatedWater.toLocaleString()} m³\n• Avg. Daily Production: ${kpiData.avgTreatedWater} m³/day\n• Capacity Utilization: ${kpiData.capacityUtilization}% (${performanceStatus})\n• Overall Treatment Efficiency: ${kpiData.avgEfficiency}%\n\n🎯 OPERATIONAL HIGHLIGHTS:\n• ${performanceSummary}\n• Tanker Operations: ${kpiData.totalTankersDischarge} total tankers, accounting for ~${kpiData.avgTankerPercentage}% of inlet volume.\n\n🔧 MAINTENANCE INSIGHTS:\n• ${maintenanceSummary}\n• Routine tasks like tank cleaning, chemical dosing, and system checks appear to be consistently logged.\n\n💡 STRATEGIC RECOMMENDATIONS:\n• CAPACITY: With utilization at ${kpiData.capacityUtilization}%, the plant is operating ${performanceStatus.toLowerCase()}. ${kpiData.capacityUtilization > 85 ? 'Expansion or efficiency optimization should be a priority.' : kpiData.capacityUtilization < 50 ? 'There is significant spare capacity for future development.' : 'Operations are in a healthy, sustainable range.'}\n• EFFICIENCY: A treatment efficiency of ${kpiData.avgEfficiency}% is ${kpiData.avgEfficiency >= 90 ? 'excellent. Maintain current protocols.' : kpiData.avgEfficiency >= 80 ? 'good, but monitor for any downward trends.' : 'an area for review. Investigate potential process bottlenecks or equipment performance.'}\n• INPUTS: The reliance on tankers is ${kpiData.avgTankerPercentage > 50 ? 'high. Long-term strategies could explore expanding direct sewage lines to improve operational stability.' : 'moderate to low, which is efficient.'}`;
      
      setAiAnalysisResult(analysisText);
      setIsAiLoading(false);
    }, 2500);
  };

  // Sub-navigation for STP module
  const StpSubNav = () => {
    const subSections = [
        { name: 'Dashboard', id: 'Dashboard', icon: LayoutDashboard },
        { name: 'Maintenance Log', id: 'Maintenance', icon: Wrench },
    ];
    
    return (
        <div className="mb-6 print:hidden flex justify-center">
            <div className="bg-white shadow-md rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
                {subSections.map((tab) => {
                    const isActive = activeSubSection === tab.id;
                    return ( 
                      <button 
                        key={tab.id} 
                        onClick={() => setActiveSubSection(tab.id)} 
                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105`} 
                        style={{ backgroundColor: isActive ? COLORS.primary : 'transparent', color: isActive ? 'white' : COLORS.primaryDark, }} 
                      > 
                        <tab.icon size={18} /> 
                        <span>{tab.name}</span> 
                      </button> 
                    );
                })}
            </div>
        </div>
    );
  };

  // Filter Bar
  const FilterBar = () => {
    const monthOptions = [
      { value: 'All Months', label: 'All Months' },
      ...availableMonths.map(m => ({ value: m, label: m }))
    ];
    
    return (
        <div className="bg-white shadow p-4 rounded-lg mb-6 print:hidden sticky top-0 z-10 border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <StyledSelect 
                  id="monthFilter" 
                  label="Select Period" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)} 
                  options={monthOptions} 
                  icon={CalendarDays}
                />
                <div className="lg:col-span-1"></div>
                <button 
                  onClick={handleAiAnalysis}
                  className="text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 h-[46px] w-full bg-opacity-80 hover:bg-opacity-100" 
                  style={{ backgroundColor: COLORS.primary }} 
                  disabled={isAiLoading}
                > 
                  <Sparkles size={16}/> 
                  <span>{isAiLoading ? 'Analyzing...' : '🧠 AI Analysis'}</span> 
                </button>
            </div>
        </div>
    );
  };

  // AI Analysis Modal
  const AiAnalysisModal = () => {
    if (!isAiModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">AI Analysis Results</h2>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {isAiLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary }}></div>
                  <p className="text-slate-600">Analyzing STP Plant data...</p>
                  <p className="text-sm text-slate-500">Processing {filteredStpData.length} days of operational data</p>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-line font-mono text-sm bg-slate-50 p-4 rounded-lg border">
                {aiAnalysisResult}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Maintenance Log Component
  const MaintenanceLog = () => {
    const maintenanceData = filteredStpData.filter(item => {
      const hasActions = [item.maintenanceAction1, item.maintenanceAction2, item.maintenanceAction3]
        .some(action => action && action.trim() && action.trim() !== '');
      return hasActions;
    });

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Daily Maintenance Activities</h3>
          
          {maintenanceData.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-500">No maintenance activities logged for this period.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {maintenanceData.map((item) => {
                const maintenanceActions = [
                  item.maintenanceAction1,
                  item.maintenanceAction2,
                  item.maintenanceAction3
                ].filter(action => action && action.trim());

                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedMaintenanceDay === item.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedMaintenanceDay(
                      selectedMaintenanceDay === item.id ? null : item.id
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle size={16} className="text-green-600" />
                          <span className="font-medium text-slate-700">{item.date}</span>
                          <span className="text-sm text-slate-500">
                            ({item.treatedWater} m³ treated)
                          </span>
                        </div>
                        
                        <div className="text-sm text-slate-600 space-y-1">
                          {maintenanceActions.slice(0, selectedMaintenanceDay === item.id ? maintenanceActions.length : 1).map((action, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <span className="text-slate-400 mt-1">•</span>
                              <span className="flex-1">{action}</span>
                            </div>
                          ))}
                          
                          {maintenanceActions.length > 1 && selectedMaintenanceDay !== item.id && (
                            <div className="text-xs text-blue-600 font-medium">
                              +{maintenanceActions.length - 1} more activities (click to expand)
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {selectedMaintenanceDay === item.id ? (
                          <ChevronUp size={16} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={16} className="text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 bg-slate-50 p-4 md:p-8">
      <StpSubNav />
      
      {(activeSubSection === 'Dashboard' || activeSubSection === 'Maintenance') && <FilterBar />}
      
      {activeSubSection === 'Dashboard' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total Treated Water" : `${selectedMonth} Total`} 
              value={kpiData.totalTreatedWater.toLocaleString()} 
              unit="m³" 
              icon={Droplet} 
              trend={`${kpiData.avgTreatedWater} m³/day avg`} 
              trendColor="text-slate-500" 
              iconBgColor={COLORS.info}
              isLoading={isLoading}
            />
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total Input Process" : `${selectedMonth} Input`} 
              value={kpiData.totalInputProcess.toLocaleString()} 
              unit="m³" 
              icon={Activity} 
              trend={`${kpiData.avgTotalInput} m³/day avg`} 
              trendColor="text-slate-600" 
              iconBgColor={COLORS.accent}
              isLoading={isLoading}
            />
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total TSE Production" : `${selectedMonth} TSE`} 
              value={kpiData.totalTseOutput.toLocaleString()} 
              unit="m³" 
              icon={Recycle} 
              trend={`${kpiData.avgTseOutput} m³/day avg`} 
              trendColor="text-green-600" 
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
            <SummaryCard 
              title="Capacity Utilization" 
              value={kpiData.capacityUtilization} 
              unit="%" 
              icon={Gauge} 
              trend={`${Math.max(0, PLANT_DESIGN_CAPACITY - kpiData.avgTreatedWater)} m³/day spare`} 
              trendColor="text-slate-600" 
              iconBgColor={COLORS.primary}
              isLoading={isLoading}
            />
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total Tankers" : `${selectedMonth} Tankers`} 
              value={kpiData.totalTankersDischarge} 
              unit="units" 
              icon={Database} 
              trend={`${kpiData.avgTankerPercentage.toFixed(1)}% of input`} 
              trendColor="text-slate-600" 
              iconBgColor={COLORS.warning}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartWrapper title="Daily Performance Trend" subtitle={`Last 30 days of ${selectedMonth}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'white', borderRadius: '8px', borderColor: '#e2e8f0'}} 
                      itemStyle={{color: '#334155'}} 
                      labelStyle={{color: '#0f172a', fontWeight: 'bold'}}
                    />
                    <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
                    <Bar yAxisId="left" dataKey="treated" fill={COLORS.chart[0]} name="Treated Water (m³)" />
                    <Bar yAxisId="left" dataKey="tse" fill={COLORS.chart[1]} name="TSE Output (m³)" />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={COLORS.success} strokeWidth={3} name="Efficiency %" />
                    <Line yAxisId="left" type="monotone" dataKey={() => PLANT_DESIGN_CAPACITY} stroke={COLORS.error} strokeWidth={2} strokeDasharray="5 5" name="Design Capacity" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            <ChartWrapper title="Performance Ratios" subtitle={`${selectedMonth} breakdown`}>
              <ResponsiveContainer width="100%" height="100%">
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
                    cornerRadius={3}
                  >
                    {processEfficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label 
                      value={`${Math.round(processEfficiencyData[0]?.value || 0)}%`} 
                      position="centerBottom" 
                      dy={-5} 
                      className="text-xl font-bold fill-slate-700"
                    />
                    <Label value="Avg Efficiency" position="centerTop" dy={10} className="text-xs fill-slate-500" />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{backgroundColor: 'white', borderRadius: '8px', borderColor: '#e2e8f0'}}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Monthly Overview */}
          <ChartWrapper title="Monthly Performance Overview" subtitle="All months comparison">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'white', borderRadius: '8px', borderColor: '#e2e8f0'}} 
                  itemStyle={{color: '#334155'}} 
                  labelStyle={{color: '#0f172a', fontWeight: 'bold'}}
                />
                <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
                <Area 
                  type="monotone" 
                  dataKey="avgDaily" 
                  stroke={COLORS.primary} 
                  fill={COLORS.primaryLight} 
                  fillOpacity={0.6}
                  name="Avg Daily Treated (m³)"
                />
                <Area 
                  type="monotone" 
                  dataKey="avgTseOutput" 
                  stroke={COLORS.success} 
                  fill={COLORS.success} 
                  fillOpacity={0.4}
                  name="Avg Daily TSE (m³)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </>
      )}

      {activeSubSection === 'Maintenance' && <MaintenanceLog />}

      <AiAnalysisModal />
    </div>
  );
};
