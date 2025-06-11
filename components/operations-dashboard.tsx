"use client"

import { useState } from "react"
import { Sidebar } from "./layout/sidebar"
import { Header } from "./layout/header"
import { ElectricitySystemModule } from "./modules/electricity-system"
import WaterLossAnalysis from "./modules/water-analysis"
import { STPPlantModule } from "./modules/stp-plant"
import { ContractorTrackerModule } from "./modules/contractor-tracker"
import { Columns, Loader2 } from "lucide-react"
import { COLORS } from "@/lib/constants"

export function OperationsDashboard() {
  const [activeMainSection, setActiveMainSection] = useState("ElectricitySystem")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const handleSectionChange = (section: string) => {
    setIsLoading(true)
    setActiveMainSection(section)
    // Simulate loading time for smooth transitions
    setTimeout(() => setIsLoading(false), 300)
  }

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 p-8 space-y-8">
          <div className="bg-white p-10 rounded-xl shadow-lg text-center border border-slate-200">
            <Loader2 size={48} className="mx-auto animate-spin mb-4" style={{ color: COLORS.primary }} />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Loading Module...</h2>
            <p className="text-slate-500">Please wait while we load the requested section.</p>
          </div>
        </div>
      )
    }

    switch (activeMainSection) {
      case "ElectricitySystem":
        return <ElectricitySystemModule isDarkMode={isDarkMode} />
      case "WaterAnalysis":
        return <WaterLossAnalysis />
      case "STPPlant":
        return <STPPlantModule />
      case "ContractorTracker":
        return <ContractorTrackerModule />
      default:
        return (
          <div className="flex-1 p-8 space-y-8">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-700 mb-4">Module Not Found</h2>
              <p className="text-slate-500">The requested module could not be found.</p>
              <Columns size={48} className="mx-auto mt-6 text-slate-400" style={{ color: COLORS.primaryLight }} />
            </div>
          </div>
        )
    }
  }

  return (
    <div
      className={`flex min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-slate-100"} font-inter transition-colors duration-300`}
    >
      <Sidebar
        activeMainSection={activeMainSection}
        setActiveMainSection={handleSectionChange}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
      />

      <div
        className="flex-1 flex flex-col max-h-screen overflow-y-auto transition-all duration-300 ease-in-out"
        data-collapsed={isCollapsed}
      >
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isCollapsed={isCollapsed} />

        <main className={`flex-1 p-4 md:p-6 space-y-4 md:space-y-6 ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
          {renderMainContent()}
        </main>
      </div>
    </div>
  )
}
