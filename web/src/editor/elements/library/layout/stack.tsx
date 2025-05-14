import { ComponentProps } from '@/editor/types';
import React from 'react';

interface StackProps extends ComponentProps {
  direction?: 'horizontal' | 'vertical';
  spacing?: number | string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between';
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ direction = 'vertical', spacing = 8, align, justify, style, className, children, ...props }, ref) => {
    const stackStyle = {
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      gap: typeof spacing === 'number' ? `${spacing}px` : spacing,
      alignItems: align,
      justifyContent: justify,
      ...style,
    };

    return (
      <div
        ref={ref}
        style={stackStyle}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';