'use client';

import React from 'react';
import '@/styles/glassmorphism.css';
import '@/styles/animations.css';

export default function GlassmorphismShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#A8D5E3] to-[#5f5168] rounded-full opacity-20 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#BFA181] to-[#5f5168] rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent mb-4">
            Muscat Bay Operations
          </h1>
          <p className="text-xl text-gray-600">
            Modern Glassmorphism Design System
          </p>
        </div>

        {/* Glassmorphism Components Gallery */}
        <div className="glass-card p-8 animate-scale-in">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent">
            UI Components Gallery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Component Examples */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-3">Glass Buttons</h3>
              <div className="space-y-3">
                <button className="glass-button glass-button-primary w-full">
                  Primary Action
                </button>
                <button className="glass-button glass-button-secondary w-full">
                  Secondary Action
                </button>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-3">Glass Dropdowns</h3>
              <select className="glass-dropdown w-full">
                <option>Select Month</option>
                <option>January 2025</option>
                <option>February 2025</option>
                <option>March 2025</option>
              </select>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-3">Loading States</h3>
              <div className="space-y-3">
                <div className="glass-skeleton h-8 w-full" />
                <div className="glass-skeleton h-8 w-3/4" />
                <div className="glass-skeleton h-8 w-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Real-time Analytics',
              value: '99.9%',
              subtitle: 'System Uptime',
              color: '#10B981'
            },
            {
              title: 'Water Distribution',
              value: '46,039',
              subtitle: 'Cubic Meters',
              color: '#3B82F6'
            },
            {
              title: 'Energy Efficiency',
              value: '94.2%',
              subtitle: 'Optimization Rate',
              color: '#F59E0B'
            },
            {
              title: 'Active Monitoring',
              value: '247',
              subtitle: 'Connected Devices',
              color: '#8B5CF6'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="glass-card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-sm font-semibold text-gray-600 mb-2">{item.title}</h3>
              <p 
                className="text-3xl font-bold mb-1"
                style={{ color: item.color }}
              >
                {item.value}
              </p>
              <p className="text-sm text-gray-500">{item.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Interactive Demo */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent">
            Interactive Elements
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hover Effects</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Primary', 'Success', 'Warning', 'Info'].map((type, index) => (
                  <div 
                    key={type}
                    className="glass-card p-4 text-center glass-hover cursor-pointer"
                  >
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${
                          ['#5f5168', '#10B981', '#F59E0B', '#3B82F6'][index]
                        }40, ${
                          ['#5f5168', '#10B981', '#F59E0B', '#3B82F6'][index]
                        }20)`
                      }}
                    />
                    <p className="text-sm font-medium">{type}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Form Elements</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Enter your name"
                  className="glass-input w-full"
                />
                <textarea 
                  placeholder="Your message"
                  rows={3}
                  className="glass-input w-full resize-none"
                />
                <button className="glass-button glass-button-primary w-full glass-button-effect">
                  Submit Form
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Design Guidelines */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#5f5168] to-[#4E4456] bg-clip-text text-transparent">
            Design Guidelines
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="glass-card p-6 mb-4">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-[#5f5168]20 to-[#5f5168]40" />
              </div>
              <h3 className="font-semibold mb-2">Glassmorphism</h3>
              <p className="text-sm text-gray-600">
                Translucent surfaces with backdrop blur for depth
              </p>
            </div>
            
            <div className="text-center">
              <div className="glass-card p-6 mb-4">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 animate-gradient bg-gradient-to-r from-[#A8D5E3] via-[#5f5168] to-[#BFA181]" />
              </div>
              <h3 className="font-semibold mb-2">Smooth Animations</h3>
              <p className="text-sm text-gray-600">
                Fluid transitions and micro-interactions
              </p>
            </div>
            
            <div className="text-center">
              <div className="glass-card p-6 mb-4">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-[#BFA181]20 to-[#BFA181]40" />
              </div>
              <h3 className="font-semibold mb-2">Brand Colors</h3>
              <p className="text-sm text-gray-600">
                Muscat Bay signature purple and complementary palette
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
