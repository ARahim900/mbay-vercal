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
import { COLORS } from "@/lib/constants"

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
// GAUGE CHART COMPONENT
// ===============================

const GaugeChart = ({ value, max, title, subtitle, color = COLORS.primary, size = 120 }) => {
  const percentage = Math.min((value / max) * 100, 100)
  const strokeDasharray = `${percentage * 2.51} 251` // 251 is approximately the circumference for radius 40
  
  const getColorByPercentage = (percent) => {
    if (percent <= 50) return COLORS.success
    if (percent <= 75) return COLORS.warning
    return COLORS.error
  }

  const gaugeColor = getColorByPercentage(percentage)

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
            strokeDashoffset="62.75" // Start from top
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
          <span className="text-xl font-bold text-slate-800">{percentage.toFixed(1)}%</span>
          <span className="text-xs text-slate-500">Loss</span>
        </div>
      </div>
      <div className="text-center mt-2">
        <h4 className="font-semibold text-sm text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500">{subtitle}</p>
        <div className="mt-1 text-xs">
          <span className="text-slate-600">Bulk: {max.toLocaleString()} m³</span>
          <br />
          <span className="text-slate-600">Individual: {(max - value).toLocaleString()} m³</span>
          <br />
          <span className="text-red-600 font-semibold">Loss: {value.toLocaleString()} m³</span>
        </div>
      </div>
    </div>
  )
}

// ===============================
// MAIN WATER ANALYSIS COMPONENT
// ===============================

const WaterLossAnalysis = () => {
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedMonth, setSelectedMonth] = useState("May-25") // Default to May-25
  const [selectedZone, setSelectedZone] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  // --- DATA ---
  const months = [
    "Jan-24",
    "Feb-24",
    "Mar-24",
    "Apr-24",
    "May-24",
    "Jun-24",
    "Jul-24",
    "Aug-24",
    "Sep-24",
    "Oct-24",
    "Nov-24",
    "Dec-24",
    "Jan-25",
    "Feb-25",
    "Mar-25",
    "Apr-25",
    "May-25",
  ]

  // A1: Represents the main bulk water supply data over the months.
  const A1_data = [
    32803, 27996, 23860, 31869, 30737, 41953, 35166, 35420, 41341, 31519, 35290, 36733, 32580, 44043, 34915, 46039,
    58425,
  ]

  // Meters connected directly, not belonging to a specific sub-zone.
  const directConnectionData = {
    "Irrigation Tank 04 - (Z08)": {
      type: "IRR_Services",
      data: [764, 509, 440, 970, 1165, 1475, 782, 559, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    "Sales Center Common Building": {
      type: "MB_Common",
      data: [45, 46, 37, 35, 61, 32, 36, 28, 25, 41, 54, 62, 76, 68, 37, 67, 69],
    },
    "Building (Security)": { type: "MB_Common", data: [33, 31, 30, 32, 9, 4, 4, 4, 5, 6, 10, 17, 17, 18, 13, 16, 18] },
    "Building (ROP)": { type: "MB_Common", data: [38, 31, 31, 33, 10, 2, 3, 25, 42, 45, 25, 22, 23, 21, 19, 20, 21] },
    "Irrigation Tank 01 (Inlet)": { type: "IRR_Services", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    "Hotel Main Building": {
      type: "Retail",
      data: [
        14012, 12880, 11222, 13217, 13980, 15385, 12810, 13747, 13031, 17688, 15156, 14668, 18048, 19482, 22151, 27676,
        26963,
      ],
    },
    "Community Mgmt - Technical Zone, STP": {
      type: "MB_Common",
      data: [28, 47, 34, 27, 24, 51, 18, 23, 22, 17, 14, 25, 29, 37, 25, 35, 35],
    },
    "PHASE 02, MAIN ENTRANCE (Infrastructure)": {
      type: "MB_Common",
      data: [34, 33, 35, 40, 40, 49, 24, 11, 12, 12, 12, 10, 11, 8, 6, 7, 7],
    },
    "Irrigation- Controller UP": {
      type: "IRR_Services",
      data: [647, 297, 318, 351, 414, 1038, 1636, 1213, 1410, 1204, 124, 53, 0, 0, 0, 1000, 945],
    },
    "Irrigation- Controller DOWN": {
      type: "IRR_Services",
      data: [1124, 907, 773, 628, 601, 891, 1006, 742, 860, 1559, 171, 185, 159, 239, 283, 411, 397],
    },
    "Al Adrak Construction": {
      type: "Retail",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 474, 1179, 494, 494, 597, 520, 580, 600, 2657],
    },
    "Al Adrak Camp": { type: "Retail", data: [0, 0, 0, 0, 0, 0, 0, 0, 193, 1073, 808, 808, 1038, 702, 1161, 1000, 1026] },
  }

  // Complete data for all zones with ALL meters included based on user's provided data
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
        "Building B5": { type: "Retail", data: [28, 0, 0, 17, 49, 175, 8, 8, 3, 0, 0, 0, 1, 2, 1, 1, 10] },
        "Building B6": { type: "Retail", data: [7, 9, 9, 11, 16, 57, 131, 234, 226, 196, 195, 224, 254, 228, 268, 281, 214] },
        "Building B7": { type: "Retail", data: [304, 243, 251, 275, 244, 226, 140, 161, 36, 116, 148, 151, 178, 190, 174, 201, 199] },
        "Building B8": { type: "Retail", data: [557, 260, 253, 290, 320, 275, 261, 196, 176, 178, 261, 276, 268, 250, 233, 0, 413] },
        "Irrigation Tank (Z01_FM)": { type: "IRR_Services", data: [0, 0, 0, 0, 0, 519, 877, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Room PUMP (FIRE)": { type: "MB_Common", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 107, 78, 0, 0, 0, 0] },
        "Building (MEP)": { type: "MB_Common", data: [1, 1, 1, 2, 4, 4, 6, 8, 3, 2, 3, 2, 2, 2, 1, 5, 6] },
        "Building CIF/CB": { type: "Retail", data: [8, 5, 6, 27, 29, 25, 258, 300, 285, 388, 349, 347, 420, 331, 306, 307, 284] },
        "Building Nursery Building": { type: "Retail", data: [7, 6, 5, 5, 6, 4, 5, 6, 6, 8, 5, 5, 4, 4, 4, 0, 6] },
        "Cabinet FM (CONTRACTORS OFFICE)": { type: "MB_Common", data: [99, 98, 70, 53, 22, 95, 90, 10, 4, 1, 15, 42, 68, 59, 52, 58, 52] },
        "Building CIF/CB (COFFEE SH)": { type: "Retail", data: [19, 10, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      },
    },
    "Zone_03_(A)": {
      bulk: [1234, 1099, 1297, 1892, 2254, 2227, 3313, 3172, 2698, 3715, 3501, 3796, 4235, 4273, 3591, 4041, 8893],
      individuals: {
        "Z3-42 (Villa)": { type: "Residential (Villa)", data: [61, 33, 36, 47, 39, 42, 25, 20, 44, 57, 51, 75, 32, 46, 19, 62, 87] },
        "Z3-38 (Villa)": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 3, 0, 4, 30, 2, 12, 11, 10, 7, 7, 7, 8] },
        "Z3-23 (Villa)": { type: "Residential (Villa)", data: [29, 16, 18, 18, 15, 32, 24, 28, 25, 37, 2, 2, 0, 0, 0, 0, 1] },
        "Z3-41 (Villa)": { type: "Residential (Villa)", data: [50, 38, 26, 20, 90, 66, 128, 192, 58, 53, 44, 22, 13, 18, 34, 26, 25] },
        "Z3-37 (Villa)": { type: "Residential (Villa)", data: [1, 2, 0, 1, 0, 0, 5, 13, 0, 1, 1, 3, 26, 15, 18, 28, 48] },
        "Z3-43 (Villa)": { type: "Residential (Villa)", data: [79, 67, 50, 62, 72, 75, 49, 83, 76, 91, 77, 70, 70, 68, 46, 52, 48] },
        "Z3-31 (Villa)": { type: "Residential (Villa)", data: [115, 105, 86, 81, 140, 135, 151, 258, 222, 37, 164, 176, 165, 133, 30, 306, 527] },
        "Z3-35 (Villa)": { type: "Residential (Villa)", data: [82, 78, 77, 67, 91, 54, 58, 70, 78, 92, 83, 69, 65, 61, 52, 74, 68] },
        "Z3-40 (Villa)": { type: "Residential (Villa)", data: [26, 18, 25, 19, 26, 19, 12, 10, 12, 36, 20, 20, 18, 23, 37, 37, 139] },
        "Z3-30 (Villa)": { type: "Residential (Villa)", data: [16, 14, 19, 26, 9, 8, 8, 0, 0, 1, 1, 0, 0, 0, 4, 0, 0] },
        "Z3-33 (Villa)": { type: "Residential (Villa)", data: [78, 32, 43, 36, 52, 68, 60, 60, 47, 76, 52, 45, 45, 45, 40, 50, 49] },
        "Z3-36 (Villa)": { type: "Residential (Villa)", data: [13, 11, 22, 44, 85, 68, 61, 58, 72, 102, 115, 93, 81, 83, 69, 83, 170] },
        "Z3-32 (Villa)": { type: "Residential (Villa)", data: [19, 25, 32, 29, 13, 0, 30, 31, 38, 57, 44, 30, 38, 39, 33, 38, 40] },
        "Z3-39 (Villa)": { type: "Residential (Villa)", data: [67, 33, 35, 40, 27, 51, 24, 38, 35, 47, 34, 37, 39, 36, 29, 33, 41] },
        "Z3-34 (Villa)": { type: "Residential (Villa)", data: [1, 12, 9, 30, 14, 0, 0, 0, 0, 0, 0, 31, 0, 0, 0, 20, 17] },
        "Z3-27 (Villa)": { type: "Residential (Villa)", data: [0, 0, 0, 0, 8, 0, 5, 0, 4, 0, 8, 59, 15, 32, 55, 73, 26] },
        "Z3-24 (Villa)": { type: "Residential (Villa)", data: [10, 8, 10, 7, 15, 7, 6, 7, 4, 5, 4, 15, 18, 39, 78, 101, 75] },
        "Z3-25 (Villa)": { type: "Residential (Villa)", data: [15, 12, 9, 9, 25, 11, 15, 6, 0, 0, 0, 0, 3, 0, 0, 0, 0] },
        "Z3-26 (Villa)": { type: "Residential (Villa)", data: [10, 69, 13, 21, 17, 18, 13, 4, 4, 3, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-29 (Villa)": { type: "Residential (Villa)", data: [12, 5, 9, 12, 9, 9, 7, 1, 0, 2, 0, 1, 0, 7, 3, 2, 0] },
        "Z3-28 (Villa)": { type: "Residential (Villa)", data: [32, 2, 3, 21, 45, 44, 45, 46, 46, 59, 36, 41, 44, 38, 30, 41, 53] },
        "Z3-46(5) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 4] },
        "Z3-49(3) (Building)": { type: "Residential (Apart)", data: [1, 1, 22, 30, 18, 6, 7, 11, 7, 10, 9, 5, 10, 15, 11, 13, 11] },
        "Z3-75(4) (Building)": { type: "Residential (Apart)", data: [0, 14, 3, 0, 0, 0, 0, 0, 0, 0, 7, 6, 0, 0, 0, 0, 0] },
        "Z3-46(3A) (Building)": { type: "Residential (Apart)", data: [13, 7, 6, 25, 27, 30, 35, 41, 29, 44, 32, 43, 38, 35, 15, 35, 42] },
        "Z3-049(4) (Building)": { type: "Residential (Apart)", data: [11, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8, 1, 8, 0, 0] },
        "Z3-46(1A) (Building)": { type: "Residential (Apart)", data: [9, 10, 10, 11, 10, 10, 11, 11, 12, 17, 11, 13, 11, 10, 10, 11, 11] },
        "Z3-47(2) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 2, 2, 3, 1, 3, 1, 1, 1, 1, 1, 0] },
        "Z3-45(3A) (Building)": { type: "Residential (Apart)", data: [5, 8, 0, 2, 0, 2, 0, 0, 0, 1, 0, 2, 8, 4, 0, 1, 1] },
        "Z3-46(2A) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-46(6) (Building)": { type: "Residential (Apart)", data: [3, 2, 1, 1, 3, 3, 2, 2, 2, 2, 1, 2, 3, 1, 1, 5, 5] },
        "Z3-47(4) (Building)": { type: "Residential (Apart)", data: [15, 15, 26, 15, 22, 14, 23, 6, 16, 16, 8, 13, 11, 12, 0, 1, 0] },
        "Z3-45(5) (Building)": { type: "Residential (Apart)", data: [4, 3, 2, 10, 6, 8, 9, 3, 7, 22, 15, 10, 5, 3, 2, 2, 2] },
        "Z3-47(5) (Building)": { type: "Residential (Apart)", data: [8, 56, 13, 7, 2, 0, 1, 15, 0, 13, 5, 9, 36, 12, 11, 18, 16] },
        "Z3-45(6) (Building)": { type: "Residential (Apart)", data: [3, 3, 4, 20, 3, 8, 6, 4, 5, 6, 7, 4, 5, 18, 32, 42, 47] },
        "Z3-50(4) (Building)": { type: "Residential (Apart)", data: [15, 4, 7, 6, 11, 5, 6, 9, 6, 9, 8, 9, 6, 4, 6, 17, 6] },
        "Z3-74(3) (Building)": { type: "Residential (Apart)", data: [21, 54, 16, 6, 22, 5, 6, 12, 13, 24, 19, 12, 12, 19, 19, 27, 26] },
        "Z3-45(4A) (Building)": { type: "Residential (Apart)", data: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-50(5) (Building)": { type: "Residential (Apart)", data: [2, 0, 0, 1, 0, 1, 23, 10, 9, 8, 12, 8, 9, 10, 22, 11, 11] },
        "Z3-50(6) (Building)": { type: "Residential (Apart)", data: [6, 14, 16, 15, 16, 20, 1, 12, 17, 25, 21, 23, 21, 20, 18, 13, 16] },
        "Z3-44(1A) (Building)": { type: "Residential (Apart)", data: [0, 0, 20, 25, 23, 7, 0, 0, 2, 9, 8, 5, 11, 11, 10, 6, 11] },
        "Z3-44(1B) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-44(2A) (Building)": { type: "Residential (Apart)", data: [4, 2, 15, 20, 21, 1, 5, 2, 3, 7, 7, 2, 9, 3, 5, 10, 6] },
        "Z3-44(2B) (Building)": { type: "Residential (Apart)", data: [7, 3, 8, 3, 4, 2, 2, 4, 5, 9, 5, 8, 7, 7, 7, 8, 2] },
        "Z3-44(5) (Building)": { type: "Residential (Apart)", data: [148, 135, 126, 99, 15, 25, 61, 132, 115, 249, 208, 135, 118, 139, 38, 25, 5] },
        "Z3-44(6) (Building)": { type: "Residential (Apart)", data: [36, 20, 19, 16, 13, 9, 7, 9, 17, 39, 33, 33, 34, 37, 31, 37, 35] },
        "Z3-75(1) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 1, 1] },
        "Z3-75(3) (Building)": { type: "Residential (Apart)", data: [4, 0, 0, 0, 0, 2, 0, 0, 0, 3, 1, 4, 2, 7, 0, 6, 0] },
        "Z3-47(3) (Building)": { type: "Residential (Apart)", data: [14, 15, 14, 14, 19, 14, 16, 19, 13, 21, 17, 18, 18, 19, 17, 17, 19] },
        "Z3-48(3) (Building)": { type: "Residential (Apart)", data: [8, 8, 7, 8, 7, 3, 4, 8, 7, 10, 10, 3, 3, 5, 4, 4, 7] },
        "Z3-48(6) (Building)": { type: "Residential (Apart)", data: [1, 0, 0, 0, 0, 3, 5, 10, 0, 10, 1, 0, 0, 0, 0, 1, 0] },
        "Z3-46(4A) (Building)": { type: "Residential (Apart)", data: [1, 1, 1, 1, 1, 1, 0, 0, 1, 3, 1, 0, 4, 1, 0, 19, 5] },
        "Z3-74(5) (Building)": { type: "Residential (Apart)", data: [10, 2, 5, 5, 7, 6, 5, 7, 5, 4, 5, 7, 13, 7, 12, 16, 10] },
        "Z3-74(6) (Building)": { type: "Residential (Apart)", data: [32, 12, 6, 13, 9, 2, 3, 0, 2, 12, 6, 6, 12, 4, 4, 5, 5] },
        "Z3-50(3) (Building)": { type: "Residential (Apart)", data: [2, 8, 7, 6, 3, 4, 4, 5, 5, 9, 9, 7, 8, 13, 6, 0, 0] },
        "Z3-48(5) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 2, 4, 2, 4, 33, 16, 2, 1, 1, 0, 1] },
        "Z3-47(6) (Building)": { type: "Residential (Apart)", data: [18, 19, 27, 15, 10, 12, 6, 6, 16, 13, 23, 27, 29, 14, 16, 17, 9] },
        "Z3-49(5) (Building)": { type: "Residential (Apart)", data: [3, 6, 1, 1, 2, 0, 0, 2, 1, 10, 0, 0, 0, 5, 0, 0, 0] },
        "Z3-75(5) (Building)": { type: "Residential (Apart)", data: [0, 0, 11, 8, 9, 11, 8, 10, 12, 27, 22, 14, 16, 12, 12, 16, 16] },
        "Z3-49(6) (Building)": { type: "Residential (Apart)", data: [34, 26, 16, 15, 16, 34, 16, 4, 10, 36, 25, 26, 25, 22, 21, 27, 23] },
        "Z3-75(6) (Building)": { type: "Residential (Apart)", data: [52, 39, 21, 17, 24, 24, 20, 24, 19, 24, 40, 34, 35, 32, 35, 36, 25] },
        "Z3-74(1) (Building)": { type: "Residential (Apart)", data: [7, 7, 0, 0, 0, 0, 0, 0, 0, 9, 6, 1, 1, 0, 0, 1, 1] },
        "Z3-49(1) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 9, 3] },
        "Z3-49(2) (Building)": { type: "Residential (Apart)", data: [11, 15, 7, 6, 9, 11, 11, 14, 12, 11, 11, 12, 15, 15, 12, 15, 13] },
        "Z3-50(1) (Building)": { type: "Residential (Apart)", data: [32, 32, 36, 26, 35, 45, 1, 43, 24, 53, 32, 34, 22, 26, 28, 6, 1] },
        "Z3-45(1A) (Building)": { type: "Residential (Apart)", data: [8, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1] },
        "Z3-51(1) (Building)": { type: "Residential (Apart)", data: [12, 13, 13, 11, 18, 29, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1] },
        "Z3-51(2) (Building)": { type: "Residential (Apart)", data: [17, 21, 20, 17, 17, 19, 19, 24, 24, 39, 29, 29, 32, 28, 31, 30, 32] },
        "Z3-45(2A) (Building)": { type: "Residential (Apart)", data: [0, 8, 2, 6, 5, 0, 1, 0, 0, 5, 9, 2, 2, 7, 9, 11, 4] },
        "Z3-050(2) (Building)": { type: "Residential (Apart)", data: [2, 3, 4, 5, 2, 1, 0, 3, 0, 0, 2, 1, 0, 8, 0, 3, 0] },
        "Z3-47(1) (Building)": { type: "Residential (Apart)", data: [0, 0, 5, 0, 0, 0, 0, 1, 15, 13, 17, 9, 9, 11, 10, 15, 10] },
        "Z3-48(1) (Building)": { type: "Residential (Apart)", data: [0, 2, 0, 0, 0, 0, 1, 0, 0, 1, 28, 8, 3, 5, 4, 5, 14] },
        "Z3-74(2) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 6, 18, 11, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-58(5) (Building)": { type: "Residential (Apart)", data: [79, 43, 12, 31, 32, 32, 22, 29, 25, 36, 29, 29, 29, 23, 32, 30, 30] },
        "Z3-51(3) (Building)": { type: "Residential (Apart)", data: [7, 5, 6, 20, 24, 4, 6, 8, 9, 11, 14, 12, 13, 10, 9, 11, 14] },
        "Z3-75(2) (Building)": { type: "Residential (Apart)", data: [3, 2, 2, 1, 2, 5, 19, 7, 0, 0, 12, 5, 7, 7, 9, 8, 7] },
        "Z3-48(2) (Building)": { type: "Residential (Apart)", data: [0, 2, 2, 3, 5, 2, 8, 3, 4, 11, 2, 5, 3, 0, 4, 2, 0] },
        "Z3-74(4) (Building)": { type: "Residential (Apart)", data: [7, 17, 23, 27, 33, 29, 28, 24, 3, 0, 0, 0, 0, 2, 0, 0, 0] },
        "Z3-51(4) (Building)": { type: "Residential (Apart)", data: [20, 15, 13, 12, 9, 12, 11, 11, 9, 15, 9, 9, 11, 9, 12, 9, 11] },
        "Z3-051(5) (Building)": { type: "Residential (Apart)", data: [3, 0, 61, 0, 2, 4, 5, 8, 0, 0, 1, 1, 2, 5, 19, 6, 8] },
        "Z3-48(4) (Building)": { type: "Residential (Apart)", data: [13, 17, 14, 16, 2, 2, 7, 0, 0, 3, 4, 3, 5, 5, 5, 4, 2] },
        "Z3-51(6) (Building)": { type: "Residential (Apart)", data: [6, 0, 0, 9, 3, 4, 10, 4, 3, 9, 9, 18, 8, 2, 5, 6, 10] },
        "Z3-74(3) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 30] },
        "D 45-Building Common Meter": { type: "D_Building_Common", data: [3, 3, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1] },
        "D 50-Building Common Meter": { type: "D_Building_Common", data: [3, 5, 1, 2, 0, 1, 1, 1, 0, 2, 1, 0, 1, 1, 1, 1, 0] },
        "D 51-Building Common Meter": { type: "D_Building_Common", data: [4, 3, 2, 2, 1, 3, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 2] },
        "D 46-Building Common Meter": { type: "D_Building_Common", data: [3, 5, 2, 1, 51, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 2] },
        "D 74-Building Common Meter": { type: "D_Building_Common", data: [3, 3, 2, 1, 2, 0, 1, 1, 0, 2, 1, 1, 0, 1, 1, 2, 1] },
        "D 49-Building Common Meter": { type: "D_Building_Common", data: [3, 4, 1, 2, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 2, 1, 1] },
        "D 48-Building Common Meter": { type: "D_Building_Common", data: [3, 4, 1, 2, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0] },
        "D 47-Building Common Meter": { type: "D_Building_Common", data: [4, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 0] },
        "D 44-Building Common Meter": { type: "D_Building_Common", data: [3, 4, 2, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0, 1, 1] },
        "D 75-Building Common Meter": { type: "D_Building_Common", data: [4, 5, 2, 2, 2, 1, 2, 2, 2, 7, 6, 2, 3, 4, 3, 7, 9] }
      }
    },

    "Zone_03_(B)": {
      bulk: [2653, 2169, 2315, 2381, 2634, 2932, 3369, 3458, 3742, 2906, 2695, 3583, 3256, 2962, 3331, 2157, 5177],
      individuals: {
        "Z3-52(6) (Building)": { type: "Residential (Apart)", data: [27, 22, 19, 28, 27, 27, 298, 58, 14, 18, 17, 8, 10, 9, 9, 14, 12] },
        "Z3-21 (Villa)": { type: "Residential (Villa)", data: [37, 38, 24, 20, 31, 41, 9, 54, 263, 68, 45, 43, 41, 53, 42, 48, 51] },
        "Z3-20 (Villa)": { type: "Residential (Villa)", data: [2, 1, 1, 2, 2, 2, 6, 4, 10, 14, 10, 11, 12, 14, 7, 3, 6] },
        "Z3-13 (Villa)": { type: "Residential (Villa)", data: [24, 27, 23, 17, 20, 24, 10, 11, 5, 20, 16, 19, 20, 22, 18, 24, 20] },
        "Z3-52(4A) (Building)": { type: "Residential (Apart)", data: [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 6] },
        "Z3-52(3A) (Building)": { type: "Residential (Apart)", data: [1, 1, 1, 0, 1, 0, 1, 2, 8, 9, 8, 6, 6, 9, 5, 5, 12] },
        "Z3-62(6) (Building)": { type: "Residential (Apart)", data: [12, 14, 15, 14, 3, 0, 0, 0, 0, 0, 0, 1, 39, 19, 17, 11, 3] },
        "Z3-52(5) (Building)": { type: "Residential (Apart)", data: [13, 5, 6, 4, 7, 9, 6, 5, 6, 4, 3, 4, 5, 3, 4, 7, 9] },
        "Z3-15 (Villa)": { type: "Residential (Villa)", data: [53, 39, 32, 31, 34, 45, 43, 31, 37, 45, 36, 36, 40, 41, 35, 47, 44] },
        "Z3-14 (Villa)": { type: "Residential (Villa)", data: [55, 45, 42, 57, 66, 27, 31, 11, 16, 27, 30, 173, 166, 102, 30, 43, 32] },
        "Z3-62(1) (Building)": { type: "Residential (Apart)", data: [0, 3, 0, 0, 4, 19, 0, 0, 1, 9, 2, 1, 4, 1, 15, 10, 5] },
        "Z3-53(4B) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-60(1B) (Building)": { type: "Residential (Apart)", data: [12, 9, 10, 8, 9, 7, 11, 10, 10, 15, 12, 14, 14, 14, 9, 14, 13] },
        "Z3-59(4B) (Building)": { type: "Residential (Apart)", data: [10, 8, 9, 10, 8, 8, 8, 8, 1, 1, 0, 1, 3, 3, 0, 1, 0] },
        "Z3-60(3B) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0] },
        "Z3-60(4B) (Building)": { type: "Residential (Apart)", data: [7, 4, 4, 3, 6, 5, 5, 4, 4, 4, 0, 0, 1, 3, 5, 6, 4] },
        "Z3-52(2A) (Building)": { type: "Residential (Apart)", data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0] },
        "Z3-58(1B) (Building)": { type: "Residential (Apart)", data: [8, 9, 1, 1, 0, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 3] },
        "Z3-55(1B) (Building)": { type: "Residential (Apart)", data: [2, 2, 3, 0, 0, 0, 0, 1, 0, 0, 3, 4, 3, 4, 3, 3, 4] },
        "Z3-60(2B) (Building)": { type: "Residential (Apart)", data: [1, 2, 0, 1, 0, 1, 0, 0, 0, 1, 2, 4, 3, 0, 0, 11, 2] },
        "Z3-59(3A) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-53(6) (Building)": { type: "Residential (Apart)", data: [0, 0, 3, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-12 (Villa)": { type: "Residential (Villa)", data: [52, 95, 258, 55, 67, 111, 93, 120, 118, 178, 55, 67, 73, 59, 54, 181, 178] },
        "Z3-11 (Villa)": { type: "Residential (Villa)", data: [0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-4 (Villa)": { type: "Residential (Villa)", data: [105, 90, 96, 106, 126, 122, 156, 150, 97, 171, 56, 111, 90, 55, 22, 23, 113] },
        "Z3-17 (Villa)": { type: "Residential (Villa)", data: [11, 5, 8, 5, 14, 19, 18, 22, 14, 24, 17, 20, 19, 8, 5, 13, 15] },
        "Z3-18 (Villa)": { type: "Residential (Villa)", data: [62, 43, 36, 56, 47, 63, 59, 67, 46, 58, 42, 31, 36, 36, 33, 39, 76] },
        "Z3-3 (Villa)": { type: "Residential (Villa)", data: [78, 66, 80, 91, 84, 84, 83, 61, 67, 78, 69, 86, 66, 59, 63, 73, 176] },
        "Z3-7 (Villa)": { type: "Residential (Villa)", data: [27, 23, 14, 21, 30, 46, 23, 43, 24, 50, 34, 31, 38, 45, 46, 57, 58] },
        "Z3-10 (Villa)": { type: "Residential (Villa)", data: [37, 32, 31, 35, 47, 34, 40, 56, 41, 60, 33, 37, 78, 81, 62, 101, 88] },
        "Z3-1 (Villa)": { type: "Residential (Villa)", data: [6, 6, 3, 4, 5, 5, 5, 6, 5, 3, 4, 3, 4, 4, 5, 7, 7] },
        "Z3-9 (Villa)": { type: "Residential (Villa)", data: [68, 57, 76, 32, 17, 40, 38, 100, 60, 57, 70, 71, 67, 49, 55, 60, 69] },
        "Z3-2 (Villa)": { type: "Residential (Villa)", data: [111, 114, 97, 110, 57, 129, 113, 88, 74, 89, 52, 17, 6, 6, 8, 7, 38] },
        "Z3-19 (Villa)": { type: "Residential (Villa)", data: [38, 11, 9, 16, 15, 6, 6, 9, 6, 5, 11, 13, 138, 6, 26, 108, 77] },
        "Z3-6 (Villa)": { type: "Residential (Villa)", data: [34, 21, 29, 32, 34, 45, 49, 57, 39, 49, 40, 34, 31, 33, 38, 36, 29] },
        "Z3-22 (Villa)": { type: "Residential (Villa)", data: [24, 20, 17, 19, 22, 20, 36, 22, 15, 20, 15, 23, 32, 14, 53, 31, 32] },
        "Z3-16 (Villa)": { type: "Residential (Villa)", data: [43, 14, 16, 10, 38, 6, 1, 21, 6, 2, 3, 5, 1, 28, 2, 5, 22] },
        "Z3-5 (Villa)": { type: "Residential (Villa)", data: [52, 63, 47, 58, 42, 24, 68, 44, 40, 34, 26, 34, 40, 51, 42, 55, 51] },
        "Z3-8 (Villa)": { type: "Residential (Villa)", data: [56, 32, 19, 15, 49, 40, 38, 25, 49, 68, 181, 290, 83, 106, 196, 358, 414] },
        "Z3-52(1A) (Building)": { type: "Residential (Apart)", data: [5, 6, 4, 4, 4, 5, 5, 6, 8, 14, 16, 17, 19, 14, 5, 8, 7] },
        "Z3-62(2) (Building)": { type: "Residential (Apart)", data: [0, 1, 0, 16, 10, 9, 7, 17, 10, 14, 5, 17, 7, 10, 8, 11, 14] },
        "Z3-62(3) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-58(3B) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 3, 2, 6, 1, 9, 6, 6, 6, 6, 3, 29, 7] },
        "Z3-058(4B) (Building)": { type: "Residential (Apart)", data: [20, 7, 6, 4, 4, 5, 3, 5, 7, 5, 7, 4, 9, 8, 4, 6, 5] },
        "Z3-62(5) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-53(1A) (Building)": { type: "Residential (Apart)", data: [3, 10, 5, 9, 9, 7, 5, 8, 9, 13, 6, 7, 8, 9, 10, 12, 4] },
        "Z3-53(1B) (Building)": { type: "Residential (Apart)", data: [11, 10, 4, 4, 1, 9, 5, 5, 3, 9, 12, 12, 6, 8, 6, 8, 9] },
        "Z3-53(2A) (Building)": { type: "Residential (Apart)", data: [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-53(2B) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-53(3A) (Building)": { type: "Residential (Apart)", data: [8, 8, 4, 6, 2, 8, 4, 0, 0, 0, 0, 0, 0, 1, 0, 6, 0] },
        "Z3-53(3B) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 3, 1, 6, 5] },
        "Z3-53(4A) (Building)": { type: "Residential (Apart)", data: [6, 6, 3, 1, 0, 7, 0, 2, 5, 7, 5, 3, 0, 5, 0, 5, 0] },
        "Z3-53(5) (Building)": { type: "Residential (Apart)", data: [0, 0, 2, 0, 0, 0, 0, 0, 0, 3, 2, 2, 2, 1, 1, 0, 1] },
        "Z3-54(1A) (Building)": { type: "Residential (Apart)", data: [12, 6, 10, 11, 16, 12, 7, 5, 7, 10, 9, 14, 11, 12, 8, 13, 5] },
        "Z3-54(1B) (Building)": { type: "Residential (Apart)", data: [0, 0, 1, 0, 2, 1, 1, 0, 1, 0, 2, 1, 1, 1, 5, 6, 3] },
        "Z3-54(2A) (Building)": { type: "Residential (Apart)", data: [2, 4, 3, 0, 0, 3, 16, 2, 1, 2, 4, 3, 3, 3, 3, 1, 0] },
        "Z3-54(2B) (Building)": { type: "Residential (Apart)", data: [8, 8, 8, 5, 10, 9, 7, 2, 4, 15, 18, 19, 20, 9, 19, 14, 10] },
        "Z3-54(3A) (Building)": { type: "Residential (Apart)", data: [8, 9, 7, 7, 9, 6, 8, 8, 7, 10, 10, 6, 8, 8, 3, 8, 5] },
        "Z3-54(3B) (Building)": { type: "Residential (Apart)", data: [0, 5, 6, 9, 1, 0, 0, 0, 0, 3, 11, 1, 1, 1, 0, 1, 0] },
        "Z3-54(4A) (Building)": { type: "Residential (Apart)", data: [0, 3, 0, 0, 0, 0, 4, 3, 0, 0, 4, 2, 0, 0, 0, 14, 0] },
        "Z3-54(4B) (Building)": { type: "Residential (Apart)", data: [0, 0, 1, 2, 1, 3, 0, 0, 0, 0, 1, 0, 0, 0, 1, 2, 0] },
        "Z3-54(5) (Building)": { type: "Residential (Apart)", data: [18, 20, 18, 21, 21, 21, 18, 17, 19, 21, 16, 16, 15, 18, 11, 19, 19] },
        "Z3-54(6) (Building)": { type: "Residential (Apart)", data: [1, 1, 2, 7, 2, 1, 2, 0, 0, 0, 20, 3, 5, 4, 4, 23, 8] },
        "Z3-55(1A) (Building)": { type: "Residential (Apart)", data: [0, 0, 4, 1, 1, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-55(2A) (Building)": { type: "Residential (Apart)", data: [26, 23, 19, 23, 25, 25, 27, 24, 16, 24, 21, 24, 23, 24, 5, 15, 26] },
        "Z3-55(2B) (Building)": { type: "Residential (Apart)", data: [2, 4, 4, 7, 5, 2, 6, 6, 2, 3, 5, 4, 3, 4, 5, 5, 4] },
        "Z3-55(3A) (Building)": { type: "Residential (Apart)", data: [1, 2, 1, 0, 2, 2, 9, 18, 11, 10, 12, 11, 17, 8, 4, 10, 12] },
        "Z3-55(3B) (Building)": { type: "Residential (Apart)", data: [1, 5, 6, 6, 3, 8, 2, 6, 8, 8, 6, 3, 7, 3, 5, 7, 5] },
        "Z3-55(4A) (Building)": { type: "Residential (Apart)", data: [8, 7, 8, 10, 6, 1, 4, 11, 7, 10, 8, 5, 4, 7, 7, 9, 6] },
        "Z3-55(4B) (Building)": { type: "Residential (Apart)", data: [9, 8, 10, 8, 7, 1, 1, 4, 2, 5, 4, 5, 6, 5, 5, 5, 3] },
        "Z3-55(5) (Building)": { type: "Residential (Apart)", data: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1] },
        "Z3-55(6) (Building)": { type: "Residential (Apart)", data: [46, 41, 33, 50, 66, 72, 16, 2, 14, 41, 20, 4, 7, 5, 68, 129, 31] },
        "Z3-56(1A) (Building)": { type: "Residential (Apart)", data: [5, 8, 3, 4, 4, 3, 2, 1, 1, 4, 3, 174, 50, 0, 0, 0, 0] },
        "Z3-56(1B) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1] },
        "Z3-56(2A) (Building)": { type: "Residential (Apart)", data: [1, 0, 1, 64, 31, 0, 0, 0, 0, 0, 2, 2, 2, 7, 0, 4, 6] },
        "Z3-56(2B) (Building)": { type: "Residential (Apart)", data: [5, 3, 3, 9, 2, 1, 0, 0, 0, 2, 5, 9, 5, 1, 8, 11, 2] },
        "Z3-56(3A) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z3-56(3B) (Building)": { type: "Residential (Apart)", data: [1, 10, 10, 12, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
        "Z3-56(4A) (Building)": { type: "Residential (Apart)", data: [0, 1, 5, 0, 0, 13, 18, 16, 0, 0, 0, 0, 0, 0, 4, 3, 2] },
        "Z3-56(4B) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 2, 4, 8, 1, 2, 3, 2, 7, 0, 0, 0, 0] },
        "Z3-56(5) (Building)": { type: "Residential (Apart)", data: [0, 7, 4, 7, 0, 2, 1, 1, 0, 5, 0, 1, 1, 2, 0, 1, 0] },
        "Z3-56(6) (Building)": { type: "Residential (Apart)", data: [0, 0, 3, 5, 1, 7, 4, 24, 17, 13, 6, 10, 14, 3, 17, 3, 0] },
        "Z3-57(1A) (Building)": { type: "Residential (Apart)", data: [6, 3, 3, 2, 6, 0, 2, 4, 4, 5, 2, 7, 2, 8, 0, 0, 2] },
        "Z3-57(1B) (Building)": { type: "Residential (Apart)", data: [1, 1, 0, 4, 0, 1, 10, 0, 0, 0, 0, 3, 3, 1, 0, 1, 0] },
        "Z3-57(2A) (Building)": { type: "Residential (Apart)", data: [5, 4, 4, 4, 5, 4, 3, 6, 5, 7, 5, 4, 4, 5, 5, 4, 5] },
        "Z3-57(2B) (Building)": { type: "Residential (Apart)", data: [5, 2, 0, 3, 0, 0, 0, 0, 0, 1, 2, 3, 1, 1, 5, 8, 11] },
        "Z3-57(3A) (Building)": { type: "Residential (Apart)", data: [7, 6, 7, 7, 24, 14, 5, 6, 5, 5, 5, 5, 6, 4, 5, 5, 7] },
        "Z3-57(3B) (Building)": { type: "Residential (Apart)", data: [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0] },
        "Z3-57(4A) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0] },
        "Z3-57(4B) (Building)": { type: "Residential (Apart)", data: [0, 2, 0, 0, 5, 1, 2, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0] },
        "Z3-57(5) (Building)": { type: "Residential (Apart)", data: [9, 4, 1, 17, 5, 9, 20, 27, 0, 12, 33, 29, 17, 14, 7, 21, 30] },
        "Z3-57(6) (Building)": { type: "Residential (Apart)", data: [0, 13, 0, 0, 2, 0, 18, 24, 0, 15, 1, 0, 10, 26, 22, 14, 13] },
        "Z3-58(1A) (Building)": { type: "Residential (Apart)", data: [10, 12, 4, 4, 3, 4, 3, 3, 2, 3, 2, 3, 3, 2, 4, 4, 3] },
        "Z3-58(2A) (Building)": { type: "Residential (Apart)", data: [10, 8, 0, 11, 0, 4, 3, 0, 2, 2, 0, 1, 0, 0, 4, 5, 0] },
        "Z3-58(2B) (Building)": { type: "Residential (Apart)", data: [2, 2, 0, 0, 2, 5, 4, 4, 1, 1, 3, 6, 5, 5, 1, 9, 6] },
        "Z3-58(3A) (Building)": { type: "Residential (Apart)", data: [13, 7, 1, 0, 0, 0, 0, 9, 10, 16, 10, 2, 0, 0, 0, 0, 12] },
        "Z3-58(4A) (Building)": { type: "Residential (Apart)", data: [2, 3, 0, 1, 0, 2, 2, 1, 1, 1, 2, 0, 0, 0, 1, 0, 0] },
        "Z3-58(6) (Building)": { type: "Residential (Apart)", data: [0, 0, 1, 0, 0, 0, 0, 3, 15, 16, 1, 1, 2, 3, 3, 9, 14] },
        "Z3-59(1A) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 4, 7, 7, 4, 5, 6] },
        "Z3-59(1B) (Building)": { type: "Residential (Apart)", data: [1, 4, 1, 1, 2, 1, 3, 2, 0, 1, 2, 2, 2, 4, 1, 0, 0] },
        "Z3-59(2A) (Building)": { type: "Residential (Apart)", data: [0, 0, 1, 17, 14, 8, 4, 7, 12, 11, 11, 8, 9, 13, 14, 14, 15] },
        "Z3-59(2B) (Building)": { type: "Residential (Apart)", data: [11, 13, 9, 12, 8, 13, 11, 19, 9, 12, 10, 17, 13, 15, 10, 16, 10] },
        "Z3-59(3B) (Building)": { type: "Residential (Apart)", data: [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 2, 1, 4, 3, 3, 0] },
        "Z3-59(4A) (Building)": { type: "Residential (Apart)", data: [12, 3, 26, 17, 61, 0, 0, 0, 9, 15, 10, 13, 10, 8, 6, 7, 5] },
        "Z3-59(5) (Building)": { type: "Residential (Apart)", data: [0, 8, 14, 8, 10, 6, 1, 8, 0, 16, 5, 3, 12, 3, 7, 11, 6] },
        "Z3-59(6) (Building)": { type: "Residential (Apart)", data: [10, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 14] },
        "Z3-60(1A) (Building)": { type: "Residential (Apart)", data: [2, 2, 2, 1, 1, 4, 1, 1, 0, 3, 2, 1, 3, 7, 6, 6, 6] },
        "Z3-60(2A) (Building)": { type: "Residential (Apart)", data: [5, 4, 5, 4, 0, 1, 0, 0, 0, 5, 4, 4, 4, 4, 3, 3, 4] },
        "Z3-60(3A) (Building)": { type: "Residential (Apart)", data: [11, 12, 12, 9, 0, 7, 7, 6, 7, 6, 11, 9, 5, 10, 15, 10, 7] },
        "Z3-60(4A) (Building)": { type: "Residential (Apart)", data: [5, 5, 4, 6, 4, 15, 7, 12, 6, 5, 6, 6, 6, 5, 5, 5, 7] },
        "Z3-60(5) (Building)": { type: "Residential (Apart)", data: [5, 1, 1, 0, 0, 0, 0, 0, 23, 25, 6, 0, 0, 0, 0, 0, 0] },
        "Z3-60(6) (Building)": { type: "Residential (Apart)", data: [27, 12, 42, 48, 95, 166, 72, 33, 27, 37, 28, 14, 20, 38, 39, 49, 45] },
        "Z3-61(1A) (Building)": { type: "Residential (Apart)", data: [0, 4, 0, 17, 15, 6, 2, 0, 0, 6, 8, 10, 2, 0, 3, 3, 1] },
        "Z3-61(1B) (Building)": { type: "Residential (Apart)", data: [4, 3, 1, 2, 3, 4, 3, 5, 3, 5, 14, 6, 9, 9, 2, 9, 2] },
        "Z3-61(2A) (Building)": { type: "Residential (Apart)", data: [21, 18, 17, 17, 18, 9, 18, 11, 0, 0, 0, 0, 0, 0, 11, 11, 12] },
        "Z3-61(2B) (Building)": { type: "Residential (Apart)", data: [1, 2, 1, 1, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 0, 1, 1] },
        "Z3-61(3A) (Building)": { type: "Residential (Apart)", data: [0, 4, 0, 1, 0, 2, 1, 2, 1, 4, 0, 0, 0, 7, 19, 23, 1] },
        "Z3-61(3B) (Building)": { type: "Residential (Apart)", data: [1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 5, 11] },
        "Z3-61(4A) (Building)": { type: "Residential (Apart)", data: [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 6, 7, 6, 11, 5, 9, 5] },
        "Z3-61(4B) (Building)": { type: "Residential (Apart)", data: [0, 0, 1, 7, 5, 2, 4, 7, 9, 9, 5, 8, 2, 5, 8, 4, 3] },
        "Z3-61(5) (Building)": { type: "Residential (Apart)", data: [0, 9, 11, 8, 2, 4, 0, 0, 0, 0, 8, 0, 6, 0, 1, 2, 0] },
        "Z3-61(6) (Building)": { type: "Residential (Apart)", data: [20, 8, 5, 23, 6, 17, 10, 6, 3, 1, 4, 9, 16, 16, 17, 17, 12] },
        "Irrigation Tank 02 (Z03)": { type: "IRR_Services", data: [42, 36, 74, 39, 31, 36, 45, 45, 30, 30, 29, 57, 49, 47, 43, 15, 319] },
        "D 52-Building Common Meter": { type: "D_Building_Common", data: [4, 3, 2, 2, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 4, 1] },
        "D 62-Building Common Meter": { type: "D_Building_Common", data: [4, 4, 2, 3, 1, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
        "D 53-Building Common Meter": { type: "D_Building_Common", data: [5, 2, 2, 1, 0, 0, 1, 1, 1, 2, 0, 1, 0, 1, 7, 2, 2] },
        "D 54-Building Common Meter": { type: "D_Building_Common", data: [5, 2, 4, 2, 0, 1, 2, 1, 0, 2, 1, 1, 0, 1, 1, 3, 1] },
        "D 55-Building Common Meter": { type: "D_Building_Common", data: [7, 3, 1, 2, 1, 0, 2, 1, 1, 3, 2, 2, 1, 1, 2, 3, 2] },
        "D 56-Building Common Meter": { type: "D_Building_Common", data: [4, 3, 1, 2, 0, 1, 2, 2, 2, 2, 1, 2, 1, 2, 8, 3, 4] },
        "D 57-Building Common Meter": { type: "D_Building_Common", data: [4, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 4, 7, 3] },
        "D 58-Building Common Meter": { type: "D_Building_Common", data: [4, 3, 1, 1, 1, 0, 1, 1, 0, 2, 1, 0, 1, 0, 0, 3, 0] },
        "D 59-Building Common Meter": { type: "D_Building_Common", data: [4, 2, 1, 2, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1] },
        "D 60-Building Common Meter": { type: "D_Building_Common", data: [4, 3, 2, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2] },
        "D 61-Building Common Meter": { type: "D_Building_Common", data: [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 2, 1] }
      }
    },
    Zone_05: {
      bulk: [4286, 3897, 4127, 4911, 2639, 4992, 5305, 4039, 2736, 3383, 1438, 3788, 4267, 4231, 3862, 3737, 7511],
      individuals: {
        // ALL Zone 05 meters from user's data
        "Z5-17": { type: "Residential (Villa)", data: [99, 51, 53, 62, 135, 140, 34, 132, 63, 103, 54, 148, 112, 80, 81, 90, 58] },
        "Z5-13": { type: "Residential (Villa)", data: [78, 73, 9, 46, 17, 83, 40, 80, 61, 56, 68, 85, 72, 106, 89, 120, 110] },
        "Z5-14": { type: "Residential (Villa)", data: [68, 56, 52, 250, 128, 100, 12, 20, 22, 22, 62, 72, 71, 93, 77, 93, 82] },
        "Z5-5": { type: "Residential (Villa)", data: [1, 2, 0, 3, 1, 8, 3, 0, 2, 13, 4, 3, 3, 6, 2, 5, 39] },
        "Z5-30": { type: "Residential (Villa)", data: [0, 1, 3, 53, 10, 1, 0, 17, 17, 4, 6, 60, 65, 87, 71, 113, 202] },
        "Z5-2": { type: "Residential (Villa)", data: [2, 2, 0, 0, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z5-10": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 4, 37, 0, 0, 0, 0] },
        "Z5-4": { type: "Residential (Villa)", data: [54, 40, 98, 36, 30, 52, 110, 85, 32, 38, 86, 100, 81, 98, 35, 49, 29] },
        "Z5-6": { type: "Residential (Villa)", data: [1, 0, 1, 0, 0, 0, 0, 0, 5, 12, 5, 2, 6, 3, 10, 5, 37] },
        "Z5 020": { type: "Residential (Villa)", data: [26, 13, 13, 20, 18, 34, 51, 3, 1, 0, 28, 24, 25, 30, 147, 164, 203] },
        "Z5-23": { type: "Residential (Villa)", data: [0, 0, 0, 5, 6, 56, 1, 0, 4, 11, 3, 0, 0, 22, 19, 0, 1] },
        "Z5-15": { type: "Residential (Villa)", data: [39, 33, 33, 27, 41, 60, 47, 40, 36, 51, 40, 37, 35, 19, 16, 23, 30] },
        "Z5-9": { type: "Residential (Villa)", data: [72, 97, 84, 96, 158, 82, 70, 74, 95, 134, 94, 56, 38, 49, 40, 56, 76] },
        "Z5-26": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 2, 0, 12, 18, 25, 61, 41, 16, 69, 107] },
        "Z5-25": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 24, 20, 37, 18, 37, 24, 10, 71, 104] },
        "Z5-31": { type: "Residential (Villa)", data: [7, 20, 0, 0, 0, 0, 189, 68, 61, 0, 0, 14, 33, 24, 14, 16, 4] },
        "Z5-33": { type: "Residential (Villa)", data: [0, 7, 3, 3, 0, 0, 0, 1, 18, 3, 0, 0, 2, 0, 24, 0, 18] },
        "Z5-29": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 1, 0, 68, 15, 21, 49, 66, 21, 20, 28] },
        "Z5-28": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 40, 0, 90, 16, 11, 50, 21, 9, 8, 14] },
        "Z5-32": { type: "Residential (Villa)", data: [0, 2, 2, 3, 0, 0, 0, 1, 47, 1, 3, 1, 59, 119, 71, 72, 67] },
        "Z5-22": { type: "Residential (Villa)", data: [89, 32, 38, 10, 36, 17, 21, 39, 0, 18, 25, 28, 15, 40, 186, 243, 202] },
        "Z5-7": { type: "Residential (Villa)", data: [2, 2, 1, 2, 2, 6, 2, 0, 2, 0, 0, 0, 0, 26, 14, 7, 5] },
        "Z5-27": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 12, 9, 9, 11, 36, 13, 19, 12, 15] },
        "Z5-12": { type: "Residential (Villa)", data: [59, 78, 49, 39, 89, 105, 90, 90, 84, 112, 89, 71, 44, 47, 40, 66, 81] },
        "Z5 024": { type: "Residential (Villa)", data: [19, 2, 0, 30, 1, 1, 1, 0, 0, 3, 4, 39, 68, 1, 0, 0, 0] },
        "Z5 016": { type: "Residential (Villa)", data: [306, 64, 6, 10, 34, 118, 363, 347, 16, 85, 67, 57, 27, 29, 37, 51, 53] },
        "Z5-21": { type: "Residential (Villa)", data: [2, 0, 0, 1, 1, 0, 3, 1, 0, 5, 13, 23, 25, 22, 34, 58, 57] },
        "Z5-3": { type: "Residential (Villa)", data: [1, 1, 0, 0, 1, 5, 24, 28, 68, 116, 205, 141, 149, 86, 67, 100, 71] },
        "Z5 019": { type: "Residential (Villa)", data: [4, 9, 6, 8, 9, 14, 8, 9, 8, 12, 6, 7, 5, 7, 6, 2, 57] },
        "Z5-1": { type: "Residential (Villa)", data: [0, 3, 8, 7, 43, 0, 1, 6, 88, 8, 5, 5, 5, 5, 4, 5, 47] },
        "Z5-11": { type: "Residential (Villa)", data: [15, 6, 10, 24, 13, 15, 16, 34, 50, 65, 71, 68, 30, 45, 3, 3, 9] },
        "Z5-18": { type: "Residential (Villa)", data: [5, 13, 11, 10, 12, 26, 10, 15, 35, 23, 23, 18, 8, 12, 11, 37, 30] },
        "Z5-8": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 1, 1, 3, 1, 3, 0, 5, 6, 12, 11, 67, 12] },
        "Irrigation Tank 03 (Z05)": { type: "IRR_Servies", data: [1223, 1016, 552, 808, 0, 347, 763, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] },
      },
    },
    Zone_08: {
      bulk: [2170, 1825, 2021, 2753, 2722, 3193, 3639, 3957, 3947, 4296, 3569, 3018, 1547, 1498, 2605, 3203, 6075],
      individuals: {
        // ALL Zone 08 meters from user's data
        "Z8-11": { type: "Residential (Villa)", data: [0, 1, 0, 0, 1, 23, 2, 2, 1, 1, 2, 0, 0, 1, 0, 0, 0] },
        "Z8-13": { type: "Residential (Villa)", data: [6, 2, 1, 1, 0, 15, 0, 0, 0, 3, 2, 1, 0, 0, 0, 0, 0] },
        "Z8-1": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 16, 6] },
        "Z8-2": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z8-3": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z8-4": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z8-6": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0] },
        "Z8-7": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z8-8": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z8-10": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z8-12": { type: "Residential (Villa)", data: [109, 148, 169, 235, 180, 235, 237, 442, 661, 417, 223, 287, 236, 192, 249, 267, 295] },
        "Z8-14": { type: "Residential (Villa)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "Z8-15": { type: "Residential (Villa)", data: [227, 74, 90, 145, 179, 100, 136, 152, 144, 87, 100, 90, 99, 61, 70, 125, 112] },
        "Z8-16": { type: "Residential (Villa)", data: [180, 165, 52, 147, 0, 62, 113, 86, 91, 112, 103, 98, 67, 72, 54, 98, 95] },
        "Z8-17": { type: "Residential (Villa)", data: [198, 135, 213, 190, 196, 138, 94, 220, 0, 191, 154, 155, 164, 162, 171, 207, 238] },
        "Z8-5": { type: "Residential (Villa)", data: [131, 117, 131, 142, 208, 247, 272, 344, 236, 280, 309, 314, 208, 341, 313, 336, 325] },
        "Z8-9": { type: "Residential (Villa)", data: [8, 8, 0, 4, 2, 5, 47, 51, 4, 14, 12, 25, 5, 12, 5, 4, 6] },
        "Z8-18": { type: "Residential (Villa)", data: [290, 212, 253, 418, 384, 478, 459, 410, 312, 196, 239, 149, 122, 111, 336, 0, 679] },
        "Z8-19": { type: "Residential (Villa)", data: [161, 147, 205, 271, 282, 340, 157, 306, 239, 197, 248, 125, 104, 87, 231, 0, 513] },
        "Z8-20": { type: "Residential (Villa)", data: [226, 210, 289, 358, 298, 313, 290, 297, 275, 219, 298, 158, 146, 110, 312, 0, 579] },
        "Z8-21": { type: "Residential (Villa)", data: [188, 173, 172, 320, 254, 344, 233, 243, 200, 119, 167, 101, 99, 72, 276, 0, 393] },
        "Z8-22": { type: "Residential (Villa)", data: [262, 168, 174, 366, 388, 418, 271, 343, 330, 138, 213, 177, 225, 156, 336, 0, 806] },
      },
    },
    Zone_VS: {
      bulk: [26, 19, 72, 60, 125, 277, 143, 137, 145, 63, 34, 17, 14, 12, 21, 13, 28],
      individuals: {
        // ALL Zone VS meters from user's data
        "Irrigation Tank - VS": { type: "IRR_Servies", data: [0, 0, 0, 2, 0, 157, 116, 71, 100, 0, 1, 0, 0, 0, 0, 0, 0] },
        "Coffee 1 (GF Shop No.591)": { type: "Retail", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, -3, 0] },
        "Coffee 2 (GF Shop No.594 A)": { type: "Retail", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 2, 3, 5, 5, 5] },
        "Supermarket (FF Shop No.591)": { type: "Retail", data: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0] },
        "Pharmacy (FF Shop No.591 A)": { type: "Retail", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0] },
        "Laundry Services (FF Shop No.593)": { type: "Retail", data: [0, 1, 16, 49, 32, 34, 32, 47, 34, 45, 52, 31, 33, 25, 22, 0, 43] },
        "Shop No.593 A": { type: "Retail", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] },
      },
    },
  }

  // Helper function to assign a color to each meter type for consistent visualization
  const getTypeColor = (type: string) => {
    const colors = {
      IRR_Services: COLORS.success, // Green for irrigation services
      IRR_Servies: COLORS.success, // Green for irrigation services (typo in data)
      MB_Common: COLORS.primary, // Primary color for main building
      Retail: COLORS.warning, // Amber for retail
      "Residential (Villa)": COLORS.info, // Blue for residential villas
      "Residential (Apart)": COLORS.secondary, // Purple for residential apartments
      D_Building_Common: COLORS.error, // Red for distribution building common
    }
    return colors[type] || "#64748b"
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

⚡ SYSTEM INSIGHTS (May 2025 Updated):
• ${currentData.TotalLossPercent < 10 ? "EXCELLENT" : currentData.TotalLossPercent < 20 ? "GOOD" : "NEEDS ATTENTION"} - Total loss percentage is ${currentData.TotalLossPercent < 10 ? "within acceptable limits" : currentData.TotalLossPercent < 20 ? "manageable but monitoring required" : "above industry standards"}
• Stage 1 losses suggest ${currentData.Loss1Percent < 5 ? "good transmission efficiency" : "potential transmission system issues"}
• Stage 2 losses indicate ${currentData.Loss2Percent < 15 ? "efficient distribution" : "distribution system optimization needed"}
• Data updated with latest May 2025 readings from Supabase

💡 STRATEGIC RECOMMENDATIONS:
• PRIORITY: ${currentData.TotalLossPercent > 20 ? "URGENT - Comprehensive system audit required" : currentData.TotalLossPercent > 10 ? "MEDIUM - Regular monitoring and maintenance" : "LOW - Continue current practices"}
• FINANCIAL: Monthly loss cost of ${(currentData.TotalLoss * 1.32).toLocaleString()} OMR represents ${(((currentData.TotalLoss * 1.32) / (currentData.A1 * 1.32)) * 100).toFixed(1)}% of total water costs
• TECHNICAL: ${currentData.Loss1 > currentData.Loss2 ? "Focus on transmission infrastructure improvements" : "Prioritize distribution network optimization"}
• MONITORING: Track loss trends monthly and investigate any increases >5%`)
      setIsAiLoading(false)
    }, 2500)
  }

  // --- CALCULATIONS ---
  const processedData = useMemo(() => {
    const monthIndex = months.indexOf(selectedMonth)

    // This data is for the entire timeline, used in trend charts.
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

    // This data is specific to the selected month and filtered zones.
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

  // --- UI COMPONENTS ---

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

  // Sub-navigation for water module
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

  // Filter Bar
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
              style={{ backgroundColor: "#4e4456" }}
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

  const KPICard = ({ title, value, unit, cost, trendInfo, color = "gray", icon }) => {
    const trendValue = trendInfo ? trendInfo.value : undefined
    const trendPeriod = trendInfo ? trendInfo.period : "previous month"
    const trendColor = trendValue >= 0 ? "text-red-600" : "text-green-600"

    return (
      <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4`} style={{ borderLeftColor: color }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-slate-700">{title}</h3>
          {icon && <div style={{ color }}>{icon}</div>}
        </div>
        <p className={`text-3xl font-bold text-slate-900`}>
          {typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : value}
          <span className="text-lg font-medium text-slate-500 ml-1">{unit}</span>
        </p>
        {typeof cost === "number" && (
          <p className="text-sm text-slate-500">
            Est. Cost: {cost.toLocaleString(undefined, { maximumFractionDigits: 0 })} OMR
          </p>
        )}
        {trendValue !== undefined && !isNaN(trendValue) && isFinite(trendValue) && (
          <div className={`flex items-center mt-2 text-sm ${trendColor}`}>
            {trendValue >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(trendValue).toFixed(1)}% vs {trendPeriod}
          </div>
        )}
      </div>
    )
  }

  // --- SECTIONS ---
  const OverviewSection = () => {
    const currentData = processedData.overview.find((d) => d.month === selectedMonth)

    return (
      <div className="space-y-6">
        {selectedMonth === "May-25" && (
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-4 text-center">
            <p className="text-green-800 font-semibold">
              🎉 UPDATED with CORRECTED May 2025 Data from Your Database
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard
            title="A1: Main Bulk (L1)"
            value={currentData.A1.toLocaleString()}
            unit="m³"
            icon={Droplets}
            trend={`For ${selectedMonth} - ${selectedMonth === "May-25" ? "CORRECTED from your database" : "Historical data"}`}
            trendColor={selectedMonth === "May-25" ? "text-green-600" : "text-blue-600"}
            iconBgColor={COLORS.info}
          />
          <SummaryCard
            title="A2: Billed Bulk (L2+DC)"
            value={currentData.A2.toLocaleString()}
            unit="m³"
            icon={Droplets}
            trend={`For ${selectedMonth} - ${selectedMonth === "May-25" ? "CORRECTED from your database" : "Historical data"}`}
            trendColor={selectedMonth === "May-25" ? "text-green-600" : "text-blue-600"}
            iconBgColor={COLORS.success}
          />
          <SummaryCard
            title="A3: Billed Indiv. (L3+DC)"
            value={currentData.A3.toLocaleString()}
            unit="m³"
            icon={Droplets}
            trend={`For ${selectedMonth} - ${selectedMonth === "May-25" ? "CORRECTED from your database" : "Historical data"}`}
            trendColor={selectedMonth === "May-25" ? "text-green-600" : "text-blue-600"}
            iconBgColor={COLORS.warning}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard
            title="Loss 1 (A1-A2)"
            value={currentData.Loss1.toLocaleString()}
            unit="m³"
            icon={AlertTriangle}
            trend={`${currentData.Loss1Percent.toFixed(1)}% of A1`}
            trendColor="text-red-600"
            iconBgColor={COLORS.error}
          />
          <SummaryCard
            title="Loss 2 (A2-A3)"
            value={currentData.Loss2.toLocaleString()}
            unit="m³"
            icon={AlertTriangle}
            trend={`${currentData.Loss2Percent.toFixed(1)}% of A2`}
            trendColor="text-orange-600"
            iconBgColor={COLORS.warning}
          />
          <SummaryCard
            title="Total Apparent Loss"
            value={currentData.TotalLoss.toLocaleString()}
            unit="m³"
            icon={AlertTriangle}
            trend={`${currentData.TotalLossPercent.toFixed(1)}% of total supply`}
            trendColor="text-red-600"
            iconBgColor={COLORS.error}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartWrapper title="Loss Trend Analysis (m³)" subtitle="Monthly water loss patterns">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData.overview}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "white", border: `2px solid #e2e8f0`, borderRadius: "8px" }}
                />
                <Legend />
                <Line type="monotone" dataKey="Loss1" stroke={COLORS.error} name="Loss 1 (m³)" strokeWidth={3} />
                <Line type="monotone" dataKey="Loss2" stroke={COLORS.warning} name="Loss 2 (m³)" strokeWidth={3} />
                <Line
                  type="monotone"
                  dataKey="TotalLoss"
                  stroke={COLORS.primary}
                  name="Total Loss (m³)"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <ChartWrapper title="Water Flow by Level (Last 6 Months)" subtitle="System hierarchy analysis">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData.overview.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "white", border: `2px solid #e2e8f0`, borderRadius: "8px" }}
                />
                <Legend />
                <Bar dataKey="A1" fill={COLORS.primary} name="A1 (Main Bulk)" />
                <Bar dataKey="A2" fill={COLORS.success} name="A2 (Billed Bulk)" />
                <Bar dataKey="A3" fill={COLORS.accent} name="A3 (Billed Indiv.)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      </div>
    )
  }

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
            <span className={`text-sm font-bold ${zone.lossPercent > 10 ? "text-red-600" : "text-orange-500"}`}>
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

  const ZoneDetailsSection = () => {
    const filteredZones =
      selectedZone === "all"
        ? processedData.zones
        : processedData.zones.filter((zone) => zone.name.replace(/\s/g, "_") === selectedZone)

    return (
      <div className="space-y-6">
        {/* Enhanced Gauge Charts Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
            <Gauge className="mr-2" />
            Zone Water Loss Analysis - {selectedMonth}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredZones.map((zone, index) => (
              <GaugeChart
                key={zone.zoneName}
                value={zone.loss}
                max={zone.bulk}
                title={zone.name}
                subtitle={`${zone.individuals.length} meters`}
                size={140}
              />
            ))}
          </div>
        </div>

        {/* Individual Meter Details by Zone - ENHANCED */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center">
            <Building className="mr-2" />
            Individual Meter Details by Zone - {selectedMonth}
          </h3>
          {filteredZones.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-slate-500">No zones found for the selected filters.</p>
            </div>
          ) : (
            filteredZones.map((zone, index) => (
              <AccordionItem key={zone.zoneName} zone={zone} defaultOpen={filteredZones.length === 1 || selectedZone !== "all"}>
                <SmartTable data={zone.individuals} totalBulk={zone.bulk} zoneName={zone.zoneName} />
              </AccordionItem>
            ))
          )}
        </div>
      </div>
    )
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, color }) => {
    if (percent < 0.02) return null // Don't render label for very small slices

    // Logic for line labels on smaller slices
    if (percent < 0.1) {
      const radius = outerRadius + 25
      const x = cx + radius * Math.cos(-midAngle * RADIAN)
      const y = cy + radius * Math.sin(-midAngle * RADIAN)
      const sin = Math.sin(-midAngle * RADIAN)
      const cos = Math.cos(-midAngle * RADIAN)
      const mx = cx + (outerRadius + 10) * cos
      const my = cy + (outerRadius + 10) * sin
      const ex = mx + (cos >= 0 ? 1 : -1) * 22
      const ey = my
      const textAnchor = cos >= 0 ? "start" : "end"

      return (
        <g>
          <path d={`M${mx},${my}L${ex},${ey}`} stroke={color} fill="none" />
          <circle cx={ex} cy={ey} r={2} fill={color} stroke="none" />
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={12}>
            {`${name} ${(percent * 100).toFixed(0)}%`}
          </text>
        </g>
      )
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const TypeDetailsSection = () => {
    const totalConsumption = processedData.types.reduce((sum, t) => sum + t.consumption, 0)

    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <ChartWrapper title="Consumption by Type" subtitle={`Breakdown for ${selectedMonth}`}>
            <div className="space-y-3">
              {processedData.types.map((type) => (
                <div key={type.type}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium" style={{ color: type.color }}>
                      {type.name}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{type.consumption.toLocaleString()} m³</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${totalConsumption > 0 ? (type.consumption / totalConsumption) * 100 : 0}%`,
                        backgroundColor: type.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </ChartWrapper>
        </div>
        <div className="lg:col-span-3">
          <ChartWrapper title="Type Distribution" subtitle="Percentage breakdown by category">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData.types}
                  dataKey="consumption"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {processedData.types.map((entry) => (
                    <Cell key={`cell-${entry.type}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} m³`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      </div>
    )
  }

  const LossDetailsSection = () => {
    const currentData = processedData.overview.find((d) => d.month === selectedMonth)
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Loss 1 %"
            value={currentData.Loss1Percent.toFixed(1)}
            unit="%"
            color={COLORS.error}
            icon={<AlertTriangle className="w-6 h-6" />}
          />
          <KPICard
            title="Loss 2 %"
            value={currentData.Loss2Percent.toFixed(1)}
            unit="%"
            color={COLORS.warning}
            icon={<AlertTriangle className="w-6 h-6" />}
          />
          <KPICard
            title="Total Loss %"
            value={currentData.TotalLossPercent.toFixed(1)}
            unit="%"
            color={COLORS.error}
            icon={<AlertTriangle className="w-6 h-6" />}
          />
          <KPICard
            title="Monthly Loss Cost"
            value={Math.round(currentData.TotalLoss * 1.32).toLocaleString()}
            unit="OMR"
            color={COLORS.warning}
          />
        </div>
        <ChartWrapper title="Loss Percentage Trends" subtitle="System efficiency analysis over time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData.overview} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} fontSize={12} />
              <YAxis unit="%" fontSize={12} />
              <Tooltip formatter={(value, name) => [`${value.toFixed(2)}%`, name]} />
              <Legend />
              <Area
                type="monotone"
                dataKey="Loss1Percent"
                stackId="1"
                stroke={COLORS.error}
                fill={COLORS.error}
                fillOpacity={0.6}
                name="Loss 1 %"
              />
              <Area
                type="monotone"
                dataKey="Loss2Percent"
                stackId="1"
                stroke={COLORS.warning}
                fill={COLORS.warning}
                fillOpacity={0.6}
                name="Loss 2 %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>
        <ChartWrapper title="Financial Impact of Losses by Zone" subtitle="Cost analysis by zone">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData.zones}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} OMR`} />
              <Legend />
              <Bar dataKey="lossCost" fill={COLORS.primary} name="Loss Cost (OMR)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />
      case "zones":
        return <ZoneDetailsSection />
      case "types":
        return <TypeDetailsSection />
      case "losses":
        return <LossDetailsSection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <div className="flex flex-col h-full">
      <WaterSubNav />
      <FilterBar />

      <div className="flex-1 overflow-y-auto">
        <main className="mt-6 p-4 md:p-6">{renderSection()}</main>

        {/* AI Analysis Modal */}
        {isAiModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold" style={{ color: COLORS.primary }}>
                  🧠 AI Water Analysis
                </h3>
                <button onClick={() => setIsAiModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
              {isAiLoading ? (
                <div className="text-center py-8">
                  <div className="flex justify-center items-center space-x-3 mb-4">
                    <Droplets size={48} className="animate-pulse" style={{ color: COLORS.primary }} />
                    <Sparkles size={48} className="animate-bounce" style={{ color: COLORS.accent }} />
                  </div>
                  <p className="mt-2 text-slate-600">AI is analyzing water system data...</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Evaluating flow patterns, loss analysis, and performance metrics
                  </p>
                </div>
              ) : (
                <div className="text-sm text-slate-700 space-y-3 whitespace-pre-wrap font-mono">
                  {aiAnalysisResult ? (
                    aiAnalysisResult.split("\n").map((line, index) => {
                      if (
                        line.startsWith("📊") ||
                        line.startsWith("🎯") ||
                        line.startsWith("⚡") ||
                        line.startsWith("💡")
                      ) {
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
    </div>
  )
}

export default WaterLossAnalysis
