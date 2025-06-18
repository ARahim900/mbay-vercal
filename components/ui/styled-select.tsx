"use client"

import type React from "react"
import { ChevronDown, type LucideIcon } from "lucide-react"

interface StyledSelectProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[] | { value: string; label: string }[]
  id: string
  icon?: LucideIcon
  disabled?: boolean
}

export function StyledSelect({ label, value, onChange, options, id, icon: Icon, disabled }: StyledSelectProps) {
  // Normalize options to handle both string arrays and object arrays
  const normalizedOptions = options.map((option) => {
    if (typeof option === 'string') {
      return { value: option, label: option }
    }
    return option
  })

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
            <Icon size={16} className="text-slate-400" />
          </div>
        )}
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`muscat-input appearance-none w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 h-[46px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            backgroundImage: 'none'
          }}
        >
          {normalizedOptions.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 z-10">
          <ChevronDown size={16} className="text-slate-500 dark:text-slate-400" />
        </div>
      </div>
    </div>
  )
}
