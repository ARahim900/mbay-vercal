import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Label, Area } from 'recharts';
import { Search, Bell, ChevronDown, SlidersHorizontal, Share2, LayoutDashboard, BarChart2, List, Zap, TrendingUp, Users2, Power, DollarSign, Filter, Activity, Droplets, Combine, UserCheck, Columns, Sparkles, X, CalendarDays, Building, Menu, Moon, Sun, Download, Settings, AlertCircle, CheckCircle, Wifi, WifiOff, Eye, ChevronRight, Award, TrendingDown, Star, Crown, Medal, ArrowUpDown, ArrowUp, ArrowDown, MoreVertical, ExternalLink, Info, CheckSquare, MapPin, Layers, Target } from 'lucide-react';

// ===============================
// ENHANCED DATA IMPORT - USING COMPLETE DATABASE
// ===============================
import { 
  rawDataString,
  parseData,
  availableMonths,
  assetTypeOptions,
  categoryOptions,
  zoneOptions,
  priorityOptions,
  KWH_TO_OMR_RATE,
  getDataSummary,
  COLORS
} from './electricity-data-enhanced';

// ===============================
// DESIGN SYSTEM & CONSTANTS  
// ===============================

const OMR_PER_KWH = KWH_TO_OMR_RATE; // Use the rate from enhanced data (0.025)

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
// PARSE ENHANCED DATA - ALL 56 UNITS
// ===============================

const initialElectricityData = parseData(rawDataString);

// ===============================
// ENHANCED SHARED COMPONENTS
// ===============================

const SummaryCard = ({ title, value, icon, unit, trend, trendColor, iconBgColor, isLoading }) => {
  const IconComponent = icon;
  return (
    <div className="card-muscat group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-slate-500 font-semibold text-sm">{title}</h3>
        <div 
          className="p-3 rounded-full text-white shadow-muscat group-hover:scale-110 transition-transform duration-200 group-hover:animate-glow" 
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
  <div className={`card-muscat ${className}`}>
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
                  className="input-muscat appearance-none pr-10"
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
// ENHANCED TOP CONSUMERS TABLE - COMPLETELY FIXED OVERFLOW & PERFECT RESPONSIVE DESIGN
// ===============================

const TopConsumersTableUltimate = ({ data, selectedMonth }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('consumption');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showActions, setShowActions] = useState(null);
  const itemsPerPage = 8;

  // Sort data
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortBy === 'consumption') {
        return sortOrder === 'desc' ? b.consumption - a.consumption : a.consumption - b.consumption;
      }
      if (sortBy === 'name') {
        return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      }
      if (sortBy === 'category') {
        return sortOrder === 'desc' ? b.category.localeCompare(a.category) : a.category.localeCompare(b.category);
      }
      if (sortBy === 'zone') {
        return sortOrder === 'desc' ? b.zone.localeCompare(a.zone) : a.zone.localeCompare(b.zone);
      }
      if (sortBy === 'priority') {
        return sortOrder === 'desc' ? b.priority.localeCompare(a.priority) : a.priority.localeCompare(b.priority);
      }
      return 0;
    });
  }, [data, sortBy, sortOrder]);

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const getRankBadgeStyle = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    if (actualIndex === 0) return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg ring-4 ring-yellow-300/50';
    if (actualIndex === 1) return 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white shadow-lg ring-4 ring-slate-300/50';
    if (actualIndex === 2) return 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg ring-4 ring-orange-300/50';
    return 'bg-gradient-to-br from-primary via-primary-light to-primary-dark text-white shadow-muscat';
  };

  const getRankIcon = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    if (actualIndex === 0) return <Crown size={10} className="text-yellow-200" />;
    if (actualIndex === 1) return <Medal size={10} className="text-slate-200" />;
    if (actualIndex === 2) return <Star size={10} className="text-orange-200" />;
    return null;
  };

  const getCategoryBadgeStyle = (category) => {
    const styles = {
      'Pumping Station': 'badge-muscat-primary',
      'Lifting Station': 'bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium border border-success/20',
      'Development Building': 'bg-secondary/10 text-secondary-800 px-2 py-1 rounded-full text-xs font-medium border border-secondary/20',
      'Street Light': 'badge-muscat-warning',
      'Beachwell': 'bg-info/10 text-info px-2 py-1 rounded-full text-xs font-medium border border-info/20',
      'Central Park': 'badge-muscat-success',
      'Commercial/Retail': 'bg-accent/10 text-accent-700 px-2 py-1 rounded-full text-xs font-medium border border-accent/20',
      'Security Building': 'badge-muscat-error',
      'Village Square': 'bg-muscat-purple/10 text-muscat-purple px-2 py-1 rounded-full text-xs font-medium border border-muscat-purple/20',
      'Irrigation Tank': 'bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-200',
      'Actuator DB': 'bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium border border-purple-200',
      'Landscape Light (Zone 3)': 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium border border-green-200',
    };
    return styles[category] || 'bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium border border-slate-200';
  };

  const getZoneBadgeStyle = (zone) => {
    const styles = {
      'Zone 3': 'bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium',
      'Zone 8': 'bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium',
      'Infrastructure Zone': 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium',
      'Development Zone': 'bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium',
      'Central Zone': 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium',
      'Village Zone': 'bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium',
      'General Zone': 'bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium',
    };
    return styles[zone] || 'bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium';
  };

  const getPriorityBadgeStyle = (priority) => {
    const styles = {
      'Critical': 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold border border-red-300',
      'High Priority': 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium border border-orange-300',
      'Essential': 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium border border-yellow-300',
      'Standard': 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium border border-blue-300',
      'Low Priority': 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium border border-gray-300',
    };
    return styles[priority] || 'bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium border border-slate-200';
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown size={12} className="text-slate-400" />;
    return sortOrder === 'desc' ? <ArrowDown size={12} className="text-primary" /> : <ArrowUp size={12} className="text-primary" />;
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="table-muscat animate-slide-up">
      {/* Enhanced Header with Perfect Muscat Bay Branding */}
      <div className="table-muscat-header p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 md:gap-3">
              <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                <Award className="text-yellow-300 animate-bounce-subtle" size={20} />
              </div>
              <span className="text-white">Top Electricity Consumers</span>
            </h3>
            <p className="text-white/90 mt-1 text-xs md:text-sm">
              Performance ranking for {selectedMonth === "All Months" ? "overall period" : selectedMonth}
            </p>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <div className="text-right">
              <div className="text-lg md:text-2xl font-bold animate-glow">{data.length}</div>
              <div className="text-xs">Total Units</div>
            </div>
            <TrendingUp size={18} className="animate-float" />
          </div>
        </div>
      </div>

      {/* Enhanced Sort Controls - Fully Responsive */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 md:p-4 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <span className="text-xs md:text-sm text-slate-600 font-medium whitespace-nowrap">Sort by:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'consumption', label: 'Consumption' },
                { key: 'name', label: 'Name' },
                { key: 'category', label: 'Category' },
                { key: 'zone', label: 'Zone' },
                { key: 'priority', label: 'Priority' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`text-xs px-2.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
                    sortBy === key 
                      ? 'bg-primary text-white shadow-muscat transform scale-105' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:shadow-muscat'
                  }`}
                >
                  {label} {getSortIcon(key)}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-slate-500 bg-white px-2.5 py-1.5 rounded-full border border-slate-200 shadow-sm whitespace-nowrap">
            Page {currentPage} of {totalPages} • {data.length} total
          </div>
        </div>
      </div>

      {/* COMPLETELY RESPONSIVE TABLE - PROGRESSIVE LAYOUT */}
      <div className="overflow-hidden">
        
        {/* Extra Large Screens (1536px+) - Full Table with All Columns */}
        <div className="hidden 2xl:block">
          <div className="overflow-x-auto scrollbar-muscat">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-center p-3 font-semibold text-slate-700 w-16">Rank</th>
                  <th className="text-left p-3 font-semibold text-slate-700 min-w-[280px]">Unit Details</th>
                  <th className="text-left p-3 font-semibold text-slate-700 min-w-[120px]">Category</th>
                  <th className="text-left p-3 font-semibold text-slate-700 min-w-[100px]">Zone</th>
                  <th className="text-left p-3 font-semibold text-slate-700 min-w-[100px]">Priority</th>
                  <th className="text-right p-3 font-semibold text-slate-700 min-w-[140px]">Consumption</th>
                  <th className="text-right p-3 font-semibold text-slate-700 min-w-[120px]">Est. Cost</th>
                  <th className="text-center p-3 font-semibold text-slate-700 w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((consumer, index) => {
                  const actualIndex = (currentPage - 1) * itemsPerPage + index;
                  const isExpanded = expandedRow === actualIndex;
                  
                  return (
                    <React.Fragment key={actualIndex}>
                      <tr className="table-muscat-row">
                        <td className="table-muscat-cell text-center">
                          <div className="flex items-center justify-center">
                            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-full text-sm font-bold ${getRankBadgeStyle(index)} relative transform transition-transform hover:scale-110`}>
                              {actualIndex + 1}
                              {getRankIcon(index) && (
                                <div className="absolute -top-1 -right-1 animate-pulse">
                                  {getRankIcon(index)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="table-muscat-cell">
                          <div className="font-semibold text-slate-800 group-hover:text-primary transition-colors">
                            {consumer.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Zap size={10} className="text-primary" />
                            {consumer.assetType} • Meter: {consumer.meterAccountNo}
                          </div>
                        </td>
                        
                        <td className="table-muscat-cell">
                          <span className={getCategoryBadgeStyle(consumer.category)}>
                            {consumer.category}
                          </span>
                        </td>

                        <td className="table-muscat-cell">
                          <span className={getZoneBadgeStyle(consumer.zone)}>
                            {consumer.zone}
                          </span>
                        </td>

                        <td className="table-muscat-cell">
                          <span className={getPriorityBadgeStyle(consumer.priority)}>
                            {consumer.priority}
                          </span>
                        </td>
                        
                        <td className="table-muscat-cell text-right">
                          <div className="font-bold text-slate-800 text-lg">
                            {consumer.consumption.toLocaleString()}
                            <span className="text-xs text-slate-500 font-normal"> kWh</span>
                          </div>
                          {actualIndex > 0 && data.length > 0 && (
                            <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
                              <TrendingDown size={12} />
                              {((consumer.consumption / data[0].consumption) * 100).toFixed(1)}% of #1
                            </div>
                          )}
                        </td>
                        
                        <td className="table-muscat-cell text-right">
                          <div className="font-semibold text-slate-700">
                            {(consumer.consumption * OMR_PER_KWH).toFixed(2)}
                            <span className="text-xs text-slate-500 font-normal"> OMR</span>
                          </div>
                        </td>
                        
                        <td className="table-muscat-cell text-center">
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : actualIndex)}
                            className="p-2 rounded-full hover:bg-primary/10 transition-colors text-slate-600 hover:text-primary group"
                            title={isExpanded ? "Hide details" : "Show details"}
                          >
                            <ChevronRight 
                              size={14} 
                              className={`transition-transform duration-200 group-hover:scale-110 ${isExpanded ? 'rotate-90' : ''}`} 
                            />
                          </button>
                        </td>
                      </tr>
                      
                      {/* Enhanced Expanded Row */}
                      {isExpanded && (
                        <tr className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-l-4 border-primary animate-slide-up">
                          <td colSpan="8" className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                              {[
                                { icon: TrendingUp, title: "Asset Type", value: consumer.assetType, color: "primary" },
                                { icon: MapPin, title: "Zone Location", value: consumer.zone, color: "secondary" },
                                { icon: Target, title: "Priority Level", value: consumer.priority, color: "accent" },
                                { icon: CheckCircle, title: "Status", value: consumer.consumption > 0 ? "✅ Operational" : "⚠️ Inactive", color: "success" }
                              ].map((item, idx) => (
                                <div key={idx} className="card-muscat-interactive p-3">
                                  <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide mb-2">
                                    <item.icon size={12} className={`text-${item.color}`} />
                                    {item.title}
                                  </div>
                                  <div className="text-sm font-medium text-slate-800">
                                    {item.value}
                                  </div>
                                </div>
                              ))}
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

        {/* Large Screens (1024px-1535px) - Compact Table */}
        <div className="hidden xl:block 2xl:hidden">
          <div className="overflow-x-auto scrollbar-muscat">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-center p-2.5 font-semibold text-slate-700 text-xs w-14">Rank</th>
                  <th className="text-left p-2.5 font-semibold text-slate-700 text-xs min-w-[200px]">Unit Details</th>
                  <th className="text-left p-2.5 font-semibold text-slate-700 text-xs min-w-[100px]">Category</th>
                  <th className="text-left p-2.5 font-semibold text-slate-700 text-xs min-w-[80px]">Zone</th>
                  <th className="text-right p-2.5 font-semibold text-slate-700 text-xs min-w-[100px]">Consumption</th>
                  <th className="text-right p-2.5 font-semibold text-slate-700 text-xs min-w-[80px]">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((consumer, index) => {
                  const actualIndex = (currentPage - 1) * itemsPerPage + index;
                  
                  return (
                    <tr key={actualIndex} className="table-muscat-row">
                      <td className="table-muscat-cell text-center p-2.5">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${getRankBadgeStyle(index)} relative`}>
                          {actualIndex + 1}
                          {getRankIcon(index) && (
                            <div className="absolute -top-0.5 -right-0.5">
                              {getRankIcon(index)}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="table-muscat-cell p-2.5">
                        <div className="font-medium text-slate-800 text-sm">
                          {truncateText(consumer.name, 25)}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {consumer.assetType}
                        </div>
                      </td>
                      
                      <td className="table-muscat-cell p-2.5">
                        <span className={`${getCategoryBadgeStyle(consumer.category)} text-xs px-2 py-0.5`}>
                          {truncateText(consumer.category, 12)}
                        </span>
                      </td>

                      <td className="table-muscat-cell p-2.5">
                        <span className={`${getZoneBadgeStyle(consumer.zone)} text-xs px-1.5 py-0.5`}>
                          {truncateText(consumer.zone, 8)}
                        </span>
                      </td>
                      
                      <td className="table-muscat-cell text-right p-2.5">
                        <div className="font-bold text-slate-800 text-sm">
                          {consumer.consumption.toLocaleString()}
                          <span className="text-xs text-slate-500 font-normal"> kWh</span>
                        </div>
                      </td>
                      
                      <td className="table-muscat-cell text-right p-2.5">
                        <div className="font-medium text-slate-700 text-sm">
                          {(consumer.consumption * OMR_PER_KWH).toFixed(1)}
                          <span className="text-xs text-slate-500 font-normal"> OMR</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Medium Screens (768px-1023px) - Simplified Table */}
        <div className="hidden lg:block xl:hidden">
          <div className="overflow-x-auto scrollbar-muscat">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 font-semibold text-slate-700 text-sm min-w-[180px]">Unit</th>
                  <th className="text-left p-3 font-semibold text-slate-700 text-sm min-w-[100px]">Category</th>
                  <th className="text-right p-3 font-semibold text-slate-700 text-sm min-w-[120px]">kWh</th>
                  <th className="text-center p-3 font-semibold text-slate-700 text-sm w-16">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((consumer, index) => {
                  const actualIndex = (currentPage - 1) * itemsPerPage + index;
                  
                  return (
                    <tr key={actualIndex} className="table-muscat-row">
                      <td className="table-muscat-cell p-3">
                        <div className="font-medium text-slate-800">
                          {truncateText(consumer.name, 20)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span className={getZoneBadgeStyle(consumer.zone)}>
                            {consumer.zone}
                          </span>
                        </div>
                      </td>
                      
                      <td className="table-muscat-cell p-3">
                        <span className={getCategoryBadgeStyle(consumer.category)}>
                          {truncateText(consumer.category, 15)}
                        </span>
                      </td>
                      
                      <td className="table-muscat-cell text-right p-3">
                        <div className="font-bold text-slate-800">
                          {consumer.consumption.toLocaleString()}
                        </div>
                      </td>
                      
                      <td className="table-muscat-cell text-center p-3">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${getRankBadgeStyle(index)}`}>
                          {actualIndex + 1}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Small Screens and Mobile (0-1023px) - Enhanced Card Layout */}
        <div className="lg:hidden">
          <div className="space-y-3 p-3">
            {paginatedData.map((consumer, index) => {
              const actualIndex = (currentPage - 1) * itemsPerPage + index;
              
              return (
                <div key={actualIndex} className="card-muscat-interactive p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm truncate pr-2">
                        {consumer.name}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className={getCategoryBadgeStyle(consumer.category)}>
                          {consumer.category}
                        </span>
                        <span className={getZoneBadgeStyle(consumer.zone)}>
                          {consumer.zone}
                        </span>
                      </div>
                    </div>
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getRankBadgeStyle(index)} relative flex-shrink-0`}>
                      {actualIndex + 1}
                      {getRankIcon(index) && (
                        <div className="absolute -top-1 -right-1">
                          {getRankIcon(index)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                    <div>
                      <span className="text-slate-600 text-xs">Consumption:</span>
                      <div className="font-bold text-slate-800">
                        {consumer.consumption.toLocaleString()} <span className="text-xs font-normal">kWh</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-slate-600 text-xs">Est. Cost:</span>
                      <div className="font-semibold text-slate-700">
                        {(consumer.consumption * OMR_PER_KWH).toFixed(2)} <span className="text-xs">OMR</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className={getPriorityBadgeStyle(consumer.priority)}>
                      {consumer.priority}
                    </span>
                    <span className="text-slate-500">
                      {consumer.assetType} • {consumer.meterAccountNo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Pagination - Fully Responsive */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 md:p-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs md:text-sm text-slate-600 flex items-center gap-2 order-2 sm:order-1">
              <Users2 size={14} className="text-primary animate-pulse flex-shrink-0" />
              <span className="text-center sm:text-left">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-muscat-ghost text-xs px-2.5 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronDown size={12} className="rotate-90" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
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
                      className={`px-2 md:px-3 py-1.5 md:py-2 text-xs rounded-lg transition-all ${ 
                        currentPage === page 
                          ? 'bg-primary text-white shadow-muscat transform scale-105' 
                          : 'border border-slate-300 hover:bg-white hover:shadow-muscat text-slate-700'
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
                className="btn-muscat-ghost text-xs px-2.5 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronDown size={12} className="-rotate-90" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===============================
// MAIN ELECTRICITY SYSTEM MODULE - ENHANCED WITH COMPLETE DATABASE
// ===============================

export const ElectricitySystemModuleUltimate = ({ isDarkMode }) => {
  const [activeSubSection, setActiveSubSection] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState("All Months"); 
  const [selectedAssetType, setSelectedAssetType] = useState("All Types");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Get distinct values for filtering dropdowns
  const distinctCategories = useMemo(() => 
    [...new Set(initialElectricityData.map(d => d.category))].sort(), 
  []);

  const distinctZones = useMemo(() => 
    [...new Set(initialElectricityData.map(d => d.zone))].sort(), 
  []);

  const distinctAssetTypes = useMemo(() => 
    [...new Set(initialElectricityData.map(d => d.assetType))].sort(), 
  []);

  const distinctPriorities = useMemo(() => 
    [...new Set(initialElectricityData.map(d => d.priority))].sort(), 
  []);

  // Enhanced filtering with all 5 filter levels
  const filteredElectricityData = useMemo(() => {
    return initialElectricityData.filter(item => {
      const assetTypeMatch = selectedAssetType === "All Types" || item.assetType === selectedAssetType;
      const categoryMatch = selectedCategory === "All Categories" || item.category === selectedCategory;
      const zoneMatch = selectedZone === "All Zones" || item.zone === selectedZone;
      const priorityMatch = selectedPriority === "All Priorities" || item.priority === selectedPriority;
      
      return assetTypeMatch && categoryMatch && zoneMatch && priorityMatch; 
    });
  }, [selectedAssetType, selectedCategory, selectedZone, selectedPriority]);

  const kpiAndTableData = useMemo(() => {
    if (selectedMonth === "All Months") {
        return filteredElectricityData.map(item => ({ ...item, }));
    }
    return filteredElectricityData.map(item => ({ ...item, totalConsumption: item.consumption[selectedMonth] || 0, }));
  }, [filteredElectricityData, selectedMonth]);

  // Enhanced KPIs using the comprehensive database
  const totalConsumptionKWh = useMemo(() => kpiAndTableData.reduce((acc, curr) => acc + curr.totalConsumption, 0), [kpiAndTableData]);
  const totalCostOMR = useMemo(() => totalConsumptionKWh * OMR_PER_KWH, [totalConsumptionKWh]);
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
      zone: d.zone,
      priority: d.priority,
      assetType: d.assetType,
      meterAccountNo: d.meterAccountNo,
      monthlyDataFull: initialElectricityData.find(item => item.id === d.id)?.consumption || {} 
    }));
  }, [kpiAndTableData]);

  // Enhanced AI Analysis with comprehensive database insights
  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiAnalysisResult("");
    
    setTimeout(() => {
      const dataSummary = getDataSummary(kpiAndTableData);
      
      setAiAnalysisResult(`🧠 AI Analysis Results for ${selectedMonth === "All Months" ? "All Months" : selectedMonth}:

🔋 COMPREHENSIVE INFRASTRUCTURE ANALYSIS:
• Total Assets Analyzed: ${dataSummary.totalAssets} units across ${Object.keys(dataSummary.categoryBreakdown).length} categories
• Active Systems: ${dataSummary.activeAssets}/${dataSummary.totalAssets} units (${dataSummary.dataCompleteness.toFixed(1)}% operational)
• Time Coverage: ${dataSummary.timeframeCoverage} months of historical data
• Meter Coverage: ${dataSummary.meterCoverage}/${dataSummary.totalAssets} units with valid meter accounts

📊 CONSUMPTION & COST BREAKDOWN:
• Total System Consumption: ${dataSummary.totalConsumption.toLocaleString()} kWh
• Estimated Total Cost: ${dataSummary.totalCost.toLocaleString()} OMR
• Average per Unit: ${dataSummary.averageConsumption.toFixed(0)} kWh
• Cost per kWh: ${KWH_TO_OMR_RATE} OMR (as specified)

🏗️ CATEGORY PERFORMANCE ANALYSIS:
${Object.entries(dataSummary.categoryBreakdown).map(([category, data]) => 
  `• ${category}: ${data.count} units, ${data.consumption.toLocaleString()} kWh total`
).slice(0, 5).join('\n')}

🗺️ ZONE DISTRIBUTION INSIGHTS:
${Object.entries(dataSummary.zoneBreakdown).map(([zone, data]) => 
  `• ${zone}: ${data.count} units, ${data.consumption.toLocaleString()} kWh total`
).slice(0, 4).join('\n')}

⚡ PRIORITY LEVEL BREAKDOWN:
${Object.entries(dataSummary.priorityBreakdown).map(([priority, data]) => 
  `• ${priority}: ${data.count} units, ${data.consumption.toLocaleString()} kWh total`
).join('\n')}

💡 KEY RECOMMENDATIONS:
• Monitor Critical Infrastructure: ${dataSummary.priorityBreakdown['Critical']?.count || 0} critical systems require priority attention
• Optimize High Consumers: Focus on units >15,000 kWh for efficiency improvements
• Zone-based Analysis: ${Object.keys(dataSummary.zoneBreakdown).length} zones show varied consumption patterns
• Enhanced Monitoring: ${dataSummary.totalAssets - dataSummary.meterCoverage} units need meter verification
• Cost Optimization: Potential 10-15% savings through load balancing and efficiency measures`);
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
        <div className="mb-6 print:hidden flex justify-center animate-slide-up">
            <div className="bg-white shadow-muscat rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
                {subSections.map((tab) => {
                    const isActive = activeSubSection === tab.id;
                    return ( 
                      <button 
                        key={tab.id} 
                        onClick={() => setActiveSubSection(tab.id)} 
                        className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                          isActive 
                            ? 'bg-primary text-white shadow-muscat' 
                            : 'text-primary hover:bg-primary/10 hover:text-primary-dark'
                        }`}
                      > 
                        <tab.icon size={16} className={isActive ? 'text-white' : 'text-primary'} /> 
                        <span className="hidden sm:inline">{tab.name}</span> 
                      </button> 
                    );
                })}
            </div>
        </div>
    );
  };

  // Enhanced Filter Bar with all 5 filtering levels
  const FilterBar = () => {
    const monthOptions = [{ value: "All Months", label: "All Months" }, ...availableMonths.map(m => ({ value: m, label: m }))];
    
    return (
        <div className="bg-white shadow-muscat p-3 md:p-4 rounded-xl mb-6 print:hidden sticky top-[110px] md:top-[88px] z-10 border border-slate-200 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 items-end">
                <StyledSelect 
                  id="assetTypeFilter" 
                  label="Asset Type" 
                  value={selectedAssetType} 
                  onChange={(e) => setSelectedAssetType(e.target.value)} 
                  options={assetTypeOptions} 
                  icon={Layers}
                />
                <StyledSelect 
                  id="categoryFilter" 
                  label="Category" 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  options={categoryOptions} 
                  icon={List}
                />
                <StyledSelect 
                  id="zoneFilter" 
                  label="Zone" 
                  value={selectedZone} 
                  onChange={(e) => setSelectedZone(e.target.value)} 
                  options={zoneOptions} 
                  icon={MapPin}
                />
                <StyledSelect 
                  id="priorityFilter" 
                  label="Priority" 
                  value={selectedPriority} 
                  onChange={(e) => setSelectedPriority(e.target.value)} 
                  options={priorityOptions} 
                  icon={Target}
                />
                <StyledSelect 
                  id="monthFilter" 
                  label="Month" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)} 
                  options={monthOptions} 
                  icon={CalendarDays}
                />
                <button 
                  onClick={() => { 
                    setSelectedMonth("All Months"); 
                    setSelectedAssetType("All Types");
                    setSelectedCategory("All Categories"); 
                    setSelectedZone("All Zones");
                    setSelectedPriority("All Priorities");
                  }} 
                  className="btn-muscat-primary h-[46px] w-full text-xs md:text-sm flex items-center justify-center gap-2"
                > 
                  <Filter size={14}/> 
                  <span className="hidden sm:inline">Reset Filters</span>
                  <span className="sm:hidden">Reset</span>
                </button>
            </div>
            
            {/* Filter Summary */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-medium">Active Filters:</span>
                {selectedAssetType !== "All Types" && (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                    {selectedAssetType}
                  </span>
                )}
                {selectedCategory !== "All Categories" && (
                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full border border-secondary/20">
                    {selectedCategory}
                  </span>
                )}
                {selectedZone !== "All Zones" && (
                  <span className="bg-accent/10 text-accent px-2 py-1 rounded-full border border-accent/20">
                    {selectedZone}
                  </span>
                )}
                {selectedPriority !== "All Priorities" && (
                  <span className="bg-success/10 text-success px-2 py-1 rounded-full border border-success/20">
                    {selectedPriority}
                  </span>
                )}
                {selectedMonth !== "All Months" && (
                  <span className="bg-info/10 text-info px-2 py-1 rounded-full border border-info/20">
                    {selectedMonth}
                  </span>
                )}
                <span className="text-slate-500">
                  • {kpiAndTableData.length} units match filters
                </span>
              </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <ElectricitySubNav />
      
      {activeSubSection === 'Dashboard' && <FilterBar />}
      
      {activeSubSection === 'Dashboard' && (
        <>
          <div className="mb-4 md:mb-6 animate-slide-up"> 
            <button 
              onClick={handleAiAnalysis} 
              className="btn-muscat-primary w-full sm:w-auto group text-sm md:text-base"
              disabled={isAiLoading}
            > 
              <Sparkles size={16} className="group-hover:animate-pulse" /> 
              <span>{isAiLoading ? 'Analyzing...' : '✨ Analyze Consumption with AI'}</span> 
            </button> 
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-slide-up">
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
              unit={`of ${kpiAndTableData.length}`} 
              icon={Users2} 
              trend="In selection" 
              trendColor="text-slate-500 font-medium" 
              iconBgColor={UI_COLORS.secondary} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 animate-slide-up">
            <div className="lg:col-span-3"> 
              <ChartWrapper title="Consumption Trend (14 Months)" subtitle={`${selectedCategory} • ${selectedZone} • ${selectedPriority}`}> 
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
                        boxShadow: '0 10px 15px -3px rgba(78, 68, 86, 0.1)'
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
              <ChartWrapper title="Consumption by Category" subtitle={`For ${selectedMonth}`}> 
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
                        boxShadow: '0 10px 15px -3px rgba(78, 68, 86, 0.1)'
                      }}
                    /> 
                    <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: '15px', fontSize: '11px'}}/> 
                  </PieChart> 
                </ResponsiveContainer> 
              </ChartWrapper> 
            </div>
          </div>

          {/* ENHANCED TOP CONSUMERS TABLE WITH ALL DATABASE INFORMATION */}
          <div className="animate-slide-up">
            <TopConsumersTableUltimate data={topConsumersChartData} selectedMonth={selectedMonth} />
          </div>
        </>
      )}

      {/* Enhanced AI Analysis Modal */}
      {isAiModalOpen && (
        <div className="modal-muscat-overlay animate-fade-in"> 
          <div className="modal-muscat-container max-w-4xl"> 
            <div className="flex justify-between items-center mb-6"> 
              <h3 className="text-xl md:text-2xl font-bold text-primary flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Sparkles className="text-primary animate-pulse" size={20} />
                </div>
                AI Consumption Analysis
              </h3> 
              <button 
                onClick={() => setIsAiModalOpen(false)} 
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              > 
                <X size={20} className="text-slate-600"/> 
              </button> 
            </div> 
            
            {isAiLoading ? ( 
              <div className="text-center py-8 md:py-12"> 
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <Sparkles size={40} className="animate-pulse text-primary" /> 
                  <Zap size={40} className="animate-bounce text-secondary" />
                  <Activity size={40} className="animate-pulse text-accent" />
                </div>
                <p className="text-base md:text-lg text-slate-600 mb-2">AI is analyzing electricity consumption data...</p> 
                <p className="text-sm text-slate-500">Processing {kpiAndTableData.length} units across {distinctCategories.length} categories</p>
                <div className="mt-6 w-48 md:w-64 mx-auto bg-slate-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div> 
            ) : ( 
              <div className="text-sm text-slate-700 space-y-4 max-h-96 overflow-y-auto scrollbar-muscat"> 
                {aiAnalysisResult ? ( 
                  aiAnalysisResult.split('\n').map((line, index) => {
                    if (line.startsWith('🧠') || line.startsWith('🔋') || line.startsWith('📊') || line.startsWith('🏗️') || line.startsWith('🗺️') || line.startsWith('⚡') || line.startsWith('💡')) {
                      return <h4 key={index} className="font-bold text-base md:text-lg mt-6 mb-3 text-primary border-l-4 border-primary pl-4">{line}</h4>;
                    }
                    if (line.startsWith('•')) {
                      return <p key={index} className="ml-6 text-slate-700 py-1">{line}</p>;
                    }
                    return <p key={index} className="text-slate-700">{line}</p>;
                  })
                ) : ( 
                  <div className="text-center py-8">
                    <AlertCircle size={40} className="text-orange-500 mx-auto mb-4" />
                    <p className="text-slate-600">No analysis available or an error occurred.</p>
                  </div>
                )} 
              </div> 
            )} 
            
            <div className="mt-6 md:mt-8 flex justify-end gap-3"> 
              <button 
                onClick={() => setIsAiModalOpen(false)} 
                className="btn-muscat-primary"
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