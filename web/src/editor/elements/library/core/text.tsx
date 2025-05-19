import { ComponentProps } from '@/editor/types';
import React from 'react';

interface TextProps extends ComponentProps {
  content?: string;
  variant?: string;
  truncate?: boolean;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ content, variant, truncate, style, className, ...props }, ref) => {
    const textStyle = {
      ...style,
      overflow: truncate ? 'hidden' : undefined,
      textOverflow: truncate ? 'ellipsis' : undefined,
      whiteSpace: truncate ? 'nowrap' : undefined,
    };

    return (
      <p
        ref={ref}
        style={textStyle}
        className={`${variant ? `text-${variant}` : ''} ${className || ''}`}
        {...props}
      >
        {content}
      </p>
    );
  }
);

Text.displayName = 'Text';