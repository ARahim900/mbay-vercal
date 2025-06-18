'use client';

import React, { useState } from 'react';
import { 
  Zap, Droplets, Combine, UserCheck, 
  LayoutDashboard, TrendingUp, Settings,
  FileText, HelpCircle
} from 'lucide-react';
import { ThemeProvider } from '@/components/theme-provider';
import { GlassSidebar, GlassHeader } from '@/components/layout/glass-layout';
import ElectricitySystemGlass from '@/components/sections/ElectricitySystemGlass';
import WaterAnalysisModule from '@/components/sections/WaterAnalysisGlass';
import STPPlantModule from '@/components/sections/STPPlantGlass';
import ContractorTrackerModule from '@/components/modules/contractor-tracker';

// Define the main sections
const mainSections = [
  { name: 'Electricity System', icon: Zap, sectionId: 'ElectricitySystem' },
  { name: 'Water Analysis', icon: Droplets, sectionId: 'WaterAnalysis' },
  { name: 'STP Plant', icon: Combine, sectionId: 'STPPlant' },
  { name: 'Contractor Tracker', icon: UserCheck, sectionId: 'ContractorTracker' },
];

// Additional sections for the sidebar
const additionalSections = [
  { name: 'Reports', icon: FileText, sectionId: 'Reports' },
  { name: 'Settings', icon: Settings, sectionId: 'Settings' },
  { name: 'Help', icon: HelpCircle, sectionId: 'Help' },
];

export default function OperationsDashboardGlass() {
  const [activeMainSection, setActiveMainSection] = useState('ElectricitySystem');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Combine all sections for the sidebar
  const allSections = [...mainSections];

  const renderMainContent = () => {
    switch(activeMainSection) {
      case 'ElectricitySystem':
        return <ElectricitySystemGlass />;
      case 'WaterAnalysis':
        return <WaterAnalysisModule isCollapsed={isCollapsed} />;
      case 'STPPlant':
        return <STPPlantModule />;
      case 'ContractorTracker':
        return <ContractorTrackerModule />;
      case 'Reports':
        return (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <FileText size={64} className="mx-auto text-slate-400 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">Reports Module</h2>
              <p className="text-slate-500">Generate and view operational reports</p>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <Settings size={64} className="mx-auto text-slate-400 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">System Settings</h2>
              <p className="text-slate-500">Configure system preferences and options</p>
            </div>
          </div>
        );
      case 'Help':
        return (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <HelpCircle size={64} className="mx-auto text-slate-400 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">Help & Documentation</h2>
              <p className="text-slate-500">Access user guides and support resources</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <LayoutDashboard size={64} className="mx-auto text-slate-400 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">Module Not Found</h2>
              <p className="text-slate-500">The requested module could not be found.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        {/* Apply gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 -z-10" />
        
        {/* Decorative elements */}
        <div className="fixed top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#A8D5E3]/20 to-[#BFA181]/10 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[#4E4456]/10 to-[#A8D5E3]/20 rounded-full blur-3xl -z-10" />
        
        {/* Sidebar */}
        <GlassSidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          activeSection={activeMainSection}
          setActiveSection={setActiveMainSection}
          sections={allSections}
          isDarkMode={isDarkMode}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header */}
          <GlassHeader
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            userName="Muscat Bay Admin"
            userRole="Operations Manager"
          />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {renderMainContent()}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
