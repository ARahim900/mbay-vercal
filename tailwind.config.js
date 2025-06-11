/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Muscat Bay Brand Colors - Complete Enhanced Palette
        primary: {
          DEFAULT: "#4E4456",        // Main brand color - Deep purple-gray
          50: "#F8F7F8",            // Ultra light
          100: "#F1EEF2",           // Very light
          200: "#E3DDE6",           // Light
          300: "#D5CCD9",           // Medium light
          400: "#C7BBCC",           // Medium
          500: "#B9AABF",           // Medium dark
          600: "#A598AC",           // Dark
          700: "#918699",           // Darker
          800: "#7E708A",           // Lighter variant for hover states
          900: "#6B5E77",           // Deep
          950: "#3B3241",           // Darker variant for active states
          light: "#7E708A",          // Lighter variant for hover states
          dark: "#3B3241",           // Darker variant for active states
          foreground: "hsl(var(--primary-foreground))",
        },
        
        secondary: {
          DEFAULT: "#A8D5E3",        // Soft teal for highlights
          50: "#F7FDFE",            // Ultra light teal
          100: "#EEFBFC",           // Very light teal
          200: "#DDF7F9",           // Light teal
          300: "#CCF3F6",           // Medium light teal
          400: "#BBEFF3",           // Medium teal
          500: "#A8D5E3",           // Default soft teal
          600: "#7BB3C7",           // Darker teal
          700: "#5E91AB",           // Deep teal
          800: "#416F8F",           // Very deep teal
          900: "#244D73",           // Darkest teal
          light: "#C3FBF4",          // Very light teal
          dark: "#7BB3C7",           // Darker teal
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        accent: {
          DEFAULT: "#BFA181",        // Muted gold for warnings/accents
          50: "#FDF9F6",            // Ultra light gold
          100: "#FBF3ED",           // Very light gold
          200: "#F7E7DB",           // Light gold
          300: "#F3DBC9",           // Medium light gold
          400: "#EFCFB7",           // Medium gold
          500: "#BFA181",           // Default muted gold
          600: "#A68B5B",           // Darker gold
          700: "#8D7535",           // Deep gold
          800: "#745F0F",           // Very deep gold
          900: "#5B4900",           // Darkest gold
          light: "#F2F0EA",          // Light cream
          dark: "#A68B5B",           // Darker gold
          foreground: "hsl(var(--accent-foreground))",
        },
        
        // Status Colors - Enhanced
        success: {
          DEFAULT: "#10B981",        // Green for positive metrics
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          light: "#6EE7B7",
          dark: "#047857",
        },
        
        warning: {
          DEFAULT: "#F59E0B",        // Amber for warnings
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          light: "#FCD34D",
          dark: "#D97706",
        },
        
        info: {
          DEFAULT: "#0A1828",        // Deep classic blue for information
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#0A1828",           // Deep navy
          light: "#3B82F6",
          dark: "#1E40AF",
        },
        
        error: {
          DEFAULT: "#EF4444",        // Red for errors
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          light: "#F87171",
          dark: "#DC2626",
        },
        
        // Extended Muscat Bay Palette
        muscat: {
          purple: {
            DEFAULT: "#5f5168",       // Original logo purple
            light: "#8A7E92",
            dark: "#4A3F4F",
          },
          teal: {
            DEFAULT: "#A8D5E3",       // Logo teal accent
            light: "#C3FBF4",
            dark: "#7BB3C7",
          },
          gold: {
            DEFAULT: "#BFA181",       // Warm gold
            light: "#F2F0EA",
            dark: "#A68B5B",
          },
          cream: "#F2F0EA",           // Light cream
          navy: "#0A1828",            // Deep navy
          white: "#ffffff",           // Pure white
        },
        
        // Chart Colors - Muscat Bay themed
        chart: {
          1: "#4E4456",               // Primary purple
          2: "#A8D5E3",               // Teal
          3: "#BFA181",               // Gold
          4: "#0A1828",               // Navy
          5: "#5f5168",               // Logo purple
          6: "#C3FBF4",               // Light teal
          7: "#F2F0EA",               // Cream
          8: "#10B981",               // Success green
          9: "#EF4444",               // Error red
          10: "#6A5ACD",              // Accent purple
        },
        
        // Legacy support
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(78, 68, 86, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(78, 68, 86, 0.8)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'muscat': '0 4px 6px -1px rgba(78, 68, 86, 0.1), 0 2px 4px -1px rgba(78, 68, 86, 0.06)',
        'muscat-lg': '0 10px 15px -3px rgba(78, 68, 86, 0.1), 0 4px 6px -2px rgba(78, 68, 86, 0.05)',
        'muscat-xl': '0 20px 25px -5px rgba(78, 68, 86, 0.1), 0 10px 10px -5px rgba(78, 68, 86, 0.04)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
