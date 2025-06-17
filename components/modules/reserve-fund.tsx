'use client';

import React from 'react';
import { ReserveFundModule } from '@/src/components/sections/ReserveFundGlass';

interface ReserveFundModuleProps {
  isDarkMode?: boolean;
}

export function ReserveFundModuleWrapper({ isDarkMode = false }: ReserveFundModuleProps) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <div className="container mx-auto px-4 py-6">
        <ReserveFundModule />
      </div>
    </div>
  );
}

export { ReserveFundModuleWrapper as ReserveFundModule };