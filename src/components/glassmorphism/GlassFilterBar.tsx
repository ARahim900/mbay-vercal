'use client';

import React, { useEffect, useState, useRef } from 'react';
import { GlassCard } from './GlassCard';

interface GlassFilterBarProps {
  children: React.ReactNode;
  className?: string;
  sidebarWidth?: number; // Width of sidebar in pixels
  isCollapsed?: boolean; // Is sidebar collapsed
  headerHeight?: number; // Height of header in pixels
}

export const GlassFilterBar: React.FC<GlassFilterBarProps> = ({ 
  children, 
  className = '',
  sidebarWidth = 256, // Default sidebar width (16rem = 256px)
  isCollapsed = false,
  headerHeight = 88 // Default header height
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [filterHeight, setFilterHeight] = useState(0);
  const filterRef = useRef<HTMLDivElement>(null);
  const actualSidebarWidth = isCollapsed ? 64 : sidebarWidth; // 4rem = 64px when collapsed

  useEffect(() => {
    let scrollContainer: Element | Window = window;
    
    // Try to find the main scrolling container
    const findScrollContainer = () => {
      // Look for common scrolling container selectors
      const containers = [
        document.querySelector('[data-scroll-container]'),
        document.querySelector('.overflow-y-auto'),
        document.querySelector('.main-content'),
        document.querySelector('.dashboard-content'),
        document.getElementById('main-content')
      ].filter(Boolean);
      
      return containers[0] || window;
    };

    const handleScroll = () => {
      let scrollY = 0;
      
      if (scrollContainer === window) {
        scrollY = window.scrollY;
      } else {
        scrollY = (scrollContainer as Element).scrollTop;
      }
      
      setIsScrolled(scrollY > 20);
    };

    // Find the appropriate scroll container
    scrollContainer = findScrollContainer();
    
    // Add scroll listener
    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Measure the filter bar height
    if (filterRef.current) {
      setFilterHeight(filterRef.current.offsetHeight);
    }
  }, [children]);

  return (
    <>
      {/* Spacer to prevent content jump */}
      <div style={{ height: `${filterHeight}px` }} className="print:hidden" />
      
      {/* Fixed filter bar */}
      <div 
        ref={filterRef}
        className={`filter-bar-fixed print:hidden ${isScrolled ? 'scrolled' : ''} ${className}`}
        style={{
          position: 'fixed',
          top: `${headerHeight}px`,
          left: `${actualSidebarWidth}px`,
          right: 0,
          zIndex: 50, // Increased z-index for better layering
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: `calc(100% - ${actualSidebarWidth}px)`,
          pointerEvents: 'auto'
        }}
      >
        <div className="px-6 md:px-8 py-4">
          <GlassCard 
            className="p-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: isScrolled 
                ? '0 8px 32px rgba(95, 81, 104, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)' 
                : '0 4px 16px rgba(95, 81, 104, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.6)',
              transform: isScrolled ? 'translateY(0)' : 'translateY(-2px)',
            }}
            hover={false}
          >
            {children}
          </GlassCard>
        </div>
      </div>

      {/* Add custom CSS for better glass effect */}
      <style jsx global>{`
        .filter-bar-fixed {
          will-change: transform;
          isolation: isolate;
        }
        
        .filter-bar-fixed.scrolled {
          backdrop-filter: blur(30px) saturate(200%);
          -webkit-backdrop-filter: blur(30px) saturate(200%);
        }
        
        /* Ensure the filter bar is above other content */
        .filter-bar-fixed > div {
          position: relative;
          z-index: 50;
        }
        
        /* Additional styling for better fixed positioning */
        .filter-bar-fixed {
          pointer-events: none;
        }
        
        .filter-bar-fixed > div {
          pointer-events: auto;
        }
      `}</style>
    </>
  );
};

// Alternative implementation for situations where fixed positioning doesn't work
export const StickyGlassFilter: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  stickyTop?: string;
}> = ({ 
  children,
  className = '',
  stickyTop = '0px'
}) => {
  return (
    <div 
      className={`sticky bg-white/95 backdrop-blur-sm border-b border-slate-200 mb-6 ${className}`}
      style={{
        top: stickyTop,
        zIndex: 40,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="p-4">
        <GlassCard 
          className="p-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          }}
        >
          {children}
        </GlassCard>
      </div>
    </div>
  );
};

// Export a simple wrapper for sections without sidebar
export const SimpleGlassFilter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <GlassCard 
        className="p-4"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        {children}
      </GlassCard>
    </div>
  );
};

export default GlassFilterBar;