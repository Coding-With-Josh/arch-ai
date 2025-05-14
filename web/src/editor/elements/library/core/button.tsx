import { ComponentProps } from '@/editor/types';
import React from 'react';

interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, style, className, children, ...props }, ref) => {
    const buttonStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: size === 'lg' ? '0.75rem 1.5rem' : 
              size === 'md' ? '0.5rem 1rem' : 
              '0.25rem 0.75rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      backgroundColor: variant === 'primary' ? '#3b82f6' : 
                      variant === 'secondary' ? '#e5e7eb' : 
                      variant === 'danger' ? '#ef4444' : 'transparent',
      color: variant === 'primary' ? 'white' : 
             variant === 'secondary' ? '#374151' : 
             variant === 'danger' ? 'white' : '#374151',
      border: variant === 'ghost' ? '1px solid #d1d5db' : 'none',
      ...style,
    };

    return (
      <button
        ref={ref}
        style={buttonStyle}
        className={className}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span style={{ 
            display: 'inline-block',
            width: '1rem',
            height: '1rem',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';