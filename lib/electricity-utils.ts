/**
 * Electricity System Utilities
 * Comprehensive calculation and data processing utilities for the Electricity System module
 */

export const KWH_TO_OMR_RATE = 0.025;

// ===============================
// PERFORMANCE CALCULATIONS
// ===============================

/**
 * Calculate Energy Efficiency Score (0-100)
 * Based on consumption patterns and system optimization
 */
export const calculateEfficiencyScore = (data) => {
  if (!data || data.length === 0) return 0;
  
  const totalConsumption = data.reduce((acc, curr) => acc + curr.totalConsumption, 0);
  const maxPossibleConsumption = data.length * 5000; // 5000 kWh baseline per unit
  
  return Math.min(100, Math.max(0, 100 - ((totalConsumption / maxPossibleConsumption) * 100)));
};

/**
 * Calculate Load Factor (distribution efficiency)
 */
export const calculateLoadFactor = (data) => {
  if (!data || data.length === 0) return 0;
  
  const totalConsumption = data.reduce((acc, curr) => acc + curr.totalConsumption, 0);
  const avgConsumption = totalConsumption / data.length;
  const variance = data.reduce((acc, curr) => 
    acc + Math.pow(curr.totalConsumption - avgConsumption, 2), 0) / data.length;
  
  return Math.max(0, 100 - (Math.sqrt(variance) / avgConsumption * 100));
};

/**
 * Calculate Peak Demand Percentage
 */
export const calculatePeakDemand = (data) => {
  if (!data || data.length === 0) return 0;
  
  const totalConsumption = data.reduce((acc, curr) => acc + curr.totalConsumption, 0);
  const peakConsumer = Math.max(...data.map(d => d.totalConsumption));
  
  return (peakConsumer / totalConsumption) * 100;
};

/**
 * Calculate System Reliability
 */
export const calculateReliability = (data) => {
  if (!data || data.length === 0) return 0;
  
  const activeMeters = data.filter(d => 
    d.meterAccountNo !== 'N/A' && 
    d.meterAccountNo !== 'MISSING_METER' && 
    d.totalConsumption > 0
  ).length;
  
  return (activeMeters / data.length) * 100;
};

/**
 * Calculate Seasonal Variation
 */
export const calculateSeasonalVariation = (monthlyData) => {
  if (!monthlyData || monthlyData.length === 0) return 0;
  
  const monthlyTotals = monthlyData.map(m => m.total);
  const maxMonthly = Math.max(...monthlyTotals);
  const minMonthly = Math.min(...monthlyTotals);
  
  return maxMonthly > 0 ? ((maxMonthly - minMonthly) / maxMonthly) * 100 : 0;
};

// ===============================
// ANALYTICS CALCULATIONS
// ===============================

/**
 * Calculate Growth Rate from trending data
 */
export const calculateGrowthRate = (monthlyData) => {
  if (!monthlyData || monthlyData.length < 2) return 0;
  
  const recentMonths = monthlyData.slice(-6); // Last 6 months
  if (recentMonths.length < 2) return 0;
  
  const trend = (recentMonths[recentMonths.length - 1].total - recentMonths[0].total) / recentMonths.length;
  return recentMonths[0].total > 0 ? (trend / recentMonths[0].total) * 100 : 0;
};

/**
 * Generate 3-month forecast based on trend analysis
 */
export const generateForecast = (monthlyData, periods = 3) => {
  if (!monthlyData || monthlyData.length === 0) return [];
  
  const recentMonths = monthlyData.slice(-6);
  const trend = recentMonths.length > 1 ? 
    (recentMonths[recentMonths.length - 1].total - recentMonths[0].total) / recentMonths.length : 0;
  
  const lastValue = recentMonths[recentMonths.length - 1]?.total || 0;
  const futureMonths = ['Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25'];
  
  return Array.from({ length: periods }, (_, i) => ({
    month: futureMonths[i] || `Month ${i + 1}`,
    predicted: Math.max(0, lastValue + (trend * (i + 1))),
    confidenceInterval: {
      lower: Math.max(0, lastValue + (trend * (i + 1)) * 0.85),
      upper: lastValue + (trend * (i + 1)) * 1.15
    }
  }));
};

/**
 * Calculate optimization potential for high consumers
 */
export const calculateOptimizationPotential = (topConsumers, optimizationRate = 0.15) => {
  if (!topConsumers || topConsumers.length === 0) return 0;
  
  return topConsumers.reduce((acc, curr) => acc + (curr.consumption * optimizationRate), 0);
};

// ===============================
// FINANCIAL CALCULATIONS
// ===============================

/**
 * Calculate ROI for energy efficiency initiatives
 */
export const calculateROI = (investment, annualSavings) => {
  if (!annualSavings || annualSavings <= 0) return null;
  return investment / annualSavings;
};

/**
 * Calculate cost savings potential
 */
export const calculateCostSavings = (optimizationPotential) => {
  return optimizationPotential * KWH_TO_OMR_RATE;
};

/**
 * Generate financial impact assessment
 */
export const generateFinancialImpact = (data, optimizationRate = 0.15) => {
  const totalConsumption = data.reduce((acc, curr) => acc + curr.totalConsumption, 0);
  const currentCost = totalConsumption * KWH_TO_OMR_RATE;
  const optimizationPotential = totalConsumption * optimizationRate;
  const annualSavings = optimizationPotential * KWH_TO_OMR_RATE * 12;
  
  return {
    currentAnnualCost: currentCost * 12,
    optimizationPotential,
    annualSavings,
    monthlyVisinSavings: annualSavings / 12,
    fiveYearSavings: annualSavings * 5,
    optimizationPercentage: optimizationRate * 100
  };
};

// ===============================
// DATA PROCESSING UTILITIES
// ===============================

/**
 * Group data by category with aggregated metrics
 */
export const groupByCategory = (data) => {
  if (!data || data.length === 0) return [];
  
  const categoryGroups = {};
  
  data.forEach(item => {
    const category = item.category || 'Other';
    if (!categoryGroups[category]) {
      categoryGroups[category] = {
        category,
        units: [],
        totalConsumption: 0,
        averageConsumption: 0,
        unitCount: 0
      };
    }
    
    categoryGroups[category].units.push(item);
    categoryGroups[category].totalConsumption += item.totalConsumption;
    categoryGroups[category].unitCount += 1;
  });
  
  // Calculate averages
  Object.values(categoryGroups).forEach(group => {
    group.averageConsumption = group.unitCount > 0 ? group.totalConsumption / group.unitCount : 0;
  });
  
  return Object.values(categoryGroups).sort((a, b) => b.totalConsumption - a.totalConsumption);
};

/**
 * Identify high priority units for optimization
 */
export const identifyHighPriorityUnits = (data, thresholds = { critical: 20000, high: 10000 }) => {
  if (!data || data.length === 0) return { critical: [], high: [], medium: [] };
  
  return {
    critical: data.filter(item => item.totalConsumption > thresholds.critical),
    high: data.filter(item => 
      item.totalConsumption > thresholds.high && 
      item.totalConsumption <= thresholds.critical
    ),
    medium: data.filter(item => item.totalConsumption <= thresholds.high && item.totalConsumption > 0)
  };
};

/**
 * Calculate performance score for individual units
 */
export const calculateUnitPerformanceScore = (unit, categoryAverage, systemAverage) => {
  if (!unit || unit.totalConsumption === 0) return 0;
  
  // Score based on efficiency relative to category and system averages
  const categoryRatio = categoryAverage > 0 ? unit.totalConsumption / categoryAverage : 1;
  const systemRatio = systemAverage > 0 ? unit.totalConsumption / systemAverage : 1;
  
  // Lower consumption relative to averages = higher score
  const score = Math.max(0, 100 - ((categoryRatio + systemRatio) / 2 * 50));
  return Math.round(score);
};

// ===============================
// TREND ANALYSIS UTILITIES
// ===============================

/**
 * Detect consumption patterns and anomalies
 */
export const detectPatterns = (monthlyData) => {
  if (!monthlyData || monthlyData.length < 3) return null;
  
  const values = monthlyData.map(m => m.total);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Identify anomalies (values beyond 2 standard deviations)
  const anomalies = monthlyData.filter(month => 
    Math.abs(month.total - mean) > (2 * stdDev)
  );
  
  // Detect trend direction
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const trendDirection = secondAvg > firstAvg * 1.05 ? 'increasing' : 
                        secondAvg < firstAvg * 0.95 ? 'decreasing' : 'stable';
  
  return {
    mean: Math.round(mean),
    standardDeviation: Math.round(stdDev),
    anomalies,
    trendDirection,
    volatility: Math.round((stdDev / mean) * 100), // Coefficient of variation
    seasonalityIndex: calculateSeasonalityIndex(values)
  };
};

/**
 * Calculate seasonality index
 */
export const calculateSeasonalityIndex = (values) => {
  if (values.length < 12) return null;
  
  // Simple seasonality calculation based on monthly variation
  const monthlyAverages = [];
  for (let i = 0; i < 12; i++) {
    const monthValues = values.filter((_, index) => index % 12 === i);
    if (monthValues.length > 0) {
      monthlyAverages[i] = monthValues.reduce((a, b) => a + b, 0) / monthValues.length;
    }
  }
  
  const overallAverage = monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length;
  const seasonalVariation = Math.max(...monthlyAverages) - Math.min(...monthlyAverages);
  
  return Math.round((seasonalVariation / overallAverage) * 100);
};

// ===============================
// EXPORT ALL UTILITIES
// ===============================

export const electricityUtils = {
  // Performance
  calculateEfficiencyScore,
  calculateLoadFactor,
  calculatePeakDemand,
  calculateReliability,
  calculateSeasonalVariation,
  
  // Analytics
  calculateGrowthRate,
  generateForecast,
  calculateOptimizationPotential,
  
  // Financial
  calculateROI,
  calculateCostSavings,
  generateFinancialImpact,
  
  // Data Processing
  groupByCategory,
  identifyHighPriorityUnits,
  calculateUnitPerformanceScore,
  
  // Trend Analysis
  detectPatterns,
  calculateSeasonalityIndex,
  
  // Constants
  KWH_TO_OMR_RATE
};

export default electricityUtils;