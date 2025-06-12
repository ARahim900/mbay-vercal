// STP Plant Data Types and Raw Data
export interface STPDataEntry {
  id: number;
  date: string;
  parsedDate: Date | null;
  month: string;
  treatedWater: number; // Total Treated Water Produced - m³
  tseOutput: number; // Total TSE Water Output to Irrigation - m³
  totalInlet: number; // Total Inlet Sewage Received from (MB+Tnk) -m³
  tankersDischarge: number; // Number of Tankers Discharged
  expectedTankerVolume: number; // Expected Tanker Volume (m³) (20 m3)
  directSewage: number; // Direct In line Sewage (MB)
  treatmentEfficiency: number; // Calculated: (treatedWater / totalInlet) * 100
  irrigationEfficiency: number; // Calculated: (tseOutput / treatedWater) * 100
  tankerPercentage: number; // Calculated: (expectedTankerVolume / totalInlet) * 100
  maintenanceAction1?: string;
  maintenanceAction2?: string;
  maintenanceAction3?: string;
}

// Plant design specifications
export const PLANT_DESIGN_CAPACITY = 750; // m³/day

// Raw STP data string containing the complete operational data
const rawStpDataString = `Date:	Total Treated Water Produced - m³	Total TSE Water Output to Irrigation - m³	Total Inlet Sewage Received from (MB+Tnk) -m³	Number of Tankers Discharged:	Expected Tanker Volume (m³) (20 m3)	Direct In line Sewage (MB)	Maintenance Action 1:	Maintenance Action 2:	Maintenance Action 3:
1/5/2025	717	631	631	9	180	451	Aeration tank and MBR filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
2/5/2025	703	626	691	11	220	471	Aeration tank and mbr filter clean and checked \nchecked PH and TDS of raw and product water \nchecked MLSS of aeration and mbr tank sludge water\npoured chemical\nhouse keeping   stp area		
3/5/2025	681	608	676	9	180	496	Aeration tank and mbr filter clean and checked \nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr sludge water\npoured chemical\nhouse keeping  stp area		
4/5/2025	709	635	632	8	160	472	Aeration  Tank and mbr filter checked and  clean \nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water \npoured chemical		
5/5/2025	672	593	545	9	180	365	Aeration  tank and MbR  filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
6/5/2025	657	569	594	11	220	374	Aeration  Tank and mbr filter checked and clean\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
7/5/2025	700	627	645	10	200	445	Aeration  Tank and  MBR  filter  clean and checked\nchecked PH and TDS of raw  water and product water\nchecked MLSS of aeration and mbr tank sludge water \npoured chemical\nToday aeration and mbr Blower  clean and checked		
8/5/2025	666	593	591	12	240	351	Aeration  Tank and  mbr filter  checked and clean\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr sludge water\npoured chemical		
9/5/2025	667	592	655	10	200	455	Aeration  Tank and MBR filter clean and checked  \nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
10/5/2025	705	630	663	10	200	463	Aeration tank and MBR filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical\nhouse keeping in side stp area		
11/5/2025	725	646	624	8	160	464	Aeration Tank and mbr  filter clean and checked\nchecked   PH and TDS of raw and product water\nchecked MLSS of aeration  and mbr sludge water\npoured chemical		
12/5/2025	623	645	669	9	180	489			
13/5/2025	674	592	646	9	180	466	Today we open PTU debris    pipe line  and cleaned   and fixed    again . now  ok its work as before \nAeration and mbr tank clean and checked\nchecked PH and TDS of Raw and product water \nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
14/5/2025	720	647	687	11	220	467	Aeration  tank and mbr filter checked and clean\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
15/5/2025	708	626	632	10	200	432	Aeration  tank and  mbr filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
16/5/2025	725	646	659	9	180	479	Aeration Tank and  mbr filter  clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr sludge water\npoured chemical		
17/5/2025	720	642	690	8	160	530	Aeration  tank and  mbr filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
18/5/2025	722	585	657	10	200	457	Aeration  tank and  mbr filter clean and checked\nchecked PH and TDS of raw and product water \nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
19/5/2025	722	579	603	10	200	403	Aeration  tank and mbr filter clean and checked  \nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical \nToday  aeration and mbr Blower ckean and checked		
20/5/2025	722	605	641	8	160	481	Aeration Tank and Mbr filter  clean and checked \nchecked PH and TDS of raw and product water \nchecked MLSS of aeration and mbt tank sludge water\npoured chemical		
21/5/2025	722	620	644	8	160	484	Aeration Tank and mbr filter clean and checked\nchecked PH and TDS of Raw and Product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical \n house keeping in side of stp area		
22/5/2025	728	589	606	7	140	466	Aeration  tank and  mbr filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
23/5/2025	725	581	601	5	100	501	Aeration Tank and  mbr filter clean and checked\nchecked PH and TDS of Raw and Product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
24/5/2025	721	584	576	4	80	496	Aeration  tank and mbr  filter  clean and checked  \nchecked PH and TDS of raw and Product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
25/5/2025	749	653	640	4	80	560	Aeration  tank and mbr tank clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of  aeration  and mbr tank sludge water\npoured chemical		
26/5/2025	748	606	591	5	100	491	Aeration  tank and mbr filter checked and clean \nchecked PH and TDS of raw and product water\nchecked MLSS of  aeration and mbr tank sludge water\npoured chemical		
27/5/2025	750	613	613	7	140	473	Aeration tank  and mbr filter  clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
28/5/2025	745	602	602	8	160	442	Aeration tank and MBR filter checked and clean\nchecked PH and TDS of raw and Product water\nchecked MLSS of aeration and MBR tank sludge   water\npoured chemical		
29/5/2025	749	604	638	8	160	478	Aeration tank and mbr  filter clean and checked \nchecked PH and TDS of Raw and Product water\nchecked MLSS of  Aeration and mbr tank sludge water\npoured chemical		
30/5/2025	750	609	563	7	140	423	 Aeration Tank and MBR filter checked and clean\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr  tank sludge water\npoured chemical\nhouse keeping of stp area		
31/5/2025	746	607	567	8	160	407	Aeration tank and mbr  filter checked and clean\nchecked PH and TDS of Raw and Product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
1/6/2025	701	610	576	10	200	376	Aeration tank and MBR filter clean  and checked  \nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
2/6/2025	650	524	544	11	220	324	 Aeration and mbr tank clean and checked\nchecked PH and TDS of Raw  and product water \nchecked MLSS of aeration and mbr sludge water \npoured chemical		
3/6/2025	646	560	598	11	220	378	Aeration tank and mbr filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical \nToday fine screen checked and clean		
4/6/2025	626	564	603	11	220	383	Aeration tank  and mbr filter  clean and checked \nchecked PH and TDS of raw and product water\nchecked MLSS of  Aeration and mbr tank sludge water \npoured chemical		
5/6/2025	662	591	595	12	240	355	Aeration tank and mbr filter checked and clean \nchecked PH and TDS of raw and product water \n checked MLSS of aeration and mbr  sludge water\npoured chemical		
6/6/2025	626	603	648	10	200	448	Aeration tank and mbr filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
7/6/2025	639	573	593	9	180	413	Aeration  tank and mbr filter checked and clean by water \nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr sludge water\npoured chemical		
8/6/2025	658	585	583	11	220	363	Aeration tank and mbr filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
9/6/2025	628	564	596	11	220	376	Aeration tank and mbr filter clean and checked\nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		
10/6/2025	569	508	548	10	200	348	Aeration tank and mbr filter checked and clean \nchecked PH and TDS of raw and product water\nchecked MLSS of aeration and mbr tank sludge water\npoured chemical		`.trim();

// Parse STP data function
const parseStpData = (rawData: string): STPDataEntry[] => {
  const lines = rawData.split('\n');
  const headerLine = lines[0].split('\t').map(h => h.trim());
  const dataLines = lines.slice(1);

  return dataLines.map((line, index) => {
    const values = line.split('\t');
    const dateStr = values[0]?.trim();
    
    // Parse date
    let parsedDate = null;
    if (dateStr) {
      const [day, month, year] = dateStr.split('/');
      parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    const treatedWater = parseFloat(values[1]) || 0;
    const tseOutput = parseFloat(values[2]) || 0;
    const totalInlet = parseFloat(values[3]) || 0;
    const tankersDischarge = parseInt(values[4]) || 0;
    const expectedTankerVolume = parseFloat(values[5]) || 0;
    const directSewage = parseFloat(values[6]) || 0;

    return {
      id: index + 1,
      date: dateStr,
      parsedDate: parsedDate,
      month: parsedDate ? parsedDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : 'N/A',
      treatedWater,
      tseOutput,
      totalInlet,
      tankersDischarge,
      expectedTankerVolume,
      directSewage,
      // Calculated fields
      treatmentEfficiency: totalInlet > 0 ? ((treatedWater / totalInlet) * 100) : 0,
      irrigationEfficiency: treatedWater > 0 ? ((tseOutput / treatedWater) * 100) : 0,
      tankerPercentage: totalInlet > 0 ? ((expectedTankerVolume / totalInlet) * 100) : 0,
      maintenanceAction1: values[7]?.trim() || '',
      maintenanceAction2: values[8]?.trim() || '',
      maintenanceAction3: values[9]?.trim() || '',
    };
  }).filter(item => item.date && item.date !== 'N/A');
};

// Export parsed STP data
export const stpPlantData = parseStpData(rawStpDataString);

// Export available months
export const availableStpMonths = [...new Set(stpPlantData.map(item => item.month))].sort();

// Export aggregated monthly data for charts and analysis
export const monthlyStpSummary = stpPlantData.reduce((acc, item) => {
  const month = item.month;
  if (!acc[month]) {
    acc[month] = {
      month,
      totalTreatedWater: 0,
      totalTseOutput: 0,
      totalInlet: 0,
      totalTankers: 0,
      totalDays: 0,
      avgEfficiency: 0,
      avgCapacityUtilization: 0,
    };
  }
  
  acc[month].totalTreatedWater += item.treatedWater;
  acc[month].totalTseOutput += item.tseOutput;
  acc[month].totalInlet += item.totalInlet;
  acc[month].totalTankers += item.tankersDischarge;
  acc[month].totalDays += 1;
  
  return acc;
}, {} as Record<string, any>);

// Calculate averages for monthly summary
Object.values(monthlyStpSummary).forEach((month: any) => {
  month.avgDailyTreated = Math.round(month.totalTreatedWater / month.totalDays);
  month.avgEfficiency = month.totalInlet > 0 ? 
    Math.round((month.totalTreatedWater / month.totalInlet) * 1000) / 10 : 0;
  month.avgCapacityUtilization = Math.round((month.avgDailyTreated / PLANT_DESIGN_CAPACITY) * 1000) / 10;
});

export const monthlyStpData = Object.values(monthlyStpSummary);
