"use client"

import { DesignElement, ReactStyle } from '@/editor/types';

export function applyStyles(styles: Partial<ReactStyle>) {
  return {
    // Layout
    display: styles.display,
    position: styles.position,
    top: styles.top,
    right: styles.right,
    bottom: styles.bottom,
    left: styles.left,
    zIndex: styles.zIndex,
    
    // Flex/Grid
    flexDirection: styles.flexDirection,
    justifyContent: styles.justifyContent,
    alignItems: styles.alignItems,
    flexWrap: styles.flexWrap,
    gap: styles.gap,
    gridTemplateColumns: styles.gridTemplateColumns,
    
    // Dimensions
    width: styles.width,
    height: styles.height,
    minWidth: styles.minWidth,
    minHeight: styles.minHeight,
    maxWidth: styles.maxWidth,
    maxHeight: styles.maxHeight,
    
    // Spacing
    margin: styles.margin,
    padding: styles.padding,
    
    // Visual
    backgroundColor: styles.backgroundColor,
    color: styles.color,
    opacity: styles.opacity,
    borderRadius: styles.borderRadius,
    boxShadow: styles.boxShadow,
    border: styles.border,
    
    // Text
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    lineHeight: styles.lineHeight,
    textAlign: styles.textAlign,
    
    // Transform
    transform: styles.transform,
    
    // Transition
    transition: styles.transition,
    
    // Other
    overflow: styles.overflow,
    cursor: styles.cursor
  };
}

export function resolveStyles(
    styles: DesignElement["props"]["style"],
    variant?: string,
    state?: string
  ): ReactStyle {
    let result = { ...styles?.base };
  
    // Apply variant styles if specified
    if (variant && styles?.variants?.[variant]) {
      result = { ...result, ...styles.variants[variant] };
    }
  
    // Apply state styles if specified
    if (state && styles?.state?.[state]) {
      result = { ...result, ...styles.state[state] };
    }
  
    return result;
  }