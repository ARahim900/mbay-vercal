import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Label, Area } from 'recharts';
import { Search, Bell, ChevronDown, SlidersHorizontal, Share2, LayoutDashboard, BarChart2, List, Zap, TrendingUp, Users2, Power, DollarSign, Filter, Activity, Droplets, Combine, UserCheck, Columns, Sparkles, X, CalendarDays, Building, Menu, Moon, Sun, Download, Settings, AlertCircle, CheckCircle, Wifi, WifiOff, Eye, ChevronRight, Award, TrendingDown } from 'lucide-react';

// ===============================
// DESIGN SYSTEM & CONSTANTS
// ===============================

const OMR_PER_KWH = 0.025;

// Enhanced Muscat Bay Color Scheme - Using Tailwind Classes
const COLORS = {
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

const SummaryCard = ({ title, value, icon, unit, trend, trendColor, iconBgColor, isLoading }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-100 group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-slate-500 font-semibold text-sm">{title}</h3>
        <div 
          className="p-3 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-200" 
          style={{backgroundColor: iconBgColor || COLORS.primary }}
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
  <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100 ${className}`}>
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
                  className="appearance-none w-full p-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light focus:outline-none bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
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
        borderTopColor: COLORS.primary
      }}
    ></div>
  </div>
);

// Enhanced Top Consumers Table Component
const TopConsumersTable = ({ data, selectedMonth }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Reduced for better UI

  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getRankBadgeColor = (index) => {
    if (index === 0) return 'bg-yellow-500 text-white'; // Gold
    if (index === 1) return 'bg-gray-400 text-white';   // Silver
    if (index === 2) return 'bg-orange-600 text-white'; // Bronze
    return 'bg-slate-400 text-white';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Pumping Station': 'bg-blue-100 text-blue-800',
      'Lifting Station': 'bg-green-100 text-green-800', 
      'Apartment': 'bg-purple-100 text-purple-800',
      'Street Light': 'bg-yellow-100 text-yellow-800',
      'Beachwell': 'bg-cyan-100 text-cyan-800',
      'Central Park': 'bg-emerald-100 text-emerald-800',
      'CIF Kitchen': 'bg-orange-100 text-orange-800',
      'Security Building': 'bg-red-100 text-red-800',
      'Village Square': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <Award className="text-yellow-500" size={24} />
              Top Electricity Consumers
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Highest consumption for {selectedMonth === "All Months" ? "overall period" : selectedMonth}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <TrendingUp size={16} />
            <span>{data.length} total units</span>
          </div>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-700 min-w-[80px]">Rank</th>
              <th className="text-left p-4 font-semibold text-slate-700 min-w-[200px]">Unit Name</th>
              <th className="text-left p-4 font-semibold text-slate-700 min-w-[120px]">Category</th>
              <th className="text-right p-4 font-semibold text-slate-700 min-w-[120px]">Consumption</th>
              <th className="text-right p-4 font-semibold text-slate-700 min-w-[100px]">Est. Cost</th>
              <th className="text-center p-4 font-semibold text-slate-700 min-w-[80px]">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((consumer, index) => {
              const actualIndex = (currentPage - 1) * itemsPerPage + index;
              const isExpanded = expandedRow === actualIndex;
              
              return (
                <React.Fragment key={actualIndex}>
                  <tr className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadgeColor(actualIndex)}`}>
                          {actualIndex + 1}
                        </span>
                        {actualIndex < 3 && <Award size={16} className="text-yellow-500" />}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="font-medium text-slate-800 group-hover:text-primary transition-colors">
                        {consumer.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ID: {actualIndex + 1}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(consumer.category)}`}>
                        {consumer.category}
                      </span>
                    </td>
                    
                    <td className="p-4 text-right">
                      <div className="font-semibold text-slate-800">
                        {consumer.consumption.toLocaleString()} <span className="text-xs text-slate-500">kWh</span>
                      </div>
                      {actualIndex > 0 && (
                        <div className="text-xs text-slate-500">
                          {((consumer.consumption / data[0].consumption) * 100).toFixed(1)}% of top
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4 text-right">
                      <div className="font-medium text-slate-700">
                        {(consumer.consumption * OMR_PER_KWH).toFixed(2)} <span className="text-xs text-slate-500">OMR</span>
                      </div>
                    </td>
                    
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setExpandedRow(isExpanded ? null : actualIndex)}
                        className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-600 hover:text-primary"
                        title={isExpanded ? "Hide details" : "Show details"}
                      >
                        <ChevronRight 
                          size={16} 
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
                        />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Details */}
                  {isExpanded && (
                    <tr className="bg-slate-50">
                      <td colSpan="6" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white p-3 rounded-lg border">
                            <div className="text-xs text-slate-500 uppercase tracking-wide">Monthly Trend</div>
                            <div className="text-sm font-medium text-slate-800 mt-1">
                              {selectedMonth !== "All Months" ? "See all data view" : "Varies by month"}
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded-lg border">
                            <div className="text-xs text-slate-500 uppercase tracking-wide">Efficiency</div>
                            <div className="text-sm font-medium text-slate-800 mt-1">
                              {consumer.consumption > 1000 ? "High consumer" : 
                               consumer.consumption > 500 ? "Medium consumer" : "Low consumer"}
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded-lg border">
                            <div className="text-xs text-slate-500 uppercase tracking-wide">Rank Status</div>
                            <div className="text-sm font-medium text-slate-800 mt-1">
                              {actualIndex === 0 ? "🥇 Highest" :
                               actualIndex === 1 ? "🥈 Second" :
                               actualIndex === 2 ? "🥉 Third" : `#${actualIndex + 1}`}
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded-lg border">
                            <div className="text-xs text-slate-500 uppercase tracking-wide">Performance</div>
                            <div className="text-sm font-medium text-slate-800 mt-1">
                              {consumer.consumption > data[data.length - 1].consumption * 10 ? "🔴 Monitor" : "✅ Normal"}
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

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} consumers
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currentPage === page 
                        ? 'bg-primary text-white' 
                        : 'border border-slate-300 hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
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
            <div className="bg-white shadow-md rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
                {subSections.map((tab) => {
                    const isActive = activeSubSection === tab.id;
                    return ( 
                      <button 
                        key={tab.id} 
                        onClick={() => setActiveSubSection(tab.id)} 
                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                          isActive 
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-primary hover:bg-primary-light hover:text-white'
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

  // Filter Bar
  const FilterBar = () => {
    const monthOptions = [{ value: "All Months", label: "All Months" }, ...availableMonths.map(m => ({ value: m, label: m }))];
    const categoryOptions = [{ value: "All Categories", label: "All Categories" }, ...distinctCategories.map(c => ({ value: c, label: c }))];
    
    return (
        <div className="bg-white shadow-md p-4 rounded-xl mb-6 print:hidden sticky top-[110px] md:top-[88px] z-10 border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
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
                  label="Filter by Unit Category" 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  options={categoryOptions} 
                  icon={List}
                />
                <button 
                  onClick={() => { setSelectedMonth("All Months"); setSelectedCategory("All Categories"); }} 
                  className="bg-primary-dark hover:bg-primary text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 h-[46px] w-full lg:w-auto hover:shadow-lg"
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
              className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white py-2.5 px-5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all w-full sm:w-auto group"
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
              iconBgColor={COLORS.primary} 
            />
            <SummaryCard 
              title="Total Est. Cost" 
              value={totalCostOMR.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} 
              unit="OMR" 
              icon={DollarSign} 
              trend="Based on selection" 
              trendColor="text-slate-500 font-medium" 
              iconBgColor={COLORS.success} 
            />
            <SummaryCard 
              title="Avg. Consumption/Unit" 
              value={averageConsumptionPerUnit.toLocaleString(undefined, {maximumFractionDigits:0})} 
              unit="kWh" 
              icon={BarChart2} 
              trend={selectedMonth === "All Months" ? "Overall" : `For ${selectedMonth}`} 
              trendColor="text-slate-500 font-medium" 
              iconBgColor={COLORS.accent} 
            />
            <SummaryCard 
              title="Active Meters" 
              value={activeMeters} 
              unit="units" 
              icon={Users2} 
              trend="In selection" 
              trendColor="text-slate-500 font-medium" 
              iconBgColor={COLORS.secondary} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3"> 
              <ChartWrapper title="Consumption Trend (All Months)" subtitle={`For category: ${selectedCategory}`}> 
                <ResponsiveContainer width="100%" height="100%"> 
                  <LineChart data={monthlyTrendForAllMonths} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}> 
                    <defs> 
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1"> 
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/> 
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/> 
                      </linearGradient> 
                    </defs> 
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /> 
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} /> 
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} /> 
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        borderColor: '#e2e8f0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }} 
                      itemStyle={{color: '#334155'}} 
                      labelStyle={{color: '#0f172a', fontWeight: 'bold'}}
                    /> 
                    <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/> 
                    <Area type="monotone" dataKey="total" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorTotal)" /> 
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke={COLORS.primary} 
                      strokeWidth={3} 
                      activeDot={{ r: 7, strokeWidth: 2, fill: COLORS.primary }} 
                      dot={{r:4, fill: COLORS.primary}} 
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
                          fill={COLORS.chart[index % COLORS.chart.length]} 
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
                        borderRadius: '8px', 
                        borderColor: '#e2e8f0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    /> 
                    <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: '15px'}}/> 
                  </PieChart> 
                </ResponsiveContainer> 
              </ChartWrapper> 
            </div>
          </div>

          {/* Enhanced Top Consumers Table - Fixed Overflow Issue */}
          <TopConsumersTable data={topConsumersChartData} selectedMonth={selectedMonth} />

          {/* Category Summary */}
          <ChartWrapper title="Category Summary" subtitle={`Consumption breakdown by category for ${selectedMonth === "All Months" ? "all data" : selectedMonth}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto">
              {distinctCategories.map((category, index) => {
                const categoryData = kpiAndTableData.filter(item => item.category === category);
                const totalCategoryConsumption = categoryData.reduce((acc, curr) => acc + curr.totalConsumption, 0);
                const categoryCount = categoryData.length;
                
                return (
                  <div key={category} className="bg-slate-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-slate-700 mb-2 truncate">{category}</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600">Units: {categoryCount}</p>
                      <p className="text-lg font-bold text-slate-800">{totalCategoryConsumption.toLocaleString()} kWh</p>
                      <p className="text-xs text-slate-500">Avg: {categoryCount > 0 ? (totalCategoryConsumption / categoryCount).toFixed(0) : 0} kWh/unit</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartWrapper>
        </>
      )}

      {/* Unit Details Section - Enhanced */}
      {activeSubSection === 'UnitDetails' && (
        <div className="space-y-6">
          <div className="bg-white shadow-lg p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">All Electricity Units</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700">ID</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Unit Name</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Type</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Category</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Meter Account</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Total Consumption (kWh)</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Est. Cost (OMR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kpiAndTableData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-slate-600">{item.id}</td>
                      <td className="p-3 font-medium text-slate-800">{item.unitName}</td>
                      <td className="p-3 text-slate-600">{item.type}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.category === 'Pumping Station' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'Lifting Station' ? 'bg-green-100 text-green-800' :
                          item.category === 'Apartment' ? 'bg-purple-100 text-purple-800' :
                          item.category === 'Street Light' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{item.meterAccountNo}</td>
                      <td className="p-3 text-right font-semibold text-slate-800">{item.totalConsumption.toLocaleString()}</td>
                      <td className="p-3 text-right text-slate-600">{(item.totalConsumption * OMR_PER_KWH).toFixed(2)}</td>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"> 
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"> 
            <div className="flex justify-between items-center mb-4"> 
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                <Sparkles className="text-primary" size={24} />
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
              <div className="text-center py-8"> 
                <div className="flex justify-center items-center space-x-3 mb-4">
                  <Sparkles size={48} className="animate-pulse text-primary" /> 
                  <Zap size={48} className="animate-bounce text-secondary" />
                </div>
                <p className="mt-2 text-slate-600">AI is analyzing electricity consumption data...</p> 
                <p className="text-sm text-slate-500 mt-1">Please wait while we process your request</p>
              </div> 
            ) : ( 
              <div className="text-sm text-slate-700 space-y-3 whitespace-pre-wrap"> 
                {aiAnalysisResult ? ( 
                  aiAnalysisResult.split('\n').map((line, index) => {
                    if (line.startsWith('🧠') || line.startsWith('🔋') || line.startsWith('📊') || line.startsWith('🏗️') || line.startsWith('💡')) {
                      return <h4 key={index} className="font-bold text-lg mt-4 mb-2 text-primary">{line}</h4>;
                    }
                    if (line.startsWith('•')) {
                      return <p key={index} className="ml-4 text-slate-700">{line}</p>;
                    }
                    return <p key={index} className="text-slate-700">{line}</p>;
                  })
                ) : ( 
                  <p>No analysis available or an error occurred.</p> 
                )} 
              </div> 
            )} 
            
            <div className="mt-6 text-right"> 
              <button 
                onClick={() => setIsAiModalOpen(false)} 
                className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
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
