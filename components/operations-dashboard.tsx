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
  const [activeMainSection, setActiveMainSection] = useState("ElectricitySystem")
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

  // Check connection status on mount
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
    // Simulate loading time for smooth transitions
    setTimeout(() => setIsLoading(false), 300)
  }

  const handleRetryConnection = () => {
    window.location.reload()
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

    // Show connection status if there's an issue
    if (!connectionStatus.isConnected && connectionStatus.error) {
      return (
        <div className="flex-1 p-8 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="text-center mb-6">
              <WifiOff size={48} className="mx-auto text-orange-500 mb-4" />
              <h2 className="text-2xl font-bold text-slate-700 mb-2">Connection Issue</h2>
              <p className="text-slate-500 mb-6">
                We're having trouble connecting to the database. The application is running in offline mode.
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
                  <h4 className="text-blue-800 font-semibold mb-1">For Developers</h4>
                  <p className="text-blue-700 text-sm">
                    If you're deploying this application, ensure the following environment variables are set:
                  </p>
                  <ul className="text-blue-700 text-sm mt-2 space-y-1">
                    <li>• <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></li>
                    <li>• <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    switch (activeMainSection) {
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
      case "STPPlant":
        return (
          <ErrorBoundary>
            <STPPlantModule />
          </ErrorBoundary>
        )
      case "ContractorTracker":
        return (
          <ErrorBoundary>
            <ContractorTrackerModule />
          </ErrorBoundary>
        )
      case "ElectricityDiagnostics":
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
              <p className="text-slate-500">The requested module could not be found.</p>
              <Columns size={48} className="mx-auto mt-6 text-slate-400" style={{ color: COLORS.primaryLight }} />
            </div>
          </div>
        )
    }
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

          {/* Connection Status Bar */}
          {connectionStatus.status && (
            <div className="px-4 py-2 bg-white border-b border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {connectionStatus.isConnected ? (
                    <>
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-green-700">Connected to database</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="text-orange-600" size={16} />
                      <span className="text-orange-700">Using offline mode</span>
                    </>
                  )}
                </div>
                <div className="text-slate-500 text-xs">
                  Status: {connectionStatus.status.client}
                </div>
              </div>
            </div>
          )}

          <main className={`flex-1 p-4 md:p-6 space-y-4 md:space-y-6 ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
            {renderMainContent()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
