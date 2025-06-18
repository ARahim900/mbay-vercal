"use client"

import { useState, useMemo, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { 
  DollarSign, 
  Building, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Filter, 
  LayoutDashboard,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Calculator,
  FileText,
  Home,
  Sparkles,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { SummaryCard } from "@/components/ui/summary-card"
import { ChartWrapper } from "@/components/ui/chart-wrapper"
import { StyledSelect } from "@/components/ui/styled-select"
import { COLORS } from "@/lib/constants"

interface ReserveFundModuleProps {
  isDarkMode?: boolean
}

// Raw data from your component
const rawData = `
3CC Sector,Commercial,Development Land,56569,931.94,10828.27,20760.21,-
1,Z1 B01FM,Staff Accomm,Staff Accommodation,N/A,N/A,N/A,N/A,(4) Area Missing
Z1 B02FM,Staff Accomm,Staff Accommodation,N/A,N/A,N/A,N/A,(4) Area Missing
Z1 B03FM,Staff Accomm,Staff Accommodation,N/A,N/A,N/A,N/A,(4) Area Missing
Z1 B04FM,Staff Accomm,Staff Accommodation,N/A,N/A,N/A,N/A,(4) Area Missing
Z1 B05FM,Staff Accomm,Staff Accommodation,N/A,N/A,N/A,N/A,(4) Area Missing
Z1 B06FM,Staff Accomm,Staff Accommodation,N/A,N/A,N/A,N/A,(4) Area Missing
Z1 B07FM,Staff Accomm,Staff Accommodation,N/A,N/A,N/A,N/A,(4) Area Missing
Z1 B08FM,Staff Accomm,Staff Accommodation,N/A,N/A,N/A,N/A,(4) Area Missing
Z1 CIFFM,Staff Accomm,Staff Accommodation,N/A,N/A,N/A,N/A,(4) Area Missing
Z3 001,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 002,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 003,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 004,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 005,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 006,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 007,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 008,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,(2) Area Assumed
Z3 009,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 010,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 011,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 012,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 013,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 014,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 015,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 016,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 017,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 018,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 019,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 020,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 021,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 022,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 023,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 024,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 025,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 026,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 027,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 028,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 029,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 030,Zaha,Villa,3 Bed Zaha Villa,357.12,156.78,683.7,840.48,-
Z3 031,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 032,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 033,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 034,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 035,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 036,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 037,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 038,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 039,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 040,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 041,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 042,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 043,Zaha,Villa,4 Bed Zaha Villa,422.24,185.36,808.37,993.73,-
Z3 044(1),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 044(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 044(3),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 044(4),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 044(5),Zaha,Apartment,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 044(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 045(1),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 045(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 045(3),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 045(4),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 045(5),Zaha,Apartment,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 045(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 046(1),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 046(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 046(3),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 046(4),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 046(5),Zaha,Apartment,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 046(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 047(1),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 047(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 047(3),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 047(4),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 047(5),Zaha,Apartment,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 047(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 048(1),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 048(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 048(3),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 048(4),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 048(5),Zaha,Apartment,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 048(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 049(1),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 049(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 049(3),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 049(4),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 049(5),Zaha,Apartment,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 049(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 050(1),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 050(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 050(3),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 050(4),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 050(5),Zaha,Apartment,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 050(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 051(1),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 051(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 051(3),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 051(4),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 051(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 051(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 052(1),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 052(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 052(3),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 052(4),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 052(5),Zaha,Apartment,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 052(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 053(1A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 053(1B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 053(2A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 053(2B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 053(3A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 053(3B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 053(4A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 053(4B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 053(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 053(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 054(1A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 054(1B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 054(2A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 054(2B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 054(3A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 054(3B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 054(4A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 054(4B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 054(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 054(6),Zaha,Villa,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 055(1A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 055(1B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 055(2A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 055(2B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 055(3A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 055(3B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 055(4A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 055(4B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 055(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 055(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 056(1A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 056(1B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 056(2A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 056(2B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 056(3A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 056(3B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 056(4A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 056(4B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 056(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 056(6),Zaha,Villa,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 057(1A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 057(1B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 057(2A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 057(2B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 057(3A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 057(3B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 057(4A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 057(4B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 057(5),Zaha,Apartment,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 057(6),Zaha,Apartment,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 058(1A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 058(1B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 058(2A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 058(2B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 058(3A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 058(3B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 058(4A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 058(4B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 058(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 058(6),Zaha,Villa,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 059(1A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 059(1B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 059(2A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 059(2B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 059(3A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 059(3B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 059(4A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 059(4B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 059(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 059(6),Zaha,Villa,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 060(1A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 060(1B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 060(2A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 060(2B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 060(3A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 060(3B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 060(4A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 060(4B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 060(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 060(6),Zaha,Villa,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 061(1A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 061(1B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 061(2A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 061(2B),Zaha,Apartment,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 061(3A),Zaha,Apartment,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 061(3B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 061(4A),Zaha,Villa,2 Bed Small Apt,115.47,50.69,221.06,271.75,-
Z3 061(4B),Zaha,Villa,1 Bed Apt,79.09,34.72,151.42,186.14,-
Z3 061(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 061(6),Zaha,Villa,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 062(1),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 062(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 062(3),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 062(4),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 062(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 062(6),Zaha,Villa,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 074(1),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 074(2),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 074(3),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 074(4),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 074(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 074(6),Zaha,Villa,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z3 075(1),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 075(2),Zaha,Apartment,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 075(3),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 075(4),Zaha,Villa,2 Bed Premium Apt,199.13,87.42,381.23,468.65,-
Z3 075(5),Zaha,Villa,3 Bed Zaha Apt,355.07,155.88,679.77,835.65,-
Z3 075(6),Zaha,Villa,3 Bed Zaha Apt,361.42,158.66,691.94,850.6,-
Z5 001,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 002,Nameer,Villa,3 Bed Nameer Villa,426.78,468.6,817.06,1285.66,-
Z5 003,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 004,Nameer,Villa,3 Bed Nameer Villa,426.78,468.6,817.06,1285.66,-
Z5 005,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 006,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 007,Nameer,Villa,3 Bed Nameer Villa,426.78,468.6,817.06,1285.66,-
Z5 008,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 009,Nameer,Villa,3 Bed Nameer Villa,426.78,468.6,817.06,1285.66,-
Z5 010,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 011,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 012,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 013,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 014,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 015,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 016,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 017,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 018,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 019,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 020,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 021,Nameer,Villa,3 Bed Nameer Villa,426.78,468.6,817.06,1285.66,-
Z5 022,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 023,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 024,Nameer,Villa,3 Bed Nameer Villa,426.78,468.6,817.06,1285.66,-
Z5 025,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 026,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 027,Nameer,Villa,3 Bed Nameer Villa,426.78,468.6,817.06,1285.66,-
Z5 028,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 029,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 030,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 031,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 032,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z5 033,Nameer,Villa,4 Bed Nameer Villa,497.62,546.39,952.68,1499.07,-
Z8 001,Wajd,Villa,5 Bed Wajd Villa,750.35,246.87,1436.53,1683.4,-
Z8 002,Wajd,Villa,5 Bed Wajd Villa,750.35,246.87,1436.53,1683.4,-
Z8 003,Wajd,Villa,5 Bed Wajd Villa,750.35,246.87,1436.53,1683.4,-
Z8 004,Wajd,Villa,5 Bed Wajd Villa,750.35,246.87,1436.53,1683.4,-
Z8 005,Wajd,Villa,5 Bed Wajd Villa,943,310.25,1805.23,2115.48,-
Z8 006,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 007,Wajd,Villa,5 Bed Wajd Villa,750.35,246.87,1436.53,1683.4,-
Z8 008,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 009,Wajd,Villa,5 Bed Wajd Villa,1187.47,390.68,2273.47,2664.15,-
Z8 010,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 011,Wajd,Villa,5 Bed Wajd Villa,750.35,246.87,1436.53,1683.4,-
Z8 012,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 013,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 014,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 015,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 016,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 017,Wajd,Villa,5 Bed Wajd Villa,750.35,246.87,1436.53,1683.4,-
Z8 018,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 019,Wajd,Villa,5 Bed Wajd Villa,750.35,246.87,1436.53,1683.4,-
Z8 020,Wajd,Villa,5 Bed Wajd Villa,760.4,250.17,1455.81,1705.98,-
Z8 021,Wajd,Villa,5 Bed Wajd Villa,750.35,246.87,1436.53,1683.4,-
Z8 022,Wajd,Villa,King Villa,1844.67,606.89,3531.65,4138.54,-
`;

export function ReserveFundModule({ isDarkMode = false }: ReserveFundModuleProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSubSection, setActiveSubSection] = useState("Overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    sector: "All Sectors",
    type: "All Types",
    unitType: "All Unit Types"
  })
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' })
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Parse data function
  const parseData = (raw: string) => {
    return raw.trim().split('\n').map((line, index) => {
      const parts = line.split(',')
      let unitNo, sector, type, unitType, bua, zoneContrib, masterContrib, totalContrib, notes

      if (parts.length > 8) {
        unitNo = parts[0]
        sector = parts[1]
        type = parts[2]
        unitType = parts.slice(3, parts.length - 5).join(',')
        bua = parts[parts.length - 5]
        zoneContrib = parts[parts.length - 4]
        masterContrib = parts[parts.length - 3]
        totalContrib = parts[parts.length - 2]
        notes = parts[parts.length - 1]
      } else if (parts.length === 8) {
        [unitNo, sector, type, unitType, bua, zoneContrib, masterContrib, totalContrib] = parts
        notes = "-"
      } else {
        [unitNo, sector, type, unitType, bua, zoneContrib, masterContrib, totalContrib, notes] = parts
      }

      if (line.startsWith('3CC Sector')) {
        [unitNo, type, unitType, bua, zoneContrib, masterContrib, totalContrib, notes] = line.split(',')
        sector = 'Commercial'
      }

      return {
        id: index,
        unitNo: unitNo?.trim() || 'N/A',
        sector: sector?.trim() || 'N/A',
        type: type?.trim() || 'N/A',
        unitType: unitType?.trim() || 'N/A',
        bua: parseFloat(bua?.trim() || '0') || 0,
        zoneContrib: parseFloat(zoneContrib?.trim() || '0') || 0,
        masterContrib: parseFloat(masterContrib?.trim() || '0') || 0,
        totalContrib: parseFloat(totalContrib?.trim() || '0') || 0,
        notes: notes?.trim().replace(/-/g, '') || '',
        hasIssues: notes?.includes('Missing') || notes?.includes('Assumed') || false,
        contributionRate: parseFloat(bua?.trim() || '0') > 0 ? (parseFloat(totalContrib?.trim() || '0') / parseFloat(bua?.trim() || '1')) : 0
      }
    })
  }

  const dataset = useMemo(() => parseData(rawData), [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Get unique values for filters
  const getUniqueValues = (column: string) => {
    return [...new Set(dataset.map(item => item[column as keyof typeof item]))].sort().filter(val => val && val !== 'N/A')
  }

  // Format number helper
  const formatNumber = (value: number) => {
    return isNaN(value) ? 'N/A' : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = dataset.filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )

      const matchesFilters = Object.keys(filters).every(key => {
        const filterKey = key as keyof typeof filters
        const filterValue = filters[filterKey]
        if (filterValue.startsWith('All ')) return true
        
        if (key === 'sector') return item.sector === filterValue
        if (key === 'type') return item.type === filterValue
        if (key === 'unitType') return item.unitType === filterValue
        return true
      })
      
      return matchesSearch && matchesFilters
    })

    // Sorting logic
    if (sortConfig.column) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.column as keyof typeof a]
        const valB = b[sortConfig.column as keyof typeof b]

        const numA = parseFloat(String(valA).replace(/,/g, ''))
        const numB = parseFloat(String(valB).replace(/,/g, ''))

        let comparison = 0
        if (!isNaN(numA) && !isNaN(numB)) {
          comparison = numA > numB ? 1 : -1
        } else {
          comparison = String(valA).localeCompare(String(valB))
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }, [dataset, searchTerm, filters, sortConfig])

  // Calculate statistics
  const statistics = useMemo(() => {
    const validUnits = filteredData.filter(unit => unit.totalContrib > 0)
    const totalContrib = filteredData.reduce((sum, unit) => sum + unit.totalContrib, 0)
    const totalZoneContrib = filteredData.reduce((sum, unit) => sum + unit.zoneContrib, 0)
    const totalMasterContrib = filteredData.reduce((sum, unit) => sum + unit.masterContrib, 0)
    const totalBUA = filteredData.reduce((sum, unit) => sum + unit.bua, 0)
    const unitsWithIssues = filteredData.filter(unit => unit.hasIssues).length
    const rates = validUnits.map(unit => unit.contributionRate).filter(rate => rate > 0)

    return {
      totalUnits: filteredData.length,
      validUnits: validUnits.length,
      totalContrib,
      totalZoneContrib,
      totalMasterContrib,
      totalBUA,
      unitsWithIssues,
      avgContribPerSqm: totalBUA > 0 ? totalContrib / totalBUA : 0,
      avgContribPerUnit: validUnits.length > 0 ? totalContrib / validUnits.length : 0,
      minContribRate: rates.length > 0 ? Math.min(...rates) : 0,
      maxContribRate: rates.length > 0 ? Math.max(...rates) : 0
    }
  }, [filteredData])

  // Chart data
  const chartData = useMemo(() => {
    const sectorBreakdown = Object.entries(
      filteredData.reduce((acc, unit) => {
        if (!acc[unit.sector]) {
          acc[unit.sector] = { totalContrib: 0, units: 0, totalBUA: 0 }
        }
        acc[unit.sector].totalContrib += unit.totalContrib
        acc[unit.sector].units += 1
        acc[unit.sector].totalBUA += unit.bua
        return acc
      }, {} as Record<string, { totalContrib: number; units: number; totalBUA: number }>)
    ).map(([sector, data]) => ({
      sector,
      ...data,
      avgContrib: data.units > 0 ? data.totalContrib / data.units : 0
    }))

    const typeBreakdown = Object.entries(
      filteredData.reduce((acc, unit) => {
        if (!acc[unit.type]) {
          acc[unit.type] = { totalContrib: 0, units: 0 }
        }
        acc[unit.type].totalContrib += unit.totalContrib
        acc[unit.type].units += 1
        return acc
      }, {} as Record<string, { totalContrib: number; units: number }>)
    ).map(([type, data]) => ({
      type,
      ...data,
      percentage: statistics.totalContrib > 0 ? (data.totalContrib / statistics.totalContrib) * 100 : 0
    }))

    return { sectorBreakdown, typeBreakdown }
  }, [filteredData, statistics.totalContrib])

  // Data quality assessment
  const dataQuality = useMemo(() => {
    return {
      missingBUA: dataset.filter(unit => unit.bua === 0).length,
      missingContributions: dataset.filter(unit => unit.totalContrib === 0).length,
      inconsistentData: dataset.filter(unit => unit.hasIssues).length,
      invalidRates: dataset.filter(unit => unit.contributionRate < 0 || unit.contributionRate > 100).length
    }
  }, [dataset])

  // Top contributors
  const topContributors = useMemo(() => {
    return filteredData
      .filter(unit => unit.totalContrib > 0)
      .sort((a, b) => b.totalContrib - a.totalContrib)
      .slice(0, 10)
  }, [filteredData])

  // Handle sorting
  const handleSort = (column: string) => {
    setSortConfig(prevConfig => ({
      column,
      direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Handle filter change
  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }))
  }

  // AI Analysis Handler
  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true)
    setIsAiLoading(true)
    setAiAnalysisResult("")
    
    setTimeout(() => {
      const validUnits = filteredData.filter(unit => unit.totalContrib > 0)
      const totalContributions = statistics.totalContrib
      const avgRate = statistics.avgContribPerSqm
      const issueUnits = filteredData.filter(unit => unit.hasIssues)
      
      setAiAnalysisResult(`🏦 AI Reserve Fund Analysis Results:

📊 PORTFOLIO OVERVIEW:
• Total Units Analyzed: ${statistics.totalUnits} units
• Contributing Units: ${statistics.validUnits} units (${((statistics.validUnits/statistics.totalUnits)*100).toFixed(1)}%)
• Units with Issues: ${statistics.unitsWithIssues} units requiring attention
• Total Reserve Fund: ${totalContributions.toLocaleString(undefined, {maximumFractionDigits: 0})} OMR annually
• Average Contribution Rate: ${avgRate.toFixed(2)} OMR per m²

🎯 SECTOR PERFORMANCE:
${chartData.sectorBreakdown.slice(0, 3).map(sector => 
  `• ${sector.sector}: ${sector.totalContrib.toLocaleString()} OMR (${sector.units} units, avg: ${sector.avgContrib.toFixed(0)} OMR/unit)`
).join('\n')}

💡 KEY INSIGHTS:
• ${statistics.totalBUA.toLocaleString()} m² total built-up area generating reserves
• Contribution variance from ${statistics.minContribRate.toFixed(2)} to ${statistics.maxContribRate.toFixed(2)} OMR/m²
• Zone contributions: ${statistics.totalZoneContrib.toLocaleString()} OMR (${((statistics.totalZoneContrib/totalContributions)*100).toFixed(1)}%)
• Master contributions: ${statistics.totalMasterContrib.toLocaleString()} OMR (${((statistics.totalMasterContrib/totalContributions)*100).toFixed(1)}%)

⚠️ DATA QUALITY ASSESSMENT:
• Missing BUA data: ${dataQuality.missingBUA} units
• Missing contributions: ${dataQuality.missingContributions} units
• Data inconsistencies: ${dataQuality.inconsistentData} units
• Invalid rates detected: ${dataQuality.invalidRates} units

🔍 STRATEGIC RECOMMENDATIONS:
• ${issueUnits.length > 0 ? `URGENT: Resolve ${issueUnits.length} units with missing/assumed data` : 'GOOD: All units have complete data'}
• ${statistics.avgContribPerSqm < 2 ? 'REVIEW: Low average contribution rate may indicate undervaluation' : 'HEALTHY: Contribution rates are within expected ranges'}
• DIVERSIFICATION: ${chartData.sectorBreakdown.length} sectors contributing to fund stability
• COMPLIANCE: ${((statistics.validUnits/statistics.totalUnits)*100).toFixed(1)}% completion rate ${statistics.validUnits/statistics.totalUnits > 0.9 ? 'exceeds' : 'below'} 90% target

💰 FINANCIAL HEALTH:
• Annual reserve accumulation supporting long-term maintenance
• Well-distributed contribution base across ${chartData.typeBreakdown.length} property types
• ${statistics.totalUnits > 100 ? 'ROBUST' : 'MODERATE'} portfolio size for sustainable fund management`)
      setIsAiLoading(false)
    }, 2500)
  }

  // Sort header component
  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <th 
      scope="col" 
      className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 relative transition-colors duration-200"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center justify-between">
        {children}
        {sortConfig.column === column ? (
          sortConfig.direction === 'asc' ? 
            <ArrowUp size={16} style={{ color: COLORS.primary }} /> : 
            <ArrowDown size={16} style={{ color: COLORS.primary }} />
        ) : (
          <ArrowUpDown size={16} className="text-slate-400" />
        )}
      </div>
    </th>
  )

  // Sub-navigation
  const ReserveFundSubNav = () => {
    const subSections = [
      { name: "Overview", id: "Overview", icon: LayoutDashboard },
      { name: "Detailed Table", id: "DetailedTable", icon: FileText },
      { name: "Property Analysis", id: "PropertyAnalysis", icon: Home },
      { name: "Data Quality", id: "DataQuality", icon: CheckCircle },
    ]

    return (
      <div className="mb-6 print:hidden flex justify-center">
        <div className="bg-white shadow-md rounded-full p-1.5 inline-flex space-x-1 border border-slate-200">
          {subSections.map((tab) => {
            const isActive = activeSubSection === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubSection(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                  isActive ? "text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
                style={{ backgroundColor: isActive ? COLORS.primary : "transparent" }}
              >
                <tab.icon size={18} style={{ color: isActive ? "white" : COLORS.primary }} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Filter Bar
  const FilterBar = () => {
    const filterOptions = {
      sectors: ["All Sectors", ...getUniqueValues('sector')],
      types: ["All Types", ...getUniqueValues('type')],
      unitTypes: ["All Unit Types", ...getUniqueValues('unitType')]
    }

    return (
      <div className="card-base p-4 mb-6 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label htmlFor="searchInput" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                id="searchInput" 
                placeholder="Search by unit no, type..." 
                className="muscat-input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filters */}
          <StyledSelect
            id="sectorFilter"
            label="Sector"
            value={filters.sector}
            onChange={(e) => handleFilterChange('sector', e.target.value)}
            options={filterOptions.sectors}
            icon={Building}
          />
          <StyledSelect
            id="typeFilter"
            label="Type"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            options={filterOptions.types}
            icon={Home}
          />
          
          <button
            onClick={() => {
              setFilters({ sector: "All Sectors", type: "All Types", unitType: "All Unit Types" })
              setSearchTerm("")
            }}
            className="muscat-button-secondary flex items-center justify-center space-x-2 h-[46px] w-full"
          >
            <Filter size={16} />
            <span>Reset</span>
          </button>
          
          <button
            onClick={handleAiAnalysis}
            className="muscat-button-primary flex items-center justify-center space-x-2 h-[46px] w-full"
            disabled={isAiLoading}
          >
            <Sparkles size={16} />
            <span>{isAiLoading ? 'Analyzing...' : '🧠 AI Analysis'}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Reserve Fund Muscat Bay</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Schedule of Contributions for the year 2025</p>
      </div>

      <ReserveFundSubNav />
      <FilterBar />

      {activeSubSection === "Overview" && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Total Reserve Fund"
              value={statistics.totalContrib.toLocaleString(undefined, {maximumFractionDigits: 0})}
              unit="OMR"
              icon={DollarSign}
              trend={`${statistics.validUnits} contributing units`}
              trendColor="text-green-600"
              iconBgColor={COLORS.success}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Contributing Units"
              value={statistics.validUnits}
              unit="units"
              icon={Building}
              trend={`${((statistics.validUnits/statistics.totalUnits)*100).toFixed(1)}% of total`}
              trendColor="text-blue-600"
              iconBgColor={COLORS.info}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Average Rate"
              value={statistics.avgContribPerSqm.toFixed(2)}
              unit="OMR/m²"
              icon={Calculator}
              trend={`Range: ${statistics.minContribRate.toFixed(2)} - ${statistics.maxContribRate.toFixed(2)}`}
              trendColor="text-purple-600"
              iconBgColor={COLORS.accent}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Data Quality"
              value={`${(((statistics.totalUnits - statistics.unitsWithIssues)/statistics.totalUnits)*100).toFixed(1)}`}
              unit="%"
              icon={statistics.unitsWithIssues === 0 ? CheckCircle : AlertCircle}
              trend={statistics.unitsWithIssues === 0 ? "Complete data" : `${statistics.unitsWithIssues} issues`}
              trendColor={statistics.unitsWithIssues === 0 ? "text-green-600" : "text-orange-600"}
              iconBgColor={statistics.unitsWithIssues === 0 ? COLORS.success : COLORS.warning}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper title="Contributions by Sector" subtitle="Reserve fund distribution by sector">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.sectorBreakdown}
                    dataKey="totalContrib"
                    nameKey="sector"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.sectorBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} OMR`, "Contribution"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Property Type Distribution" subtitle="Units and contributions by property type">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.typeBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="units" fill={COLORS.primary} name="Unit Count" />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Top Contributors Table */}
          <ChartWrapper title="Top Contributing Units" subtitle="Highest reserve fund contributors">
            <div className="muscat-table-responsive">
              <table className="muscat-table">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Rank</th>
                    <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Unit No</th>
                    <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Sector</th>
                    <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                    <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">BUA (m²)</th>
                    <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Total Contribution (OMR)</th>
                    <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Rate (OMR/m²)</th>
                  </tr>
                </thead>
                <tbody>
                  {topContributors.map((unit, index) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="p-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                          index < 3 ? 'bg-yellow-500' : 'bg-slate-400'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{unit.unitNo}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{unit.sector}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{unit.type}</td>
                      <td className="p-3 text-right font-semibold text-slate-800 dark:text-slate-200">{unit.bua.toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold text-slate-800 dark:text-slate-200">{unit.totalContrib.toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold text-slate-800 dark:text-slate-200">{unit.contributionRate.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartWrapper>
        </>
      )}

      {activeSubSection === "DetailedTable" && (
        <ChartWrapper title="Complete Reserve Fund Schedule" subtitle="Detailed contributions table with search and sorting">
          <div className="muscat-table-responsive">
            <table className="muscat-table">
              <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700">
                <tr>
                  <SortableHeader column="unitNo">Unit No</SortableHeader>
                  <SortableHeader column="sector">Sector</SortableHeader>
                  <SortableHeader column="type">Type</SortableHeader>
                  <SortableHeader column="unitType">Unit Type</SortableHeader>
                  <SortableHeader column="bua">BUA (sqm)</SortableHeader>
                  <SortableHeader column="zoneContrib">Zone Contrib. (OMR)</SortableHeader>
                  <SortableHeader column="masterContrib">Master Contrib. (OMR)</SortableHeader>
                  <SortableHeader column="totalContrib">Total 2025 Contrib. (OMR)</SortableHeader>
                  <th scope="col" className="px-6 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 px-6">
                      <div className="flex flex-col items-center">
                        <Search className="h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No results found</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your search and filter combination did not match any records. Try adjusting your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map(item => (
                    <tr key={item.id} className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.unitNo}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.sector}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.type}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.unitType}</td>
                      <td className="px-6 py-4 text-right text-slate-800 dark:text-slate-200">{formatNumber(item.bua)}</td>
                      <td className="px-6 py-4 text-right text-slate-800 dark:text-slate-200">{formatNumber(item.zoneContrib)}</td>
                      <td className="px-6 py-4 text-right text-slate-800 dark:text-slate-200">{formatNumber(item.masterContrib)}</td>
                      <td className="px-6 py-4 text-right font-semibold" style={{ color: COLORS.info }}>{formatNumber(item.totalContrib)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate" title={item.notes}>
                        {item.notes || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredData.length > 0 && (
                <tfoot className="bg-slate-100 dark:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200">
                  <tr className="border-t-2 border-slate-300 dark:border-slate-600">
                    <td colSpan={4} className="px-6 py-4 text-right font-bold text-lg">Totals</td>
                    <td className="px-6 py-4 text-right">{formatNumber(statistics.totalBUA)}</td>
                    <td className="px-6 py-4 text-right">{formatNumber(statistics.totalZoneContrib)}</td>
                    <td className="px-6 py-4 text-right">{formatNumber(statistics.totalMasterContrib)}</td>
                    <td className="px-6 py-4 text-right font-bold" style={{ color: COLORS.info }}>{formatNumber(statistics.totalContrib)}</td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </ChartWrapper>
      )}

      {activeSubSection === "PropertyAnalysis" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper title="Sector Performance" subtitle="Contribution efficiency by sector">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.sectorBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === "avgContrib") return [`${Number(value).toLocaleString()} OMR`, "Avg Contribution per Unit"]
                    return [`${Number(value).toLocaleString()}`, name]
                  }} />
                  <Bar dataKey="avgContrib" fill={COLORS.warning} name="Avg Contribution per Unit" />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Built-Up Area Distribution" subtitle="Total area by sector">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.sectorBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} m²`, "Total BUA"]} />
                  <Area type="monotone" dataKey="totalBUA" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Property Details Table */}
          <ChartWrapper title="Property Portfolio Analysis" subtitle="Detailed breakdown by unit type">
            <div className="muscat-table-responsive">
              <table className="muscat-table">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Property Type</th>
                    <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Unit Count</th>
                    <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Total Contribution (OMR)</th>
                    <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Percentage of Fund</th>
                    <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Avg per Unit (OMR)</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.typeBreakdown.map((type, index) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{type.type}</td>
                      <td className="p-3 text-right font-semibold text-slate-800 dark:text-slate-200">{type.units}</td>
                      <td className="p-3 text-right font-semibold text-slate-800 dark:text-slate-200">{type.totalContrib.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{type.percentage.toFixed(1)}%</span>
                      </td>
                      <td className="p-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                        {type.units > 0 ? (type.totalContrib / type.units).toFixed(0) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartWrapper>
        </div>
      )}

      {activeSubSection === "DataQuality" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Missing BUA Data"
              value={dataQuality.missingBUA}
              unit="units"
              icon={AlertCircle}
              trend={dataQuality.missingBUA === 0 ? "Complete" : "Needs attention"}
              trendColor={dataQuality.missingBUA === 0 ? "text-green-600" : "text-red-600"}
              iconBgColor={dataQuality.missingBUA === 0 ? COLORS.success : COLORS.error}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Missing Contributions"
              value={dataQuality.missingContributions}
              unit="units"
              icon={DollarSign}
              trend={dataQuality.missingContributions === 0 ? "Complete" : "Needs attention"}
              trendColor={dataQuality.missingContributions === 0 ? "text-green-600" : "text-red-600"}
              iconBgColor={dataQuality.missingContributions === 0 ? COLORS.success : COLORS.error}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Data Inconsistencies"
              value={dataQuality.inconsistentData}
              unit="units"
              icon={AlertCircle}
              trend={dataQuality.inconsistentData === 0 ? "Consistent" : "Review needed"}
              trendColor={dataQuality.inconsistentData === 0 ? "text-green-600" : "text-orange-600"}
              iconBgColor={dataQuality.inconsistentData === 0 ? COLORS.success : COLORS.warning}
              isLoading={isLoading}
            />
            <SummaryCard
              title="Invalid Rates"
              value={dataQuality.invalidRates}
              unit="units"
              icon={Calculator}
              trend={dataQuality.invalidRates === 0 ? "Valid" : "Check rates"}
              trendColor={dataQuality.invalidRates === 0 ? "text-green-600" : "text-orange-600"}
              iconBgColor={dataQuality.invalidRates === 0 ? COLORS.success : COLORS.warning}
              isLoading={isLoading}
            />
          </div>

          {/* Units with Issues */}
          {statistics.unitsWithIssues > 0 && (
            <ChartWrapper title="Units Requiring Attention" subtitle="Properties with missing or assumed data">
              <div className="muscat-table-responsive">
                <table className="muscat-table">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Unit No</th>
                      <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Sector</th>
                      <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                      <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">BUA (m²)</th>
                      <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Contribution (OMR)</th>
                      <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData
                      .filter(unit => unit.hasIssues)
                      .slice(0, 20)
                      .map((unit, index) => (
                        <tr key={index} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                          <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{unit.unitNo}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{unit.sector}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{unit.type}</td>
                          <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                            {unit.bua === 0 ? <span className="text-red-600">Missing</span> : unit.bua.toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                            {unit.totalContrib === 0 ? <span className="text-red-600">Missing</span> : unit.totalContrib.toLocaleString()}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={unit.notes}>
                            {unit.notes || "No notes"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </ChartWrapper>
          )}
        </div>
      )}

      {/* AI Analysis Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">🧠 AI Reserve Fund Analysis</h3>
              <button onClick={() => setIsAiModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                <AlertCircle size={20} className="text-slate-600 dark:text-slate-400"/>
              </button>
            </div>
            {isAiLoading ? (
              <div className="text-center py-8">
                <div className="flex justify-center items-center space-x-3 mb-4">
                  <DollarSign size={48} className="animate-pulse" style={{color: COLORS.primary}} />
                  <Building size={48} className="animate-bounce" style={{color: COLORS.accent}} />
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-400">AI is analyzing reserve fund data...</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Evaluating contributions, patterns, and data quality</p>
              </div>
            ) : (
              <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-wrap font-mono">
                {aiAnalysisResult ? (
                  aiAnalysisResult.split('\n').map((line, index) => {
                    if (line.startsWith('📊') || line.startsWith('🎯') || line.startsWith('💡') || line.startsWith('⚠️') || line.startsWith('🔍') || line.startsWith('💰')) {
                      return <h4 key={index} className="font-bold text-lg mt-4 mb-2" style={{color: COLORS.primary}}>{line}</h4>
                    }
                    if (line.startsWith('•')) {
                      return <p key={index} className="ml-4 text-slate-700 dark:text-slate-300">{line}</p>
                    }
                    return <p key={index} className="text-slate-700 dark:text-slate-300">{line}</p>
                  })
                ) : (
                  <p>No analysis available or an error occurred.</p>
                )}
              </div>
            )}
            <div className="mt-6 text-right">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="muscat-button-primary"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
