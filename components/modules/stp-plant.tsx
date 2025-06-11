"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Droplets, CheckCircle, Zap, Power } from "lucide-react"
import { SummaryCard } from "@/components/ui/summary-card"
import { ChartWrapper } from "@/components/ui/chart-wrapper"
import { COLORS } from "@/lib/constants"

export function STPPlantModule() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState("July 2024")
  const [selectedMetric, setSelectedMetric] = useState("Treatment Efficiency")

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const treatmentStages = [
    { name: "Primary Treatment", efficiency: 85, status: "operational" },
    { name: "Secondary Treatment", efficiency: 92, status: "operational" },
    { name: "Tertiary Treatment", efficiency: 96, status: "operational" },
    { name: "Disinfection", efficiency: 99, status: "operational" },
  ]

  const dailyTreatmentData = [
    { name: "Mon", inflow: 800, treated: 760, efficiency: 95 },
    { name: "Tue", inflow: 850, treated: 810, efficiency: 95.3 },
    { name: "Wed", inflow: 780, treated: 745, efficiency: 95.5 },
    { name: "Thu", inflow: 820, treated: 785, efficiency: 95.7 },
    { name: "Fri", inflow: 900, treated: 865, efficiency: 96.1 },
    { name: "Sat", inflow: 750, treated: 720, efficiency: 96 },
    { name: "Sun", inflow: 700, treated: 672, efficiency: 96 },
  ]

  // Sample data for monthly performance (July 2024 - May 2025)
  const monthlyPerformanceData = [
    { month: "July 2024", inflow: 24800, treated: 23600, efficiency: 95.1, tseProduction: 18000, tankerInput: 2000 },
    { month: "August 2024", inflow: 25500, treated: 24300, efficiency: 95.3, tseProduction: 18500, tankerInput: 2100 },
    {
      month: "September 2024",
      inflow: 23400,
      treated: 22300,
      efficiency: 95.5,
      tseProduction: 17000,
      tankerInput: 1900,
    },
    { month: "October 2024", inflow: 25400, treated: 24200, efficiency: 95.3, tseProduction: 18400, tankerInput: 2000 },
    {
      month: "November 2024",
      inflow: 24500,
      treated: 23400,
      efficiency: 95.5,
      tseProduction: 17800,
      tankerInput: 1950,
    },
    {
      month: "December 2024",
      inflow: 23000,
      treated: 21900,
      efficiency: 95.2,
      tseProduction: 16500,
      tankerInput: 1800,
    },
    { month: "January 2025", inflow: 22000, treated: 20900, efficiency: 95.0, tseProduction: 15800, tankerInput: 1700 },
    {
      month: "February 2025",
      inflow: 21000,
      treated: 19900,
      efficiency: 94.8,
      tseProduction: 15000,
      tankerInput: 1600,
    },
    { month: "March 2025", inflow: 24000, treated: 22800, efficiency: 95.0, tseProduction: 17500, tankerInput: 1900 },
    { month: "April 2025", inflow: 25000, treated: 23800, efficiency: 95.2, tseProduction: 18200, tankerInput: 2000 },
    { month: "May 2025", inflow: 26000, treated: 24800, efficiency: 95.4, tseProduction: 19000, tankerInput: 2100 },
  ]

  // Design capacity
  const designCapacity = 750 * 30 // m³/month (approximate)

  // Calculate KPIs
  const currentMonthData = monthlyPerformanceData.find((data) => data.month === selectedMonth)
  const treatmentEfficiency = currentMonthData ? currentMonthData.efficiency : 0
  const capacityUtilization = currentMonthData ? (currentMonthData.inflow / designCapacity) * 100 : 0
  const tseProduction = currentMonthData ? currentMonthData.tseProduction : 0

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  const handleMetricChange = (event) => {
    setSelectedMetric(event.target.value)
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">STP Plant Dashboard</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Treatment Efficiency"
            value={treatmentEfficiency.toFixed(1)}
            unit="%"
            icon={CheckCircle}
            trend="Above target"
            trendColor="text-green-600"
            iconBgColor={COLORS.success}
            isLoading={isLoading}
          />
          <SummaryCard
            title="Capacity Utilization"
            value={capacityUtilization.toFixed(1)}
            unit="%"
            icon={Droplets}
            trend="Optimal range"
            trendColor="text-blue-600"
            iconBgColor={COLORS.info}
            isLoading={isLoading}
          />
          <SummaryCard
            title="TSE Production"
            value={(tseProduction / 1000).toFixed(1)}
            unit="k m³"
            icon={Zap}
            trend="Meeting irrigation demand"
            trendColor="text-green-600"
            iconBgColor={COLORS.warning}
            isLoading={isLoading}
          />
          <SummaryCard
            title="System Status"
            value="Online"
            unit=""
            icon={Power}
            trend="All systems operational"
            trendColor="text-green-600"
            iconBgColor={COLORS.success}
            isLoading={isLoading}
          />
        </div>
      </section>

      {/* Performance Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Performance</h2>

        {/* Month and Metric Selection */}
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Select Month:
            </label>
            <select
              id="month"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {monthlyPerformanceData.map((data) => (
                <option key={data.month} value={data.month}>
                  {data.month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="metric" className="block text-sm font-medium text-gray-700">
              Select Metric:
            </label>
            <select
              id="metric"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={selectedMetric}
              onChange={handleMetricChange}
            >
              <option value="Treatment Efficiency">Treatment Efficiency</option>
              <option value="Capacity Utilization">Capacity Utilization</option>
              <option value="TSE Production">TSE Production</option>
            </select>
          </div>
        </div>

        {/* Chart based on selected metric */}
        <ChartWrapper title={`${selectedMetric} - ${selectedMonth}`} subtitle="Monthly performance overview">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[currentMonthData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedMetric === "Treatment Efficiency" && (
                <Bar dataKey="efficiency" fill={COLORS.chart[0]} name="Efficiency (%)" />
              )}
              {selectedMetric === "Capacity Utilization" && (
                <Bar dataKey="inflow" fill={COLORS.chart[1]} name="Inflow (m³)" />
              )}
              {selectedMetric === "TSE Production" && (
                <Bar dataKey="tseProduction" fill={COLORS.chart[2]} name="TSE (m³)" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </section>

      {/* Process Flow Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Process Flow</h2>
        <ChartWrapper title="Treatment Stages" subtitle="Current efficiency by stage">
          <div className="space-y-4 mt-4">
            {treatmentStages.map((stage, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-slate-700">{stage.name}</h4>
                  <span className="text-green-600 text-sm font-medium">{stage.efficiency}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stage.efficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </ChartWrapper>
      </section>

      {/* Analytics Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
        <p>
          AI analysis provides detailed insights into plant performance, including predictive maintenance, anomaly
          detection, and optimization recommendations.
        </p>
        {/* Monthly Performance Summary Table */}
        <ChartWrapper title="Monthly Performance Summary" subtitle="Key metrics for each month">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inflow (m³)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Treated (m³)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TSE Production (m³)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanker Input (m³)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyPerformanceData.map((data) => (
                  <tr key={data.month}>
                    <td className="px-6 py-4 whitespace-nowrap">{data.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.inflow}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.treated}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.efficiency.toFixed(1)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.tseProduction}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.tankerInput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartWrapper>
      </section>
    </div>
  )
}
