"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDesignView } from '@/editor/editor-provider';
import { DesignElement, UUID, Position as CanvasPosition, Dimensions, VisualElement, LayoutElement, ComponentInstance } from '@/editor/types';
import { useDrop, useDrag } from 'react-dnd';
import { throttle } from 'lodash';
import { Button } from '@/components/ui/button';
import { Grid, Maximize, Minimize, Monitor, Smartphone, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';

const Canvas = () => {
  const {
    canvas,
    elements,
    selectedElements,
    interactionState,
    viewport,
    addElement,
    updateElement,
    selectElements,
    updateDesignView
  } = useDesignView();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef<CanvasPosition>({ x: 0, y: 0 });
  const selectedElementsRef = useRef<UUID[]>([]);
  const resizeHandle = useRef<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const devicePresets = [
    {
      id: 'mobile',
      name: 'Mobile',
      icon: <Smartphone className="h-4 w-4" />,
      dimensions: { width: 375, height: 812 }
    },
    {
      id: 'tablet',
      name: 'Tablet',
      icon: <Tablet className="h-4 w-4" />,
      dimensions: { width: 768, height: 1024 }
    },
    {
      id: 'desktop',
      name: 'Desktop',
      icon: <Monitor className="h-4 w-4" />,
      dimensions: { width: 1440, height: 1024 }
    }
  ];

  const handleDeviceChange = (deviceId: string) => {
    const device = devicePresets.find(d => d.id === deviceId);
    if (device) {
      updateDesignView({
        canvas: {
          ...canvas,
          dimensions: device.dimensions
        }
      });
    }
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
    updateDesignView({
      canvas: {
        ...canvas,
        grid: {
          ...canvas.grid,
          enabled: !showGrid
        }
      }
    });
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const zoomIn = () => {
    const newZoom = Math.min(2, zoom + 0.1);
    setZoom(newZoom);
    updateDesignView({
      viewport: {
        ...viewport,
        zoom: newZoom
      }
    });
  };

  const zoomOut = () => {
    const newZoom = Math.max(0.5, zoom - 0.1);
    setZoom(newZoom);
    updateDesignView({
      viewport: {
        ...viewport,
        zoom: newZoom
      }
    });
  };

  const resetZoom = () => {
    setZoom(1);
    updateDesignView({
      viewport: {
        ...viewport,
        zoom: 1
      }
    });
  };

  // Type guards
  const isVisualElement = (element: DesignElement): element is VisualElement => {
    return ['rectangle', 'ellipse', 'text', 'image', 'vector', 'icon'].includes(element.type);
  };

  const hasTransform = (element: DesignElement): element is VisualElement | ComponentInstance => {
    return isVisualElement(element) || element.type === 'component';
  };

  const isLayoutElement = (element: DesignElement): element is LayoutElement => {
    return ['frame', 'section', 'grid', 'stack'].includes(element.type);
  };

  // Handle component drop from components panel
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: { type: string; name: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: offset.x - canvasRect.left - viewport.position.x,
        y: offset.y - canvasRect.top - viewport.position.y
      };
      
      const newElement: VisualElement = {
        id: crypto.randomUUID() as UUID,
        type: 'rectangle',
        position,
        dimensions: { width: 100, height: 100 },
        transform: { rotation: 0, skew: { x: 0, y: 0 }, origin: { x: 0.5, y: 0.5 } },
        style: {
          fills: [{ type: 'solid', color: '#3b82f6', opacity: 1, blendMode: 'normal' }],
          borders: [],
          shadows: [],
          effects: [],
          opacity: 1,
          blendMode: 'normal',
          filters: [],
          clip: { enabled: false, mode: 'rect' },
          overflow: 'visible'
        },
        constraints: { horizontal: 'scale', vertical: 'scale' },
        childrenIds: [],
        meta: {
          created: Date.now(),
          modified: Date.now(),
          createdBy: 'current-user',
          componentDefinitionId: undefined,
          templateId: undefined
        }
      };
      
      addElement(newElement);
      selectElements([newElement.id]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  // Handle element dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: UUID) => {
    if (e.button !== 0) return; // Only left mouse button
    
    const isResizeHandle = (e.target as HTMLElement).dataset.resizeHandle;
    if (isResizeHandle) {
      resizeHandle.current = isResizeHandle;
      selectElements([elementId]);
      return;
    }

    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    // Add to selection if shift is pressed, otherwise replace selection
    if (e.shiftKey) {
      if (selectedElements.includes(elementId)) {
        selectElements(selectedElements.filter(id => id !== elementId));
      } else {
        selectElements([...selectedElements, elementId]);
      }
    } else if (!selectedElements.includes(elementId)) {
      selectElements([elementId]);
    }
    
    selectedElementsRef.current = [...selectedElements];
  }, [selectedElements, selectElements]);

  // Handle canvas panning
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement) !== canvasRef.current) return;
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    selectElements([]);
  }, [selectElements]);

  // Handle mouse move for dragging and resizing
  const handleMouseMove = useCallback(throttle((e: MouseEvent) => {
    if (!isDragging.current || !canvasRef.current) return;
    
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    
    if (resizeHandle.current && selectedElements.length === 1) {
      // Resize logic
      const element = elements.find(el => el.id === selectedElements[0]);
      if (!element) return;
      
      const newDimensions = { ...element.dimensions };
      const newPosition = { ...element.position };
      
      switch (resizeHandle.current) {
        case 'n':
          newDimensions.height = Math.max(10, element.dimensions.height - deltaY);
          newPosition.y += deltaY;
          break;
        case 'ne':
          newDimensions.width = Math.max(10, element.dimensions.width + deltaX);
          newDimensions.height = Math.max(10, element.dimensions.height - deltaY);
          newPosition.y += deltaY;
          break;
        case 'e':
          newDimensions.width = Math.max(10, element.dimensions.width + deltaX);
          break;
        case 'se':
          newDimensions.width = Math.max(10, element.dimensions.width + deltaX);
          newDimensions.height = Math.max(10, element.dimensions.height + deltaY);
          break;
        case 's':
          newDimensions.height = Math.max(10, element.dimensions.height + deltaY);
          break;
        case 'sw':
          newDimensions.width = Math.max(10, element.dimensions.width - deltaX);
          newDimensions.height = Math.max(10, element.dimensions.height + deltaY);
          newPosition.x += deltaX;
          break;
        case 'w':
          newDimensions.width = Math.max(10, element.dimensions.width - deltaX);
          newPosition.x += deltaX;
          break;
        case 'nw':
          newDimensions.width = Math.max(10, element.dimensions.width - deltaX);
          newDimensions.height = Math.max(10, element.dimensions.height - deltaY);
          newPosition.x += deltaX;
          newPosition.y += deltaY;
          break;
      }
      
      updateElement(element.id, {
        dimensions: newDimensions,
        position: newPosition
      });
    } else if (selectedElementsRef.current.length > 0) {
      // Move elements
      selectedElementsRef.current.forEach(id => {
        const element = elements.find(el => el.id === id);
        if (element) {
          updateElement(id, {
            position: {
              x: element.position.x + deltaX,
              y: element.position.y + deltaY
            }
          });
        }
      });
    } else {
      // Pan canvas
      updateDesignView({
        viewport: {
          ...viewport,
          position: {
            x: viewport.position.x - deltaX,
            y: viewport.position.y - deltaY
          }
        }
      });
    }
    
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  }, 16), [elements, selectedElements, updateElement, updateDesignView, viewport]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    resizeHandle.current = null;
  }, []);

  // Add event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Render grid
  const renderGrid = () => {
    if (!canvas.grid.enabled) return null;
    
    const gridSize = canvas.grid.size;
    const subDivisions = canvas.grid.subdivisions;
    const subGridSize = gridSize / subDivisions;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Main grid */}
        <div 
          className="absolute inset-0 bg-grid"
          style={{
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundImage: `linear-gradient(to right, ${canvas.grid.color} 1px, transparent 1px),
                             linear-gradient(to bottom, ${canvas.grid.color} 1px, transparent 1px)`,
            opacity: canvas.grid.opacity
          }}
        />
        
        {/* Subdivisions */}
        {subDivisions > 1 && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundSize: `${subGridSize}px ${subGridSize}px`,
              backgroundImage: `linear-gradient(to right, ${canvas.grid.color} 0.5px, transparent 0.5px),
                               linear-gradient(to bottom, ${canvas.grid.color} 0.5px, transparent 0.5px)`,
              opacity: canvas.grid.opacity * 0.5
            }}
          />
        )}
      </div>
    );
  };

  // Render element with proper typing
  const renderElement = (element: DesignElement) => {
    const isSelected = selectedElements.includes(element.id);

    // Base style that applies to all elements
    const baseStyle = {
      position: 'absolute' as 'absolute',
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.dimensions.width}px`,
      height: `${element.dimensions.height}px`,
      zIndex: isSelected ? 1000 : 1,
      cursor: isSelected ? 'move' : 'default'
    };

    // Visual elements (rectangle, ellipse, text, etc.)
    if (isVisualElement(element)) {
      const style: React.CSSProperties = {
        ...baseStyle,
        transform: `
          rotate(${element.transform.rotation}deg)
          skew(${element.transform.skew.x}deg, ${element.transform.skew.y}deg)
        `,
        transformOrigin: `${element.transform.origin.x * 100}% ${element.transform.origin.y * 100}%`,
        backgroundColor: element.style.fills[0]?.type === 'solid' ? 
          element.style.fills[0].color : 
          'transparent',
        opacity: element.style.opacity,
        border: element.style.borders.length > 0 ? 
          `${element.style.borders[0].thickness}px ${element.style.borders[0].style} ${element.style.borders[0].color}` : 
          'none',
        // borderRadius: element.style.borderRadius || '0px',
        boxShadow: element.style.shadows.map(shadow => 
          `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color} ${shadow.type === 'inner-shadow' ? 'inset' : ''}`
        ).join(', ')
      };

      return (
        <div
          key={element.id}
          className="element"
          style={style}
          onMouseDown={(e) => handleMouseDown(  e, element.id)}
          data-element-id={element.id}
        >
          {isSelected && renderSelectionHandles(element)}
        </div>
      );
    }

    // Layout elements (frame, grid, stack, etc.)
    else if (isLayoutElement(element)) {
      const style = {
        ...baseStyle,
        display: 'flex',
        flexDirection: element.layoutMode === 'horizontal' ? 'row' as "row": 'column' as "column",
        gap: `${element.layoutConfig?.gap || 0}px`,
        padding: `${element.layoutConfig?.padding?.top || 0}px ${element.layoutConfig?.padding?.right || 0}px ${element.layoutConfig?.padding?.bottom || 0}px ${element.layoutConfig?.padding?.left || 0}px`,
        backgroundColor: 'rgba(200, 200, 255, 0.2)' // Visual indicator for layout elements
      };

      return (
        <div
          key={element.id}
          className="layout-element"
          style={style}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
          data-element-id={element.id}
        >
          {isSelected && renderSelectionHandles(element)}
        </div>
      );
    }

    // Component instances
    else if (element.type === 'component') {
      const style = {
        ...baseStyle,
        // transform: `rotate(${element.transform.rotation}deg)`,
        // transformOrigin: `${element.transform.origin.x * 100}% ${element.transform.origin.y * 100}%`,
        backgroundColor: 'rgba(200, 255, 200, 0.2)', // Visual indicator for components
        border: '1px dashed #4CAF50'
      };

      return (
        <div
          key={element.id}
          className="component-instance"
          style={style}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
          data-element-id={element.id}
        >
          {isSelected && renderSelectionHandles(element)}
        </div>
      );
    }

    // Other element types (groups, smart contracts, etc.)
    else {
      return (
        <div
          key={element.id}
          className="generic-element"
          style={baseStyle}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
          data-element-id={element.id}
        >
          {isSelected && renderSelectionHandles(element)}
        </div>
      );
    }
  };

  // Render resize handles for selected elements
  const renderSelectionHandles = (element: DesignElement) => {
    return (
      <>
        {/* Resize handles */}
        {['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map(handle => (
          <div
            key={handle}
            className={`absolute bg-blue-500 border border-white w-2 h-2 z-10 resize-handle resize-${handle}`}
            data-resize-handle={handle}
            style={{
              cursor: `${handle}-resize`,
              left: handle.includes('w') ? '0px' : handle.includes('e') ? '100%' : '50%',
              top: handle.includes('n') ? '0px' : handle.includes('s') ? '100%' : '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
        
        {/* Dimensions indicator */}
        <div className="absolute bottom-full left-0 bg-black text-white text-xs px-1 rounded">
          {Math.round(element.dimensions.width)}×{Math.round(element.dimensions.height)}
        </div>
      </>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Viewport Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 p-2 bg-background/90 rounded-lg border shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleGrid}
          className={cn(showGrid ? "bg-accent" : "")}
        >
          <Grid className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={zoomOut}>
            -
          </Button>
          <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={zoomIn}>
            +
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" onClick={resetZoom}>
          100%
        </Button>
        
        <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
          {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      {/* Device Frame */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
        <div 
          className="relative border-2 border-border rounded-lg shadow-xl transition-all duration-300"
          style={{
            width: canvas.dimensions.width,
            height: canvas.dimensions.height,
            backgroundColor: canvas.background.color,
            opacity: 0.2
          }}
        >
          <div className="absolute -top-6 left-0 right-0 flex justify-center">
            <div className="bg-border text-foreground text-xs px-2 py-1 rounded-b-lg flex items-center gap-1">
              {devicePresets.find(d => 
                d.dimensions.width === canvas.dimensions.width
              )?.icon}
              <span>
                {canvas.dimensions.width} × {canvas.dimensions.height}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div
        ref={canvasRef}
        className="relative w-full h-full"
        onMouseDown={handleCanvasMouseDown}
      >
        {renderGrid()}
        <div 
          ref={(node: HTMLDivElement | null) => { drop(node); }}
          className="absolute"
          style={{
            transform: `translate(${viewport.position.x}px, ${viewport.position.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {elements.map(renderElement)}
        </div>
      </div>
    </div>
  );
};

export default Canvas;