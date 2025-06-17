"use client"

import { Zap, Droplets, Combine, UserCheck, Power, Menu, Settings, Activity, DollarSign } from "lucide-react"
import { COLORS } from "@/lib/constants"

interface SidebarProps {
  activeMainSection: string
  setActiveMainSection: (section: string) => void
  isCollapsed: boolean
  toggleSidebar: () => void
  isDarkMode: boolean
}

export function Sidebar({
  activeMainSection,
  setActiveMainSection,
  isCollapsed,
  toggleSidebar,
  isDarkMode,
}: SidebarProps) {
  const mainSections = [
    { name: "Electricity System", icon: Zap, sectionId: "ElectricitySystem" },
    { name: "Water Analysis", icon: Droplets, sectionId: "WaterAnalysis" },
    { name: "STP Plant", icon: Combine, sectionId: "STPPlant" },
    { name: "Reserve Fund", icon: DollarSign, sectionId: "ReserveFund" },
    { name: "Contractor Tracker", icon: UserCheck, sectionId: "ContractorTracker" },
    { name: "System Diagnostics", icon: Activity, sectionId: "ElectricityDiagnostics" },
  ]

  return (
    <div
      className={`${isCollapsed ? "w-16 md:w-20" : "w-64 md:w-72"} flex flex-col text-slate-100 p-4 space-y-6 min-h-screen shadow-2xl print:hidden sidebar-transition relative z-30`}
      style={{ backgroundColor: isDarkMode ? "#1e1e2e" : COLORS.primaryDark }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 md:top-6 bg-white rounded-full p-1.5 md:p-2 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7E708A]"
        style={{ color: COLORS.primary }}
      >
        <Menu size={16} />
      </button>

      {/* Logo */}
      <div
        className={`text-2xl md:text-3xl font-bold flex items-center space-x-2 md:space-x-3 text-white ${isCollapsed ? "justify-center" : ""}`}
      >
        <Power size={32} style={{ color: COLORS.primaryLight }} className="animate-pulse flex-shrink-0" />
        {!isCollapsed && <span className="truncate">Muscat Bay OMS</span>}
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {mainSections.map((section) => (
          <button
            key={section.sectionId}
            onClick={() => setActiveMainSection(section.sectionId)}
            className={`w-full flex items-center ${isCollapsed ? "justify-center" : "space-x-2 md:space-x-3"} p-2.5 md:p-3 rounded-lg transition-all duration-200 ease-in-out group hover:text-white relative ${
              section.sectionId === activeMainSection ? "text-white" : "text-slate-200 hover:bg-[#7E708A]"
            }`}
            style={section.sectionId === activeMainSection ? { backgroundColor: COLORS.primary } : {}}
            title={isCollapsed ? section.name : ""}
          >
            <section.icon size={22} className="group-hover:scale-110 transition-transform text-white flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">{section.name}</span>}
            {/* Add indicator for diagnostics */}
            {section.sectionId === "ElectricityDiagnostics" && !isCollapsed && (
              <span className="ml-auto px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                DIAG
              </span>
            )}
            {/* Add indicator for reserve fund */}
            {section.sectionId === "ReserveFund" && !isCollapsed && (
              <span className="ml-auto px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                NEW
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="mt-auto pt-6 border-t border-slate-700">
          <div className="p-3 bg-slate-700 bg-opacity-50 rounded-lg text-center border border-[#7E708A]">
            <p className="text-xs text-slate-300 mb-2">Operations Management Suite</p>
            <button className="w-full text-sm bg-[#7E708A] hover:bg-[#6A5ACD] text-white py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6A5ACD]">
              Global Settings
            </button>
          </div>
        </div>
      )}
      {isCollapsed && (
        <div className="mt-auto pt-6 border-t border-slate-700 flex justify-center">
          <button className="p-2.5 rounded-lg hover:bg-[#7E708A] transition-colors group" title="Global Settings">
            <Settings size={20} className="text-slate-200 group-hover:text-white" />
          </button>
        </div>
      )}
    </div>
  )
}