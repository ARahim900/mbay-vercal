import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Label, Area } from 'recharts';
import { Search, Bell, ChevronDown, SlidersHorizontal, Share2, LayoutDashboard, BarChart2, List, Zap, TrendingUp, Users2, Power, DollarSign, Filter, Activity, Droplets, Combine, UserCheck, Columns, Sparkles, X, CalendarDays, Building, Menu, Moon, Sun, Download, Settings, AlertCircle, CheckCircle, Wifi, WifiOff, Eye, ChevronRight, Award, TrendingDown, Star, Crown, Medal, ExternalLink, Info, Maximize2 } from 'lucide-react';

// ===============================
// DESIGN SYSTEM & CONSTANTS
// ===============================

const OMR_PER_KWH = 0.025;

// Enhanced Muscat Bay Color Scheme - Fully Applied
const MUSCAT_COLORS = {
  primary: {
    DEFAULT: '#4E4456',
    50: '#F8F7F8',
    100: '#F1EEF2',
    200: '#E3DCE5',
    300: '#D5CAD8',
    400: '#B69BB5',
    500: '#4E4456',
    600: '#463D4D',
    700: '#3B3241',
    800: '#302833',
    900: '#251E26',
    light: '#7E708A',
    dark: '#3B3241',
  },
  secondary: {
    DEFAULT: '#A8D5E3',
    50: '#F0F9FB',
    100: '#E1F3F7',
    200: '#C3E7EF',
    300: '#A8D5E3',
    400: '#7BB3C7',
    500: '#5491AB',
    600: '#3D6F8F',
    700: '#2A4D73',
    800: '#1A2B57',
    900: '#0D093B',
    light: '#C3FBF4',
    dark: '#7BB3C7',
  },
  accent: {
    DEFAULT: '#BFA181',
    50: '#FDFCFA',
    100: '#F9F7F2',
    200: '#F2F0EA',
    300: '#E5E0D5',
    400: '#D1C7B0',
    500: '#BFA181',
    600: '#A68B5B',
    700: '#8D7540',
    800: '#745F28',
    900: '#5B4913',
    light: '#F2F0EA',
    dark: '#A68B5B',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    info: '#0A1828',
    error: '#EF4444',
  },
  // Chart colors - Muscat Bay themed
  chart: [
    '#4E4456', '#A8D5E3', '#BFA181', '#0A1828', '#5f5168', 
    '#C3FBF4', '#F2F0EA', '#10B981', '#EF4444', '#6A5ACD'
  ]
};

// ===============================
// ELECTRICITY DATA
// ===============================

const rawDataString = `Name,Type,Meter Account No.,Apr-24,May-24,Jun-24,Jul-24,Aug-24,Sep-24,Oct-24,Nov-24,Dec-24,Jan-25,Feb-25,Mar-25,Apr-26
Pumping Station 01,PS,R52330,1608,1940,1783,1874,1662,3822,6876,1629,1640,1903,2095,3032,3940
Pumping Station 03,PS,R52329,31,47,25,3,0,0,33,0,179,33,137,131,276.6
Pumping Station 04,PS,R52327,1200,1350,1180,1456,1234,2100,3456,919,921,245,870,646,985
Pumping Station 05,PS,R52325,2800,2650,2890,2340,2567,2980,3200,2599,1952,2069,2521,2601,3317
Lifting Station 02,LS,R52328,0,0,0,0,0,0,0,0,0,0,0,0,0
Lifting Station 03,LS,R52333,120,135,98,87,76,145,156,91,185,28,40,58,83
Lifting Station 04,LS,R52324,890,765,678,723,645,712,834,686,631,701,638,572,750
Lifting Station 05,LS,R52332,3200,3100,2980,2890,2756,3145,3289,2413,2643,2873,3665,3069,4201
Irrigation Tank 01,IT,R52326,1890,1675,1456,1598,1734,1823,1945,1432,1268,1689,2214,1718,1663
Irrigation Tank 02,IT,R52331,1200,1156,1089,1134,1076,1245,1345,974,1026,983,1124,1110,1830
Irrigation Tank 03,IT,R52323,345,398,456,378,398,445,523,269,417,840,1009,845,1205
Irrigation Tank 04,IT,R53195,278,245,189,234,198,267,298,212,213,40,233,235,447
Actuator DB 01,ADB,R53196,45,38,42,35,29,41,44,34,29,7,28,24,27
Actuator DB 02,ADB,R51900,289,267,234,198,176,245,278,232,161,33,134,139,211
Actuator DB 03,ADB,R51904,267,234,198,223,187,234,256,220,199,56,203,196,212
Actuator DB 04,ADB,R51901,198,234,167,189,156,201,223,172,173,186,161,227,253
Actuator DB 05,ADB,R51907,23,19,16,21,14,18,22,18,16,4,18,14,18
Actuator DB 06,ADB,R51909,56,52,48,51,44,49,53,49,44,47,45,38,47
Street Light FP 01,SL,R53197,4200,3890,3567,3445,3234,3567,3890,3593,3147,787,3228,2663,3230
Street Light FP 02,SL,R51906,2890,2567,2345,2456,2198,2345,2567,2361,2258,633,2298,1812,2153
Street Light FP 03,SL,R51905,2456,2234,2098,2156,1987,2098,2234,2060,1966,1868,1974,1562,1847
Street Light FP 04,SL,R51908,2234,1987,1345,1456,1234,1345,1987,2299,1389,325,1406,1401,2413
Street Light FP 05,SL,R51902,1987,1756,1456,1598,1345,1456,1756,1477,1121,449,2070,1870,3233
Beachwell,BW,R51903,28000,32000,35000,30000,28000,32000,35000,24383,37236,38168,18422,40,27749
Helipad,HP,R52334,0,0,0,0,0,0,0,0,0,0,0,0,0
Central Park,CP,R54672,12000,15000,18000,16000,14000,16000,18000,9604,19032,22819,19974,14190,13846
Guard House,GH,R53651,1456,1345,1234,1298,1156,1234,1345,1225,814,798,936,879,1467
Security Building,SB,R53649,6789,6234,5890,6123,5678,5890,6234,5702,5131,5559,5417,4504,5978
ROP Building,RB,R53648,4234,3890,3567,3745,3456,3567,3890,3581,2352,2090,2246,1939,3537
Apartment D44,APT,R53705,1678,1456,1234,1345,1189,1234,1456,1377,764,647,657,650,1306
Apartment D45,APT,R53665,1456,1298,1134,1245,1089,1134,1298,1252,841,670,556,608,1069
Apartment D46,APT,R53700,1789,1567,1345,1456,1298,1345,1567,1577,890,724,690,752,1292
Apartment D47,APT,R53690,1890,1678,1456,1567,1398,1456,1678,1774,1055,887,738,792,1545
Apartment D48,APT,R53666,1234,1089,945,1034,912,945,1089,1046,785,826,676,683,1092
Apartment D49,APT,R53715,1789,1567,1345,1456,1298,1345,1567,1608,1068,860,837,818,984
Apartment D50,APT,R53672,1345,1189,1034,1134,1001,1034,1189,1102,789,765,785,707,1331
Apartment D51,APT,R53657,1987,1756,1456,1598,1423,1456,1756,1855,710,661,682,642,904
Apartment D52,APT,R53699,2234,1987,1678,1834,1634,1678,1987,1986,1208,979,896,952,1651
Apartment D53,APT,R54782,1987,1756,1456,1598,1423,1456,1756,1764,968,693,732,760,1281
Apartment D54,APT,R54793,1890,1678,1456,1567,1398,1456,1678,1777,834,681,559,531,1042
Apartment D55,APT,R54804,1987,1756,1456,1598,1423,1456,1756,1828,1035,677,616,719,1417
Apartment D56,APT,R54815,1987,1756,1456,1598,1423,1456,1756,1805,937,683,731,765,1536
Apartment D57,APT,R54826,2456,2234,1987,2134,1901,1987,2234,2262,1332,990,846,795,1732
Apartment D58,APT,R54836,1678,1456,1234,1345,1189,1234,1456,1534,778,593,535,594,1415
Apartment D59,APT,R54847,1789,1567,1345,1456,1298,1345,1567,1634,998,628,582,697,1138
Apartment D60,APT,R54858,1456,1298,1134,1245,1089,1134,1298,1275,705,674,612,679,1069
Apartment D61,APT,R54869,1890,1678,1456,1567,1398,1456,1678,1734,977,767,800,719,1394
Apartment D62,APT,R53717,1789,1567,1345,1456,1298,1345,1567,1630,957,715,677,595,800
Apartment D74,APT,R53675,1456,1298,1134,1245,1089,1134,1298,1303,766,639,566,463,1079
Apartment D75,APT,R53668,1298,1134,987,1089,956,987,1134,1169,702,475,508,554,912
Village Square,VS,R56628,7890,6789,5890,6234,5567,5890,6789,6229,3695,3304,3335,3383,4415
Zone-3 Light FP-17,ZL,R54872,0,0,0,0,0,0,0,0,0,0,0,0,0
Zone-3 Light FP-21,ZL,R54873,56,48,42,47,39,42,48,40,48,13,57,47,55
Zone-3 Light FP-22,ZL,R54874,8,7,6,7,5,6,7,6,8,0,0,0,0
Bank Muscat,BM,MISSING_METER,189,156,134,148,123,134,156,148,72,59,98,88,163
CIF Kitchen,CK,MISSING_METER,18900,17800,16700,17234,15890,16700,17800,16742,15554,16788,16154,14971,18446`.trim();

const extractCategory = (unitName, type) => {
    if (!unitName && !type) return 'Other';
    
    switch(type) {
        case 'PS': return 'Pumping Station';
        case 'LS': return 'Lifting Station';
        case 'IT': return 'Irrigation Tank';
        case 'ADB': return 'Actuator DB';
        case 'SL': return 'Street Light';
        case 'BW': return 'Beachwell';
        case 'HP': return 'Helipad';
        case 'CP': return 'Central Park';
        case 'GH': return 'Guard House';
        case 'SB': return 'Security Building';
        case 'RB': return 'ROP Building';
        case 'APT': return 'Apartment';
        case 'VS': return 'Village Square';
        case 'ZL': return 'Zone Light';
        case 'BM': return 'Bank Muscat';
        case 'CK': return 'CIF Kitchen';
        default:
            const lowerUnitName = unitName?.toLowerCase() || '';
            if (lowerUnitName.includes('pumping station')) return 'Pumping Station';
            if (lowerUnitName.includes('lifting station')) return 'Lifting Station';
            if (lowerUnitName.includes('irrigation tank')) return 'Irrigation Tank';
            return 'Other';
    }
};

const parseData = (rawData) => {
  const lines = rawData.split('\n');
  const headerLine = lines[0].split(',').map(h => h.trim());
  const dataLines = lines.slice(1);
  const monthsHeader = headerLine.slice(3);

  return dataLines.map((line, index) => {
    const values = line.split(',');
    const unitName = values[0]?.trim() || 'N/A';
    const type = values[1]?.trim() || 'N/A';
    const entry = {
      id: index + 1,
      slNo: index + 1,
      zone: 'N/A',
      type: type,
      muscatBayNumber: 'N/A',
      unitName: unitName,
      category: extractCategory(unitName, type),
      meterAccountNo: values[2]?.trim() || 'N/A',
      consumption: {},
      totalConsumption: 0, 
    };
    
    let currentOverallTotal = 0;
    monthsHeader.forEach((month, i) => {
      const consumptionValue = parseFloat(values[3 + i]);
      entry.consumption[month] = isNaN(consumptionValue) ? 0 : consumptionValue;
      if (!isNaN(consumptionValue)) {
        currentOverallTotal += consumptionValue;
      }
    });
    entry.totalConsumption = parseFloat(currentOverallTotal.toFixed(2));
    return entry;
  });
};

const initialElectricityData = parseData(rawDataString);
const availableMonths = Object.keys(initialElectricityData[0].consumption);

// ===============================
// ENHANCED SHARED COMPONENTS
// ===============================

const MuscatSummaryCard = ({ title, value, icon, unit, trend, trendColor, iconBgColor, isLoading, className = "" }) => {
  const IconComponent = icon;
  return (
    <div className={`muscat-card p-6 group hover:shadow-muscat-lg transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 font-semibold text-sm leading-tight">{title}</h3>
        <div 
          className="p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg" 
          style={{backgroundColor: iconBgColor || MUSCAT_COLORS.primary.DEFAULT }}
        >
          <IconComponent size={20} />
        </div>
      </div>
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      ) : (
        <>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 tracking-tight">
            {value} <span className="text-base font-medium text-slate-500">{unit}</span>
          </p>
          {trend && <p className={`text-xs sm:text-sm font-medium ${trendColor}`}>{trend}</p>}
        </>
      )}
    </div>
  );
};

const MuscatChartWrapper = ({ title, children, subtitle, actions, className = "" }) => (
  <div className={`muscat-card p-6 hover:shadow-muscat-xl transition-all duration-300 ${className}`}>
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

const MuscatStyledSelect = ({ label, value, onChange, options, id, icon: Icon, disabled }) => {
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
            <div className="relative">
                <select 
                  id={id} 
                  value={value} 
                  onChange={onChange} 
                  disabled={disabled}
                  className="muscat-input appearance-none w-full pr-10 focus:ring-2 focus:ring-primary-light focus:border-primary-light disabled:opacity-50 disabled:cursor-not-allowed" 
                >
                    {options.map(option => ( <option key={option.value} value={option.value}>{option.label}</option> ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    {Icon ? <Icon size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>
        </div>
    );
};

// ===============================
// COMPLETELY REDESIGNED TOP CONSUMERS TABLE - OVERFLOW FIXED
// ===============================

const EnhancedTopConsumersTable = ({ data, selectedMonth }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('consumption');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const itemsPerPage = 8;

  // Sort and paginate data
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

  const getRankBadge = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    if (actualIndex === 0) return { icon: Crown, class: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white', label: '👑 Champion' };
    if (actualIndex === 1) return { icon: Medal, class: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white', label: '🥈 Runner-up' };
    if (actualIndex === 2) return { icon: Star, class: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white', label: '🥉 Third' };
    return { icon: null, class: 'bg-gradient-to-r from-slate-400 to-slate-600 text-white', label: `#${actualIndex + 1}` };
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'Pumping Station': 'bg-blue-50 text-blue-700 border-blue-200',
      'Lifting Station': 'bg-green-50 text-green-700 border-green-200', 
      'Apartment': 'bg-purple-50 text-purple-700 border-purple-200',
      'Street Light': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Beachwell': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'Central Park': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'CIF Kitchen': 'bg-orange-50 text-orange-700 border-orange-200',
      'Security Building': 'bg-red-50 text-red-700 border-red-200',
      'Village Square': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Irrigation Tank': 'bg-teal-50 text-teal-700 border-teal-200',
      'Actuator DB': 'bg-pink-50 text-pink-700 border-pink-200',
    };
    return badges[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {paginatedData.map((consumer, index) => {
        const actualIndex = (currentPage - 1) * itemsPerPage + index;
        const rank = getRankBadge(index);
        const IconComponent = rank.icon;
        
        return (
          <div key={actualIndex} className="muscat-card p-5 hover:shadow-muscat-lg transition-all duration-300 group">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${rank.class} shadow-lg`}>
                {actualIndex + 1}
                {IconComponent && <IconComponent size={12} className="ml-1" />}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadge(consumer.category)}`}>
                {consumer.category}
              </span>
            </div>

            {/* Unit Name */}
            <h4 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {consumer.name}
            </h4>

            {/* Consumption */}
            <div className="mb-3">
              <div className="text-2xl font-bold text-slate-800">
                {consumer.consumption.toLocaleString()}
                <span className="text-sm text-slate-500 font-normal ml-1">kWh</span>
              </div>
              <div className="text-sm text-slate-600">
                {(consumer.consumption * OMR_PER_KWH).toFixed(2)} OMR estimated cost
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Performance</span>
                <span>{((consumer.consumption / data[0].consumption) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, (consumer.consumption / data[0].consumption) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setExpandedRow(expandedRow === actualIndex ? null : actualIndex)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <Info size={14} />
                {expandedRow === actualIndex ? 'Hide Details' : 'View Details'}
              </button>
              <span className="text-xs text-slate-500">{rank.label}</span>
            </div>

            {/* Expanded Details */}
            {expandedRow === actualIndex && (
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Meter:</span>
                    <span className="font-medium text-slate-700 ml-1">{consumer.meterAccountNo || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Rank:</span>
                    <span className="font-medium text-slate-700 ml-1">#{actualIndex + 1}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const TableView = () => (
    <div className="bg-white rounded-xl shadow-muscat border border-slate-200 overflow-hidden">
      {/* COMPLETELY FIXED RESPONSIVE TABLE CONTAINER */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="sticky left-0 z-20 bg-slate-50 px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200 min-w-[80px]">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[200px]">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                    >
                      Unit Name
                      {sortBy === 'name' && (
                        <ChevronDown size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[140px]">
                    <button
                      onClick={() => handleSort('consumption')}
                      className="flex items-center gap-1 hover:text-slate-700 transition-colors ml-auto"
                    >
                      Consumption
                      {sortBy === 'consumption' && (
                        <ChevronDown size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">
                    Cost (OMR)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">
                    Performance
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {paginatedData.map((consumer, index) => {
                  const actualIndex = (currentPage - 1) * itemsPerPage + index;
                  const rank = getRankBadge(index);
                  const IconComponent = rank.icon;
                  const performancePercent = Math.min(100, (consumer.consumption / data[0].consumption) * 100);
                  
                  return (
                    <React.Fragment key={actualIndex}>
                      <tr className="hover:bg-slate-50 transition-colors group">
                        <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 px-4 py-4 border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${rank.class} shadow-sm`}>
                              {actualIndex + 1}
                            </div>
                            {IconComponent && <IconComponent size={14} className="text-yellow-500" />}
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {consumer.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Meter: {consumer.meterAccountNo || 'N/A'}
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadge(consumer.category)}`}>
                            {consumer.category}
                          </span>
                        </td>
                        
                        <td className="px-4 py-4 text-right">
                          <div className="font-bold text-slate-900 text-lg">
                            {consumer.consumption.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">kWh</div>
                        </td>
                        
                        <td className="px-4 py-4 text-right">
                          <div className="font-semibold text-slate-700">
                            {(consumer.consumption * OMR_PER_KWH).toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                                style={{ width: `${performancePercent}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-600 ml-2 min-w-[35px]">
                              {performancePercent.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => setExpandedRow(expandedRow === actualIndex ? null : actualIndex)}
                            className="p-2 rounded-lg hover:bg-primary-50 transition-colors text-slate-600 hover:text-primary-600"
                            title={expandedRow === actualIndex ? "Hide details" : "Show details"}
                          >
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform duration-200 ${expandedRow === actualIndex ? 'rotate-180' : ''}`} 
                            />
                          </button>
                        </td>
                      </tr>
                      
                      {/* Enhanced Expanded Row */}
                      {expandedRow === actualIndex && (
                        <tr className="bg-gradient-to-r from-primary-50 to-slate-50 border-l-4 border-primary-500">
                          <td colSpan="7" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide mb-2">
                                  <TrendingUp size={14} />
                                  Consumption Rank
                                </div>
                                <div className="text-sm font-medium text-slate-800">
                                  {rank.label} out of {data.length} units
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide mb-2">
                                  <Award size={14} />
                                  Performance Score
                                </div>
                                <div className="text-sm font-medium text-slate-800">
                                  {performancePercent.toFixed(1)}% of top consumer
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide mb-2">
                                  <CheckCircle size={14} />
                                  Status
                                </div>
                                <div className="text-sm font-medium text-slate-800">
                                  {consumer.consumption > 0 ? "✅ Active" : "⚠️ Inactive"}
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
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="muscat-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-xl text-white shadow-lg">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                Top Electricity Consumers
              </h3>
              <p className="text-slate-600">
                Performance ranking for {selectedMonth === "All Months" ? "overall period" : selectedMonth}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">{data.length}</div>
              <div className="text-xs text-slate-500">Total Units</div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'table' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <List size={16} />
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <LayoutDashboard size={16} />
                Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 font-medium">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('consumption')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortBy === 'consumption' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'
                }`}
              >
                Consumption {sortBy === 'consumption' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('name')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortBy === 'name' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'
                }`}
              >
                Name {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'table' ? <TableView /> : <CardView />}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600 flex items-center gap-2">
              <Users2 size={16} />
              <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} consumers</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all muscat-button-secondary text-slate-700"
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
                          ? 'bg-primary-500 text-white shadow-md' 
                          : 'border border-slate-300 hover:bg-white hover:shadow-sm text-slate-700'
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
                className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all muscat-button-secondary text-slate-700"
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
// MAIN ELECTRICITY SYSTEM MODULE - ENHANCED
// ===============================

export const EnhancedElectricitySystemModule = ({ isDarkMode }) => {
  const [activeSubSection, setActiveSubSection] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState("All Months"); 
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const distinctCategories = useMemo(() => 
    [...new Set(initialElectricityData.map(d => d.category))].sort(), 
  []);

  const filteredElectricityData = useMemo(() => {
    return initialElectricityData.filter(item => {
      const categoryMatch = selectedCategory === "All Categories" || item.category === selectedCategory;
      return categoryMatch; 
    });
  }, [selectedCategory]);

  const kpiAndTableData = useMemo(() => {
    if (selectedMonth === "All Months") {
        return filteredElectricityData.map(item => ({ ...item, }));
    }
    return filteredElectricityData.map(item => ({ ...item, totalConsumption: item.consumption[selectedMonth] || 0, }));
  }, [filteredElectricityData, selectedMonth]);

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
      meterAccountNo: d.meterAccountNo,
      monthlyDataFull: initialElectricityData.find(item => item.id === d.id)?.consumption || {} 
    }));
  }, [kpiAndTableData]);

  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiAnalysisResult("");
    
    setTimeout(() => {
      setAiAnalysisResult(`🧠 AI Analysis Results for ${selectedMonth === "All Months" ? "All Months" : selectedMonth}:

🔋 INFRASTRUCTURE ANALYSIS:
• All 4 Pumping Stations operational with consumption data
• Pumping Station 01 shows highest consumption (${initialElectricityData.find(item => item.unitName === 'Pumping Station 01')?.totalConsumption.toLocaleString()} kWh total)
• Beachwell shows major consumption variations - investigate for optimization
• Critical infrastructure accounts for ${kpiAndTableData.filter(d => d.category.includes('Station') || d.category.includes('Tank')).length} components

📊 CONSUMPTION BREAKDOWN:
• Total System: ${totalConsumptionKWh.toLocaleString()} kWh
• Estimated Cost: ${totalCostOMR.toLocaleString()} OMR
• Average per Unit: ${averageConsumptionPerUnit.toFixed(0)} kWh
• Active Meters: ${activeMeters}/${kpiAndTableData.length}

🏗️ CATEGORY INSIGHTS:
• ${distinctCategories.length} categories identified
• Apartments: ${kpiAndTableData.filter(d => d.category === 'Apartment').length} residential units
• Infrastructure: ${kpiAndTableData.filter(d => d.category.includes('Station') || d.category.includes('Tank')).length} critical systems

💡 KEY RECOMMENDATIONS:
• Monitor Beachwell consumption patterns for efficiency
• Implement load balancing across pumping stations  
• Track residential vs infrastructure consumption ratios
• Consider smart metering for enhanced monitoring`);
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
                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${ isActive ? 'muscat-button-primary' : 'text-primary-600 hover:bg-primary-50 hover:text-primary-700' }`}
                      > 
                        <tab.icon size={18} className={isActive ? 'text-white' : 'text-primary-600'} /> 
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
    const monthOptions = [{ value: "All Months", label: "All Months" }, ...availableMonths.map(m => ({ value: m, label: m }))];
    const categoryOptions = [{ value: "All Categories", label: "All Categories" }, ...distinctCategories.map(c => ({ value: c, label: c }))];
    
    return (
        <div className="muscat-card p-4 mb-6 print:hidden sticky top-[110px] md:top-[88px] z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <MuscatStyledSelect 
                  id="monthFilter" 
                  label="Filter by Month" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)} 
                  options={monthOptions} 
                  icon={CalendarDays}
                />
                <MuscatStyledSelect 
                  id="categoryFilter" 
                  label="Filter by Unit Category" 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  options={categoryOptions} 
                  icon={List}
                />
                <button 
                  onClick={() => { setSelectedMonth("All Months"); setSelectedCategory("All Categories"); }} 
                  className="muscat-button-primary flex items-center justify-center space-x-2 h-[46px] w-full lg:w-auto"
                > 
                  <Filter size={16}/> 
                  <span>Reset Filters</span> 
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ElectricitySubNav />
      
      {activeSubSection === 'Dashboard' && <FilterBar />}
      
      {activeSubSection === 'Dashboard' && (
        <>
          <div className="mb-6"> 
            <button 
              onClick={handleAiAnalysis} 
              className="muscat-button-primary flex items-center justify-center space-x-2 w-full sm:w-auto group"
              disabled={isAiLoading}
            > 
              <Sparkles size={18} className="group-hover:animate-pulse" /> 
              <span>{isAiLoading ? 'Analyzing...' : '✨ Analyze Consumption with AI'}</span> 
            </button> 
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MuscatSummaryCard 
              title="Total Consumption" 
              value={totalConsumptionKWh.toLocaleString(undefined, {maximumFractionDigits:0})} 
              unit="kWh" 
              icon={Zap} 
              trend={selectedMonth === "All Months" ? "Overall" : `For ${selectedMonth}`} 
              trendColor="text-slate-500 font-medium" 
              iconBgColor={MUSCAT_COLORS.primary.DEFAULT} 
            />
            <MuscatSummaryCard 
              title="Total Est. Cost" 
              value={totalCostOMR.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} 
              unit="OMR" 
              icon={DollarSign} 
              trend="Based on selection" 
              trendColor="text-slate-500 font-medium" 
              iconBgColor={MUSCAT_COLORS.status.success} 
            />
            <MuscatSummaryCard 
              title="Avg. Consumption/Unit" 
              value={averageConsumptionPerUnit.toLocaleString(undefined, {maximumFractionDigits:0})} 
              unit="kWh" 
              icon={BarChart2} 
              trend={selectedMonth === "All Months" ? "Overall" : `For ${selectedMonth}`} 
              trendColor="text-slate-500 font-medium" 
              iconBgColor={MUSCAT_COLORS.accent.DEFAULT} 
            />
            <MuscatSummaryCard 
              title="Active Meters" 
              value={activeMeters} 
              unit="units" 
              icon={Users2} 
              trend="In selection" 
              trendColor="text-slate-500 font-medium" 
              iconBgColor={MUSCAT_COLORS.secondary.DEFAULT} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3"> 
              <MuscatChartWrapper title="Consumption Trend (All Months)" subtitle={`For category: ${selectedCategory}`}> 
                <ResponsiveContainer width="100%" height="100%"> 
                  <LineChart data={monthlyTrendForAllMonths} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}> 
                    <defs> 
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1"> 
                        <stop offset="5%" stopColor={MUSCAT_COLORS.primary.DEFAULT} stopOpacity={0.8}/> 
                        <stop offset="95%" stopColor={MUSCAT_COLORS.primary.DEFAULT} stopOpacity={0}/> 
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
                    <Area type="monotone" dataKey="total" stroke={MUSCAT_COLORS.primary.DEFAULT} fillOpacity={1} fill="url(#colorTotal)" /> 
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke={MUSCAT_COLORS.primary.DEFAULT} 
                      strokeWidth={3} 
                      activeDot={{ r: 7, strokeWidth: 2, fill: MUSCAT_COLORS.primary.DEFAULT }} 
                      dot={{r:4, fill: MUSCAT_COLORS.primary.DEFAULT}} 
                      name="Total kWh" 
                    /> 
                  </LineChart> 
                </ResponsiveContainer> 
              </MuscatChartWrapper> 
            </div>
            <div className="lg:col-span-2"> 
              <MuscatChartWrapper title="Consumption by Category" subtitle={`For ${selectedMonth}`}> 
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
                          fill={MUSCAT_COLORS.chart[index % MUSCAT_COLORS.chart.length]} 
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
              </MuscatChartWrapper> 
            </div>
          </div>

          {/* COMPLETELY FIXED Top Consumers Table */}
          <EnhancedTopConsumersTable data={topConsumersChartData} selectedMonth={selectedMonth} />
        </>
      )}

      {/* Enhanced AI Analysis Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"> 
          <div className="muscat-card p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"> 
            <div className="flex justify-between items-center mb-6"> 
              <h3 className="text-2xl font-bold text-primary-600 flex items-center gap-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Sparkles className="text-primary-600" size={24} />
                </div>
                AI Consumption Analysis
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
                  <Sparkles size={48} className="animate-pulse text-primary-500" /> 
                  <Zap size={48} className="animate-bounce text-secondary-500" />
                  <Activity size={48} className="animate-pulse text-accent-500" />
                </div>
                <p className="text-lg text-slate-600 mb-2">AI is analyzing electricity consumption data...</p> 
                <p className="text-sm text-slate-500">Processing {kpiAndTableData.length} units across {distinctCategories.length} categories</p>
                <div className="mt-6 w-64 mx-auto bg-slate-200 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div> 
            ) : ( 
              <div className="text-sm text-slate-700 space-y-4"> 
                {aiAnalysisResult ? ( 
                  aiAnalysisResult.split('\n').map((line, index) => {
                    if (line.startsWith('🧠') || line.startsWith('🔋') || line.startsWith('📊') || line.startsWith('🏗️') || line.startsWith('💡')) {
                      return <h4 key={index} className="font-bold text-lg mt-6 mb-3 text-primary-600 border-l-4 border-primary-500 pl-4">{line}</h4>;
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
                className="muscat-button-primary"
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

export default EnhancedElectricitySystemModule;