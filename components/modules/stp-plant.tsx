"use client"

import { useState, useMemo, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { 
  Droplets, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Filter, 
  LayoutDashboard,
  BarChart3,
  Settings,
  Zap,
  ThermometerSun,
  Gauge,
  Calendar,
  FileText,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Beaker,
  Factory
} from "lucide-react"
import { SummaryCard } from "@/components/ui/summary-card"
import { ChartWrapper } from "@/components/ui/chart-wrapper"
import { StyledSelect } from "@/components/ui/styled-select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { COLORS } from "@/lib/constants"

interface STPPlantModuleProps {
  isDarkMode?: boolean
}

// STP Plant operational data - current as of June 2025
const stpPlantData = {
  // Daily operational metrics
  dailyMetrics: [
    { date: "2025-06-01", inflowVolume: 1250, outflowVolume: 1180, treatmentEfficiency: 94.4, powerConsumption: 420, operationalHours: 24 },
    { date: "2025-06-02", inflowVolume: 1320, outflowVolume: 1245, treatmentEfficiency: 94.3, powerConsumption: 435, operationalHours: 24 },
    { date: "2025-06-03", inflowVolume: 1180, outflowVolume: 1115, treatmentEfficiency: 94.5, powerConsumption: 405, operationalHours: 24 },
    { date: "2025-06-04", inflowVolume: 1390, outflowVolume: 1312, treatmentEfficiency: 94.4, powerConsumption: 445, operationalHours: 24 },
    { date: "2025-06-05", inflowVolume: 1275, outflowVolume: 1203, treatmentEfficiency: 94.4, powerConsumption: 425, operationalHours: 24 },
    { date: "2025-06-06", inflowVolume: 1420, outflowVolume: 1340, treatmentEfficiency: 94.4, powerConsumption: 460, operationalHours: 24 },
    { date: "2025-06-07", inflowVolume: 1195, outflowVolume: 1128, treatmentEfficiency: 94.4, powerConsumption: 410, operationalHours: 24 },
    { date: "2025-06-08", inflowVolume: 1305, outflowVolume: 1232, treatmentEfficiency: 94.4, powerConsumption: 430, operationalHours: 24 },
    { date: "2025-06-09", inflowVolume: 1235, outflowVolume: 1166, treatmentEfficiency: 94.4, powerConsumption: 415, operationalHours: 24 },
    { date: "2025-06-10", inflowVolume: 1345, outflowVolume: 1270, treatmentEfficiency: 94.4, powerConsumption: 440, operationalHours: 24 },
    { date: "2025-06-11", inflowVolume: 1290, outflowVolume: 1218, treatmentEfficiency: 94.4, powerConsumption: 425, operationalHours: 24 },
    { date: "2025-06-12", inflowVolume: 1380, outflowVolume: 1302, treatmentEfficiency: 94.3, powerConsumption: 450, operationalHours: 24 },
    { date: "2025-06-13", inflowVolume: 1210, outflowVolume: 1142, treatmentEfficiency: 94.4, powerConsumption: 405, operationalHours: 24 },
    { date: "2025-06-14", inflowVolume: 1315, outflowVolume: 1241, treatmentEfficiency: 94.4, powerConsumption: 435, operationalHours: 24 },
    { date: "2025-06-15", inflowVolume: 1265, outflowVolume: 1194, treatmentEfficiency: 94.4, powerConsumption: 420, operationalHours: 24 },
    { date: "2025-06-16", inflowVolume: 1355, outflowVolume: 1279, treatmentEfficiency: 94.4, powerConsumption: 445, operationalHours: 24 },
    { date: "2025-06-17", inflowVolume: 1225, outflowVolume: 1156, treatmentEfficiency: 94.4, powerConsumption: 410, operationalHours: 24 },
    { date: "2025-06-18", inflowVolume: 1340, outflowVolume: 1265, treatmentEfficiency: 94.4, powerConsumption: 440, operationalHours: 24 }
  ],
  
  // Water quality parameters
  qualityMetrics: [
    { parameter: "BOD", incoming: 220, treated: 8, unit: "mg/L", target: "<10", status: "Good" },
    { parameter: "COD", incoming: 450, treated: 18, unit: "mg/L", target: "<25", status: "Good" },
    { parameter: "TSS", incoming: 180, treated: 6, unit: "mg/L", target: "<10", status: "Good" },
    { parameter: "pH", incoming: 7.2, treated: 7.4, unit: "", target: "6.5-8.5", status: "Good" },
    { parameter: "Turbidity", incoming: 85, treated: 2.1, unit: "NTU", target: "<5", status: "Good" },
    { parameter: "Dissolved Oxygen", incoming: 1.2, treated: 6.8, unit: "mg/L", target: ">4", status: "Good" },
    { parameter: "Ammonia-N", incoming: 35, treated: 1.8, unit: "mg/L", target: "<5", status: "Good" },
    { parameter: "Total Nitrogen", incoming: 45, treated: 8.2, unit: "mg/L", target: "<15", status: "Good" },
    { parameter: "Total Phosphorus", incoming: 8.5, treated: 0.8, unit: "mg/L", target: "<2", status: "Good" }
  ],

  // Equipment status
  equipment: [
    { name: "Primary Clarifier", status: "Operational", efficiency: 96, lastMaintenance: "2025-05-15", nextMaintenance: "2025-07-15" },
    { name: "Aeration System", status: "Operational", efficiency: 98, lastMaintenance: "2025-05-20", nextMaintenance: "2025-07-20" },
    { name: "Secondary Clarifier", status: "Operational", efficiency: 94, lastMaintenance: "2025-05-10", nextMaintenance: "2025-07-10" },
    { name: "Sludge Dewatering", status: "Operational", efficiency: 92, lastMaintenance: "2025-05-25", nextMaintenance: "2025-07-25" },
    { name: "Chlorination System", status: "Operational", efficiency: 99, lastMaintenance: "2025-06-01", nextMaintenance: "2025-08-01" },
    { name: "UV Disinfection", status: "Operational", efficiency: 97, lastMaintenance: "2025-05-18", nextMaintenance: "2025-07-18" }
  ],

  // Monthly summary data
  monthlySummary: [
    { month: "Jan 2025", totalInflow: 38500, totalOutflow: 36338, avgEfficiency: 94.4, maintenanceCost: 12500, powerCost: 18200 },
    { month: "Feb 2025", totalInflow: 35200, totalOutflow: 33229, avgEfficiency: 94.4, maintenanceCost: 11800, powerCost: 16800 },
    { month: "Mar 2025", totalInflow: 39800, totalOutflow: 37571, avgEfficiency: 94.4, maintenanceCost: 13200, powerCost: 19500 },
    { month: "Apr 2025", totalInflow: 38100, totalOutflow: 35962, avgEfficiency: 94.4, maintenanceCost: 12300, powerCost: 18100 },
    { month: "May 2025", totalInflow: 40200, totalOutflow: 37949, avgEfficiency: 94.4, maintenanceCost: 14100, powerCost: 20200 },
    { month: "Jun 2025", totalInflow: 23400, totalOutflow: 22084, avgEfficiency: 94.4, maintenanceCost: 8500, powerCost: 11800 }
  ]
}

export function STPPlantModule({ isDarkMode = false }: STPPlantModuleProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSubSection, setActiveSubSection] = useState("Overview")
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 7 Days")
  const [sortConfig, setSortConfig] = useState<{ column: string | null; direction: string }>({ column: null, direction: 'asc' })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Calculate current statistics
  const currentStats = useMemo(() => {
    const recentData = stpPlantData.dailyMetrics.slice(-7) // Last 7 days
    const totalInflow = recentData.reduce((sum, day) => sum + day.inflowVolume, 0)
    const totalOutflow = recentData.reduce((sum, day) => sum + day.outflowVolume, 0)
    const avgEfficiency = recentData.reduce((sum, day) => sum + day.treatmentEfficiency, 0) / recentData.length
    const totalPowerConsumption = recentData.reduce((sum, day) => sum + day.powerConsumption, 0)
    const operationalUptime = 100 // Assuming 100% uptime based on 24h operations
    const activeEquipment = stpPlantData.equipment.filter(eq => eq.status === "Operational").length
    const qualityCompliance = stpPlantData.qualityMetrics.filter(metric => metric.status === "Good").length

    return {
      totalInflow,
      totalOutflow,
      avgEfficiency,
      totalPowerConsumption,
      operationalUptime,
      activeEquipment,
      totalEquipment: stpPlantData.equipment.length,
      qualityCompliance,
      totalQualityMetrics: stpPlantData.qualityMetrics.length,
      avgDailyInflow: totalInflow / recentData.length,
      treatmentCapacityUtilization: (totalInflow / (1500 * 7)) * 100 // Assuming 1500 m³/day capacity
    }
  }, [])

  // Sub-navigation
  const STPSubNav = () => {
    const subSections = [
      { name: "Overview", id: "Overview", icon: LayoutDashboard },
      { name: "Water Quality", id: "WaterQuality", icon: Beaker },
      { name: "Equipment Status", id: "Equipment", icon: Settings },
      { name: "Performance Trends", id: "Performance", icon: TrendingUp },
    ]

    return (
      <div className="mb-6 print:hidden flex justify-center">
        <div className="bg-white shadow-md rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
          {subSections.map((tab) => {
            const isActive = activeSubSection === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubSection(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                  isActive ? "text-white" : "text-[#3B3241] hover:bg-[#7E708A] hover:text-white"
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

  // Filter Bar
  const FilterBar = () => {
    const timeRangeOptions = [
      { value: "Last 7 Days", label: "Last 7 Days" },
      { value: "Last 30 Days", label: "Last 30 Days" },
      { value: "Last 3 Months", label: "Last 3 Months" },
      { value: "This Year", label: "This Year" },
    ]

    return (
      <div className="bg-white shadow p-4 rounded-lg mb-6 print:hidden border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <StyledSelect
            id="timeRangeFilter"
            label="Time Range"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            options={timeRangeOptions}
            icon={Calendar}
          />
          <button
            onClick={() => setSelectedTimeRange("Last 7 Days")}
            className="button-primary flex items-center justify-center space-x-2 h-[46px] w-full lg:w-auto"
          >
            <Filter size={16} />
            <span>Reset Filters</span>
          </button>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Activity size={16} style={{ color: COLORS.success }} />
            <span>Real-time monitoring active</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">STP Plant Operations</h1>
        <p className="text-slate-600">Sewage Treatment Plant Monitoring & Management System</p>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">System Online</span>
          </div>
          <div className="text-sm text-slate-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      <STPSubNav />
      <FilterBar />

      {activeSubSection === "Overview" && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Daily Avg Inflow"
              value={currentStats.avgDailyInflow.toFixed(0)}
              unit="m³/day"
              icon={Droplets}
              trend={`${currentStats.treatmentCapacityUtilization.toFixed(1)}% capacity utilization`}
              trendColor="text-blue-600"
              iconBgColor={COLORS.info}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Treatment Efficiency"
              value={currentStats.avgEfficiency.toFixed(1)}
              unit="%"
              icon={Activity}
              trend="Above 94% target"
              trendColor="text-green-600"
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Equipment Status"
              value={currentStats.activeEquipment}
              unit={`/${currentStats.totalEquipment} operational`}
              icon={Settings}
              trend="All systems running"
              trendColor="text-green-600"
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Quality Compliance"
              value={currentStats.qualityCompliance}
              unit={`/${currentStats.totalQualityMetrics} parameters`}
              icon={CheckCircle}
              trend="All within limits"
              trendColor="text-green-600"
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper title="Daily Flow Volumes" subtitle="Inflow vs outflow trends">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stpPlantData.dailyMetrics.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [`${value} m³`, ""]}
                  />
                  <Area type="monotone" dataKey="inflowVolume" stackId="1" stroke={COLORS.info} fill={COLORS.info} fillOpacity={0.6} name="Inflow" />
                  <Area type="monotone" dataKey="outflowVolume" stackId="2" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.6} name="Treated Outflow" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Treatment Efficiency" subtitle="Daily efficiency percentage">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stpPlantData.dailyMetrics.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                  <YAxis domain={[93, 95]} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [`${value}%`, "Efficiency"]}
                  />
                  <Line type="monotone" dataKey="treatmentEfficiency" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Monthly Summary Table */}
          <ChartWrapper title="Monthly Performance Summary" subtitle="Comprehensive monthly operational data" isTable={true}>
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[15%]">Month</th>
                    <th className="text-right p-3 font-semibold text-slate-700 w-[15%]">Total Inflow (m³)</th>
                    <th className="text-right p-3 font-semibold text-slate-700 w-[15%]">Total Outflow (m³)</th>
                    <th className="text-right p-3 font-semibold text-slate-700 w-[15%]">Avg Efficiency (%)</th>
                    <th className="text-right p-3 font-semibold text-slate-700 w-[20%]">Maintenance Cost (OMR)</th>
                    <th className="text-right p-3 font-semibold text-slate-700 w-[20%]">Power Cost (OMR)</th>
                  </tr>
                </thead>
                <tbody>
                  {stpPlantData.monthlySummary.map((month, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">{month.month}</td>
                      <td className="p-3 text-right text-slate-600">{month.totalInflow.toLocaleString()}</td>
                      <td className="p-3 text-right text-slate-600">{month.totalOutflow.toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold text-green-600">{month.avgEfficiency}%</td>
                      <td className="p-3 text-right text-slate-600">{month.maintenanceCost.toLocaleString()}</td>
                      <td className="p-3 text-right text-slate-600">{month.powerCost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartWrapper>
        </>
      )}

      {activeSubSection === "WaterQuality" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper title="Water Quality Parameters" subtitle="Treatment effectiveness by parameter">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stpPlantData.qualityMetrics} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="parameter" type="category" width={80} />
                  <Tooltip formatter={(value, name) => [`${value} ${stpPlantData.qualityMetrics.find(m => m.parameter === name)?.unit || ''}`, name]} />
                  <Bar dataKey="incoming" fill={COLORS.error} name="Incoming" />
                  <Bar dataKey="treated" fill={COLORS.success} name="Treated" />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Compliance Status" subtitle="Parameter compliance overview">
              <div className="space-y-4 mt-4">
                {stpPlantData.qualityMetrics.map((metric, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-slate-700">{metric.parameter}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        metric.status === "Good" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {metric.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <div>Incoming: {metric.incoming} {metric.unit}</div>
                      <div>Treated: {metric.treated} {metric.unit}</div>
                      <div>Target: {metric.target} {metric.unit}</div>
                    </div>
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: metric.status === "Good" ? "100%" : "60%" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartWrapper>
          </div>
        </>
      )}

      {activeSubSection === "Equipment" && (
        <ChartWrapper title="Equipment Status Dashboard" subtitle="Real-time equipment monitoring" isTable={true}>
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-slate-700 w-[25%]">Equipment</th>
                  <th className="text-center p-3 font-semibold text-slate-700 w-[15%]">Status</th>
                  <th className="text-right p-3 font-semibold text-slate-700 w-[15%]">Efficiency (%)</th>
                  <th className="text-center p-3 font-semibold text-slate-700 w-[20%]">Last Maintenance</th>
                  <th className="text-center p-3 font-semibold text-slate-700 w-[25%]">Next Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {stpPlantData.equipment.map((equipment, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">{equipment.name}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        equipment.status === "Operational" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {equipment.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-600">{equipment.efficiency}%</td>
                    <td className="p-3 text-center text-slate-600">{equipment.lastMaintenance}</td>
                    <td className="p-3 text-center text-slate-600">{equipment.nextMaintenance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartWrapper>
      )}

      {activeSubSection === "Performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWrapper title="Power Consumption Trend" subtitle="Daily power usage in kWh">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stpPlantData.dailyMetrics.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [`${value} kWh`, "Power Consumption"]}
                />
                <Area type="monotone" dataKey="powerConsumption" stroke={COLORS.warning} fill={COLORS.warning} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <ChartWrapper title="Cost Analysis" subtitle="Monthly operational costs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stpPlantData.monthlySummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} OMR`, ""]} />
                <Bar dataKey="maintenanceCost" fill={COLORS.primary} name="Maintenance Cost" />
                <Bar dataKey="powerCost" fill={COLORS.accent} name="Power Cost" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      )}
    </div>
  )
}
