# 🎨 Muscat Bay Design System - Developer Quick Reference

## 🚀 Quick Start

### Using Muscat Bay Colors

```typescript
// Import the design system
import { MUSCAT_BAY_COLORS, getColor, getChartColors } from '@/lib/theme';

// Direct color usage
const primaryColor = MUSCAT_BAY_COLORS.primary.DEFAULT; // #4E4456
const lightTeal = MUSCAT_BAY_COLORS.secondary.light;    // #C3FBF4

// Utility function
const color = getColor('primary.500'); // Returns #4E4456

// Chart colors
const chartColors = getChartColors(5); // Returns 5 colors from primary palette
```

### CSS Classes

```html
<!-- Buttons -->
<button className="muscat-button-primary">Primary Action</button>
<button className="muscat-button-secondary">Secondary Action</button>
<button className="muscat-button-accent">Accent Action</button>

<!-- Cards -->
<div className="muscat-card">
  <h3 className="muscat-gradient-text">Gradient Title</h3>
</div>

<!-- Badges -->
<span className="muscat-badge-primary">Primary</span>
<span className="muscat-badge-success">Success</span>
<span className="muscat-badge-warning">Warning</span>

<!-- Status Indicators -->
<span className="status-active">Active</span>
<span className="status-inactive">Inactive</span>
<span className="status-warning">Warning</span>

<!-- Input Fields -->
<input className="muscat-input" type="text" placeholder="Enter text..." />
```

### Tailwind Utilities

```html
<!-- Background Colors -->
<div className="bg-primary text-white">Primary Background</div>
<div className="bg-secondary text-slate-800">Secondary Background</div>
<div className="bg-accent text-slate-800">Accent Background</div>

<!-- Text Colors -->
<h1 className="text-primary">Primary Text</h1>
<p className="text-secondary-dark">Secondary Text</p>
<span className="text-accent-dark">Accent Text</span>

<!-- Border Colors -->
<div className="border-2 border-primary">Primary Border</div>
<div className="border border-secondary-light">Light Secondary Border</div>
```

## 🎨 Color Palette Reference

### Primary Colors (Purple-Gray)
```
primary-50:  #F8F7F8  (Very Light)
primary-100: #F1EEF2  (Light)
primary-500: #4E4456  (DEFAULT - Main Brand)
primary-700: #3B3241  (Dark)
primary-900: #251E26  (Very Dark)
```

### Secondary Colors (Teal)
```
secondary-50:  #F0F9FB  (Very Light)
secondary-100: #E1F3F7  (Light) 
secondary-500: #A8D5E3  (DEFAULT - Soft Teal)
secondary-700: #2A4D73  (Dark)
secondary-900: #0D093B  (Very Dark)
```

### Accent Colors (Gold)
```
accent-50:  #FDFCFA  (Very Light)
accent-100: #F9F7F2  (Light)
accent-500: #BFA181  (DEFAULT - Muted Gold)
accent-700: #8D7540  (Dark)
accent-900: #5B4913  (Very Dark)
```

## 📊 Chart Color Schemes

### Primary Palette (Recommended for most charts)
```typescript
const colors = ['#4E4456', '#A8D5E3', '#BFA181', '#0A1828', '#5f5168'];
```

### Category Colors for Unit Types
```typescript
const categoryColors = {
  'Pumping Station': '#3B82F6',  // Blue
  'Lifting Station': '#10B981',  // Green
  'Apartment': '#8B5CF6',        // Purple
  'Street Light': '#F59E0B',     // Amber
  'Central Park': '#10B981',     // Emerald
  'Beachwell': '#0EA5E9',        // Sky
};
```

## 🧩 Component Examples

### Enhanced Table with Muscat Bay Styling

```typescript
const EnhancedTable = ({ data }) => (
  <div className="muscat-table-responsive">
    <table className="muscat-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="table-row-hover">
            <td className="font-medium">{item.name}</td>
            <td>
              <span className="muscat-badge-primary">
                {item.category}
              </span>
            </td>
            <td className="text-right">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

### Chart with Muscat Bay Colors

```typescript
import { getChartColors } from '@/lib/theme';

const EnhancedChart = ({ data }) => {
  const colors = getChartColors(data.length);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={colors[0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
```

### Summary Card Component

```typescript
const SummaryCard = ({ title, value, icon: Icon, trend, type = 'primary' }) => {
  const iconColors = {
    primary: 'var(--muscat-primary)',
    secondary: 'var(--muscat-secondary)', 
    accent: 'var(--muscat-accent)',
    success: 'var(--muscat-success)',
  };
  
  return (
    <div className="muscat-card group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-slate-500 font-semibold text-sm">{title}</h3>
        <div 
          className="p-3 rounded-full text-white shadow-md group-hover:scale-110 transition-transform"
          style={{ backgroundColor: iconColors[type] }}
        >
          <Icon size={20} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      {trend && <p className="text-sm text-slate-500">{trend}</p>}
    </div>
  );
};
```

## 🎯 Best Practices

### Color Usage Guidelines

1. **Primary Colors**: Use for main actions, navigation, and brand elements
2. **Secondary Colors**: Use for highlights, secondary actions, and accents
3. **Accent Colors**: Use sparingly for warnings, special callouts, and emphasis
4. **Status Colors**: Use consistently for success, warning, error, and info states

### Accessibility

```css
/* Ensure proper contrast ratios */
.text-on-primary { color: white; } /* High contrast on primary background */
.text-on-secondary { color: #1a2b57; } /* Dark text on light secondary */
.text-on-accent { color: #5b4913; } /* Dark text on light accent */
```

### Responsive Design

```html
<!-- Use responsive utilities -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Cards adapt to screen size -->
</div>

<!-- Mobile-friendly buttons -->
<button className="w-full sm:w-auto muscat-button-primary">
  Responsive Button
</button>
```

## 🔧 CSS Variables Reference

All Muscat Bay colors are available as CSS custom properties:

```css
/* Primary colors */
var(--muscat-primary)
var(--muscat-primary-light)
var(--muscat-primary-dark)
var(--muscat-primary-50) /* through */ var(--muscat-primary-900)

/* Secondary colors */
var(--muscat-secondary)
var(--muscat-secondary-light)
var(--muscat-secondary-dark)

/* Accent colors */
var(--muscat-accent)
var(--muscat-accent-light)
var(--muscat-accent-dark)

/* Status colors */
var(--muscat-success)
var(--muscat-warning)
var(--muscat-error)
var(--muscat-info)
```

## 📱 Mobile Considerations

```css
/* Mobile-first responsive design */
@media (max-width: 640px) {
  .muscat-card { @apply mx-2; }
  .responsive-text { @apply text-sm; }
}

/* Touch-friendly elements */
.touch-target {
  min-height: 44px; /* iOS recommendation */
  min-width: 44px;
}
```

## 🌙 Dark Mode Support

The design system includes built-in dark mode support:

```css
.dark .muscat-card {
  @apply bg-slate-800 border-slate-700;
}

.dark .muscat-button-primary {
  /* Automatically adjusted for dark mode */
}
```

## ⚡ Performance Tips

1. **Use CSS Variables**: Leverage the built-in CSS custom properties for consistent theming
2. **Avoid Inline Styles**: Use utility classes or CSS classes instead
3. **Optimize Chart Colors**: Use `getChartColors()` to generate consistent color arrays
4. **Lazy Load Components**: Use React.lazy() for heavy dashboard components

---

## 📚 Additional Resources

- **Full Documentation**: See `MUSCAT_BAY_UI_ENHANCEMENTS.md`
- **Design Tokens**: Check `lib/theme.ts` for complete color definitions
- **Component Library**: All reusable components in `components/` directory
- **Global Styles**: Enhanced styles in `app/globals.css`

---

**Happy coding with the Muscat Bay Design System! 🎨✨**
