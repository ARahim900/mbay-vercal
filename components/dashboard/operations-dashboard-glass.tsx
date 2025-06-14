'use client';

import React, { useState } from 'react';
import { 
  Zap, Droplets, Combine, UserCheck, 
  LayoutDashboard, TrendingUp, BarChart2, 
  Activity, Power
} from 'lucide-react';
import { GlassSidebar, GlassHeader } from '../layout/glass-layout';
import ElectricitySystemGlass from '../modules/electricity-system-glass';
import WaterAnalysisGlass from '../modules/water-analysis-glass';
import STPPlantGlass from '../modules/stp-plant-glass';
import ContractorTrackerGlass from '../modules/contractor-tracker-glass';

const OperationsDashboardGlass = () => {
  const [activeMainSection, setActiveMainSection] = useState('ElectricitySystem');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const mainSections = [
    { name: 'Electricity System', icon: Zap, sectionId: 'ElectricitySystem' },
    { name: 'Water Analysis', icon: Droplets, sectionId: 'WaterAnalysis' },
    { name: 'STP Plant', icon: Combine, sectionId: 'STPPlant' },
    { name: 'Contractor Tracker', icon: UserCheck, sectionId: 'ContractorTracker' },
  ];

  const renderMainContent = () => {
    switch(activeMainSection) {
      case 'ElectricitySystem':
        return <ElectricitySystemGlass />;
      case 'WaterAnalysis':
        return <WaterAnalysisGlass />;
      case 'STPPlant':
        return <STPPlantGlass />;
      case 'ContractorTracker':
        return <ContractorTrackerGlass />;
      default:
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#4E4456]/20 to-[#A8D5E3]/20 flex items-center justify-center">
                <LayoutDashboard size={40} className="text-[#4E4456]" />
              </div>
              <h2 className="text-3xl font-bold text-slate-700 mb-4">Module Not Found</h2>
              <p className="text-slate-500">The requested module could not be found.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'}`}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-[#A8D5E3]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#BFA181]/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <GlassSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        activeSection={activeMainSection}
        setActiveSection={setActiveMainSection}
        sections={mainSections}
        isDarkMode={isDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <GlassHeader
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperationsDashboardGlass;
