/**
 * Supabase Electricity Data Integration
 * 
 * This helper provides functions to fetch and process electricity consumption data
 * from your Supabase database. Replace the mock data in ElectricitySystemGlass.tsx
 * with these functions for live data integration.
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (uncomment and configure for live data)
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ===============================
// TYPE DEFINITIONS
// ===============================

export interface ElectricityConsumption {
  id: number;
  name: string;
  type: string;
  meter_account_no: string;
  apr_2024_kwh: number;
  may_2024_kwh: number;
  jun_2024_kwh: number;
  jul_2024_kwh: number;
  aug_2024_kwh: number;
  sep_2024_kwh: number;
  oct_2024_kwh: number;
  nov_2024_kwh: number;
  dec_2024_kwh: number;
  jan_2025_kwh: number;
  feb_2025_kwh: number;
  mar_2025_kwh: number;
  apr_2025_kwh: number;
  may_2025_kwh: number;
  total_kwh: number;
  total_cost_omr: number;
  created_at: string;
  updated_at: string;
}

export interface MonthlySummary {
  id: number;
  month_year: string;
  month_order: number;
  total_consumption_kwh: number;
  total_cost_omr: number;
  avg_consumption_per_unit: number;
  created_at: string;
}

export interface CostAnalysis {
  id: number;
  analysis_date: string;
  total_consumption_kwh: number;
  total_cost_omr: number;
  avg_cost_per_unit_omr: number;
  highest_consumer: string;
  highest_consumption_kwh: number;
  price_per_kwh: number;
  created_at: string;
}

// ===============================
// DATA FETCHING FUNCTIONS
// ===============================

/**
 * Fetch all electricity consumption data
 */
export async function fetchElectricityConsumption(): Promise<ElectricityConsumption[]> {
  try {
    // Uncomment for live data integration
    // const { data, error } = await supabase
    //   .from('electricity_consumption')
    //   .select('*')
    //   .order('total_kwh', { ascending: false });
    
    // if (error) throw error;
    // return data || [];

    // Mock data response for development (remove when connecting live data)
    console.log('Using mock data - connect Supabase for live data');
    return getMockElectricityData();
    
  } catch (error) {
    console.error('Error fetching electricity consumption:', error);
    return [];
  }
}

/**
 * Fetch monthly summary data
 */
export async function fetchMonthlySummary(): Promise<MonthlySummary[]> {
  try {
    // Uncomment for live data integration
    // const { data, error } = await supabase
    //   .from('electricity_monthly_summary')
    //   .select('*')
    //   .order('month_order', { ascending: true });
    
    // if (error) throw error;
    // return data || [];

    // Mock data response for development
    return getMockMonthlySummary();
    
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    return [];
  }
}

/**
 * Fetch cost analysis data
 */
export async function fetchCostAnalysis(): Promise<CostAnalysis[]> {
  try {
    // Uncomment for live data integration
    // const { data, error } = await supabase
    //   .from('electricity_cost_analysis')
    //   .select('*')
    //   .order('analysis_date', { ascending: false })
    //   .limit(1);
    
    // if (error) throw error;
    // return data || [];

    // Mock data response for development
    return getMockCostAnalysis();
    
  } catch (error) {
    console.error('Error fetching cost analysis:', error);
    return [];
  }
}

/**
 * Fetch consumption data for a specific month
 */
export async function fetchMonthlyConsumption(monthColumn: string): Promise<ElectricityConsumption[]> {
  try {
    // Uncomment for live data integration
    // const { data, error } = await supabase
    //   .from('electricity_consumption')
    //   .select(`id, name, type, meter_account_no, ${monthColumn}`)
    //   .order(monthColumn, { ascending: false });
    
    // if (error) throw error;
    // return data || [];

    // Mock data response for development
    return getMockElectricityData();
    
  } catch (error) {
    console.error('Error fetching monthly consumption:', error);
    return [];
  }
}

/**
 * Fetch top consumers (top N by total consumption)
 */
export async function fetchTopConsumers(limit: number = 10): Promise<ElectricityConsumption[]> {
  try {
    // Uncomment for live data integration
    // const { data, error } = await supabase
    //   .from('electricity_consumption')
    //   .select('*')
    //   .order('total_kwh', { ascending: false })
    //   .limit(limit);
    
    // if (error) throw error;
    // return data || [];

    // Mock data response for development
    return getMockElectricityData().slice(0, limit);
    
  } catch (error) {
    console.error('Error fetching top consumers:', error);
    return [];
  }
}

/**
 * Update electricity consumption record
 */
export async function updateElectricityConsumption(
  id: number, 
  updates: Partial<ElectricityConsumption>
): Promise<boolean> {
  try {
    // Uncomment for live data integration
    // const { error } = await supabase
    //   .from('electricity_consumption')
    //   .update(updates)
    //   .eq('id', id);
    
    // if (error) throw error;
    // return true;

    // Mock response for development
    console.log('Mock update - connect Supabase for live updates');
    return true;
    
  } catch (error) {
    console.error('Error updating electricity consumption:', error);
    return false;
  }
}

/**
 * Insert new cost analysis record
 */
export async function insertCostAnalysis(analysisData: Omit<CostAnalysis, 'id' | 'created_at'>): Promise<boolean> {
  try {
    // Uncomment for live data integration
    // const { error } = await supabase
    //   .from('electricity_cost_analysis')
    //   .insert([analysisData]);
    
    // if (error) throw error;
    // return true;

    // Mock response for development
    console.log('Mock insert - connect Supabase for live inserts');
    return true;
    
  } catch (error) {
    console.error('Error inserting cost analysis:', error);
    return false;
  }
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Calculate metrics from raw consumption data
 */
export function calculateElectricityMetrics(data: ElectricityConsumption[]) {
  const totalConsumption = data.reduce((sum, item) => sum + item.total_kwh, 0);
  const totalCost = data.reduce((sum, item) => sum + item.total_cost_omr, 0);
  const avgConsumptionPerUnit = totalConsumption / data.length;
  const activeMeters = data.filter(item => item.total_kwh > 0).length;

  return {
    totalConsumption: Math.round(totalConsumption),
    totalCost: Math.round(totalCost * 100) / 100,
    avgConsumptionPerUnit: Math.round(avgConsumptionPerUnit),
    activeMeters,
    pricePerKwh: 0.025
  };
}

/**
 * Group consumption data by type/category
 */
export function groupConsumptionByType(data: ElectricityConsumption[]) {
  const grouped = data.reduce((acc, item) => {
    const type = item.type || 'Unknown';
    if (!acc[type]) {
      acc[type] = {
        type,
        count: 0,
        totalConsumption: 0,
        totalCost: 0,
        items: []
      };
    }
    acc[type].count++;
    acc[type].totalConsumption += item.total_kwh;
    acc[type].totalCost += item.total_cost_omr;
    acc[type].items.push(item);
    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped);
}

/**
 * Calculate seasonal variations
 */
export function calculateSeasonalMetrics(data: ElectricityConsumption[]) {
  const summerMonths = ['may_2024_kwh', 'jun_2024_kwh', 'jul_2024_kwh', 'aug_2024_kwh'];
  const winterMonths = ['dec_2024_kwh', 'jan_2025_kwh', 'feb_2025_kwh', 'mar_2025_kwh'];

  const summerAvg = data.reduce((sum, item) => {
    const summerTotal = summerMonths.reduce((monthSum, month) => monthSum + (item[month as keyof ElectricityConsumption] as number || 0), 0);
    return sum + (summerTotal / summerMonths.length);
  }, 0) / data.length;

  const winterAvg = data.reduce((sum, item) => {
    const winterTotal = winterMonths.reduce((monthSum, month) => monthSum + (item[month as keyof ElectricityConsumption] as number || 0), 0);
    return sum + (winterTotal / winterMonths.length);
  }, 0) / data.length;

  const seasonalVariation = ((summerAvg - winterAvg) / winterAvg) * 100;

  return {
    summerAvg: Math.round(summerAvg),
    winterAvg: Math.round(winterAvg),
    seasonalVariation: Math.round(seasonalVariation * 10) / 10
  };
}

// ===============================
// MOCK DATA (Remove when connecting live data)
// ===============================

function getMockElectricityData(): ElectricityConsumption[] {
  return [
    {
      id: 1,
      name: "Beachwell",
      type: "D_Building",
      meter_account_no: "R51903",
      apr_2024_kwh: 15420,
      may_2024_kwh: 18650,
      jun_2024_kwh: 22130,
      jul_2024_kwh: 25890,
      aug_2024_kwh: 28420,
      sep_2024_kwh: 24680,
      oct_2024_kwh: 21340,
      nov_2024_kwh: 24383,
      dec_2024_kwh: 37236,
      jan_2025_kwh: 38168,
      feb_2025_kwh: 18422,
      mar_2025_kwh: 40,
      apr_2025_kwh: 27749,
      may_2025_kwh: 25856,
      total_kwh: 311962,
      total_cost_omr: 7799.05,
      created_at: "2025-06-10T08:45:30.909573+00:00",
      updated_at: "2025-06-10T08:45:30.909573+00:00"
    },
    {
      id: 2,
      name: "Central Park",
      type: "D_Building",
      meter_account_no: "R54672",
      apr_2024_kwh: 8520,
      may_2024_kwh: 12450,
      jun_2024_kwh: 18930,
      jul_2024_kwh: 21840,
      aug_2024_kwh: 25670,
      sep_2024_kwh: 22150,
      oct_2024_kwh: 19820,
      nov_2024_kwh: 9604,
      dec_2024_kwh: 19032,
      jan_2025_kwh: 22819,
      feb_2025_kwh: 19974,
      mar_2025_kwh: 14190,
      apr_2025_kwh: 13846,
      may_2025_kwh: 15420,
      total_kwh: 267022,
      total_cost_omr: 6675.55,
      created_at: "2025-06-10T08:45:30.909573+00:00",
      updated_at: "2025-06-10T08:45:30.909573+00:00"
    },
    {
      id: 3,
      name: "CIF Kitchen",
      type: "Retail",
      meter_account_no: "MISSING_METER",
      apr_2024_kwh: 14850,
      may_2024_kwh: 15230,
      jun_2024_kwh: 16890,
      jul_2024_kwh: 17240,
      aug_2024_kwh: 15680,
      sep_2024_kwh: 14920,
      oct_2024_kwh: 13580,
      nov_2024_kwh: 16742,
      dec_2024_kwh: 15554,
      jan_2025_kwh: 16788,
      feb_2025_kwh: 16154,
      mar_2025_kwh: 14971,
      apr_2025_kwh: 18446,
      may_2025_kwh: 17248,
      total_kwh: 184293,
      total_cost_omr: 4607.325,
      created_at: "2025-06-10T08:45:30.909573+00:00",
      updated_at: "2025-06-10T08:45:30.909573+00:00"
    }
  ];
}

function getMockMonthlySummary(): MonthlySummary[] {
  return [
    {
      id: 1,
      month_year: "Apr 2024",
      month_order: 1,
      total_consumption_kwh: 72781,
      total_cost_omr: 1819.525,
      avg_consumption_per_unit: 1399.63,
      created_at: "2025-06-10T08:46:58.759785+00:00"
    },
    {
      id: 2,
      month_year: "May 2024",
      month_order: 2,
      total_consumption_kwh: 116032,
      total_cost_omr: 2900.800,
      avg_consumption_per_unit: 2275.14,
      created_at: "2025-06-10T08:46:58.759785+00:00"
    }
  ];
}

function getMockCostAnalysis(): CostAnalysis[] {
  return [
    {
      id: 1,
      analysis_date: "2025-06-15",
      total_consumption_kwh: 1648000,
      total_cost_omr: 41200,
      avg_cost_per_unit_omr: 745.45,
      highest_consumer: "Beachwell",
      highest_consumption_kwh: 311962,
      price_per_kwh: 0.025,
      created_at: "2025-06-15T05:00:00.000000+00:00"
    }
  ];
}

// ===============================
// INTEGRATION INSTRUCTIONS
// ===============================

/*
STEP-BY-STEP INTEGRATION GUIDE:

1. ENVIRONMENT SETUP:
   Add to your .env.local file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. INSTALL SUPABASE CLIENT:
   ```bash
   npm install @supabase/supabase-js
   ```

3. ENABLE LIVE DATA:
   - Uncomment the Supabase client initialization at the top
   - Uncomment the actual database queries in each function
   - Comment out or remove the mock data responses

4. UPDATE ELECTRICITY COMPONENT:
   Replace the mock data arrays in ElectricitySystemGlass.tsx with:
   ```typescript
   const [electricityData, setElectricityData] = useState<ElectricityConsumption[]>([]);
   const [monthlyData, setMonthlyData] = useState<MonthlySummary[]>([]);
   
   useEffect(() => {
     const loadData = async () => {
       const [consumption, monthly] = await Promise.all([
         fetchElectricityConsumption(),
         fetchMonthlySummary()
       ]);
       setElectricityData(consumption);
       setMonthlyData(monthly);
     };
     loadData();
   }, []);
   ```

5. REAL-TIME UPDATES (Optional):
   Add Supabase real-time subscriptions for live data updates:
   ```typescript
   useEffect(() => {
     const subscription = supabase
       .channel('electricity_changes')
       .on('postgres_changes', 
         { event: '*', schema: 'public', table: 'electricity_consumption' },
         (payload) => {
           // Handle real-time updates
           console.log('Change received!', payload);
           // Refresh data
         }
       )
       .subscribe();

     return () => {
       supabase.removeChannel(subscription);
     };
   }, []);
   ```

6. ERROR HANDLING:
   Add proper error boundaries and loading states in your components.

7. TESTING:
   Test with mock data first, then gradually enable live data features.
*/