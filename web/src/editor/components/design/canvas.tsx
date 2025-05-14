"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDesignView } from '@/editor/editor-provider';
import { DesignElement, UUID, Position as CanvasPosition, Dimensions } from '@/editor/types';
import { useDrop } from 'react-dnd';
import { throttle } from 'lodash';
import { Button } from '@/components/ui/button';
import { Grid, Maximize, Minimize, Monitor, Moon, Phone, Sun, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const Canvas = () => {
  const { theme, setTheme } = useTheme();
  const {
    canvas,
    elements,
    selectedElements,
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
  const [showGrid, setShowGrid] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeDevice, setActiveDevice] = useState('macbook');
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);

  // Premium device presets with ultra-realistic MacBook Pro frame
  const devicePresets = [
    {
      id: 'iphone',
      name: 'iPhone 15 Pro',
      icon: <Phone className="h-4 w-4" />,
      dimensions: { width: 393, height: 800 },
      frameClass: 'rounded-[3rem] border-[1rem] border-gray-900',
      notchClass: 'w-[30%] h-6 bg-gray-900 rounded-b-xl mx-auto',
      frameOffset: { x: 0, y: 0 },
      frameColor: 'bg-gray-900',
      screenClass: 'rounded-[2rem]'
    },
    {
      id: 'ipad',
      name: 'iPad Pro',
      icon: <Tablet className="h-4 w-4" />,
      dimensions: { width: 1024, height: 1366 },
      frameClass: 'rounded-[1rem] border-[1.5rem] border-gray-800',
      notchClass: 'w-[20%] h-6 bg-gray-800 rounded-b-lg mx-auto',
      frameOffset: { x: 0, y: 0 },
      frameColor: 'bg-gray-800',
      screenClass: 'rounded-[0.5rem]'
    },
    {
      id: 'macbook',
      name: 'MacBook Pro 16"',
      icon: <Monitor className="h-4 w-4" />,
      dimensions: { width: 1728, height: 1117 },
      frameClass: 'rounded-xl border-[0.5rem] border-gray-800',
      frameOffset: { x: 0, y: 0 },
      frameColor: 'bg-gray-800',
      macbookStyle: true,
      macbookNotchClass: 'w-[20%] h-8 bg-gray-800 rounded-b-lg mx-auto',
      macbookBaseClass: 'w-[110%] h-24 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-3xl -ml-[5%]',
      screenClass: 'rounded-lg',
      keyboardClass: 'w-[105%] h-16 bg-gradient-to-b from-gray-900 to-gray-950 rounded-b-2xl -ml-[2.5%]',
      footClass: 'w-[30%] h-2 bg-gray-950 rounded-b-lg mx-auto mt-1'
    }
  ];

  const activePreset = devicePresets.find(d => d.id === activeDevice) || devicePresets[2];

  // Create default container matching device dimensions
  useEffect(() => {
    if (elements.length === 0) {
      const defaultContainer: DesignElement = {
        id: 'default-container' as UUID,
        type: 'container',
        position: { x: 0, y: 0 },
        dimensions: {
          width: activePreset.dimensions.width,
          height: activePreset.dimensions.height
        },
        style: {
          backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.5)' : 'rgba(250, 250, 250, 0.7)',
          border: theme === 'dark' ? '1px dashed rgba(255, 255, 255, 0.1)' : '1px dashed rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        },
        meta: {
          name: "Main Container",
          created: Date.now(),
          modified: Date.now(),
          createdBy: 'system',
          isDefaultContainer: true,
          locked: true
        }
      };
      addElement(defaultContainer);
    }
  }, [elements.length, activePreset.dimensions, addElement, theme]);

  const handleDeviceChange = (deviceId: string) => {
    const device = devicePresets.find(d => d.id === deviceId);
    if (device) {
      setActiveDevice(deviceId);

      // Update default container dimensions
      const defaultContainer = elements.find(el => el.meta?.isDefaultContainer);
      if (defaultContainer) {
        updateElement(defaultContainer.id, {
          dimensions: device.dimensions
        });
      }

      updateDesignView({
        canvas: {
          ...canvas,
          dimensions: device.dimensions
        }
      });
    }
  };

  const toggleGrid = () => {
    const newShowGrid = !showGrid;
    setShowGrid(newShowGrid);
    updateDesignView({
      canvas: {
        ...canvas,
        grid: {
          ...canvas.grid,
          enabled: newShowGrid
        }
      }
    });
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const zoomIn = () => {
    const newZoom = Math.min(3, zoom + 0.1);
    setZoom(newZoom);
    updateDesignView({
      viewport: {
        ...viewport,
        zoom: newZoom
      }
    });
  };

  const zoomOut = () => {
    const newZoom = Math.max(0.2, zoom - 0.1);
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
        zoom: 1,
        position: { x: 0, y: 0 }
      }
    });
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: { type: string; name: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: (offset.x - canvasRect.left - viewport.position.x) / viewport.zoom,
        y: (offset.y - canvasRect.top - viewport.position.y) / viewport.zoom
      };

      const newElement: DesignElement = {
        id: crypto.randomUUID() as UUID,
        position,
        dimensions: { width: 100, height: 40 },
        props: {

          style: {
            backgroundColor: theme === 'dark' ? 'rgba(82, 82, 91, 0.5)' : 'rgba(212, 212, 216, 0.5)',
            border: theme === 'dark' ? '1px solid rgba(63, 63, 70, 0.8)' : '1px solid rgba(228, 228, 231, 0.8)'
          },
        },
        meta: {
          name: item.name,
          created: Date.now(),
          modified: Date.now(),
          createdBy: 'user'
        }
      };

      addElement(newElement);
      selectElements([newElement.id]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [viewport, addElement, selectElements, theme]);


  // Handle element dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: UUID) => {
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    const isResizeHandle = target.closest('[data-resize-handle]');

    if (isResizeHandle) {
      resizeHandle.current = isResizeHandle.getAttribute('data-resize-handle');
      selectElements([elementId]);
      return;
    }

    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };

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
    setIsDraggingCanvas(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    selectElements([]);
  }, [selectElements]);

  // Handle mouse move for dragging and resizing
  const handleMouseMove = useCallback(throttle((e: MouseEvent) => {
    if (!isDragging.current || !canvasRef.current) return;

    const deltaX = (e.clientX - dragStartPos.current.x) / viewport.zoom;
    const deltaY = (e.clientY - dragStartPos.current.y) / viewport.zoom;

    if (resizeHandle.current && selectedElements.length === 1) {
      const element = elements.find(el => el.id === selectedElements[0]);
      if (!element) return;

      const newDimensions = { ...element.dimensions };
      const newPosition = { ...element.position };

      switch (resizeHandle.current) {
        case 'n': newDimensions.height -= deltaY; newPosition.y += deltaY; break;
        case 'ne': newDimensions.width += deltaX; newDimensions.height -= deltaY; newPosition.y += deltaY; break;
        case 'e': newDimensions.width += deltaX; break;
        case 'se': newDimensions.width += deltaX; newDimensions.height += deltaY; break;
        case 's': newDimensions.height += deltaY; break;
        case 'sw': newDimensions.width -= deltaX; newDimensions.height += deltaY; newPosition.x += deltaX; break;
        case 'w': newDimensions.width -= deltaX; newPosition.x += deltaX; break;
        case 'nw': newDimensions.width -= deltaX; newDimensions.height -= deltaY; newPosition.x += deltaX; newPosition.y += deltaY; break;
      }

      updateElement(element.id, {
        dimensions: {
          width: Math.max(10, newDimensions.width),
          height: Math.max(10, newDimensions.height)
        },
        position: newPosition
      });
    } else if (selectedElementsRef.current.length > 0) {
      selectedElementsRef.current.forEach(id => {
        const element = elements.find(el => el.id === id);
        if (element && !element.meta?.locked) {
          updateElement(id, {
            position: {
              x: element.position.x + deltaX,
              y: element.position.y + deltaY
            }
          });
        }
      });
    } else if (isDraggingCanvas) {
      updateDesignView({
        viewport: {
          ...viewport,
          position: {
            x: viewport.position.x - (e.clientX - dragStartPos.current.x),
            y: viewport.position.y - (e.clientY - dragStartPos.current.y)
          }
        }
      });
    }

    dragStartPos.current = { x: e.clientX, y: e.clientY };
  }, 16), [elements, selectedElements, updateElement, updateDesignView, viewport, isDraggingCanvas]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    setIsDraggingCanvas(false);
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

  // Render grid with premium styling
  const renderGrid = () => {
    if (!canvas.grid.enabled) return null;

    const gridSize = canvas.grid.size;
    const subDivisions = canvas.grid.subdivisions;
    const subGridSize = gridSize / subDivisions;
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    return (
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundImage: `
              linear-gradient(to right, ${gridColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
            `,
            opacity: canvas.grid.opacity
          }}
        />
        {subDivisions > 1 && (
          <div
            className="absolute inset-0"
            style={{
              backgroundSize: `${subGridSize}px ${subGridSize}px`,
              backgroundImage: `
                linear-gradient(to right, ${gridColor} 0.5px, transparent 0.5px),
                linear-gradient(to bottom, ${gridColor} 0.5px, transparent 0.5px)
              `,
              opacity: canvas.grid.opacity * 0.5
            }}
          />
        )}
      </div>
    );
  };

  // Render element with premium styling
  const renderElement = (element: DesignElement) => {
    const isSelected = selectedElements.includes(element.id);
    const isDefaultContainer = element.meta?.isDefaultContainer;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.dimensions.width}px`,
      height: `${element.dimensions.height}px`,
      zIndex: isDefaultContainer ? 0 : (isSelected ? 1000 : 1),
      cursor: isDefaultContainer ? 'default' : (isSelected ? 'move' : 'default'),
      pointerEvents: isDefaultContainer ? 'none' : 'auto',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      ...element.style
    };

    return (
      <div
        key={element.id}
        className={cn(
          "element",
          isDefaultContainer ? "default-container" : "",
          isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
        )}
        style={baseStyle}
        onMouseDown={isDefaultContainer ? undefined : (e) => handleMouseDown(e, element.id)}
        data-element-id={element.id}
      >
        {isSelected && !isDefaultContainer && renderSelectionHandles(element)}
        {isDefaultContainer && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium" style={{
            color: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
          }}>
            {activePreset.name} ({Math.round(element.dimensions.width)}×{Math.round(element.dimensions.height)})
          </div>
        )}
      </div>
    );
  };

  // Premium resize handles
  const renderSelectionHandles = (element: DesignElement) => {
    const handleSize = 8;
    const handleOffset = handleSize / 2;

    return (
      <>
        {['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map(handle => (
          <div
            key={handle}
            className={`absolute bg-blue-500 border-2 border-white z-10 resize-handle shadow-md`}
            data-resize-handle={handle}
            style={{
              width: `${handleSize}px`,
              height: `${handleSize}px`,
              cursor: `${handle}-resize`,
              left: handle.includes('w') ? `-${handleOffset}px` :
                handle.includes('e') ? `calc(100% - ${handleOffset}px)` : '50%',
              top: handle.includes('n') ? `-${handleOffset}px` :
                handle.includes('s') ? `calc(100% - ${handleOffset}px)` : '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%'
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden transition-colors duration-300",
      fullscreen ? "fixed inset-0 z-[100]" : "",
      theme === 'dark' ? "bg-gray-950" : "bg-gray-100"
    )}>
      {/* Glass morphism background */}
      <div className="absolute inset-0 opacity-[3%] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />

      {/* Premium control bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-background/90 backdrop-blur-lg rounded-full border shadow-lg px-4 py-2">
        <div className="flex items-center gap-1">
          {devicePresets.map(device => (
            <Button
              key={device.id}
              className={cn(
                "rounded-full p-2 h-8 w-8",
                activeDevice === device.id ? "bg-accent" : "bg-transparent hover:bg-accent/50"
              )}
              size="sm"
              variant="ghost"
              onClick={() => handleDeviceChange(device.id)}
              title={device.name}
            >
              {device.icon}
            </Button>
          ))}
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleGrid}
          className={cn(
            "rounded-full p-2 h-8 w-8",
            showGrid ? "bg-accent" : "bg-transparent hover:bg-accent/50"
          )}
          title="Toggle Grid"
        >
          <Grid className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            className="rounded-full p-2 h-8 w-8"
            title="Zoom Out"
          >
            -
          </Button>
          <span className="text-xs w-10 text-center font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            className="rounded-full p-2 h-8 w-8"
            title="Zoom In"
          >
            +
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetZoom}
          className="rounded-full p-2 h-8 w-8"
          title="Reset Zoom"
        >
          1:1
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="rounded-full p-2 h-8 w-8"
          title={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full p-2 h-8 w-8"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Canvas Content */}
      <div
        ref={canvasRef}
        className={cn(
          "relative w-full h-full flex items-center justify-center p-8 transition-all duration-300",
          isDraggingCanvas ? "cursor-grabbing" : "cursor-default"
        )}
        onMouseDown={handleCanvasMouseDown}
      >
        {/* Ultra-realistic MacBook Pro frame */}
        {activePreset.macbookStyle && (
          <div className="relative mt-9" style={{
            transform: `scale(${Math.min(1, 1200 / activePreset.dimensions.width)})`
          }}>
            {/* Screen frame with three dots */}
            <div className={cn(
              "relative mx-auto",
              activePreset.frameClass,
              activePreset.frameColor
            )}>
              {/* Three dots (red, yellow, green) */}
              <div className="absolute -top-5 left-4 flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
              </div>

              {/* Screen content */}
              <div
                className={cn(
                  "relative overflow-hidden mx-auto",
                  activePreset.screenClass,
                  theme === 'dark' ? "bg-gray-900" : "bg-gray-50"
                )}
                style={{
                  width: `${activePreset.dimensions.width}px`,
                  height: `${activePreset.dimensions.height}px`,
                }}
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

            {/* Keyboard area */}
            <div className={cn(
              "relative mx-auto mt-0",
              activePreset.keyboardClass
            )}>
              {/* Keyboard details */}
              <div className="w-full h-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-lg"></div>
              <div className="w-[80%] h-1 bg-gray-700 rounded-full mx-auto mt-2"></div>
              <div className="w-[60%] h-1 bg-gray-700 rounded-full mx-auto mt-1"></div>
            </div>

            {/* Base */}
            <div className={cn(
              "relative mx-auto",
              activePreset.macbookBaseClass
            )}>
              <div className={cn(
                "mx-auto",
                activePreset.footClass
              )} />
            </div>
          </div>
        )}


        {/* Mobile/tablet frame */}
        {!activePreset.macbookStyle && (
          <div className="relative" style={{
            transform: `scale(${Math.min(1, 1000 / activePreset.dimensions.width)})`
          }}>
            <div className={cn(
              "relative mx-auto",
              activePreset.frameClass,
              activePreset.frameColor
            )}>
              {/* Notch */}
              <div className={cn(
                "absolute -top-6 left-0 right-0 flex justify-center",
                activePreset.notchClass
              )} />

              {/* Screen content */}
              <div
                className={cn(
                  "relative overflow-hidden mx-auto",
                  activePreset.screenClass,
                  theme === 'dark' ? "bg-gray-900" : "bg-gray-50"
                )}
                style={{
                  width: `${activePreset.dimensions.width}px`,
                  height: `${activePreset.dimensions.height}px`,
                }}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;