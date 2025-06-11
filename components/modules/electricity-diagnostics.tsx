"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Upload, 
  AlertTriangle,
  Activity,
  Zap,
  Settings
} from "lucide-react"
import { migrateElectricityData, diagnoseElectricityData } from "@/lib/electricity-data-migration"
import { diagnosePumpStationFiltering } from "@/lib/electricity-supabase"
import { getSupabaseStatus } from "@/lib/supabase"

interface DiagnosticResult {
  success: boolean
  message: string
  details?: any
  error?: any
}

export function ElectricityDiagnostics() {
  const [isLoading, setIsLoading] = useState(false)
  const [migrationResult, setMigrationResult] = useState<DiagnosticResult | null>(null)
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null)
  const [filteringResult, setFilteringResult] = useState<DiagnosticResult | null>(null)
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null)

  const checkSupabaseConnection = async () => {
    setIsLoading(true)
    try {
      const status = getSupabaseStatus()
      setSupabaseStatus(status)
    } catch (error) {
      setSupabaseStatus({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const runDiagnostics = async () => {
    setIsLoading(true)
    setDiagnosticResult(null)
    
    try {
      const result = await diagnoseElectricityData()
      setDiagnosticResult(result)
    } catch (error) {
      setDiagnosticResult({
        success: false,
        message: `Diagnostics failed: ${error.message}`,
        error
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testPumpStationFiltering = async () => {
    setIsLoading(true)
    setFilteringResult(null)
    
    try {
      const result = await diagnosePumpStationFiltering()
      setFilteringResult({
        success: result.success,
        message: `Found ${result.pumpStations.length}/4 pump stations`,
        details: result
      })
    } catch (error) {
      setFilteringResult({
        success: false,
        message: `Filtering test failed: ${error.message}`,
        error
      })
    } finally {
      setIsLoading(false)
    }
  }

  const migrateData = async () => {
    setIsLoading(true)
    setMigrationResult(null)
    
    try {
      const result = await migrateElectricityData()
      setMigrationResult(result)
      
      // Run diagnostics after migration
      if (result.success) {
        setTimeout(() => {
          runDiagnostics()
          testPumpStationFiltering()
        }, 1000)
      }
    } catch (error) {
      setMigrationResult({
        success: false,
        message: `Migration failed: ${error.message}`,
        error
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStatusBadge = (condition: boolean, successText: string, failText: string) => (
    <Badge variant={condition ? "default" : "destructive"} className="ml-2">
      {condition ? (
        <>
          <CheckCircle className="w-3 h-3 mr-1" />
          {successText}
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3 mr-1" />
          {failText}
        </>
      )}
    </Badge>
  )

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Electricity System Diagnostics
        </h1>
        <p className="text-slate-600">
          Diagnose and fix electricity system data issues
        </p>
      </div>

      {/* Supabase Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Supabase Connection Status
          </CardTitle>
          <CardDescription>
            Check if your application is properly connected to Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={checkSupabaseConnection}
            disabled={isLoading}
            className="flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Check Connection
          </Button>
          
          {supabaseStatus && (
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium">Connected:</span>
                {renderStatusBadge(supabaseStatus.connected, "Connected", "Disconnected")}
              </div>
              <div className="flex items-center">
                <span className="font-medium">URL:</span>
                {renderStatusBadge(supabaseStatus.url === "Configured", "Configured", "Missing")}
              </div>
              <div className="flex items-center">
                <span className="font-medium">API Key:</span>
                {renderStatusBadge(supabaseStatus.key === "Configured", "Configured", "Missing")}
              </div>
              <div className="flex items-center">
                <span className="font-medium">Client Type:</span>
                <Badge variant="outline" className="ml-2">
                  {supabaseStatus.client}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Migration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Data Migration
          </CardTitle>
          <CardDescription>
            Import your electricity consumption data into Supabase database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={migrateData}
            disabled={isLoading}
            className="flex items-center"
            variant="default"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Migrate Data to Supabase
          </Button>
          
          {migrationResult && (
            <Alert variant={migrationResult.success ? "default" : "destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {migrationResult.success ? "Migration Successful" : "Migration Failed"}
              </AlertTitle>
              <AlertDescription>{migrationResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Database Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Database Diagnostics
          </CardTitle>
          <CardDescription>
            Check the health and integrity of your electricity data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runDiagnostics}
            disabled={isLoading}
            variant="outline"
            className="flex items-center"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Activity className="w-4 h-4 mr-2" />
            )}
            Run Diagnostics
          </Button>
          
          {diagnosticResult && (
            <div className="space-y-4">
              <Alert variant={diagnosticResult.success ? "default" : "destructive"}>
                <Activity className="h-4 w-4" />
                <AlertTitle>
                  {diagnosticResult.success ? "System Healthy" : "Issues Detected"}
                </AlertTitle>
                <AlertDescription>{diagnosticResult.message}</AlertDescription>
              </Alert>
              
              {diagnosticResult.details && (
                <div className="bg-slate-100 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Diagnostic Details:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Records:</span>
                      <span className="ml-2">{diagnosticResult.details.diagnostics.totalRecords}</span>
                    </div>
                    <div>
                      <span className="font-medium">Pump Stations:</span>
                      <span className="ml-2">
                        {diagnosticResult.details.diagnostics.pumpStationCount}/4
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Categories:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(diagnosticResult.details.diagnostics.categoryBreakdown).map(([cat, count]) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {diagnosticResult.details.diagnostics.pumpStations?.length > 0 && (
                    <div>
                      <h5 className="font-medium mt-3 mb-2">Pump Stations Found:</h5>
                      <div className="space-y-1">
                        {diagnosticResult.details.diagnostics.pumpStations.map((ps: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded">
                            <span>{ps.name} ({ps.meter_account_no})</span>
                            <span className="font-medium">{ps.total_kwh.toLocaleString()} kWh</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pump Station Filtering Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Pump Station Filtering Test
          </CardTitle>
          <CardDescription>
            Test if pump station filtering is working correctly in the UI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testPumpStationFiltering}
            disabled={isLoading}
            variant="outline"
            className="flex items-center"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Test Filtering
          </Button>
          
          {filteringResult && (
            <div className="space-y-4">
              <Alert variant={filteringResult.success ? "default" : "destructive"}>
                <Zap className="h-4 w-4" />
                <AlertTitle>
                  {filteringResult.success ? "Filtering Works Correctly" : "Filtering Issues"}
                </AlertTitle>
                <AlertDescription>{filteringResult.message}</AlertDescription>
              </Alert>
              
              {filteringResult.details && (
                <div className="bg-slate-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Filtering Test Results:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Total Records Processed:</span>
                      <span className="ml-2">{filteringResult.details.totalRecords}</span>
                    </div>
                    <div>
                      <span className="font-medium">Pump Stations Detected:</span>
                      <span className="ml-2">{filteringResult.details.pumpStations.length}</span>
                    </div>
                    
                    {filteringResult.details.filteringTest?.length > 0 && (
                      <div>
                        <h5 className="font-medium mt-3 mb-2">Detected Pump Stations:</h5>
                        <div className="space-y-1">
                          {filteringResult.details.filteringTest.map((ps: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded">
                              <div>
                                <span className="font-medium">{ps.name}</span>
                                <span className="text-slate-500 ml-2">({ps.account})</span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{ps.consumption.toLocaleString()} kWh</div>
                                <div className="text-xs text-slate-500">
                                  Type: {ps.type} | Category: {ps.category}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Fix Actions</CardTitle>
          <CardDescription>
            Common troubleshooting steps to resolve electricity data issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button 
              onClick={() => {
                checkSupabaseConnection()
                runDiagnostics()
                testPumpStationFiltering()
              }}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-start"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Full System Check
            </Button>
            
            <Button 
              onClick={migrateData}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-start"
            >
              <Upload className="w-4 h-4 mr-2" />
              Re-import All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
