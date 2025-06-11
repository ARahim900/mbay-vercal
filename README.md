# Muscat Bay Operations Dashboard

*A comprehensive facility management system with live database integration*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/arahim900s-projects/v0-muscat-bay-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/0JZ62ExbE2V)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

## 🏢 Project Overview

Advanced operations dashboard for Muscat Bay facility management, featuring real-time electricity consumption monitoring, water analysis, STP plant management, and contractor tracking. Now integrated with live Supabase database for production-ready data management.

## ⚡ Features

### **Electricity System Analytics** (Supabase-Powered)
- **Live Data**: Real-time electricity consumption from 56 systems
- **Comprehensive Coverage**: 13 months of historical data (Apr 2024 - Apr 2025)
- **System Types**: Pumping Stations, Lifting Stations, Irrigation, Buildings, Street Lights
- **Analytics**: Advanced filtering, category analysis, performance metrics
- **Cost Tracking**: Automated cost calculations at 0.025 OMR per KWH

### **Water Analysis System**
- Multi-zone water consumption tracking
- Loss analysis and efficiency monitoring
- Bulk meter vs individual consumption comparison
- Monthly trends and performance metrics

### **STP Plant Management**
- Daily operational records
- Treatment efficiency monitoring
- Sewage processing analytics
- Water recovery tracking

### **Contractor Tracking**
- Project management and progress tracking
- Resource allocation monitoring
- Performance analytics

## 🚀 Database Integration

### **Supabase Backend**
- **Database URL**: `https://hkmazjdexunxsnogadhb.supabase.co`
- **Project**: Assets Muscat Bay
- **Total Systems**: 56 electricity units monitored
- **Total Consumption**: 1,582,665.52 KWH
- **Total Cost**: 39,566.64 OMR

### **Key Tables**
\`\`\`sql
-- Main electricity consumption data
electricity_consumption (56 records)

-- Pre-calculated monthly summaries  
electricity_monthly_summary (13 months)

-- Analytics views
electricity_type_summary
electricity_high_consumption
\`\`\`

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Charts**: Recharts for data visualization
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **State Management**: React Hooks
- **Form Handling**: React Hook Form with Zod validation

## 📦 Installation & Setup

### **1. Clone Repository**
\`\`\`bash
git clone https://github.com/ARahim900/X1.git
cd X1
\`\`\`

### **2. Install Dependencies**
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### **3. Environment Setup**
\`\`\`bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

**Note**: The app will work without Supabase configuration by using mock data for development/testing.

### **4. Run Development Server**
\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

Navigate to `http://localhost:3000` to see the application.

## 🌐 Deployment

### **Vercel Deployment**

The app is configured for automatic deployment on Vercel. For production deployment with Supabase:

1. **Fork/Clone this repository**
2. **Connect to Vercel**
3. **Configure Environment Variables in Vercel Dashboard**:
   - Go to your project settings in Vercel
   - Navigate to **Environment Variables**
   - Add the following variables:
     \`\`\`
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     \`\`\`
4. **Redeploy** the application

### **Troubleshooting Deployment Issues**

If you encounter the error `Missing Supabase environment variables` during deployment:

1. **Check Environment Variables**: Ensure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in your deployment platform
2. **Use Mock Data**: The app is designed to work without Supabase by falling back to mock data
3. **Clear Build Cache**: Try clearing your deployment platform's build cache and redeploying

## 🗃️ Database Schema

### **Electricity System Tables**
\`\`\`typescript
interface ElectricityConsumption {
  id: number
  name: string
  type: string  // PS, LS, IRR, DB, Street Light, D_Building, Retail
  meter_account_no: string
  apr_2024_kwh: number
  may_2024_kwh: number
  // ... monthly columns through apr_2025_kwh
  total_kwh: number (computed)
  total_cost_omr: number (computed)
  created_at: timestamp
}
\`\`\`

### **Available API Endpoints**
\`\`\`typescript
// Fetch all electricity data
const { data } = await supabase
  .from('electricity_consumption')
  .select('*')

// Get monthly trends
const { data } = await supabase
  .from('electricity_monthly_summary')
  .select('*')

// Get top consumers
const { data } = await supabase
  .from('electricity_high_consumption')
  .select('*')
  .limit(10)
\`\`\`

## 📊 Dashboard Modules

### **1. Electricity System Analytics**
- **Charts & Analytics**: Interactive consumption trends, cost analysis
- **System Details**: Complete equipment inventory with filtering
- **Category Analysis**: Performance breakdown by system types
- **Performance Metrics**: Rankings and efficiency comparisons

### **2. Water Analysis**
- Multi-zone consumption monitoring
- Loss percentage calculations
- Direct connection vs individual meter analysis
- Monthly comparison and trends

### **3. STP Plant Operations**
- Daily sewage processing records
- Treatment efficiency tracking
- Water recovery performance
- Operational analytics

### **4. Contractor Management**
- Project progress tracking
- Resource allocation
- Performance monitoring
- Timeline management

## 🎯 Key Performance Indicators

### **Electricity System KPIs**
- **Active Systems**: 56 units across multiple categories
- **Monthly Consumption**: Up to 166,207 KWH peak month
- **Cost Efficiency**: 0.025 OMR per KWH
- **Top Consumer**: Beachwell (287,749+ KWH total)
- **System Categories**: 8 different equipment types

### **Operational Metrics**
- Real-time data refresh capabilities
- Advanced filtering and search functionality
- Export capabilities for reporting
- Mobile-responsive design

## 🔗 Live Deployment

**Primary Deployment**: [https://vercel.com/arahim900s-projects/v0-muscat-bay-design](https://vercel.com/arahim900s-projects/v0-muscat-bay-design)

## 📚 Documentation

- **Integration Guide**: [ELECTRICITY_INTEGRATION.md](./ELECTRICITY_INTEGRATION.md)
- **Quick Start Guide**: [QUICK_START.md](./QUICK_START.md)
- **Supabase Dashboard**: [Database Management](https://supabase.com/dashboard/project/hkmazjdexunxsnogadhb)
- **v0.dev Project**: [Continue Building](https://v0.dev/chat/projects/0JZ62ExbE2V)

## 🔄 Development Workflow

1. **Frontend Development**: Make changes using [v0.dev](https://v0.dev) or local development
2. **Database Updates**: Manage data through Supabase dashboard or API
3. **Automatic Sync**: Changes from v0.dev automatically sync to this repository
4. **Auto Deploy**: Vercel automatically deploys latest changes

## 🛡️ Security & Access

- **Database**: Row Level Security (RLS) enabled where appropriate
- **API Keys**: Environment variables secured
- **Authentication**: Supabase anonymous key for read-only access
- **CORS**: Configured for web application access
- **Fallback Mode**: App works offline with mock data when database is unavailable

## 📈 Future Enhancements

- **Real-time Subscriptions**: Live data updates using Supabase real-time
- **Mobile Application**: React Native version
- **Advanced Analytics**: Predictive modeling and alerts
- **User Management**: Role-based access control
- **Report Generation**: Automated PDF/Excel exports

## 🤝 Contributing

This project is primarily managed through [v0.dev](https://v0.dev) with database integration via Supabase. For database schema changes or major feature additions, please coordinate through the appropriate channels.

## 📞 Support

For technical support or database access issues:
- **Database Management**: Supabase Dashboard
- **Application Issues**: GitHub Issues
- **Feature Requests**: v0.dev project chat
- **Deployment Issues**: Check environment variables configuration

---

**Last Updated**: June 2025 - Live Supabase Integration Deployed with Fallback Support
