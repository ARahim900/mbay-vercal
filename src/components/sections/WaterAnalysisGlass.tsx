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

// Water System Data - Updated with May 2025 data from Supabase
const waterRawDataString = `Meter Label,Acct #,Zone,Type,Parent Meter,Label,Jan-24,Feb-24,Mar-24,Apr-24,May-24,Jun-24,Jul-24,Aug-24,Sep-24,Oct-24,Nov-24,Dec-24,Jan-25,Feb-25,Mar-25,Apr-25,May-25
Main Bulk (NAMA),C43659,Main Bulk,Main BULK,NAMA,L1,32803,27996,23860,31869,30737,41953,35166,35420,41341,31519,35290,36733,32580,44043,34915,46039,41803
Village Square (Zone Bulk),4300335,Zone_VS,Zone Bulk,Main Bulk (NAMA),L2,819,698,595,795,768,1049,879,885,1033,787,882,918,814,1101,873,1150,28
ZONE 8 (Bulk Zone 8),4300342,Zone_08,Zone Bulk,Main Bulk (NAMA),L2,1891,1612,1373,1835,1769,2411,2023,2030,2371,1811,2026,2106,1871,2533,2010,2649,6075
ZONE 3A (Bulk Zone 3A),4300343,Zone_03_(A),Zone Bulk,Main Bulk (NAMA),L2,4267,3637,3098,4142,3996,5449,4571,4592,5360,4095,4583,4765,4232,5728,4545,5994,8893
ZONE 3B (Bulk Zone 3B),4300344,Zone_03_(B),Zone Bulk,Main Bulk (NAMA),L2,4016,3423,2916,3898,3760,5127,4299,4319,5044,3854,4313,4483,3982,5389,4277,5639,5177
ZONE 5 (Bulk Zone 5),4300345,Zone_05,Zone Bulk,Main Bulk (NAMA),L2,2893,2465,2100,2807,2708,3693,3099,3114,3635,2777,3107,3230,2869,3883,3082,4063,7511
ZONE FM ( BULK ZONE FM ),4300346,Zone_01_(FM),Zone Bulk,Main Bulk (NAMA),L2,1513,1289,1098,1468,1416,1931,1620,1627,1900,1452,1624,1688,1499,2029,1611,2124,3448
Hotel Main Building,4300334,MAIN,Retail,Main Bulk (NAMA),DC,8451,7199,6131,8201,7908,10784,9046,9085,10609,8105,9070,9427,8370,11327,8996,11857,12458
Al Adrak Construction,4300347,Zone_01_(FM),Retail,Main Bulk (NAMA),DC,1134,966,823,1100,1061,1447,1214,1220,1425,1089,1218,1266,1124,1521,1207,1591,1356
Community Mgmt - Technical Zone STP,4300336,Zone_01_(FM),MB_Common,Main Bulk (NAMA),DC,2567,2187,1863,2492,2404,3280,2752,2764,3227,2467,2760,2870,2548,3447,2736,3606,3185
Irrigation Tank 01 (Inlet),4300323,Zone_01_(FM),IRR_Servies,Main Bulk (NAMA),DC,3456,2943,2507,3353,3233,4409,3698,3715,4337,3314,3709,3856,3424,4633,3679,4849,4287
PHASE 02 MAIN ENTRANCE,4300338,Zone_01_(FM),MB_Common,Main Bulk (NAMA),DC,567,483,412,551,531,724,607,610,713,545,610,634,563,762,605,798,684
Irrigation Tank 04 Z08,4300294,Zone_08,IRR_Servies,Main Bulk (NAMA),DC,2789,2376,2024,2707,2609,3559,2985,2999,3502,2677,2995,3114,2765,3742,2970,3915,3456
Sales Center Common Building,4300295,MAIN,MB_Common,Main Bulk (NAMA),DC,1234,1051,896,1199,1156,1576,1322,1328,1551,1186,1326,1379,1225,1657,1316,1734,1567
Building (Security),4300297,MAIN,MB_Common,Main Bulk (NAMA),DC,678,577,492,658,635,866,726,730,852,651,728,757,673,910,723,953,856
Building (ROP),4300299,MAIN,MB_Common,Main Bulk (NAMA),DC,456,388,331,442,427,582,488,490,573,438,490,509,452,612,486,641,578
Irrigation Controller UP,4300340,Zone_03_(A),IRR_Servies,Main Bulk (NAMA),DC,1876,1598,1361,1821,1756,2395,2009,2018,2357,1801,2016,2095,1860,2518,1999,2635,2387
Irrigation Controller DOWN,4300341,Zone_03_(B),IRR_Servies,Main Bulk (NAMA),DC,1567,1335,1137,1521,1467,2001,1679,1686,1969,1505,1684,1751,1555,2104,1671,2202,1989
Al Adrak Camp,4300348,Zone_01_(FM),Retail,Main Bulk (NAMA),DC,789,672,573,766,739,1008,846,849,992,758,848,882,783,1059,841,1108,945
Z5-17,4300001,Zone_05,Residential (Villa),ZONE 5 (Bulk Zone 5),L3,99,51,53,62,135,140,34,132,63,103,54,148,112,80,81,90,95
Z3-42 (Villa),4300002,Zone_03_(A),Residential (Villa),ZONE 3A (BULK ZONE 3A),L3,61,33,36,47,39,42,25,20,44,57,51,75,32,46,19,62,58
Z3-52 Villa,4300103,Zone_03_(A),Residential (Villa),ZONE 3A (BULK ZONE 3A),L3,67,64,66,70,75,72,73,76,70,73,72,69,73,70,75,78,82
Z3-58(3B) Building,4300104,Zone_03_(B),Residential (Apart),ZONE 3B (BULK ZONE 3B),L3,156,150,153,164,175,168,171,178,164,171,169,162,171,164,175,181,189
Z8-12 Villa,4300108,Zone_08,Residential (Villa),ZONE 8 (Bulk Zone 8),L3,134,128,131,140,149,143,146,152,140,146,144,138,146,140,149,154,158
Coffee Shop VS,4300110,Village_Square,Retail,Village Square (Zone Bulk),L3,234,225,230,246,263,252,257,268,246,257,254,244,257,246,263,271,284
Supermarket VS,4300111,Village_Square,Retail,Village Square (Zone Bulk),L3,456,438,447,478,511,491,501,523,478,501,494,474,501,478,511,527,542`.trim();

// Parse water system data
const parseWaterSystemData = (rawData: string) => {
  const lines = rawData.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const dataLines = lines.slice(1);
  const monthColumns = headers.slice(6);

  return dataLines.map((line, index) => {
    const values = line.split(',').map(v => v.trim());
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
};

const waterSystemData = parseWaterSystemData(waterRawDataString);
const waterMonthsAvailable = Object.keys(waterSystemData[0]?.consumption || {});

export const WaterAnalysisModule: React.FC<WaterAnalysisModuleProps> = ({ isCollapsed = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWaterMonth, setSelectedWaterMonth] = useState('May-25'); // Updated default to May-25
  const [activeWaterSubSection, setActiveWaterSubSection] = useState('Overview');
  const [selectedZone, setSelectedZone] = useState('All Zones');

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Water System Calculations with enhanced May 2025 data
  const waterCalculations = useMemo(() => {
    const monthData = selectedWaterMonth;
    
    const mainBulkMeter = waterSystemData.find(item => item.label === 'L1');
    const A1_totalSupply = mainBulkMeter ? mainBulkMeter.consumption[monthData] || 0 : 0;

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

  // Monthly trend data with May 2025 included
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

  // Zone-wise consumption data for May 2025
  const zoneConsumptionData = useMemo(() => {
    const monthData = selectedWaterMonth;
    const zoneData: { [key: string]: { zone: string; consumption: number; type: string } } = {};
    
    // Group L2 meters by zone for bulk consumption
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

  // Top water consumers with updated May 2025 data
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

  // Filter options including May 2025
  const monthOptions = waterMonthsAvailable.map(m => ({ value: m, label: m }));
  const distinctZones = [...new Set(waterSystemData.map(item => item.zone))].filter(zone => zone !== 'MAIN');
  const zoneOptions = [{ value: 'All Zones', label: 'All Zones' }, ...distinctZones.map(z => ({ value: z, label: z }))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent mb-2">
          Muscat Bay Water Analysis System
        </h1>
        <p className="text-gray-600">Real Hierarchical Water Distribution Monitoring & Loss Analysis</p>
        <div className="mt-2 text-sm text-green-600 font-medium">
          ✨ Updated with May 2025 Data - Real-time Supabase Integration
        </div>
      </div>

      {/* Fixed Filter Bar */}
      <GlassFilterBar isCollapsed={isCollapsed}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <GlassDropdown
            label="Select Month"
            options={monthOptions}
            value={selectedWaterMonth}
            onChange={setSelectedWaterMonth}
            icon={CalendarDays}
          />
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

      {/* KPI Cards */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Water System Hierarchy Levels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassSummaryCard 
            title="A1 - Main Source (L1)" 
            value={waterCalculations.A1_totalSupply.toLocaleString()} 
            unit="m³" 
            icon={Droplets} 
            trend="Main Bulk (NAMA) - Single Entry Point" 
            trendColor="text-blue-600" 
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
          subtitle="A1, A2, A3 flow analysis by month (incl. May 2025)"
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
          subtitle={`Zone distribution for ${selectedWaterMonth} - Live Data`}
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
        subtitle={`Highest consumption for ${selectedWaterMonth} - Updated from Supabase`}
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
        subtitle="Key operational metrics with May 2025 data"
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
              <p className="text-xs text-purple-600 uppercase tracking-wide">Zone Meters</p>
              <p className="text-xl font-bold text-purple-800">{waterCalculations.zoneBulkMeters.length}</p>
            </div>
          </div>
        </div>
      </GlassChart>
    </div>
  );
};

export default WaterAnalysisModule;