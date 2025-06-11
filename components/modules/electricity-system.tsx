"use client"

import { useState, useMemo } from "react"
import { 
  Filter, Search, Zap, DollarSign, ListTree, TrendingUp, BarChart3, Calendar, Download,
  Activity, Target, AlertCircle, Settings, PieChart, LineChart, Map, Users, Layers, LayoutDashboard
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
  ComposedChart, Scatter, ScatterChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, FunnelChart, Funnel, LabelList
} from "recharts"

interface ElectricitySystemModuleProps {
  isDarkMode?: boolean
}

type ElectricitySubSection = "Charts" | "SystemDetails" | "Categories" | "Performance"

interface FilterState {
  search: string
  categories: string[]
  monthRange: [string, string]
  consumptionMin: number
  consumptionMax: number
  costMin: number
  costMax: number
  zones: string[]
}

export function ElectricitySystemModule({ isDarkMode = false }: ElectricitySystemModuleProps) {
  const [activeSubSection, setActiveSubSection] = useState<ElectricitySubSection>("Charts")
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    monthRange: [availableMonths[0], availableMonths[availableMonths.length - 1]],
    consumptionMin: 0,
    consumptionMax: 100000,
    costMin: 0,
    costMax: 5000,
    zones: []
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedChart, setSelectedChart] = useState<"line" | "area" | "bar" | "radar">("area")

  // Fetch data from Supabase
  const { data: electricityData, loading: dataLoading, error: dataError } = useElectricityData()
  const { trends: monthlyTrendsData, loading: trendsLoading } = useMonthlyTrends()

  // Use loading data while fetching or fallback to empty array
  const initialElectricityData = dataLoading ? createLoadingData(10) : electricityData

  // Process data
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

  // Advanced filtering
  const filteredData = useMemo(() => {
    return initialElectricityData.filter(system => {
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
    }).sort((a, b) => b.totalConsumption - a.totalConsumption)
  }, [filters, initialElectricityData])

  // KPI calculations
  const kpiData = useMemo(() => {
    const filteredConsumption = filteredData.reduce((sum, s) => sum + s.totalConsumption, 0)
    const filteredCost = filteredData.reduce((sum, s) => sum + s.totalCost, 0)
    const averageConsumption = filteredData.length > 0 ? filteredConsumption / filteredData.length : 0
    const efficiency = filteredConsumption > 0 ? (filteredCost / filteredConsumption) * 1000 : 0 // Cost per 1000 kWh

    return {
      totalSystems: filteredData.length,
      totalConsumption: filteredConsumption,
      totalCost: filteredCost,
      averageConsumption,
      efficiency,
      activeMonths: availableMonths.length
    }
  }, [filteredData])

  // Chart data with month range filtering
  const chartData = useMemo(() => {
    const startIdx = availableMonths.indexOf(filters.monthRange[0])
    const endIdx = availableMonths.indexOf(filters.monthRange[1])
    const selectedMonths = availableMonths.slice(startIdx, endIdx + 1)

    const monthlyData = selectedMonths.map(month => {
      const monthConsumption = filteredData.reduce((sum, system) => {
        return sum + (system.consumption[month] || 0)
      }, 0)
      
      return {
        month,
        consumption: monthConsumption,
        cost: monthConsumption * KWH_TO_OMR_RATE,
        systems: filteredData.filter(s => (s.consumption[month] || 0) > 0).length,
        efficiency: monthConsumption > 0 ? (monthConsumption * KWH_TO_OMR_RATE / monthConsumption) * 1000 : 0
      }
    })

    return monthlyData
  }, [filteredData, filters.monthRange])

  // Category data for charts
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
          avgConsumption: categoryFiltered.length > 0 ? consumption / categoryFiltered.length : 0
        }
      })
      .filter(d => d.consumption > 0)
      .sort((a, b) => b.consumption - a.consumption)
  }, [systemsByCategory, filteredData])

  // Performance metrics for radar chart
  const performanceData = useMemo(() => {
    if (categoryData.length === 0) return []
    
    const maxConsumption = Math.max(...categoryData.map(d => d.consumption))
    const maxCost = Math.max(...categoryData.map(d => d.cost))
    const maxSystems = Math.max(...categoryData.map(d => d.systems))
    
    return categoryData.slice(0, 6).map(d => ({
      category: d.category.substring(0, 10) + (d.category.length > 10 ? '...' : ''),
      consumption: (d.consumption / maxConsumption * 100),
      cost: (d.cost / maxCost * 100),
      systems: (d.systems / maxSystems * 100),
      efficiency: Math.min(d.efficiency, 100)
    }))
  }, [categoryData])

  const chartColors = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.error, COLORS.info, COLORS.secondary]

  // Filter handlers
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
      zones: []
    })
  }

  // Error state
  if (dataError && !dataLoading) {
    return (
      <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Electricity System Analytics</h1>
          <p className="text-red-600">
            Failed to load electricity data. Please check your connection and try again.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <div className="flex items-center justify-center">
            <AlertCircle className="text-red-500 mr-2" size={24} />
            <span className="text-red-700">Database connection error</span>
          </div>
        </div>
      </div>
    )
  }

  // Sub-navigation component matching Water Analysis style exactly
  const ElectricitySubNav = () => {
    const subSections = [
      { name: "Charts & Analytics", id: "Charts", icon: BarChart3 },
      { name: "System Details", id: "SystemDetails", icon: ListTree },
      { name: "Category Analysis", id: "Categories", icon: Layers },
      { name: "Performance Metrics", id: "Performance", icon: Target }
    ]

    return (
      <div className="mb-6 print:hidden flex justify-center">
        <div className="bg-white shadow-md rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
          {subSections.map((tab) => {
            const isActive = activeSubSection === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubSection(tab.id as ElectricitySubSection)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                  isActive ? "text-white" : "text-slate-700 hover:bg-slate-200"
                }`}
                style={{ backgroundColor: isActive ? COLORS.primary : "transparent" }}
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

  const renderCharts = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <SummaryCard 
          title="Active Systems"
          value={dataLoading ? "Loading..." : kpiData.totalSystems.toLocaleString()}
          icon={ListTree}
          iconBgColor={COLORS.primary}
          trend={dataLoading ? "..." : `${((kpiData.totalSystems / initialElectricityData.length) * 100).toFixed(1)}% of total`}
        />
        <SummaryCard 
          title="Total Consumption"
          value={dataLoading ? "Loading..." : kpiData.totalConsumption.toLocaleString(undefined, {maximumFractionDigits: 0})}
          unit="kWh"
          icon={Zap}
          iconBgColor={COLORS.warning}
          trend={`${kpiData.activeMonths} months`}
        />
        <SummaryCard 
          title="Total Cost"
          value={dataLoading ? "Loading..." : kpiData.totalCost.toLocaleString(undefined, {maximumFractionDigits: 2})}
          unit="OMR"
          icon={DollarSign}
          iconBgColor={COLORS.success}
          trend={`${KWH_TO_OMR_RATE} OMR/kWh`}
        />
        <SummaryCard 
          title="Average System"
          value={dataLoading ? "Loading..." : kpiData.averageConsumption.toLocaleString(undefined, {maximumFractionDigits: 0})}
          unit="kWh"
          icon={Target}
          iconBgColor={COLORS.info}
          trend="Per system"
        />
        <SummaryCard 
          title="Efficiency"
          value={dataLoading ? "Loading..." : kpiData.efficiency.toFixed(3)}
          unit="OMR/1000kWh"
          icon={Activity}
          iconBgColor={COLORS.error}
          trend="Cost efficiency"
        />
        <SummaryCard 
          title="Categories"
          value={dataLoading ? "Loading..." : categoryData.length.toString()}
          icon={Layers}
          iconBgColor={COLORS.secondary}
          trend="Active categories"
        />
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg w-fit">
        {[
          { id: "area", label: "Area", icon: BarChart3 },
          { id: "line", label: "Line", icon: LineChart },
          { id: "bar", label: "Bar", icon: BarChart3 },
          { id: "radar", label: "Radar", icon: Target }
        ].map((chart) => (
          <button
            key={chart.id}
            onClick={() => setSelectedChart(chart.id as any)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedChart === chart.id
                ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <chart.icon size={16} />
            {chart.label}
          </button>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Consumption Trends */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Consumption Trends ({filters.monthRange[0]} to {filters.monthRange[1]})
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            {selectedChart === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="month" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }} />
                <Area type="monotone" dataKey="consumption" stroke={COLORS.primary} fill="url(#colorTrend)" />
              </AreaChart>
            ) : selectedChart === "line" ? (
              <RechartsLine data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="month" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }} />
                <Line type="monotone" dataKey="consumption" stroke={COLORS.primary} strokeWidth={3} />
              </RechartsLine>
            ) : selectedChart === "bar" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="month" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }} />
                <Bar dataKey="consumption" fill={COLORS.success} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <RadarChart data={performanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Performance" dataKey="consumption" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Cost vs Consumption */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Cost vs Consumption Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="month" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
              <YAxis yAxisId="left" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
              <YAxis yAxisId="right" orientation="right" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
              <Tooltip contentStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px"
              }} />
              <Bar yAxisId="left" dataKey="consumption" fill={COLORS.primary} opacity={0.7} />
              <Line yAxisId="right" type="monotone" dataKey="cost" stroke={COLORS.success} strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPie>
              <Pie
                data={categoryData.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="consumption"
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(1)}%`}
              >
                {categoryData.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value.toLocaleString()} kWh`, "Consumption"]} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Top 10 Consumers</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {topConsumers.slice(0, 10).map((system, index) => (
              <div key={system.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white`} 
                       style={{ backgroundColor: chartColors[index % chartColors.length] }}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{system.unitName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{system.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{system.totalConsumption.toLocaleString()} kWh</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{system.totalCost.toFixed(2)} OMR</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderSystemDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Electricity Systems ({filteredData.length} of {initialElectricityData.length})
        </h3>
      </div>
      
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
      
      {filteredData.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg">
          <Zap className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg">No systems found</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            Try adjusting your filters
          </p>
          <button 
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      {/* Category Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryData.map((category, index) => (
          <div key={category.category} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">{category.category}</h4>
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Systems</span>
                <span className="font-medium">{category.systems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Consumption</span>
                <span className="font-medium">{category.consumption.toLocaleString()} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Cost</span>
                <span className="font-medium">{category.cost.toFixed(2)} OMR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Avg/System</span>
                <span className="font-medium">{category.avgConsumption.toLocaleString()} kWh</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Comparison Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Category Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categoryData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
            <XAxis type="number" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
            <YAxis dataKey="category" type="category" width={120} stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
            <Tooltip contentStyle={{
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px"
            }} />
            <Bar dataKey="consumption" fill={COLORS.primary} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Top Performer"
          value={topConsumers[0]?.unitName.substring(0, 20) + (topConsumers[0]?.unitName.length > 20 ? '...' : '') || "N/A"}
          icon={Target}
          iconBgColor={COLORS.primary}
          trend={`${topConsumers[0]?.totalConsumption.toLocaleString() || 0} kWh`}
        />
        <SummaryCard 
          title="Most Efficient"
          value={categoryData[categoryData.length - 1]?.category || "N/A"}
          icon={Activity}
          iconBgColor={COLORS.success}
          trend="Lowest cost/kWh"
        />
        <SummaryCard 
          title="Active Rate"
          value={`${((kpiData.totalSystems / initialElectricityData.length) * 100).toFixed(1)}%`}
          icon={Zap}
          iconBgColor={COLORS.warning}
          trend="Systems active"
        />
        <SummaryCard 
          title="Utilization"
          value={`${((kpiData.totalConsumption / (kpiData.totalSystems * 10000)) * 100).toFixed(1)}%`}
          icon={BarChart3}
          iconBgColor={COLORS.info}
          trend="Capacity utilization"
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Consumption" dataKey="consumption" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
              <Radar name="Cost" dataKey="cost" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.3} />
              <Radar name="Systems" dataKey="systems" stroke={COLORS.warning} fill={COLORS.warning} fillOpacity={0.3} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Performance Rankings</h3>
          <div className="space-y-3">
            {topConsumers.slice(0, 8).map((system, index) => (
              <div key={system.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white`} 
                       style={{ backgroundColor: chartColors[index % chartColors.length] }}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{system.unitName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{system.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{system.totalConsumption.toLocaleString()} kWh</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{system.totalCost.toFixed(2)} OMR</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Electricity System Analytics
          {dataLoading && <span className="text-blue-600 ml-2">(Loading...)</span>}
        </h1>
        <p className="text-slate-600">
          Comprehensive electricity consumption monitoring and analysis dashboard powered by Supabase
        </p>
      </div>

      {/* Sub-navigation matching Water Analysis style */}
      <ElectricitySubNav />

      {/* Action buttons */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-2 transition-colors"
        >
          <Filter size={16} />
          Filters
        </button>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center gap-2 transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search systems..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Month Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Month Range</label>
              <div className="flex gap-2">
                <select
                  value={filters.monthRange[0]}
                  onChange={(e) => setFilters(prev => ({ ...prev, monthRange: [e.target.value, prev.monthRange[1]] }))}
                  className="flex-1 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                >
                  {availableMonths.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  value={filters.monthRange[1]}
                  onChange={(e) => setFilters(prev => ({ ...prev, monthRange: [prev.monthRange[0], e.target.value] }))}
                  className="flex-1 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                >
                  {availableMonths.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Consumption Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Consumption Range (kWh)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.consumptionMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, consumptionMin: parseInt(e.target.value) || 0 }))}
                  className="flex-1 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.consumptionMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, consumptionMax: parseInt(e.target.value) || 100000 }))}
                  className="flex-1 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                    filters.categories.includes(category)
                      ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Zone Filters */}
          {availableZones.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Zones</label>
              <div className="flex flex-wrap gap-2">
                {availableZones.map(zone => (
                  <button
                    key={zone}
                    onClick={() => handleZoneFilter(zone)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      filters.zones.includes(zone)
                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div>
        {activeSubSection === "Charts" && renderCharts()}
        {activeSubSection === "SystemDetails" && renderSystemDetails()}
        {activeSubSection === "Categories" && renderCategories()}
        {activeSubSection === "Performance" && renderPerformance()}
      </div>
    </div>
  )
}
