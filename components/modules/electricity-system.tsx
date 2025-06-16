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
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAssetType, setSelectedAssetType] = useState("All Types");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Use the enhanced electricity data with comprehensive 56-asset database
  const initialElectricityData = useMemo(() => parseData(rawDataString), []);
  const dataSummary = useMemo(() => getDataSummary(initialElectricityData), [initialElectricityData]);

  // Enhanced filtering with multiple criteria
  const filteredElectricityData = useMemo(() => {
    return initialElectricityData.filter(item => {
      const categoryMatch = selectedCategory === "All Categories" || item.category === selectedCategory;
      const assetTypeMatch = selectedAssetType === "All Types" || item.assetType === selectedAssetType;
      const zoneMatch = selectedZone === "All Zones" || item.zone === selectedZone;
      return categoryMatch && assetTypeMatch && zoneMatch; 
    });
  }, [initialElectricityData, selectedCategory, selectedAssetType, selectedZone]);

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

  // Enhanced Filter Bar with comprehensive filtering options
  const FilterBar = () => {
    const monthOptions = [{ value: "All Months", label: "All Months" }, ...availableMonths.map(m => ({ value: m, label: m }))];
    const categoryFilterOptions = [{ value: "All Categories", label: "All Categories" }, ...distinctCategories.map(c => ({ value: c, label: c }))];
    const assetTypeFilterOptions = [{ value: "All Types", label: "All Asset Types" }, ...distinctAssetTypes.map(a => ({ value: a, label: a }))];
    const zoneFilterOptions = [{ value: "All Zones", label: "All Zones" }, ...distinctZones.map(z => ({ value: z, label: z }))];
    
    return (
        <div className="bg-white shadow-lg border-b border-slate-200 mb-6 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <StyledSelect 
                      id="monthFilter" 
                      label="Filter by Month" 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(e.target.value)} 
                      options={monthOptions} 
                      icon={CalendarDays}
                    />
                    <StyledSelect 
                      id="categoryFilter" 
                      label="Filter by Category" 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)} 
                      options={categoryFilterOptions} 
                      icon={List}
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
                        setSelectedCategory("All Categories"); 
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
                  {selectedCategory !== "All Categories" && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      🏷️ {selectedCategory}
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
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200"> 
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">🔋 Enhanced Electricity System - Complete Database</h2>
                    <p className="text-slate-600 mb-4">
                      Now featuring <strong>{initialElectricityData.length} assets</strong> with <strong>{availableMonths.length} months</strong> of historical data 
                      (Apr-24 to May-25) • Advanced filtering by asset type, category, and zone
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        🏗️ {distinctAssetTypes.length} Asset Types: PS, LS, IRR, DB, D_Building, etc.
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        🏷️ {distinctCategories.length} Categories: Complete classification
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        📍 {distinctZones.length} Zones: Infrastructure, Development, Zone 3, etc.
                      </span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        💰 Rate: {KWH_TO_OMR_RATE} OMR/kWh
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAiModalOpen(true)} 
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-3 px-6 rounded-xl text-sm font-semibold shadow-muscat hover:shadow-muscat-lg transition-all duration-300 group transform hover:scale-105"
                    disabled={isAiLoading}
                  > 
                    <Sparkles size={18} className="group-hover:animate-pulse" /> 
                    <span>✨ AI Analysis</span> 
                  </button>
                </div>
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
                  <ChartWrapper title="Consumption Trend (14 Months)" subtitle={`Complete data coverage: Apr-24 to May-25 • Filters: ${selectedCategory}, ${selectedAssetType}, ${selectedZone}`}> 
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

          {/* Unit Details Section */}
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
        </div>
      </div>
    </div>
  );
};
