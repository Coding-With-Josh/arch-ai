import { ComponentProps } from '@/editor/types';
import React from 'react';

interface ImageProps extends ComponentProps {
  src: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt = '', objectFit = 'cover', style, className, ...props }, ref) => {
    const imageStyle = {
      objectFit,
      maxWidth: '100%',
      height: 'auto',
      ...style,
    };

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        style={imageStyle}
        className={className}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';