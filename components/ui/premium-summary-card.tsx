import React from 'react'
import { LucideIcon } from 'lucide-react'

interface PremiumSummaryCardProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  gradient: string
  trend?: {
    value: string | number
    isPositive: boolean
    label: string
  }
  onClick?: () => void
  isLoading?: boolean
}

export function PremiumSummaryCard({
  title,
  value,
  unit,
  icon: Icon,
  gradient,
  trend,
  onClick,
  isLoading = false
}: PremiumSummaryCardProps) {
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        onClick ? 'hover:shadow-2xl' : ''
      }`}
      style={{ background: gradient }}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-8 h-8" />
          <span className="text-white/80 text-sm font-medium">{title}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-baseline">
            {isLoading ? (
              <div className="h-8 bg-white/20 rounded animate-pulse w-24" />
            ) : (
              <>
                <span className="text-3xl font-bold">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
                {unit && <span className="text-xl ml-2 text-white/90">{unit}</span>}
              </>
            )}
          </div>
          
          {trend && !isLoading && (
            <div className="flex items-center text-white/90 text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                trend.isPositive ? 'bg-green-300' : 'bg-red-300'
              }`} />
              <span className={trend.isPositive ? 'text-green-100' : 'text-red-100'}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="ml-1 text-white/70">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full transition-transform duration-1000 hover:translate-x-full" />
    </div>
  )
}
