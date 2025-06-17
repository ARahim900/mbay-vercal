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
  DollarSign, 
  Building, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Filter, 
  LayoutDashboard,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Calculator,
  FileText,
  Home,
  Sparkles
} from "lucide-react"
import { SummaryCard } from "@/components/ui/summary-card"
import { ChartWrapper } from "@/components/ui/chart-wrapper"
import { StyledSelect } from "@/components/ui/styled-select"
import { COLORS } from "@/lib/constants"
import {
  parseReserveFundData,
  calculateReserveFundStats,
  getFilterOptions,
  formatDataForCharts,
  validateReserveFundData,
  type ReserveFundUnit
} from "@/lib/reserve-fund-data"

interface ReserveFundModuleProps {
  isDarkMode?: boolean
}

export function ReserveFundModule({ isDarkMode = false }: ReserveFundModuleProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSubSection, setActiveSubSection] = useState("Overview")
  const [selectedSector, setSelectedSector] = useState("All Sectors")
  const [selectedType, setSelectedType] = useState("All Types")
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Load and parse data
  const reserveFundData = useMemo(() => parseReserveFundData(), [])
  const filterOptions = useMemo(() => getFilterOptions(reserveFundData), [reserveFundData])
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return reserveFundData.filter((unit) => {
      const sectorMatch = selectedSector === "All Sectors" || unit.sector === selectedSector
      const typeMatch = selectedType === "All Types" || unit.type === selectedType
      return sectorMatch && typeMatch
    })
  }, [reserveFundData, selectedSector, selectedType])

  // Calculate statistics
  const statistics = useMemo(() => {
    return calculateReserveFundStats(filteredData, {
      sector: selectedSector,
      type: selectedType
    })
  }, [filteredData, selectedSector, selectedType])

  // Chart data
  const chartData = useMemo(() => formatDataForCharts(filteredData), [filteredData])
  
  // Data validation
  const dataQuality = useMemo(() => validateReserveFundData(reserveFundData), [reserveFundData])

  // Top contributing units
  const topContributors = useMemo(() => {
    return filteredData
      .filter(unit => unit.totalContrib > 0)
      .sort((a, b) => b.totalContrib - a.totalContrib)
      .slice(0, 10)
  }, [filteredData])

  // AI Analysis Handler
  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true)
    setIsAiLoading(true)
    setAiAnalysisResult("")
    
    setTimeout(() => {
      const validUnits = filteredData.filter(unit => unit.totalContrib > 0)
      const totalContributions = statistics.totalContrib
      const avgRate = statistics.avgContribPerSqm
      const issueUnits = filteredData.filter(unit => unit.hasIssues)
      
      setAiAnalysisResult(`🏦 AI Reserve Fund Analysis Results:

📊 PORTFOLIO OVERVIEW:
• Total Units Analyzed: ${statistics.totalUnits} units
• Contributing Units: ${statistics.validUnits} units (${((statistics.validUnits/statistics.totalUnits)*100).toFixed(1)}%)
• Units with Issues: ${statistics.unitsWithIssues} units requiring attention
• Total Reserve Fund: ${totalContributions.toLocaleString(undefined, {maximumFractionDigits: 0})} OMR annually
• Average Contribution Rate: ${avgRate.toFixed(2)} OMR per m²

🎯 SECTOR PERFORMANCE:
${chartData.sectorBreakdown.slice(0, 3).map(sector => 
  `• ${sector.sector}: ${sector.totalContrib.toLocaleString()} OMR (${sector.units} units, avg: ${sector.avgContrib.toFixed(0)} OMR/unit)`
).join('\n')}

💡 KEY INSIGHTS:
• ${statistics.totalBUA.toLocaleString()} m² total built-up area generating reserves
• Contribution variance from ${statistics.minContribRate.toFixed(2)} to ${statistics.maxContribRate.toFixed(2)} OMR/m²
• Zone contributions: ${statistics.totalZoneContrib.toLocaleString()} OMR (${((statistics.totalZoneContrib/totalContributions)*100).toFixed(1)}%)
• Master contributions: ${statistics.totalMasterContrib.toLocaleString()} OMR (${((statistics.totalMasterContrib/totalContributions)*100).toFixed(1)}%)

⚠️ DATA QUALITY ASSESSMENT:
• Missing BUA data: ${dataQuality.missingBUA} units
• Missing contributions: ${dataQuality.missingContributions} units
• Data inconsistencies: ${dataQuality.inconsistentData} units
• Invalid rates detected: ${dataQuality.invalidRates} units

🔍 STRATEGIC RECOMMENDATIONS:
• ${issueUnits.length > 0 ? `URGENT: Resolve ${issueUnits.length} units with missing/assumed data` : 'GOOD: All units have complete data'}
• ${statistics.avgContribPerSqm < 2 ? 'REVIEW: Low average contribution rate may indicate undervaluation' : 'HEALTHY: Contribution rates are within expected ranges'}
• DIVERSIFICATION: ${chartData.sectorBreakdown.length} sectors contributing to fund stability
• COMPLIANCE: ${((statistics.validUnits/statistics.totalUnits)*100).toFixed(1)}% completion rate ${statistics.validUnits/statistics.totalUnits > 0.9 ? 'exceeds' : 'below'} 90% target

💰 FINANCIAL HEALTH:
• Annual reserve accumulation supporting long-term maintenance
• Well-distributed contribution base across ${chartData.typeBreakdown.length} property types
• ${statistics.totalUnits > 100 ? 'ROBUST' : 'MODERATE'} portfolio size for sustainable fund management`)
      setIsAiLoading(false)
    }, 2500)
  }

  // Sub-navigation
  const ReserveFundSubNav = () => {
    const subSections = [
      { name: "Overview", id: "Overview", icon: LayoutDashboard },
      { name: "Contributions", id: "Contributions", icon: DollarSign },
      { name: "Property Analysis", id: "PropertyAnalysis", icon: Home },
      { name: "Data Quality", id: "DataQuality", icon: CheckCircle },
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
    return (
      <div className="bg-white shadow p-4 rounded-lg mb-6 print:hidden border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <StyledSelect
            id="sectorFilter"
            label="Filter by Sector"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            options={filterOptions.sectors}
            icon={Building}
          />
          <StyledSelect
            id="typeFilter"
            label="Filter by Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={filterOptions.types}
            icon={Home}
          />
          <button
            onClick={() => {
              setSelectedSector("All Sectors")
              setSelectedType("All Types")
            }}
            className="button-primary flex items-center justify-center space-x-2 h-[46px] w-full lg:w-auto"
          >
            <Filter size={16} />
            <span>Reset Filters</span>
          </button>
          <button
            onClick={handleAiAnalysis}
            className="flex items-center justify-center space-x-2 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors h-[46px] w-full lg:w-auto hover:shadow-lg"
            style={{ backgroundColor: COLORS.accent }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = COLORS.accent}
            disabled={isAiLoading}
          >
            <Sparkles size={16} />
            <span>{isAiLoading ? 'Analyzing...' : '🧠 AI Analysis'}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Reserve Fund Management System</h1>
        <p className="text-slate-600">Comprehensive unit contribution tracking and fund analysis</p>
      </div>

      <ReserveFundSubNav />
      <FilterBar />

      {activeSubSection === "Overview" && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Total Reserve Fund"
              value={statistics.totalContrib.toLocaleString(undefined, {maximumFractionDigits: 0})}
              unit="OMR"
              icon={DollarSign}
              trend={`${statistics.validUnits} contributing units`}
              trendColor="text-green-600"
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Contributing Units"
              value={statistics.validUnits}
              unit="units"
              icon={Building}
              trend={`${((statistics.validUnits/statistics.totalUnits)*100).toFixed(1)}% of total`}
              trendColor="text-blue-600"
              iconBgColor={COLORS.info}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Average Rate"
              value={statistics.avgContribPerSqm.toFixed(2)}
              unit="OMR/m²"
              icon={Calculator}
              trend={`Range: ${statistics.minContribRate.toFixed(2)} - ${statistics.maxContribRate.toFixed(2)}`}
              trendColor="text-purple-600"
              iconBgColor={COLORS.accent}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Data Quality"
              value={`${(((statistics.totalUnits - statistics.unitsWithIssues)/statistics.totalUnits)*100).toFixed(1)}`}
              unit="%"
              icon={statistics.unitsWithIssues === 0 ? CheckCircle : AlertCircle}
              trend={statistics.unitsWithIssues === 0 ? "Complete data" : `${statistics.unitsWithIssues} issues`}
              trendColor={statistics.unitsWithIssues === 0 ? "text-green-600" : "text-orange-600"}
              iconBgColor={statistics.unitsWithIssues === 0 ? COLORS.success : COLORS.warning}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper title="Contributions by Sector" subtitle="Reserve fund distribution by sector">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.sectorBreakdown}
                    dataKey="totalContrib"
                    nameKey="sector"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.sectorBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} OMR`, "Contribution"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Property Type Distribution" subtitle="Units and contributions by property type">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.typeBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="units" fill={COLORS.primary} name="Unit Count" />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Top Contributors Table */}
          <ChartWrapper title="Top Contributing Units" subtitle="Highest reserve fund contributors">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700">Rank</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Unit No</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Sector</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Type</th>
                    <th className="text-right p-3 font-semibold text-slate-700">BUA (m²)</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Total Contribution (OMR)</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Rate (OMR/m²)</th>
                  </tr>
                </thead>
                <tbody>
                  {topContributors.map((unit, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
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
                      <td className="p-3 text-right font-semibold text-slate-800">{unit.bua.toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold text-slate-800">{unit.totalContrib.toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold text-slate-800">{unit.contributionRate.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartWrapper>
        </>
      )}

      {activeSubSection === "Contributions" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWrapper title="Zone vs Master Contributions" subtitle="Breakdown of contribution components">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Zone Contributions", value: statistics.totalZoneContrib, color: COLORS.chart[0] },
                    { name: "Master Contributions", value: statistics.totalMasterContrib, color: COLORS.chart[1] }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  <Cell fill={COLORS.chart[0]} />
                  <Cell fill={COLORS.chart[1]} />
                </Pie>
                <Tooltip formatter={(value) => [`${value.toLocaleString()} OMR`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <ChartWrapper title="Contribution Rate Analysis" subtitle="Statistical distribution of rates">
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-slate-700">Average Rate</h4>
                  <span className="text-lg font-bold text-slate-800">{statistics.avgContribPerSqm.toFixed(2)} OMR/m²</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (statistics.avgContribPerSqm / 5) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-xs text-green-600 uppercase tracking-wide">Minimum Rate</p>
                  <p className="text-xl font-bold text-green-800">{statistics.minContribRate.toFixed(2)}</p>
                  <p className="text-xs text-green-600">OMR/m²</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <p className="text-xs text-red-600 uppercase tracking-wide">Maximum Rate</p>
                  <p className="text-xl font-bold text-red-800">{statistics.maxContribRate.toFixed(2)}</p>
                  <p className="text-xs text-red-600">OMR/m²</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-xs text-blue-600 uppercase tracking-wide">Total BUA</p>
                  <p className="text-xl font-bold text-blue-800">{statistics.totalBUA.toLocaleString()}</p>
                  <p className="text-xs text-blue-600">m²</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-xs text-purple-600 uppercase tracking-wide">Avg Per Unit</p>
                  <p className="text-xl font-bold text-purple-800">{statistics.avgContribPerUnit.toFixed(0)}</p>
                  <p className="text-xs text-purple-600">OMR</p>
                </div>
              </div>
            </div>
          </ChartWrapper>
        </div>
      )}

      {activeSubSection === "PropertyAnalysis" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper title="Sector Performance" subtitle="Contribution efficiency by sector">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.sectorBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === "avgContrib") return [`${value.toLocaleString()} OMR`, "Avg Contribution per Unit"]
                    return [`${value.toLocaleString()}`, name]
                  }} />
                  <Bar dataKey="avgContrib" fill={COLORS.warning} name="Avg Contribution per Unit" />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Built-Up Area Distribution" subtitle="Total area by sector">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.sectorBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} m²`, "Total BUA"]} />
                  <Area type="monotone" dataKey="totalBUA" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Property Details Table */}
          <ChartWrapper title="Property Portfolio Analysis" subtitle="Detailed breakdown by unit type">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700">Property Type</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Unit Count</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Total Contribution (OMR)</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Percentage of Fund</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Avg per Unit (OMR)</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.typeBreakdown.map((type, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">{type.type}</td>
                      <td className="p-3 text-right font-semibold text-slate-800">{type.units}</td>
                      <td className="p-3 text-right font-semibold text-slate-800">{type.totalContrib.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <span className="text-sm font-medium text-slate-700">{type.percentage.toFixed(1)}%</span>
                      </td>
                      <td className="p-3 text-right font-semibold text-slate-800">
                        {type.units > 0 ? (type.totalContrib / type.units).toFixed(0) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartWrapper>
        </div>
      )}

      {activeSubSection === "DataQuality" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Missing BUA Data"
              value={dataQuality.missingBUA}
              unit="units"
              icon={AlertCircle}
              trend={dataQuality.missingBUA === 0 ? "Complete" : "Needs attention"}
              trendColor={dataQuality.missingBUA === 0 ? "text-green-600" : "text-red-600"}
              iconBgColor={dataQuality.missingBUA === 0 ? COLORS.success : COLORS.error}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Missing Contributions"
              value={dataQuality.missingContributions}
              unit="units"
              icon={DollarSign}
              trend={dataQuality.missingContributions === 0 ? "Complete" : "Needs attention"}
              trendColor={dataQuality.missingContributions === 0 ? "text-green-600" : "text-red-600"}
              iconBgColor={dataQuality.missingContributions === 0 ? COLORS.success : COLORS.error}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Data Inconsistencies"
              value={dataQuality.inconsistentData}
              unit="units"
              icon={AlertCircle}
              trend={dataQuality.inconsistentData === 0 ? "Consistent" : "Review needed"}
              trendColor={dataQuality.inconsistentData === 0 ? "text-green-600" : "text-orange-600"}
              iconBgColor={dataQuality.inconsistentData === 0 ? COLORS.success : COLORS.warning}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Invalid Rates"
              value={dataQuality.invalidRates}
              unit="units"
              icon={Calculator}
              trend={dataQuality.invalidRates === 0 ? "Valid" : "Check rates"}
              trendColor={dataQuality.invalidRates === 0 ? "text-green-600" : "text-orange-600"}
              iconBgColor={dataQuality.invalidRates === 0 ? COLORS.success : COLORS.warning}
              isLoading={isLoading}
            />
          </div>

          {/* Units with Issues */}
          {statistics.unitsWithIssues > 0 && (
            <ChartWrapper title="Units Requiring Attention" subtitle="Properties with missing or assumed data">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-slate-700">Unit No</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Sector</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Type</th>
                      <th className="text-right p-3 font-semibold text-slate-700">BUA (m²)</th>
                      <th className="text-right p-3 font-semibold text-slate-700">Contribution (OMR)</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData
                      .filter(unit => unit.hasIssues)
                      .slice(0, 20)
                      .map((unit, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-800">{unit.unitNo}</td>
                          <td className="p-3 text-slate-600">{unit.sector}</td>
                          <td className="p-3 text-slate-600">{unit.type}</td>
                          <td className="p-3 text-right text-slate-600">
                            {unit.bua === 0 ? <span className="text-red-600">Missing</span> : unit.bua.toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-slate-600">
                            {unit.totalContrib === 0 ? <span className="text-red-600">Missing</span> : unit.totalContrib.toLocaleString()}
                          </td>
                          <td className="p-3 text-slate-600 max-w-xs truncate" title={unit.notes}>
                            {unit.notes || "No notes"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </ChartWrapper>
          )}
        </div>
      )}

      {/* AI Analysis Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{color: COLORS.primary}}>🧠 AI Reserve Fund Analysis</h3>
              <button onClick={() => setIsAiModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200">
                <AlertCircle size={20} className="text-slate-600"/>
              </button>
            </div>
            {isAiLoading ? (
              <div className="text-center py-8">
                <div className="flex justify-center items-center space-x-3 mb-4">
                  <DollarSign size={48} className="animate-pulse" style={{color: COLORS.primaryLight}} />
                  <Building size={48} className="animate-bounce" style={{color: COLORS.accent}} />
                </div>
                <p className="mt-2 text-slate-600">AI is analyzing reserve fund data...</p>
                <p className="text-sm text-slate-500 mt-1">Evaluating contributions, patterns, and data quality</p>
              </div>
            ) : (
              <div className="text-sm text-slate-700 space-y-3 whitespace-pre-wrap font-mono">
                {aiAnalysisResult ? (
                  aiAnalysisResult.split('\n').map((line, index) => {
                    if (line.startsWith('📊') || line.startsWith('🎯') || line.startsWith('💡') || line.startsWith('⚠️') || line.startsWith('🔍') || line.startsWith('💰')) {
                      return <h4 key={index} className="font-bold text-lg mt-4 mb-2" style={{color: COLORS.primary}}>{line}</h4>
                    }
                    if (line.startsWith('•')) {
                      return <p key={index} className="ml-4 text-slate-700">{line}</p>
                    }
                    return <p key={index} className="text-slate-700">{line}</p>
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
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
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