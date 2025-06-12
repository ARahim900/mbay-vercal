import React, { useState, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, 
    Area, AreaChart, ComposedChart, Label
} from 'recharts';
import { 
    ChevronDown, ChevronUp, Filter, TrendingUp, TrendingDown, Droplet, 
    AlertTriangle, ChevronLeft, ChevronRight, LayoutDashboard, Wrench, Sparkles, 
    X, CalendarDays, Database, Recycle, Gauge, Activity, Combine, FlaskConical, 
    FileText, CheckCircle 
} from 'lucide-react';

// ===============================
// DESIGN SYSTEM & CONSTANTS
// ===============================

// Muscat Bay Brand Colors
const COLORS = {
  primary: '#4E4456',        // Main brand color - Deep purple-gray
  primaryLight: '#5f5168',   // Muted deep purple/gray from logo
  primaryDark: '#3B3241',    // Darker variant for active states
  accent: '#A8D5E3',         // Soft teal for highlights
  success: '#10B981',        // Green for positive metrics
  warning: '#BFA181',        // Muted gold for warnings
  info: '#0A1828',          // Deep classic blue for information
  error: '#EF4444',         // Red for errors
  rose: '#f43f5e',           // A rose color for consistency
  
  // Chart colors palette - Muscat Bay themed
  chart: ['#4E4456', '#A8D5E3', '#BFA181', '#0A1828', '#5f5168', '#f43f5e', '#F2F0EA', '#10B981', '#EF4444']
};

// ===============================
// FULL STP PLANT DATABASE
// ===============================

const fullRawStpDataString = `Date:	Total Treated Water Produced - m³	Total TSE Water Output to Irrigation - m³	Total Inlet Sewage Received from (MB+Tnk) -m³ 	Number of Tankers Discharged:	Expected Tanker Volume (m³) (20 m3)	Direct In line Sewage (MB)	Maintenance Action 1:	Maintenance Action 2:	Maintenance Action 3:
1/7/2024	385	340	339	10	200	139			
2/7/2024	519	458	526	14	280	246			
3/7/2024	479	425	468	13	260	208			
4/7/2024	547	489	464	11	220	244			
5/7/2024	653	574	565	15	300	265			
6/7/2024	552	492	502	14	280	222			
7/7/2024	575	498	549	13	260	289			
8/7/2024	587	515	532	16	320	212	Need to empty the tank and the problem can be identified. need to open roof top structural work also even for cleaning activity considered as confined space.		
8/7/2024	589	515	539	16	320	219			
9/7/2024	586	519	532	13	260	272	Need to empty out the tank and rooftop has to be removed for the maintainance activity.	The maintenance activity over removing the debris got stuck inside Raw sewage pump was done	
10/7/2024	542	462	493	12	240	253			
12/7/2024	533	468	506	12	240	266			
12/7/2024	654	580	578	16	320	258			
13/07/2024	464	402	479	10	200	279			
13/07/2024	464	402	479	10	200	279			
14/07/2024	506	448	486	13	260	226	"today clean  and cheaked  aeration blower   air filter  - oil level  and blower  belt     
today clean and cheaked  mbr blower      air filter  - oil level  and blower belt  "	"poured  lime powder  
poured chlorine  for cleaning mbr 
"	house keeping stp aera .
15/07/2024	482	418	391	6	120	271	"today clean and cheaked  intermediate  pump we found all three pump ok 
"	house keeping stp aera . 	
16/07/2024	670	600	576	18	360	216	used chemical   lime and  nacl 	house keeping stp aera 	
17/07/2024	344	300	506	12	240	266	"clean aeration tank with water
poured chemical
house keeping  stp aera "		
18/07/2024	585	517	369	8	160	209			
19/07/2024	687	605	614	15	300	314			
20/07/2024	536	465	483	12	240	243	"today  all three  mbr blower  clean and  cheaked 
house keeping  in stp aera .  "		
21/07/2024	504	455	501	13	260	241			
22/07/2024	549	492	480	13	260	220	 inform   our engineer  and noted  		
23/07/2024	611	535	568	16	320	248	today clean and cheaked  Aeration blower  1 - 2 - 3  		
24/07/2024	599	528	563	18	360	203	"used  lime and  sodiuam hypochloride 
cleaned mbr tank  and aeration tank with water
house keeping stp aera "		
25/07/2024	517	444	415	14	280	135	"cleaned aeration  and mbr  tank with water
poured chemical
house keeping stp aera "		
26/07/2024	650	570	584	18	360	224	we took out pump from lifting  tank  and  checked  and cleaned pump  and fixed  again . now pump running as before well .		
27/07/2024	475	414	537	10	200	337	"aeration tank  and MBR   tank  clean with water  
poured chemical 
today clean  TSE  water pump  and TSE  water aera. "		
28/07/2024	512	449	453	12	240	213	"aeration  tank and mbr  tank clean with water  
used chemical  
today checked   PTU    unit 
checked   PH   and TDS   of  raw water    and  product water 
checked  MLSS  of aeration  tank and   mbr tank water .    "		
29/07/2024	671	577	685	19	380	305	"clean  MBR  tank   and  Aeration tank  with water 
today  clean and checked  sludge holding tank blower  1- 2 
used chemical 
house keeping  of stp aera "		
30/07/2024	668	582	527	13	260	267	"Aeration  tank  and MBR  Tank    clean with  water  
poured   chemical 
house keeping     "		
31/07/2024	613	529	606	17	340	266	"aeration  tank  and mbr tank clean by water 
house keeping  stp  area
poured  chemical  "		
1/8/2024	601	528	542	15	300	242	"aeration tank and mbr tank clean by water
house keeping  of stp aera
poured chemical "		
2/8/2024	676	590	660	15	300	360	"cheaked aeration blower  and cleaned
poured chemical
house keeping "		
3/8/2024	544	474	493	13	260	233	"aeration tank  and Mbr tank clean by water 
poured chemical
house keeping  inside  stp area
checked  ph -    raw water  ,  treated water , aeration  water . "		
4/8/2024	571	497	510	13	260	250	"clean aeration tank  by water  and MBR tank also .
poured chemical 
took  meter  and flow reading
house keeping   stp aera    "		
5/8/2024	574	500	515	13	260	255	"Aeration  tank and MBR   Tank  clean by water
checked raw water and product water  ph , TDS     
MLSS   checked  Aeration   and mbr    tank water
house keeping  "		
6/8/2024	643	554	604	16	320	284	"Aeration tank  and MBR  Tank clean with  water 
checked   ph aeration water , raw water and  product  water
MLSS   checked   aeration water 
house keeping "		
7/8/2024	608	516	490	19	380	110	"today clean  and checked  MBR  pump  and  TSE  pump
Aeration   water  tank and  MBR   tank  clean with water
House keeping   stp aera
checked   MLSS ,  PH , TDS ,  of raw water , aeration water , product water and tanker water  "		
8/8/2024	610	524	642	17	340	302	"clean aeration  and mbr  tank with water
poured chemical 
house keeping stp aera
checked product  water , raw water , aeration water "		
9/8/2024	630	550	531	12	240	291	"Aeration tank  and MBR  tank clean by water
poured chemical 
checked  PH and TDS   of Raw water . aeration water , and product  water  
house keeping 
today cleaned  and checked  M B R    blower "		
10/8/2024	583	499	525	13	260	265	"checked  PH  -   TDS   Raw water  , product  water and aeration water
Checked  MLSS  Aeration  and MBR   water
cleaned aeration tank and mbr tank  with water
House keeping

 "		
11/8/2024	554	483	559	11	220	339	"aeration tank  and mbr  tank clean by water
poured chemical
house keeping
checked Ph and  TDS of raw water  and product water
checked  MLSS aeration  and MBR  tank water "		
12/8/2024	606	531	469	12	240	229	"clean aeration tank and mbr  tank with water
checked P H  and TDS  of raw water  and product  water
checked MLSS  both stream  aeration and mbr tank water
house keeping  of stp area .
poured chemical "		
13/08/2024	569	499	459	12	240	219	"aeration  tank   and  mbr tank  clean by water
checked PH , TDS of   raw water and product water
checked MLSS  of aeration tank and mbr tank water
poured chemical "		
14/08/2024	525	492	509	11	220	289	"cleaned aeration and mbr tank with water
poured chemical
checked PH and TDS  of raw water and product water 
checked MLSS  of aeration  and mbr tank water  "		
15/08/2024	579	502	541	13	260	281	"aeration and mbr tank clean by water
checked PH and  TDS  raw water  and product  water
poured chemical "		
16/08/2024	591	516	548	11	220	328	"cleaned aeration water tank and mbr tank with water
poured chemical
checked PH and TDS  raw water and product water
checked MLSS aeration tank water and mbr tank water
house keeping of stp area  "		
17/08/2024	466	414	512	14	280	232	"today transferred both  MBR sludge water to sludge holding tank  . and clean with water and chemical 

  both aeration tank  cleaned with water
poured chemical
checked MLSS of aeration tank and mbr tank
checked PH and TDS  of raw and  product water  "		
18/08/2024	591	516	478	13	260	218	"today  we  did clean and check aeration blower
Aeration tank and MBR tank cleaned by water
check PH and TDS  off raw water and product water
checked MLSS  of aeration tank water and mbr tank water
house keeping inside stp aera .   "		
19/08/2024	529	470	430	11	220	210	we changed inlet pipe . now ok 	"cleaned aeration tank and mbr tank  with water
poured chemical
checked PH and TDS  of raw water and product water
checked MLSS   of aeration and mbr tank water . "	
20/08/2024	579	495	521	13	260	261	" we did clean aeration and mbr tank with water
checked PH and TDS  of raw and product water
poured chemical
checked MLSS  of aeration and mbr tank water "		
21/08/2024	586	500	478	12	240	238	"clean aeration and mbr tank with water
poured chemical
house keeping
checked PH and TDS  of raw water
checked MLSS  of  aeration and mbr tank water  "		
22/08/2024	486	437	552	13	260	292	"today both mbr tank sludge water transferred  to sludge holding tank
RAS  chamber sludge water also transferred to sludge holding tank
clean aeration  tank and mbr tank with water
checked MLSS aeration and mbr tank water
checked  PH and TDS  of raw and product water
poured chemical  "		
23/08/2024	564	478	449	12	240	209	"aeration water tank and MBR  tank cleaned by water
poured chemical
house keeping "		
24/08/2024	581	505	461	9	180	281	"aertaion and mbr tank clean with water
poured chemical
checked PH and TDS  of raw water and product water
checked MLSS   aeration and MBR tank water   "		
25/08/2024	488	420	369	8	160	209	"aretion tank and mbr tank clean with water
checked PH and TDS  of raw water and product water
checked MLSS of aeration  and mbr water
clean and check aeration blower "		
26/08/2024	371	291	409	8	160	249	"we open filter line  header  and send to company . for repair
clean aeration and mbr tank with water .
checked PH and TDS of raw water and product water
poured chemical
checked MLSS of aeration and mbr tank water ."		
27/08/2024	453	417	391	8	160	231	"Aeration and mbr tank cleaned with water
checked PH and TDS of raw water and product water
checked MLSS of aeration and mbr tank water
poured chemical
house keeping "		
28/08/2024	642	557	535	9	180	355	"aeration and mbr tank clean with water
checked PH and TDS of raw and product water
checked MLSS  of aeration and mbr tank water
poured chemical
today clean and checked PTU screen "		
29/08/2024	413	360	368	9	180	188	"last night sludge water transfer   to sludge holding tank
and clean both mbr tank with water "		
30/08/2024	624	551	626	14	280	346	"we open pipe line and clean  all mud and clothe . now ok
clean aeration and mbr tank with water
poured chemical
checked MLSS of aeration and mbr tank
checked PH and TDS   of raw and product water  "		
31/08/2024	535	473	465	9	180	285	"aeration and mbr tank clean with water
checked  MLSS  aeration and mbr tank water
checked PH and TDS   raw and product water
poured chemical "		
1/9/2024	504	441	477	11	220	257	"today drain both mbr tank  and ras chamber sludge water to sludge holding tank
clean both mbr  with water
aeration tank clean with water
poured chemical "		
2/9/2024	355	317	370	5	100	270	"aeration and mbr tank cleaned by water
checked PH and TDS   of raw water and product  water
checked MlSS  of aeration and mbr  sludge water
aeration blower today checked  and clean ."		
3/9/2024	540	481	441	9	180	261	"aeration and mbr tank cleaned  with water
checked PH and TDS  of raw and product water
checked MLSS  of aeration and mbr tank sludge water
poured chemical
chemical cleaning of both mbr
aeration and mbr blower  today clean "		
4/9/2024	358	300	332	4	80	252	"aeration and mbr tank clean by water
poured chemical
checked PH and TDS  of raw water
checked MLSS of aeration and mbr tank water
house keeping of stp inside area "		
5/9/2024	547	483	450	6	120	330	"Aerataion  tank and  mbr tank clean by water
checked PH and  TDS  of raw and product water
checked MLSS of aeration and mbr tank sludge water   "		
6/9/2024	518	474	489	14	280	209	"aeration and mbr tank clean with water
checked PH and TDS of raw and product  water
Checked MLSS  aeration and mbr sludge water .
poured chemical  "		
7/9/2024	568	504	559	12	240	319	"aeration and mbr tank cleaned by water
checked PH and TDS  of raw and product water
checked MLSS  of  aeration and mbr tank sludge water
today cleaned and checked aeration blower "		
8/9/2024	478	422	479	9	180	299	"both MBR air supply falxible     pipe  changed  because that pipe has leackage       .
aeration and mbr tank cleaned by water
checked PH and TDS   of raw water
checked MLSS of mbr and aeration tank sludge water
house keeping "		
9/9/2024	515	459	463	9	180	283	"today MBR blower clean and checked
aeration and mbr tank cleaned by water 
checked PH and TDS of raw water
checked MLSS  of aeration and mbr tank sludge water "		
10/9/2024	453	396	422	7	140	282	"aeration and mbr tank  cleaned by water
checked PH and TDS  of Raw and product water
checked MLSS of aeration and nbr tank sludge water
house keeping of panel board room "		
11/9/2024	566	495	519	12	240	279	"aeration and mbr tank clean by water
checked PH and TDS of raw water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
12/9/2024	489	437	457	10	200	257	"cleaned aeration and mbr tank with water
checked PH and TDS of raw water and product water
checked MLSS  of aeration and mbr tank sludge water
poured chemical "		
13/09/2024	671	611	564	14	280	284	"aeration and mbr tank cleaned by water
checked PH and TDS  of raw and product water
checked MLSS of  aeration and mbr tank sludge water 
poured chemical  "		
14/09/2024	357	311	343	5	100	243	"aeration and mbr tank cleaned by water
poured chemical
checked PH and TDS  of raw water
checked MLSS of  aeration and mbr tank sludge water
cleaned floating  plastic and wood material "		
15/09/2024	354	307	348	7	140	208	"last night both MBR  and RAS   tank sludge transferred  to sludge holding tank
today aeration and mbr blower clean and checked
aeration and mbr tank clean by water
checked PH and TDS  of raw water product water 
checked MLSS of aeration and mbr tank sludge water "		
16/09/2024	412	366	443	8	160	283	"aeration and mbr tank clean by water
checked PH and TDS raw water product water 
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
17/09/2024	352	314	303	8	160	143	"aeration and mbr tank clean by water
checked PH and TDS  of raw and product water
Checked MLSS of aeration and mbr tank sludge water
house keeping "		
18/09/2024	424	371	380	8	160	220	"aeration and mbr tank clean with water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping "		
19/09/2024	441	401	378	9	180	198	"aeration and mbr tank  clean by water
Checked PH and TDS  of raw and product water
checked MLSS of  aeration and mbr tank sludge water "		
20/09/2024	581	519	511	14	280	231	"aeration and mbr tank clean by water
checked PH and TDS of raw water and product water
Checked  MLSS of aeration and mbr tank sludge water
poured chemical "		
20/09/2024	581	519	511	14	280	231	"aeration and mbr tank clean by water
checked PH and TDS of raw water and product water
Checked  MLSS of aeration and mbr tank sludge water
poured chemical "		
21/09/2024	452	391	434	9	180	254	"today both mbr tank and ras tank  sludge water  transferred  to sludge holding tank
aeration and mbr tank clean by water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge  water
poured chemical 
"		
22/09/2024	355	317	370	9	180	190	"aeration and mbr tank cleaned by water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
house keeping of inside stp 
poured chemical "		
23/09/2024	292	262	291	5	100	191	"today aeration  blower  clean and checked
aeration and  mbr  tank cleaned by water
checked PH and TDS of raw water and product  water
checked MLSS  of aeration and mbr tank sludge water
poured chemical "		
24/09/2024	555	498	462	8	160	302	"aeration and mbr tank clean by water
checked PH and TDS of raw and product  water
checked MLSS of  mbr and aeration tank sludge water
poured chemical "		
25/09/2024	364	319	390	10	200	190	"aeration and mbr tank clean by water
checked PH and TDS of raw and product water
checked MLSS of  aeration and mbr sludge water
poured chemical "		
26/09/2024	386	342	352	7	140	212	"aeration and mbr tank clean by water
checked PH and TDS  of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical  "		
27/09/2024	519	467	489	11	220	269	"aeration and mbr tank cleaned by water
checked PH and TDS of raw water  and product water
checked MLSS of  aeration and mbr tank sludge water
poured chemical "		
28/09/2024	539	469	483	8	160	323	"today MBR blower clean and checked
aeration and mbr tank cleaned by water
checked PH and TDS  of raw water and product water
checked MLSS of aeration and mbr tank sludge water
house keeping "		
29/09/2024	557	503	448	9	180	268	"aeration and mbr tank cleaned by water
checked PH and TDS of raw water and product water
checked MLSS of  both mbr and aeration tank sludge water
poured chemical "		
30/09/2024	388	350	424	6	120	304	"aeration and mbr tank clean by water
checked PH and TDS of raw and product water
checked  MLSS of aeration and Mbr  tank sludge water
last night both mbr tank sludge water transferred   to sludge holding tank .   "		
30/09/2024	388	350	424	6	120	304	"aeration and mbr tank clean by water
checked PH and TDS of raw and product water
checked  MLSS of aeration and Mbr  tank sludge water
last night both mbr tank sludge water transferred  to sludge holding tank .   "		
1/10/2024	482	417	405	5	100	305	"aeration and mbr tank cleaned by water
checked PH and TDS  of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
2/10/2024	419	361	433	8	160	273	"aeration and mbr tank clean by water
checked  PH and TDS of raw and product water
checked MLSS of  aeration and mbr tank sludge water
poured chemical  "		
3/10/2024	575	520	475	9	180	295	"aeration and mbr tank clean by water
checked PH and TDS of raw water and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
4/10/2024	602	506	547	15	300	247	"aeration and mbr tank clean by water
Checked PH and TDS  of raw and product water
checked  MLSS of aeration and mbr tank sludge water
poured chemical
Today   clean and checked  aeration blower  
"		
5/10/2024	555	515	522	8	160	362	"aeration and mbr tank clean by water
today both mbr tank and RAS tank sludge water transferred   to sludge holding tank
and clean both mbr and RAS tank by water
checked PH and TDS of raw water and product water
checked MLSS of aeration and mbr tank sludge   water
house keeping of stp aerea  . "		
6/10/2024	425	365	457	8	160	297	"aeration and mbr tank cleaned by water
checked PH and  TDS of raw water and product water
Checked MLSS of  aeration and mbr tank sludge water 
poured chemical
house keeping "		
7/10/2024	592	533	544	11	220	324	"aeration and mbr tank cleaned by water
checked PH and TDS  of raw and product  water
checked MLSS of  aeration and mbr tank sludge water
house keeping
poured chemical "		
8/10/2024	524	462	489	11	220	269	"aeration and mbr tank cleaned by water
checked PH and TDS  of raw water and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical ."		
9/10/2024	637	568	532	11	220	312	"aeration and  mbr tank cleaned by water
checked PH and TDS  of raw and product water
checked MLSS  of aeration and mbr  tank sludge water
poured chemical
houes keeping   in stp  "		
10/10/2024	559	491	494	11	220	274	"aeration and mbr tank clean with water
checked  PH and TDS  of raw water and product water
checked MLSS of aeration and mbr tank sludge water 
poured chemical
house keeping  
 "		
11/10/2024	541	438	549	12	240	309	"aeration blower today checked and cleaned
aeration and mbr blower cleaned  by water
checked PH and TDS of raw water and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
12/10/2024	526	512	511	8	160	351	"today clean and checked PTU
aeration and mbr tank cleaned by water
checked PH and TDS of raw water and product water
poured chemical
checked MLSS of aeration and mbr tank sludge water   "		
13/10/2024	405	345	332	6	120	212	"aeration and mbr tank clean by water
checked PH and TDS of raw water and product water
checked MLSS of aeration and mbr sludge water
chemical clean  to both mbr
house keeping   "		
14/10/2024	601	548	509	7	140	369	"aeration and mbr tank clean by water
checked PH and TDS of raw and  product water
checked MLSS of aeration and mbr sludge water
poured chemical 
"		
15/10/2024	569	489	581	10	200	381	we changed  valve actuator  and to another valve  those  valve we can keep idle .  and start streem 1  after two hours . and informed  our company .	"aeration and mbr tank clean by water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical "	
16/10/2024	607	538	548	8	160	388	"aeration and mbr tank clean by water 
checked PH and TDS of raw water
checked  MLSS of   aeration and mbr tank sludge water 
poured chemical 
house keeping 
"		
17/10/2024	659	575	636	11	220	416	"artation and mbr tank clean by water
checked PH and TDS  of raw water and product water
checked MLSS of aeration and mbr sludge water water
poured chemical
houes keeping "		
18/10/2024	677	597	565	10	200	365	"aeration and mbr tank clean by water
checked PH and TDS of raw water  and product water
checked MLSS of  aeration and mbr sludge water 
poured chemical
house keeping
today aeration and mbr blower  clean and checked . "		
19/10/2024	583	509	589	8	160	429	"today both mbr tank and ras  tank sludge transeffer  to sludge holding tank 
aeration and mbr tank clean by water
checked MLSS of aeration and mbr tank sludge water
checked PH and TDS of raw water and product  water
poured chemical "		
20/10/2024	614	542	537	10	200	337	"Aeration and  mbr tank clean by water
checked PH and TDS of raw and product water
checked MLSS   of aeration and mbr tank sludge  water 
poured chemical "		
21/10/2024	585	513	539	12	240	299	"aeration and mbr tank clean by water
checked PH and TDS of  raw and product water
checked  MLSS of aeration and mbr tank sludge water
poured chemical  "		
22/10/2024	606	528	525	9	180	345	"aeration and mbr tank clean by water
checked PH and TDS of raw water and product water
checked MLSS of  aeration and mbr sludge water
house keeping
poured chemical  "		
23/10/2024	614	532	592	11	220	372	"Aeration and mbr tank cleaned by water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
24/10/2024	522	442	546	11	220	326	"aeration and mbr tank clean by wate
checked PH and TDS  of raw and product water
checked MLSS of  aeration and mbr sludge water
poured chemical
today both mbr sludge water transffred   to sludge holding tank 
"		
25/10/2024	601	524	603	9	180	423	"aeration and mbr tank cleaned by water
checked PH and TDS of raw and product water
checked MLSS of  aeration and mbr tank sludge water
poured chemical "		
26/10/2024	636	557	588	12	240	348	"aeration and mbr tank clean by water
checked PH and TDS raw water and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
27/10/2024	594	487	523	6	120	403	"aeration and mbr tank clean by water
checked PH and TDS of raw  and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
Today aeration  blower clean and checked . 
"		
28/10/2024	586	535	595	9	180	415	"Aeration and  mbr tank clean by water
checked PH  and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
29/10/2024	613	535	511	7	140	371	"aeration and mbr   tank clean by water
checked PH and TDS   of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
30/10/2024	583	506	543	9	180	363	"Aeration and mbr tank clean by water
checked PH and TDS of raw water and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping "		
31/10/2024	577	500	577	7	140	437	"aeration and  mbr tank clean by water
checked PH and TDS of raw and product water
checked MLSS of aeration and MBR tank sludge water
today both mbr tank sludge water transferred  to sludge holding tank
both mbr clean and checked . "		
1/11/2024	553	476	476	5	100	376	"Aeration and mbr tank cleaned by water
checked PH and TDS  of raw and product water
checked MLSS of mbr and aeration  tank sludge water
poured chemical
house keeping  in stp "		
2/11/2024	609	513	553	8	160	393	"aeration and mbr tank cleaned by water
checked PH and TDS of raw and product water
checked MLSS of  aeration and mbr tank sludge water
poured chemical  "		
3/11/2024	494	419	498	8	160	338	"Today both MBR tank and RAS chamber tank sludge water  transferred  to sludge holding tank  
both mbr tank cleaned   and checked
aeration tank cleaned 
poured chemical
checked PH and TDS  of raw and product water
checked MLSS of aeration  and mbr tank sludge water   "		
4/11/2024	542	480	430	6	120	310	"aeration and mbr tank cleaned by water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
5/11/2024	570	489	481	9	180	301	"aeration and mbr tank cleaned by water
checked PH and TDS of   raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
6/11/2024	423	351	371	7	140	231	"today both mbr  and RAS chamber  tank sludge water  transferred   to  to sludge holding tank
both mbr cleaned  by water  and checked .
poured chemical
aeration  tank clean by water "		
7/11/2024	516	449	609	12	240	369	"aeration and mbr tank clean by water
checked TDS and PH of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
8/11/2024	621	538	516	11	220	296	"aeration and mbr tank cleaned by water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping "		
9/11/2024	581	500	517	13	260	257	"Today changed MBR pump streem 1  flange collar  with fixed new set 
aeration and mbr tank cleaned by water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr  tank sludge water
today clean and checked aeration blower ."		
10/11/2024	573	495	464	6	120	344	"Today RAS pump   no 1  valve collar changed  with new fitting   . and painted  to also .  now ok
areation and mbr tank cleaned by water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
11/11/2024	588	505	449	11	220	229	"areation and mbr tank clean by water 
cheacked PH and TDS of raw and product water 
cheack MLSS of areation and mbr tank sludge water 
poured chemical
house keeping inside stp"		
12/11/2024	567	494	466	8	160	306	"aeration and  mbr tank cleaned by water
checked PH and TDS of raw and product water
checked  MLSS of   aeration and mbr tank sludge water
poured chemical
"		
13/11/2024	578	495	546	8	160	386	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product water
cheacked MLSS of areation and mbr tank sludge water 
poured chemical "		
14/11/2024	567	484	504	9	180	324	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product water
cheacked MLSS of areation and mbr tank sludge water
proured chemical "		
15/11/2024	572	488	489	6	120	369	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
16/11/2024	559	474	520	9	180	340	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water
mbr blower ceiling "		
17/11/2024	448	363	461	5	100	361	"Mbr tank cleaning areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water
"		
18/11/2024	534	466	475	10	200	275	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
19/11/2024	567	484	479	8	160	319	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
20/11/2024	579	494	465	6	120	345	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
21/11/2024	551	461	478	6	120	358	"areation and mbr tank clean by water 
cheackd MLSS of areation and mbr tank sludge water 
Cheacked PH and TDS of raw and product  water
poured chemical
"		
22/11/2024	574	488	494	7	140	354	"areation and mbr tank clean by water 
cheacked PH and TDS of raw and product water
cheacked MLSS of areation and mbr tank sludge water
house keeping inside stp"		
23/11/2024	518	427	417	7	140	277	"areation and mbr tank clean by water 
cheacked MLSS of areation and mbr tank sludge water 
cheacked PH and TDS of raw and product water "		
24/11/2024	507	434	387	4	80	307	"areation and mbr tank clean by water
cheacked MLSS of areation and mbr tank sludge water
cheacked PH and TDS of raw and product water "		
25/11/2024	569	474	560	8	160	400	"areation and mbr tank clean by water 
cheacked MLSS of areation and mbr tank sludge water 
cheacked PH and TDS of raw and product water "		
26/11/2024	561	471	501	10	200	301	"areation and mbr tank clean by water 
cheacked MLSS of areation and mbr tank sludge water 
cheacked PH and TDS of raw and product water 
clean blowers "		
27/11/2024	539	447	524	9	180	344	"Areation and mbr tank clean by water
cheacked MLSS of areation and mbr tank sludge water 
cheacked PH and TDS of raw and product water 
poured chemical"		
28/11/2024	548	456	487	7	140	347	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
29/11/2024	560	464	403	6	120	283	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
30/11/2024	520	427	520	6	120	400	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
1/12/2024	542	447	481	5	100	381	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
2/12/2024	526	442	496	6	120	376	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
3/12/2024	539	442	462	5	100	362	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	MBR Tank Cleaning	
4/12/2024	537	449	357	5	100	257	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	MBR Blower Cleaning	
5/12/2024	551	455	595	9	180	415	"Areation and mbr tank clean by water
cheacked PH and TDS of raw and product water 
cheacked MLSS of areation and mbr tank sludge water "		
6/12/2024	484	403	437	4	80	357	"areation and mbr tank clean by water 
cheacked MLSS of areation and mbr tank sludge water 
cheacked PH and TDS of raw and product water 
clean inside STP"		
7/12/2024	550	462	456	4	80	376	"areation and mbr tank  clean by water 
cheacked MLSS of areation and mbr tank sludge water 
cheacked PH and TDS of raw and product water "		
8/12/2024	570	474	462	5	100	362	"Areation and mbr tank clean by water 
cheacked MLSS of areation and mbr tank  sludge water 
cheacked PH and TDS of raw and product water "		
9/12/2024	531	450	429	6	120	309	"Areation and mbr  tank clean by water 
cheacked MLSS of areation and mbr tank sludge water 
cheacked PH and TDS of raw and product water
poured chemical"		
10/12/2024	493	412	453	8	160	293	"Areation and mbr tank clean by water 
cheacked MLSS of areation and mbr tank slugde water 
cheacked PH and TDS of raw and product water "		
11/12/2024	586	501	496	5	100	396	"Areation and mbr tank clean  by water
cheacked PH and TDS of raw and product water
cheacked MLSS of areation and mbr tank slugde water"		
12/12/2024	554	461	441	5	100	341	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	"Cleaning of MBR tank
Sludge transfer this morning"	
13/12/2024	507	439	441	8	160	281	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
14/12/2024	585	515	506	8	160	346	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
15/12/2024	493	414	501	7	140	361	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	Today morning mbr tank cleaning or sludge transfer 	
16/12/2024	541	468	438	6	120	318	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
17/12/2024	580	476	553	9	180	373	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	areation and mbr blower  clean 	
18/12/2024	581	498	496	7	140	356	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	Today morning mbr-1 tank cleaning or sludge transfer 	
19/12/2024	560	471	542	8	160	382	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
20/12/2024	585	488	440	8	160	280	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product water 
cheacked MLSS of areation and mbr tank sludge water
poured chemical"		
21/12/2024	575	475	502	6	120	382	"Areation and mbr tank clean by water
Cheacked PH and TDS of raw and product water
Cheacked MLSS of areation and mbr tank sludge water
Clean inside stp
Poured chemical"		
22/12/2024	606	513	536	7	140	396	"Areation and mbr tank clean by water 
Cheacked PH nd TDS of raw and product water 
Cheacked MLSS of areation and mbr tank sludge water"		
23/12/2024	587	497	448	7	140	308	"Areation and mbr tank clean by water 
Cheacked PH and TDS of raw and product water
Cheacked MLSS of areation and mbr tannk sludge water
poured chemical"		
24/12/2024	542	449	526	4	80	446	"Areation and mbr tank clean by water 
Cheacked MLSS of areation and mbr tank sludge water
Cheacked PH and TDS of raw and product water 
poured chemical"		
25/12/2024	614	513	517	6	120	397	"Areation and mbr tank clean by water
Cheacked PH and TDS of raw and product water 
Cheacked MLSS of areation and mbr tank sludge water
poured chemical
Cheacked blower and cleaned"		
26/12/2024	590	495	531	8	160	371	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
27/12/2024	621	517	542	5	100	442	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
28/12/2024	611	524	541	7	140	401	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
29/12/2024	605	511	528	7	140	388	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
30/12/2024	598	509	525	7	140	385	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
31/12/2024	600	506	535	4	80	455	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
1/1/2025	601	504	493	3	60	433	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	Today morning mbr-1 tank cleaning or sludge transfer 	Today areation-mbr Blower cleaning
2/1/2025	600	491	528	3	60	468	"Areation and mbr tank clean by water
Cheacked PH and TDS of raw and product water
Cheacked MLSS of areation and mbr tank sludge water
poured chemical"		
3/1/2025	577	494	450	4	80	370	"areation and mbr tank clean by water 
cheacked  PH and TDS of raw and product water
cheacked MLSS of areation and mbr sludge water"		
4/1/2025	587	486	507	4	80	427	"Areation and mbr tank clean by water
Cheacked MLSS of areation and mbr tank sludge water
Cheacked PH and TDS of raw and product water
poured chemical"		
5/1/2025	532	445	473	4	80	393	"Areation and mbr tank clean by water
Cheacked PH and TDS of raw and product water
Cheacked MLSS of areation and mbr tank sludge water
poured chemical"		
6/1/2025	572	472	445	4	80	365	"Areation and mbr tank clean by water
Cheacked PH and TDS of raw and product water
Cheacked MLSS of areation and mbr tank sludge water
poured chemical"		
7/1/2025	610	506	549	7	140	409	"Areation and mbr tank clean by water
Cheacked PH and TDS of raw and product water 
Cheacked MLSS of areation and mbr tank sludge water
poured Chemical"		
8/1/2025	526	454	511	5	100	411	"Areation and mbr tank clean by water 
Cheacked PH and TDS of raw and product water
Cheacked MLSS of areation and mbr tank sludge water
poured chemical"		
9/1/2025	589	494	514	6	120	394	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	Today morning mbr tank cleaning or sludge transfer 	
10/1/2025	637	528	535	8	160	375	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
11/1/2025	552	459	436	3	60	376	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	Today morning mbr tank cleaning or sludge transfer 	
12/1/2025	508	419	473	6	120	353	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
13/01/2025	581	489	456	6	120	336	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
14/01/2025	594	502	513	8	160	353	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
15/01/2025	593	504	494	8	160	334	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"		
16/01/2025	521	438	509	10	200	309	"areation and mbr tank clean by water
cheacked PH and TDS of raw and product watet
cheack MLSS of areation and mbr tank sludge water"	Today morning mbr tank cleaning or sludge transfer 	
17/01/2025	595	518	502	7	140	362	"Areation and mbr tank clean by water
Cheacked MLSS of areatiom and mbr tank sludge water
Cheacked PH and TDS of raw and product water
poured chemical"		
18/01/2025	608	526	537	8	160	377	"checked   ph and tds of raw water   and product  water
cleaned and checked  both  aeration and mbr tank by water 
houes keeping of stp aera
 both mbr  cleaned by chemical  "		
19/01/2025	605	523	560	8	160	400	"checked and cleaned both aeration tank
checked and cleaned both MBR  tank
checked  PH and TDS raw  water and product  water
checked  MLSS  of  aeration and mbr tank  . "		
20/01/2025	595	503	517	8	160	357	"checked  and cleaned  aeration and mbr tank . 
Checked   PH and TDS  of Raw and Product water
checked MLSS of aeration and mbr tank sludge water
poured chemical in lifting tank
chemical cleaning  both MBR
house keeping   stp area  .  "		
21/01/2025	602	517	552	8	160	392	"Checked and clean aeration and mbr  tank
checked PH and TDS  of raw and product water
checked MLSS of aeration and mbr tank  sludge water
house keeping of stp area 
 "		
22/01/2025	576	498	482	6	120	362	"Check  and cleaned aeration and mbr tank
checked PH and TDS  of raw and product water
Checked MLSS of aeration and mbr tank sludge water
poured chemical
today aeration  blower clean and checked   
house keeping of stp area  . "		
23/01/2025	599	526	477	6	120	357	"checked and clean aeration and mbr tank .
checked  PH and TDS  of raw water and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
24/01/2025	606	499	504	7	140	364	"clean and checked  aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of   aeration and mbr tank sludge water  
checked Ph  of both aeration sludge water
chemical cleaning  of both mbr .
poured chemical "		
25/01/2025	601	523	543	8	160	383	"checked and clean aeration and mbr tank
checked PH and TDS  of raw water  and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
chemical cleaning of both mbr
operating dewatering unite "		
26/01/2025	605	516	509	8	160	349	"checked and clean aeration and mbr tank 
checked PH and TDS  of raw water and product water
Checked MLSS of aeration and mbr sludge water
poured chemical "		
27/01/2025	601	515	519	8	160	359	"checked and clean aeration and mbr tank
checked PH and TDS raw and product water
checked MLSS of  aeration and mbr sludge water
poured chemical
house keeping of stp area   "		
28/01/2025	607	519	582	11	220	362	"checked and clean aeration and mbr tank
checked PH and TDS  of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping "		
29/01/2025	615	529	521	9	180	341	"checked and clean aeration and mbr tank
checked PH and TDS of  Raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
Today mbr blower clean and checked . 
"		
30/01/2025	598	510	519	9	180	339	"checked and clean aearation and mbr  tank
checked PH and TDS of raw water and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
31/01/2025	619	526	513	7	140	373	"cleaned and checked aeration and mbr tank
checked PH and TDS raw and product water
checked   MLSS of aeration and mbr sludge water
poured chemical
House keeping of stp area "		
1/2/2025	527	456	511	8	160	351	"checked and clean aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
Today both mbr and ras  chamber    sludge  water  transferred     to  sludge holding tank
for sludge  water transferred   we close  plant 4.00 am 
and plant started  at  10.00 am  "		
2/2/2025	505	423	511	9	180	331	"clean and checked aeration and mbr tank
checked PH and TDS  of raw and product water
checked MLSS of aeration and mbr sludge water 
poured chemical 
clean and checked  PTU unite  "		
3/2/2025	584	489	496	8	160	336	"checked and clean aeration and mbr tank
checked PH and TDS  of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping  of stp area 
"		
4/2/2025	578	484	545	9	180	365	"checked and clean aeration and  mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
today mbr blower check  and cleaned  "		
5/2/2025	582	482	527	6	120	407	"checked and clean aeration and mbr tank
checked PH and TDS of raw and product  water
checked MLSS of aeration and mbr tank sludge water
poured chemical
nacl cleaning of both mbr
house keeping stp area "		
6/2/2025	588	493	482	8	160	322	"checked and clean aeration and mbr tank
checkedPH and TDS of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
7/2/2025	576	482	485	6	120	365	"checked and clean aeration  and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical
chemical cleaning both mbr  "		
8/2/2025	582	478	531	4	80	451	"RAS pump no 1  flange collar  changed  with new set  those  picture  we uploaded
checked and clean aeration and mbr tank
checked PH AND TDS  of raw  and product water
Checked MLSS of aeration   and mbr tank sludge water
poured chemical  "		
9/2/2025	586	489	521	9	180	341	"checked and clean aeration and mbr tank
checked Raw and product water  TDS and PH
checked MLSS of aeration and MBR tank sludge water
poured chemical "		
10/2/2025	594	495	514	6	120	394	"checked and clean aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping   of stp area "		
11/2/2025	589	501	546	7	140	406	"checked and clean aeration and mbr tank
checked  PH and TDS  of Raw and product  water
checked MLSS of aeration nad mbr tank sludge water
poured chemical "		
12/2/2025	614	527	528	5	100	428	"checked and clean aeration and mbr  tank
PH  and TDS checked raw and product water
MLSS checked aeration and mbr tank sludge water
poured chemical
house keeping of stp area "		
13/02/2025	620	525	503	4	80	423	"checked and clean aeration and mbr tank
PH and  TDS checked of raw and product water 
checked MLSS of aeration and mbr tank sludge water
poured chemical
"		
14/02/2025	614	527	554	4	80	474	"checked and clean aeration and  mbr tank
checked PH and TDS of raw and product water 
checked MLSS of aeration nad mbr sludge water
poured chemical
house keeping of stp area "		
15/02/2025	627	533	538	4	80	458	"checked and clean aeration and mbr tank  
checked PH and TDS of raw and product water  
checked MLSS of aeration and mbr sludge water 
poured chemical
aeration and mbr blower clean checked  "		
16/02/2025	630	539	561	5	100	461	"aeration and mbr tank checked and clean
raw and product water  checked  TDS and PH 
checked MLSS of aeration and mbr sludge  water
poured chemical
"		
17/02/2025	628	539	544	5	100	444	"aeration and mbr tank clean and checked 
checked PH and  TDS of raw and product water  
checked MLSS of aeration and mbr sludge water
poured chemical 
"		
18/02/2025	609	520	517	5	100	417	"Aeration and mbr tank  clean and checked
  checked PH and TDS   of raw and product water  
Checked MLSS of aeration nad MBR   tank sludge water
poured chemical 
"		
19/02/2025	582	489	539	4	80	459	"today  we open duct pipe line and cleaned  fixed again
Aeration and mbr tank clean and checked
checked  PH  and  TDS  of raw and product water    
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
20/02/2025	553	459	482	2	40	442	"clean and checked  aeration and mbr tank 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
21/02/2025	518	419	478	1	20	458	"clean and checked aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of  aeration and mbr sludge  water 
poured chemical "		
24/02/2025	437	361	491	0	0	491	"clean  and checked  aeration and mbr tank 
checked   PH and TDS of Raw and product water 
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
25/02/2025	247	159	334	0	0	334	"clean and checked  aeration and mbr tank
checked PH and TDS of raw and  product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
26/02/2025	272	226	342	0	0	342	"clean and checked aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
stream  1  mbr cleaning "		
27/02/2025	595	512	502	0	0	502	"checked and clean aeration and mbr tank 
checked PH and TDS of raw and product water
checked MLSS of  aeration and mbr tank sludge water
poured chemical
mc clean  both mbr "		
28/02/2025	571	468	498	2	40	458	"clean and checked aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and MBR tank sludge water
poured chemical "		
1/3/2025	583	476	487	0	0	487	"check   and cleaned aeration and mbr tank 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical  "		
2/3/2025	592	514	493	1	20	473	"clean and checked  aeration and mbr tank 
checked PH and TDS  of raw and  product water
checked MLSS of aeration and mbr tank sludge water "		
3/3/2025	598	517	497	1	20	477	"checked and clean aeration and mbr tank 
ckecked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping  "		
4/3/2025	600	516	561	5	100	461	"aeration and mbr tank  checked and clean by water
PH and TDS  checked  of raw and product water
MLSS checked  aeration and MBR  tank sludge water
chemical used
house keeping of stp aera ."		
5/3/2025	608	521	503	3	60	443	"aeration and mbr tank clean by water   and checked
PH and TDS  checked raw and product water
MLSS of aeration and mbr tank sludge  checked
used chemical 
house keeping  of stp area   "		
6/3/2025	607	530	544	6	120	424	"checked and clean aeration and mbr tank
checked PH and TDS  of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
7/3/2025	621	532	552	5	100	452	"today we open and clean  ptu debris removal  pipe  and  cleaned  and fixed . now  ptu working as before
clean and checked aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
8/3/2025	617	531	570	6	120	450	"clean and checked aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
"		
9/3/2025	607	521	468	4	80	388	"aeration and mbr tank clean  and checked
PH and TDS of raw and product water checked
checked MLSS of aeration and mbr tank sludge water
poured chemical
"		
10/3/2025	610	524	600	6	120	480	"checked  and clean aeration and mbr tank
checked Ph and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
Today clean and checked aeration and mbr blower "		
11/3/2025	607	511	536	3	60	476	"checked and clean aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
12/3/2025	601	509	511	6	120	391	"clean and checked aeration and mbr tank
checked PH and TDS of raw and product  water
checked MLSS of aeration and mbr tank sludge water
poured chemical
"		
13/03/2025	606	508	532	3	60	472	"clean and checked aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water 
poured chemical
"	from today we are taking tanker water  by screen bar  those is fixed  out side  of   lifting  tank .	
14/03/2025	609	507	519	6	120	399	"clean and checked aeration and mbr tank  
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
Today aeration blower oil changed   . "		
15/03/2025	602	504	534	2	40	494	"clean and checked aeration and mbr tank
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
16/03/2025	591	494	514	4	80	434	"Aeration and MBR tank clean and checked 
checked PH and TDS of raw and product water 
checked MLSS of aeration and mbr tank sludge water
poured chemical
changed  MBR blower oil  "		
17/03/2025	591	500	522	4	80	442	"Aeration  and MBR tank clean and checked 
checked PH and TDS of RAW  and product water
checked MLSS of aeration and MBR tank sludge water
poured chemical
"		
18/03/2025	578	480	469	5	100	369	"Aeration and MBR tank clean and checked
checked PH and TDS of raw  and product water
checked MLSS of  Aeration and MBR tank sludge water
poured chemical "		
19/03/2025	565	467	526	3	60	466	"Aeration and MBR tank clean and checked 
checked PH and TDS of raw and  product water
checked  MLSS of aeration and MBR  tank sludge water 
poured chemical
house keeping  of stp area "		
20/03/2025	610	511	504	4	80	424	"clean and checked aeration and mbr tank
checked PH and TDS of  raw and product water 
checked MLSS of aeration and mbr sludge water
poured chemical
house keeping 
"		
21/03/2025	619	519	505	4	80	425	"checked and clean aeration and  mbr tank 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical  
house  keeping  stp area  
"		
22/03/2025	616	523	535	5	100	435	"aeration and mbr tank checked and clean
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured  chemical
"		
23/03/2025	627	541	586	6	120	466	"clean and checked  aeration and mbr tank 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
Today aeration and mbr blower  clean and checked .  "		
24/03/2025	630	540	542	6	120	422	"Aeration and  MBR tank clean and checked 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
25/03/2025	613	522	588	5	100	488	"Aeration and MBR tank clean and checked
PH and TDS of Raw and Product water  checked
MLSS of aeration and MBR tank  sludge water checked
poured chemical
repaired back wash tank valve 
"		
26/03/2025	631	541	513	8	160	353	"checked aeration and mbr tank  and clean by water
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
27/03/2025	627	538	653	7	140	513	"Aeration and MBR tank clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and MBR  tank sludge water
poured chemical "		
28/03/2025	631	546	538	3	60	478	"Aeration tank  and MBR  clean and checked 
checked PH and TDS of Raw and Product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping of stp aera  "		
29/03/2025	623	534	639	4	80	559	"Aeration and MBR tank clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
 "		
30/03/2025	640	558	531	3	60	471	"Aeration tank and mbr  checked and clean
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical   "		
31/03/2025	640	558	531	3	60	471	"Aeration tank and mbr clean and checked
checked  TDS and PH of   Raw and Product  water 
checked MLSS of   aeration and mbr tank sludge water
poured chemical "		
1/4/2025	639	551	585	5	100	485	"Aeration   tank and MBR checked and clean 
checked PH and TDS  of Raw and Product water
checked MLSS of aeration and mbr tank sludge water
poured chemical 
"		
2/4/2025	650	560	595	6	120	475	"Aeration  tank and MBR filter checked and clean
checked PH and TDS of raw  and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
3/4/2025	634	556	573	5	100	473	"Aeration  Tank and mbr filter clean and checked
checked PH and TDS of Raw and product water
checked  MLSS of aeration and MBR tank   sludge water
poured chemical "		
4/4/2025	656	573	609	4	80	529	"Aeration tank and MBR filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and MBR tank sludge water
poured chemical
Today Aeration and  MBR Blower  clean and checked  "		
5/4/2025	648	569	595	5	100	495	"Aeration tank and MBR filter clean and checked
checked PH and TDS of raw and product water
MLSS checked Aeration and Mbr tank sludge water
poured chemical
house keeping of stp area  "		
6/4/2025	658	579	559	6	120	439	"Aeration  tank and MBR tank  filter clean and checked
PH and TDS checked raw and Product water
MLSS checked aeration and mbr tank sludge water
poured chemical
house keeping of stp area "		
7/4/2025	653	574	550	7	140	410	"Aeration tank and MBR filter clean and checked
PH and TDS of Raw and Product water checked
MLSS of Aeration and MBR tank sludge water  checked
Poured chemical
"		
8/4/2025	648	562	641	8	160	481	"Aeration  tank and MBR filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
9/4/2025	656	568	578	5	100	478	"Aeration tank and MBR filter checked and clean
checked TDS and PH  raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
10/4/2025	654	558	617	6	120	497	"Aeration  tank and mbr filter clean and checked
Checked PH and TDS of Raw and Product water
Checked MLSS of aeration and mbr tank sludge water 
poured chemical "		
11/4/2025	671	582	576	6	120	456	"Aeration  tank and mbr filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
12/4/2025	660	576	620	8	160	460	"Aeration tank and mbr filter checked and  clean
checked PH and TDS of Raw and product water
checked MLSS of aeration and mbr sludge  water
poured chemical  "		
13/04/2025	676	595	617	5	100	517	"Aeration Tank and MBR filter clean and checked
checked MLSS of aeration and mbr tank sludge water 
checked PH and TDS of raw and product water
poured chemical  "		
14/04/2025	673	592	601	8	160	441	"Aeration  tank and mbr filter clean and checked
PH and TDS of raw and product water checked
checked MLSS of aeration and mbr sludge water
poured chemical
Today aeration and MBR Blower  clean and checked "		
15/04/2025	641	557	561	7	140	421	"Aeration Tank and mbr filter checked and clean
checked PH and TDS  of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical  
houes keeping of stp area  "		
16/04/2025	674	590	643	8	160	483	"Aeration  tank and mbr  filter checked and clean 
Checked PH and TDS of raw water and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical 
"		
17/04/2025	665	581	564	6	120	444	"Aeration tank and mbr filter checked and clean 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
18/04/2025	660	577	589	7	140	449	"Aeration  Tank and MBR filter clean and checked
PH and  TDS  of raw and product water checked
MLSS of aeration and mbr tank sludge water  checked
Poured chemical "		
19/04/2025	660	577	589	7	140	449	Aeration and  mbr tank clean  by water  cheakef by pH  and TDS and  Raw and product water cheaked mlss of aeration and mbr tank sludge water cheak and aeration blower cleaning 		
19/04/2025	647	563	606	8	160	446	"Aeration tank  and mbr  filter clean and checked 
checked PH and TDS of raw and product water
checked MLSS of aeration and Mbr tank sludge water
poured chemical "		
20/04/2025	647	553	654	7	140	514	"Aeration  tank and  mbr filter clean and checked
checked Ph and TDS  of raw and product water
checked MLSS of aeration and mbr tank sludge water 
poured chemical "		
21/04/2025	635	524	524	6	120	404	"Aeration tank and MBR filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
"		
22/04/2025	647	565	585	3	60	525	"Today we change stream 2 permeate  line  leakage parts  with  new set .
Aeration  tank and mbr filter clean and checked
checked PH and TDS of raw and product water 
checked MLSS of  aeration and  mbr tank sludge water
poured chemical "		
23/04/2025	688	578	589	5	100	489	"Aeration  Tank and mbr filter clean and checked 
checked PH and TDS of raw and product water
checked MLSS of aeration and MBR tank sludge water
poured chemical "		
24/04/2025	695	594	606	6	120	486	"Aeration  tank and mbr filter clean and checked 
checked PH and TDS  of raw water and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical  "		
25/04/2025	712	609	598	6	120	478	"Aeration tank and mbr filter clean and checked
checked PH and TDS of Raw and product water
checked MLSS   of aeration and mbr tank sludge water
poured chemical
Today Aeration and MBR blower  clean and checked  "		
26/04/2025	706	584	638	6	120	518	"Aeration tank and mbr filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
27/04/2025	714	603	580	5	100	480	"Aeration tank and MBR filter clean and checked 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
28/04/2025	716	607	573	5	100	473	"Aeration  Tank and  mbr  filter clean and checked
checked PH and TDS of Raw and Product water
checked MLSS of aeration and mbr tank sludge water
poured chemical 
houese  keeping stp area  "		
29/04/2025	710	602	624	9	180	444	"Aeration tank and MBR filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
stream 2 mbr filter air line pipe leakage
we change air line pipe and fixed another pipe "		
30/04/2025	710	646	642	9	180	462	"Aeration tank and MBR filter clean and checked 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water 
poured chemical "		
1/5/2025	717	631	631	9	180	451	"Aeration tank and MBR filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical  "		
2/5/2025	703	626	691	11	220	471	"Aeration tank and mbr filter clean and checked 
checked PH and TDS of raw and product water 
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping   stp area   "		
3/5/2025	681	608	676	9	180	496	"Aeration tank and mbr filter clean and checked 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical
house keeping  stp area "		
4/5/2025	709	635	632	8	160	472	"Aeration  Tank and mbr filter checked and  clean 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water 
poured chemical
"		
5/5/2025	672	593	545	9	180	365	"Aeration  tank and MbR  filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
6/5/2025	657	569	594	11	220	374	"Aeration  Tank and mbr filter checked and clean
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
7/5/2025	700	627	645	10	200	445	"Aeration  Tank and  MBR  filter  clean and checked
checked PH and TDS of raw  water and product water
checked MLSS of aeration and mbr tank sludge water 
poured chemical
Today aeration and mbr Blower  clean and checked 
"		
8/5/2025	666	593	591	12	240	351	"Aeration  Tank and  mbr filter  checked and clean
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
9/5/2025	667	592	655	10	200	455	"Aeration  Tank and MBR filter clean and checked  
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical  "		
10/5/2025	705	630	663	10	200	463	"Aeration tank and MBR filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical
house keeping in side stp area "		
11/5/2025	725	646	624	8	160	464	"Aeration Tank and mbr  filter clean and checked
checked   PH and TDS of raw and product water
checked MLSS of aeration  and mbr sludge water
poured chemical "		
12/5/2025	623	645	669	9	180	489			
13/05/2025	674	592	646	9	180	466	"Today we open PTU debris    pipe line  and cleaned   and fixed    again . now  ok its work as before 
Aeration and mbr tank clean and checked
checked PH and TDS of Raw and product water 
checked MLSS of aeration and mbr tank sludge water
poured chemical  "		
14/05/2025	720	647	687	11	220	467	"Aeration  tank and mbr filter checked and clean
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical  "		
15/05/2025	708	626	632	10	200	432	"Aeration  tank and  mbr filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
16/05/2025	725	646	659	9	180	479	"Aeration Tank and  mbr filter  clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
17/05/2025	720	642	690	8	160	530	"Aeration  tank and  mbr filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
18/05/2025	722	585	657	10	200	457	"Aeration  tank and  mbr filter clean and checked
checked PH and TDS of raw and product water 
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
19/05/2025	722	579	603	10	200	403	"Aeration  tank and mbr filter clean and checked  
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical 
Today  aeration and mbr Blower ckean and checked "		
20/05/2025	722	605	641	8	160	481	"Aeration Tank and Mbr filter  clean and checked 
checked PH and TDS of raw and product water 
checked MLSS of aeration and mbt tank sludge water
poured chemical "		
21/05/2025	722	620	644	8	160	484	"Aeration Tank and mbr filter clean and checked
checked PH and TDS of Raw and Product water
checked MLSS of aeration and mbr tank sludge water
poured chemical 
 house keeping in side of stp area  . "		
22/05/2025	728	589	606	7	140	466	"Aeration  tank and  mbr filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
23/05/2025	725	581	601	5	100	501	"Aeration Tank and  mbr filter clean and checked
checked PH and TDS of Raw and Product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
24/05/2025	721	584	576	4	80	496	"Aeration  tank and mbr  filter  clean and checked  
checked PH and TDS of raw and Product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
25/05/2025	749	653	640	4	80	560	"Aeration  tank and mbr tank clean and checked
checked PH and TDS of raw and product water
checked MLSS of  aeration  and mbr tank sludge water
poured chemical "		
26/05/2025	748	606	591	5	100	491	"Aeration  tank and mbr filter checked and clean 
checked PH and TDS of raw and product water
checked MLSS of  aeration and mbr tank sludge water
poured chemical "		
27/05/2025	750	613	613	7	140	473	"Aeration tank  and mbr filter  clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical 
"		
28/05/2025	745	602	602	8	160	442	"Aeration tank and MBR filter checked and clean
checked PH and TDS of raw and Product water
checked MLSS of aeration and MBR tank sludge   water
poured chemical 
"		
29/05/2025	749	604	638	8	160	478	"Aeration tank and mbr  filter clean and checked 
checked PH and TDS of Raw and Product water
checked MLSS of  Aeration and mbr tank sludge water
poured chemical "		
30/05/2025	750	609	563	7	140	423	" Aeration Tank and MBR filter checked and clean
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr  tank sludge water
poured chemical
house keeping of stp area "		
31/05/2025	746	607	567	8	160	407	"Aeration tank and mbr  filter checked and clean
checked PH and TDS of Raw and Product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
1/6/2025	701	610	576	10	200	376	"Aeration tank and MBR filter clean  and checked  
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
2/6/2025	650	524	544	11	220	324	" Aeration and mbr tank clean and checked
checked PH and TDS of Raw  and product water 
checked MLSS of aeration and mbr sludge water 
poured chemical "		
3/6/2025	646	560	598	11	220	378	"Aeration tank and mbr filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical 
Today fine screen checked and clean "		
4/6/2025	626	564	603	11	220	383	"Aeration tank  and mbr filter  clean and checked 
checked PH and TDS of raw and product water
checked MLSS of  Aeration and mbr tank sludge water 
poured chemical "		
5/6/2025	662	591	595	12	240	355	"Aeration tank and mbr filter checked and clean 
checked PH and TDS of raw and product water 
 checked MLSS of aeration and mbr  sludge water
poured chemical  "		
6/6/2025	626	603	648	10	200	448	"Aeration tank and mbr filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
7/6/2025	639	573	593	9	180	413	"Aeration  tank and mbr filter checked and clean by water 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr sludge water
poured chemical "		
8/6/2025	658	585	583	11	220	363	"Aeration tank and mbr filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
9/6/2025	628	564	596	11	220	376	"Aeration tank and mbr filter clean and checked
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "		
10/6/2025	569	508	548	10	200	348	"Aeration tank and mbr filter checked and clean 
checked PH and TDS of raw and product water
checked MLSS of aeration and mbr tank sludge water
poured chemical "`;

/**
 * Parses the raw tab-separated STP data string into a structured array of objects.
 * - Handles different date formats (D/M/YYYY, DD/MM/YYYY).
 * - Cleans and combines maintenance action columns.
 * - Removes duplicate entries by keeping the last record for each date.
 * - Calculates additional metrics for analysis.
 * @param {string} rawData The raw string data from the database.
 * @returns {Array<Object>} An array of processed data objects.
 */
const parseStpData = (rawData) => {
  const lines = rawData.split('\n');
  const dataLines = lines.slice(1);
  const dataMap = new Map();

  dataLines.forEach((line) => {
    const values = line.split('\t');
    if (values.length < 7) return; // Skip malformed lines

    const dateStr = values[0]?.trim();
    if (!dateStr) return; // Skip lines without a date

    let parsedDate = null;
    const dateParts = dateStr.split('/');
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        parsedDate = new Date(year, month - 1, day);
      }
    }
    
    if (!parsedDate) return; // Skip if date is invalid

    // Combine all maintenance actions into a single clean string
    const maintenanceNotes = [values[7], values[8], values[9]]
      .filter(note => note && note.trim() !== '')
      .map(note => note.trim().replace(/"/g, '').replace(/\s+/g, ' '))
      .join('\n• ');
    
    const record = {
      date: parsedDate.toLocaleDateString('en-GB'), // Format as DD/MM/YYYY
      parsedDate: parsedDate,
      month: parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      treatedWater: parseFloat(values[1]) || 0,
      tseOutput: parseFloat(values[2]) || 0,
      totalInlet: parseFloat(values[3]) || 0,
      tankersDischarge: parseInt(values[4]) || 0,
      expectedTankerVolume: parseFloat(values[5]) || 0,
      directSewage: parseFloat(values[6]) || 0,
      maintenanceActions: maintenanceNotes ? `• ${maintenanceNotes}` : 'No specific maintenance actions logged.',
    };

    // Calculated fields
    record.treatmentEfficiency = record.totalInlet > 0 ? (record.treatedWater / record.totalInlet) * 100 : 0;
    record.irrigationEfficiency = record.treatedWater > 0 ? (record.tseOutput / record.treatedWater) * 100 : 0;
    record.tankerPercentage = record.totalInlet > 0 ? (record.expectedTankerVolume / record.totalInlet) * 100 : 0;

    // Use a normalized date key to handle duplicates, keeping the last entry
    const normalizedDateKey = parsedDate.toLocaleDateString('en-CA'); // YY-MM-DD format for keys
    dataMap.set(normalizedDateKey, record);
  });

  // Convert map back to an array and sort by date
  const finalData = Array.from(dataMap.values());
  finalData.sort((a, b) => a.parsedDate - b.parsedDate);

  // Add a unique ID to each record
  return finalData.map((item, index) => ({...item, id: index + 1}));
};

const initialStpData = parseStpData(fullRawStpDataString);

// Plant design specifications
const PLANT_DESIGN_CAPACITY = 750; // m³/day

// ===============================
// SHARED COMPONENTS
// ===============================

const SummaryCard = ({ title, value, icon, unit, trend, trendColor, iconBgColor, isLoading }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-100">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-slate-500 font-semibold text-md">{title}</h3>
        <div className={`p-3 rounded-full text-white shadow-md`} style={{backgroundColor: iconBgColor || COLORS.primary }}>
          <IconComponent size={22} />
        </div>
      </div>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      ) : (
        <>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1.5">
            {value} <span className="text-base font-medium text-slate-500">{unit}</span>
          </p>
          {trend && <p className={`text-xs sm:text-sm font-medium ${trendColor}`}>{trend}</p>}
        </>
      )}
    </div>
  );
};

const ChartWrapper = ({ title, children, subtitle, actions }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
    <div className="mt-4" style={{ height: '350px' }}>
      {children}
    </div>
  </div>
);

const StyledSelect = ({ label, value, onChange, options, id, icon: Icon, disabled }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <div className="relative">
                <select 
                  id={id} 
                  value={value} 
                  onChange={onChange} 
                  disabled={disabled}
                  className="appearance-none w-full p-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:outline-none bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                  style={{ '--tw-ring-color': COLORS.primaryLight, borderColor: 'rgb(203 213 225 / 1)', ringColor: COLORS.primaryLight }} 
                >
                    {options.map(option => ( <option key={option.value} value={option.value}>{option.label}</option> ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    {Icon ? <Icon size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>
        </div>
    );
};


// ===============================
// ENHANCED STP PLANT MODULE
// ===============================

export const STPPlantModule = () => {
  const [activeSubSection, setActiveSubSection] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMaintenanceDay, setSelectedMaintenanceDay] = useState(null);

  // Extract available months from the data
  const availableMonths = useMemo(() => {
    const monthsSet = new Set(initialStpData.map(item => item.month));
    return Array.from(monthsSet).sort((a, b) => new Date(a) - new Date(b));
  }, []);

  // Data processing for selected month
  const filteredStpData = useMemo(() => {
    if (selectedMonth === 'All Months') {
      return initialStpData;
    }
    return initialStpData.filter(item => item.month === selectedMonth);
  }, [selectedMonth]);
  
  // Reset selected day when month changes
  React.useEffect(() => {
      setSelectedMaintenanceDay(null);
  }, [selectedMonth]);


  // Monthly summary data for all months
  const monthlyData = useMemo(() => {
    const monthlyMap = {};
    
    initialStpData.forEach(item => {
      if (!item.parsedDate) return;
      const monthKey = item.month;
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: monthKey,
          treatedWater: 0,
          tseOutput: 0,
          totalInlet: 0,
          tankersDischarge: 0,
          directSewage: 0,
          days: 0
        };
      }
      
      monthlyMap[monthKey].treatedWater += item.treatedWater;
      monthlyMap[monthKey].tseOutput += item.tseOutput;
      monthlyMap[monthKey].totalInlet += item.totalInlet;
      monthlyMap[monthKey].tankersDischarge += item.tankersDischarge;
      monthlyMap[monthKey].directSewage += item.directSewage;
      monthlyMap[monthKey].days++;
    });
    
    return Object.values(monthlyMap).map(month => ({
      ...month,
      avgDaily: Math.round(month.treatedWater / month.days),
      efficiency: month.totalInlet > 0 ? Math.round((month.treatedWater / month.totalInlet) * 1000) / 10 : 0,
      irrigationEff: month.treatedWater > 0 ? Math.round((month.tseOutput / month.treatedWater) * 1000) / 10 : 0,
      capacityUtilization: month.days > 0 ? Math.round((month.treatedWater / month.days / PLANT_DESIGN_CAPACITY) * 1000) / 10 : 0
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
  }, []);

  // KPI Calculations
  const kpiData = useMemo(() => {
    const data = filteredStpData;
    const totalDays = data.length;
    
    if (totalDays === 0) {
      return {
        avgTreatedWater: 0, avgTseOutput: 0, avgEfficiency: 0, totalTankersDischarge: 0,
        avgTankerPercentage: 0, capacityUtilization: 0, totalDays: 0, totalTreatedWater: 0,
        totalTseOutput: 0, totalInputProcess: 0, avgTotalInput: 0
      };
    }

    const totalTreatedWater = data.reduce((acc, curr) => acc + curr.treatedWater, 0);
    const totalTseOutput = data.reduce((acc, curr) => acc + curr.tseOutput, 0);
    const totalInputProcess = data.reduce((acc, curr) => acc + curr.totalInlet, 0);
    const totalExpectedTankerVolume = data.reduce((acc, curr) => acc + curr.expectedTankerVolume, 0);

    const avgTreatedWater = totalTreatedWater / totalDays;
    const avgTseOutput = totalTseOutput / totalDays;
    const avgTotalInput = totalInputProcess / totalDays;
    const avgEfficiency = totalInputProcess > 0 ? (totalTreatedWater / totalInputProcess) * 100 : 0;
    const totalTankersDischarge = data.reduce((acc, curr) => acc + curr.tankersDischarge, 0);
    const avgTankerPercentage = totalInputProcess > 0 ? (totalExpectedTankerVolume / totalInputProcess) * 100 : 0;
    const capacityUtilization = (avgTreatedWater / PLANT_DESIGN_CAPACITY) * 100;

    return {
      avgTreatedWater: Math.round(avgTreatedWater),
      avgTseOutput: Math.round(avgTseOutput),
      avgEfficiency: Math.round(avgEfficiency * 10) / 10,
      totalTankersDischarge,
      avgTankerPercentage: Math.round(avgTankerPercentage * 10) / 10,
      capacityUtilization: Math.round(capacityUtilization * 10) / 10,
      totalDays,
      totalTreatedWater: Math.round(totalTreatedWater),
      totalTseOutput: Math.round(totalTseOutput),
      totalInputProcess: Math.round(totalInputProcess),
      avgTotalInput: Math.round(avgTotalInput)
    };
  }, [filteredStpData]);

  // Recent trend data
  const trendData = useMemo(() => {
    const dataSlice = filteredStpData.length > 30 ? filteredStpData.slice(-30) : filteredStpData;
    return dataSlice.map(item => ({
      date: item.date ? item.date.substring(0, 5) : 'N/A', // Show DD/MM
      treated: item.treatedWater || 0,
      tse: item.tseOutput || 0,
      inlet: item.totalInlet || 0,
      efficiency: Math.round((item.treatmentEfficiency || 0) * 10) / 10,
      tankers: item.tankersDischarge || 0
    }));
  }, [filteredStpData]);

  // Process efficiency breakdown
  const processEfficiencyData = useMemo(() => {
    if (kpiData.totalDays === 0) return [];
    
    const avgIrrigationEff = kpiData.totalTreatedWater > 0 ? (kpiData.totalTseOutput / kpiData.totalTreatedWater) * 100 : 0;

    return [
      { name: 'Treatment Efficiency', value: kpiData.avgEfficiency, color: COLORS.success },
      { name: 'TSE Recovery', value: Math.round(avgIrrigationEff * 10) / 10, color: COLORS.info },
      { name: 'Tanker Input Ratio', value: kpiData.avgTankerPercentage, color: COLORS.warning },
      { name: 'Direct Sewage Ratio', value: Math.round((100 - kpiData.avgTankerPercentage) * 10) / 10, color: COLORS.accent }
    ];
  }, [kpiData]);

  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiAnalysisResult("");
    
    setTimeout(() => {
        const monthText = selectedMonth === 'All Months' ? 'the entire dataset' : `the month of ${selectedMonth}`;
        const performanceStatus = kpiData.capacityUtilization > 95 ? 'CRITICAL CAPACITY' :
                                  kpiData.capacityUtilization > 85 ? 'NEAR CAPACITY' :
                                  kpiData.capacityUtilization > 70 ? 'HIGH UTILIZATION' :
                                  kpiData.capacityUtilization > 50 ? 'MODERATE UTILIZATION' : 'LOW UTILIZATION';

        // Dynamic analysis of maintenance and performance
        let maintenanceSummary = 'No critical maintenance events (repairs, changes) were found in the log for this period.';
        if (filteredStpData.length > 0) {
            const criticalMaintenance = filteredStpData
                .filter(d => /repair|changed|leak|open|fixed|problem|issue/i.test(d.maintenanceActions) && !/check|clean/i.test(d.maintenanceActions))
                .map(d => `On ${d.date}: ${d.maintenanceActions.split('\n')[0].replace('• ','')}`);

            if (criticalMaintenance.length > 0) {
                maintenanceSummary = `Key interventions noted:\n• ` + criticalMaintenance.slice(0, 4).join('\n• ');
            }
        }
        
        let performanceSummary = 'Data not available for performance highs/lows.';
        if (filteredStpData.length > 1) {
            const maxProdDay = filteredStpData.reduce((max, day) => day.treatedWater > max.treatedWater ? day : max, filteredStpData[0]);
            const minProdDay = filteredStpData.reduce((min, day) => day.treatedWater < min.treatedWater ? day : min, filteredStpData[0]);
            performanceSummary = `Peak Production: ${maxProdDay.treatedWater} m³ on ${maxProdDay.date}\n• Lowest Production: ${minProdDay.treatedWater} m³ on ${minProdDay.date}`;
        }
      
      const analysisText = `🔬 AI Analysis for STP Plant (${selectedMonth}):

📊 PERFORMANCE SUMMARY:
• Period Analyzed: ${monthText} (${kpiData.totalDays} days)
• Total Water Treated: ${kpiData.totalTreatedWater.toLocaleString()} m³
• Avg. Daily Production: ${kpiData.avgTreatedWater} m³/day
• Capacity Utilization: ${kpiData.capacityUtilization}% (${performanceStatus})
• Overall Treatment Efficiency: ${kpiData.avgEfficiency}%

🎯 OPERATIONAL HIGHLIGHTS:
• ${performanceSummary}
• Tanker Operations: ${kpiData.totalTankersDischarge} total tankers, accounting for ~${kpiData.avgTankerPercentage}% of inlet volume.

🔧 MAINTENANCE INSIGHTS:
• ${maintenanceSummary}
• Routine tasks like tank cleaning, chemical dosing, and system checks appear to be consistently logged.

💡 STRATEGIC RECOMMENDATIONS:
• CAPACITY: With utilization at ${kpiData.capacityUtilization}%, the plant is operating ${performanceStatus.toLowerCase()}. ${kpiData.capacityUtilization > 85 ? 'Expansion or efficiency optimization should be a priority.' : kpiData.capacityUtilization < 50 ? 'There is significant spare capacity for future development.' : 'Operations are in a healthy, sustainable range.'}
• EFFICIENCY: A treatment efficiency of ${kpiData.avgEfficiency}% is ${kpiData.avgEfficiency >= 90 ? 'excellent. Maintain current protocols.' : kpiData.avgEfficiency >= 80 ? 'good, but monitor for any downward trends.' : 'an area for review. Investigate potential process bottlenecks or equipment performance.'}
• INPUTS: The reliance on tankers is ${kpiData.avgTankerPercentage > 50 ? 'high. Long-term strategies could explore expanding direct sewage lines to improve operational stability.' : 'moderate to low, which is efficient.'}`;
      
      setAiAnalysisResult(analysisText);
      setIsAiLoading(false);
    }, 2500);
  };

  // Sub-navigation for STP module
  const StpSubNav = () => {
    const subSections = [
        { name: 'Dashboard', id: 'Dashboard', icon: LayoutDashboard },
        { name: 'Maintenance Log', id: 'Maintenance', icon: Wrench },
    ];
    
    return (
        <div className="mb-6 print:hidden flex justify-center">
            <div className="bg-white shadow-md rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
                {subSections.map((tab) => {
                    const isActive = activeSubSection === tab.id;
                    return ( 
                      <button 
                        key={tab.id} 
                        onClick={() => setActiveSubSection(tab.id)} 
                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105`} 
                        style={{ backgroundColor: isActive ? COLORS.primary : 'transparent', color: isActive ? 'white' : COLORS.primaryDark, }} 
                      > 
                        <tab.icon size={18} /> 
                        <span>{tab.name}</span> 
                      </button> 
                    );
                })}
            </div>
        </div>
    );
  };

  // Filter Bar
  const FilterBar = () => {
    const monthOptions = [
      { value: 'All Months', label: 'All Months' },
      ...availableMonths.map(m => ({ value: m, label: m }))
    ];
    
    return (
        <div className="bg-white shadow p-4 rounded-lg mb-6 print:hidden sticky top-0 z-10 border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <StyledSelect 
                  id="monthFilter" 
                  label="Select Period" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)} 
                  options={monthOptions} 
                  icon={CalendarDays}
                />
                <div className="lg:col-span-1"></div>
                <button 
                  onClick={handleAiAnalysis}
                  className="text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 h-[46px] w-full bg-opacity-80 hover:bg-opacity-100" 
                  style={{ backgroundColor: COLORS.primary }} 
                  disabled={isAiLoading}
                > 
                  <Sparkles size={16}/> 
                  <span>{isAiLoading ? 'Analyzing...' : '🧠 AI Analysis'}</span> 
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6 bg-slate-50 p-4 md:p-8">
      <StpSubNav />
      
      {(activeSubSection === 'Dashboard' || activeSubSection === 'Maintenance') && <FilterBar />}
      
      {activeSubSection === 'Dashboard' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total Treated Water" : `${selectedMonth} Total`} 
              value={kpiData.totalTreatedWater.toLocaleString()} 
              unit="m³" 
              icon={Droplet} 
              trend={`${kpiData.avgTreatedWater} m³/day avg`} 
              trendColor="text-slate-500" 
              iconBgColor={COLORS.info}
              isLoading={isLoading}
            />
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total Input Process" : `${selectedMonth} Input`} 
              value={kpiData.totalInputProcess.toLocaleString()} 
              unit="m³" 
              icon={Activity} 
              trend={`${kpiData.avgTotalInput} m³/day avg`} 
              trendColor="text-slate-600" 
              iconBgColor={COLORS.accent}
              isLoading={isLoading}
            />
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total TSE Production" : `${selectedMonth} TSE`} 
              value={kpiData.totalTseOutput.toLocaleString()} 
              unit="m³" 
              icon={Recycle} 
              trend={`${kpiData.avgTseOutput} m³/day avg`} 
              trendColor="text-green-600" 
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
            <SummaryCard 
              title="Capacity Utilization" 
              value={kpiData.capacityUtilization} 
              unit="%" 
              icon={Gauge} 
              trend={`${Math.max(0, PLANT_DESIGN_CAPACITY - kpiData.avgTreatedWater)} m³/day spare`} 
              trendColor="text-slate-600" 
              iconBgColor={COLORS.primary}
              isLoading={isLoading}
            />
            <SummaryCard 
              title={selectedMonth === 'All Months' ? "Total Tankers" : `${selectedMonth} Tankers`} 
              value={kpiData.totalTankersDischarge} 
              unit="units" 
              icon={Database} 
              trend={`${kpiData.avgTankerPercentage.toFixed(1)}% of input`} 
              trendColor="text-slate-600" 
              iconBgColor={COLORS.warning}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartWrapper title="Daily Performance Trend" subtitle={`Last 30 days of ${selectedMonth}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'white', borderRadius: '8px', borderColor: '#e2e8f0'}} 
                      itemStyle={{color: '#334155'}} 
                      labelStyle={{color: '#0f172a', fontWeight: 'bold'}}
                    />
                    <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
                    <Bar yAxisId="left" dataKey="treated" fill={COLORS.chart[0]} name="Treated Water (m³)" />
                    <Bar yAxisId="left" dataKey="tse" fill={COLORS.chart[1]} name="TSE Output (m³)" />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={COLORS.success} strokeWidth={3} name="Efficiency %" />
                    <Line yAxisId="left" type="monotone" dataKey={() => PLANT_DESIGN_CAPACITY} stroke={COLORS.error} strokeWidth={2} strokeDasharray="5 5" name="Design Capacity" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            <ChartWrapper title="Performance Ratios" subtitle={`${selectedMonth} breakdown`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processEfficiencyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    cornerRadius={3}
                  >
                    {processEfficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label 
                      value={`${Math.round(processEfficiencyData[0]?.value || 0)}%`} 
                      position="centerBottom" 
                      dy={-5} 
                      className="text-xl font-bold fill-slate-700"
                    />
                    <Label value="Avg Efficiency" position="centerTop" dy={10} className="text-xs fill-slate-500" />
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`}/>
                  <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: '15px', fontSize: '11px'}}/>
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Monthly Summary */}
          <ChartWrapper title="Monthly Performance Overview" subtitle="Production, efficiency and capacity trends">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'white', borderRadius: '8px', borderColor: '#e2e8f0'}} 
                  itemStyle={{color: '#334155'}} 
                  labelStyle={{color: '#0f172a', fontWeight: 'bold'}}
                  formatter={(value, name) => [`${value.toFixed(1)} ${name.includes('%') ? '%' : 'm³/day'}`, name.replace(' %', '')]}
                />
                <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
                <Bar yAxisId="left" dataKey="avgDaily" fill={COLORS.chart[0]} name="Avg Daily" />
                <Line yAxisId="right" type="monotone" dataKey="capacityUtilization" stroke={COLORS.warning} strokeWidth={3} name="Capacity %" />
                <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={COLORS.success} strokeWidth={3} name="Efficiency %" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </>
      )}
      
      {activeSubSection === 'Maintenance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h3 className="text-xl font-semibold text-slate-700 mb-6">Daily Maintenance Log - {selectedMonth}</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Maintenance List */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {filteredStpData.length > 0 ? filteredStpData.map((day) => (
                  <div 
                    key={day.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedMaintenanceDay?.id === day.id 
                        ? 'border-blue-400 bg-blue-50 shadow-md' 
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                    onClick={() => setSelectedMaintenanceDay(day)}
                  >
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-semibold text-slate-800">{day.date}</h4>
                        <div className={`flex items-center text-xs px-2 py-0.5 rounded-full ${/repair|changed|leak|fixed/i.test(day.maintenanceActions) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {/repair|changed|leak|fixed/i.test(day.maintenanceActions) ? <Wrench size={12} className="mr-1"/> : <CheckCircle size={12} className="mr-1"/>}
                            {/repair|changed|leak|fixed/i.test(day.maintenanceActions) ? 'Intervention' : 'Routine'}
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {day.maintenanceActions.replace(/•/g, '').trim()}
                    </p>
                  </div>
                )) : (
                     <div className="text-center py-12">
                        <Database size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">No data available for {selectedMonth}</p>
                     </div>
                )}
              </div>

              {/* Detailed Maintenance View */}
              <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 min-h-[300px]">
                {selectedMaintenanceDay ? (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 text-lg">
                      Maintenance Details - {selectedMaintenanceDay.date}
                    </h4>
                    <div className="space-y-2 mb-4 bg-white p-4 rounded-md max-h-[25vh] overflow-y-auto">
                        {selectedMaintenanceDay.maintenanceActions.split('\n').map((action, idx) => (
                            <p key={idx} className="text-sm text-slate-700">{action}</p>
                        ))}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                      <h5 className="font-medium text-slate-700 mb-2">Operational Snapshot</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className="text-slate-500">Treated Water</p><p className="font-medium text-slate-800">{selectedMaintenanceDay.treatedWater} m³</p></div>
                        <div><p className="text-slate-500">TSE Output</p><p className="font-medium text-slate-800">{selectedMaintenanceDay.tseOutput} m³</p></div>
                        <div><p className="text-slate-500">Total Inlet</p><p className="font-medium text-slate-800">{selectedMaintenanceDay.totalInlet} m³</p></div>
                        <div><p className="text-slate-500">Efficiency</p><p className="font-medium text-slate-800">{selectedMaintenanceDay.treatmentEfficiency.toFixed(1)}%</p></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center justify-center h-full">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">Select a date from the list</p>
                    <p className="text-sm text-slate-400">Detailed maintenance actions will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> 
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"> 
            <div className="flex justify-between items-center mb-4"> 
              <h3 className="text-xl font-semibold" style={{color: COLORS.primary}}>🧠 AI STP Plant Analysis</h3> 
              <button onClick={() => setIsAiModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200"><X size={20} className="text-slate-600"/></button> 
            </div> 
            {isAiLoading ? ( 
              <div className="text-center py-8"> 
                <div className="flex justify-center items-center space-x-3 mb-4">
                  <Combine size={48} className="animate-pulse" style={{color: COLORS.primaryLight}} /> 
                  <FlaskConical size={48} className="animate-bounce" style={{color: COLORS.accent}} />
                </div>
                <p className="mt-2 text-slate-600">AI is analyzing plant performance data...</p> 
                <p className="text-sm text-slate-500 mt-1">Evaluating flow, efficiency, and maintenance logs...</p>
              </div> 
            ) : ( 
              <div className="text-sm text-slate-700 space-y-3 whitespace-pre-wrap font-mono"> 
                {aiAnalysisResult.split('\n\n').map((paragraph, pIndex) => (
                    <div key={pIndex}>
                        {paragraph.split('\n').map((line, lIndex) => {
                            if (line.startsWith('📊') || line.startsWith('🎯') || line.startsWith('🔧') || line.startsWith('💡')) {
                                return <h4 key={lIndex} className="font-bold text-base mt-3 mb-1" style={{color: COLORS.primary}}>{line}</h4>;
                            }
                            return <p key={lIndex} className="ml-1 text-slate-700 leading-relaxed">{line}</p>;
                        })}
                    </div>
                ))}
              </div> 
            )} 
            <div className="mt-6 text-right"> 
              <button onClick={() => setIsAiModalOpen(false)} className="text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: COLORS.primary }}>Close Analysis</button> 
            </div> 
          </div> 
        </div>
      )}
    </div>
  );
};

export default STPPlantModule;
