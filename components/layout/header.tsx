"use client"

import { useState } from "react"
import { Search, Bell, ChevronDown, Download, Settings, Moon, Sun, Wifi, WifiOff, User } from "lucide-react"

interface HeaderProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
  isCollapsed: boolean
}

export function Header({ isDarkMode, toggleDarkMode, isCollapsed }: HeaderProps) {
  const [connectionStatus, setConnectionStatus] = useState("online")

  return (
    <div className="bg-white shadow-sm p-3 md:p-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-20 print:hidden border-b border-slate-200">
      <div className="mb-3 md:mb-0">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Operations Dashboard</h1>
        <div className="flex items-center space-x-4">
          <p className="text-xs md:text-sm text-slate-500">Muscat Bay Utilities & Services Overview</p>
          <div className="flex items-center space-x-1">
            {connectionStatus === "online" ? (
              <>
                <Wifi size={14} className="text-green-500" />
                <span className="text-xs text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff size={14} className="text-red-500" />
                <span className="text-xs text-red-600">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-5">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search systems..."
            className="modern-input pl-10 pr-4 py-2 w-full sm:w-48 md:w-64 lg:w-72 text-sm"
          />
        </div>

        {/* Action Buttons */}
        <button
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors group hidden sm:block"
          title="Export Data"
        >
          <Download size={20} className="text-slate-600 group-hover:text-slate-800" />
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors group hidden md:block"
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun size={20} className="text-slate-600 group-hover:text-slate-800" />
          ) : (
            <Moon size={20} className="text-slate-600 group-hover:text-slate-800" />
          )}
        </button>

        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors group hidden lg:block" title="Settings">
          <Settings size={20} className="text-slate-600 group-hover:text-slate-800" />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-slate-100 relative transition-colors group" title="Notifications">
          <Bell size={20} className="text-slate-600 group-hover:text-slate-800" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
            <User size={18} />
          </div>
          <div className="hidden md:block">
            <span className="text-sm text-slate-700 font-semibold block">Muscat Bay Admin</span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
          <ChevronDown
            size={16}
            className="text-slate-500 group-hover:text-slate-800 transition-colors hidden md:block"
          />
        </div>
      </div>
    </div>
  )
}
