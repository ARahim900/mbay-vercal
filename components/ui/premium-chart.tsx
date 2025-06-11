import React from 'react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

interface PremiumChartProps {
  data: any[]
  type: 'area' | 'line' | 'bar' | 'pie'
  height?: number
  colors?: string[]
  title?: string
  subtitle?: string
  showGrid?: boolean
  showLegend?: boolean
  dataKey?: string
  xAxisKey?: string
  gradient?: boolean
  animated?: boolean
  isDarkMode?: boolean
}

const CustomTooltip = ({ active, payload, label, isDarkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`${
        isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'
      } border rounded-xl p-4 shadow-2xl backdrop-blur-sm`}>
        <p className={`font-semibold mb-2 ${
          isDarkMode ? 'text-slate-100' : 'text-slate-800'
        }`}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className={`text-sm ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {entry.name}: 
            </span>
            <span className={`font-bold ${
              isDarkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {typeof entry.value === 'number' 
                ? entry.value.toLocaleString() 
                : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload, isDarkMode }: any) => (
  <div className="flex justify-center space-x-6 mt-4">
    {payload?.map((entry: any, index: number) => (
      <div key={index} className="flex items-center space-x-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: entry.color }}
        />
        <span className={`text-sm font-medium ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {entry.value}
        </span>
      </div>
    ))}
  </div>
)

export function PremiumChart({
  data,
  type,
  height = 400,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
  title,
  subtitle,
  showGrid = true,
  showLegend = false,
  dataKey = 'value',
  xAxisKey = 'name',
  gradient = true,
  animated = true,
  isDarkMode = false
}: PremiumChartProps) {
  const gridColor = isDarkMode ? '#374151' : '#f1f5f9'
  const axisColor = isDarkMode ? '#9ca3af' : '#64748b'
  const textColor = isDarkMode ? '#f1f5f9' : '#1f2937'

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            {gradient && (
              <defs>
                {colors.map((color, index) => (
                  <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
            )}
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis 
              dataKey={xAxisKey} 
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor }}
            />
            <YAxis 
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor }}
            />
            <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
            {showLegend && <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />}
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              fill={gradient ? `url(#gradient0)` : colors[0]}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
              isAnimationActive={animated}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        )

      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis 
              dataKey={xAxisKey} 
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor }}
            />
            <YAxis 
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor }}
            />
            <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
            {showLegend && <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={4}
              dot={{ fill: colors[0], strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: colors[0], strokeWidth: 2 }}
              isAnimationActive={animated}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis 
              dataKey={xAxisKey} 
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor }}
            />
            <YAxis 
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor }}
            />
            <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
            {showLegend && <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />}
            <Bar 
              dataKey={dataKey} 
              fill={colors[0]}
              radius={[8, 8, 0, 0]}
              isAnimationActive={animated}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </BarChart>
        )

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey={dataKey}
              isAnimationActive={animated}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
            {showLegend && <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />}
          </PieChart>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && (
            <h3 className={`text-xl font-bold mb-2 ${
              isDarkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}
