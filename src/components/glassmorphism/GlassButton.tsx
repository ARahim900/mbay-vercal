'use client';

import React, { useState } from 'react';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  ripple?: boolean;
  fullWidth?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  ripple = true,
  fullWidth = false,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples(prev => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, rgba(95, 81, 104, 0.9) 0%, rgba(95, 81, 104, 0.8) 100%)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      hover: 'hover:shadow-xl hover:scale-[1.02]'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#5f5168',
      border: '1px solid rgba(95, 81, 104, 0.2)',
      hover: 'hover:bg-white hover:shadow-lg hover:scale-[1.02]'
    },
    ghost: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#5f5168',
      border: '1px solid rgba(95, 81, 104, 0.1)',
      hover: 'hover:bg-white/20 hover:border-primary/20'
    },
    danger: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.8) 100%)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      hover: 'hover:shadow-xl hover:scale-[1.02]'
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <button
      className={`
        glass-button
        relative overflow-hidden
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${currentVariant.hover}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        font-medium rounded-xl
        transition-all duration-300
        backdrop-blur-xl
        flex items-center justify-center gap-2
        ${className}
      `}
      style={{
        background: currentVariant.background,
        color: currentVariant.color,
        border: currentVariant.border,
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        boxShadow: '0 4px 24px rgba(95, 81, 104, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
      }}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effect */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      )}

      {/* Icon and content */}
      {!loading && (
        <>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </>
      )}
    </button>
  );
};

export default GlassButton;
