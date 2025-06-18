import React, { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card"

interface ChartWrapperProps {
  title: string
  children: ReactNode
  subtitle?: string
  actions?: ReactNode
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  isTable?: boolean
}

export function ChartWrapper({
  title,
  children,
  subtitle,
  actions,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
  isTable = false,
}: ChartWrapperProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state when children change
  useEffect(() => {
    setHasError(false);
  }, [children]);

  // Error UI
  const errorContent = (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
      <AlertTriangle size={48} className="mb-4 text-slate-400" />
      <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Error displaying chart</p>
      <p className="text-sm">There was a problem rendering this component</p>
    </div>
  );

  return (
    <Card className="card-base">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className={`${isTable ? 'min-h-[400px]' : 'h-[400px]'} p-2 sm:p-4 md:p-6 relative`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
            <span className="ml-2 text-slate-600 dark:text-slate-300">Loading chart data...</span>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <AlertTriangle size={48} className="mb-4 text-slate-400" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">{emptyMessage}</p>
            <p className="text-sm">Try adjusting your filters or check back later.</p>
          </div>
        ) : hasError ? (
          errorContent
        ) : (
          <div className="h-full w-full overflow-hidden">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
