import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Safe Database type fallback
interface DatabaseRowType {
  [key: string]: any
}

// Import Database types only when available
let Database: any = {}
try {
  const dbTypes = require('@/types/database.types')
  Database = dbTypes.Database || {}
} catch (error) {
  // Fallback if types are not available during build
  console.log('Database types not available, using fallback types')
  Database = {
    public: {
      Tables: {
        electricity_consumption: {
          Row: {} as DatabaseRowType
        }
      }
    }
  }
}

export const KWH_TO_OMR_RATE = 0.025

// Type definitions
export interface ElectricityRecord {
  id: number
  slNo: number
  unitName: string
  meterType: string
  meterAccountNo: string
  category: string
  tagColor: "blue" | "purple" | "orange" | "green" | "slate" | "yellow" | "red"
  zone: string
  muscatBayNumber: string
  consumption: { [month: string]: number }
  totalConsumption: number
  totalCost: number
  averageMonthlyConsumption: number
}

export type TagColor = ElectricityRecord["tagColor"]

// Safe mapping function with error handling
const mapDatabaseToElectricityRecord = (
  row: any,
  index: number
): ElectricityRecord => {
  try {
    const consumption: { [month: string]: number } = {
      'Apr-24': parseFloat(row.apr_2024_kwh) || 0,
      'May-24': parseFloat(row.may_2024_kwh) || 0,
      'Jun-24': parseFloat(row.jun_2024_kwh) || 0,
      'Jul-24': parseFloat(row.jul_2024_kwh) || 0,
      'Aug-24': parseFloat(row.aug_2024_kwh) || 0,
      'Sep-24': parseFloat(row.sep_2024_kwh) || 0,
      'Oct-24': parseFloat(row.oct_2024_kwh) || 0,
      'Nov-24': parseFloat(row.nov_2024_kwh) || 0,
      'Dec-24': parseFloat(row.dec_2024_kwh) || 0,
      'Jan-25': parseFloat(row.jan_2025_kwh) || 0,
      'Feb-25': parseFloat(row.feb_2025_kwh) || 0,
      'Mar-25': parseFloat(row.mar_2025_kwh) || 0,
      'Apr-26': parseFloat(row.apr_2025_kwh) || 0,
    }

    const { category, tagColor, zone } = extractCategoryAndColor(row.name || '', row.type || '')
    
    const totalConsumption = parseFloat(row.total_kwh) || 0
    const totalCost = parseFloat(row.total_cost_omr) || 0
    
    // Calculate average monthly consumption from non-zero months
    const nonZeroMonths = Object.values(consumption).filter(val => val > 0)
    const averageMonthlyConsumption = nonZeroMonths.length > 0 
      ? nonZeroMonths.reduce((sum, val) => sum + val, 0) / nonZeroMonths.length 
      : 0

    return {
      id: row.id || index + 1,
      slNo: index + 1,
      unitName: row.name || `System ${index + 1}`,
      meterType: row.type || 'Unknown',
      meterAccountNo: row.meter_account_no || 'N/A',
      category,
      tagColor,
      zone,
      muscatBayNumber: 'N/A',
      consumption,
      totalConsumption: parseFloat(totalConsumption.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      averageMonthlyConsumption: parseFloat(averageMonthlyConsumption.toFixed(2))
    }
  } catch (error) {
    console.error('Error mapping database row:', error)
    // Return a safe fallback record
    return createFallbackRecord(index)
  }
}

// Create a safe fallback record
const createFallbackRecord = (index: number): ElectricityRecord => ({
  id: index + 1,
  slNo: index + 1,
  unitName: `System ${index + 1}`,
  meterType: 'Unknown',
  meterAccountNo: 'N/A',
  category: 'Other',
  tagColor: 'slate',
  zone: 'N/A',
  muscatBayNumber: 'N/A',
  consumption: {},
  totalConsumption: 0,
  totalCost: 0,
  averageMonthlyConsumption: 0
})

// Category and color extraction logic
const extractCategoryAndColor = (
  unitName: string,
  meterType: string,
): { category: string; tagColor: TagColor; zone: string } => {
  const lowerUnitName = (unitName || '').toLowerCase()
  const lowerMeterType = (meterType || '').toLowerCase()
  let category = "Other"
  let tagColor: TagColor = "slate"
  let zone = "N/A"

  try {
    // Extract zone from unitName (e.g., "Actuator DB 01 (Z8)" -> "Zone 8")
    const zoneMatch = lowerUnitName.match(/\(z(\d+)\)/)
    if (zoneMatch && zoneMatch[1]) {
      zone = `Zone ${zoneMatch[1]}`
    } else if (lowerUnitName.includes("zone-3")) {
      zone = "Zone 3"
    }

    switch (lowerMeterType) {
      case "ps":
        category = "Pumping Station"
        tagColor = "blue"
        break
      case "ls":
        category = "Lifting Station"
        tagColor = "blue"
        break
      case "irr":
        category = "Irrigation Tank"
        tagColor = "green"
        break
      case "db":
        category = "Actuator DB"
        tagColor = "orange"
        break
      case "street light":
        category = "Street Light"
        tagColor = "yellow"
        break
      case "fp-landscape lights z3":
        category = "Landscape Light"
        tagColor = "green"
        zone = "Zone 3"
        break
      case "d_building":
        if (lowerUnitName.includes("central park")) {
          category = "Central Park"
          tagColor = "green"
        } else if (
          lowerUnitName.includes("guard house") ||
          lowerUnitName.includes("security building") ||
          lowerUnitName.includes("rop building")
        ) {
          category = "Ancillary Building"
          tagColor = "orange"
        } else if (lowerUnitName.includes("village square")) {
          category = "Village Square"
          tagColor = "purple"
        } else if (lowerUnitName.includes("beachwell")) {
          category = "Beachwell"
          tagColor = "blue"
        } else if (lowerUnitName.includes("helipad")) {
          category = "Helipad"
          tagColor = "slate"
        } else if (lowerUnitName.startsWith("d building")) {
          category = "D Building"
          tagColor = "slate"
        } else {
          category = "Building"
          tagColor = "slate"
        }
        break
      case "retail":
        if (lowerUnitName.includes("bank muscat")) {
          category = "Commercial (Bank)"
          tagColor = "purple"
        } else if (lowerUnitName.includes("cif kitchen")) {
          category = "Commercial (Kitchen)"
          tagColor = "red"
        } else {
          category = "Retail"
          tagColor = "purple"
        }
        break
      default:
        category = "Other"
        tagColor = "slate"
    }
  } catch (error) {
    console.error('Error extracting category and color:', error)
    category = "Other"
    tagColor = "slate"
    zone = "N/A"
  }

  return { category, tagColor, zone }
}

// Enhanced mock data for when Supabase is not configured
const getMockElectricityData = (): ElectricityRecord[] => {
  return [
    {
      id: 1,
      slNo: 1,
      unitName: "Demo Pumping Station 01",
      meterType: "ps",
      meterAccountNo: "DEMO001",
      category: "Pumping Station",
      tagColor: "blue",
      zone: "Zone 1",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 1500, 'May-24': 1600, 'Jun-24': 1700, 'Jul-24': 1800,
        'Aug-24': 1900, 'Sep-24': 1950, 'Oct-24': 2000, 'Nov-24': 2100,
        'Dec-24': 2200, 'Jan-25': 2300, 'Feb-25': 2400, 'Mar-25': 2500, 'Apr-26': 2600
      },
      totalConsumption: 24650,
      totalCost: 616.25,
      averageMonthlyConsumption: 1896.15
    },
    {
      id: 2,
      slNo: 2,
      unitName: "Demo Central Park",
      meterType: "d_building",
      meterAccountNo: "DEMO002",
      category: "Central Park",
      tagColor: "green",
      zone: "Main",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 8000, 'May-24': 8500, 'Jun-24': 9000, 'Jul-24': 9500,
        'Aug-24': 10000, 'Sep-24': 10500, 'Oct-24': 11000, 'Nov-24': 11500,
        'Dec-24': 12000, 'Jan-25': 12500, 'Feb-25': 13000, 'Mar-25': 13500, 'Apr-26': 14000
      },
      totalConsumption: 143000,
      totalCost: 3575.00,
      averageMonthlyConsumption: 11000.00
    },
    {
      id: 3,
      slNo: 3,
      unitName: "Demo Irrigation Tank",
      meterType: "irr",
      meterAccountNo: "DEMO003",
      category: "Irrigation Tank",
      tagColor: "green",
      zone: "Zone 2",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 1200, 'May-24': 1300, 'Jun-24': 1400, 'Jul-24': 1500,
        'Aug-24': 1600, 'Sep-24': 1650, 'Oct-24': 1700, 'Nov-24': 1800,
        'Dec-24': 1900, 'Jan-25': 2000, 'Feb-25': 2100, 'Mar-25': 2200, 'Apr-26': 2300
      },
      totalConsumption: 21650,
      totalCost: 541.25,
      averageMonthlyConsumption: 1665.38
    },
    {
      id: 4,
      slNo: 4,
      unitName: "Demo Street Light FP 01",
      meterType: "street light",
      meterAccountNo: "DEMO004",
      category: "Street Light",
      tagColor: "yellow",
      zone: "Zone 1",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 800, 'May-24': 850, 'Jun-24': 900, 'Jul-24': 950,
        'Aug-24': 1000, 'Sep-24': 1050, 'Oct-24': 1100, 'Nov-24': 1150,
        'Dec-24': 1200, 'Jan-25': 1250, 'Feb-25': 1300, 'Mar-25': 1350, 'Apr-26': 1400
      },
      totalConsumption: 13350,
      totalCost: 333.75,
      averageMonthlyConsumption: 1026.92
    },
    {
      id: 5,
      slNo: 5,
      unitName: "Demo Beachwell",
      meterType: "d_building",
      meterAccountNo: "DEMO005",
      category: "Beachwell",
      tagColor: "blue",
      zone: "Main",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 15000, 'May-24': 16000, 'Jun-24': 17000, 'Jul-24': 18000,
        'Aug-24': 19000, 'Sep-24': 20000, 'Oct-24': 21000, 'Nov-24': 22000,
        'Dec-24': 23000, 'Jan-25': 24000, 'Feb-25': 25000, 'Mar-25': 26000, 'Apr-26': 27000
      },
      totalConsumption: 273000,
      totalCost: 6825.00,
      averageMonthlyConsumption: 21000.00
    }
  ]
}

// Data fetching functions with enhanced error handling
export const fetchElectricityData = async (): Promise<ElectricityRecord[]> => {
  // Always use mock data if not properly configured or during build
  if (!isSupabaseConfigured() || typeof window === 'undefined') {
    console.log('Using mock electricity data (Supabase not configured or server-side)')
    return getMockElectricityData()
  }

  try {
    const { data, error } = await supabase
      .from('electricity_consumption')
      .select('*')
      .order('total_kwh', { ascending: false })

    if (error) {
      console.error('Error fetching electricity data:', error)
      return getMockElectricityData()
    }

    if (!data || data.length === 0) {
      console.log('No electricity data found, using mock data')
      return getMockElectricityData()
    }

    return data.map((row, index) => mapDatabaseToElectricityRecord(row, index))
  } catch (error) {
    console.error('Failed to fetch electricity data:', error)
    return getMockElectricityData()
  }
}

export const fetchMonthlyTrends = async (): Promise<{ [month: string]: number }> => {
  // Default mock trends
  const mockTrends: { [month: string]: number } = {
    'Apr-24': 40500, 'May-24': 42100, 'Jun-24': 43700, 'Jul-24': 45300,
    'Aug-24': 46900, 'Sep-24': 48450, 'Oct-24': 50000, 'Nov-24': 51600,
    'Dec-24': 53200, 'Jan-25': 54800, 'Feb-25': 56400, 'Mar-25': 58000, 'Apr-26': 59600
  }

  if (!isSupabaseConfigured() || typeof window === 'undefined') {
    console.log('Using mock monthly trends (Supabase not configured or server-side)')
    return mockTrends
  }

  try {
    const { data, error } = await supabase
      .from('electricity_monthly_summary')
      .select('*')
      .order('month_order')

    if (error) {
      console.error('Error fetching monthly trends:', error)
      return mockTrends
    }

    if (!data || data.length === 0) {
      return mockTrends
    }

    const monthlyTotals: { [month: string]: number } = {}
    data.forEach(row => {
      try {
        // Convert "Apr 2024" to "Apr-24" format to match existing UI
        const monthKey = row.month_year?.replace(' 20', '-').replace(' ', '-')
        if (monthKey) {
          monthlyTotals[monthKey] = parseFloat(row.total_consumption_kwh) || 0
        }
      } catch (error) {
        console.error('Error processing monthly trend row:', error)
      }
    })

    return Object.keys(monthlyTotals).length > 0 ? monthlyTotals : mockTrends
  } catch (error) {
    console.error('Failed to fetch monthly trends:', error)
    return mockTrends
  }
}

// Additional safe data fetching functions
export const fetchTypesSummary = async (): Promise<Array<{ type: string; total_kwh: number; count: number }>> => {
  const mockTypesSummary = [
    { type: 'Pumping Station', total_kwh: 24650, count: 1 },
    { type: 'Central Park', total_kwh: 143000, count: 1 },
    { type: 'Irrigation Tank', total_kwh: 21650, count: 1 },
    { type: 'Street Light', total_kwh: 13350, count: 1 },
    { type: 'Beachwell', total_kwh: 273000, count: 1 }
  ]

  if (!isSupabaseConfigured() || typeof window === 'undefined') {
    return mockTypesSummary
  }

  try {
    const { data, error } = await supabase
      .from('electricity_type_summary')
      .select('*')
      .order('total_kwh', { ascending: false })

    if (error || !data) {
      return mockTypesSummary
    }

    return data
  } catch (error) {
    console.error('Failed to fetch types summary:', error)
    return mockTypesSummary
  }
}

export const fetchHighConsumers = async (limit: number = 10): Promise<any[]> => {
  if (!isSupabaseConfigured() || typeof window === 'undefined') {
    return getMockElectricityData().slice(0, limit)
  }

  try {
    const { data, error } = await supabase
      .from('electricity_high_consumption')
      .select('*')
      .limit(limit)

    if (error || !data) {
      return getMockElectricityData().slice(0, limit)
    }

    return data
  } catch (error) {
    console.error('Failed to fetch high consumers:', error)
    return getMockElectricityData().slice(0, limit)
  }
}

// Utility functions for backward compatibility
export const getTotalConsumption = (data: ElectricityRecord[]): number => {
  try {
    return data.reduce((sum, record) => sum + (record.totalConsumption || 0), 0)
  } catch (error) {
    console.error('Error calculating total consumption:', error)
    return 0
  }
}

export const getTotalCost = (data: ElectricityRecord[]): number => {
  try {
    return data.reduce((sum, record) => sum + (record.totalCost || 0), 0)
  } catch (error) {
    console.error('Error calculating total cost:', error)
    return 0
  }
}

export const getSystemsByCategory = (data: ElectricityRecord[]): { [category: string]: ElectricityRecord[] } => {
  try {
    const categories: { [category: string]: ElectricityRecord[] } = {}
    data.forEach(record => {
      const category = record.category || 'Other'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(record)
    })
    return categories
  } catch (error) {
    console.error('Error grouping systems by category:', error)
    return {}
  }
}

export const getTopConsumers = (data: ElectricityRecord[], limit: number = 10): ElectricityRecord[] => {
  try {
    return [...data]
      .sort((a, b) => (b.totalConsumption || 0) - (a.totalConsumption || 0))
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting top consumers:', error)
    return []
  }
}

export const getMonthlyTrends = (data: ElectricityRecord[]): { [month: string]: number } => {
  try {
    const monthlyTotals: { [month: string]: number } = {}
    
    if (data.length === 0) return monthlyTotals
    
    const availableMonths = Object.keys(data[0].consumption || {})
    availableMonths.forEach(month => {
      monthlyTotals[month] = data.reduce((sum, record) => {
        return sum + (record.consumption[month] || 0)
      }, 0)
    })
    
    return monthlyTotals
  } catch (error) {
    console.error('Error calculating monthly trends:', error)
    return {}
  }
}

// Available months from the data structure
export const availableMonths = [
  'Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24', 'Sep-24', 
  'Oct-24', 'Nov-24', 'Dec-24', 'Jan-25', 'Feb-25', 'Mar-25', 'Apr-26'
]
