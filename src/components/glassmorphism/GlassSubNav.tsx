import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SubSection {
  name: string;
  id: string;
  icon: LucideIcon;
}

interface GlassSubNavProps {
  sections: SubSection[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const GlassSubNav: React.FC<GlassSubNavProps> = ({
  sections,
  activeSection,
  setActiveSection
}) => {
  return (
    <div className="mb-6 print:hidden flex justify-center">
      <div className="glass-card p-1.5 inline-flex space-x-1 border border-white/20">
        {sections.map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                isActive
                  ? 'bg-gradient-to-r from-[#5f5168] to-[#7E708A] text-white shadow-lg'
                  : 'text-[#5f5168] hover:bg-white/50'
              }`}
            >
              <tab.icon size={18} className={isActive ? 'text-white' : 'text-[#5f5168]'} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GlassSubNav;