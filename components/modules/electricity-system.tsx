"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  Filter, Search, Zap, DollarSign, ListTree, TrendingUp, BarChart3, Calendar, Download,
  Activity, Target, AlertCircle, Settings, PieChart, LineChart, Map, Users, Layers, 
  LayoutDashboard, ChevronDown, Maximize2, Minimize2, RefreshCw, Eye, EyeOff,
  ArrowUpDown, ArrowUp, ArrowDown, Clock, Globe, Award, Flame, ArrowRight,
  Star, CheckCircle, AlertTriangle, Info, Bell, MenuIcon, Grid3X3, BarChart4,
  TrendingDown, Percent, Calculator, FileBarChart, Bookmark, Share2, Heart
} from "lucide-react"
import { 
  useElectricityData,
  useMonthlyTrends,
  availableMonths, 
  getTotalConsumption, 
  getTotalCost, 
  getSystemsByCategory, 
  getTopConsumers, 
  getMonthlyTrends,
  KWH_TO_OMR_RATE,
  type ElectricityRecord,
  type TagColor,
  createLoadingData 
} from "@/lib/electricity-data"
import { SystemListItem } from "@/components/ui/system-list-item"
import { SummaryCard } from "@/components/ui/summary-card"
import { COLORS } from "@/lib/constants"
import { 
  LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell, AreaChart, Area, 
  ComposedChart, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  TreemapChart, Treemap, FunnelChart, Funnel, LabelList, Legend
} from "recharts"

interface ElectricitySystemModuleProps {
  isDarkMode?: boolean
}

type ElectricitySubSection = "Overview" | "Analytics" | "SystemDetails" | "Performance" | "Reports"

interface FilterState {
  search: string
  categories: string[]
  monthRange: [string, string]
  consumptionMin: number
  consumptionMax: number
  costMin: number
  costMax: number
  zones: string[]
  sortBy: 'name' | 'consumption' | 'cost' | 'efficiency'
  sortOrder: 'asc' | 'desc'
}

// Enhanced color palette for premium look
const PREMIUM_COLORS = {
  primary: "#3B82F6",
  primaryLight: "#60A5FA",
  primaryDark: "#1D4ED8",
  secondary: "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#06B6D4",
  slate: "#64748B",
  gradient: {
    blue: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    purple: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    green: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    orange: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    dark: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }
}

export function ElectricitySystemModule({ isDarkMode = false }: ElectricitySystemModuleProps) {
  const [activeSubSection, setActiveSubSection] = useState<ElectricitySubSection>("Overview")
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    monthRange: [availableMonths[0], availableMonths[availableMonths.length - 1]],
    consumptionMin: 0,
    consumptionMax: 100000,
    costMin: 0,
    costMax: 5000,
    zones: [],
    sortBy: 'consumption',
    sortOrder: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedChart, setSelectedChart] = useState<"area" | "line" | "bar" | "radar" | "scatter">("area")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPeriod, setSelectedPeriod] = useState('13months')

  // Fetch data from Supabase
  const { data: electricityData, loading: dataLoading, error: dataError } = useElectricityData()
  const { trends: monthlyTrendsData, loading: trendsLoading } = useMonthlyTrends()

  // Use loading data while fetching or fallback to empty array
  const initialElectricityData = dataLoading ? createLoadingData(10) : electricityData

  // Process data with enhanced calculations
  const systemsByCategory = useMemo(() => getSystemsByCategory(initialElectricityData), [initialElectricityData])
  const monthlyTrends = useMemo(() => {
    if (trendsLoading || Object.keys(monthlyTrendsData).length === 0) {
      return getMonthlyTrends(initialElectricityData)
    }
    return monthlyTrendsData
  }, [monthlyTrendsData, trendsLoading, initialElectricityData])
  const topConsumers = useMemo(() => getTopConsumers(initialElectricityData, 10), [initialElectricityData])

  // Get unique zones and categories
  const availableZones = useMemo(() => {
    const zones = [...new Set(initialElectricityData.map(s => s.zone).filter(z => z !== "N/A"))]
    return zones.sort()
  }, [initialElectricityData])

  const availableCategories = useMemo(() => Object.keys(systemsByCategory), [systemsByCategory])

  // Enhanced filtering with sorting
  const filteredData = useMemo(() => {
    let filtered = initialElectricityData.filter(system => {
      // Search filter
      if (filters.search && !system.unitName.toLowerCase().includes(filters.search.toLowerCase()) &&
          !system.meterType.toLowerCase().includes(filters.search.toLowerCase()) &&
          !system.meterAccountNo.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(system.category)) {
        return false
      }

      // Zone filter
      if (filters.zones.length > 0 && !filters.zones.includes(system.zone)) {
        return false
      }

      // Consumption range filter
      if (system.totalConsumption < filters.consumptionMin || system.totalConsumption > filters.consumptionMax) {
        return false
      }

      // Cost range filter
      if (system.totalCost < filters.costMin || system.totalCost > filters.costMax) {
        return false
      }

      return true
    })

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal
      switch (filters.sortBy) {
        case 'name':
          aVal = a.unitName.toLowerCase()
          bVal = b.unitName.toLowerCase()
          break
        case 'consumption':
          aVal = a.totalConsumption
          bVal = b.totalConsumption
          break
        case 'cost':
          aVal = a.totalCost
          bVal = b.totalCost
          break
        case 'efficiency':
          aVal = a.totalConsumption > 0 ? a.totalCost / a.totalConsumption : 0
          bVal = b.totalConsumption > 0 ? b.totalCost / b.totalConsumption : 0
          break
        default:
          aVal = a.totalConsumption
          bVal = b.totalConsumption
      }

      if (filters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [filters, initialElectricityData])

  // Enhanced KPI calculations with trends
  const kpiData = useMemo(() => {
    const filteredConsumption = filteredData.reduce((sum, s) => sum + s.totalConsumption, 0)
    const filteredCost = filteredData.reduce((sum, s) => sum + s.totalCost, 0)
    const averageConsumption = filteredData.length > 0 ? filteredConsumption / filteredData.length : 0
    const efficiency = filteredConsumption > 0 ? (filteredCost / filteredConsumption) * 1000 : 0

    // Calculate trends (mock calculation for demo)
    const growthRate = 3.2 // Mock growth rate
    const efficiencyTrend = -1.5 // Mock efficiency improvement
    const costTrend = 2.8 // Mock cost trend

    return {
      totalSystems: filteredData.length,
      totalConsumption: filteredConsumption,
      totalCost: filteredCost,
      averageConsumption,
      efficiency,
      activeMonths: availableMonths.length,
      growthRate,
      efficiencyTrend,
      costTrend,
      peakHour: "14:00", // Mock peak hour
      carbonFootprint: filteredConsumption * 0.42, // Mock carbon calculation
      sustainability: 78 // Mock sustainability score
    }
  }, [filteredData])

  // Enhanced chart data with advanced metrics
  const chartData = useMemo(() => {
    const startIdx = availableMonths.indexOf(filters.monthRange[0])
    const endIdx = availableMonths.indexOf(filters.monthRange[1])
    const selectedMonths = availableMonths.slice(startIdx, endIdx + 1)

    const monthlyData = selectedMonths.map((month, index) => {
      const monthConsumption = filteredData.reduce((sum, system) => {
        return sum + (system.consumption[month] || 0)
      }, 0)
      
      const prevConsumption = index > 0 ? selectedMonths[index - 1] : null
      const prevMonthConsumption = prevConsumption ? filteredData.reduce((sum, system) => {
        return sum + (system.consumption[prevConsumption] || 0)
      }, 0) : monthConsumption

      const trend = prevMonthConsumption > 0 ? ((monthConsumption - prevMonthConsumption) / prevMonthConsumption) * 100 : 0
      
      return {
        month,
        consumption: monthConsumption,
        cost: monthConsumption * KWH_TO_OMR_RATE,
        systems: filteredData.filter(s => (s.consumption[month] || 0) > 0).length,
        efficiency: monthConsumption > 0 ? (monthConsumption * KWH_TO_OMR_RATE / monthConsumption) * 1000 : 0,
        trend: Math.round(trend * 100) / 100,
        carbonFootprint: monthConsumption * 0.42
      }
    })

    return monthlyData
  }, [filteredData, filters.monthRange])

  // Enhanced category data with advanced metrics
  const categoryData = useMemo(() => {
    return Object.entries(systemsByCategory)
      .map(([category, systems]) => {
        const categoryFiltered = systems.filter(s => filteredData.some(f => f.id === s.id))
        const consumption = categoryFiltered.reduce((sum, s) => sum + s.totalConsumption, 0)
        const cost = consumption * KWH_TO_OMR_RATE
        
        return {
          category,
          consumption,
          cost,
          systems: categoryFiltered.length,
          efficiency: consumption > 0 ? cost / consumption * 1000 : 0,
          avgConsumption: categoryFiltered.length > 0 ? consumption / categoryFiltered.length : 0,
          percentage: (consumption / kpiData.totalConsumption) * 100,
          carbonFootprint: consumption * 0.42,
          sustainabilityScore: Math.random() * 20 + 60 // Mock sustainability score
        }
      })
      .filter(d => d.consumption > 0)
      .sort((a, b) => b.consumption - a.consumption)
  }, [systemsByCategory, filteredData, kpiData.totalConsumption])

  // Enhanced performance data
  const performanceData = useMemo(() => {
    if (categoryData.length === 0) return []
    
    const maxConsumption = Math.max(...categoryData.map(d => d.consumption))
    const maxCost = Math.max(...categoryData.map(d => d.cost))
    const maxSystems = Math.max(...categoryData.map(d => d.systems))
    
    return categoryData.slice(0, 6).map(d => ({
      category: d.category.substring(0, 12) + (d.category.length > 12 ? '...' : ''),
      consumption: (d.consumption / maxConsumption * 100),
      cost: (d.cost / maxCost * 100),
      systems: (d.systems / maxSystems * 100),
      efficiency: Math.min(d.efficiency, 100),
      sustainability: d.sustainabilityScore
    }))
  }, [categoryData])

  const chartColors = [
    PREMIUM_COLORS.primary, PREMIUM_COLORS.success, PREMIUM_COLORS.warning, 
    PREMIUM_COLORS.error, PREMIUM_COLORS.info, PREMIUM_COLORS.secondary
  ]

  // Enhanced filter handlers
  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleZoneFilter = (zone: string) => {
    setFilters(prev => ({
      ...prev,
      zones: prev.zones.includes(zone)
        ? prev.zones.filter(z => z !== zone)
        : [...prev.zones, zone]
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      monthRange: [availableMonths[0], availableMonths[availableMonths.length - 1]],
      consumptionMin: 0,
      consumptionMax: 100000,
      costMin: 0,
      costMax: 5000,
      zones: [],
      sortBy: 'consumption',
      sortOrder: 'desc'
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 2000)
  }

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting data...')
  }

  // Error state with enhanced design
  if (dataError && !dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <AlertCircle className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Connection Error</h1>
            <p className="text-slate-600 text-lg">
              Unable to load electricity data. Please check your connection and try again.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
            <button 
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Premium sub-navigation
  const ElectricitySubNav = () => {
    const subSections = [
      { name: "Overview", id: "Overview", icon: LayoutDashboard, color: PREMIUM_COLORS.primary },
      { name: "Analytics", id: "Analytics", icon: BarChart3, color: PREMIUM_COLORS.secondary },
      { name: "System Details", id: "SystemDetails", icon: ListTree, color: PREMIUM_COLORS.success },
      { name: "Performance", id: "Performance", icon: Target, color: PREMIUM_COLORS.warning },
      { name: "Reports", id: "Reports", icon: FileBarChart, color: PREMIUM_COLORS.info }
    ]

    return (
      <div className="mb-8 print:hidden">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-2 inline-flex space-x-2 border border-white/20">
          {subSections.map((tab) => {
            const isActive = activeSubSection === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubSection(tab.id as ElectricitySubSection)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all duration-300 ease-out transform ${
                  isActive 
                    ? "text-white shadow-lg scale-105" 
                    : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                }`}
                style={{ 
                  background: isActive ? `linear-gradient(135deg, ${tab.color}, ${tab.color}90)` : "transparent" 
                }}
              >
                <tab.icon size={20} />
                <span>{tab.name}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Premium Overview Section
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8" />
              <span className="text-blue-200 text-sm font-medium">Total Consumption</span>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">
                {dataLoading ? "..." : kpiData.totalConsumption.toLocaleString()}
                <span className="text-xl ml-1">kWh</span>
              </div>
              <div className="flex items-center text-blue-200 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{kpiData.growthRate}% vs last period
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <span className="text-green-200 text-sm font-medium">Total Cost</span>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">
                {dataLoading ? "..." : kpiData.totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}
                <span className="text-xl ml-1">OMR</span>
              </div>
              <div className="flex items-center text-green-200 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{kpiData.costTrend}% vs last period
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8" />
              <span className="text-purple-200 text-sm font-medium">Efficiency</span>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">
                {dataLoading ? "..." : kpiData.efficiency.toFixed(2)}
                <span className="text-xl ml-1">OMR/MWh</span>
              </div>
              <div className="flex items-center text-purple-200 text-sm">
                <TrendingDown className="w-4 h-4 mr-1" />
                {Math.abs(kpiData.efficiencyTrend)}% improvement
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8" />
              <span className="text-orange-200 text-sm font-medium">Active Systems</span>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">
                {dataLoading ? "..." : kpiData.totalSystems}
                <span className="text-xl ml-1">units</span>
              </div>
              <div className="flex items-center text-orange-200 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                {((kpiData.totalSystems / initialElectricityData.length) * 100).toFixed(1)}% operational
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Sustainability</h3>
            <Globe className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Carbon Footprint</span>
              <span className="font-semibold">{(kpiData.carbonFootprint / 1000).toFixed(1)}t CO₂</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Sustainability Score</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-slate-200 rounded-full mr-2">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" 
                    style={{ width: `${kpiData.sustainability}%` }}
                  />
                </div>
                <span className="font-semibold text-green-600">{kpiData.sustainability}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Peak Hour</span>
              <span className="font-semibold">{kpiData.peakHour}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Top Performers</h3>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {topConsumers.slice(0, 3).map((system, index) => (
              <div key={system.id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white`}
                     style={{ backgroundColor: chartColors[index] }}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{system.unitName}</p>
                  <p className="text-sm text-slate-500">{system.totalConsumption.toLocaleString()} kWh</p>
                </div>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">System Health</h3>
            <Heart className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Operational Systems</span>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="font-semibold text-green-600">{kpiData.totalSystems}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Average Efficiency</span>
              <span className="font-semibold">{kpiData.efficiency.toFixed(2)} OMR/MWh</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">System Uptime</span>
              <span className="font-semibold text-green-600">99.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Consumption Trends Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Consumption Trends</h3>
            <p className="text-slate-600">Monthly electricity usage patterns</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value as any)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium"
            >
              <option value="area">Area Chart</option>
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="scatter">Scatter Plot</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          {selectedChart === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PREMIUM_COLORS.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={PREMIUM_COLORS.primary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}
                formatter={(value: any) => [value.toLocaleString(), "Consumption (kWh)"]}
              />
              <Area 
                type="monotone" 
                dataKey="consumption" 
                stroke={PREMIUM_COLORS.primary} 
                fill="url(#colorTrend)"
                strokeWidth={3}
              />
            </AreaChart>
          ) : selectedChart === "line" ? (
            <RechartsLine data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke={PREMIUM_COLORS.primary} 
                strokeWidth={4}
                dot={{ fill: PREMIUM_COLORS.primary, strokeWidth: 2, r: 6 }}
              />
            </RechartsLine>
          ) : selectedChart === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}
              />
              <Bar dataKey="consumption" fill={PREMIUM_COLORS.success} radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="consumption" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="cost" stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}
              />
              <Scatter dataKey="cost" fill={PREMIUM_COLORS.secondary} />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={categoryData.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="consumption"
                label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
              >
                {categoryData.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value.toLocaleString()} kWh`, "Consumption"]} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar 
                name="Consumption" 
                dataKey="consumption" 
                stroke={PREMIUM_COLORS.primary} 
                fill={PREMIUM_COLORS.primary} 
                fillOpacity={0.3} 
              />
              <Radar 
                name="Sustainability" 
                dataKey="sustainability" 
                stroke={PREMIUM_COLORS.success} 
                fill={PREMIUM_COLORS.success} 
                fillOpacity={0.3} 
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  // Render other sections (Analytics, SystemDetails, Performance, Reports) with enhanced designs
  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Advanced Analytics Content */}
      <div className="text-center p-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Advanced Analytics</h3>
        <p className="text-slate-600">Detailed consumption analysis and forecasting tools coming soon.</p>
      </div>
    </div>
  )

  const renderSystemDetails = () => (
    <div className="space-y-6">
      {/* Enhanced System Details with improved layout */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Electricity Systems ({filteredData.length} of {initialElectricityData.length})
            </h3>
            <p className="text-slate-600">Manage and monitor all electricity systems</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ListTree className="w-5 h-5" />
              </button>
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium"
            >
              <option value="consumption">Sort by Consumption</option>
              <option value="cost">Sort by Cost</option>
              <option value="name">Sort by Name</option>
              <option value="efficiency">Sort by Efficiency</option>
            </select>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((system) => (
              <div key={system.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 truncate">{system.unitName}</h4>
                    <p className="text-sm text-slate-600">{system.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                        style={{ 
                          backgroundColor: `${chartColors[availableCategories.indexOf(system.category) % chartColors.length]}20`,
                          color: chartColors[availableCategories.indexOf(system.category) % chartColors.length]
                        }}>
                    {system.meterType}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Consumption</span>
                    <span className="font-semibold">{system.totalConsumption.toLocaleString()} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Cost</span>
                    <span className="font-semibold">{system.totalCost.toFixed(2)} OMR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Account</span>
                    <span className="text-sm font-medium">{system.meterAccountNo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredData.map((system) => (
              <SystemListItem
                key={system.id}
                id={system.id}
                name={system.unitName}
                meterType={system.meterType}
                category={system.category}
                value={system.totalConsumption}
                tag={system.category}
                tagColor={system.tagColor}
                unit="kWh"
                accountNo={system.meterAccountNo !== "N/A" ? system.meterAccountNo : undefined}
              />
            ))}
          </div>
        )}
        
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No systems found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your filters or search criteria</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Performance Content */}
      <div className="text-center p-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl">
        <Target className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Performance Analytics</h3>
        <p className="text-slate-600">Detailed performance metrics and optimization insights.</p>
      </div>
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      {/* Reports Content */}
      <div className="text-center p-12 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl">
        <FileBarChart className="w-16 h-16 mx-auto mb-4 text-purple-500" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Reports & Export</h3>
        <p className="text-slate-600">Generate comprehensive reports and export data for analysis.</p>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Electricity System Analytics
                {dataLoading && <span className="text-blue-600 ml-2">(Loading...)</span>}
              </h1>
              <p className="text-slate-600 font-medium">
                Comprehensive electricity consumption monitoring & analysis dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Premium Sub-navigation */}
        <div className="flex justify-center mb-8">
          <ElectricitySubNav />
        </div>

        {/* Enhanced Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 ${
              showFilters 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            <Filter size={18} />
            <span>Advanced Filters</span>
            {filters.categories.length > 0 || filters.zones.length > 0 || filters.search && (
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold flex items-center space-x-2 hover:border-green-300 hover:text-green-600 transition-all duration-200"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          
          <button 
            onClick={handleExport}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold flex items-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
          >
            <Download size={18} />
            <span>Export Data</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold flex items-center space-x-2 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>

        {/* Enhanced Filters Panel */}
        {showFilters && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Advanced Filters & Search</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Enhanced Search */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Search Systems</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, type, or account..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-slate-800 placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Month Range */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Analysis Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.monthRange[0]}
                    onChange={(e) => setFilters(prev => ({ ...prev, monthRange: [e.target.value, prev.monthRange[1]] }))}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-slate-700 focus:border-blue-400 transition-all duration-200"
                  >
                    {availableMonths.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={filters.monthRange[1]}
                    onChange={(e) => setFilters(prev => ({ ...prev, monthRange: [prev.monthRange[0], e.target.value] }))}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-slate-700 focus:border-blue-400 transition-all duration-200"
                  >
                    {availableMonths.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Consumption Range */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Consumption Range (kWh)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.consumptionMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, consumptionMin: parseInt(e.target.value) || 0 }))}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-slate-700 focus:border-blue-400 transition-all duration-200"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.consumptionMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, consumptionMax: parseInt(e.target.value) || 100000 }))}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-slate-700 focus:border-blue-400 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sort & Order</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-slate-700 focus:border-blue-400 transition-all duration-200"
                  >
                    <option value="consumption">Consumption</option>
                    <option value="cost">Cost</option>
                    <option value="name">Name</option>
                    <option value="efficiency">Efficiency</option>
                  </select>
                  <button
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                    }))}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur text-slate-700 hover:bg-white transition-all duration-200 flex items-center justify-center"
                  >
                    {filters.sortOrder === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">System Categories</label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      filters.categories.includes(category)
                        ? "text-white border-transparent shadow-lg"
                        : "bg-white/50 text-slate-700 border-slate-200 hover:border-blue-300"
                    }`}
                    style={{
                      background: filters.categories.includes(category) 
                        ? `linear-gradient(135deg, ${chartColors[index % chartColors.length]}, ${chartColors[index % chartColors.length]}90)`
                        : undefined
                    }}
                  >
                    {category}
                    {systemsByCategory[category] && (
                      <span className="ml-2 opacity-70">({systemsByCategory[category].length})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone Filters */}
            {availableZones.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">System Zones</label>
                <div className="flex flex-wrap gap-2">
                  {availableZones.map(zone => (
                    <button
                      key={zone}
                      onClick={() => handleZoneFilter(zone)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        filters.zones.includes(zone)
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-transparent shadow-lg"
                          : "bg-white/50 text-slate-700 border-slate-200 hover:border-green-300"
                      }`}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Showing {filteredData.length} of {initialElectricityData.length} systems
              </div>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Main Content with smooth transitions */}
        <div className="transition-all duration-500 ease-in-out">
          {activeSubSection === "Overview" && renderOverview()}
          {activeSubSection === "Analytics" && renderAnalytics()}
          {activeSubSection === "SystemDetails" && renderSystemDetails()}
          {activeSubSection === "Performance" && renderPerformance()}
          {activeSubSection === "Reports" && renderReports()}
        </div>
      </div>
    </div>
  )
}
