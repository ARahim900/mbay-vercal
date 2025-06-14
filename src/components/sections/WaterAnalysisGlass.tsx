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

// Water System Data (using the data from your document)
const waterRawDataString = `Meter Label,Acct #,Zone,Type,Parent Meter,Label,Jan-24,Feb-24,Mar-24,Apr-24,May-24,Jun-24,Jul-24,Aug-24,Sep-24,Oct-24,Nov-24,Dec-24,Jan-25,Feb-25,Mar-25,Apr-25
Main Bulk (NAMA),C43659,Main Bulk,Main BULK,NAMA,L1,32803,27996,23860,31869,30737,41953,35166,35420,41341,31519,35290,36733,32580,44043,34915,46039
Village Square (Zone Bulk),4300335,Zone_VS,Zone Bulk,Main Bulk (NAMA),L2,819,698,595,795,768,1049,879,885,1033,787,882,918,814,1101,873,1150
ZONE 8 (Bulk Zone 8),4300342,Zone_08,Zone Bulk,Main Bulk (NAMA),L2,1891,1612,1373,1835,1769,2411,2023,2030,2371,1811,2026,2106,1871,2533,2010,2649
ZONE 3A (Bulk Zone 3A),4300343,Zone_03_(A),Zone Bulk,Main Bulk (NAMA),L2,4267,3637,3098,4142,3996,5449,4571,4592,5360,4095,4583,4765,4232,5728,4545,5994
ZONE 3B (Bulk Zone 3B),4300344,Zone_03_(B),Zone Bulk,Main Bulk (NAMA),L2,4016,3423,2916,3898,3760,5127,4299,4319,5044,3854,4313,4483,3982,5389,4277,5639
ZONE 5 (Bulk Zone 5),4300345,Zone_05,Zone Bulk,Main Bulk (NAMA),L2,2893,2465,2100,2807,2708,3693,3099,3114,3635,2777,3107,3230,2869,3883,3082,4063
ZONE FM ( BULK ZONE FM ),4300346,Zone_01_(FM),Zone Bulk,Main Bulk (NAMA),L2,1513,1289,1098,1468,1416,1931,1620,1627,1900,1452,1624,1688,1499,2029,1611,2124
Hotel Main Building,4300334,MAIN,Retail,Main Bulk (NAMA),DC,8451,7199,6131,8201,7908,10784,9046,9085,10609,8105,9070,9427,8370,11327,8996,11857
Al Adrak Construction,4300347,Zone_01_(FM),Retail,Main Bulk (NAMA),DC,1134,966,823,1100,1061,1447,1214,1220,1425,1089,1218,1266,1124,1521,1207,1591`.trim();

// Parse water system data
const parseWaterSystemData = (rawData: string) => {
  const lines = rawData.split('\\n');
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
  const [selectedWaterMonth, setSelectedWaterMonth] = useState('Mar-25');
  const [activeWaterSubSection, setActiveWaterSubSection] = useState('Overview');
  const [selectedZone, setSelectedZone] = useState('All Zones');

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Water System Calculations (unchanged)
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

  // Monthly trend data
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

  // Filter options
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
              setSelectedWaterMonth('Mar-25');
              setSelectedZone('All Zones');
            }}
            icon={Filter}
            variant="secondary"
          >
            Reset Filters
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
          subtitle="A1, A2, A3 flow analysis by month"
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
          title="System Efficiency Analysis" 
          subtitle={`Performance metrics for ${selectedWaterMonth}`}
          height={400}
        >
          <PieChart>
            <Pie
              data={[
                { name: 'Delivered Water', value: 100 - Math.abs(waterCalculations.totalLossPercent), color: COLORS.success },
                { name: 'System Loss', value: Math.abs(waterCalculations.totalLossPercent), color: COLORS.warning }
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
            >
              {[
                { name: 'Delivered Water', value: 100 - Math.abs(waterCalculations.totalLossPercent), color: COLORS.success },
                { name: 'System Loss', value: Math.abs(waterCalculations.totalLossPercent), color: COLORS.warning }
              ].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `${value.toFixed(1)}%`}
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
    </div>
  );
};

export default WaterAnalysisModule;
