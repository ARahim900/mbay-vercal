// Reserve Fund Data Processing Utilities
// This file handles all Reserve Fund data parsing and calculations

export interface ReserveFundUnit {
  id: number;
  unitNo: string;
  sector: string;
  type: string;
  unitType: string;
  bua: number;
  zoneContrib: number;
  masterContrib: number;
  totalContrib: number;
  notes: string;
  hasIssues: boolean;
  contributionRate: number; // OMR per sqm
}

// Complete Reserve Fund SQL Data (Extended from the original source)
const reserveFundRawData = `
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('3C', 'C Sector', 'Commercial', 'Development Land', '5656', '9931.94', '10828.27', '20760.21', '-1');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B01', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B02', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B03', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B04', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B05', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B06', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B07', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 B08', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z1 CIF', 'FM', 'Staff Accomm', 'Staff Accommodation', 'N/A', 'N/A', 'N/A', 'N/A', '(4) Area Missing');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 001', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 002', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 003', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 004', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 005', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 006', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 007', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 008', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '(2) Area Assumed');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 009', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 010', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 011', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 012', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 013', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 014', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 015', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 016', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 017', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 018', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 019', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 020', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 021', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 022', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 023', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 024', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 025', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 026', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 027', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 028', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 029', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 030', 'Zaha', 'Villa', '3 Bed Zaha Villa', '357.12', '156.78', '683.7', '840.48', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 031', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 032', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 033', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 034', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 035', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 036', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 037', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 038', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 039', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 040', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 041', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 042', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z3 043', 'Zaha', 'Villa', '4 Bed Zaha Villa', '422.24', '185.36', '808.37', '993.73', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z5 001', 'Nameer', 'Villa', '4 Bed Nameer Villa', '497.62', '546.39', '952.68', '1499.07', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z5 002', 'Nameer', 'Villa', '3 Bed Nameer Villa', '426.78', '468.6', '817.06', '1285.66', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z5 003', 'Nameer', 'Villa', '4 Bed Nameer Villa', '497.62', '546.39', '952.68', '1499.07', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z5 004', 'Nameer', 'Villa', '3 Bed Nameer Villa', '426.78', '468.6', '817.06', '1285.66', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z5 005', 'Nameer', 'Villa', '4 Bed Nameer Villa', '497.62', '546.39', '952.68', '1499.07', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z8 001', 'Wajd', 'Villa', '5 Bed Wajd Villa', '750.35', '246.87', '1436.53', '1683.4', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z8 002', 'Wajd', 'Villa', '5 Bed Wajd Villa', '750.35', '246.87', '1436.53', '1683.4', '');
INSERT INTO tableName (Unit No, Sector, Type, Unit Type, BUA (sqm), Zone Contrib. (OMR), Master Contrib. (OMR), Total 2025 Contrib. (OMR), Notes) VALUES ('Z8 022', 'Wajd', 'Villa', 'King Villa', '1844.67', '606.89', '3531.65', '4138.54', '');
`.trim();

// Enhanced parsing function with validation and error handling
export const parseReserveFundData = (): ReserveFundUnit[] => {
  console.log('🔧 Parsing Reserve Fund data...');
  
  const insertStatements = reserveFundRawData
    .split('\n')
    .filter(line => line.trim().startsWith('INSERT'))
    .filter(line => line.includes('VALUES'));
  
  console.log(`📊 Found ${insertStatements.length} INSERT statements`);
  
  const parsedData = insertStatements.map((statement, index) => {
    try {
      // Extract values from VALUES clause using improved regex
      const valuesMatch = statement.match(/VALUES\s*\((.*)\);?\s*$/);
      if (!valuesMatch) {
        console.warn(`⚠️ Could not parse statement ${index + 1}`);
        return null;
      }
      
      const valuesStr = valuesMatch[1];
      
      // Parse CSV-like values handling quoted strings
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';
      
      for (let i = 0; i < valuesStr.length; i++) {
        const char = valuesStr[i];
        
        if ((char === "'" || char === '"') && !inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar && inQuotes) {
          inQuotes = false;
          quoteChar = '';
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
          continue;
        } else {
          current += char;
        }
      }
      if (current.trim()) {
        values.push(current.trim());
      }
      
      // Data parsing and validation
      const parseNumber = (str: string): number => {
        if (!str || str === 'N/A' || str === '') return 0;
        const cleaned = str.replace(/['"]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
      };
      
      const parseString = (str: string): string => {
        return str ? str.replace(/^['"]|['"]$/g, '').trim() : '';
      };
      
      // Create unit object
      const unit: ReserveFundUnit = {
        id: index + 1,
        unitNo: parseString(values[0]) || `Unit-${index + 1}`,
        sector: parseString(values[1]) || 'Unknown',
        type: parseString(values[2]) || 'Unknown',
        unitType: parseString(values[3]) || 'Unknown',
        bua: parseNumber(values[4]),
        zoneContrib: parseNumber(values[5]),
        masterContrib: parseNumber(values[6]),
        totalContrib: parseNumber(values[7]),
        notes: parseString(values[8]) || '',
        hasIssues: false,
        contributionRate: 0
      };
      
      // Calculate contribution rate
      if (unit.bua > 0 && unit.totalContrib > 0) {
        unit.contributionRate = unit.totalContrib / unit.bua;
      }
      
      // Flag units with issues
      unit.hasIssues = unit.bua === 0 || unit.totalContrib === 0 || 
                      unit.notes.includes('Missing') || 
                      unit.notes.includes('Assumed');
      
      return unit;
      
    } catch (error) {
      console.error(`❌ Error parsing statement ${index + 1}:`, error);
      return null;
    }
  }).filter((unit): unit is ReserveFundUnit => unit !== null);
  
  console.log(`✅ Successfully parsed ${parsedData.length} reserve fund units`);
  console.log(`📈 Valid contributing units: ${parsedData.filter(u => u.totalContrib > 0).length}`);
  console.log(`⚠️ Units with issues: ${parsedData.filter(u => u.hasIssues).length}`);
  
  return parsedData;
};

// Calculate comprehensive statistics
export const calculateReserveFundStats = (data: ReserveFundUnit[], filters?: {
  sector?: string;
  type?: string;
}) => {
  const filteredData = data.filter(unit => {
    const sectorMatch = !filters?.sector || filters.sector === 'All Sectors' || unit.sector === filters.sector;
    const typeMatch = !filters?.type || filters.type === 'All Types' || unit.type === filters.type;
    return sectorMatch && typeMatch;
  });
  
  const validUnits = filteredData.filter(unit => unit.totalContrib > 0);
  const unitsWithIssues = filteredData.filter(unit => unit.hasIssues);
  
  const stats = {
    // Basic counts
    totalUnits: filteredData.length,
    validUnits: validUnits.length,
    unitsWithIssues: unitsWithIssues.length,
    
    // Financial totals
    totalZoneContrib: validUnits.reduce((sum, unit) => sum + unit.zoneContrib, 0),
    totalMasterContrib: validUnits.reduce((sum, unit) => sum + unit.masterContrib, 0),
    totalContrib: validUnits.reduce((sum, unit) => sum + unit.totalContrib, 0),
    
    // Area calculations
    totalBUA: validUnits.reduce((sum, unit) => sum + unit.bua, 0),
    avgBUA: validUnits.length > 0 ? validUnits.reduce((sum, unit) => sum + unit.bua, 0) / validUnits.length : 0,
    
    // Rate calculations
    avgContribPerUnit: validUnits.length > 0 ? validUnits.reduce((sum, unit) => sum + unit.totalContrib, 0) / validUnits.length : 0,
    avgContribPerSqm: 0,
    minContribRate: 0,
    maxContribRate: 0,
    
    // Sector breakdown
    sectorStats: {} as Record<string, any>,
    typeStats: {} as Record<string, any>
  };
  
  // Calculate per sqm rate
  if (stats.totalBUA > 0) {
    stats.avgContribPerSqm = stats.totalContrib / stats.totalBUA;
  }
  
  // Calculate min/max contribution rates
  const rates = validUnits.map(unit => unit.contributionRate).filter(rate => rate > 0);
  if (rates.length > 0) {
    stats.minContribRate = Math.min(...rates);
    stats.maxContribRate = Math.max(...rates);
  }
  
  return stats;
};

// Get unique filter options
export const getFilterOptions = (data: ReserveFundUnit[]) => {
  const sectors = ['All Sectors', ...Array.from(new Set(data.map(unit => unit.sector))).sort()];
  const types = ['All Types', ...Array.from(new Set(data.map(unit => unit.type))).sort()];
  
  return {
    sectors: sectors.map(s => ({ value: s, label: s })),
    types: types.map(t => ({ value: t, label: t }))
  };
};

// Export formatted data for charts
export const formatDataForCharts = (data: ReserveFundUnit[]) => {
  const validUnits = data.filter(unit => unit.totalContrib > 0);
  
  // Sector breakdown
  const sectorBreakdown = validUnits.reduce((acc, unit) => {
    if (!acc[unit.sector]) {
      acc[unit.sector] = {
        sector: unit.sector,
        units: 0,
        totalContrib: 0,
        totalBUA: 0,
        avgContrib: 0
      };
    }
    
    acc[unit.sector].units += 1;
    acc[unit.sector].totalContrib += unit.totalContrib;
    acc[unit.sector].totalBUA += unit.bua;
    
    return acc;
  }, {} as Record<string, any>);
  
  // Calculate averages
  Object.values(sectorBreakdown).forEach((sector: any) => {
    sector.avgContrib = sector.units > 0 ? sector.totalContrib / sector.units : 0;
  });
  
  // Type breakdown
  const typeBreakdown = validUnits.reduce((acc, unit) => {
    if (!acc[unit.type]) {
      acc[unit.type] = {
        type: unit.type,
        units: 0,
        totalContrib: 0,
        percentage: 0
      };
    }
    
    acc[unit.type].units += 1;
    acc[unit.type].totalContrib += unit.totalContrib;
    
    return acc;
  }, {} as Record<string, any>);
  
  // Calculate percentages
  const totalContrib = Object.values(typeBreakdown).reduce((sum: number, type: any) => sum + type.totalContrib, 0);
  Object.values(typeBreakdown).forEach((type: any) => {
    type.percentage = totalContrib > 0 ? (type.totalContrib / totalContrib) * 100 : 0;
  });
  
  return {
    sectorBreakdown: Object.values(sectorBreakdown).sort((a: any, b: any) => b.totalContrib - a.totalContrib),
    typeBreakdown: Object.values(typeBreakdown).sort((a: any, b: any) => b.totalContrib - a.totalContrib)
  };
};

// Export validation and quality checks
export const validateReserveFundData = (data: ReserveFundUnit[]) => {
  const issues = {
    missingBUA: data.filter(unit => unit.bua === 0).length,
    missingContributions: data.filter(unit => unit.totalContrib === 0).length,
    inconsistentData: data.filter(unit => unit.zoneContrib + unit.masterContrib !== unit.totalContrib && unit.totalContrib > 0).length,
    duplicateUnits: 0,
    invalidRates: data.filter(unit => unit.contributionRate > 10 || (unit.contributionRate > 0 && unit.contributionRate < 0.1)).length
  };
  
  // Check for duplicate unit numbers
  const unitNumbers = data.map(unit => unit.unitNo);
  const uniqueUnitNumbers = new Set(unitNumbers);
  issues.duplicateUnits = unitNumbers.length - uniqueUnitNumbers.size;
  
  return issues;
};