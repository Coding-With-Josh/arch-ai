import { ComponentProps, ElementAction } from '@/editor/types';
import { dispatchAction } from '../../utils/dispatchAction';
import React from 'react';

interface SelectProps extends Omit<ComponentProps, 'onChange'> {
  options?: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => ElementAction | void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options = [], value, onChange, style, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const action = onChange?.(e.target.value);
      if (action) {
        dispatchAction(action);
      }
    };

    return (
      <select
        ref={ref}
        value={value}
        onChange={handleChange}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          width: '100%',
          cursor: 'pointer',
          ...style,
        }}
        className={className}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';