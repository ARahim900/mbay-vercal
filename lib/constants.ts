// Design System Constants
export const OMR_PER_KWH = 0.025

// Primary Color Scheme - Sophisticated Purple-Gray Palette
export const COLORS = {
  primary: "#4E4456", // Main brand color - Deep purple-gray
  primaryLight: "#7E708A", // Lighter variant for hover states
  primaryDark: "#3B3241", // Darker variant for active states
  accent: "#6A5ACD", // Accent purple for highlights
  success: "#10B981", // Green for positive metrics
  warning: "#F59E0B", // Amber for warnings
  info: "#3B82F6", // Blue for information
  error: "#EF4444", // Red for errors

  // Chart colors palette
  chart: ["#6A5ACD", "#FFA07A", "#20B2AA", "#FF69B4", "#9370DB", "#F08080", "#4682B4", "#32CD32", "#FF6347", "#4169E1"],
}

// Navigation sections configuration
export const MAIN_SECTIONS = [
  { name: "Electricity System", icon: "Zap", sectionId: "ElectricitySystem" },
  { name: "Water Analysis", icon: "Droplets", sectionId: "WaterAnalysis" },
  { name: "STP Plant", icon: "Combine", sectionId: "STPPlant" },
  { name: "Contractor Tracker", icon: "UserCheck", sectionId: "ContractorTracker" },
]
