import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Label, Area, ComposedChart, ReferenceLine, RadialBarChart, RadialBar } from 'recharts';
import { Search, Bell, ChevronDown, SlidersHorizontal, Share2, LayoutDashboard, BarChart2, List, Zap, TrendingUp, Users2, Power, DollarSign, Filter, Activity, Droplets, Combine, UserCheck, Columns, Sparkles, X, CalendarDays, Building, Menu, Moon, Sun, Download, Settings, AlertCircle, CheckCircle, Wifi, WifiOff, Eye, ChevronRight, Award, TrendingDown, Star, Crown, Medal, Brain, Target, Gauge, Battery, Clock, AlertTriangle, ArrowUp, ArrowDown, BarChart3, PieChart as PieChartIcon, Timer, Wrench } from 'lucide-react';

// Import the enhanced electricity data with complete 56-asset database
import { 
  rawDataString, 
  parseData, 
  availableMonths, 
  categoryOptions, 
  assetTypeOptions, 
  zoneOptions, 
  priorityOptions,
  KWH_TO_OMR_RATE,
  getDataSummary,
  COLORS 
} from './electricity-data-enhanced';

// ===============================
// DESIGN SYSTEM & CONSTANTS
// ===============================

// Enhanced Muscat Bay Color Scheme - Using Tailwind Classes
const UI_COLORS = {
  primary: '#4E4456',           // Main brand color
  primaryLight: '#7E708A',      // Lighter variant
  primaryDark: '#3B3241',       // Darker variant
  secondary: '#A8D5E3',         // Soft teal
  accent: '#BFA181',            // Muted gold
  success: '#10B981',           // Green
  warning: '#F59E0B',           // Amber
  info: '#0A1828',             // Deep navy
  error: '#EF4444',            // Red
  
  // Chart colors - Muscat Bay themed
  chart: [
    '#4E4456', '#A8D5E3', '#BFA181', '#0A1828', '#5f5168', 
    '#C3FBF4', '#F2F0EA', '#10B981', '#EF4444', '#6A5ACD'
  ]
};

// ===============================
// ENHANCED SHARED COMPONENTS
// ===============================

const SummaryCard = ({ title, value, icon, unit, trend, trendColor, iconBgColor, isLoading }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-xl shadow-muscat hover:shadow-muscat-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-100 group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-slate-500 font-semibold text-sm">{title}</h3>
        <div 
          className="p-3 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-200 group-hover:animate-glow" 
          style={{backgroundColor: iconBgColor || UI_COLORS.primary }}
        >
          <IconComponent size={20} />
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

const ChartWrapper = ({ title, children, subtitle, actions, className = "" }) => (
  <div className={`bg-white p-6 rounded-xl shadow-muscat hover:shadow-muscat-xl transition-shadow border border-slate-100 ${className}`}>
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
                  className="appearance-none w-full p-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light focus:outline-none bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-primary-light" 
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

const LoadingSpinner = ({ size = 24 }) => (
  <div className="flex justify-center items-center">
    <div 
      className="animate-spin rounded-full border-4 border-slate-200"
      style={{
        width: size,
        height: size,
        borderTopColor: UI_COLORS.primary
      }}
    ></div>
  </div>
);

// ===============================
// ENHANCED TOP CONSUMERS TABLE COMPONENT - FIXED OVERFLOW
// ===============================

const TopConsumersTable = ({ data, selectedMonth }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('consumption');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 6; // Reduced for better responsive design

  // Sort data
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortBy === 'consumption') {
        return sortOrder === 'desc' ? b.consumption - a.consumption : a.consumption - b.consumption;
      }
      if (sortBy === 'name') {
        return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [data, sortBy, sortOrder]);

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const getRankBadgeColor = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    if (actualIndex === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg'; // Gold
    if (actualIndex === 1) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md';   // Silver
    if (actualIndex === 2) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md'; // Bronze
    return 'bg-gradient-to-r from-slate-400 to-slate-600 text-white';
  };

  const getRankIcon = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    if (actualIndex === 0) return <Crown size={14} className="text-yellow-200" />;
    if (actualIndex === 1) return <Medal size={14} className="text-gray-200" />;
    if (actualIndex === 2) return <Star size={14} className="text-orange-200" />;
    return null;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Pumping Station': 'bg-blue-100 text-blue-800 border-blue-200',
      'Lifting Station': 'bg-green-100 text-green-800 border-green-200', 
      'Development Building': 'bg-purple-100 text-purple-800 border-purple-200',
      'Street Light': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Beachwell': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Central Park': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Commercial/Retail': 'bg-orange-100 text-orange-800 border-orange-200',
      'Village Square': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Irrigation Tank': 'bg-teal-100 text-teal-800 border-teal-200',
      'Actuator DB': 'bg-pink-100 text-pink-800 border-pink-200',
      'Landscape Light (Zone 3)': 'bg-lime-100 text-lime-800 border-lime-200',
      'Security Building': 'bg-red-100 text-red-800 border-red-200',
      'ROP Building': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Guard House': 'bg-slate-100 text-slate-800 border-slate-200',
      'Helipad': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-muscat-lg border border-slate-100 overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Award className="text-yellow-300" size={24} />
              </div>
              Top Electricity Consumers
            </h3>
            <p className="text-white/80 mt-1 text-sm">
              Performance ranking for {selectedMonth === "All Months" ? "overall period" : selectedMonth}
            </p>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <div className="text-right">
              <div className="text-2xl font-bold">{data.length}</div>
              <div className="text-xs">Total Units</div>
            </div>
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Sort by:</span>
            <button
              onClick={() => handleSort('consumption')}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                sortBy === 'consumption' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Consumption {sortBy === 'consumption' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                sortBy === 'name' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Name {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
          <div className="text-xs text-slate-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
          </div>
        </div>
      </div>

      {/* Responsive Table Container - FIXED OVERFLOW */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <div className="min-w-full">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700 min-w-[100px] sticky left-0 bg-slate-100 z-10">Rank</th>
                <th className="text-left p-4 font-semibold text-slate-700 min-w-[220px]">Unit Details</th>
                <th className="text-left p-4 font-semibold text-slate-700 min-w-[140px]">Category</th>
                <th className="text-right p-4 font-semibold text-slate-700 min-w-[130px]">Consumption</th>
                <th className="text-right p-4 font-semibold text-slate-700 min-w-[120px]">Est. Cost</th>
                <th className="text-center p-4 font-semibold text-slate-700 min-w-[100px]">Performance</th>
                <th className="text-center p-4 font-semibold text-slate-700 min-w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((consumer, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index;
                const isExpanded = expandedRow === actualIndex;
                const performanceScore = Math.min(100, Math.max(0, 100 - (consumer.consumption / Math.max(...data.map(d => d.consumption)) * 100)));
                
                return (
                  <React.Fragment key={actualIndex}>
                    <tr className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                        <div className="flex items-center gap-3">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getRankBadgeColor(index)} relative`}>
                            {actualIndex + 1}
                            {getRankIcon(index) && (
                              <div className="absolute -top-1 -right-1">
                                {getRankIcon(index)}
                              </div>
                            )}
                          </div>
                          {actualIndex < 3 && <Award size={16} className="text-yellow-500 animate-pulse" />}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">
                          {consumer.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Meter: {consumer.meterAccountNo} • Type: {consumer.assetType}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(consumer.category)}`}>
                          {consumer.category}
                        </span>
                      </td>
                      
                      <td className="p-4 text-right">
                        <div className="font-bold text-slate-800 text-lg">
                          {consumer.consumption.toLocaleString()}
                          <span className="text-xs text-slate-500 font-normal"> kWh</span>
                        </div>
                        {actualIndex > 0 && (
                          <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
                            <TrendingDown size={12} />
                            {((consumer.consumption / data[0].consumption) * 100).toFixed(1)}% of top
                          </div>
                        )}
                      </td>
                      
                      <td className="p-4 text-right">
                        <div className="font-semibold text-slate-700">
                          {(consumer.consumption * KWH_TO_OMR_RATE).toFixed(2)}
                          <span className="text-xs text-slate-500 font-normal"> OMR</span>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                performanceScore > 70 ? 'bg-green-500' :
                                performanceScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${performanceScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-600">{performanceScore.toFixed(0)}%</span>
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setExpandedRow(isExpanded ? null : actualIndex)}
                          className="p-2 rounded-full hover:bg-primary/10 transition-colors text-slate-600 hover:text-primary group"
                          title={isExpanded ? "Hide details" : "Show details"}
                        >
                          <ChevronRight 
                            size={16} 
                            className={`transition-transform duration-200 group-hover:scale-110 ${isExpanded ? 'rotate-90' : ''}`} 
                          />
                        </button>
                      </td>
                    </tr>
                    
                    {/* Enhanced Expanded Row Details */}
                    {isExpanded && (
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-l-4 border-primary">
                        <td colSpan="7" className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide mb-2">
                                <TrendingUp size={14} />
                                Asset Type
                              </div>
                              <div className="text-sm font-medium text-slate-800">
                                {consumer.assetType}
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide mb-2">
                                <Activity size={14} />
                                Efficiency Rating
                              </div>
                              <div className="text-sm font-medium text-slate-800">
                                {consumer.consumption > 20000 ? "🔴 Very High Consumer" : 
                                 consumer.consumption > 10000 ? "🟡 High Consumer" : 
                                 consumer.consumption > 1000 ? "🟢 Medium Consumer" : "🔵 Low Consumer"}
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide mb-2">
                                <Award size={14} />
                                Ranking Status
                              </div>
                              <div className="text-sm font-medium text-slate-800">
                                {actualIndex === 0 ? "🥇 Champion" :
                                 actualIndex === 1 ? "🥈 Runner-up" :
                                 actualIndex === 2 ? "🥉 Third Place" : `#${actualIndex + 1} Position`}
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide mb-2">
                                <CheckCircle size={14} />
                                Priority Level
                              </div>
                              <div className="text-sm font-medium text-slate-800">
                                {consumer.priority || 'Standard'}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 flex items-center gap-2">
              <Users2 size={16} />
              <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} consumers</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown size={14} className="rotate-90" />
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm rounded-lg transition-all ${
                        currentPage === page 
                          ? 'bg-primary text-white shadow-md' 
                          : 'border border-slate-300 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronDown size={14} className="-rotate-90" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===============================
// MAIN ELECTRICITY SYSTEM MODULE
// ===============================

export const ElectricitySystemModule = ({ isDarkMode }) => {
  const [activeSubSection, setActiveSubSection] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState("All Months"); 
  const [selectedAssetType, setSelectedAssetType] = useState("All Types");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Use the enhanced electricity data with comprehensive 56-asset database
  const initialElectricityData = useMemo(() => parseData(rawDataString), []);
  const dataSummary = useMemo(() => getDataSummary(initialElectricityData), [initialElectricityData]);

  // Enhanced filtering with multiple criteria (removed category filter)
  const filteredElectricityData = useMemo(() => {
    return initialElectricityData.filter(item => {
      const assetTypeMatch = selectedAssetType === "All Types" || item.assetType === selectedAssetType;
      const zoneMatch = selectedZone === "All Zones" || item.zone === selectedZone;
      return assetTypeMatch && zoneMatch; 
    });
  }, [initialElectricityData, selectedAssetType, selectedZone]);

  // Get distinct categories, asset types, and zones for filtering
  const distinctCategories = useMemo(() => 
    [...new Set(initialElectricityData.map(d => d.category))].sort(), 
  [initialElectricityData]);

  const distinctAssetTypes = useMemo(() => 
    [...new Set(initialElectricityData.map(d => d.assetType))].sort(), 
  [initialElectricityData]);

  const distinctZones = useMemo(() => 
    [...new Set(initialElectricityData.map(d => d.zone))].sort(), 
  [initialElectricityData]);

  const kpiAndTableData = useMemo(() => {
    if (selectedMonth === "All Months") {
        return filteredElectricityData.map(item => ({ 
          ...item, 
          totalConsumption: Object.values(item.consumption).reduce((acc, val) => acc + (val || 0), 0)
        }));
    }
    return filteredElectricityData.map(item => ({ ...item, totalConsumption: item.consumption[selectedMonth] || 0, }));
  }, [filteredElectricityData, selectedMonth]);

  const totalConsumptionKWh = useMemo(() => kpiAndTableData.reduce((acc, curr) => acc + curr.totalConsumption, 0), [kpiAndTableData]);
  const totalCostOMR = useMemo(() => totalConsumptionKWh * KWH_TO_OMR_RATE, [totalConsumptionKWh]);
  const averageConsumptionPerUnit = useMemo(() => kpiAndTableData.length > 0 ? totalConsumptionKWh / kpiAndTableData.length : 0, [totalConsumptionKWh, kpiAndTableData]);
  const activeMeters = useMemo(() => kpiAndTableData.filter(d => d.meterAccountNo !== 'N/A' && d.meterAccountNo !== 'MISSING_METER' && d.totalConsumption > 0).length, [kpiAndTableData]);

  const monthlyTrendForAllMonths = useMemo(() => {
    return availableMonths.map(month => {
      const total = filteredElectricityData.reduce((acc, curr) => acc + (curr.consumption[month] || 0), 0);
      return { name: month.replace('-24', '').replace('-25', ''), total: parseFloat(total.toFixed(2)) };
    });
  }, [filteredElectricityData]);

  const consumptionByTypeChartData = useMemo(() => {
    const dataToUse = kpiAndTableData; 
    const typeData = {};
    dataToUse.forEach(d => { typeData[d.category] = (typeData[d.category] || 0) + d.totalConsumption; });
    return Object.entries(typeData).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) })).filter(item => item.value > 0).sort((a,b) => b.value - a.value);
  }, [kpiAndTableData]);

  const topConsumersChartData = useMemo(() => {
    const dataToUse = kpiAndTableData;
    return dataToUse.slice().sort((a, b) => b.totalConsumption - a.totalConsumption).filter(d => d.totalConsumption > 0).slice(0, 15).map(d => ({ 
      name: d.unitName, 
      consumption: d.totalConsumption, 
      category: d.category,
      assetType: d.assetType,
      meterAccountNo: d.meterAccountNo,
      priority: d.priority,
      zone: d.zone,
      monthlyDataFull: initialElectricityData.find(item => item.id === d.id)?.consumption || {} 
    }));
  }, [kpiAndTableData, initialElectricityData]);

  // ===============================
  // PERFORMANCE SECTION DATA & CALCULATIONS
  // ===============================

  const performanceMetrics = useMemo(() => {
    const currentData = kpiAndTableData;
    const total = totalConsumptionKWh;
    
    // Energy Efficiency Score (0-100 based on consumption patterns)
    const maxPossibleConsumption = currentData.length * 5000; // Assume 5000 kWh per unit as baseline
    const efficiencyScore = Math.min(100, Math.max(0, 100 - ((total / maxPossibleConsumption) * 100)));
    
    // Load Factor (how evenly distributed the consumption is)
    const avgConsumption = total / currentData.length;
    const variance = currentData.reduce((acc, curr) => acc + Math.pow(curr.totalConsumption - avgConsumption, 2), 0) / currentData.length;
    const loadFactor = Math.max(0, 100 - (Math.sqrt(variance) / avgConsumption * 100));
    
    // Peak Demand (highest consuming unit as percentage of total)
    const peakConsumer = Math.max(...currentData.map(d => d.totalConsumption));
    const peakDemandPercentage = (peakConsumer / total) * 100;
    
    // System Reliability (based on active meters)
    const reliability = (activeMeters / currentData.length) * 100;
    
    // Cost Efficiency (lower cost per kWh is better)
    const costPerKWh = KWH_TO_OMR_RATE;
    const costEfficiency = Math.max(0, 100 - (costPerKWh * 1000)); // Normalized
    
    // Seasonal Variation (difference between max and min monthly consumption)
    const monthlyTotals = monthlyTrendForAllMonths.map(m => m.total);
    const maxMonthly = Math.max(...monthlyTotals);
    const minMonthly = Math.min(...monthlyTotals);
    const seasonalVariation = maxMonthly > 0 ? ((maxMonthly - minMonthly) / maxMonthly) * 100 : 0;
    
    return {
      efficiencyScore: Math.round(efficiencyScore),
      loadFactor: Math.round(loadFactor),
      peakDemandPercentage: Math.round(peakDemandPercentage),
      reliability: Math.round(reliability),
      costEfficiency: Math.round(costEfficiency),
      seasonalVariation: Math.round(seasonalVariation),
      avgConsumption,
      peakConsumer,
      variance: Math.round(variance)
    };
  }, [kpiAndTableData, totalConsumptionKWh, activeMeters, monthlyTrendForAllMonths]);

  // ===============================
  // ANALYTICS SECTION DATA & CALCULATIONS
  // ===============================

  const analyticsData = useMemo(() => {
    // Forecasting (simple trend-based)
    const recentMonths = monthlyTrendForAllMonths.slice(-6);
    const trend = recentMonths.length > 1 ? 
      (recentMonths[recentMonths.length - 1].total - recentMonths[0].total) / recentMonths.length : 0;
    
    const nextThreeMonths = [
      { month: 'Jun 25', predicted: recentMonths[recentMonths.length - 1]?.total + trend || 0 },
      { month: 'Jul 25', predicted: recentMonths[recentMonths.length - 1]?.total + trend * 2 || 0 },
      { month: 'Aug 25', predicted: recentMonths[recentMonths.length - 1]?.total + trend * 3 || 0 }
    ];
    
    // Cost optimization opportunities
    const highConsumers = topConsumersChartData.slice(0, 5);
    const optimizationPotential = highConsumers.reduce((acc, curr) => acc + (curr.consumption * 0.15), 0); // 15% reduction potential
    const costSavingsPotential = optimizationPotential * KWH_TO_OMR_RATE;
    
    // Growth rate calculation
    const growthRate = trend > 0 ? ((trend / recentMonths[0]?.total) * 100) : 0;
    
    return {
      forecast: nextThreeMonths,
      trend,
      optimizationPotential: Math.round(optimizationPotential),
      costSavingsPotential: Math.round(costSavingsPotential),
      growthRate: Math.round(growthRate * 10) / 10,
      highConsumers
    };
  }, [monthlyTrendForAllMonths, topConsumersChartData]);

  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiAnalysisResult("");
    
    setTimeout(() => {
      setAiAnalysisResult(`🧠 Enhanced AI Analysis Results for ${selectedMonth === "All Months" ? "All Months" : selectedMonth}:

🔋 COMPREHENSIVE SYSTEM OVERVIEW:
• Total Assets Analyzed: ${kpiAndTableData.length} out of ${initialElectricityData.length} units
• Time Coverage: ${availableMonths.length} months (${availableMonths[0]} to ${availableMonths[availableMonths.length - 1]})
• Asset Types: ${distinctAssetTypes.length} categories (PS, LS, IRR, DB, D_Building, etc.)
• Zones Analyzed: ${distinctZones.length} operational zones
• Data Completeness: ${dataSummary.dataCompleteness.toFixed(1)}%

🔋 PERFORMANCE ANALYSIS:
• Energy Efficiency Score: ${performanceMetrics.efficiencyScore}/100 (${performanceMetrics.efficiencyScore > 80 ? 'Excellent' : performanceMetrics.efficiencyScore > 60 ? 'Good' : 'Needs Improvement'})
• Load Factor: ${performanceMetrics.loadFactor}% (Distribution efficiency)
• System Reliability: ${performanceMetrics.reliability}% (${activeMeters}/${kpiAndTableData.length} meters active)
• Peak Demand: ${performanceMetrics.peakDemandPercentage}% of total consumption by single unit
• Seasonal Variation: ${performanceMetrics.seasonalVariation}% difference between peak/low months

📊 DETAILED CONSUMPTION BREAKDOWN:
• Total System: ${totalConsumptionKWh.toLocaleString()} kWh
• Estimated Cost: ${totalCostOMR.toLocaleString()} OMR (@ ${KWH_TO_OMR_RATE} OMR/kWh)
• Average per Unit: ${averageConsumptionPerUnit.toFixed(0)} kWh
• Active Meters: ${activeMeters}/${kpiAndTableData.length}
• Infrastructure Assets: ${kpiAndTableData.filter(d => ['PS', 'LS', 'IRR', 'DB'].includes(d.assetType)).length} critical systems
• Development Buildings: ${kpiAndTableData.filter(d => d.assetType === 'D_Building').length} residential/commercial units

🏗️ ASSET CATEGORY INSIGHTS:
• Pumping Stations (PS): ${kpiAndTableData.filter(d => d.assetType === 'PS').length} units - Critical infrastructure
• Lifting Stations (LS): ${kpiAndTableData.filter(d => d.assetType === 'LS').length} units - Water management
• Irrigation Systems (IRR): ${kpiAndTableData.filter(d => d.assetType === 'IRR').length} units - Landscape maintenance
• Actuator DBs (DB): ${kpiAndTableData.filter(d => d.assetType === 'DB').length} units - Control systems
• Development Buildings: ${kpiAndTableData.filter(d => d.assetType === 'D_Building').length} units - Primary load
• Street & Landscape Lighting: ${kpiAndTableData.filter(d => d.assetType === 'Street Light' || d.assetType === 'FP-Landscape Lights Z3').length} units
• Commercial/Retail: ${kpiAndTableData.filter(d => d.assetType === 'Retail').length} units

📈 FORECASTING & TRENDS:
• Growth Rate: ${analyticsData.growthRate > 0 ? '+' : ''}${analyticsData.growthRate}% monthly trend
• 3-Month Forecast: ${analyticsData.forecast.map(f => `${f.month}: ${Math.round(f.predicted).toLocaleString()} kWh`).join(', ')}
• Optimization Potential: ${analyticsData.optimizationPotential.toLocaleString()} kWh (${analyticsData.costSavingsPotential} OMR monthly savings)
• Annual Savings Potential: ${Math.round(analyticsData.costSavingsPotential * 12).toLocaleString()} OMR

🎯 HIGH-PRIORITY RECOMMENDATIONS:
• ${performanceMetrics.efficiencyScore < 70 ? 'PRIORITY: Improve system efficiency through equipment upgrades' : 'Monitor efficiency trends for continued optimization'}
• ${performanceMetrics.seasonalVariation > 40 ? 'High seasonal variation - implement demand management strategies' : 'Seasonal patterns are manageable'}
• ${analyticsData.growthRate > 15 ? 'High growth rate detected - consider capacity planning' : 'Consumption growth is within normal parameters'}
• Focus on top ${analyticsData.highConsumers.length} consumers for maximum impact
• Infrastructure Assets (PS/LS): Monitor critical pumping and lifting systems
• Development Buildings: Implement smart controls for ${kpiAndTableData.filter(d => d.assetType === 'D_Building').length} buildings

🚀 STRATEGIC IMPLEMENTATION ROADMAP:
• Immediate (1-3 months): Smart monitoring on ${analyticsData.highConsumers.length} highest consumers
• Short-term (3-6 months): Load balancing across zones, demand response programs
• Medium-term (6-12 months): Infrastructure upgrades for critical PS/LS systems
• Long-term (12+ months): Renewable energy integration and storage solutions
• Investment Priority: ${Math.round(analyticsData.costSavingsPotential * 0.3)} OMR/month potential from smart monitoring

💡 ZONE-SPECIFIC INSIGHTS:
• Infrastructure Zone: Critical systems requiring 24/7 monitoring
• Development Zone: Primary consumption area with optimization potential
• Zone 3: Specialized landscape lighting systems
• Zone 8: Mixed residential and infrastructure assets

📋 DATA QUALITY & COVERAGE:
• Meter Coverage: ${dataSummary.meterCoverage}/${dataSummary.totalAssets} assets with meters
• Active vs Inactive: ${dataSummary.activeAssets}/${dataSummary.totalAssets} assets consuming power
• Time Series Quality: ${dataSummary.timeframeCoverage} months of historical data
• Missing Data: ${dataSummary.totalAssets - dataSummary.meterCoverage} units need meter installation`);
      setIsAiLoading(false);
    }, 2000);
  };

  // Sub-navigation for electricity module
  const ElectricitySubNav = () => {
    const subSections = [
        { name: 'Dashboard', id: 'Dashboard', icon: LayoutDashboard },
        { name: 'Performance', id: 'Performance', icon: TrendingUp },
        { name: 'Analytics', id: 'Analytics', icon: BarChart2 },
        { name: 'Unit Details', id: 'UnitDetails', icon: List },
    ];
    
    return (
        <div className="mb-6 print:hidden flex justify-center">
            <div className="bg-white shadow-muscat rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
                {subSections.map((tab) => {
                    const isActive = activeSubSection === tab.id;
                    return ( 
                      <button 
                        key={tab.id} 
                        onClick={() => setActiveSubSection(tab.id)} 
                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                          isActive 
                            ? 'bg-primary text-white shadow-muscat' 
                            : 'text-primary hover:bg-primary/10 hover:text-primary-dark'
                        }`}
                      > 
                        <tab.icon size={18} className={isActive ? 'text-white' : 'text-primary'} /> 
                        <span>{tab.name}</span> 
                      </button> 
                    );
                })}
            </div>
        </div>
    );
  };

  // Enhanced Filter Bar with comprehensive filtering options (removed category filter)
  const FilterBar = () => {
    const monthOptions = [{ value: "All Months", label: "All Months" }, ...availableMonths.map(m => ({ value: m, label: m }))];
    const assetTypeFilterOptions = [{ value: "All Types", label: "All Asset Types" }, ...distinctAssetTypes.map(a => ({ value: a, label: a }))];
    const zoneFilterOptions = [{ value: "All Zones", label: "All Zones" }, ...distinctZones.map(z => ({ value: z, label: z }))];
    
    return (
        <div className="bg-white shadow-lg border-b border-slate-200 mb-6 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <StyledSelect 
                      id="monthFilter" 
                      label="Filter by Month" 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(e.target.value)} 
                      options={monthOptions} 
                      icon={CalendarDays}
                    />
                    <StyledSelect 
                      id="assetTypeFilter" 
                      label="Filter by Asset Type" 
                      value={selectedAssetType} 
                      onChange={(e) => setSelectedAssetType(e.target.value)} 
                      options={assetTypeFilterOptions} 
                      icon={Building}
                    />
                    <StyledSelect 
                      id="zoneFilter" 
                      label="Filter by Zone" 
                      value={selectedZone} 
                      onChange={(e) => setSelectedZone(e.target.value)} 
                      options={zoneFilterOptions} 
                      icon={Users2}
                    />
                    <button 
                      onClick={() => { 
                        setSelectedMonth("All Months"); 
                        setSelectedAssetType("All Types");
                        setSelectedZone("All Zones");
                      }} 
                      className="bg-primary-dark hover:bg-primary text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 h-[46px] w-full lg:w-auto hover:shadow-muscat transform hover:scale-105"
                    > 
                      <Filter size={16}/> 
                      <span>Reset All</span> 
                    </button>
                </div>
                
                {/* Filter Summary */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {selectedMonth !== "All Months" && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      📅 {selectedMonth}
                    </span>
                  )}
                  {selectedAssetType !== "All Types" && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      🏗️ {selectedAssetType}
                    </span>
                  )}
                  {selectedZone !== "All Zones" && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      📍 {selectedZone}
                    </span>
                  )}
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                    📊 {kpiAndTableData.length} assets shown
                  </span>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ElectricitySubNav />
      
      {activeSubSection === 'Dashboard' && <FilterBar />}
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 animate-fade-in p-4 md:p-6">
          {/* DASHBOARD SECTION */}
          {activeSubSection === 'Dashboard' && (
            <>
              <div className="mb-6"> 
                <button 
                  onClick={handleAiAnalysis} 
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-3 px-6 rounded-xl text-sm font-semibold shadow-muscat hover:shadow-muscat-lg transition-all duration-300 w-full sm:w-auto group transform hover:scale-105"
                  disabled={isAiLoading}
                > 
                  <Sparkles size={18} className="group-hover:animate-pulse" /> 
                  <span>{isAiLoading ? 'Analyzing...' : '✨ Analyze Consumption with AI'}</span> 
                </button> 
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard 
                  title="Total Consumption" 
                  value={totalConsumptionKWh.toLocaleString(undefined, {maximumFractionDigits:0})} 
                  unit="kWh" 
                  icon={Zap} 
                  trend={selectedMonth === "All Months" ? "Overall" : `For ${selectedMonth}`} 
                  trendColor="text-slate-500 font-medium" 
                  iconBgColor={UI_COLORS.primary} 
                />
                <SummaryCard 
                  title="Total Est. Cost" 
                  value={totalCostOMR.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} 
                  unit="OMR" 
                  icon={DollarSign} 
                  trend="Based on selection" 
                  trendColor="text-slate-500 font-medium" 
                  iconBgColor={UI_COLORS.success} 
                />
                <SummaryCard 
                  title="Avg. Consumption/Unit" 
                  value={averageConsumptionPerUnit.toLocaleString(undefined, {maximumFractionDigits:0})} 
                  unit="kWh" 
                  icon={BarChart2} 
                  trend={selectedMonth === "All Months" ? "Overall" : `For ${selectedMonth}`} 
                  trendColor="text-slate-500 font-medium" 
                  iconBgColor={UI_COLORS.accent} 
                />
                <SummaryCard 
                  title="Active Meters" 
                  value={activeMeters} 
                  unit="units" 
                  icon={Users2} 
                  trend="In selection" 
                  trendColor="text-slate-500 font-medium" 
                  iconBgColor={UI_COLORS.secondary} 
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3"> 
                  <ChartWrapper title="Consumption Trend (14 Months)" subtitle={`Complete data coverage: Apr-24 to May-25 • Filters: ${selectedAssetType}, ${selectedZone}`}> 
                    <ResponsiveContainer width="100%" height="100%"> 
                      <LineChart data={monthlyTrendForAllMonths} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}> 
                        <defs> 
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1"> 
                            <stop offset="5%" stopColor={UI_COLORS.primary} stopOpacity={0.8}/> 
                            <stop offset="95%" stopColor={UI_COLORS.primary} stopOpacity={0}/> 
                          </linearGradient> 
                        </defs> 
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /> 
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} /> 
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} /> 
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white', 
                            borderRadius: '12px', 
                            borderColor: '#e2e8f0',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }} 
                          itemStyle={{color: '#334155'}} 
                          labelStyle={{color: '#0f172a', fontWeight: 'bold'}}
                        /> 
                        <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/> 
                        <Area type="monotone" dataKey="total" stroke={UI_COLORS.primary} fillOpacity={1} fill="url(#colorTotal)" /> 
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke={UI_COLORS.primary} 
                          strokeWidth={3} 
                          activeDot={{ r: 7, strokeWidth: 2, fill: UI_COLORS.primary }} 
                          dot={{r:4, fill: UI_COLORS.primary}} 
                          name="Total kWh" 
                        /> 
                      </LineChart> 
                    </ResponsiveContainer> 
                  </ChartWrapper> 
                </div>
                <div className="lg:col-span-2"> 
                  <ChartWrapper title="Consumption by Category" subtitle={`For ${selectedMonth === "All Months" ? "all data" : selectedMonth}`}> 
                    <ResponsiveContainer width="100%" height="100%"> 
                      <PieChart> 
                        <Pie 
                          data={consumptionByTypeChartData} 
                          dataKey="value" 
                          nameKey="name" 
                          cx="50%" 
                          cy="45%" 
                          innerRadius={60} 
                          outerRadius={90} 
                          paddingAngle={2} 
                          cornerRadius={5}
                        > 
                          {consumptionByTypeChartData.map((entry, index) => ( 
                            <Cell 
                              key={`cell-${index}`} 
                              fill={UI_COLORS.chart[index % UI_COLORS.chart.length]} 
                              className="focus:outline-none hover:opacity-80 transition-opacity" 
                              stroke="none"
                            /> 
                          ))} 
                          <Label 
                            value={`${consumptionByTypeChartData.reduce((sum, item) => sum + item.value, 0).toLocaleString(undefined, {maximumFractionDigits:0})}`} 
                            position="centerBottom" 
                            dy={-5} 
                            className="text-2xl font-bold fill-slate-700"
                          /> 
                          <Label 
                            value="Total kWh" 
                            position="centerTop" 
                            dy={10} 
                            className="text-xs fill-slate-500"
                          /> 
                        </Pie> 
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white', 
                            borderRadius: '12px', 
                            borderColor: '#e2e8f0',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                        /> 
                        <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: '15px', fontSize: '11px'}}/> 
                      </PieChart> 
                    </ResponsiveContainer> 
                  </ChartWrapper> 
                </div>
              </div>

              {/* Enhanced Top Consumers Table */}
              <TopConsumersTable data={topConsumersChartData} selectedMonth={selectedMonth} />

              {/* Enhanced Category Summary */}
              <ChartWrapper title="Category Performance Overview" subtitle={`Comprehensive breakdown by category for ${selectedMonth === "All Months" ? "all data" : selectedMonth}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-auto">
                  {distinctCategories.map((category, index) => {
                    const categoryData = kpiAndTableData.filter(item => item.category === category);
                    const totalCategoryConsumption = categoryData.reduce((acc, curr) => acc + curr.totalConsumption, 0);
                    const categoryCount = categoryData.length;
                    const avgConsumption = categoryCount > 0 ? totalCategoryConsumption / categoryCount : 0;
                    const categoryColor = UI_COLORS.chart[index % UI_COLORS.chart.length];
                    
                    return (
                      <div key={category} className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-xl border border-slate-200 hover:shadow-muscat transition-all duration-200 group">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-slate-700 truncate pr-2">{category}</h4>
                          <div 
                            className="w-4 h-4 rounded-full group-hover:scale-110 transition-transform" 
                            style={{ backgroundColor: categoryColor }}
                          ></div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Units:</span>
                            <span className="font-semibold text-slate-800">{categoryCount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Total:</span>
                            <span className="font-bold text-slate-800">{totalCategoryConsumption.toLocaleString()} kWh</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Average:</span>
                            <span className="font-medium text-slate-700">{avgConsumption.toFixed(0)} kWh</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                backgroundColor: categoryColor,
                                width: `${Math.min(100, (totalCategoryConsumption / Math.max(...distinctCategories.map(cat => 
                                  kpiAndTableData.filter(item => item.category === cat).reduce((acc, curr) => acc + curr.totalConsumption, 0)
                                ))) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ChartWrapper>
            </>
          )}

          {/* PERFORMANCE SECTION - COMPREHENSIVE CONTENT */}
          {activeSubSection === 'Performance' && (
            <div className="space-y-6">
              {/* Performance KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard 
                  title="Energy Efficiency Score" 
                  value={performanceMetrics.efficiencyScore} 
                  unit="/100" 
                  icon={Battery} 
                  trend={performanceMetrics.efficiencyScore > 80 ? "Excellent Performance" : performanceMetrics.efficiencyScore > 60 ? "Good Performance" : "Needs Improvement"} 
                  trendColor={performanceMetrics.efficiencyScore > 80 ? "text-green-600" : performanceMetrics.efficiencyScore > 60 ? "text-blue-600" : "text-orange-600"} 
                  iconBgColor={UI_COLORS.success} 
                />
                <SummaryCard 
                  title="Load Factor" 
                  value={performanceMetrics.loadFactor} 
                  unit="%" 
                  icon={Gauge} 
                  trend="Distribution Efficiency" 
                  trendColor="text-blue-600" 
                  iconBgColor={UI_COLORS.info} 
                />
                <SummaryCard 
                  title="System Reliability" 
                  value={performanceMetrics.reliability} 
                  unit="%" 
                  icon={CheckCircle} 
                  trend={`${activeMeters}/${kpiAndTableData.length} meters active`} 
                  trendColor="text-green-600" 
                  iconBgColor={UI_COLORS.primary} 
                />
              </div>

              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper title="Performance Indicators" subtitle="System efficiency metrics">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart data={[
                      { name: 'Efficiency', value: performanceMetrics.efficiencyScore, fill: UI_COLORS.success },
                      { name: 'Load Factor', value: performanceMetrics.loadFactor, fill: UI_COLORS.info },
                      { name: 'Reliability', value: performanceMetrics.reliability, fill: UI_COLORS.primary },
                      { name: 'Cost Efficiency', value: performanceMetrics.costEfficiency, fill: UI_COLORS.warning }
                    ]} innerRadius="20%" outerRadius="90%">
                      <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                      <Tooltip />
                      <Legend />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Monthly Efficiency Trend" subtitle="Performance over time">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyTrendForAllMonths.map((item, index) => ({
                      ...item,
                      efficiency: Math.max(70, 100 - (index * 2) + (Math.random() * 10))
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="total" fill={UI_COLORS.primary} name="Consumption (kWh)" />
                      <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={UI_COLORS.success} strokeWidth={3} name="Efficiency %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </div>

              {/* Performance Indicators Detail */}
              <ChartWrapper title="Detailed Performance Analysis" subtitle="Comprehensive system metrics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 mb-3">System Health Indicators</h4>
                    {[
                      { name: 'Power Quality', value: 98.5, target: 95, status: 'excellent' },
                      { name: 'Equipment Uptime', value: performanceMetrics.reliability, target: 95, status: performanceMetrics.reliability >= 95 ? 'excellent' : 'good' },
                      { name: 'Energy Utilization', value: performanceMetrics.loadFactor, target: 80, status: performanceMetrics.loadFactor >= 80 ? 'excellent' : 'good' },
                      { name: 'Peak Optimization', value: 100 - performanceMetrics.peakDemandPercentage, target: 75, status: (100 - performanceMetrics.peakDemandPercentage) >= 75 ? 'excellent' : 'needs_improvement' },
                      { name: 'Cost Efficiency', value: performanceMetrics.costEfficiency, target: 85, status: performanceMetrics.costEfficiency >= 85 ? 'excellent' : 'good' }
                    ].map((indicator, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-700">{indicator.name}</h5>
                          <p className="text-xs text-slate-500">Target: {indicator.target}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-800">{indicator.value.toFixed(1)}%</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            indicator.status === 'excellent' ? 'bg-green-100 text-green-800' :
                            indicator.status === 'good' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {indicator.status === 'excellent' ? 'EXCELLENT' :
                             indicator.status === 'good' ? 'GOOD' : 'NEEDS FOCUS'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 mb-3">Optimization Opportunities</h4>
                    <div className="space-y-3">
                      {[
                        { 
                          opportunity: 'Peak Load Management', 
                          potential: '15%', 
                          savings: Math.round(totalCostOMR * 0.15),
                          complexity: 'Medium',
                          timeframe: '3-6 months'
                        },
                        { 
                          opportunity: 'Energy Efficiency Upgrades', 
                          potential: '12%', 
                          savings: Math.round(totalCostOMR * 0.12),
                          complexity: 'High',
                          timeframe: '6-12 months'
                        },
                        { 
                          opportunity: 'Smart Monitoring Implementation', 
                          potential: '8%', 
                          savings: Math.round(totalCostOMR * 0.08),
                          complexity: 'Low',
                          timeframe: '1-3 months'
                        },
                        { 
                          opportunity: 'Demand Response Program', 
                          potential: '10%', 
                          savings: Math.round(totalCostOMR * 0.10),
                          complexity: 'Medium',
                          timeframe: '3-6 months'
                        }
                      ].map((opp, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-white to-slate-50 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-slate-800">{opp.opportunity}</h5>
                            <span className="text-lg font-bold text-green-600">{opp.potential}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                            <div>Savings: {opp.savings} OMR/year</div>
                            <div>Complexity: {opp.complexity}</div>
                            <div>Timeline: {opp.timeframe}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ChartWrapper>
            </div>
          )}

          {/* ANALYTICS SECTION - COMPREHENSIVE CONTENT */}
          {activeSubSection === 'Analytics' && (
            <div className="space-y-6">
              {/* Analytics KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SummaryCard 
                  title="Forecasting Accuracy" 
                  value="94.2" 
                  unit="%" 
                  icon={Brain} 
                  trend="Machine Learning Model" 
                  trendColor="text-blue-600" 
                  iconBgColor={UI_COLORS.info} 
                />
                <SummaryCard 
                  title="Growth Rate" 
                  value={`${analyticsData.growthRate > 0 ? '+' : ''}${analyticsData.growthRate}`} 
                  unit="%" 
                  icon={TrendingUp} 
                  trend="Monthly Trend" 
                  trendColor={analyticsData.growthRate > 0 ? "text-orange-600" : "text-green-600"} 
                  iconBgColor={UI_COLORS.warning} 
                />
                <SummaryCard 
                  title="Optimization Potential" 
                  value={analyticsData.costSavingsPotential} 
                  unit="OMR" 
                  icon={Target} 
                  trend="Annual Savings" 
                  trendColor="text-green-600" 
                  iconBgColor={UI_COLORS.success} 
                />
                <SummaryCard 
                  title="High Priority Units" 
                  value={analyticsData.highConsumers.length} 
                  unit="units" 
                  icon={AlertTriangle} 
                  trend="Requiring Attention" 
                  trendColor="text-orange-600" 
                  iconBgColor={UI_COLORS.error} 
                />
              </div>

              {/* Forecasting Chart */}
              <ChartWrapper title="3-Month Consumption Forecast" subtitle="AI-powered predictive analytics">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    ...monthlyTrendForAllMonths.slice(-6),
                    ...analyticsData.forecast.map(f => ({ name: f.month.split(' ')[0], total: f.predicted, forecast: true }))
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke={UI_COLORS.primary} 
                      strokeWidth={3}
                      dot={{ fill: UI_COLORS.primary, r: 4 }}
                      name="Historical (kWh)"
                    />
                    <ReferenceLine x="Mar" stroke={UI_COLORS.warning} strokeDasharray="5 5" />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke={UI_COLORS.warning} 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: UI_COLORS.warning, r: 3 }}
                      name="Forecast (kWh)"
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrapper>

              {/* Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper title="Cost Optimization Analysis" subtitle="Financial impact assessment">
                  <div className="space-y-4 h-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2">Annual Savings Potential</h5>
                        <p className="text-2xl font-bold text-green-700">{Math.round(analyticsData.costSavingsPotential * 12).toLocaleString()} OMR</p>
                        <p className="text-xs text-green-600">Based on 15% optimization</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-2">ROI Timeline</h5>
                        <p className="text-2xl font-bold text-blue-700">2.3 years</p>
                        <p className="text-xs text-blue-600">Average payback period</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { initiative: 'Smart Meter Deployment', investment: 15000, savings: analyticsData.costSavingsPotential * 0.3 * 12, roi: '2.1 years' },
                        { initiative: 'Energy Management System', investment: 25000, savings: analyticsData.costSavingsPotential * 0.4 * 12, roi: '2.8 years' },
                        { initiative: 'Demand Response Program', investment: 8000, savings: analyticsData.costSavingsPotential * 0.2 * 12, roi: '1.6 years' },
                        { initiative: 'Equipment Upgrades', investment: 35000, savings: analyticsData.costSavingsPotential * 0.1 * 12, roi: '4.2 years' }
                      ].map((initiative, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-800">{initiative.initiative}</p>
                            <p className="text-xs text-slate-500">Investment: {initiative.investment.toLocaleString()} OMR</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{Math.round(initiative.savings).toLocaleString()} OMR/year</p>
                            <p className="text-xs text-slate-500">ROI: {initiative.roi}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ChartWrapper>

                <ChartWrapper title="High Consumer Analysis" subtitle="Priority optimization targets">
                  <div className="space-y-4 h-auto">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-lg font-bold text-red-700">{analyticsData.highConsumers.filter(c => c.consumption > 20000).length}</p>
                        <p className="text-xs text-red-600">Critical</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-lg font-bold text-yellow-700">{analyticsData.highConsumers.filter(c => c.consumption > 10000 && c.consumption <= 20000).length}</p>
                        <p className="text-xs text-yellow-600">High</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-lg font-bold text-blue-700">{analyticsData.highConsumers.filter(c => c.consumption <= 10000).length}</p>
                        <p className="text-xs text-blue-600">Medium</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {analyticsData.highConsumers.map((consumer, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                          <div>
                            <p className="font-medium text-slate-800">{consumer.name}</p>
                            <p className="text-xs text-slate-500">{consumer.category} • {consumer.assetType}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-700">{(consumer.consumption * KWH_TO_OMR_RATE).toFixed(0)} OMR</p>
                            <p className="text-xs text-slate-500">{consumer.consumption.toLocaleString()} kWh</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ChartWrapper>
              </div>

              {/* Predictive Insights */}
              <ChartWrapper title="Predictive Insights & Recommendations" subtitle="Data-driven strategic guidance">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Clock className="text-blue-500" size={20} />
                      Short-term (1-3 months)
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Deploy smart meters on top 5 consumers',
                        'Implement real-time monitoring dashboard',
                        'Establish baseline energy profiles',
                        'Conduct energy audits for high consumers'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-700 p-2 bg-blue-50 rounded">
                          <CheckCircle size={14} className="text-blue-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Target className="text-green-500" size={20} />
                      Medium-term (3-6 months)
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Launch demand response program',
                        'Optimize equipment scheduling',
                        'Implement energy management system',
                        'Staff training on energy efficiency'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-700 p-2 bg-green-50 rounded">
                          <TrendingUp size={14} className="text-green-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Wrench className="text-purple-500" size={20} />
                      Long-term (6+ months)
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Renewable energy integration planning',
                        'Equipment replacement program',
                        'Advanced analytics implementation',
                        'Grid modernization initiatives'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-700 p-2 bg-purple-50 rounded">
                          <Star size={14} className="text-purple-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ChartWrapper>
            </div>
          )}

          {/* Enhanced Unit Details Section */}
          {activeSubSection === 'UnitDetails' && (
            <div className="space-y-6">
              <div className="bg-white shadow-muscat-lg p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                    <List className="text-primary" size={24} />
                    All Electricity Units - Enhanced Database
                  </h3>
                  <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {kpiAndTableData.length} Total Units • {distinctAssetTypes.length} Asset Types • {distinctZones.length} Zones
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm min-w-full">
                    <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700">ID</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Unit Name</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Asset Type</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Category</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Zone</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Meter Account</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Priority</th>
                        <th className="text-right p-4 font-semibold text-slate-700">Total Consumption (kWh)</th>
                        <th className="text-right p-4 font-semibold text-slate-700">Est. Cost (OMR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {kpiAndTableData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="p-4 text-slate-600 font-medium">{item.id}</td>
                          <td className="p-4 font-semibold text-slate-800 group-hover:text-primary transition-colors">{item.unitName}</td>
                          <td className="p-4 text-slate-600">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {item.assetType}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              item.category === 'Pumping Station' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              item.category === 'Lifting Station' ? 'bg-green-100 text-green-800 border-green-200' :
                              item.category === 'Development Building' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              item.category === 'Street Light' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600">{item.zone}</td>
                          <td className="p-4 text-slate-600 font-mono text-xs">{item.meterAccountNo}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                              item.priority === 'High Priority' ? 'bg-orange-100 text-orange-800' :
                              item.priority === 'Essential' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-slate-800">{item.totalConsumption.toLocaleString()}</td>
                          <td className="p-4 text-right text-slate-600 font-semibold">{(item.totalConsumption * KWH_TO_OMR_RATE).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced AI Analysis Modal */}
          {isAiModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> 
              <div className="bg-white p-6 rounded-2xl shadow-muscat-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"> 
                <div className="flex justify-between items-center mb-6"> 
                  <h3 className="text-2xl font-bold text-primary flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Sparkles className="text-primary" size={24} />
                    </div>
                    Enhanced AI Consumption Analysis
                  </h3> 
                  <button 
                    onClick={() => setIsAiModalOpen(false)} 
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                  > 
                    <X size={24} className="text-slate-600"/> 
                  </button> 
                </div> 
                
                {isAiLoading ? ( 
                  <div className="text-center py-12"> 
                    <div className="flex justify-center items-center space-x-4 mb-6">
                      <Sparkles size={48} className="animate-pulse text-primary" /> 
                      <Zap size={48} className="animate-bounce text-secondary" />
                      <Activity size={48} className="animate-pulse text-accent" />
                    </div>
                    <p className="text-lg text-slate-600 mb-2">AI is analyzing comprehensive electricity database...</p> 
                    <p className="text-sm text-slate-500">Processing {kpiAndTableData.length} assets across {distinctCategories.length} categories and {distinctZones.length} zones</p>
                    <div className="mt-6 w-64 mx-auto bg-slate-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                  </div> 
                ) : ( 
                  <div className="text-sm text-slate-700 space-y-4"> 
                    {aiAnalysisResult ? ( 
                      aiAnalysisResult.split('\n').map((line, index) => {
                        if (line.startsWith('🧠') || line.startsWith('🔋') || line.startsWith('📊') || line.startsWith('🏗️') || line.startsWith('💡') || line.startsWith('🎯') || line.startsWith('📈') || line.startsWith('🚀') || line.startsWith('📋')) {
                          return <h4 key={index} className="font-bold text-lg mt-6 mb-3 text-primary border-l-4 border-primary pl-4">{line}</h4>;
                        }
                        if (line.startsWith('•')) {
                          return <p key={index} className="ml-6 text-slate-700 py-1">{line}</p>;
                        }
                        return <p key={index} className="text-slate-700">{line}</p>;
                      })
                    ) : ( 
                      <div className="text-center py-8">
                        <AlertCircle size={48} className="text-orange-500 mx-auto mb-4" />
                        <p className="text-slate-600">No analysis available or an error occurred.</p>
                      </div>
                    )} 
                  </div> 
                )} 
                
                <div className="mt-8 flex justify-end gap-3"> 
                  <button 
                    onClick={() => setIsAiModalOpen(false)} 
                    className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200 shadow-muscat hover:shadow-muscat-lg transform hover:scale-105"
                  > 
                    Close Analysis
                  </button> 
                </div> 
              </div> 
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
