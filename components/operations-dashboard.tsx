"use client"

import React, { useState, useEffect } from "react"
import { Sidebar } from "./layout/sidebar"
import { Header } from "./layout/header"
import { ElectricitySystemModule } from "./modules/electricity-system"
import WaterLossAnalysis from "./modules/water-analysis"
import { STPPlantModule } from "./modules/stp-plant-fixed"
import { ContractorTrackerModule } from "./modules/contractor-tracker"
import { ElectricityDiagnostics } from "./modules/electricity-diagnostics"
import { ConnectionStatus, ErrorFallback } from "./connection-status"
import { Columns, Loader2, Wifi, WifiOff, AlertTriangle, CheckCircle } from "lucide-react"
import { COLORS } from "@/lib/constants"
import { isSupabaseConfigured, getSupabaseStatus } from "@/lib/supabase"

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Application Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || ErrorFallback
      return <FallbackComponent error={this.state.error} resetError={() => this.setState({ hasError: false, error: null })} />
    }

    return this.props.children
  }
}

export function OperationsDashboard() {
  const [activeMainSection, setActiveMainSection] = useState("STPPlant") // Default to working module
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean
    status: any
    error: string | null
  }>({
    isConnected: false,
    status: null,
    error: null
  })

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  // Check connection status on mount (non-blocking)
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConfigured = isSupabaseConfigured()
        const status = getSupabaseStatus()
        
        setConnectionStatus({
          isConnected: isConfigured,
          status,
          error: isConfigured ? null : 'Environment variables not configured'
        })
      } catch (error) {
        setConnectionStatus({
          isConnected: false,
          status: null,
          error: error instanceof Error ? error.message : 'Unknown connection error'
        })
      }
    }

    checkConnection()
  }, [])

  const handleSectionChange = (section: string) => {
    setIsLoading(true)
    setActiveMainSection(section)
    setTimeout(() => setIsLoading(false), 200)
  }

  const handleRetryConnection = () => {
    window.location.reload()
  }

  // Define which modules work offline with local data
  const OFFLINE_MODULES = {
    "STPPlant": true,
    "ElectricitySystem": true, 
    "WaterAnalysis": true
  }

  // Define which modules require database connection
  const DATABASE_ONLY_MODULES = {
    "ContractorTracker": true,
    "ElectricityDiagnostics": true
  }

  const renderModuleContent = () => {
    // Always render offline-capable modules regardless of connection
    switch (activeMainSection) {
      case "STPPlant":
        return (
          <ErrorBoundary>
            <STPPlantModule />
          </ErrorBoundary>
        )
      
      case "ElectricitySystem":
        return (
          <ErrorBoundary>
            <ElectricitySystemModule isDarkMode={isDarkMode} />
          </ErrorBoundary>
        )
        
      case "WaterAnalysis":
        return (
          <ErrorBoundary>
            <WaterLossAnalysis />
          </ErrorBoundary>
        )
        
      case "ContractorTracker":
        // Only show connection error for database-only modules
        if (!connectionStatus.isConnected) {
          return (
            <div className="flex-1 p-8 space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-6">
                  <WifiOff size={48} className="mx-auto text-orange-500 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-700 mb-2">Database Connection Required</h2>
                  <p className="text-slate-500 mb-6">
                    Contractor Tracker requires a database connection to access project data.
                  </p>
                </div>
                
                <ConnectionStatus 
                  isConnected={connectionStatus.isConnected}
                  error={connectionStatus.error}
                  onRetry={handleRetryConnection}
                  showDetails={true}
                />
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-blue-800 font-semibold mb-1">✅ Available Offline Modules</h4>
                      <p className="text-blue-700 text-sm mb-2">
                        These modules work without database connection:
                      </p>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• <button 
                              onClick={() => setActiveMainSection("STPPlant")}
                              className="text-blue-800 font-semibold underline hover:text-blue-900"
                            >
                              STP Plant
                            </button> - Full functionality with local data</li>
                        <li>• <button 
                              onClick={() => setActiveMainSection("ElectricitySystem")}
                              className="text-blue-800 font-semibold underline hover:text-blue-900"
                            >
                              Electricity System
                            </button> - Basic functionality</li>
                        <li>• <button 
                              onClick={() => setActiveMainSection("WaterAnalysis")}
                              className="text-blue-800 font-semibold underline hover:text-blue-900"
                            >
                              Water Analysis
                            </button> - Limited functionality</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        return (
          <ErrorBoundary>
            <ContractorTrackerModule />
          </ErrorBoundary>
        )
        
      case "ElectricityDiagnostics":
        // Only show connection error for database-only modules
        if (!connectionStatus.isConnected) {
          return (
            <div className="flex-1 p-8 space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-6">
                  <WifiOff size={48} className="mx-auto text-orange-500 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-700 mb-2">Database Connection Required</h2>
                  <p className="text-slate-500 mb-6">
                    System Diagnostics requires a database connection to access real-time data.
                  </p>
                </div>
                
                <ConnectionStatus 
                  isConnected={connectionStatus.isConnected}
                  error={connectionStatus.error}
                  onRetry={handleRetryConnection}
                  showDetails={true}
                />
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-green-800 font-semibold mb-1">🚀 Try These Working Modules</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button 
                          onClick={() => setActiveMainSection("STPPlant")}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          STP Plant ✅
                        </button>
                        <button 
                          onClick={() => setActiveMainSection("ElectricitySystem")}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          Electricity System ✅
                        </button>
                        <button 
                          onClick={() => setActiveMainSection("WaterAnalysis")}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                        >
                          Water Analysis ✅
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        return (
          <ErrorBoundary>
            <ElectricityDiagnostics />
          </ErrorBoundary>
        )
        
      default:
        return (
          <div className="flex-1 p-8 space-y-8">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-700 mb-4">Module Not Found</h2>
              <p className="text-slate-500 mb-6">The requested module could not be found.</p>
              <Columns size={48} className="mx-auto mt-6 text-slate-400 mb-6" style={{ color: COLORS.primaryLight }} />
              
              <div className="space-y-2">
                <p className="text-slate-600 font-medium">Available Modules:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.keys(OFFLINE_MODULES).map((moduleName) => (
                    <button
                      key={moduleName}
                      onClick={() => setActiveMainSection(moduleName)}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {moduleName.replace(/([A-Z])/g, ' $1').trim()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 p-8 space-y-8">
          <div className="bg-white p-10 rounded-xl shadow-lg text-center border border-slate-200">
            <Loader2 size={48} className="mx-auto animate-spin mb-4" style={{ color: COLORS.primary }} />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Loading {activeMainSection}...</h2>
            <p className="text-slate-500">Please wait while we load the module.</p>
          </div>
        </div>
      )
    }

    return renderModuleContent()
  }

  return (
    <ErrorBoundary>
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

          {/* Enhanced Connection Status Bar */}
          <div className="px-4 py-2 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {connectionStatus.isConnected ? (
                  <>
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-green-700">🟢 Online - Full functionality</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="text-orange-600" size={16} />
                    <span className="text-orange-700">
                      🟠 Offline - {OFFLINE_MODULES[activeMainSection] ? "✅ Module working" : "⚠️ Limited functionality"}
                    </span>
                  </>
                )}
              </div>
              <div className="text-slate-500 text-xs">
                Module: {activeMainSection} | Status: {connectionStatus.status?.client || "Local"}
              </div>
            </div>
          </div>

          <main className={`flex-1 p-4 md:p-6 space-y-4 md:space-y-6 ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
            {renderMainContent()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
