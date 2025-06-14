# Glassmorphism UI Migration Guide

This guide will help you migrate existing components to use the new glassmorphism design system.

## 🔄 Migration Steps

### 1. Update Dropdowns

#### Before (Traditional Select):
```tsx
<select 
  value={selectedMonth} 
  onChange={(e) => setSelectedMonth(e.target.value)}
  className="border border-slate-300 rounded-lg px-3 py-2"
>
  {months.map(month => (
    <option key={month} value={month}>{month}</option>
  ))}
</select>
```

#### After (Glassmorphism Dropdown):
```tsx
import { GlassDropdown } from '@/components/ui/glass-index';

<GlassDropdown
  label="Select Month"
  options={months.map(month => ({ 
    value: month, 
    label: month,
    icon: <CalendarDays size={16} /> // optional
  }))}
  value={selectedMonth}
  onChange={setSelectedMonth}
  placeholder="Choose a month"
/>
```

### 2. Update Metric/Summary Cards

#### Before:
```tsx
<div className="bg-white p-6 rounded-xl shadow-lg">
  <h3 className="text-slate-500 font-semibold">{title}</h3>
  <p className="text-3xl font-bold">{value}</p>
  <p className="text-sm text-green-600">{trend}</p>
</div>
```

#### After:
```tsx
import { GlassMetricCard } from '@/components/ui/glass-index';

<GlassMetricCard
  title={title}
  value={value}
  unit="kWh"
  icon={<Zap size={20} />}
  trend={{
    value: 12.5,
    label: 'vs last month',
    positive: true
  }}
  iconBgColor="#4E4456"
/>
```

### 3. Update Chart Containers

#### Before:
```tsx
<div className="bg-white p-6 rounded-xl shadow-lg">
  <h3 className="text-xl font-semibold">{title}</h3>
  <ResponsiveContainer width="100%" height={350}>
    <LineChart data={data}>
      {/* ... */}
    </LineChart>
  </ResponsiveContainer>
</div>
```

#### After:
```tsx
import { GlassChartCard } from '@/components/ui/glass-index';

<GlassChartCard
  title={title}
  subtitle="Monthly performance data"
  actions={
    <GlassIconButton 
      icon={<Download size={16} />} 
      variant="ghost" 
      size="sm"
    />
  }
>
  <ResponsiveContainer width="100%" height={350}>
    <LineChart data={data}>
      {/* ... */}
    </LineChart>
  </ResponsiveContainer>
</GlassChartCard>
```

### 4. Update Buttons

#### Before:
```tsx
<button 
  onClick={handleClick}
  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
>
  Click Me
</button>
```

#### After:
```tsx
import { GlassButton } from '@/components/ui/glass-index';

<GlassButton
  variant="primary"
  size="md"
  icon={<Save size={16} />}
  onClick={handleClick}
>
  Save Changes
</GlassButton>
```

### 5. Update Tables

#### Before:
```tsx
<table className="w-full">
  <thead>
    <tr>
      <th>Name</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    {data.map(row => (
      <tr key={row.id}>
        <td>{row.name}</td>
        <td>{row.value}</td>
      </tr>
    ))}
  </tbody>
</table>
```

#### After:
```tsx
import { GlassCard, GlassTable } from '@/components/ui/glass-index';

<GlassCard>
  <GlassTable
    headers={['Name', 'Value']}
    data={data.map(row => [row.name, row.value])}
  />
</GlassCard>
```

### 6. Update Progress Bars

#### Before:
```tsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-blue-600 h-2 rounded-full"
    style={{ width: `${percentage}%` }}
  />
</div>
```

#### After:
```tsx
import { GlassProgress } from '@/components/ui/glass-index';

<GlassProgress
  value={percentage}
  max={100}
  label="Completion"
  color="#4E4456"
  size="md"
/>
```

### 7. Update Badges/Status Indicators

#### Before:
```tsx
<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
  Active
</span>
```

#### After:
```tsx
import { GlassBadge } from '@/components/ui/glass-index';

<GlassBadge variant="success" size="sm">
  Active
</GlassBadge>
```

## 🎨 Styling Best Practices

### 1. Use CSS Variables
```css
/* Instead of hardcoding colors */
background-color: #4E4456;

/* Use CSS variables */
background-color: var(--mb-primary);
```

### 2. Apply Glass Effects
```tsx
// For custom glass containers
<div className="glass-solid rounded-2xl p-6">
  {/* Content */}
</div>

// Or use the utility classes
<div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
  {/* Content */}
</div>
```

### 3. Consistent Spacing
- Use rounded corners: `rounded-2xl` or `rounded-3xl`
- Padding: `p-6` for cards, `p-4` for compact elements
- Margins: `gap-6` for grid layouts, `space-y-6` for vertical stacks

### 4. Hover Effects
```tsx
// Add hover states to interactive elements
<div className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
  {/* Content */}
</div>
```

## 📋 Component Checklist

For each module (Electricity, Water, STP, Contractor), update:

- [ ] All select/dropdown elements → `GlassDropdown`
- [ ] Summary/KPI cards → `GlassMetricCard`
- [ ] Chart containers → `GlassChartCard`
- [ ] Buttons → `GlassButton` or `GlassIconButton`
- [ ] Tables → `GlassTable` wrapped in `GlassCard`
- [ ] Progress indicators → `GlassProgress`
- [ ] Status badges → `GlassBadge`
- [ ] Tab navigation → `GlassTabNavigation`
- [ ] Notifications → `GlassNotification`

## 🔧 Module-Specific Updates

### Electricity System
```tsx
// Update the filter bar
<div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <GlassDropdown {...monthDropdownProps} />
    <GlassDropdown {...categoryDropdownProps} />
    <GlassButton variant="primary" icon={<Filter />}>
      Reset Filters
    </GlassButton>
  </div>
</div>
```

### Water Analysis
```tsx
// Update quality parameters display
<GlassCard>
  {waterQualityData.map((param) => (
    <div className="flex justify-between items-center p-4 hover:bg-slate-50/50 rounded-xl transition-colors">
      <div>
        <h4 className="font-medium text-slate-700">{param.parameter}</h4>
        <p className="text-sm text-slate-500">Range: {param.range}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-[#4E4456]">{param.value} {param.unit}</p>
        <GlassBadge variant={param.status === 'good' ? 'success' : 'warning'}>
          {param.status.toUpperCase()}
        </GlassBadge>
      </div>
    </div>
  ))}
</GlassCard>
```

### STP Plant
```tsx
// Update treatment stages display
<GlassChartCard title="Treatment Stages" subtitle="Current efficiency by stage">
  <div className="space-y-4">
    {treatmentStages.map((stage) => (
      <div key={stage.name} className="p-4 bg-slate-50/50 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-slate-700">{stage.name}</h4>
          <span className="text-green-600 font-medium">{stage.efficiency}%</span>
        </div>
        <GlassProgress
          value={stage.efficiency}
          color="#10B981"
          size="sm"
          showPercentage={false}
        />
      </div>
    ))}
  </div>
</GlassChartCard>
```

### Contractor Tracker
```tsx
// Update contractor cards
{contractors.map((contractor) => (
  <GlassCard key={contractor.id} hover>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-semibold text-slate-800">{contractor.name}</h3>
        <p className="text-sm text-slate-600">{contractor.project}</p>
      </div>
      <GlassBadge 
        variant={contractor.status === 'active' ? 'success' : 'default'}
      >
        {contractor.status}
      </GlassBadge>
    </div>
    <GlassProgress
      value={contractor.completion}
      label="Project Progress"
      color="#4E4456"
    />
  </GlassCard>
))}
```

## 🚀 Performance Tips

1. **Lazy Load Heavy Components**
   ```tsx
   const GlassChartCard = dynamic(
     () => import('@/components/ui/glass-components').then(mod => mod.GlassChartCard),
     { ssr: false }
   );
   ```

2. **Optimize Backdrop Filters**
   - Use `will-change: transform` for elements that will animate
   - Limit the number of elements with backdrop-filter
   - Consider using `transform: translateZ(0)` to enable hardware acceleration

3. **Reduce Re-renders**
   ```tsx
   // Memoize expensive calculations
   const chartData = useMemo(() => processData(rawData), [rawData]);
   
   // Memoize components
   const MemoizedChart = memo(ChartComponent);
   ```

## ✅ Testing Checklist

After migration, test:
- [ ] All dropdowns open/close properly
- [ ] Hover effects work smoothly
- [ ] Charts render correctly
- [ ] Responsive design on mobile/tablet
- [ ] Dark mode compatibility
- [ ] Performance (no lag on interactions)
- [ ] Accessibility (keyboard navigation)

## 🎉 Completion

Once all components are migrated:
1. Remove old style utilities
2. Update the main dashboard to use `OperationsDashboardGlass`
3. Test across all browsers
4. Deploy and monitor performance

Need help? Check the component source files in `/components/ui/` for detailed prop documentation.
