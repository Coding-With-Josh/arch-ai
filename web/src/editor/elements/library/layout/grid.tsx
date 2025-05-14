import { ComponentProps } from '@/editor/types';
import React from 'react';

interface GridProps extends ComponentProps {
  columns?: number | string;
  rows?: number | string;
  gap?: number | string;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ columns, rows, gap, style, className, children, ...props }, ref) => {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns,
      gridTemplateRows: typeof rows === 'number' ? `repeat(${rows}, 1fr)` : rows,
      gap: gap,
      ...style,
    };

    return (
      <div
        ref={ref}
        style={gridStyle}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';