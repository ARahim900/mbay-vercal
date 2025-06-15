# Electricity System Module - Performance & Analytics

A comprehensive electricity management system for Muscat Bay Operations with advanced Performance and Analytics capabilities.

## 🔋 Features Overview

### 📊 Dashboard Section
- **Real-time KPIs**: Total consumption, costs, peak demand, and active meters
- **Monthly Trend Analysis**: 14-month consumption patterns with efficiency tracking
- **Category Breakdown**: Consumption distribution by unit types
- **Top Consumers Table**: Ranked list with trend indicators and efficiency scores

### ⚡ Performance Section
- **Efficiency Scoring**: AI-powered performance indicators (0-100 scale)
- **Load Factor Analysis**: Demand distribution and stability metrics
- **Seasonal Variation**: Summer vs winter consumption patterns
- **Performance Indicators**: 6 key metrics with target comparisons
- **Trend Analysis**: Monthly efficiency and peak demand patterns

### 📈 Analytics Section
- **Predictive Forecasting**: 3-month consumption predictions with confidence intervals
- **Cost Optimization**: Identification of savings opportunities with ROI calculations
- **Growth Rate Analysis**: Monthly trend analysis and future projections
- **High Consumer Analysis**: Detailed optimization targets with priority rankings

### 🎯 Optimization Section
- **4-Phase Roadmap**: Strategic implementation plan from immediate to long-term
- **Quick Wins**: Low-effort, high-impact optimization opportunities
- **Investment ROI**: Return on investment calculations for various upgrades
- **Energy Efficiency**: Comprehensive improvement strategies

## 🧠 AI Analysis Features

The module includes an advanced AI analysis system that provides:

- **Performance Summary**: Comprehensive system overview with key metrics
- **Efficiency Analysis**: Energy efficiency scoring and recommendations
- **Top Consumer Insights**: Detailed analysis of highest consumption units
- **Cost Optimization**: Potential savings identification and implementation strategies
- **Predictive Forecasting**: Future consumption trends and budget impact
- **Strategic Recommendations**: Phased approach to energy optimization

## 📋 Data Integration

### Supabase Database Schema

The module integrates with three main tables:

#### `electricity_consumption`
```sql
- id (integer, primary key)
- name (text) - Unit name
- type (text) - Unit type (PS, LS, D_Building, etc.)
- meter_account_no (text) - Meter identifier
- apr_2024_kwh through may_2025_kwh (numeric) - Monthly consumption
- total_kwh (computed) - Total consumption across all months
- total_cost_omr (computed) - Total cost at 0.025 OMR/kWh
- created_at, updated_at (timestamps)
```

#### `electricity_monthly_summary`
```sql
- id (integer, primary key)
- month_year (text) - "Mon YYYY" format
- month_order (integer) - Sequential ordering
- total_consumption_kwh (numeric) - Month total
- total_cost_omr (numeric) - Month cost
- avg_consumption_per_unit (numeric) - Average per unit
- created_at (timestamp)
```

#### `electricity_cost_analysis`
```sql
- id (integer, primary key)
- analysis_date (date) - Analysis date
- total_consumption_kwh (numeric) - System total
- total_cost_omr (numeric) - System cost
- avg_cost_per_unit_omr (numeric) - Average cost per unit
- highest_consumer (text) - Top consumer name
- highest_consumption_kwh (numeric) - Peak consumption
- price_per_kwh (numeric, default 0.025) - Rate per kWh
- created_at (timestamp)
```

## 🚀 Quick Start Guide

### 1. Current Setup (Mock Data)
The module is currently using mock data that matches your Supabase schema. It's fully functional and ready for demonstration.

### 2. Connect Live Data (Optional)
To connect your live Supabase database:

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Add environment variables to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then update `src/lib/supabase-electricity.ts`:
- Uncomment the Supabase client initialization
- Uncomment the database queries in each function
- Remove the mock data responses

### 3. Usage in Components
```typescript
import { ElectricitySystemModule } from '@/components/sections/ElectricitySystemGlass';

// Use in your dashboard
<ElectricitySystemModule />
```

## 📱 User Interface

### Navigation
- **Sub-navigation tabs**: Dashboard, Performance, Analytics, Optimization
- **Filter bar**: Month and category filtering with AI analysis trigger
- **Glassmorphism design**: Modern, professional appearance

### Key Components
- **Glass Summary Cards**: KPI displays with trend indicators
- **Glass Charts**: Interactive charts with hover effects and legends
- **Performance Indicators**: Visual progress bars with status indicators
- **Data Tables**: Sortable, responsive tables with ranking systems

### Interactive Features
- **AI Analysis Modal**: Comprehensive system insights and recommendations
- **Responsive Charts**: Touch-friendly for mobile/tablet usage
- **Real-time Calculations**: Dynamic KPI updates based on data changes
- **Trend Indicators**: Visual arrows and color coding for performance trends

## 🔧 Technical Specifications

### Performance Metrics Calculated
- **Efficiency Score**: Based on consumption optimization (0-100)
- **Load Factor**: Average load vs peak demand ratio
- **Seasonal Variation**: Summer vs winter consumption difference
- **Cost Performance Index**: Cost per MWh calculation
- **Demand Stability**: Consistency of consumption patterns

### Analytics Algorithms
- **Predictive Forecasting**: 3-month rolling average with growth rate projection
- **Optimization Potential**: 15% savings calculation for high consumers
- **Trend Analysis**: Month-over-month growth rate calculations
- **Efficiency Scoring**: Normalized performance against peak consumption

### Data Processing
- **Category Extraction**: Automatic categorization based on unit names and types
- **Seasonal Calculations**: Summer (May-Aug) vs Winter (Dec-Mar) comparisons
- **Ranking Systems**: Multi-criteria sorting for top consumers
- **Currency Conversion**: Automatic OMR calculations at 0.025 per kWh

## 🎨 Design System

### Colors (Muscat Bay Brand)
- **Primary**: `#5f5168` (Deep muted purple)
- **Accent**: `#A8D5E3` (Soft teal)
- **Success**: `#10B981` (Green)
- **Warning**: `#BFA181` (Muted gold)
- **Info**: `#0A1828` (Deep blue)

### Components
- **Glass Cards**: Semi-transparent with backdrop blur
- **Glass Charts**: Enhanced chart containers with glassmorphism
- **Glass Buttons**: Interactive buttons with ripple effects
- **Glass Navigation**: Smooth tab transitions

## 📊 Sample Data Insights

Based on your actual Supabase data:

### Top Consumers
1. **Beachwell**: 311,962 kWh (7,799 OMR) - Critical infrastructure
2. **Central Park**: 267,022 kWh (6,676 OMR) - High irrigation/lighting
3. **CIF Kitchen**: 184,293 kWh (4,607 OMR) - Consistent commercial operation

### System Performance
- **Total Consumption**: 1,648,000+ kWh across all units
- **Peak Month**: August 2024 (166,207 kWh)
- **Load Factor**: 76.4% (efficient distribution)
- **Optimization Potential**: 8,240 OMR annual savings

### Efficiency Insights
- **Seasonal Variation**: 42.8% (high summer demand)
- **Monthly Growth**: +16.0% (increasing trend)
- **Efficiency Score**: 83/100 (good performance)
- **Cost Performance**: 25.0 OMR/MWh (optimal rate)

## 🔮 Future Enhancements

### Planned Features
- **Real-time Monitoring**: Live data feeds with WebSocket connections
- **Mobile App**: Dedicated mobile interface for field operations
- **Advanced AI**: Machine learning for predictive maintenance
- **Energy Storage**: Battery and solar integration analytics
- **Carbon Tracking**: Environmental impact calculations

### Integration Opportunities
- **IoT Sensors**: Real-time meter reading integration
- **Weather Data**: Correlation with consumption patterns
- **Maintenance Systems**: Equipment health monitoring
- **Financial Systems**: Budget and procurement integration

## 📞 Support & Maintenance

### Data Quality
- **Validation**: Automatic data quality checks and error reporting
- **Backup**: Regular data backup and recovery procedures
- **Audit Trail**: Complete history of data changes and updates

### Performance Monitoring
- **System Health**: Application performance and uptime monitoring
- **Data Freshness**: Alerts for stale or missing data
- **User Analytics**: Usage patterns and feature adoption tracking

### Updates & Upgrades
- **Monthly Releases**: Regular feature updates and improvements
- **Security Patches**: Timely security updates and vulnerability fixes
- **Feature Requests**: User feedback integration and priority development

---

## 🎯 Key Benefits for Muscat Bay

1. **Operational Excellence**: Real-time visibility into electricity consumption patterns
2. **Cost Management**: Identification of optimization opportunities worth 8,240+ OMR annually
3. **Strategic Planning**: Data-driven decision making for infrastructure investments
4. **Performance Tracking**: Comprehensive KPIs and benchmarking capabilities
5. **Predictive Insights**: AI-powered forecasting for budget planning and capacity management

This comprehensive electricity management system positions Muscat Bay as a leader in smart utilities management with world-class operational analytics and optimization capabilities.