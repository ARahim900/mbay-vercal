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
        
        // Muscat Bay Brand Colors - Complete Palette
        primary: {
          DEFAULT: "#4E4456",        // Main brand color - Deep purple-gray
          light: "#7E708A",          // Lighter variant for hover states
          dark: "#3B3241",           // Darker variant for active states
          foreground: "hsl(var(--primary-foreground))",
        },
        
        secondary: {
          DEFAULT: "#A8D5E3",        // Soft teal for highlights
          light: "#C3FBF4",          // Very light teal
          dark: "#7BB3C7",           // Darker teal
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        accent: {
          DEFAULT: "#BFA181",        // Muted gold for warnings/accents
          light: "#F2F0EA",          // Light cream
          dark: "#A68B5B",           // Darker gold
          foreground: "hsl(var(--accent-foreground))",
        },
        
        // Status Colors
        success: {
          DEFAULT: "#10B981",        // Green for positive metrics
          light: "#6EE7B7",
          dark: "#047857",
        },
        
        warning: {
          DEFAULT: "#F59E0B",        // Amber for warnings
          light: "#FCD34D",
          dark: "#D97706",
        },
        
        info: {
          DEFAULT: "#0A1828",        // Deep classic blue for information
          light: "#3B82F6",
          dark: "#1E40AF",
        },
        
        error: {
          DEFAULT: "#EF4444",        // Red for errors
          light: "#F87171",
          dark: "#DC2626",
        },
        
        // Extended Muscat Bay Palette
        muscat: {
          purple: "#5f5168",         // Original logo purple
          teal: "#A8D5E3",          // Logo teal accent
          gold: "#BFA181",          // Warm gold
          cream: "#F2F0EA",         // Light cream
          navy: "#0A1828",          // Deep navy
          white: "#ffffff",         // Pure white
        },
        
        // Chart Colors - Muscat Bay themed
        chart: {
          1: "#4E4456",             // Primary purple
          2: "#A8D5E3",             // Teal
          3: "#BFA181",             // Gold
          4: "#0A1828",             // Navy
          5: "#5f5168",             // Logo purple
          6: "#C3FBF4",             // Light teal
          7: "#F2F0EA",             // Cream
          8: "#10B981",             // Success green
          9: "#EF4444",             // Error red
          10: "#6A5ACD",            // Accent purple
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
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
