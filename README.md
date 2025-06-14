# Muscat Bay Operations Management System

A modern web application for managing and monitoring Muscat Bay's utilities and operations, featuring a cutting-edge glassmorphism design inspired by Apple's design language.

## 🎨 Design Features

### Glassmorphism UI Enhancement
The application now features a contemporary glassmorphism (liquid glass) design system with:

- **Translucent Glass Effects**: Beautiful frosted glass appearance with backdrop blur
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Modern Dropdowns**: Apple-inspired liquid glass dropdown menus
- **Enhanced Charts**: Visually appealing and interactive data visualizations
- **Brand Colors**: Muscat Bay signature purple (#5f5168) with complementary palette

### Key Design Elements

1. **Glass Cards**: Semi-transparent cards with blur effects
2. **Glass Buttons**: Interactive buttons with ripple effects
3. **Glass Dropdowns**: Smooth, animated dropdown menus
4. **Glass Charts**: Modern chart wrappers with glassmorphism styling
5. **Summary Cards**: Enhanced KPI cards with gradient effects

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ARahim900/mbay-vercal.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/
│   ├── glassmorphism/     # Glassmorphism UI components
│   │   ├── GlassCard.tsx
│   │   ├── GlassButton.tsx
│   │   ├── GlassDropdown.tsx
│   │   ├── GlassChart.tsx
│   │   ├── GlassSummaryCard.tsx
│   │   ├── GlassSidebar.tsx
│   │   └── GlassHeader.tsx
│   └── sections/          # Main application sections
├── styles/
│   ├── glassmorphism.css  # Core glassmorphism styles
│   └── animations.css     # Animation definitions
└── constants/
    └── colors.ts          # Brand color palette
```

## 🎯 Using Glassmorphism Components

### Glass Card
```tsx
import { GlassCard } from '@/components/glassmorphism';

<GlassCard className="p-6">
  <h2>Your Content</h2>
</GlassCard>
```

### Glass Dropdown
```tsx
import { GlassDropdown } from '@/components/glassmorphism';

<GlassDropdown
  label="Select Option"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
/>
```

### Glass Chart
```tsx
import { GlassChart } from '@/components/glassmorphism';

<GlassChart title="Performance Metrics" subtitle="Monthly data">
  <LineChart data={data}>
    {/* Chart content */}
  </LineChart>
</GlassChart>
```

### Glass Summary Card
```tsx
import { GlassSummaryCard } from '@/components/glassmorphism';

<GlassSummaryCard
  title="Total Consumption"
  value="46,039"
  unit="kWh"
  icon={Zap}
  trend="↑ 5% from last month"
  trendColor="text-green-600"
  iconBgColor={COLORS.primary}
/>
```

## 🎨 Color Palette

The application uses Muscat Bay's brand colors:

- **Primary**: `#5f5168` (Deep muted purple)
- **Primary Light**: `#7E708A`
- **Primary Dark**: `#3B3241`
- **Accent**: `#A8D5E3` (Soft teal)
- **Success**: `#10B981`
- **Warning**: `#BFA181` (Muted gold)
- **Info**: `#0A1828` (Deep blue)
- **Error**: `#EF4444`

## 📱 Responsive Design

The glassmorphism components are fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🌟 Showcase

Visit `/showcase` to see all glassmorphism components in action with interactive examples.

## 🔧 Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **Lucide Icons**: Modern icon library
- **Supabase**: Database integration (optional)

## 📈 Main Sections

1. **Electricity Analysis**: Monitor electricity consumption across zones
2. **Water Analysis**: Track water distribution and loss analysis
3. **STP Plant**: Sewage treatment plant performance metrics
4. **Contractor Tracker**: Manage contractor activities and contracts

## 🚀 Performance Optimizations

- Lazy loading of chart components
- Optimized glassmorphism effects for smooth performance
- Efficient data parsing and caching
- Smooth animations with GPU acceleration

## 🗃️ Database Integration (Optional)

The application supports Supabase integration for live data:

```bash
# Add to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The app works with mock data when database is not configured.

## 🌐 Deployment

### Vercel Deployment
```bash
# Deploy to Vercel
vercel
```

### Environment Variables
Configure the following in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL` (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)

## 📝 License

This project is proprietary to Muscat Bay Operations.

## 👥 Contact

For questions or support, please contact the Muscat Bay IT department.

---

*Built with ❤️ for Muscat Bay Operations Management*
