'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface GlassDropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface GlassDropdownProps {
  options: GlassDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  icon,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`glass-dropdown ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Dropdown trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-left
            bg-white/90 backdrop-blur-xl
            border border-white/20
            rounded-xl
            shadow-lg
            transition-all duration-300
            flex items-center justify-between
            hover:bg-white/95 hover:shadow-xl hover:scale-[1.02]
            focus:outline-none focus:ring-2 focus:ring-primary/20
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isOpen ? 'ring-2 ring-primary/20 scale-[1.02]' : ''}
          `}
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 4px 24px rgba(95, 81, 104, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.8)'
          }}
        >
          <div className="flex items-center space-x-3">
            {icon && <span className="text-primary">{icon}</span>}
            <span className={selectedOption ? 'text-slate-700' : 'text-slate-400'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          
          <ChevronDown 
            size={20} 
            className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className="absolute z-50 w-full mt-2 animate-glass-slide-down"
            style={{
              transformOrigin: 'top center'
            }}
          >
            <GlassCard
              className="py-2 px-0 max-h-64 overflow-auto custom-scrollbar"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(24px) saturate(200%)',
                WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                boxShadow: '0 8px 32px rgba(95, 81, 104, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8)'
              }}
              hover={false}
            >
              {options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  onMouseEnter={() => setHoveredOption(option.value)}
                  onMouseLeave={() => setHoveredOption(null)}
                  disabled={option.disabled}
                  className={`
                    w-full px-4 py-3 text-left
                    flex items-center space-x-3
                    transition-all duration-200
                    relative overflow-hidden
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/5'}
                    ${option.value === value ? 'bg-primary/10 text-primary' : 'text-slate-700'}
                  `}
                  style={{
                    transform: hoveredOption === option.value ? 'translateX(4px)' : 'translateX(0)',
                    backgroundColor: hoveredOption === option.value ? 'rgba(95, 81, 104, 0.05)' : undefined
                  }}
                >
                  {/* Liquid animation on hover */}
                  {hoveredOption === option.value && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
                      style={{
                        animation: 'liquid-wave 0.8s ease-out'
                      }}
                    />
                  )}
                  
                  {option.icon && (
                    <span className="relative z-10">{option.icon}</span>
                  )}
                  <span className="relative z-10">{option.label}</span>
                  
                  {option.value === value && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              ))}
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassDropdown;
