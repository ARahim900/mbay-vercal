// ===============================
// MUSCAT BAY UTILITIES & THEMING
// ===============================

/**
 * Comprehensive utility functions and constants for the Muscat Bay SAAS application
 * Includes theming, formatting, responsive helpers, and UI utilities
 */

// ===============================
// MUSCAT BAY COLOR SYSTEM
// ===============================

export const MUSCAT_BAY_COLORS = {
  // Primary Brand Colors
  primary: {
    DEFAULT: '#4E4456',        // Main brand color - Deep purple-gray
    50: '#F8F7F8',            // Ultra light
    100: '#F1EEF2',           // Very light
    200: '#E3DDE6',           // Light
    300: '#D5CCD9',           // Medium light
    400: '#C7BBCC',           // Medium
    500: '#B9AABF',           // Medium dark
    600: '#A598AC',           // Dark
    700: '#918699',           // Darker
    800: '#7E708A',           // Lighter variant for hover states
    900: '#6B5E77',           // Deep
    950: '#3B3241',           // Darker variant for active states
    light: '#7E708A',          // Lighter variant for hover states
    dark: '#3B3241',           // Darker variant for active states
  },
  
  // Secondary Colors
  secondary: {
    DEFAULT: '#A8D5E3',        // Soft teal for highlights
    50: '#F7FDFE',            // Ultra light teal
    100: '#EEFBFC',           // Very light teal
    200: '#DDF7F9',           // Light teal
    300: '#CCF3F6',           // Medium light teal
    400: '#BBEFF3',           // Medium teal
    500: '#A8D5E3',           // Default soft teal
    600: '#7BB3C7',           // Darker teal
    700: '#5E91AB',           // Deep teal
    800: '#416F8F',           // Very deep teal
    900: '#244D73',           // Darkest teal
    light: '#C3FBF4',          // Very light teal
    dark: '#7BB3C7',           // Darker teal
  },
  
  // Accent Colors
  accent: {
    DEFAULT: '#BFA181',        // Muted gold for warnings/accents
    50: '#FDF9F6',            // Ultra light gold
    100: '#FBF3ED',           // Very light gold
    200: '#F7E7DB',           // Light gold
    300: '#F3DBC9',           // Medium light gold
    400: '#EFCFB7',           // Medium gold
    500: '#BFA181',           // Default muted gold
    600: '#A68B5B',           // Darker gold
    700: '#8D7535',           // Deep gold
    800: '#745F0F',           // Very deep gold
    900: '#5B4900',           // Darkest gold
    light: '#F2F0EA',          // Light cream
    dark: '#A68B5B',           // Darker gold
  },
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  info: '#0A1828',
  error: '#EF4444',
  
  // Chart Colors - Muscat Bay themed
  chart: [
    '#4E4456', '#A8D5E3', '#BFA181', '#0A1828', '#5f5168', 
    '#C3FBF4', '#F2F0EA', '#10B981', '#EF4444', '#6A5ACD'
  ],
  
  // Extended Muscat Bay Palette
  muscat: {
    purple: {
      DEFAULT: '#5f5168',       // Original logo purple
      light: '#8A7E92',
      dark: '#4A3F4F',
    },
    teal: {
      DEFAULT: '#A8D5E3',       // Logo teal accent
      light: '#C3FBF4',
      dark: '#7BB3C7',
    },
    gold: {
      DEFAULT: '#BFA181',       // Warm gold
      light: '#F2F0EA',
      dark: '#A68B5B',
    },
    cream: '#F2F0EA',           // Light cream
    navy: '#0A1828',            // Deep navy
    white: '#ffffff',           // Pure white
  }
};

// ===============================
// RESPONSIVE BREAKPOINTS
// ===============================

export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  
  // Muscat Bay specific breakpoints
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  widescreen: '1536px',
};

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 25) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Formats numbers with proper locale and currency
 * @param {number} value - The number to format
 * @param {string} type - Type of formatting ('currency', 'number', 'percentage')
 * @param {string} currency - Currency code (default: 'OMR')
 * @returns {string} Formatted number
 */
export const formatNumber = (value, type = 'number', currency = 'OMR') => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-OM', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    
    case 'percentage':
      return new Intl.NumberFormat('en-OM', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value / 100);
    
    case 'compact':
      return new Intl.NumberFormat('en-OM', {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value);
    
    default:
      return new Intl.NumberFormat('en-OM', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
  }
};

/**
 * Gets appropriate badge styling for different categories
 * @param {string} category - The category name
 * @returns {string} Tailwind CSS classes for the badge
 */
export const getCategoryBadgeStyle = (category) => {
  const styles = {
    'Pumping Station': 'bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20',
    'Lifting Station': 'bg-success/10 text-success px-3 py-1 rounded-full text-xs font-medium border border-success/20',
    'Apartment': 'bg-secondary/10 text-secondary-800 px-3 py-1 rounded-full text-xs font-medium border border-secondary/20',
    'Street Light': 'bg-warning/10 text-warning px-3 py-1 rounded-full text-xs font-medium border border-warning/20',
    'Beachwell': 'bg-info/10 text-info px-3 py-1 rounded-full text-xs font-medium border border-info/20',
    'Central Park': 'bg-success/10 text-success px-3 py-1 rounded-full text-xs font-medium border border-success/20',
    'CIF Kitchen': 'bg-accent/10 text-accent-700 px-3 py-1 rounded-full text-xs font-medium border border-accent/20',
    'Security Building': 'bg-error/10 text-error px-3 py-1 rounded-full text-xs font-medium border border-error/20',
    'Village Square': 'bg-muscat-purple/10 text-muscat-purple px-3 py-1 rounded-full text-xs font-medium border border-muscat-purple/20',
    'Irrigation Tank': 'bg-secondary/10 text-secondary-700 px-3 py-1 rounded-full text-xs font-medium border border-secondary/20',
    'Actuator DB': 'bg-accent/10 text-accent-600 px-3 py-1 rounded-full text-xs font-medium border border-accent/20',
  };
  
  return styles[category] || 'bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200';
};

/**
 * Gets rank badge styling based on position
 * @param {number} rank - The rank position (0-based)
 * @returns {string} Tailwind CSS classes for rank badge
 */
export const getRankBadgeStyle = (rank) => {
  if (rank === 0) return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg ring-4 ring-yellow-300/50';
  if (rank === 1) return 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white shadow-lg ring-4 ring-slate-300/50';
  if (rank === 2) return 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg ring-4 ring-orange-300/50';
  return 'bg-gradient-to-br from-primary via-primary-light to-primary-dark text-white shadow-muscat';
};

/**
 * Gets performance indicator color based on value and thresholds
 * @param {number} value - The value to evaluate
 * @param {object} thresholds - Object with good, warning, danger thresholds
 * @returns {string} Color name
 */
export const getPerformanceColor = (value, thresholds = { good: 80, warning: 60, danger: 40 }) => {
  if (value >= thresholds.good) return 'success';
  if (value >= thresholds.warning) return 'warning';
  return 'error';
};

/**
 * Debounces function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generates pagination array for pagination component
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {number} maxVisible - Maximum visible page numbers
 * @returns {Array} Array of page numbers to display
 */
export const generatePaginationArray = (currentPage, totalPages, maxVisible = 5) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  if (currentPage <= Math.ceil(maxVisible / 2)) {
    return Array.from({ length: maxVisible }, (_, i) => i + 1);
  }
  
  if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
    return Array.from({ length: maxVisible }, (_, i) => totalPages - maxVisible + i + 1);
  }
  
  const start = currentPage - Math.floor(maxVisible / 2);
  return Array.from({ length: maxVisible }, (_, i) => start + i);
};

/**
 * Converts data array to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Column headers
 * @returns {string} CSV formatted string
 */
export const arrayToCSV = (data, columns) => {
  const csvHeaders = columns.join(',');
  const csvRows = data.map(row => 
    columns.map(col => {
      const value = row[col] || '';
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',')
  );
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Deep clone object utility
 * @param {any} obj - Object to clone
 * @returns {any} Deep cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
};

// ===============================
// RESPONSIVE UTILITIES
// ===============================

/**
 * Hook to detect current screen size
 * @returns {string} Current breakpoint name
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('md');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else if (width >= 640) setBreakpoint('sm');
      else setBreakpoint('xs');
    };
    
    updateBreakpoint();
    window.addEventListener('resize', debounce(updateBreakpoint, 100));
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return breakpoint;
};

/**
 * Check if current screen is mobile
 * @returns {boolean} True if mobile screen
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/**
 * Check if current screen is tablet
 * @returns {boolean} True if tablet screen
 */
export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Check if current screen is desktop
 * @returns {boolean} True if desktop screen
 */
export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

// ===============================
// DATA PROCESSING UTILITIES
// ===============================

/**
 * Sorts array of objects by specified key
 * @param {Array} array - Array to sort
 * @param {string} key - Property key to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortByKey = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    if (direction === 'asc') {
      return aVal - bVal;
    }
    return bVal - aVal;
  });
};

/**
 * Filters array based on search term across multiple fields
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered array
 */
export const searchFilter = (array, searchTerm, searchFields) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(term);
    })
  );
};

/**
 * Groups array by specified key
 * @param {Array} array - Array to group
 * @param {string} key - Property key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// ===============================
// VALIDATION UTILITIES
// ===============================

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates required fields in an object
 * @param {Object} obj - Object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateRequired = (obj, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ===============================
// LOCAL STORAGE UTILITIES
// ===============================

/**
 * Safe localStorage getter
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Stored value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safe localStorage setter
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setStorageItem = (key, value) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key to remove
 */
export const removeStorageItem = (key) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
};

// ===============================
// MUSCAT BAY CONSTANTS
// ===============================

export const MUSCAT_BAY_CONSTANTS = {
  // Electricity
  OMR_PER_KWH: 0.025,
  
  // Application
  APP_NAME: 'Muscat Bay Operations Management Suite',
  APP_VERSION: '2.0.0',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Animation durations (in milliseconds)
  ANIMATION_DURATION: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Table configurations
  TABLE_MOBILE_BREAKPOINT: 1024, // px
  TABLE_MAX_ROWS_BEFORE_PAGINATION: 50,
  
  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.csv', '.xlsx', '.json'],
  
  // Date formats
  DATE_FORMAT: 'MMM DD, YYYY',
  DATETIME_FORMAT: 'MMM DD, YYYY HH:mm',
  
  // Number formats
  DECIMAL_PLACES: 2,
  LARGE_NUMBER_THRESHOLD: 1000000,
};

// Export default object with all utilities
export default {
  MUSCAT_BAY_COLORS,
  BREAKPOINTS,
  MUSCAT_BAY_CONSTANTS,
  truncateText,
  formatNumber,
  getCategoryBadgeStyle,
  getRankBadgeStyle,
  getPerformanceColor,
  debounce,
  generatePaginationArray,
  arrayToCSV,
  deepClone,
  sortByKey,
  searchFilter,
  groupBy,
  isValidEmail,
  validateRequired,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  isMobile,
  isTablet,
  isDesktop,
};
