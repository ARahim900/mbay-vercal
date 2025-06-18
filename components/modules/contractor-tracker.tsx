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
} from "recharts"
import { DollarSign, CheckCircle, AlertCircle, Building, FileText, Filter, LayoutDashboard } from "lucide-react"
import { SummaryCard } from "@/components/ui/summary-card"
import { ChartWrapper } from "@/components/ui/chart-wrapper"
import { StyledSelect } from "@/components/ui/styled-select"
import { COLORS } from "@/lib/constants"

// Contractor Data
const contractorRawData = `Contractor	Service Provided	Status	Contract Type	Start Date	End Date	Contract (OMR)/Month	Contract Total (OMR)/Year	Note
KONE Assarain LLC	Lift Maintenance Services	Active	Contract	1/1/2025	12/31/2025	525 OMR	11550 OMR (Excl VAT)	
Oman Water Treatment Company (OWATCO)	Comprehensive STP Operation and Maintenance	Active	Contract	1/26/2024	1/25/2029	3,103.8 OMR	37,245.4 OMR (Inc VAT)	New contract due to early termination of previous Contract with Celar Company
Kalhat	Facility Management (FM)	Active	Contract	5/7/2024	5/6/2030	32,200.8 OMR	386,409.718 OMR (Inc VAT)	New contract overlapping with COMO
Future Cities S.A.O.C (Tadoom)	SUPPLY AND INSTALLATION OF SMART WATER METERS, BILLING FOR WATER CONSUMPTION  	Active	Contract	9/24/2024	9/23/2032	2.7 Per Meter Collection	184.3 OMR 	New contract replacing OIFC
Muna Noor International LLC	Pest Control Services	Active	Contract	7/1/2024	6/30/2026	1,400 /Month Inc VAT	16,000 OMR (Inc VAT)	
Celar Water	Comprehensive STP Operation and Maintenance	Expired	Contract	1/16/2021	1/15/2025	4,439 /Month		Transitioned to OWATCO before contract end
Gulf Expert	Chillers, BMS & Pressurisation Units	Active	Contract	6/3/2024	6/2/2025	770 OMR	9,240 OMR (Inc VAT)	
Advanced Technology and Projects Company	BMS Non-Comprehensive Annual Maintenance	Expired	PO	3/26/2023	3/25/2024	3,800 /Year		
Al Naba Services LLC	Garbage Removal Services	Expired	Contract	4/2/2023	4/1/2024	32 /Skip Trip		
Bahwan Engineering Company LLC	Maintenance of Fire Alarm & Fire Fighting Equipment	Active	Contract	11/1/2024	10/31/2025	743.8	8,925 OMR (Inc VAT)	
Oman Pumps Manufacturing Co.	Supply, Installation, and Commissioning of Pumps	Expired	Contract	2/23/2020	7/22/2025	37,800 on Delivery		
Rimal Global	Provision of Services	Expired	Contract	11/22/2021	11/21/2031	51,633 on Delivery		
COMO	Facility Management (FM)	Expired	Contract	3/1/2022	2/28/2025	44,382 /Month		Transitioned to Kalhat before contract end
Muscat Electronics LLC	Daikin AC Chillers (Sale Center) Maintenance Services	Expired	Contract	3/26/2023	4/25/2024	199.5 /Service Quarter		Nearing expiration, review for renewal needed
Uni Gaz	Gas Refilling for Flame Operation at Muscat Bay Main Entrance	Expired	PO					
Genetcoo	York AC Chillers (Zone 01) Maintenance Services	Expired	Contract					
NMC	Lagoon Main Two Drain Pipes Cleaning	Active	PO					`

const parseContractorData = (rawData: string) => {
  const lines = rawData.split("\n")
  const headers = lines[0].split("\t").map((h) => h.trim())
  const dataLines = lines.slice(1)

  return dataLines
    .map((line, index) => {
      const values = line.split("\t").map((v) => v.trim())
      if (values.length < 3 || !values[0]) return null

      // Parse dates
      const parseDate = (dateStr: string) => {
        if (!dateStr) return null
        const [month, day, year] = dateStr.split("/")
        return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      }

      // Extract monetary values
      const extractAmount = (str: string) => {
        if (!str) return 0
        const match = str.match(/[\d,]+\.?\d*/)
        return match ? Number.parseFloat(match[0].replace(/,/g, "")) : 0
      }

      // Calculate contract duration
      const startDate = parseDate(values[4])
      const endDate = parseDate(values[5])
      const durationMonths =
        startDate && endDate ? Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0

      // Determine contract category
      const service = values[1]?.toLowerCase() || ""
      let category = "Other"
      if (service.includes("maintenance") || service.includes("bms") || service.includes("chiller")) {
        category = "Maintenance"
      } else if (service.includes("facility") || service.includes("fm")) {
        category = "Facility Management"
      } else if (service.includes("stp") || service.includes("water")) {
        category = "Water & STP"
      } else if (service.includes("security") || service.includes("fire")) {
        category = "Security & Safety"
      } else if (service.includes("pest") || service.includes("garbage") || service.includes("cleaning")) {
        category = "Environmental Services"
      }

      return {
        id: index + 1,
        contractor: values[0] || "N/A",
        service: values[1] || "N/A",
        status: values[2] || "Unknown",
        contractType: values[3] || "N/A",
        startDate: values[4] || "N/A",
        endDate: values[5] || "N/A",
        monthlyAmount: extractAmount(values[6]),
        yearlyAmount: extractAmount(values[7]),
        note: values[8] || "",
        category,
        durationMonths,
        startDateParsed: startDate,
        endDateParsed: endDate,
        isActive: values[2]?.toLowerCase() === "active",
        isExpired: values[2]?.toLowerCase() === "expired",
        daysRemaining:
          endDate && values[2]?.toLowerCase() === "active"
            ? Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
            : 0,
      }
    })
    .filter(Boolean)
}

const contractorData = parseContractorData(contractorRawData)

export function ContractorTrackerModule() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSubSection, setActiveSubSection] = useState("Overview")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return contractorData.filter((item) => {
      const statusMatch = selectedStatus === "All Status" || item.status === selectedStatus
      const categoryMatch = selectedCategory === "All Categories" || item.category === selectedCategory
      return statusMatch && categoryMatch
    })
  }, [selectedStatus, selectedCategory])

  // KPI Calculations
  const kpiData = useMemo(() => {
    const activeContracts = filteredData.filter((item) => item.isActive)
    const expiredContracts = filteredData.filter((item) => item.isExpired)
    const totalYearlyValue = activeContracts.reduce((sum, item) => sum + item.yearlyAmount, 0)
    const totalMonthlyValue = activeContracts.reduce((sum, item) => sum + item.monthlyAmount, 0)
    const avgContractDuration = activeContracts.length
      ? activeContracts.reduce((sum, item) => sum + item.durationMonths, 0) / activeContracts.length
      : 0
    const contractsExpiringSoon = activeContracts.filter((item) => item.daysRemaining <= 90 && item.daysRemaining > 0)

    return {
      totalContracts: filteredData.length,
      activeContracts: activeContracts.length,
      expiredContracts: expiredContracts.length,
      totalYearlyValue,
      totalMonthlyValue,
      avgContractDuration: Math.round(avgContractDuration),
      contractsExpiringSoon: contractsExpiringSoon.length,
      upcomingRenewals: contractsExpiringSoon,
    }
  }, [filteredData])

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const statusCounts = filteredData.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color:
        status === "Active"
          ? COLORS.success
          : status === "Expired"
            ? COLORS.error
            : status === "Pending"
              ? COLORS.warning
              : COLORS.info,
    }))
  }, [filteredData])

  // Category distribution for bar chart
  const categoryDistribution = useMemo(() => {
    const categoryCounts = filteredData.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category,
        count,
        value: filteredData
          .filter((item) => item.category === category && item.isActive)
          .reduce((sum, item) => sum + item.yearlyAmount, 0),
      }))
      .sort((a, b) => b.value - a.value)
  }, [filteredData])

  // Monthly spending trend (simulated data based on active contracts)
  const monthlySpendingTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map((month, index) => ({
      month,
      spending: kpiData.totalMonthlyValue + Math.random() * 5000 - 2500, // Simulated variance
      contracts: kpiData.activeContracts + Math.floor(Math.random() * 3 - 1),
    }))
  }, [kpiData])

  // Sub-navigation
  const ContractorSubNav = () => {
    const subSections = [
      { name: "Overview", id: "Overview", icon: LayoutDashboard },
      { name: "Active Contracts", id: "ActiveContracts", icon: CheckCircle },
      { name: "Financial Analysis", id: "Financial", icon: DollarSign },
      { name: "Contract Management", id: "Management", icon: FileText },
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
    const statusOptions = [
      { value: "All Status", label: "All Status" },
      { value: "Active", label: "Active" },
      { value: "Expired", label: "Expired" },
      { value: "Pending", label: "Pending" },
    ]

    const categoryOptions = [
      { value: "All Categories", label: "All Categories" },
      ...Array.from(new Set(contractorData.map((item) => item.category))).map((cat) => ({
        value: cat,
        label: cat,
      })),
    ]

    return (
      <div className="bg-white shadow p-4 rounded-lg mb-6 print:hidden border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <StyledSelect
            id="statusFilter"
            label="Filter by Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={statusOptions}
            icon={CheckCircle}
          />
          <StyledSelect
            id="categoryFilter"
            label="Filter by Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categoryOptions}
            icon={Building}
          />
          <button
            onClick={() => {
              setSelectedStatus("All Status")
              setSelectedCategory("All Categories")
            }}
            className="button-primary flex items-center justify-center space-x-2 h-[46px] w-full lg:w-auto"
          >
            <Filter size={16} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Contractor Management System</h1>
        <p className="text-slate-600">Comprehensive contract tracking and vendor management</p>
      </div>

      <ContractorSubNav />
      <FilterBar />

      {activeSubSection === "Overview" && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Total Contracts"
              value={kpiData.totalContracts}
              unit="contracts"
              icon={FileText}
              trend={`${kpiData.activeContracts} active, ${kpiData.expiredContracts} expired`}
              trendColor="text-slate-600"
              iconBgColor={COLORS.info}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Active Contracts"
              value={kpiData.activeContracts}
              unit="contracts"
              icon={CheckCircle}
              trend="Currently operational"
              trendColor="text-green-600"
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Annual Contract Value"
              value={kpiData.totalYearlyValue.toLocaleString()}
              unit="OMR"
              icon={DollarSign}
              trend={`${kpiData.totalMonthlyValue.toLocaleString()} OMR/month`}
              trendColor="text-blue-600"
              iconBgColor={COLORS.warning}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Expiring Soon"
              value={kpiData.contractsExpiringSoon}
              unit="contracts"
              icon={AlertCircle}
              trend="Within 90 days"
              trendColor="text-orange-600"
              iconBgColor={COLORS.error}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper title="Contract Status Distribution" subtitle="Current contract portfolio">
              {statusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No status data available</p>
                </div>
              )}
            </ChartWrapper>

            <ChartWrapper title="Contracts by Service Category" subtitle="Distribution by service type">
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.primary} name="Contract Count" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No category data available</p>
                </div>
              )}
            </ChartWrapper>
          </div>

          {/* Active Contracts Table */}
          <ChartWrapper title="Active Contracts Overview" subtitle="Current operational contracts" isTable={true}>
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[20%]">Contractor</th>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[30%]">Service</th>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[15%]">Category</th>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[10%]">End Date</th>
                    <th className="text-right p-3 font-semibold text-slate-700 w-[15%]">Annual Value (OMR)</th>
                    <th className="text-center p-3 font-semibold text-slate-700 w-[10%]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                    .filter((item) => item.isActive)
                    .slice(0, 10)
                    .map((contract, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800 truncate" title={contract.contractor}>{contract.contractor}</td>
                        <td className="p-3 text-slate-600 truncate" title={contract.service}>{contract.service}</td>
                        <td className="p-3 text-slate-600 truncate" title={contract.category}>{contract.category}</td>
                        <td className="p-3 text-slate-600 whitespace-nowrap">{contract.endDate}</td>
                        <td className="p-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                          {contract.yearlyAmount.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              contract.daysRemaining <= 30
                                ? "bg-red-100 text-red-800"
                                : contract.daysRemaining <= 90
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {contract.daysRemaining > 0 ? `${contract.daysRemaining} days left` : "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ChartWrapper>
        </>
      )}

      {activeSubSection === "Financial" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWrapper title="Contract Value by Category" subtitle="Annual spending breakdown">
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} OMR`, "Annual Value"]} />
                  <Bar dataKey="value" fill={COLORS.warning} name="Annual Value (OMR)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No financial data available</p>
              </div>
            )}
          </ChartWrapper>

          <ChartWrapper title="Financial Summary" subtitle="Contract value analysis">
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-slate-700">Total Annual Value</h4>
                  <span className="text-lg font-bold text-slate-800">
                    {kpiData.totalYearlyValue.toLocaleString()} OMR
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-slate-700">Monthly Spending</h4>
                  <span className="text-lg font-bold text-slate-800">
                    {kpiData.totalMonthlyValue.toLocaleString()} OMR
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (kpiData.totalMonthlyValue / 50000) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-xs text-blue-600 uppercase tracking-wide">Avg Contract Duration</p>
                  <p className="text-xl font-bold text-blue-800">{kpiData.avgContractDuration} months</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-xs text-purple-600 uppercase tracking-wide">Active Vendors</p>
                  <p className="text-xl font-bold text-purple-800">{kpiData.activeContracts}</p>
                </div>
              </div>
            </div>
          </ChartWrapper>
        </div>
      )}

      {activeSubSection === "Management" && (
        <div className="space-y-6">
          {/* Upcoming Renewals */}
          {kpiData.upcomingRenewals.length > 0 && (
            <ChartWrapper title="Contracts Requiring Attention" subtitle="Expiring within 90 days" isTable={true}>
              <div className="space-y-4 mt-4">
                {kpiData.upcomingRenewals.map((contract, index) => (
                  <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-slate-800">{contract.contractor}</h4>
                        <p className="text-sm text-slate-600">{contract.service}</p>
                        <p className="text-xs text-slate-500 mt-1">End Date: {contract.endDate}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-orange-600">{contract.daysRemaining} days</span>
                        <p className="text-sm text-slate-600">{contract.yearlyAmount.toLocaleString()} OMR/year</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartWrapper>
          )}

          {/* All Contracts Table */}
          <ChartWrapper title="Complete Contract Registry" subtitle="All contracts with detailed information" isTable={true}>
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[18%]">Contractor</th>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[30%]">Service</th>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[10%]">Type</th>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[10%]">Start Date</th>
                    <th className="text-left p-3 font-semibold text-slate-700 w-[10%]">End Date</th>
                    <th className="text-right p-3 font-semibold text-slate-700 w-[12%]">Value (OMR)</th>
                    <th className="text-center p-3 font-semibold text-slate-700 w-[10%]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((contract, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800 truncate" title={contract.contractor}>{contract.contractor}</td>
                      <td className="p-3 text-slate-600 truncate" title={contract.service}>
                        {contract.service}
                      </td>
                      <td className="p-3 text-slate-600 truncate" title={contract.contractType}>{contract.contractType}</td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">{contract.startDate}</td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">{contract.endDate}</td>
                      <td className="p-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                        {contract.yearlyAmount > 0 ? contract.yearlyAmount.toLocaleString() : "N/A"}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            contract.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : contract.status === "Expired"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {contract.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartWrapper>
        </div>
      )}
    </div>
  )
}
