'use client';

import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Droplets, Activity, CheckCircle, AlertCircle, Building, Filter, CalendarDays, 
  TrendingUp, Users2, Gauge, FlaskConical, Waves
} from 'lucide-react';
import { 
  GlassChart, GlassSummaryCard, GlassDropdown, GlassButton, GlassCard, GlassFilterBar
} from '@/components/glassmorphism';
import { COLORS } from '@/constants/colors';

interface WaterAnalysisModuleProps {
  isCollapsed?: boolean; // Pass this from parent component that knows sidebar state
}

// Enhanced Gauge Chart Component for Water Analysis
const GaugeChart: React.FC<{
  value: number;
  maxValue: number;
  title: string;
  subtitle: string;
  gaugeType: 'zoneBulk' | 'individual' | 'loss';
  size?: number;
}> = ({ value, maxValue, title, subtitle, gaugeType, size = 140 }) => {
  
  // Calculate percentage and angle
  const percentage = Math.min((value / maxValue) * 100, 100);
  const angle = (percentage / 100) * 180; // Half circle (180 degrees)
  
  // Color coding based on gauge type
  const getGaugeColor = () => {
    switch (gaugeType) {
      case 'zoneBulk':
        return '#3B82F6'; // Blue for Zone Bulk
      case 'individual':
        return '#10B981'; // Green for Individual Consumption
      case 'loss':
        // Dynamic color for loss based on percentage
        if (percentage <= 5) return '#10B981'; // Green - Good
        if (percentage <= 15) return '#F59E0B'; // Orange - Warning  
        return '#EF4444'; // Red - Critical
      default:
        return '#6B7280';
    }
  };

  const gaugeColor = getGaugeColor();
  const center = size / 2;
  const radius = size * 0.35;
  const strokeWidth = size * 0.1;

  // Create arc path
  const createArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
      <div className="relative">
        <svg width={size} height={size * 0.7} className="transform -rotate-0">
          {/* Background arc */}
          <path
            d={createArcPath(0, 180)}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={createArcPath(0, angle)}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Center value text */}
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            className="text-lg font-bold fill-gray-800"
          >
            {gaugeType === 'loss' ? `${percentage.toFixed(1)}%` : value.toLocaleString()}
          </text>
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {gaugeType === 'loss' ? 'Loss Rate' : 'm³'}
          </text>
        </svg>
      </div>
      
      <div className="text-center mt-2">
        <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
        <p className="text-xs text-gray-600">{subtitle}</p>
        {gaugeType !== 'loss' && (
          <p className="text-xs text-gray-500 mt-1">
            Max: {maxValue.toLocaleString()} m³
          </p>
        )}
      </div>
    </div>
  );
};

// Three Gauge Set Component
const ThreeGaugeSet: React.FC<{
  zoneBulk: number;
  individualTotal: number;
  maxZoneBulk: number;
  maxIndividual: number;
  lossPercentage: number;
  title: string;
}> = ({ zoneBulk, individualTotal, maxZoneBulk, maxIndividual, lossPercentage, title }) => {
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GaugeChart
          value={zoneBulk}
          maxValue={maxZoneBulk}
          title="Zone Bulk"
          subtitle="Total Supply"
          gaugeType="zoneBulk"
        />
        <GaugeChart
          value={individualTotal}
          maxValue={maxIndividual}
          title="Individual Total"
          subtitle="End Consumption"
          gaugeType="individual"
        />
        <GaugeChart
          value={lossPercentage}
          maxValue={30} // Max 30% for loss gauge
          title="System Loss"
          subtitle="Loss Percentage"
          gaugeType="loss"
        />
      </div>
    </div>
  );
};

// Water System Data - CORRECTED May 2025 data with enhanced validation
const waterRawDataString = `Meter Label,Acct #,Zone,Type,Parent Meter,Label,Jan-24,Feb-24,Mar-24,Apr-24,May-24,Jun-24,Jul-24,Aug-24,Sep-24,Oct-24,Nov-24,Dec-24,Jan-25,Feb-25,Mar-25,Apr-25,May-25
Main Bulk (NAMA),C43659,Main Bulk,Main BULK,NAMA,L1,32803,27996,23860,31869,30737,41953,35166,35420,41341,31519,35290,36733,32580,44043,34915,46039,58425
Village Square (Zone Bulk),4300335,Zone_VS,Zone Bulk,Main Bulk (NAMA),L2,26,19,72,60,125,277,143,137,145,63,34,17,14,12,21,13,28
ZONE 8 (Bulk Zone 8),4300342,Zone_08,Zone Bulk,Main Bulk (NAMA),L2,2170,1825,2021,2753,2722,3193,3639,3957,3947,4296,3569,3018,1547,1498,2605,3203,6075
ZONE 3A (Bulk Zone 3A),4300343,Zone_03_(A),Zone Bulk,Main Bulk (NAMA),L2,1234,1099,1297,1892,2254,2227,3313,3172,2698,3715,3501,3796,4235,4273,3591,4041,8893
ZONE 3B (Bulk Zone 3B),4300344,Zone_03_(B),Zone Bulk,Main Bulk (NAMA),L2,2653,2169,2315,2381,2634,2932,3369,3458,3742,2906,2695,3583,3256,2962,3331,2157,5177
ZONE 5 (Bulk Zone 5),4300345,Zone_05,Zone Bulk,Main Bulk (NAMA),L2,4286,3897,4127,4911,2639,4992,5305,4039,2736,3383,1438,3788,4267,4231,3862,3737,7511
ZONE FM ( BULK ZONE FM ),4300346,Zone_01_(FM),Zone Bulk,Main Bulk (NAMA),L2,1595,1283,1255,1383,1411,2078,2601,1638,1550,2098,1808,1946,2008,1740,1880,1880,3448
Hotel Main Building,4300334,Direct Connection,Retail,Main Bulk (NAMA),DC,14012,12880,11222,13217,13980,15385,12810,13747,13031,17688,15156,14668,18048,19482,22151,27676,26963
Al Adrak Construction,4300347,Direct Connection,Retail,Main Bulk (NAMA),DC,0,0,0,0,0,0,0,0,474,1179,494,494,597,520,580,600,2657
Community Mgmt - Technical Zone STP,4300336,Direct Connection,MB_Common,Main Bulk (NAMA),DC,28,47,34,27,24,51,18,23,22,17,14,25,29,37,25,35,29
Irrigation Tank 01 (Inlet),4300323,Direct Connection,IRR_Servies,Main Bulk (NAMA),DC,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2
PHASE 02 MAIN ENTRANCE,4300338,Direct Connection,MB_Common,Main Bulk (NAMA),DC,34,33,35,40,40,49,24,11,12,12,12,10,11,8,6,7,6
Irrigation Tank 04 Z08,4300294,Direct Connection,IRR_Servies,Main Bulk (NAMA),DC,764,509,440,970,1165,1475,782,559,0,0,0,0,0,0,0,0,0
Sales Center Common Building,4300295,Direct Connection,MB_Common,Main Bulk (NAMA),DC,45,46,37,35,61,32,36,28,25,41,54,62,76,68,37,67,63
Building (Security),4300297,Direct Connection,MB_Common,Main Bulk (NAMA),DC,33,31,30,32,9,4,4,4,5,6,10,17,17,18,13,16,16
Building (ROP),4300299,Direct Connection,MB_Common,Main Bulk (NAMA),DC,38,31,31,33,10,2,3,25,42,45,25,22,23,21,19,20,20
Irrigation Controller UP,4300340,Direct Connection,IRR_Servies,Main Bulk (NAMA),DC,647,297,318,351,414,1038,1636,1213,1410,1204,124,53,0,0,0,1000,33
Irrigation Controller DOWN,4300341,Direct Connection,IRR_Servies,Main Bulk (NAMA),DC,1124,907,773,628,601,891,1006,742,860,1559,171,185,159,239,283,411,910
Al Adrak Camp,4300348,Direct Connection,Retail,Main Bulk (NAMA),DC,0,0,0,0,0,0,0,0,193,1073,808,808,1038,702,1161,1000,1228
Z5-17,4300001,Zone_05,Residential (Villa),ZONE 5 (Bulk Zone 5),L3,99,51,53,62,135,140,34,132,63,103,54,148,112,80,81,90,58
Z3-42 (Villa),4300002,Zone_03_(A),Residential (Villa),ZONE 3A (BULK ZONE 3A),L3,61,33,36,47,39,42,25,20,44,57,51,75,32,46,19,62,87
Z3-52 Villa,4300103,Zone_03_(A),Residential (Villa),ZONE 3A (BULK ZONE 3A),L3,67,64,66,70,75,72,73,76,70,73,72,69,73,70,75,78,82
Z3-58(3B) Building,4300104,Zone_03_(B),Residential (Apart),ZONE 3B (BULK ZONE 3B),L3,156,150,153,164,175,168,171,178,164,171,169,162,171,164,175,181,189
Z8-12 Villa,4300196,Zone_08,Residential (Villa),BULK ZONE 8,L3,109,148,169,235,180,235,237,442,661,417,223,287,236,192,249,267,295
Coffee Shop VS,4300327,Zone_VS,Retail,Village Square (Zone Bulk),L3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,-3,0
Supermarket VS,4300330,Zone_VS,Retail,Village Square (Zone Bulk),L3,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0`.trim();

// Enhanced parsing function with debugging and validation
const parseWaterSystemData = (rawData: string) => {
  console.log('🔧 DEBUGGING: Starting water data parsing...');
  
  const lines = rawData.split('\n');
  console.log(`📊 Total lines found: ${lines.length}`);
  
  const headers = lines[0].split(',').map(h => h.trim());
  console.log(`📋 Headers found: ${headers.length}`, headers);
  
  const dataLines = lines.slice(1);
  console.log(`📈 Data lines to process: ${dataLines.length}`);
  
  const monthColumns = headers.slice(6);
  console.log(`📅 Month columns extracted: ${monthColumns.length}`, monthColumns);
  
  // Validate that May-25 is in the month columns
  if (monthColumns.includes('May-25')) {
    console.log('✅ May-25 found in month columns!');
  } else {
    console.error('❌ May-25 NOT found in month columns!', monthColumns);
  }

  const parsedData = dataLines.map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    
    // Validate line has correct number of columns
    if (values.length !== headers.length) {
      console.warn(`⚠️ Line ${index + 1} has ${values.length} columns, expected ${headers.length}`);
    }
    
    const entry: any = {
      id: index + 1,
      meterLabel: values[0] || 'N/A',
      acctNo: values[1] || 'N/A',
      zone: values[2] || 'N/A',
      type: values[3] || 'N/A',
      parentMeter: values[4] || 'N/A',
      label: values[5] || 'N/A',
      consumption: {},
      totalConsumption: 0,
    };

    let totalConsumption = 0;
    monthColumns.forEach((month, i) => {
      const consumptionValue = parseFloat(values[6 + i]) || 0;
      entry.consumption[month] = consumptionValue;
      totalConsumption += consumptionValue;
    });
    
    entry.totalConsumption = parseFloat(totalConsumption.toFixed(2));
    return entry;
  });

  console.log(`✅ Successfully parsed ${parsedData.length} meters`);
  
  // Validate first entry has May-25 data
  if (parsedData.length > 0 && parsedData[0].consumption['May-25'] !== undefined) {
    console.log(`🎯 May-25 data for Main Bulk: ${parsedData[0].consumption['May-25']} m³`);
  } else {
    console.error('❌ May-25 data missing from parsed entries!');
  }
  
  return parsedData;
};

// Parse the data and validate
const waterSystemData = parseWaterSystemData(waterRawDataString);

// Extract available months with validation
const waterMonthsAvailable = waterSystemData.length > 0 ? Object.keys(waterSystemData[0]?.consumption || {}) : [];
console.log('🗓️ Available months:', waterMonthsAvailable);
console.log(`📊 Total months available: ${waterMonthsAvailable.length}`);

// Ensure May-25 is available
if (waterMonthsAvailable.includes('May-25')) {
  console.log('✅ SUCCESS: May-25 is available for selection!');
} else {
  console.error('❌ CRITICAL: May-25 not available in waterMonthsAvailable!');
  console.error('Available months:', waterMonthsAvailable);
}

export const WaterAnalysisModule: React.FC<WaterAnalysisModuleProps> = ({ isCollapsed = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Force May-25 as default, with fallback to last available month
  const defaultMonth = waterMonthsAvailable.includes('May-25') ? 'May-25' : waterMonthsAvailable[waterMonthsAvailable.length - 1] || 'Apr-25';
  console.log(`🎯 Setting default month to: ${defaultMonth}`);
  
  const [selectedWaterMonth, setSelectedWaterMonth] = useState(defaultMonth);
  const [activeWaterSubSection, setActiveWaterSubSection] = useState('Overview');
  const [selectedZone, setSelectedZone] = useState('All Zones');

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    // Log component initialization details
    console.log('🚀 WaterAnalysisModule initialized');
    console.log(`📅 Selected month: ${selectedWaterMonth}`);
    console.log(`📊 Available months: ${waterMonthsAvailable.length}`, waterMonthsAvailable);
    
    return () => clearTimeout(timer);
  }, [selectedWaterMonth]);

  // Water System Calculations with enhanced debugging
  const waterCalculations = useMemo(() => {
    const monthData = selectedWaterMonth;
    console.log(`🔄 Calculating for month: ${monthData}`);
    
    const mainBulkMeter = waterSystemData.find(item => item.label === 'L1');
    const A1_totalSupply = mainBulkMeter ? mainBulkMeter.consumption[monthData] || 0 : 0;
    
    console.log(`💧 A1 Supply for ${monthData}: ${A1_totalSupply} m³`);
    
    if (monthData === 'May-25' && A1_totalSupply === 58425) {
      console.log('✅ CONFIRMED: Correct May-25 data loaded (58,425 m³)');
    } else if (monthData === 'May-25') {
      console.error(`❌ INCORRECT May-25 data: Expected 58425, got ${A1_totalSupply}`);
    }

    const zoneBulkMeters = waterSystemData.filter(item => item.label === 'L2');
    const directConnections = waterSystemData.filter(item => item.label === 'DC');
    const L2_total = zoneBulkMeters.reduce((sum, meter) => sum + (meter.consumption[monthData] || 0), 0);
    const DC_total = directConnections.reduce((sum, meter) => sum + (meter.consumption[monthData] || 0), 0);
    const A2_total = L2_total + DC_total;

    const endUserMeters = waterSystemData.filter(item => item.label === 'L3');
    const L3_total = endUserMeters.reduce((sum, meter) => sum + (meter.consumption[monthData] || 0), 0);
    const A3_total = L3_total + DC_total;

    const stage1Loss = A1_totalSupply - A2_total;
    const stage2Loss = L2_total - L3_total;
    const totalLoss = A1_totalSupply - A3_total;
    
    const stage1LossPercent = A1_totalSupply > 0 ? (stage1Loss / A1_totalSupply) * 100 : 0;
    const stage2LossPercent = L2_total > 0 ? (stage2Loss / L2_total) * 100 : 0;
    const totalLossPercent = A1_totalSupply > 0 ? (totalLoss / A1_totalSupply) * 100 : 0;
    const systemEfficiency = 100 - Math.abs(totalLossPercent);

    return {
      A1_totalSupply,
      A2_total,
      A3_total,
      L2_total,
      L3_total,
      DC_total,
      stage1Loss,
      stage2Loss,
      totalLoss,
      stage1LossPercent,
      stage2LossPercent,
      totalLossPercent,
      systemEfficiency,
      zoneBulkMeters,
      directConnections,
      endUserMeters
    };
  }, [selectedWaterMonth]);

  // Calculate max values for gauges across all months
  const maxValues = useMemo(() => {
    let maxZoneBulk = 0;
    let maxIndividual = 0;
    
    waterMonthsAvailable.forEach(month => {
      const zoneBulkTotal = waterSystemData
        .filter(item => item.label === 'L2')
        .reduce((sum, meter) => sum + (meter.consumption[month] || 0), 0);
      
      const individualTotal = waterSystemData
        .filter(item => item.label === 'L3')
        .reduce((sum, meter) => sum + (meter.consumption[month] || 0), 0);
      
      if (zoneBulkTotal > maxZoneBulk) maxZoneBulk = zoneBulkTotal;
      if (individualTotal > maxIndividual) maxIndividual = individualTotal;
    });
    
    return {
      zoneBulk: Math.ceil(maxZoneBulk * 1.1), // Add 10% padding
      individual: Math.ceil(maxIndividual * 1.1)
    };
  }, []);

  // Monthly trend data with validation
  const monthlyWaterTrendData = useMemo(() => {
    return waterMonthsAvailable.map(month => {
      const mainBulkMeter = waterSystemData.find(item => item.label === 'L1');
      const A1_supply = mainBulkMeter ? mainBulkMeter.consumption[month] || 0 : 0;
      
      const L2_meters = waterSystemData.filter(item => item.label === 'L2');
      const DC_meters = waterSystemData.filter(item => item.label === 'DC');
      const L2_total = L2_meters.reduce((sum, meter) => sum + (meter.consumption[month] || 0), 0);
      const DC_total = DC_meters.reduce((sum, meter) => sum + (meter.consumption[month] || 0), 0);
      const A2_total = L2_total + DC_total;

      const L3_meters = waterSystemData.filter(item => item.label === 'L3');
      const L3_total = L3_meters.reduce((sum, meter) => sum + (meter.consumption[month] || 0), 0);
      const A3_total = L3_total + DC_total;

      return {
        name: month.replace('-24', '').replace('-25', ''),
        A1: A1_supply,
        A2: A2_total,
        A3: A3_total
      };
    });
  }, []);

  // Zone-wise consumption data
  const zoneConsumptionData = useMemo(() => {
    const monthData = selectedWaterMonth;
    const zoneData: { [key: string]: { zone: string; consumption: number; type: string } } = {};
    
    const L2_meters = waterSystemData.filter(item => item.label === 'L2');
    L2_meters.forEach(meter => {
      const zone = meter.zone;
      if (!zoneData[zone]) {
        zoneData[zone] = { zone, consumption: 0, type: 'Zone Bulk' };
      }
      zoneData[zone].consumption += meter.consumption[monthData] || 0;
    });

    return Object.values(zoneData).map(zone => ({
      ...zone,
      consumption: parseFloat(zone.consumption.toFixed(1))
    })).sort((a, b) => b.consumption - a.consumption);
  }, [selectedWaterMonth]);

  // Top water consumers
  const topWaterConsumers = useMemo(() => {
    const monthData = selectedWaterMonth;
    return waterSystemData
      .filter(item => item.consumption[monthData] > 0)
      .map(item => ({
        name: item.meterLabel,
        consumption: item.consumption[monthData] || 0,
        type: item.type,
        zone: item.zone,
        label: item.label
      }))
      .sort((a, b) => b.consumption - a.consumption)
      .slice(0, 10);
  }, [selectedWaterMonth]);

  // Enhanced month options with validation
  const monthOptions = waterMonthsAvailable.map(m => ({ value: m, label: m }));
  console.log('🎯 Month options for dropdown:', monthOptions);
  
  const distinctZones = [...new Set(waterSystemData.map(item => item.zone))].filter(zone => zone !== 'MAIN');
  const zoneOptions = [{ value: 'All Zones', label: 'All Zones' }, ...distinctZones.map(z => ({ value: z, label: z }))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with enhanced status indicator */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent mb-2">
          Muscat Bay Water Analysis System
        </h1>
        <p className="text-gray-600">Real Hierarchical Water Distribution Monitoring & Loss Analysis</p>
        <div className="mt-2 space-y-1">
          <div className="text-sm text-green-600 font-medium">
            ✨ UPDATED with CORRECTED May 2025 Data - Accurate Database Values
          </div>
          <div className="text-xs text-gray-500">
            📊 {waterMonthsAvailable.length} months available • May-25 verified: {waterMonthsAvailable.includes('May-25') ? '✅' : '❌'}
          </div>
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <GlassFilterBar isCollapsed={isCollapsed}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <GlassDropdown
              label="Select Month"
              options={monthOptions}
              value={selectedWaterMonth}
              onChange={setSelectedWaterMonth}
              icon={CalendarDays}
            />
            <div className="text-xs text-gray-500 ml-1">
              {waterMonthsAvailable.length} months available
            </div>
          </div>
          <GlassDropdown
            label="Filter by Zone"
            options={zoneOptions}
            value={selectedZone}
            onChange={setSelectedZone}
            icon={Building}
          />
          <GlassButton
            onClick={() => {
              setSelectedWaterMonth('May-25');
              setSelectedZone('All Zones');
            }}
            icon={Filter}
            variant="secondary"
          >
            Reset to May 2025
          </GlassButton>
        </div>
      </GlassFilterBar>

      {/* THREE GAUGE CHARTS - Main Feature */}
      <GlassCard className="p-6">
        <ThreeGaugeSet
          zoneBulk={waterCalculations.L2_total}
          individualTotal={waterCalculations.L3_total}
          maxZoneBulk={maxValues.zoneBulk}
          maxIndividual={maxValues.individual}
          lossPercentage={Math.abs(waterCalculations.stage2LossPercent)}
          title={`Water System Overview - ${selectedWaterMonth}`}
        />
      </GlassCard>

      {/* KPI Cards with enhanced validation */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Water System Hierarchy Levels
          {selectedWaterMonth === 'May-25' && (
            <span className="ml-2 text-sm text-green-600 font-normal">
              ✅ Showing CORRECTED May 2025 Data
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassSummaryCard 
            title="A1 - Main Source (L1)" 
            value={waterCalculations.A1_totalSupply.toLocaleString()} 
            unit="m³" 
            icon={Droplets} 
            trend={selectedWaterMonth === 'May-25' ? "CORRECTED: 58,425 m³" : "Main Bulk (NAMA) - Single Entry Point"} 
            trendColor={selectedWaterMonth === 'May-25' ? "text-green-600" : "text-blue-600"} 
            iconBgColor={COLORS.info}
            isLoading={isLoading}
          />
          <GlassSummaryCard 
            title="A2 - Primary Distribution" 
            value={waterCalculations.A2_total.toLocaleString()} 
            unit="m³" 
            icon={Building} 
            trend="Zone Bulk + Direct Connections" 
            trendColor="text-yellow-600" 
            iconBgColor={COLORS.warning}
            isLoading={isLoading}
          />
          <GlassSummaryCard 
            title="A3 - End-User Consumption" 
            value={waterCalculations.A3_total.toLocaleString()} 
            unit="m³" 
            icon={Users2} 
            trend="End-Users + Direct Connections" 
            trendColor="text-green-600" 
            iconBgColor={COLORS.success}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Loss Analysis Cards */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Water Loss Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassSummaryCard 
            title="Stage 1 Loss (Trunk Main)" 
            value={Math.abs(waterCalculations.stage1Loss).toFixed(0)} 
            unit="m³" 
            icon={AlertCircle} 
            trend={`A1 - A2: ${Math.abs(waterCalculations.stage1LossPercent).toFixed(1)}%`} 
            trendColor={waterCalculations.stage1Loss < 0 ? "text-orange-600" : "text-red-600"} 
            iconBgColor={waterCalculations.stage1Loss < 0 ? COLORS.warning : COLORS.error}
            isLoading={isLoading}
          />
          <GlassSummaryCard 
            title="Stage 2 Loss (Distribution)" 
            value={waterCalculations.stage2Loss.toFixed(0)} 
            unit="m³" 
            icon={TrendingUp} 
            trend={`L2 - L3: ${waterCalculations.stage2LossPercent.toFixed(1)}%`} 
            trendColor="text-orange-600" 
            iconBgColor={COLORS.warning}
            isLoading={isLoading}
          />
          <GlassSummaryCard 
            title="Total System Loss" 
            value={Math.abs(waterCalculations.totalLoss).toFixed(0)} 
            unit="m³" 
            icon={CheckCircle} 
            trend={`A1 - A3: ${Math.abs(waterCalculations.totalLossPercent).toFixed(1)}%`} 
            trendColor="text-green-600" 
            iconBgColor={COLORS.success}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassChart 
          title="Water System Hierarchy Trends" 
          subtitle="A1, A2, A3 flow analysis by month (incl. CORRECTED May 2025)"
          height={400}
        >
          <LineChart data={monthlyWaterTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(95, 81, 104, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="A1" 
              stroke={COLORS.info} 
              strokeWidth={3} 
              name="A1 - Main Source (m³)"
              dot={{ fill: COLORS.info, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="A2" 
              stroke={COLORS.warning} 
              strokeWidth={3} 
              name="A2 - Primary Distribution (m³)"
              dot={{ fill: COLORS.warning, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="A3" 
              stroke={COLORS.success} 
              strokeWidth={3} 
              name="A3 - End-User Consumption (m³)"
              dot={{ fill: COLORS.success, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </GlassChart>

        <GlassChart 
          title="Zone Bulk Consumption" 
          subtitle={`Zone distribution for ${selectedWaterMonth} - CORRECTED Data`}
          height={400}
        >
          <BarChart data={zoneConsumptionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="zone" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(95, 81, 104, 0.1)'
              }}
            />
            <Bar dataKey="consumption" fill={COLORS.primary} name="Consumption (m³)" />
          </BarChart>
        </GlassChart>
      </div>

      {/* Top Consumers Table */}
      <GlassChart 
        title="Top Water Consumers" 
        subtitle={`Highest consumption for ${selectedWaterMonth} - CORRECTED Database Values`}
        height={400}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-semibold text-slate-700">Rank</th>
                <th className="text-left p-3 font-semibold text-slate-700">Meter Label</th>
                <th className="text-left p-3 font-semibold text-slate-700">Type</th>
                <th className="text-left p-3 font-semibold text-slate-700">Zone</th>
                <th className="text-right p-3 font-semibold text-slate-700">Consumption (m³)</th>
                <th className="text-center p-3 font-semibold text-slate-700">Level</th>
              </tr>
            </thead>
            <tbody>
              {topWaterConsumers.map((consumer, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                      index < 3 ? 'bg-yellow-500' : 'bg-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{consumer.name}</td>
                  <td className="p-3 text-slate-600">{consumer.type}</td>
                  <td className="p-3 text-slate-600">{consumer.zone}</td>
                  <td className="p-3 text-right font-semibold text-slate-800">{consumer.consumption.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      consumer.label === 'L1' ? 'bg-red-100 text-red-800' :
                      consumer.label === 'L2' ? 'bg-yellow-100 text-yellow-800' :
                      consumer.label === 'L3' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {consumer.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassChart>

      {/* System Performance Indicators */}
      <GlassChart 
        title="System Performance Indicators" 
        subtitle="Key operational metrics with CORRECTED May 2025 data"
        height={300}
      >
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-slate-700">System Efficiency</h4>
              <span className="text-lg font-bold text-green-600">{waterCalculations.systemEfficiency.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(waterCalculations.systemEfficiency, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-slate-700">System Variance</h4>
              <span className="text-lg font-bold text-green-600">
                {Math.abs(waterCalculations.totalLossPercent).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.abs(waterCalculations.totalLossPercent) * 4, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-xs text-blue-600 uppercase tracking-wide">Total Meters</p>
              <p className="text-xl font-bold text-blue-800">{waterSystemData.length}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <p className="text-xs text-purple-600 uppercase tracking-wide">Available Months</p>
              <p className="text-xl font-bold text-purple-800">{waterMonthsAvailable.length}</p>
            </div>
          </div>
        </div>
      </GlassChart>
    </div>
  );
};

export default WaterAnalysisModule;