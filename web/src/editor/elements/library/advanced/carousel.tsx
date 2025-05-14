import { ComponentProps } from '@/editor/types';
import React, { useState, useEffect } from 'react';

interface CarouselProps extends ComponentProps {
  items?: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ items = [], autoPlay = false, interval = 3000, style, className, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (!autoPlay || items.length <= 1) return;

      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, interval);

      return () => clearInterval(timer);
    }, [autoPlay, interval, items.length]);

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
        className={className}
        {...props}
      >
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.5s ease',
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${items.length * 100}%`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                width: `${100 / items.length}%`,
                flexShrink: 0,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Carousel.displayName = 'Carousel';