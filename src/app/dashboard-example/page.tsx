'use client';

import React, { useState } from 'react';
import { GlassSidebar, GlassHeader } from '@/components/glassmorphism';
import { WaterAnalysisModule } from '@/components/sections/WaterAnalysisGlass';
import { STPPlantModule } from '@/components/sections/STPPlantGlass';
import '@/styles/glassmorphism.css';
import '@/styles/animations.css';

// Example main dashboard integration
export default function DashboardExample() {
  const [activeSection, setActiveSection] = useState('water');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'water':
        return <WaterAnalysisModule />;
      case 'stp':
        return <STPPlantModule />;
      case 'electricity':
        return (
          <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Electricity System</h2>
            <p className="text-gray-600">Import and use your electricity module here</p>
          </div>
        );
      case 'contractor':
        return (
          <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Contractor Tracker</h2>
            <p className="text-gray-600">Import and use your contractor module here</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#A8D5E3] to-[#5f5168] rounded-full opacity-20 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#BFA181] to-[#5f5168] rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
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
// 1. STICKY FILTER FIX:
//    - The GlassFilterBar component now has proper sticky positioning
//    - It stays at top: 80px (below the header) when scrolling
//    - Z-index hierarchy is properly set (header: 40, filter: 30, sidebar: 50)
//
// 2. STP PLANT FREEZING FIX:
//    - Fixed data parsing errors that caused infinite loops
//    - Added proper error handling in parseStpData function
//    - Removed any circular dependencies
//    - All calculations are properly memoized
//
// 3. IMPORT STRUCTURE:
//    - Import glassmorphism components from '@/components/glassmorphism'
//    - Import section modules from '@/components/sections'
//    - Always import the CSS files in your root layout or main component
//
// 4. CSS CLASSES TO USE:
//    - sticky-header: For sticky header positioning
//    - sticky-filter-bar: For sticky filter bars (automatically applied in GlassFilterBar)
//    - glass-card: For glassmorphism card effects
//    - gradient-text: For gradient text effects
//
// 5. PERFORMANCE TIPS:
//    - Use React.memo() for heavy components if needed
//    - Lazy load sections that are not immediately visible
//    - Memoize expensive calculations with useMemo
