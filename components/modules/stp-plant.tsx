"use client"

import { useState, useEffect, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area, AreaChart } from "recharts"
import { Droplets, CheckCircle, Zap, Power, Activity, Target, Gauge, Recycle, Database, Sparkles, X, CalendarDays, Filter } from "lucide-react"
import { SummaryCard } from "@/components/ui/summary-card"
import { ChartWrapper } from "@/components/ui/chart-wrapper"
import { COLORS } from "@/lib/constants"
import { stpPlantData, availableStpMonths, monthlyStpData, PLANT_DESIGN_CAPACITY, type STPDataEntry } from "@/lib/stp-data"

export function STPPlantModule() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSubSection, setActiveSubSection] = useState('Dashboard')
  const [selectedMonth, setSelectedMonth] = useState('May 25')
  const [selectedMetric, setSelectedMetric] = useState('All Metrics')
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Data processing for selected month
  const filteredStpData = useMemo(() => {
    if (selectedMonth === 'All Months') {
      return stpPlantData;
    }
    
    return stpPlantData.filter(item => {
      if (!item.parsedDate) return false;
      const itemMonth = item.parsedDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return itemMonth === selectedMonth;
    });
  }, [selectedMonth]);

  // KPI Calculations based on design capacity
  const kpiData = useMemo(() => {
    const data = filteredStpData;
    const totalDays = data.length;
    
    if (totalDays === 0) {
      return {
        avgTreatedWater: 0,
        avgTseOutput: 0,
        avgEfficiency: 0,
        totalTankersDischarge: 0,
        avgTankerPercentage: 0,
        capacityUtilization: 0,
        totalDays: 0,
        totalTreatedWater: 0,
        totalTseOutput: 0,
        totalInputProcess: 0,
        avgTotalInput: 0
      };
    }

    const totalTreatedWater = data.reduce((acc, curr) => acc + curr.treatedWater, 0);
    const totalTseOutput = data.reduce((acc, curr) => acc + curr.tseOutput, 0);
    const totalInputProcess = data.reduce((acc, curr) => acc + curr.totalInlet, 0);
    const avgTreatedWater = totalTreatedWater / totalDays;
    const avgTseOutput = totalTseOutput / totalDays;
    const avgTotalInput = totalInputProcess / totalDays;
    const avgEfficiency = data.reduce((acc, curr) => acc + curr.treatmentEfficiency, 0) / totalDays;
    const totalTankersDischarge = data.reduce((acc, curr) => acc + curr.tankersDischarge, 0);
    const avgTankerPercentage = data.reduce((acc, curr) => acc + curr.tankerPercentage, 0) / totalDays;
    const capacityUtilization = (avgTreatedWater / PLANT_DESIGN_CAPACITY) * 100;

    return {
      avgTreatedWater: Math.round(avgTreatedWater),
      avgTseOutput: Math.round(avgTseOutput),
      avgEfficiency: Math.round(avgEfficiency * 10) / 10,
      totalTankersDischarge,
      avgTankerPercentage: Math.round(avgTankerPercentage * 10) / 10,
      capacityUtilization: Math.round(capacityUtilization * 10) / 10,
      totalDays,
      totalTreatedWater: Math.round(totalTreatedWater),
      totalTseOutput: Math.round(totalTseOutput),
      totalInputProcess: Math.round(totalInputProcess),
      avgTotalInput: Math.round(avgTotalInput)
    };
  }, [filteredStpData]);

  // Recent 15 days trend data
  const trendData = useMemo(() => {
    return filteredStpData.slice(-15).map(item => ({
      date: item.date ? item.date.substring(0, 5) : 'N/A', // Show MM/DD
      treated: item.treatedWater || 0,
      tse: item.tseOutput || 0,
      inlet: item.totalInlet || 0,
      efficiency: Math.round((item.treatmentEfficiency || 0) * 10) / 10,
      tankers: item.tankersDischarge || 0
    }));
  }, [filteredStpData]);

  // Process efficiency breakdown
  const processEfficiencyData = useMemo(() => {
    const data = filteredStpData;
    if (data.length === 0) {
      return [
        { name: 'Treatment Efficiency', value: 0, color: COLORS.success },
        { name: 'Irrigation Efficiency', value: 0, color: COLORS.info },
        { name: 'Tanker Input Ratio', value: 0, color: COLORS.warning },
        { name: 'Direct Sewage Ratio', value: 0, color: '#A8D5E3' }
      ];
    }
    
    const avgTreatmentEff = data.reduce((acc, curr) => acc + (curr.treatmentEfficiency || 0), 0) / data.length;
    const avgIrrigationEff = data.reduce((acc, curr) => acc + (curr.irrigationEfficiency || 0), 0) / data.length;
    const avgTankerRatio = data.reduce((acc, curr) => acc + (curr.tankerPercentage || 0), 0) / data.length;
    
    return [
      { name: 'Treatment Efficiency', value: Math.round(avgTreatmentEff * 10) / 10, color: COLORS.success },
      { name: 'Irrigation Efficiency', value: Math.round(avgIrrigationEff * 10) / 10, color: COLORS.info },
      { name: 'Tanker Input Ratio', value: Math.round(avgTankerRatio * 10) / 10, color: COLORS.warning },
      { name: 'Direct Sewage Ratio', value: Math.round((100 - avgTankerRatio) * 10) / 10, color: '#A8D5E3' }
    ];
  }, [filteredStpData]);

  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiAnalysisResult("");
    
    setTimeout(() => {
      const monthText = selectedMonth === 'All Months' ? 'All Available Data' : selectedMonth;
      const remainingCapacity = Math.max(0, PLANT_DESIGN_CAPACITY - kpiData.avgTreatedWater);
      const performanceStatus = kpiData.capacityUtilization > 85 ? 'NEAR CAPACITY' : 
                               kpiData.capacityUtilization > 70 ? 'HIGH UTILIZATION' : 
                               kpiData.capacityUtilization > 50 ? 'MODERATE UTILIZATION' : 'LOW UTILIZATION';
      
      setAiAnalysisResult(`🔬 AI Analysis Results for STP Plant (${monthText}):

📊 PERFORMANCE SUMMARY:
• Plant Design Capacity: ${PLANT_DESIGN_CAPACITY} m³/day
• Period: ${selectedMonth === 'All Months' ? `${kpiData.totalDays} days total` : `${selectedMonth} (${kpiData.totalDays} days)`}
• Total Water Treated: ${kpiData.totalTreatedWater.toLocaleString()} m³
• Total Input Processed: ${kpiData.totalInputProcess.toLocaleString()} m³
• Total TSE Production: ${kpiData.totalTseOutput.toLocaleString()} m³
• Current Avg Production: ${kpiData.avgTreatedWater} m³/day
• Capacity Utilization: ${kpiData.capacityUtilization}% (${performanceStatus})

🎯 CAPACITY ANALYSIS:
• ${kpiData.capacityUtilization > 80 ? 'HIGH DEMAND: Operating near design limits' : kpiData.capacityUtilization > 60 ? 'MODERATE DEMAND: Good operational range' : 'LOW DEMAND: Significant spare capacity available'}
• Remaining Daily Capacity: ${remainingCapacity} m³/day
• Treatment Efficiency: ${kpiData.avgEfficiency}% (Target: >90%)
• TSE Recovery Rate: ${kpiData.avgTreatedWater > 0 ? Math.round((kpiData.avgTseOutput / kpiData.avgTreatedWater) * 100) : 0}%
• Tanker Operations: ${kpiData.totalTankersDischarge} units (${kpiData.avgTankerPercentage.toFixed(1)}% of input)

⚡ OPERATIONAL INSIGHTS:
• Treatment efficiency is ${kpiData.avgEfficiency > 90 ? 'EXCELLENT' : kpiData.avgEfficiency > 80 ? 'GOOD' : 'NEEDS IMPROVEMENT'} - ${kpiData.avgEfficiency > 90 ? 'exceeding target standards' : 'below optimal performance'}
• ${selectedMonth === 'All Months' ? `Overall production averaging ${kpiData.avgTreatedWater} m³/day` : `${selectedMonth} production: ${kpiData.totalTreatedWater.toLocaleString()} m³ total`}
• Input vs Output Ratio: ${kpiData.totalInputProcess > 0 ? Math.round((kpiData.totalTreatedWater / kpiData.totalInputProcess) * 100) : 0}% processing efficiency
• TSE Production represents ${kpiData.totalTreatedWater > 0 ? Math.round((kpiData.totalTseOutput / kpiData.totalTreatedWater) * 100) : 0}% of treated water

💡 STRATEGIC RECOMMENDATIONS:
• CAPACITY: ${kpiData.capacityUtilization > 85 ? 'URGENT - Consider expansion planning, operating near design limits' : kpiData.capacityUtilization < 50 ? 'OPPORTUNITY - Significant spare capacity for growth' : 'OPTIMAL - Good utilization range for efficient operations'}
• EFFICIENCY: ${kpiData.avgEfficiency < 85 ? 'CRITICAL - Investigate treatment process efficiency, equipment maintenance required' : 'MAINTAIN - Current operational standards meeting targets'}
• INPUT SOURCE: ${kpiData.avgTankerPercentage > 60 ? 'HIGH TANKER DEPENDENCY - Evaluate direct sewage line capacity expansion' : 'BALANCED - Good distribution between tanker and direct inputs'}
• TSE UTILIZATION: ${kpiData.totalTseOutput > 0 ? `${kpiData.totalTseOutput.toLocaleString()} m³ TSE available for irrigation - optimize reuse programs` : 'Monitor TSE production for irrigation opportunities'}
• FUTURE PLANNING: ${remainingCapacity > 100 ? `${remainingCapacity} m³/day spare capacity supports development growth` : 'Consider operational optimization strategies'}`);
      setIsAiLoading(false);
    }, 2500);
  };

  // Sub-navigation for STP module
  const StpSubNav = () => {
    const subSections = [
        { name: 'Dashboard', id: 'Dashboard', icon: Gauge },
        { name: 'Performance', id: 'Performance', icon: Activity },
        { name: 'Process Flow', id: 'ProcessFlow', icon: Recycle },
        { name: 'Analytics', id: 'Analytics', icon: Target },
    ];
    
    return (
        <div className="mb-6 print:hidden flex justify-center">
            <div className="bg-white shadow-md rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
                {subSections.map((tab) => {
                    const isActive = activeSubSection === tab.id;
                    return ( 
                      <button 
                        key={tab.id} 
                        onClick={() => setActiveSubSection(tab.id)} 
                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105`} 
                        style={{ backgroundColor: isActive ? COLORS.primary : 'transparent', color: isActive ? 'white' : COLORS.primary, }} 
                        onMouseOver={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = COLORS.primary; if(!isActive) e.currentTarget.style.color = 'white';}} 
                        onMouseOut={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; if(!isActive) e.currentTarget.style.color = COLORS.primary;}}
                      > 
                        <tab.icon size={18} style={{ color: isActive ? 'white' : COLORS.primary }}/> 
                        <span>{tab.name}</span> 
                      </button> 
                    );
                })}
            </div>
        </div>
    );
  };

  // Filter Bar
  const FilterBar = () => {
    const monthOptions = [
      { value: 'All Months', label: 'All Months' },
      ...availableStpMonths.map(m => ({ value: m, label: m }))
    ];
    
    const metricOptions = [
      { value: 'All Metrics', label: 'All Metrics' },
      { value: 'Treatment Efficiency', label: 'Treatment Efficiency' },
      { value: 'Water Production', label: 'Water Production' },
      { value: 'Capacity Utilization', label: 'Capacity Utilization' },
      { value: 'Tanker Operations', label: 'Tanker Operations' }
    ];
    
    return (
        <div className="bg-white shadow p-4 rounded-lg mb-6 print:hidden sticky top-[110px] md:top-[88px] z-10 border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="monthFilter" className="block text-sm font-medium text-slate-700 mb-1">Select Month</label>
                    <div className="relative">
                        <select 
                          id="monthFilter" 
                          value={selectedMonth} 
                          onChange={(e) => setSelectedMonth(e.target.value)} 
                          className="appearance-none w-full p-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:outline-none bg-white text-slate-700"
                          style={{ '--tw-ring-color': COLORS.primary }}
                        >
                            {monthOptions.map(option => ( <option key={option.value} value={option.value}>{option.label}</option> ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                            <CalendarDays size={16} />
                        </div>
                    </div>
                </div>
                
                <div>
                    <label htmlFor="metricFilter" className="block text-sm font-medium text-slate-700 mb-1">Focus Metrics</label>
                    <div className="relative">
                        <select 
                          id="metricFilter" 
                          value={selectedMetric} 
                          onChange={(e) => setSelectedMetric(e.target.value)} 
                          className="appearance-none w-full p-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:outline-none bg-white text-slate-700"
                          style={{ '--tw-ring-color': COLORS.primary }}
                        >
                            {metricOptions.map(option => ( <option key={option.value} value={option.value}>{option.label}</option> ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                            <Target size={16} />
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={handleAiAnalysis}
                  className="text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 h-[46px] w-full lg:w-auto hover:shadow-lg" 
                  style={{ backgroundColor: '#A8D5E3', color: COLORS.primary }} 
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = COLORS.primary} 
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#A8D5E3'}
                  disabled={isAiLoading}
                > 
                  <Sparkles size={16}/> 
                  <span>{isAiLoading ? 'Analyzing...' : '🧠 AI Analysis'}</span> 
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6">
      <StpSubNav />
      
      {activeSubSection === 'Dashboard' && <FilterBar />}
      
      {activeSubSection === 'Dashboard' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total Treated Water" : `${selectedMonth} Total`} 
              value={kpiData.totalTreatedWater.toLocaleString()} 
              unit="m³" 
              icon={Droplets} 
              trend={selectedMonth === 'All Months' ? `${kpiData.avgTreatedWater} m³/day avg` : `${kpiData.avgTreatedWater} m³/day avg`} 
              trendColor="text-slate-500" 
              iconBgColor={COLORS.info}
              isLoading={isLoading}
            />
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total Input Process" : `${selectedMonth} Input`} 
              value={kpiData.totalInputProcess.toLocaleString()} 
              unit="m³" 
              icon={Activity} 
              trend={selectedMonth === 'All Months' ? `${kpiData.avgTotalInput} m³/day avg` : `${kpiData.avgTotalInput} m³/day avg`} 
              trendColor="text-slate-600" 
              iconBgColor='#A8D5E3'
              isLoading={isLoading}
            />
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total TSE Production" : `${selectedMonth} TSE`} 
              value={kpiData.totalTseOutput.toLocaleString()} 
              unit="m³" 
              icon={Recycle} 
              trend={selectedMonth === 'All Months' ? `${kpiData.avgTseOutput} m³/day avg` : `${kpiData.avgTseOutput} m³/day avg`} 
              trendColor="text-green-600" 
              iconBgColor='#BFA181'
              isLoading={isLoading}
            />
            <SummaryCard 
              title="Capacity Utilization" 
              value={kpiData.capacityUtilization} 
              unit="%" 
              icon={Gauge} 
              trend={`${Math.max(0, PLANT_DESIGN_CAPACITY - kpiData.avgTreatedWater)} m³/day spare`} 
              trendColor="text-slate-600" 
              iconBgColor={COLORS.primary}
              isLoading={isLoading}
            />
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total Tankers" : `${selectedMonth} Tankers`} 
              value={kpiData.totalTankersDischarge} 
              unit="units" 
              icon={Database} 
              trend={`${kpiData.avgTankerPercentage.toFixed(1)}% of input`} 
              trendColor="text-slate-600" 
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartWrapper title="Daily Treatment Performance" subtitle={`Recent 15 days - ${selectedMonth === 'All Months' ? 'Latest Data' : selectedMonth}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'white', borderRadius: '8px', borderColor: '#e2e8f0'}} 
                      itemStyle={{color: '#334155'}} 
                      labelStyle={{color: '#0f172a', fontWeight: 'bold'}}
                    />
                    <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
                    <Bar yAxisId="left" dataKey="treated" fill={COLORS.chart[0]} name="Treated Water (m³)" />
                    <Bar yAxisId="left" dataKey="tse" fill={COLORS.chart[1]} name="TSE Output (m³)" />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={COLORS.success} strokeWidth={3} name="Efficiency %" />
                    {/* Design capacity reference line */}
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey={() => PLANT_DESIGN_CAPACITY} 
                      stroke={COLORS.error} 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      name="Design Capacity (750 m³)" 
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            <ChartWrapper title="Performance Metrics" subtitle={`${selectedMonth} efficiency breakdown`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processEfficiencyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    cornerRadius={3}
                  >
                    {processEfficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: '15px', fontSize: '11px'}}/>
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </>
      )}

      {/* AI Analysis Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> 
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"> 
            <div className="flex justify-between items-center mb-4"> 
              <h3 className="text-xl font-semibold" style={{color: COLORS.primary}}>🧠 AI STP Plant Analysis</h3> 
              <button onClick={() => setIsAiModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200"> 
                <X size={20} className="text-slate-600"/> 
              </button> 
            </div> 
            {isAiLoading ? ( 
              <div className="text-center py-8"> 
                <div className="flex justify-center items-center space-x-3 mb-4">
                  <Recycle size={48} className="animate-pulse" style={{color: COLORS.primary}} /> 
                  <Database size={48} className="animate-bounce" style={{color: '#A8D5E3'}} />
                </div>
                <p className="mt-2 text-slate-600">AI is analyzing STP performance data...</p> 
                <p className="text-sm text-slate-500 mt-1">Evaluating treatment efficiency, flow patterns, and operational metrics</p>
              </div> 
            ) : ( 
              <div className="text-sm text-slate-700 space-y-3 whitespace-pre-wrap font-mono"> 
                {aiAnalysisResult ? ( 
                  aiAnalysisResult.split('\n').map((line, index) => {
                    if (line.startsWith('📊') || line.startsWith('🎯') || line.startsWith('⚡') || line.startsWith('💡')) {
                      return <h4 key={index} className="font-bold text-lg mt-4 mb-2" style={{color: COLORS.primary}}>{line}</h4>;
                    }
                    if (line.startsWith('•')) {
                      return <p key={index} className="ml-4 text-slate-700">{line}</p>;
                    }
                    return <p key={index} className="text-slate-700">{line}</p>;
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
