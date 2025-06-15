# Electricity System Supabase Integration Guide

## 🎯 Quick Setup Instructions

Follow these steps to connect your Electricity System module to your Supabase database for real-time data.

---

## 📋 Prerequisites

✅ **Supabase Project**: You already have the "Assets Muscat Bay" project  
✅ **Database Tables**: Your electricity tables are set up  
✅ **Next.js App**: Your application is running  

---

## 🔧 Step 1: Environment Configuration

Create or update your `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Additional configuration
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_for_admin_operations
```

**To get your keys:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key

---

## 🗄️ Step 2: Database Schema Verification

Ensure your Supabase tables match this structure:

### `electricity_consumption` table:
```sql
-- Main electricity consumption data
CREATE TABLE electricity_consumption (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  meter_account_no VARCHAR(50),
  category VARCHAR(100),
  apr_24 FLOAT DEFAULT 0,
  may_24 FLOAT DEFAULT 0,
  jun_24 FLOAT DEFAULT 0,
  jul_24 FLOAT DEFAULT 0,
  aug_24 FLOAT DEFAULT 0,
  sep_24 FLOAT DEFAULT 0,
  oct_24 FLOAT DEFAULT 0,
  nov_24 FLOAT DEFAULT 0,
  dec_24 FLOAT DEFAULT 0,
  jan_25 FLOAT DEFAULT 0,
  feb_25 FLOAT DEFAULT 0,
  mar_25 FLOAT DEFAULT 0,
  apr_25 FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `electricity_monthly_summary` table:
```sql
-- Monthly aggregated data
CREATE TABLE electricity_monthly_summary (
  id SERIAL PRIMARY KEY,
  month VARCHAR(20) NOT NULL,
  total_consumption FLOAT DEFAULT 0,
  total_cost FLOAT DEFAULT 0,
  active_meters INTEGER DEFAULT 0,
  avg_consumption FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📊 Step 3: Data Import

Import your existing data into Supabase:

### Option 1: CSV Import (Recommended)
1. Go to Supabase Dashboard → Table Editor
2. Select your table
3. Click "Insert" → "Import data from CSV"
4. Upload your electricity database CSV files

### Option 2: SQL Insert (Manual)
```sql
-- Example data insertion
INSERT INTO electricity_consumption (
  name, type, meter_account_no, category,
  apr_24, may_24, jun_24, jul_24, aug_24, sep_24,
  oct_24, nov_24, dec_24, jan_25, feb_25, mar_25, apr_25
) VALUES 
('Beachwell', 'Infrastructure', 'R51903', 'Beachwell',
 20245, 25680, 28945, 32110, 35620, 31890,
 28450, 24383, 37236, 38168, 18422, 40, 27749);
```

---

## 🔌 Step 4: Update Data Hooks

Update your `lib/electricity-data.ts` file to use real Supabase data:

```typescript
// lib/electricity-data.ts
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useElectricityData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const { data: electricityData, error } = await supabase
          .from('electricity_consumption')
          .select('*')
          .order('id');

        if (error) throw error;

        // Transform data to match existing structure
        const transformedData = electricityData.map(item => ({
          id: item.id,
          unitName: item.name,
          meterAccountNo: item.meter_account_no,
          category: item.category || 'Other',
          meterType: item.type || 'Standard',
          consumption: {
            'Apr-24': item.apr_24 || 0,
            'May-24': item.may_24 || 0,
            'Jun-24': item.jun_24 || 0,
            'Jul-24': item.jul_24 || 0,
            'Aug-24': item.aug_24 || 0,
            'Sep-24': item.sep_24 || 0,
            'Oct-24': item.oct_24 || 0,
            'Nov-24': item.nov_24 || 0,
            'Dec-24': item.dec_24 || 0,
            'Jan-25': item.jan_25 || 0,
            'Feb-25': item.feb_25 || 0,
            'Mar-25': item.mar_25 || 0,
            'Apr-25': item.apr_25 || 0
          },
          totalConsumption: (
            (item.apr_24 || 0) + (item.may_24 || 0) + (item.jun_24 || 0) +
            (item.jul_24 || 0) + (item.aug_24 || 0) + (item.sep_24 || 0) +
            (item.oct_24 || 0) + (item.nov_24 || 0) + (item.dec_24 || 0) +
            (item.jan_25 || 0) + (item.feb_25 || 0) + (item.mar_25 || 0) +
            (item.apr_25 || 0)
          )
        }));

        setData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useMonthlyTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const { data: monthlyData, error } = await supabase
          .from('electricity_monthly_summary')
          .select('*')
          .order('month');

        if (error) throw error;
        setTrends(monthlyData || []);
      } catch (err) {
        console.error('Error fetching monthly trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return { trends, loading };
};
```

---

## 🔐 Step 5: Row Level Security (Optional but Recommended)

Set up RLS policies for your tables:

```sql
-- Enable RLS
ALTER TABLE electricity_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE electricity_monthly_summary ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow authenticated read access" ON electricity_consumption
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON electricity_monthly_summary
  FOR SELECT TO authenticated USING (true);
```

---

## 🧪 Step 6: Testing the Connection

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Check the console** for any connection errors

3. **Verify data loading**:
   - Navigate to the Electricity System module
   - Check if real data appears instead of mock data
   - Look for the loading spinner initially, then real data

4. **Test filtering and interactions**:
   - Try different month filters
   - Check category filtering
   - Verify AI analysis uses real data

---

## 🔄 Step 7: Real-time Updates (Optional)

Enable real-time subscriptions for live data updates:

```typescript
// Add to your data hook
useEffect(() => {
  const subscription = supabase
    .channel('electricity_updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'electricity_consumption' },
      (payload) => {
        console.log('Real-time update received:', payload);
        // Refetch data or update state
        fetchData();
      }
    )
    .subscribe();

  return () => supabase.removeChannel(subscription);
}, []);
```

---

## 📈 Step 8: Performance Optimization

### Indexes for better performance:
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_electricity_category ON electricity_consumption(category);
CREATE INDEX idx_electricity_type ON electricity_consumption(type);
CREATE INDEX idx_monthly_summary_month ON electricity_monthly_summary(month);
```

### Computed columns for totals:
```sql
-- Add computed total column
ALTER TABLE electricity_consumption 
ADD COLUMN total_consumption FLOAT GENERATED ALWAYS AS (
  COALESCE(apr_24, 0) + COALESCE(may_24, 0) + COALESCE(jun_24, 0) +
  COALESCE(jul_24, 0) + COALESCE(aug_24, 0) + COALESCE(sep_24, 0) +
  COALESCE(oct_24, 0) + COALESCE(nov_24, 0) + COALESCE(dec_24, 0) +
  COALESCE(jan_25, 0) + COALESCE(feb_25, 0) + COALESCE(mar_25, 0) +
  COALESCE(apr_25, 0)
) STORED;
```

---

## 🚨 Troubleshooting

### Common Issues:

1. **"Cannot connect to Supabase"**
   - Check your environment variables
   - Verify Supabase URL and keys
   - Check network connection

2. **"Table doesn't exist"**
   - Verify table names in Supabase dashboard
   - Check spelling and case sensitivity

3. **"No data appearing"**
   - Check if data was imported correctly
   - Verify RLS policies allow reading
   - Check browser console for errors

4. **"Loading forever"**
   - Check for JavaScript errors in console
   - Verify async/await syntax in hooks
   - Check network tab for failed requests

### Debug Mode:
```typescript
// Add to your component for debugging
console.log('Electricity data:', data);
console.log('Loading state:', loading);
console.log('Error state:', error);
```

---

## ✅ Verification Checklist

- [ ] Environment variables are set correctly
- [ ] Database tables exist and have data
- [ ] Data hooks are updated to use Supabase
- [ ] Application loads without errors
- [ ] Real data appears in the dashboard
- [ ] Filtering and interactions work
- [ ] Performance is acceptable
- [ ] RLS policies are set (optional)

---

## 🎉 Success!

Once completed, your Electricity System will:
- ✅ Load real data from Supabase
- ✅ Support real-time updates
- ✅ Provide accurate calculations and analytics
- ✅ Scale with your growing dataset
- ✅ Maintain high performance

Your electricity dashboard is now powered by real data! 🔌⚡

---

## 🔗 Next Steps

1. **Monitor Performance**: Use Supabase dashboard to monitor query performance
2. **Add More Data**: Import historical data for better trends
3. **Set Up Alerts**: Configure Supabase alerts for data changes
4. **Backup Strategy**: Set up automated backups
5. **Scale Planning**: Monitor usage and plan for scaling

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or contact your development team!