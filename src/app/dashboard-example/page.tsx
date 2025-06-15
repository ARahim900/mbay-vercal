'use client';

import React, { useState } from 'react';
import { GlassSidebar, GlassHeader } from '@/components/glassmorphism';
import { WaterAnalysisModule } from '@/components/sections/WaterAnalysisGlass';
import { STPPlantModule } from '@/components/sections/STPPlantGlass';
import { ElectricitySystemModule } from '@/components/sections/ElectricitySystemGlass';
import '@/styles/glassmorphism.css';
import '@/styles/animations.css';

// Contractor Tracker Module (Placeholder for now)
const ContractorTrackerModule = () => {
  return (
    <div className="glass-card p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Contractor Tracker</h2>
      <p className="text-gray-600">Comprehensive contractor management system coming soon...</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Active Contracts</h3>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="glass-card p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Total Value</h3>
          <p className="text-2xl font-bold text-green-600">2.4M OMR</p>
        </div>
        <div className="glass-card p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Completion Rate</h3>
          <p className="text-2xl font-bold text-purple-600">68%</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced main dashboard integration
export default function DashboardExample() {
  const [activeSection, setActiveSection] = useState('electricity');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'electricity':
        return <ElectricitySystemModule />;
      case 'water':
        return <WaterAnalysisModule />;
      case 'stp':
        return <STPPlantModule />;
      case 'contractor':
        return <ContractorTrackerModule />;
      default:
        return <ElectricitySystemModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Enhanced background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#A8D5E3] to-[#5f5168] rounded-full opacity-20 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#BFA181] to-[#5f5168] rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-gradient-to-br from-[#10B981] to-[#A8D5E3] rounded-full opacity-15 blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-gradient-to-br from-[#5f5168] to-[#BFA181] rounded-full opacity-15 blur-2xl animate-float" style={{ animationDelay: '6s' }} />
      </div>

      {/* Sidebar */}
      <GlassSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header with proper sticky positioning */}
        <div className="sticky-header">
          <GlassHeader
            isDarkMode={isDarkMode}
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        </div>

        {/* Page Content */}
        <main className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// IMPORTANT NOTES FOR INTEGRATION:
// 
// 1. ELECTRICITY SYSTEM MODULE:
//    - The new ElectricitySystemModule includes 4 sub-sections: Dashboard, Performance, Analytics, and Optimization
//    - It uses real Supabase data structure and provides comprehensive electricity management features
//    - Features include AI analysis, predictive forecasting, cost optimization, and performance monitoring
//
// 2. GLASSMORPHISM INTEGRATION:
//    - All components use the glassmorphism design system for consistency
//    - Enhanced background animations and decorations for visual appeal
//    - Proper sticky positioning for headers and filter bars
//
// 3. PERFORMANCE FEATURES:
//    - Real-time efficiency scoring and performance indicators
//    - Seasonal variation analysis and load factor calculations
//    - Peak demand analysis and energy optimization recommendations
//
// 4. ANALYTICS CAPABILITIES:
//    - 3-month consumption forecasting with confidence intervals
//    - Cost optimization opportunities with ROI calculations
//    - Predictive growth rate analysis and trend identification
//
// 5. DATA INTEGRATION:
//    - Mock data structure matches your Supabase electricity_consumption table
//    - Ready for live data integration via API calls
//    - Monthly summary calculations and KPI computations
//
// 6. AI ANALYSIS:
//    - Comprehensive AI-powered insights and recommendations
//    - Strategic optimization roadmap with phased implementation
//    - Investment ROI calculations and quick win identification
//
// 7. RESPONSIVE DESIGN:
//    - Fully responsive across all device sizes
//    - Touch-friendly interface for mobile/tablet usage
//    - Optimized chart rendering and data visualization
