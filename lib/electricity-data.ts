// Updated electricity data service that uses Supabase backend

import { useState, useEffect } from 'react'
import {
  fetchElectricityData,
  fetchMonthlyTrends,
  KWH_TO_OMR_RATE,
  ElectricityRecord,
  TagColor,
  getTotalConsumption,
  getTotalCost,
  getSystemsByCategory,
  getTopConsumers,
  getMonthlyTrends,
  availableMonths
} from '@/lib/electricity-supabase'

// Re-export types and constants for compatibility
export { KWH_TO_OMR_RATE, type ElectricityRecord, type TagColor, availableMonths }

// Custom hook for electricity data
export function useElectricityData() {
  const [data, setData] = useState<ElectricityRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const electricityData = await fetchElectricityData()
        setData(electricityData)
        setError(null)
      } catch (err) {
        console.error('Failed to load electricity data:', err)
        setError('Failed to load electricity data')
        // Fallback to empty array if fetch fails
        setData([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error, refetch: () => loadData() }
}

// Custom hook for monthly trends
export function useMonthlyTrends() {
  const [trends, setTrends] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTrends = async () => {
      try {
        setLoading(true)
        const monthlyTrends = await fetchMonthlyTrends()
        setTrends(monthlyTrends)
        setError(null)
      } catch (err) {
        console.error('Failed to load monthly trends:', err)
        setError('Failed to load monthly trends')
        setTrends({})
      } finally {
        setLoading(false)
      }
    }

    loadTrends()
  }, [])

  return { trends, loading, error }
}

// Maintain backward compatibility - these will now work with the actual data from Supabase
export const initialElectricityData: ElectricityRecord[] = [] // This will be populated by the hook

// Utility functions that work with the fetched data
export { getTotalConsumption, getTotalCost, getSystemsByCategory, getTopConsumers, getMonthlyTrends }

// Helper functions for components that need to access data synchronously
// (These are used in the existing UI components)
export const getElectricityStats = (data: ElectricityRecord[]) => ({
  totalSystems: data.length,
  totalConsumption: getTotalConsumption(data),
  totalCost: getTotalCost(data),
  systemsByCategory: getSystemsByCategory(data),
  topConsumers: getTopConsumers(data),
  monthlyTrends: getMonthlyTrends(data)
})

// For components that need immediate data access (fallback patterns)
export const createMockElectricityRecord = (id: number): ElectricityRecord => ({
  id,
  slNo: id,
  unitName: 'Loading...',
  meterType: 'Loading',
  meterAccountNo: 'N/A',
  category: 'Loading',
  tagColor: 'slate',
  zone: 'N/A',
  muscatBayNumber: 'N/A',
  consumption: {},
  totalConsumption: 0,
  totalCost: 0,
  averageMonthlyConsumption: 0
})

// Loading state data for smooth transitions
export const createLoadingData = (count: number = 5): ElectricityRecord[] => 
  Array.from({ length: count }, (_, i) => createMockElectricityRecord(i + 1))

// Error handling utilities
export const handleElectricityDataError = (error: any) => {
  console.error('Electricity data error:', error)
  // Could add error reporting service here
  return {
    message: 'Failed to load electricity data',
    details: error?.message || 'Unknown error occurred'
  }
}

// Data refresh utility
export const refreshElectricityData = async (): Promise<ElectricityRecord[]> => {
  try {
    return await fetchElectricityData()
  } catch (error) {
    console.error('Failed to refresh electricity data:', error)
    throw error
  }
}
