import { ComponentProps, ElementAction } from '@/editor/types';
import { dispatchAction } from '../../utils/dispatchAction';
import React from 'react';

interface TextInputProps extends Omit<ComponentProps, 'onChange'> {
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => ElementAction | void;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ value, placeholder, type = 'text', onChange, style, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const action = onChange?.(e.target.value);
      if (action) {
        dispatchAction(action);
      }
    };

    return (
      <input
        ref={ref}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          width: '100%',
          ...style,
        }}
        className={className}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput';