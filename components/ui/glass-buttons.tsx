'use client';

import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    relative overflow-hidden
    font-medium rounded-2xl
    transition-all duration-300 ease-out
    transform active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-[#4E4456] to-[#5f5168]
      text-white border border-white/20
      shadow-[0_8px_32px_0_rgba(78,68,86,0.3)]
      hover:shadow-[0_12px_48px_0_rgba(78,68,86,0.4)]
      hover:-translate-y-0.5
      before:absolute before:inset-0
      before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-200%] hover:before:translate-x-[200%]
      before:transition-transform before:duration-700
    `,
    secondary: `
      bg-white/80 backdrop-blur-xl backdrop-saturate-150
      text-[#4E4456] border border-white/30
      shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
      hover:shadow-[0_12px_48px_0_rgba(31,38,135,0.25)]
      hover:bg-white/90 hover:-translate-y-0.5
    `,
    ghost: `
      bg-transparent
      text-[#4E4456] border border-[#4E4456]/20
      hover:bg-[#4E4456]/5 hover:border-[#4E4456]/30
      hover:shadow-[0_8px_32px_0_rgba(78,68,86,0.1)]
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      text-white border border-white/20
      shadow-[0_8px_32px_0_rgba(239,68,68,0.3)]
      hover:shadow-[0_12px_48px_0_rgba(239,68,68,0.4)]
      hover:-translate-y-0.5
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        flex items-center justify-center
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </>
      )}
    </button>
  );
};

interface GlassIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const GlassIconButton: React.FC<GlassIconButtonProps> = ({
  icon,
  variant = 'secondary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    relative overflow-hidden
    rounded-full aspect-square
    transition-all duration-300 ease-out
    transform active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-[#4E4456] to-[#5f5168]
      text-white border border-white/20
      shadow-[0_8px_32px_0_rgba(78,68,86,0.3)]
      hover:shadow-[0_12px_48px_0_rgba(78,68,86,0.4)]
      hover:-translate-y-0.5
    `,
    secondary: `
      bg-white/80 backdrop-blur-xl backdrop-saturate-150
      text-[#4E4456] border border-white/30
      shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
      hover:shadow-[0_12px_48px_0_rgba(31,38,135,0.25)]
      hover:bg-white/90 hover:-translate-y-0.5
    `,
    ghost: `
      bg-transparent
      text-[#4E4456] border border-transparent
      hover:bg-[#4E4456]/5 hover:border-[#4E4456]/20
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      text-white border border-white/20
      shadow-[0_8px_32px_0_rgba(239,68,68,0.3)]
      hover:shadow-[0_12px_48px_0_rgba(239,68,68,0.4)]
      hover:-translate-y-0.5
    `,
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
    </button>
  );
};

interface GlassButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassButtonGroup: React.FC<GlassButtonGroupProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        inline-flex items-center
        bg-white/80 backdrop-blur-xl backdrop-saturate-150
        border border-white/30 rounded-2xl
        shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
        p-1 gap-1
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface GlassToggleButtonProps {
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const GlassToggleButton: React.FC<GlassToggleButtonProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <GlassButtonGroup className={className}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium
            transition-all duration-300
            flex items-center gap-2
            ${
              value === option.value
                ? 'bg-gradient-to-r from-[#4E4456] to-[#5f5168] text-white shadow-lg'
                : 'text-[#4E4456] hover:bg-[#4E4456]/5'
            }
          `}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </GlassButtonGroup>
  );
};

interface GlassFabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'primary' | 'secondary';
}

export const GlassFab: React.FC<GlassFabProps> = ({
  icon,
  position = 'bottom-right',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-[#4E4456] to-[#5f5168]
      text-white border border-white/20
      shadow-[0_12px_48px_0_rgba(78,68,86,0.4)]
      hover:shadow-[0_16px_64px_0_rgba(78,68,86,0.5)]
    `,
    secondary: `
      bg-white/90 backdrop-blur-xl backdrop-saturate-150
      text-[#4E4456] border border-white/30
      shadow-[0_12px_48px_0_rgba(31,38,135,0.25)]
      hover:shadow-[0_16px_64px_0_rgba(31,38,135,0.35)]
    `,
  };

  return (
    <button
      className={`
        fixed ${positions[position]} z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        transition-all duration-300 ease-out
        transform hover:scale-110 active:scale-95
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};
