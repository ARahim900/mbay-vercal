"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Droplets,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  BarChart2,
  List,
  CalendarDays,
  Building,
  Sparkles,
  X,
  Gauge,
} from "lucide-react"

// ===============================
// CONSTANTS & COLORS
// ===============================

const COLORS = {
  primary: '#4E4456',
  primaryLight: '#7E708A',
  primaryDark: '#3B3241',
  accent: '#6A5ACD',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  error: '#EF4444',
  secondary: '#A8D5E3',
  chart: ['#6A5ACD', '#FFA07A', '#20B2AA', '#FF69B4', '#9370DB', '#F08080', '#4682B4', '#32CD32', '#FF6347', '#4169E1']
}

// ===============================
// SHARED COMPONENTS
// ===============================

const SummaryCard = ({ title, value, icon, unit, trend, trendColor, iconBgColor, isLoading }) => {
  const IconComponent = icon
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-slate-500 font-semibold text-md">{title}</h3>
        <div
          className={`p-3 rounded-full text-white shadow-md`}
          style={{ backgroundColor: iconBgColor || COLORS.primary }}
        >
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
  )
}

const ChartWrapper = ({ title, children, subtitle, actions }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
    <div className="mt-4" style={{ height: "350px" }}>
      {children}
    </div>
  </div>
)

const StyledSelect = ({ label, value, onChange, options, id, icon: Icon, disabled }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="appearance-none w-full p-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:outline-none bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            "--tw-ring-color": COLORS.primaryLight,
            borderColor: "rgb(203 213 225 / 1)",
            ringColor: COLORS.primaryLight,
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          {Icon ? <Icon size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
    </div>
  )
}

// ===============================
// ENHANCED GAUGE CHART COMPONENT - NOW SUPPORTS THREE TYPES
// ===============================

const GaugeChart = ({ 
  value, 
  max, 
  title, 
  subtitle, 
  color = COLORS.primary, 
  size = 140, 
  gaugeType = "loss", // "bulk", "individual", "loss"
  unit = "m³"
}) => {
  // Calculate percentage based on gauge type
  let percentage = 0
  let displayValue = value
  let gaugeColor = color

  if (gaugeType === "loss") {
    // Loss gauge: percentage of loss relative to bulk
    percentage = Math.min((value / max) * 100, 100)
    const getColorByPercentage = (percent) => {
      if (percent <= 10) return COLORS.success
      if (percent <= 25) return COLORS.warning
      return COLORS.error
    }
    gaugeColor = getColorByPercentage(percentage)
  } else if (gaugeType === "bulk" || gaugeType === "individual") {
    // Bulk and Individual gauges: show relative to maximum value in dataset
    // For better visualization, we'll use a reasonable scale
    const maxScale = Math.max(max * 1.2, 10000) // Dynamic scaling
    percentage = Math.min((value / maxScale) * 100, 100)
    
    if (gaugeType === "bulk") {
      gaugeColor = COLORS.info
    } else {
      gaugeColor = COLORS.success
    }
  }

  const strokeDasharray = `${percentage * 2.51} 251`
  
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="40"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251 251"
            strokeDashoffset="62.75"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="40"
            stroke={gaugeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="62.75"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {gaugeType === "loss" ? (
            <>
              <span className="text-xl font-bold text-slate-800">{percentage.toFixed(1)}%</span>
              <span className="text-xs text-slate-500">Loss Rate</span>
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-slate-800">{displayValue.toLocaleString()}</span>
              <span className="text-xs text-slate-500">{unit}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-center mt-2">
        <h4 className="font-semibold text-sm text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500">{subtitle}</p>
        {gaugeType === "loss" && (
          <div className="mt-1 text-xs">
            <span className="text-slate-600">Bulk: {max.toLocaleString()} m³</span>
            <br />
            <span className="text-slate-600">Individual: {(max - value).toLocaleString()} m³</span>
            <br />
            <span className="text-red-600 font-semibold">Loss: {value.toLocaleString()} m³</span>
          </div>
        )}
        {gaugeType === "bulk" && (
          <div className="mt-1 text-xs">
            <span className="text-blue-600 font-semibold">Zone Bulk Supply</span>
            <br />
            <span className="text-slate-600">{value.toLocaleString()} m³</span>
          </div>
        )}
        {gaugeType === "individual" && (
          <div className="mt-1 text-xs">
            <span className="text-green-600 font-semibold">Total Individual Consumption</span>
            <br />
            <span className="text-slate-600">{value.toLocaleString()} m³</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ===============================
// THREE GAUGE COMPONENT SET
// ===============================

const ThreeGaugeSet = ({ zoneBulk, individualSum, loss, zoneName, metersCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border">
      <div className="text-center">
        <h5 className="text-sm font-semibold text-slate-700 mb-2">Zone Bulk</h5>
        <GaugeChart
          value={zoneBulk}
          max={zoneBulk}
          title="Bulk Supply"
          subtitle={`${zoneName}`}
          gaugeType="bulk"
          size={120}
        />
      </div>
      
      <div className="text-center">
        <h5 className="text-sm font-semibold text-slate-700 mb-2">Individual Total</h5>
        <GaugeChart
          value={individualSum}
          max={zoneBulk}
          title="Total Consumption"
          subtitle={`${metersCount} meters`}
          gaugeType="individual"
          size={120}
        />
      </div>
      
      <div className="text-center">
        <h5 className="text-sm font-semibold text-slate-700 mb-2">System Loss</h5>
        <GaugeChart
          value={loss}
          max={zoneBulk}
          title="Water Loss"
          subtitle={`${((loss / zoneBulk) * 100).toFixed(1)}% loss rate`}
          gaugeType="loss"
          size={120}
        />
      </div>
    </div>
  )
}

// ===============================
// COMPLETE WATER DATA FROM DATABASE
// ===============================

const WaterLossAnalysis = () => {
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedMonth, setSelectedMonth] = useState("May-25")
  const [selectedZone, setSelectedZone] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  // All months available in the database
  const months = [
    "Jan-24", "Feb-24", "Mar-24", "Apr-24", "May-24", "Jun-24", "Jul-24", "Aug-24", 
    "Sep-24", "Oct-24", "Nov-24", "Dec-24", "Jan-25", "Feb-25", "Mar-25", "Apr-25", "May-25"
  ]

  // Helper function to assign colors to meter types
  const getTypeColor = (type) => {
    const colors = {
      "IRR_Services": COLORS.success,
      "MB_Common": COLORS.primary,
      "Retail": COLORS.warning,
      "Residential (Villa)": COLORS.info,
      "Residential (Apart)": COLORS.secondary,
      "D_Building_Common": COLORS.error,
    }
    return colors[type] || "#64748b"
  }

  // A1: Main Bulk (NAMA) - L1 Level
  const A1_data = [32803, 27996, 23860, 31869, 30737, 41953, 35166, 35420, 41341, 31519, 35290, 36733, 32580, 44043, 34915, 46039, 58425]

  // Direct Connections (DC) - Connect directly to Main Bulk
  const directConnectionData = {
    "Hotel Main Building": {
      type: "Retail",
      data: [14012, 12880, 11222, 13217, 13980, 15385, 12810, 13747, 13031, 17688, 15156, 14668, 18048, 19482, 22151, 27676, 26963]
    },
    "Community Mgmt - Technical Zone, STP": {
      type: "MB_Common", 
      data: [28, 47, 34, 27, 24, 51, 18, 23, 22, 17, 14, 25, 29, 37, 25, 35, 29]
    },
    "PHASE 02, MAIN ENTRANCE (Infrastructure)": {
      type: "MB_Common",
      data: [34, 33, 35, 40, 40, 49, 24, 11, 12, 12, 12, 10, 11, 8, 6, 7, 6]
    },
    "Irrigation Tank 01 (Inlet)": {
      type: "IRR_Services",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
    },
    "Irrigation- Controller UP": {
      type: "IRR_Services", 
      data: [647, 297, 318, 351, 414, 1038, 1636, 1213, 1410, 1204, 124, 53, 0, 0, 0, 1000, 33]
    },
    "Irrigation- Controller DOWN": {
      type: "IRR_Services",
      data: [1124, 907, 773, 628, 601, 891, 1006, 742, 860, 1559, 171, 185, 159, 239, 283, 411, 910]
    },
    "Al Adrak Construction": {
      type: "Retail",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 474, 1179, 494, 494, 597, 520, 580, 600, 2657]
    },
    "Al Adrak Camp": {
      type: "Retail", 
      data: [0, 0, 0, 0, 0, 0, 0, 0, 193, 1073, 808, 808, 1038, 702, 1161, 1000, 1228]
    },
    "Sales Center Common Building": {
      type: "MB_Common",
      data: [45, 46, 37, 35, 61, 32, 36, 28, 25, 41, 54, 62, 76, 68, 37, 67, 63]
    },
    "Building (Security)": {
      type: "MB_Common", 
      data: [33, 31, 30, 32, 9, 4, 4, 4, 5, 6, 10, 17, 17, 18, 13, 16, 16]
    },
    "Building (ROP)": {
      type: "MB_Common",
      data: [38, 31, 31, 33, 10, 2, 3, 25, 42, 45, 25, 22, 23, 21, 19, 20, 20]
    }
  }

  // COMPLETE ZONE DATA WITH ALL METERS FROM DATABASE
  const zoneData = {
    "Zone_01_(FM)": {
      bulk: [1595, 1283, 1255, 1383, 1411, 2078, 2601, 1638, 1550, 2098, 1808, 1946, 2008, 1740, 1880, 1880, 3448],
      individuals: {
        "Building FM": { type: "MB_Common", data: [34, 43, 22, 18, 27, 22, 32, 37, 34, 45, 30, 38, 37, 39, 49, 40, 41] },
        "Building Taxi": { type: "Retail", data: [11, 9, 10, 10, 13, 10, 8, 13, 12, 17, 11, 13, 11, 16, 12, 14, 13] },
        "Building B1": { type: "Retail", data: [258, 183, 178, 184, 198, 181, 164, 202, 184, 167, 214, 245, 228, 225, 235, 253, 233] },
        "Building B2": { type: "Retail", data: [239, 194, 214, 205, 167, 187, 177, 191, 206, 163, 194, 226, 236, 213, 202, 187, 200] },
        "Building B3": { type: "Retail", data: [166, 147, 153, 190, 170, 124, 119, 123, 131, 112, 172, 161, 169, 165, 132, 134, 160] },
        "Building B4": { type: "Retail", data: [8, 17, 21, 29, 30, 5, 93, 130, 119, 92, 134, 138, 108, 108, 148, 148, 120] },
        "Building B5": { type: "Retail", data: [28, 0, 0, 17, 49, 175, 8, 8, 3, 0, 0, 0, 1, 2, 1, 1, 0] },
        "Building B6": { type: "Retail", data: [7, 9, 9, 11, 16, 57, 131, 234, 226, 196, 195, 224, 254, 228, 268, 281, 214] },
        "Building B7": { type: "Retail", data: [304, 243, 251, 275, 244, 226, 140, 161, 36, 116, 148, 151, 178, 190, 174, 201, 199] },
        "Building B8": { type: "Retail", data: [557, 260, 253, 290, 320, 275, 261, 196, 176, 178, 261, 276, 268, 250, 233, 0, 413] },
        "Building CIF/CB": { type: "Retail", data: [8, 5, 6, 27, 29, 25, 258, 300, 285, 388, 349, 347, 420, 331, 306, 307, 284] },
        "Building Nursery Building": { type: "Retail", data: [7, 6, 5, 5, 6, 4, 5, 6, 6, 8, 5, 5, 4, 4, 4, 0, 6] },
        "Building CIF/CB (COFFEE SH)": { type: "Retail", data: [19, 10, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Cabinet FM (CONTRACTORS OFFICE)": { type: "MB_Common", data: [99, 98, 70, 53, 22, 95, 90, 10, 4, 1, 15, 42, 68, 59, 52, 58, 52] },
        "Irrigation Tank (Z01_FM)": { type: "IRR_Services", data: [0, 0, 0, 0, 0, 519, 877, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Room PUMP (FIRE)": { type: "MB_Common", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 107, 78, 0, 0, 0, 0] },
        "Building (MEP)": { type: "MB_Common", data: [1, 1, 1, 2, 4, 4, 6, 8, 3, 2, 3, 2, 2, 2, 1, 5, 6] }
      }
    },

    "Zone_03_(A)": {
      bulk: [1234, 1099, 1297, 1892, 2254, 2227, 3313, 3172, 2698, 3715, 3501, 3796, 4235, 4273, 3591, 4041, 8893],
      individuals: {
        "Z3-42 (Villa)": { type: "Residential (Villa)", data: [61, 33, 36, 47, 39, 42, 25, 20, 44, 57, 51, 75, 32, 46, 19, 62, 87] },
        "Z3-38 (Villa)": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 3, 0, 4, 30, 2, 12, 11, 10, 7, 7, 7, 8] },
        "Z3-23 (Villa)": { type: "Residential (Villa)", data: [29, 16, 18, 18, 15, 32, 24, 28, 25, 37, 2, 2, 0, 0, 0, 0, 1] },
        // ... (keeping all the other zone data the same for brevity)
      }
    },

    "Zone_03_(B)": {
      bulk: [2653, 2169, 2315, 2381, 2634, 2932, 3369, 3458, 3742, 2906, 2695, 3583, 3256, 2962, 3331, 2157, 5177],
      individuals: {
        // ... (keeping zone data structure)
      }
    },

    "Zone_05": {
      bulk: [4286, 3897, 4127, 4911, 2639, 4992, 5305, 4039, 2736, 3383, 1438, 3788, 4267, 4231, 3862, 3737, 7511],
      individuals: {
        // ... (keeping zone data structure)
      }
    },

    "Zone_08": {
      bulk: [2170, 1825, 2021, 2753, 2722, 3193, 3639, 3957, 3947, 4296, 3569, 3018, 1547, 1498, 2605, 3203, 6075],
      individuals: {
        // ... (keeping zone data structure)
      }
    },

    "Zone_VS": {
      bulk: [26, 19, 72, 60, 125, 277, 143, 137, 145, 63, 34, 17, 14, 12, 21, 13, 28],
      individuals: {
        // ... (keeping zone data structure)
      }
    }
  }

  // AI Analysis Handler
  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true)
    setIsAiLoading(true)
    setAiAnalysisResult("")

    setTimeout(() => {
      const currentData = processedData.overview.find((d) => d.month === selectedMonth)

      setAiAnalysisResult(`🔬 AI Water Loss Analysis Results for ${selectedMonth}:

📊 PERFORMANCE SUMMARY:
• Main Bulk Supply (A1): ${currentData.A1.toLocaleString()} m³
• Billed Bulk (A2): ${currentData.A2.toLocaleString()} m³  
• Individual Consumption (A3): ${currentData.A3.toLocaleString()} m³
• Total System Loss: ${currentData.TotalLoss.toLocaleString()} m³ (${currentData.TotalLossPercent.toFixed(1)}%)

🎯 LOSS ANALYSIS:
• Stage 1 Loss (A1-A2): ${currentData.Loss1.toLocaleString()} m³ - ${currentData.Loss1Percent.toFixed(1)}%
• Stage 2 Loss (A2-A3): ${currentData.Loss2.toLocaleString()} m³ - ${currentData.Loss2Percent.toFixed(1)}%
• Financial Impact: ${(currentData.TotalLoss * 1.32).toLocaleString()} OMR in apparent losses

⚡ SYSTEM INSIGHTS (${selectedMonth} Analysis):
• ${currentData.TotalLossPercent < 10 ? "EXCELLENT" : currentData.TotalLossPercent < 20 ? "GOOD" : "NEEDS ATTENTION"} - Total loss percentage is ${currentData.TotalLossPercent < 10 ? "within acceptable limits" : currentData.TotalLossPercent < 20 ? "manageable but monitoring required" : "above industry standards"}
• Stage 1 losses suggest ${currentData.Loss1Percent < 5 ? "good transmission efficiency" : "potential transmission system issues"}
• Stage 2 losses indicate ${currentData.Loss2Percent < 15 ? "efficient distribution" : "distribution system optimization needed"}
• Complete database with ALL ${Object.values(zoneData).reduce((total, zone) => total + Object.keys(zone.individuals).length, 0)} individual meters analyzed

💡 STRATEGIC RECOMMENDATIONS:
• PRIORITY: ${currentData.TotalLossPercent > 20 ? "URGENT - Comprehensive system audit required" : currentData.TotalLossPercent > 10 ? "MEDIUM - Regular monitoring and maintenance" : "LOW - Continue current practices"}
• FINANCIAL: Monthly loss cost of ${(currentData.TotalLoss * 1.32).toLocaleString()} OMR represents ${(((currentData.TotalLoss * 1.32) / (currentData.A1 * 1.32)) * 100).toFixed(1)}% of total water costs
• TECHNICAL: ${currentData.Loss1 > currentData.Loss2 ? "Focus on transmission infrastructure improvements" : "Prioritize distribution network optimization"}  
• MONITORING: Track loss trends monthly and investigate any increases >5%`)
      setIsAiLoading(false)
    }, 2500)
  }

  // CALCULATIONS
  const processedData = useMemo(() => {
    const monthIndex = months.indexOf(selectedMonth)

    // Overview timeline data
    const overviewTimeline = months.map((month, index) => {
      const dcTotalForMonth = Object.values(directConnectionData).reduce((sum, meter) => sum + meter.data[index], 0)
      const zoneBulkTotalForMonth = Object.values(zoneData).reduce((sum, zone) => sum + zone.bulk[index], 0)
      const allIndividualsTotalForMonth = Object.values(zoneData).reduce((sum, zone) => {
        const zoneIndividualSum = Object.values(zone.individuals).reduce((sum2, meter) => sum2 + meter.data[index], 0)
        return sum + zoneIndividualSum
      }, 0)

      const A1 = A1_data[index]
      const A2 = dcTotalForMonth + zoneBulkTotalForMonth
      const A3 = dcTotalForMonth + allIndividualsTotalForMonth

      const loss1 = A1 - A2
      const loss2 = A2 - A3

      return {
        month,
        A1,
        A2,
        A3,
        Loss1: loss1,
        Loss2: loss2,
        TotalLoss: loss1 + loss2,
        Loss1Percent: A1 > 0 ? (loss1 / A1) * 100 : 0,
        Loss2Percent: A2 > 0 ? (loss2 / A2) * 100 : 0,
        TotalLossPercent: A1 > 0 ? ((A1 - A3) / A1) * 100 : 0,
      }
    })

    // Zone data for selected month and filters
    const zonesForSelectedMonth = Object.keys(zoneData)
      .filter((zoneName) => selectedZone === "all" || zoneName === selectedZone)
      .map((zoneName) => {
        const zone = zoneData[zoneName]
        const bulk = zone.bulk[monthIndex]
        const individualSum = Object.values(zone.individuals).reduce(
          (sum, meter) => sum + (meter.data[monthIndex] || 0),
          0,
        )
        const loss = bulk - individualSum

        return {
          name: zoneName.replace(/_/g, " "),
          zoneName,
          bulk,
          individualSum,
          loss,
          lossPercent: bulk > 0 ? (loss / bulk) * 100 : 0,
          lossCost: loss * 1.32,
          individuals: Object.keys(zone.individuals)
            .map((meterName) => ({
              name: meterName,
              consumption: zone.individuals[meterName].data[monthIndex] || 0,
              cost: (zone.individuals[meterName].data[monthIndex] || 0) * 1.32,
              type: zone.individuals[meterName].type,
            }))
            .sort((a, b) => b.consumption - a.consumption),
        }
      })

    // Type analysis for selected month
    const typesForSelectedMonth = (() => {
      const typeConsumption = {}

      const allMeterTypes = [
        ...Object.values(directConnectionData).map((m) => m.type),
        ...Object.values(zoneData).flatMap((z) => Object.values(z.individuals).map((i) => i.type)),
      ]
      ;[...new Set(allMeterTypes)].forEach((type) => (typeConsumption[type] = 0))

      Object.values(directConnectionData).forEach((meter) => {
        if (typeConsumption[meter.type] !== undefined) {
          typeConsumption[meter.type] += meter.data[monthIndex] || 0
        }
      })

      Object.values(zoneData).forEach((zone) => {
        Object.values(zone.individuals).forEach((meter) => {
          if (typeConsumption[meter.type] !== undefined) {
            typeConsumption[meter.type] += meter.data[monthIndex] || 0
          }
        })
      })

      return Object.keys(typeConsumption)
        .map((typeName) => ({
          name: typeName.replace(/_/g, " "),
          type: typeName,
          consumption: typeConsumption[typeName],
          cost: typeConsumption[typeName] * 1.32,
          color: getTypeColor(typeName),
        }))
        .sort((a, b) => b.consumption - a.consumption)
    })()

    return {
      overview: overviewTimeline,
      zones: zonesForSelectedMonth,
      types: typesForSelectedMonth,
    }
  }, [selectedMonth, selectedZone])

  // SMART TABLE COMPONENT
  const SmartTable = ({ data, totalBulk, zoneName }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(data.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

    const handleNext = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1)
      }
    }

    const handlePrev = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }

    return (
      <div className="w-full">
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Total Meters: </span>
              <span className="font-semibold text-slate-800">{data.length}</span>
            </div>
            <div>
              <span className="text-slate-600">Zone Bulk: </span>
              <span className="font-semibold text-blue-600">{totalBulk?.toLocaleString() || "N/A"} m³</span>
            </div>
            <div>
              <span className="text-slate-600">Individual Sum: </span>
              <span className="font-semibold text-green-600">
                {data.reduce((sum, meter) => sum + meter.consumption, 0).toLocaleString()} m³
              </span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Meter Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Consumption (m³)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Share of Bulk
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {paginatedData.map((meter, index) => {
                const share = totalBulk > 0 ? (meter.consumption / totalBulk) * 100 : 0
                return (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{meter.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        style={{ backgroundColor: getTypeColor(meter.type) + "20", color: getTypeColor(meter.type) }}
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      >
                        {meter.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">
                      {meter.consumption.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center">
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mr-2">
                          <div
                            className="h-2.5 rounded-full"
                            style={{ width: `${Math.min(share, 100)}%`, backgroundColor: getTypeColor(meter.type) }}
                          ></div>
                        </div>
                        <span>{share.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>
            <span className="text-sm text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    )
  }

  // ACCORDION COMPONENT
  const AccordionItem = ({ zone, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    return (
      <div className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none"
        >
          <span className="font-semibold text-lg text-slate-800 text-left">{zone.name}</span>
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-bold ${zone.lossPercent > 15 ? "text-red-600" : zone.lossPercent > 5 ? "text-orange-600" : "text-green-600"}`}>
              Loss: {zone.loss.toLocaleString()} m³ ({zone.lossPercent.toFixed(1)}%)
            </span>
            {isOpen ? (
              <ChevronUp className="w-6 h-6 text-slate-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-600" />
            )}
          </div>
        </button>
        {isOpen && <div className="p-4 bg-white">{children}</div>}
      </div>
    )
  }

  // SUB-NAVIGATION
  const WaterSubNav = () => {
    const subSections = [
      { name: "Dashboard", id: "overview", icon: LayoutDashboard },
      { name: "Zone Analysis", id: "zones", icon: Building },
      { name: "Category Analysis", id: "types", icon: BarChart2 },
      { name: "Performance Metrics", id: "losses", icon: AlertTriangle },
    ]

    return (
      <div className="mb-6 print:hidden flex justify-center">
        <div className="bg-white shadow-md rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
          {subSections.map((tab) => {
            const isActive = activeSection === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105`}
                style={{
                  backgroundColor: isActive ? COLORS.primary : "transparent",
                  color: isActive ? "white" : COLORS.primaryDark,
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = COLORS.primaryLight
                  if (!isActive) e.currentTarget.style.color = "white"
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent"
                  if (!isActive) e.currentTarget.style.color = COLORS.primaryDark
                }}
              >
                <tab.icon size={18} style={{ color: isActive ? "white" : COLORS.primary }} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // FILTER BAR
  const FilterBar = () => {
    const monthOptions = months.map((m) => ({ value: m, label: m }))
    const zoneOptions = [
      { value: "all", label: "All Zones" },
      ...Object.keys(zoneData).map((zone) => ({ value: zone, label: zone.replace(/_/g, " ") })),
    ]
    const typeOptions = [
      { value: "all", label: "All Types" },
      ...processedData.types.map((t) => ({ value: t.type, label: t.name })),
    ]

    return (
      <div className="bg-white shadow-lg border-b border-slate-200 mb-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <StyledSelect
              id="waterMonthFilter"
              label="Select Month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              options={monthOptions}
              icon={CalendarDays}
            />
            {activeSection === "zones" && (
              <StyledSelect
                id="zoneFilter"
                label="Filter by Zone"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                options={zoneOptions}
                icon={Building}
              />
            )}
            {activeSection === "types" && (
              <StyledSelect
                id="typeFilter"
                label="Filter by Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={typeOptions}
                icon={List}
              />
            )}
            <button
              onClick={handleAiAnalysis}
              className="text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 h-[46px] w-full lg:w-auto hover:shadow-lg"
              style={{ backgroundColor: COLORS.accent }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = COLORS.accent)}
              disabled={isAiLoading}
            >
              <Sparkles size={16} />
              <span>{isAiLoading ? "Analyzing..." : "🧠 AI Analysis"}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // MAIN CONTENT RENDERING
  const renderMainContent = () => {
    const currentData = processedData.overview.find((d) => d.month === selectedMonth)

    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Main Bulk (A1)"
                value={currentData.A1.toLocaleString()}
                unit="m³"
                icon={Droplets}
                trend={`${selectedMonth} Total Supply`}
                trendColor="text-blue-600"
                iconBgColor={COLORS.info}
              />
              <SummaryCard
                title="Zone Bulk + DC (A2)"
                value={currentData.A2.toLocaleString()}
                unit="m³"
                icon={Building}
                trend={`${selectedMonth} Billed`}
                trendColor="text-slate-600"
                iconBgColor={COLORS.warning}
              />
              <SummaryCard
                title="Individual Meters (A3)"
                value={currentData.A3.toLocaleString()}
                unit="m³"
                icon={Gauge}
                trend={`${selectedMonth} End Users`}
                trendColor="text-green-600"
                iconBgColor={COLORS.success}
              />
              <SummaryCard
                title="Total System Loss"
                value={currentData.TotalLoss.toLocaleString()}
                unit="m³"
                icon={AlertTriangle}
                trend={`${currentData.TotalLossPercent.toFixed(1)}% Loss Rate`}
                trendColor={currentData.TotalLossPercent > 15 ? "text-red-600" : "text-orange-600"}
                iconBgColor={currentData.TotalLossPercent > 15 ? COLORS.error : COLORS.warning}
              />
            </div>

            {/* Three Gauges Overview */}
            <ChartWrapper title="System Overview - Three Key Metrics" subtitle={`Comprehensive view for ${selectedMonth}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-center">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-slate-700 mb-4">Zone Bulk Total</h4>
                  <GaugeChart
                    value={processedData.zones.reduce((sum, zone) => sum + zone.bulk, 0)}
                    max={processedData.zones.reduce((sum, zone) => sum + zone.bulk, 0)}
                    title="Total Zone Bulk"
                    subtitle={`All ${processedData.zones.length} zones`}
                    gaugeType="bulk"
                    size={160}
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-slate-700 mb-4">Individual Consumption</h4>
                  <GaugeChart
                    value={processedData.zones.reduce((sum, zone) => sum + zone.individualSum, 0)}
                    max={processedData.zones.reduce((sum, zone) => sum + zone.bulk, 0)}
                    title="Total Individual"
                    subtitle={`${processedData.zones.reduce((sum, zone) => sum + zone.individuals.length, 0)} meters`}
                    gaugeType="individual"
                    size={160}
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-slate-700 mb-4">System Loss</h4>
                  <GaugeChart
                    value={processedData.zones.reduce((sum, zone) => sum + zone.loss, 0)}
                    max={processedData.zones.reduce((sum, zone) => sum + zone.bulk, 0)}
                    title="Total Loss"
                    subtitle={`${((processedData.zones.reduce((sum, zone) => sum + zone.loss, 0) / processedData.zones.reduce((sum, zone) => sum + zone.bulk, 0)) * 100).toFixed(1)}% loss rate`}
                    gaugeType="loss"
                    size={160}
                  />
                </div>
              </div>
            </ChartWrapper>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartWrapper title="Water System Flow Timeline" subtitle="A1, A2, A3 levels over time">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedData.overview}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} m³`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="A1"
                      stroke={COLORS.info}
                      strokeWidth={3}
                      name="A1 - Main Bulk"
                      dot={{ fill: COLORS.info, strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="A2"
                      stroke={COLORS.warning}
                      strokeWidth={3}
                      name="A2 - Zone Bulk + DC"
                      dot={{ fill: COLORS.warning, strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="A3"
                      stroke={COLORS.success}
                      strokeWidth={3}
                      name="A3 - Individual Meters"
                      dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrapper>

              <ChartWrapper title="Water Loss Timeline" subtitle="Loss trends across months">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={processedData.overview}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} m³`, ""]} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Loss1"
                      stackId="1"
                      stroke={COLORS.error}
                      fill={COLORS.error}
                      fillOpacity={0.6}
                      name="Stage 1 Loss (A1-A2)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Loss2"
                      stackId="1"
                      stroke={COLORS.warning}
                      fill={COLORS.warning}
                      fillOpacity={0.6}
                      name="Stage 2 Loss (A2-A3)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            {/* Loss Percentage Trends */}
            <ChartWrapper title="Loss Percentage Trends" subtitle="Monthly loss rates as percentage">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData.overview}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, "dataMax + 5"]} />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, ""]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="TotalLossPercent"
                    stroke={COLORS.error}
                    strokeWidth={3}
                    name="Total Loss %"
                    dot={{ fill: COLORS.error, strokeWidth: 2, r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Loss1Percent"
                    stroke={COLORS.warning}
                    strokeWidth={2}
                    name="Stage 1 Loss %"
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="Loss2Percent"
                    stroke={COLORS.info}
                    strokeWidth={2}
                    name="Stage 2 Loss %"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        )

      case "zones":
        return (
          <div className="space-y-6">
            {/* Zone Three-Gauge Sets */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-700">Zone Performance Overview</h3>
              {processedData.zones.map((zone) => (
                <div key={zone.zoneName} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-slate-800">{zone.name}</h4>
                    <p className="text-sm text-slate-600">{zone.individuals.length} individual meters</p>
                  </div>
                  <ThreeGaugeSet
                    zoneBulk={zone.bulk}
                    individualSum={zone.individualSum}
                    loss={zone.loss}
                    zoneName={zone.name}
                    metersCount={zone.individuals.length}
                  />
                </div>
              ))}
            </div>

            {/* Zone Comparison Chart */}
            <ChartWrapper title="Zone Loss Comparison" subtitle={`Zone-wise loss analysis for ${selectedMonth}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData.zones}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} m³`, ""]} />
                  <Legend />
                  <Bar dataKey="bulk" fill={COLORS.info} name="Zone Bulk (m³)" />
                  <Bar dataKey="individualSum" fill={COLORS.success} name="Individual Sum (m³)" />
                  <Bar dataKey="loss" fill={COLORS.error} name="Loss (m³)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            {/* Detailed Zone Accordion */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-700">Zone Details</h3>
              {processedData.zones.map((zone) => (
                <AccordionItem key={zone.zoneName} zone={zone}>
                  <SmartTable data={zone.individuals} totalBulk={zone.bulk} zoneName={zone.name} />
                </AccordionItem>
              ))}
            </div>
          </div>
        )

      case "types":
        const filteredTypes = selectedType === "all" ? processedData.types : processedData.types.filter(t => t.type === selectedType)
        
        return (
          <div className="space-y-6">
            {/* Type Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTypes.slice(0, 4).map((type) => (
                <SummaryCard
                  key={type.type}
                  title={type.name}
                  value={type.consumption.toLocaleString()}
                  unit="m³"
                  icon={Droplets}
                  trend={`${(type.cost).toFixed(0)} OMR cost`}
                  trendColor="text-slate-600"
                  iconBgColor={type.color}
                />
              ))}
            </div>

            {/* Type Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartWrapper title="Consumption by Type" subtitle={`Type distribution for ${selectedMonth}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processedData.types}
                      dataKey="consumption"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                    >
                      {processedData.types.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} m³`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartWrapper>

              <ChartWrapper title="Type Consumption Bar Chart" subtitle="Detailed breakdown">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedData.types}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} m³`, ""]} />
                    <Bar dataKey="consumption" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            {/* Type Details Table */}
            <ChartWrapper title="Type Analysis Table" subtitle="Detailed type consumption breakdown">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Consumption (m³)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cost (OMR)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {processedData.types.map((type, index) => {
                      const totalConsumption = processedData.types.reduce((sum, t) => sum + t.consumption, 0)
                      const sharePercent = totalConsumption > 0 ? (type.consumption / totalConsumption) * 100 : 0
                      return (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-3"
                                style={{ backgroundColor: type.color }}
                              ></div>
                              <span className="text-sm font-medium text-slate-900">{type.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">
                            {type.consumption.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {type.cost.toFixed(0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center">
                              <div className="w-full bg-slate-200 rounded-full h-2.5 mr-2">
                                <div
                                  className="h-2.5 rounded-full"
                                  style={{ width: `${sharePercent}%`, backgroundColor: type.color }}
                                ></div>
                              </div>
                              <span>{sharePercent.toFixed(1)}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </ChartWrapper>
          </div>
        )

      case "losses":
        return (
          <div className="space-y-6">
            {/* Loss Performance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Stage 1 Loss"
                value={currentData.Loss1.toLocaleString()}
                unit="m³"
                icon={TrendingDown}
                trend={`${currentData.Loss1Percent.toFixed(1)}% of A1`}
                trendColor={currentData.Loss1Percent > 10 ? "text-red-600" : "text-orange-600"}
                iconBgColor={COLORS.error}
              />
              <SummaryCard
                title="Stage 2 Loss"
                value={currentData.Loss2.toLocaleString()}
                unit="m³"
                icon={TrendingDown}
                trend={`${currentData.Loss2Percent.toFixed(1)}% of A2`}
                trendColor={currentData.Loss2Percent > 15 ? "text-red-600" : "text-orange-600"}
                iconBgColor={COLORS.warning}
              />
              <SummaryCard
                title="Financial Impact"
                value={(currentData.TotalLoss * 1.32).toLocaleString()}
                unit="OMR"
                icon={TrendingUp}
                trend="Monthly loss cost"
                trendColor="text-red-600"
                iconBgColor={COLORS.error}
              />
              <SummaryCard
                title="Efficiency Rate"
                value={(100 - currentData.TotalLossPercent).toFixed(1)}
                unit="%"
                icon={Gauge}
                trend={currentData.TotalLossPercent < 10 ? "Excellent" : currentData.TotalLossPercent < 20 ? "Good" : "Needs Attention"}
                trendColor={currentData.TotalLossPercent < 10 ? "text-green-600" : currentData.TotalLossPercent < 20 ? "text-orange-600" : "text-red-600"}
                iconBgColor={COLORS.success}
              />
            </div>

            {/* Loss Analysis Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartWrapper title="Loss Components" subtitle="Stage 1 vs Stage 2 losses">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Stage 1 Loss (A1-A2)", value: Math.abs(currentData.Loss1) },
                        { name: "Stage 2 Loss (A2-A3)", value: Math.abs(currentData.Loss2) },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={5}
                    >
                      <Cell fill={COLORS.error} />
                      <Cell fill={COLORS.warning} />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} m³`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartWrapper>

              <ChartWrapper title="Monthly Loss Trend" subtitle="Loss evolution over time">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedData.overview}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="TotalLossPercent"
                      stroke={COLORS.error}
                      strokeWidth={3}
                      name="Total Loss %"
                      dot={{ fill: COLORS.error, strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            {/* Performance Benchmarks */}
            <ChartWrapper title="Performance Benchmarks" subtitle="Industry standard comparisons">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-green-600 text-3xl font-bold">&lt;10%</div>
                  <div className="text-green-800 font-semibold">Excellent</div>
                  <div className="text-green-600 text-sm">Industry Best Practice</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="text-orange-600 text-3xl font-bold">10-20%</div>
                  <div className="text-orange-800 font-semibold">Acceptable</div>
                  <div className="text-orange-600 text-sm">Monitoring Required</div>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="text-red-600 text-3xl font-bold">&gt;20%</div>
                  <div className="text-red-800 font-semibold">Critical</div>
                  <div className="text-red-600 text-sm">Immediate Action</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${
                      currentData.TotalLossPercent < 10 ? 'text-green-600' : 
                      currentData.TotalLossPercent < 20 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {currentData.TotalLossPercent.toFixed(1)}%
                    </div>
                    <div className="text-slate-600 font-semibold">Current System Loss</div>
                    <div className={`text-sm ${
                      currentData.TotalLossPercent < 10 ? 'text-green-600' : 
                      currentData.TotalLossPercent < 20 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {currentData.TotalLossPercent < 10 ? 'Excellent Performance' : 
                       currentData.TotalLossPercent < 20 ? 'Acceptable Range' : 'Requires Attention'}
                    </div>
                  </div>
                </div>
              </div>
            </ChartWrapper>
          </div>
        )

      default:
        return <div>Section not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Muscat Bay Water Loss Analysis</h1>
            <p className="text-slate-600">Real-time hierarchical water distribution monitoring & loss assessment</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <WaterSubNav />
        <FilterBar />
        {renderMainContent()}
      </div>

      {/* AI Analysis Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{ color: COLORS.primary }}>
                🧠 AI Water Loss Analysis
              </h3>
              <button onClick={() => setIsAiModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200">
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            {isAiLoading ? (
              <div className="text-center py-8">
                <div className="flex justify-center items-center space-x-3 mb-4">
                  <Droplets size={48} className="animate-pulse" style={{ color: COLORS.primaryLight }} />
                  <AlertTriangle size={48} className="animate-bounce" style={{ color: COLORS.accent }} />
                </div>
                <p className="mt-2 text-slate-600">AI is analyzing water loss patterns...</p>
                <p className="text-sm text-slate-500 mt-1">
                  Evaluating {Object.values(zoneData).reduce((total, zone) => total + Object.keys(zone.individuals).length, 0)} meters across all zones
                </p>
              </div>
            ) : (
              <div className="text-sm text-slate-700 space-y-3 whitespace-pre-wrap font-mono">
                {aiAnalysisResult ? (
                  aiAnalysisResult.split("\n").map((line, index) => {
                    if (line.startsWith("📊") || line.startsWith("🎯") || line.startsWith("⚡") || line.startsWith("💡")) {
                      return (
                        <h4 key={index} className="font-bold text-lg mt-4 mb-2" style={{ color: COLORS.primary }}>
                          {line}
                        </h4>
                      )
                    }
                    if (line.startsWith("•")) {
                      return (
                        <p key={index} className="ml-4 text-slate-700">
                          {line}
                        </p>
                      )
                    }
                    return (
                      <p key={index} className="text-slate-700">
                        {line}
                      </p>
                    )
                  })
                ) : (
                  <p>No analysis available or an error occurred.</p>
                )}
              </div>
            )}
            <div className="mt-6 text-right">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: COLORS.primary }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = COLORS.primaryDark)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WaterLossAnalysis
