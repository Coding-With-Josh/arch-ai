import { ComponentProps, ElementAction } from '@/editor/types';
import { dispatchAction } from '../../utils/dispatchAction';
import React from 'react';

interface CheckboxProps extends Omit<ComponentProps, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => ElementAction | void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, style, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const action = onChange?.(e.target.checked);
      if (action) {
        dispatchAction(action);
      }
    };

    return (
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        style={{
          width: '1rem',
          height: '1rem',
          cursor: 'pointer',
          ...style,
        }}
        className={className}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';