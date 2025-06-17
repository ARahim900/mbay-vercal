'use client';

import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  DollarSign, Building2, TrendingUp, Calculator, Filter, CalendarDays, 
  Users2, Home, MapPin, AlertTriangle, CheckCircle, Banknote
} from 'lucide-react';
import { 
  GlassChart, GlassSummaryCard, GlassDropdown, GlassButton, GlassCard, GlassFilterBar
} from '@/components/glassmorphism';
import { COLORS } from '@/constants/colors';

interface ReserveFundModuleProps {
  isCollapsed?: boolean;
}

// Parse Reserve Fund Data from the SQL format
const parseReserveFundData = () => {
  const rawData = `INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('3C', 'C Sector', 'Commercial', 'Development Land', '5656', '9931.94', '10828.27', '20760.21', '-1');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B01', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B02', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B03', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B04', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B05', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B06', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B07', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B08', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 CIF', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 001', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 002', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 003', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 004', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 005', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 006', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 007', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 008', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '(2) Area Assumed');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 009', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 010', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 011', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 012', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 013', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 014', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 015', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 016', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 017', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 018', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 019', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 020', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 021', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 022', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 023', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 024', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 025', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 026', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 027', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 028', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 029', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 030', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 031', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 032', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 033', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 034', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 035', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 036', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 037', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 038', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 039', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 040', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 041', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 042', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 043', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');`;

  // Extract all INSERT statements and parse them
  const insertStatements = rawData.split('\n').filter(line => line.trim().startsWith('INSERT'));
  
  const parsedData = insertStatements.map((statement, index) => {
    // Extract values from VALUES clause
    const valuesMatch = statement.match(/VALUES \((.*)\);?$/);
    if (!valuesMatch) return null;
    
    const valuesStr = valuesMatch[1];
    const values = valuesStr.split(',').map(v => v.trim().replace(/^'|'$/g, ''));
    
    const parseNumber = (str: string) => {
      if (str === 'N/A' || str === '') return 0;
      return parseFloat(str) || 0;
    };
    
    return {
      id: index + 1,
      unitNo: values[0] || '',
      sector: values[1] || '',
      type: values[2] || '',
      unitType: values[3] || '',
      bua: parseNumber(values[4]),
      zoneContrib: parseNumber(values[5]),
      masterContrib: parseNumber(values[6]),
      totalContrib: parseNumber(values[7]),
      notes: values[8] || ''
    };
  }).filter(item => item !== null);
  
  return parsedData;
};

// Parse the Reserve Fund data
const reserveFundData = parseReserveFundData();

// Enhanced Reserve Fund Gauge Component
const ReserveFundGauge: React.FC<{
  value: number;
  maxValue: number;
  title: string;
  subtitle: string;
  gaugeType: 'zoneContrib' | 'masterContrib' | 'totalContrib';
  size?: number;
}> = ({ value, maxValue, title, subtitle, gaugeType, size = 140 }) => {
  
  const percentage = Math.min((value / maxValue) * 100, 100);
  const angle = (percentage / 100) * 180;
  
  const getGaugeColor = () => {
    switch (gaugeType) {
      case 'zoneContrib':
        return '#3B82F6'; // Blue for Zone Contribution
      case 'masterContrib':
        return '#10B981'; // Green for Master Contribution
      case 'totalContrib':
        return '#8B5CF6'; // Purple for Total Contribution
      default:
        return '#6B7280';
    }
  };

  const gaugeColor = getGaugeColor();
  const center = size / 2;
  const radius = size * 0.35;
  const strokeWidth = size * 0.1;

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
          <path
            d={createArcPath(0, 180)}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={createArcPath(0, angle)}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            className="text-lg font-bold fill-gray-800"
          >
            {value.toLocaleString()}
          </text>
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            OMR
          </text>
        </svg>
      </div>
      
      <div className="text-center mt-2">
        <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
        <p className="text-xs text-gray-600">{subtitle}</p>
        <p className="text-xs text-gray-500 mt-1">
          Max: {maxValue.toLocaleString()} OMR
        </p>
      </div>
    </div>
  );
};

export const ReserveFundModule: React.FC<ReserveFundModuleProps> = ({ isCollapsed = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedType, setSelectedType] = useState('All Types');
  const [activeSubSection, setActiveSubSection] = useState('Overview');

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const validUnits = reserveFundData.filter(unit => 
      unit.totalContrib > 0 && 
      (selectedSector === 'All Sectors' || unit.sector === selectedSector) &&
      (selectedType === 'All Types' || unit.type === selectedType)
    );

    const totalUnits = validUnits.length;
    const totalZoneContrib = validUnits.reduce((sum, unit) => sum + unit.zoneContrib, 0);
    const totalMasterContrib = validUnits.reduce((sum, unit) => sum + unit.masterContrib, 0);
    const totalContrib = validUnits.reduce((sum, unit) => sum + unit.totalContrib, 0);
    const totalBUA = validUnits.reduce((sum, unit) => sum + unit.bua, 0);
    const avgContribPerUnit = totalUnits > 0 ? totalContrib / totalUnits : 0;
    const avgContribPerSqm = totalBUA > 0 ? totalContrib / totalBUA : 0;

    return {
      totalUnits,
      totalZoneContrib,
      totalMasterContrib,
      totalContrib,
      totalBUA,
      avgContribPerUnit,
      avgContribPerSqm
    };
  }, [selectedSector, selectedType]);

  // Calculate max values for gauges
  const maxValues = useMemo(() => {
    const allValidUnits = reserveFundData.filter(unit => unit.totalContrib > 0);
    const maxZone = Math.max(...allValidUnits.map(unit => unit.zoneContrib));
    const maxMaster = Math.max(...allValidUnits.map(unit => unit.masterContrib));
    const maxTotal = Math.max(...allValidUnits.map(unit => unit.totalContrib));
    
    return {
      zoneContrib: Math.ceil(maxZone * 1.1),
      masterContrib: Math.ceil(maxMaster * 1.1),
      totalContrib: Math.ceil(maxTotal * 1.1)
    };
  }, []);

  // Sector-wise breakdown
  const sectorBreakdown = useMemo(() => {
    const sectors: { [key: string]: any } = {};
    
    reserveFundData.filter(unit => unit.totalContrib > 0).forEach(unit => {
      if (!sectors[unit.sector]) {
        sectors[unit.sector] = {
          sector: unit.sector,
          units: 0,
          totalContrib: 0,
          totalBUA: 0,
          avgContrib: 0
        };
      }
      
      sectors[unit.sector].units += 1;
      sectors[unit.sector].totalContrib += unit.totalContrib;
      sectors[unit.sector].totalBUA += unit.bua;
    });
    
    Object.values(sectors).forEach((sector: any) => {
      sector.avgContrib = sector.units > 0 ? sector.totalContrib / sector.units : 0;
    });
    
    return Object.values(sectors).sort((a: any, b: any) => b.totalContrib - a.totalContrib);
  }, []);

  // Property type breakdown
  const typeBreakdown = useMemo(() => {
    const types: { [key: string]: any } = {};
    
    reserveFundData.filter(unit => unit.totalContrib > 0).forEach(unit => {
      if (!types[unit.type]) {
        types[unit.type] = {
          type: unit.type,
          units: 0,
          totalContrib: 0,
          percentage: 0
        };
      }
      
      types[unit.type].units += 1;
      types[unit.type].totalContrib += unit.totalContrib;
    });
    
    const totalContrib = Object.values(types).reduce((sum: number, type: any) => sum + type.totalContrib, 0);
    Object.values(types).forEach((type: any) => {
      type.percentage = totalContrib > 0 ? (type.totalContrib / totalContrib) * 100 : 0;
    });
    
    return Object.values(types).sort((a: any, b: any) => b.totalContrib - a.totalContrib);
  }, []);

  // Top contributing units
  const topContributors = useMemo(() => {
    return reserveFundData
      .filter(unit => unit.totalContrib > 0)
      .sort((a, b) => b.totalContrib - a.totalContrib)
      .slice(0, 10);
  }, []);

  // Get filter options
  const sectorOptions = [
    { value: 'All Sectors', label: 'All Sectors' },
    ...Array.from(new Set(reserveFundData.map(unit => unit.sector)))
      .map(sector => ({ value: sector, label: sector }))
  ];

  const typeOptions = [
    { value: 'All Types', label: 'All Types' },
    ...Array.from(new Set(reserveFundData.map(unit => unit.type)))
      .map(type => ({ value: type, label: type }))
  ];

  const COLORS_CHART = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent mb-2">
          Muscat Bay Reserve Fund Management System
        </h1>
        <p className="text-gray-600">Comprehensive Reserve Fund Contribution Analysis & Financial Planning</p>
        <div className="mt-2 space-y-1">
          <div className="text-sm text-green-600 font-medium">
            💰 2025 Reserve Fund Contributions - Property-Based Assessment
          </div>
          <div className="text-xs text-gray-500">
            📊 {reserveFundData.length} total units • {summaryStats.totalUnits} contributing units
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <GlassFilterBar isCollapsed={isCollapsed}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <GlassDropdown
            label="Filter by Sector"
            options={sectorOptions}
            value={selectedSector}
            onChange={setSelectedSector}
            icon={MapPin}
          />
          <GlassDropdown
            label="Filter by Property Type"
            options={typeOptions}
            value={selectedType}
            onChange={setSelectedType}
            icon={Building2}
          />
          <GlassButton
            onClick={() => {
              setSelectedSector('All Sectors');
              setSelectedType('All Types');
            }}
            icon={Filter}
            variant="secondary"
          >
            Reset Filters
          </GlassButton>
        </div>
      </GlassFilterBar>

      {/* Three Gauge Charts */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Reserve Fund Overview - {selectedSector} / {selectedType}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReserveFundGauge
              value={summaryStats.totalZoneContrib}
              maxValue={maxValues.zoneContrib}
              title="Zone Contribution"
              subtitle="Zone Level Fees"
              gaugeType="zoneContrib"
            />
            <ReserveFundGauge
              value={summaryStats.totalMasterContrib}
              maxValue={maxValues.masterContrib}
              title="Master Contribution"
              subtitle="Master Development"
              gaugeType="masterContrib"
            />
            <ReserveFundGauge
              value={summaryStats.totalContrib}
              maxValue={maxValues.totalContrib}
              title="Total Contribution"
              subtitle="2025 Assessment"
              gaugeType="totalContrib"
            />
          </div>
        </div>
      </GlassCard>

      {/* KPI Summary Cards */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Financial Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassSummaryCard 
            title="Total Units" 
            value={summaryStats.totalUnits.toString()} 
            unit="units" 
            icon={Home} 
            trend="Contributing Properties" 
            trendColor="text-blue-600" 
            iconBgColor={COLORS.info}
            isLoading={isLoading}
          />
          <GlassSummaryCard 
            title="Total Assessment" 
            value={summaryStats.totalContrib.toLocaleString()} 
            unit="OMR" 
            icon={DollarSign} 
            trend="2025 Reserve Fund" 
            trendColor="text-green-600" 
            iconBgColor={COLORS.success}
            isLoading={isLoading}
          />
          <GlassSummaryCard 
            title="Average per Unit" 
            value={summaryStats.avgContribPerUnit.toFixed(0)} 
            unit="OMR" 
            icon={Calculator} 
            trend="Per Property" 
            trendColor="text-purple-600" 
            iconBgColor={COLORS.primary}
            isLoading={isLoading}
          />
          <GlassSummaryCard 
            title="Rate per SQM" 
            value={summaryStats.avgContribPerSqm.toFixed(2)} 
            unit="OMR/m²" 
            icon={TrendingUp} 
            trend="BUA-Based Rate" 
            trendColor="text-orange-600" 
            iconBgColor={COLORS.warning}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Breakdown Chart */}
        <GlassChart 
          title="Contribution by Sector" 
          subtitle="Reserve fund assessment by development sector"
          height={400}
        >
          <BarChart data={sectorBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="sector" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(95, 81, 104, 0.1)'
              }}
            />
            <Bar dataKey="totalContrib" fill={COLORS.primary} name="Total Contribution (OMR)" />
          </BarChart>
        </GlassChart>

        {/* Property Type Distribution */}
        <GlassChart 
          title="Property Type Distribution" 
          subtitle="Reserve fund contribution by property type"
          height={400}
        >
          <PieChart>
            <Pie
              data={typeBreakdown}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="totalContrib"
            >
              {typeBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(95, 81, 104, 0.1)'
              }}
            />
          </PieChart>
        </GlassChart>
      </div>

      {/* Top Contributors Table */}
      <GlassChart 
        title="Top Contributing Properties" 
        subtitle="Highest reserve fund assessments for 2025"
        height={500}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-semibold text-slate-700">Rank</th>
                <th className="text-left p-3 font-semibold text-slate-700">Unit No</th>
                <th className="text-left p-3 font-semibold text-slate-700">Sector</th>
                <th className="text-left p-3 font-semibold text-slate-700">Type</th>
                <th className="text-left p-3 font-semibold text-slate-700">Unit Type</th>
                <th className="text-right p-3 font-semibold text-slate-700">BUA (m²)</th>
                <th className="text-right p-3 font-semibold text-slate-700">Zone (OMR)</th>
                <th className="text-right p-3 font-semibold text-slate-700">Master (OMR)</th>
                <th className="text-right p-3 font-semibold text-slate-700">Total (OMR)</th>
              </tr>
            </thead>
            <tbody>
              {topContributors.map((unit, index) => (
                <tr key={unit.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                      index < 3 ? 'bg-yellow-500' : 'bg-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{unit.unitNo}</td>
                  <td className="p-3 text-slate-600">{unit.sector}</td>
                  <td className="p-3 text-slate-600">{unit.type}</td>
                  <td className="p-3 text-slate-600">{unit.unitType}</td>
                  <td className="p-3 text-right font-medium text-slate-800">
                    {unit.bua > 0 ? unit.bua.toLocaleString() : 'N/A'}
                  </td>
                  <td className="p-3 text-right font-medium text-blue-600">
                    {unit.zoneContrib.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-medium text-green-600">
                    {unit.masterContrib.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold text-purple-600">
                    {unit.totalContrib.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassChart>

      {/* Financial Analysis Summary */}
      <GlassChart 
        title="Financial Analysis Summary" 
        subtitle="Key metrics and performance indicators"
        height={300}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-blue-600 uppercase tracking-wide">Zone Contribution</p>
            <p className="text-xl font-bold text-blue-800">{summaryStats.totalZoneContrib.toLocaleString()} OMR</p>
            <p className="text-xs text-blue-600">
              {((summaryStats.totalZoneContrib / summaryStats.totalContrib) * 100).toFixed(1)}% of Total
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-xs text-green-600 uppercase tracking-wide">Master Contribution</p>
            <p className="text-xl font-bold text-green-800">{summaryStats.totalMasterContrib.toLocaleString()} OMR</p>
            <p className="text-xs text-green-600">
              {((summaryStats.totalMasterContrib / summaryStats.totalContrib) * 100).toFixed(1)}% of Total
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-xs text-purple-600 uppercase tracking-wide">Total BUA</p>
            <p className="text-xl font-bold text-purple-800">{summaryStats.totalBUA.toLocaleString()} m²</p>
            <p className="text-xs text-purple-600">Built-up Area</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg text-center">
            <p className="text-xs text-orange-600 uppercase tracking-wide">Sectors</p>
            <p className="text-xl font-bold text-orange-800">{sectorBreakdown.length}</p>
            <p className="text-xs text-orange-600">Development Zones</p>
          </div>
        </div>
      </GlassChart>
    </div>
  );
};

export default ReserveFundModule;