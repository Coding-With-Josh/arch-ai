import { ComponentProps } from '@/editor/types';
import React from 'react';

interface ContainerProps extends ComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | string;
  padding?: boolean | string;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'xl', padding = true, style, className, children, ...props }, ref) => {
    const containerStyle = {
      width: '100%',
      maxWidth: maxWidth === 'xl' ? '1280px' : 
               maxWidth === 'lg' ? '1024px' :
               maxWidth === 'md' ? '768px' : 
               maxWidth === 'sm' ? '640px' : maxWidth,
      margin: '0 auto',
      padding: padding ? (typeof padding === 'string' ? padding : '0 1rem') : undefined,
      ...style,
    };

    return (
      <div
        ref={ref}
        style={containerStyle}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';