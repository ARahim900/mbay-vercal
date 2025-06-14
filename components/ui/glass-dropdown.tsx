'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface GlassDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  icon,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between
          px-4 py-3 rounded-2xl
          bg-white/85 backdrop-blur-xl backdrop-saturate-200
          border border-white/20
          shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]
          hover:shadow-[0_8px_48px_0_rgba(31,38,135,0.3)]
          hover:bg-white/90 hover:border-white/30
          transition-all duration-300 ease-out
          cursor-pointer group
          ${isOpen ? 'ring-2 ring-[#A8D5E3]/30 border-[#A8D5E3]/50' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="text-[#4E4456] group-hover:text-[#5f5168] transition-colors">
              {icon}
            </span>
          )}
          <span className={`text-sm font-medium ${selectedOption ? 'text-[#4E4456]' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        
        <ChevronDown
          size={18}
          className={`
            text-[#4E4456] transition-all duration-300
            ${isOpen ? 'rotate-180' : ''}
            group-hover:text-[#5f5168]
          `}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute z-50 w-full mt-2
          bg-white/95 backdrop-blur-2xl backdrop-saturate-200
          border border-white/20
          rounded-2xl overflow-hidden
          shadow-[0_16px_48px_0_rgba(31,38,135,0.25)]
          transition-all duration-300 ease-out origin-top
          ${
            isOpen
              ? 'opacity-100 scale-y-100 translate-y-0'
              : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 flex items-center justify-between
                hover:bg-gradient-to-r hover:from-[#A8D5E3]/10 hover:to-transparent
                transition-all duration-200 group
                ${value === option.value ? 'bg-gradient-to-r from-[#4E4456]/10 to-transparent' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                {option.icon && (
                  <span className={`
                    transition-colors
                    ${value === option.value ? 'text-[#4E4456]' : 'text-slate-400 group-hover:text-[#5f5168]'}
                  `}>
                    {option.icon}
                  </span>
                )}
                <span className={`
                  text-sm font-medium transition-colors
                  ${value === option.value ? 'text-[#4E4456]' : 'text-slate-600 group-hover:text-[#4E4456]'}
                `}>
                  {option.label}
                </span>
              </div>
              
              {value === option.value && (
                <Check size={16} className="text-[#4E4456]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Multi-select variant
interface GlassMultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const GlassMultiSelect: React.FC<GlassMultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  label,
  icon,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)
    .join(', ');

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between
          px-4 py-3 rounded-2xl
          bg-white/85 backdrop-blur-xl backdrop-saturate-200
          border border-white/20
          shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]
          hover:shadow-[0_8px_48px_0_rgba(31,38,135,0.3)]
          hover:bg-white/90 hover:border-white/30
          transition-all duration-300 ease-out
          cursor-pointer group
          ${isOpen ? 'ring-2 ring-[#A8D5E3]/30 border-[#A8D5E3]/50' : ''}
        `}
      >
        <div className="flex items-center gap-3 flex-1 mr-2">
          {icon && (
            <span className="text-[#4E4456] group-hover:text-[#5f5168] transition-colors">
              {icon}
            </span>
          )}
          <span className={`text-sm font-medium truncate ${value.length > 0 ? 'text-[#4E4456]' : 'text-slate-400'}`}>
            {value.length > 0 ? selectedLabels : placeholder}
          </span>
          {value.length > 0 && (
            <span className="ml-auto mr-2 px-2 py-0.5 bg-[#4E4456]/10 text-[#4E4456] text-xs font-medium rounded-full">
              {value.length}
            </span>
          )}
        </div>
        
        <ChevronDown
          size={18}
          className={`
            text-[#4E4456] transition-all duration-300
            ${isOpen ? 'rotate-180' : ''}
            group-hover:text-[#5f5168]
          `}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute z-50 w-full mt-2
          bg-white/95 backdrop-blur-2xl backdrop-saturate-200
          border border-white/20
          rounded-2xl overflow-hidden
          shadow-[0_16px_48px_0_rgba(31,38,135,0.25)]
          transition-all duration-300 ease-out origin-top
          ${
            isOpen
              ? 'opacity-100 scale-y-100 translate-y-0'
              : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className={`
                w-full px-4 py-3 flex items-center justify-between
                hover:bg-gradient-to-r hover:from-[#A8D5E3]/10 hover:to-transparent
                transition-all duration-200 group
                ${value.includes(option.value) ? 'bg-gradient-to-r from-[#4E4456]/10 to-transparent' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center
                  transition-all duration-200
                  ${
                    value.includes(option.value)
                      ? 'bg-[#4E4456] border-[#4E4456]'
                      : 'border-slate-300 group-hover:border-[#5f5168]'
                  }
                `}>
                  {value.includes(option.value) && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
                {option.icon && (
                  <span className={`
                    transition-colors
                    ${value.includes(option.value) ? 'text-[#4E4456]' : 'text-slate-400 group-hover:text-[#5f5168]'}
                  `}>
                    {option.icon}
                  </span>
                )}
                <span className={`
                  text-sm font-medium transition-colors
                  ${value.includes(option.value) ? 'text-[#4E4456]' : 'text-slate-600 group-hover:text-[#4E4456]'}
                `}>
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
