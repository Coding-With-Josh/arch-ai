import { ComponentProps } from '@/editor/types';
import { JSX } from 'react/jsx-runtime';
import React, { Ref } from 'react';

interface SectionProps extends ComponentProps {
  as?: keyof JSX.IntrinsicElements;
  padding?: 'sm' | 'md' | 'lg' | string;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ as = 'section', padding = 'md', style, className, children, ...props }, ref) => {
    const Component = as as keyof JSX.IntrinsicElements;
    const paddingValue = padding === 'lg' ? '3rem' : 
                       padding === 'md' ? '2rem' : 
                       padding === 'sm' ? '1rem' : padding;

    const sectionStyle = {
      padding: paddingValue,
      ...style,
    };

    return (
      <div
        ref={ref as Ref<HTMLDivElement> | undefined}
        style={sectionStyle}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Section.displayName = 'Section';