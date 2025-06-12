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

// Enhanced mapping function with better error handling
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
      'Apr-25': parseFloat(row.apr_2025_kwh) || 0,
      'May-25': parseFloat(row.may_2025_kwh) || 0,
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
    console.error('Error mapping database row:', error, { row })
    // Return a safe fallback record
    return createFallbackRecord(index, row)
  }
}

// Create a safe fallback record with available data
const createFallbackRecord = (index: number, row?: any): ElectricityRecord => ({
  id: row?.id || index + 1,
  slNo: index + 1,
  unitName: row?.name || `System ${index + 1}`,
  meterType: row?.type || 'Unknown',
  meterAccountNo: row?.meter_account_no || 'N/A',
  category: 'Other',
  tagColor: 'slate',
  zone: 'N/A',
  muscatBayNumber: 'N/A',
  consumption: {},
  totalConsumption: parseFloat(row?.total_kwh) || 0,
  totalCost: parseFloat(row?.total_cost_omr) || 0,
  averageMonthlyConsumption: 0
})

// Enhanced category and color extraction logic with better PS detection
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

    // Enhanced detection for pump stations
    if (lowerMeterType === "ps" || lowerUnitName.includes("pumping station")) {
      category = "Pumping Station"
      tagColor = "blue"
    } else if (lowerMeterType === "ls" || lowerUnitName.includes("lifting station")) {
      category = "Lifting Station"
      tagColor = "blue"
    } else if (lowerMeterType === "irr" || lowerUnitName.includes("irrigation")) {
      category = "Irrigation Tank"
      tagColor = "green"
    } else if (lowerMeterType === "db" || lowerUnitName.includes("actuator")) {
      category = "Actuator DB"
      tagColor = "orange"
    } else if (lowerMeterType === "street light" || lowerUnitName.includes("street light")) {
      category = "Street Light"
      tagColor = "yellow"
    } else if (lowerMeterType === "fp-landscape lights z3" || lowerUnitName.includes("landscape light")) {
      category = "Landscape Light"
      tagColor = "green"
      zone = "Zone 3"
    } else if (lowerMeterType === "d_building") {
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
    } else if (lowerMeterType === "retail" || lowerUnitName.includes("retail")) {
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
    } else {
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

// Enhanced mock data including all 4 pump stations with May 2025 data
const getMockElectricityData = (): ElectricityRecord[] => {
  return [
    {
      id: 1,
      slNo: 1,
      unitName: "Pumping Station 01",
      meterType: "PS",
      meterAccountNo: "R52330",
      category: "Pumping Station",
      tagColor: "blue",
      zone: "Zone 1",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 1608, 'May-24': 1940, 'Jun-24': 1783, 'Jul-24': 1874,
        'Aug-24': 1662, 'Sep-24': 3822, 'Oct-24': 6876, 'Nov-24': 1629,
        'Dec-24': 1640, 'Jan-25': 1903, 'Feb-25': 2095, 'Mar-25': 3032, 
        'Apr-25': 3940, 'May-25': 2982
      },
      totalConsumption: 36786,
      totalCost: 919.65,
      averageMonthlyConsumption: 2627.57
    },
    {
      id: 2,
      slNo: 2,
      unitName: "Pumping Station 03",
      meterType: "PS",
      meterAccountNo: "R52329",
      category: "Pumping Station",
      tagColor: "blue",
      zone: "Zone 1",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 31, 'May-24': 47, 'Jun-24': 25, 'Jul-24': 3,
        'Aug-24': 0, 'Sep-24': 0, 'Oct-24': 33, 'Nov-24': 0,
        'Dec-24': 179, 'Jan-25': 33, 'Feb-25': 137, 'Mar-25': 131, 
        'Apr-25': 276.6, 'May-25': 397
      },
      totalConsumption: 1292.6,
      totalCost: 32.32,
      averageMonthlyConsumption: 161.58
    },
    {
      id: 3,
      slNo: 3,
      unitName: "Pumping Station 04",
      meterType: "PS",
      meterAccountNo: "R52327",
      category: "Pumping Station",
      tagColor: "blue",
      zone: "Zone 1",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 830, 'May-24': 818, 'Jun-24': 720, 'Jul-24': 731,
        'Aug-24': 857, 'Sep-24': 1176, 'Oct-24': 445, 'Nov-24': 919,
        'Dec-24': 921, 'Jan-25': 245, 'Feb-25': 870, 'Mar-25': 646, 
        'Apr-25': 984.9, 'May-25': 880.6
      },
      totalConsumption: 11043.5,
      totalCost: 276.09,
      averageMonthlyConsumption: 789.54
    },
    {
      id: 4,
      slNo: 4,
      unitName: "Pumping Station 05",
      meterType: "PS",
      meterAccountNo: "R52325",
      category: "Pumping Station",
      tagColor: "blue",
      zone: "Zone 1",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 1774, 'May-24': 2216, 'Jun-24': 2011, 'Jul-24': 2059,
        'Aug-24': 2229, 'Sep-24': 5217, 'Oct-24': 2483, 'Nov-24': 2599,
        'Dec-24': 1952, 'Jan-25': 2069, 'Feb-25': 2521, 'Mar-25': 2601, 
        'Apr-25': 3317, 'May-25': 3582
      },
      totalConsumption: 36630,
      totalCost: 915.75,
      averageMonthlyConsumption: 2616.43
    },
    {
      id: 5,
      slNo: 5,
      unitName: "Central Park",
      meterType: "D_Building",
      meterAccountNo: "R54672",
      category: "Central Park",
      tagColor: "green",
      zone: "Main",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 12208, 'May-24': 21845, 'Jun-24': 29438, 'Jul-24': 28186,
        'Aug-24': 21995, 'Sep-24': 20202, 'Oct-24': 14900, 'Nov-24': 9604,
        'Dec-24': 19032, 'Jan-25': 22819, 'Feb-25': 19974, 'Mar-25': 14190, 
        'Apr-25': 13846, 'May-25': 18783
      },
      totalConsumption: 267022,
      totalCost: 6675.55,
      averageMonthlyConsumption: 19072.29
    },
    {
      id: 6,
      slNo: 6,
      unitName: "Beachwell",
      meterType: "D_Building",
      meterAccountNo: "R51903",
      category: "Beachwell",
      tagColor: "blue",
      zone: "Main",
      muscatBayNumber: "N/A",
      consumption: {
        'Apr-24': 16908, 'May-24': 46, 'Jun-24': 19332, 'Jul-24': 23170,
        'Aug-24': 42241, 'Sep-24': 15223, 'Oct-24': 25370, 'Nov-24': 24383,
        'Dec-24': 37236, 'Jan-25': 38168, 'Feb-25': 18422, 'Mar-25': 40, 
        'Apr-25': 27749, 'May-25': 23674
      },
      totalConsumption: 311962,
      totalCost: 7799.05,
      averageMonthlyConsumption: 22283.0
    }
  ]
}

// Enhanced data fetching with better error handling and logging
export const fetchElectricityData = async (): Promise<ElectricityRecord[]> => {
  // Check if we're in a server environment or Supabase is not configured
  if (!isSupabaseConfigured() || typeof window === 'undefined') {
    console.log('🔄 Using mock electricity data (Supabase not configured or server-side)')
    return getMockElectricityData()
  }

  try {
    console.log('🔄 Fetching electricity data from Supabase...')
    
    const { data, error, count } = await supabase
      .from('electricity_consumption')
      .select('*', { count: 'exact' })
      .order('total_kwh', { ascending: false })

    if (error) {
      console.error('❌ Supabase fetch error:', error)
      console.log('🔄 Falling back to mock data due to error')
      return getMockElectricityData()
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No electricity data found in database, using mock data')
      return getMockElectricityData()
    }

    console.log(`✅ Successfully fetched ${data.length} electricity records from Supabase`)
    
    // Log pump stations specifically for debugging
    const pumpStations = data.filter(row => row.type === 'PS')
    console.log(`🔍 Found ${pumpStations.length} pump stations:`, 
      pumpStations.map(ps => `${ps.name} (${ps.meter_account_no})`))

    const mappedData = data.map((row, index) => mapDatabaseToElectricityRecord(row, index))
    
    // Verify pump station mapping
    const mappedPumpStations = mappedData.filter(record => record.category === 'Pumping Station')
    console.log(`✅ Mapped ${mappedPumpStations.length} pump stations successfully`)

    return mappedData

  } catch (error) {
    console.error('❌ Failed to fetch electricity data:', error)
    console.log('🔄 Using mock data due to exception')
    return getMockElectricityData()
  }
}

export const fetchMonthlyTrends = async (): Promise<{ [month: string]: number }> => {
  // Default mock trends including May 2025
  const mockTrends: { [month: string]: number } = {
    'Apr-24': 76910, 'May-24': 82533, 'Jun-24': 87850, 'Jul-24': 92488,
    'Aug-24': 97389, 'Sep-24': 103755, 'Oct-24': 87543, 'Nov-24': 85678,
    'Dec-24': 89234, 'Jan-25': 94567, 'Feb-25': 89876, 'Mar-25': 78654, 
    'Apr-25': 86432, 'May-25': 94521
  }

  if (!isSupabaseConfigured() || typeof window === 'undefined') {
    console.log('🔄 Using mock monthly trends (Supabase not configured or server-side)')
    return mockTrends
  }

  try {
    const { data, error } = await supabase
      .from('electricity_monthly_summary')
      .select('*')
      .order('month_order')

    if (error) {
      console.error('❌ Error fetching monthly trends:', error)
      return mockTrends
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No monthly trends data found, using mock data')
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
        console.error('❌ Error processing monthly trend row:', error)
      }
    })

    return Object.keys(monthlyTotals).length > 0 ? monthlyTotals : mockTrends
  } catch (error) {
    console.error('❌ Failed to fetch monthly trends:', error)
    return mockTrends
  }
}

// Enhanced diagnostic function for pump station filtering
export const diagnosePumpStationFiltering = async (): Promise<{
  totalRecords: number;
  pumpStations: any[];
  filteringTest: any[];
  success: boolean;
}> => {
  try {
    console.log('🔍 Diagnosing pump station filtering...')
    
    // Fetch all data
    const allData = await fetchElectricityData()
    
    // Filter pump stations using the same logic as the UI
    const pumpStations = allData.filter(record => {
      const isPS = record.meterType === 'PS' || 
                   record.category === 'Pumping Station' ||
                   record.unitName.toLowerCase().includes('pumping station')
      
      console.log(`🔍 Checking ${record.unitName}: type=${record.meterType}, category=${record.category}, isPS=${isPS}`)
      return isPS
    })

    console.log(`✅ Found ${pumpStations.length} pump stations after filtering:`)
    pumpStations.forEach((ps, index) => {
      console.log(`   ${index + 1}. ${ps.unitName} (${ps.meterAccountNo}) - ${ps.totalConsumption} kWh`)
    })

    return {
      totalRecords: allData.length,
      pumpStations,
      filteringTest: pumpStations.map(ps => ({
        name: ps.unitName,
        type: ps.meterType,
        category: ps.category,
        account: ps.meterAccountNo,
        consumption: ps.totalConsumption
      })),
      success: pumpStations.length === 4
    }

  } catch (error) {
    console.error('❌ Pump station diagnosis failed:', error)
    return {
      totalRecords: 0,
      pumpStations: [],
      filteringTest: [],
      success: false
    }
  }
}

// Additional safe data fetching functions (enhanced)
export const fetchTypesSummary = async (): Promise<Array<{ type: string; total_kwh: number; count: number }>> => {
  const mockTypesSummary = [
    { type: 'PS', total_kwh: 85752, count: 4 },
    { type: 'D_Building', total_kwh: 578984, count: 2 },
    { type: 'LS', total_kwh: 21650, count: 1 },
    { type: 'IRR', total_kwh: 15350, count: 1 },
    { type: 'Street Light', total_kwh: 13350, count: 1 }
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
      console.log('⚠️ Using mock types summary')
      return mockTypesSummary
    }

    return data
  } catch (error) {
    console.error('❌ Failed to fetch types summary:', error)
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
    console.error('❌ Failed to fetch high consumers:', error)
    return getMockElectricityData().slice(0, limit)
  }
}

// Utility functions for backward compatibility (enhanced)
export const getTotalConsumption = (data: ElectricityRecord[]): number => {
  try {
    const total = data.reduce((sum, record) => sum + (record.totalConsumption || 0), 0)
    console.log(`📊 Total consumption calculated: ${total.toLocaleString()} kWh from ${data.length} systems`)
    return total
  } catch (error) {
    console.error('❌ Error calculating total consumption:', error)
    return 0
  }
}

export const getTotalCost = (data: ElectricityRecord[]): number => {
  try {
    const total = data.reduce((sum, record) => sum + (record.totalCost || 0), 0)
    console.log(`💰 Total cost calculated: ${total.toFixed(2)} OMR`)
    return total
  } catch (error) {
    console.error('❌ Error calculating total cost:', error)
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
    
    // Log pump stations specifically
    if (categories['Pumping Station']) {
      console.log(`🚰 Pump Stations grouped: ${categories['Pumping Station'].length} systems`)
      categories['Pumping Station'].forEach((ps, idx) => {
        console.log(`   ${idx + 1}. ${ps.unitName} (${ps.meterAccountNo})`)
      })
    }
    
    return categories
  } catch (error) {
    console.error('❌ Error grouping systems by category:', error)
    return {}
  }
}

export const getTopConsumers = (data: ElectricityRecord[], limit: number = 10): ElectricityRecord[] => {
  try {
    const sorted = [...data]
      .sort((a, b) => (b.totalConsumption || 0) - (a.totalConsumption || 0))
      .slice(0, limit)
    
    console.log(`🏆 Top ${limit} consumers calculated`)
    return sorted
  } catch (error) {
    console.error('❌ Error getting top consumers:', error)
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
    
    console.log(`📈 Monthly trends calculated for ${availableMonths.length} months`)
    return monthlyTotals
  } catch (error) {
    console.error('❌ Error calculating monthly trends:', error)
    return {}
  }
}

// Available months from the data structure - Updated to include May 2025
export const availableMonths = [
  'Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24', 'Sep-24', 
  'Oct-24', 'Nov-24', 'Dec-24', 'Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25'
]
