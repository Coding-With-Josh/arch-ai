import { ComponentProps } from '@/editor/types';
import React from 'react';
import { JSX } from 'react/jsx-runtime';
// import { ComponentProps } from '@/types/components';

interface BoxProps extends ComponentProps {
  as?: keyof JSX.IntrinsicElements;
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ as = 'div', style, className, children, ...props }, ref) => {
    const Component = as;
    
    return (
      <Component
        ref={ref}
        style={style}
        className={className}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Box.displayName = 'Box';