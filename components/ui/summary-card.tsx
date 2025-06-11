import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface SummaryCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  unit?: string
  trend?: string
  trendColor?: string
  iconBgColor?: string
  isLoading?: boolean
  change?: number
}

export function SummaryCard({
  title,
  value,
  icon: IconComponent,
  unit,
  trend,
  trendColor,
  iconBgColor = "#4E4456",
  isLoading,
  change,
}: SummaryCardProps) {
  return (
    <div className="card-base p-3 sm:p-4 md:p-6 group transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
          {title}
        </h3>
        <div
          className="p-3 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: iconBgColor }}
        >
          <IconComponent size={22} />
        </div>
      </div>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline gap-x-2 mb-1.5">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 break-all">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {unit && (
              <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {unit}
              </span>
            )}
            {change !== undefined && (
              <div
                className={`flex items-center text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="ml-1">{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          {trend && (
            <p
              className={`text-xs font-medium ${trendColor || "text-slate-500 dark:text-slate-400"} overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {trend}
            </p>
          )}
        </>
      )}
    </div>
  )
}
