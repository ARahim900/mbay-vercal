"use client"

// Define the shape of the data this component expects
export type TagColor = "blue" | "purple" | "orange" | "slate" | "green" | "yellow" | "red"

interface SystemListItemProps {
  id: number
  name: string
  subName?: string // Optional for lines like "Main Bulk Meter"
  meterType: string
  category: string
  value: number
  tag: string
  tagColor: TagColor
  unit?: string // Optional unit display (e.g., "kWh", "m³")
  accountNo?: string // Optional account number
}

// Helper to get the correct color classes for the tag
const getTagStyles = (color: TagColor) => {
  switch (color) {
    case "blue":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50"
    case "purple":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/50"
    case "orange":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700/50"
    case "green":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50"
    case "yellow":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50"
    case "red":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50"
    default: // slate
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600/50"
  }
}

// Helper to get icon background color
const getIconStyles = (color: TagColor) => {
  switch (color) {
    case "blue":
      return "bg-blue-500 text-white"
    case "purple":
      return "bg-purple-500 text-white"
    case "orange":
      return "bg-orange-500 text-white"
    case "green":
      return "bg-green-500 text-white"
    case "yellow":
      return "bg-yellow-500 text-slate-800"
    case "red":
      return "bg-red-500 text-white"
    default: // slate
      return "bg-slate-500 text-white"
  }
}

export function SystemListItem({ 
  id, 
  name, 
  subName, 
  meterType, 
  category, 
  value, 
  tag, 
  tagColor, 
  unit = "",
  accountNo 
}: SystemListItemProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 group">
      <div className="flex items-center justify-between">
        {/* Left Section: Icon, Name, and Details */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Icon/Number */}
          <div className={`flex items-center justify-center rounded-full w-10 h-10 font-semibold text-sm flex-shrink-0 ${getIconStyles(tagColor)}`}>
            {id}
          </div>
          
          {/* Name and Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{name}</h3>
              {accountNo && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {accountNo}
                </span>
              )}
            </div>
            {subName && (
              <p className="font-medium text-slate-700 dark:text-slate-200 text-sm truncate">{subName}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">{meterType}</span>
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400">•</span>
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400">{category}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Value and Tag */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Value */}
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </span>
              {unit && (
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {unit}
                </span>
              )}
            </div>
          </div>
          
          {/* Tag */}
          <div>
            <span className={`inline-block rounded-md font-medium whitespace-nowrap border px-3 py-1.5 text-xs ${getTagStyles(tagColor)}`}>
              {tag}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
