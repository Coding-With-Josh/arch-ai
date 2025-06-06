"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDesignView } from '@/editor/editor-provider';
import { DesignElement, UUID, Position, Dimensions, StyleProperties } from '@/editor/types';
import { useDrop } from 'react-dnd';
import { throttle } from 'lodash';
import { Button } from '@/components/ui/button';
import { Grid, Maximize, Minimize, Monitor, Moon, Smartphone, Sun, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { ElementFactory } from '../../elements/element-factory';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

interface DevicePreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  dimensions: Dimensions;
  frameClass: string;
  notchClass?: string;
  frameColor: string;
  screenClass: string;
  scale: number;
  macbookStyle?: boolean;
  macbookNotchClass?: string;
  macbookBaseClass?: string;
  keyboardClass?: string;
  footClass?: string;
}

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
    updateDesignView,
    deleteElement,
  } = useDesignView();

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const selectedElementsRef = useRef<UUID[]>([]);
  const resizeHandle = useRef<string | null>(null);
  const elementRefs = useRef<Record<UUID, React.RefObject<HTMLDivElement | null>>>({});
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeDevice, setActiveDevice] = useState('macbook');
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<Position | null>(null);

  const getElementRef = useCallback((id: UUID) => {
    if (!elementRefs.current[id]) {
      elementRefs.current[id] = React.createRef<HTMLDivElement>();
    }
    return elementRefs.current[id];
  }, []);

  useEffect(() => {
    return () => {
        // Cleanup any duplicate default containers when component unmounts
        const defaultContainers = elements.filter(el => el.id === "default-container");
        if (defaultContainers.length > 1) {
            const containersToRemove = defaultContainers.slice(1);
            containersToRemove.forEach(container => {
                deleteElement(container.id);
            });
        }
    };
}, [elements, deleteElement]);

  useEffect(() => {
    const currentIds = new Set(elements.map(el => el.id));
    Object.keys(elementRefs.current).forEach(id => {
      if (!currentIds.has(id as UUID)) {
        delete elementRefs.current[id as UUID];
      }
    });
  }, [elements]);

  const devicePresets: DevicePreset[] = [
    {
      id: 'iphone',
      name: 'iPhone 15 Pro',
      icon: <Smartphone className="h-4 w-4" />,
      dimensions: { width: 393, height: 800 },
      frameClass: 'rounded-[3rem] border-[1rem] border-zinc-900',
      notchClass: 'w-[30%] h-6 bg-zinc-900 rounded-b-xl mx-auto',
      frameColor: 'bg-zinc-900',
      screenClass: 'rounded-[2rem]',
      scale: 0.7
    },
    {
      id: 'ipad',
      name: 'iPad Pro',
      icon: <Tablet className="h-4 w-4" />,
      dimensions: { width: 600, height: 800 },
      frameClass: 'rounded-[1rem] border-[1.5rem] border-zinc-800 scale-70',
      notchClass: 'w-[20%] h-6 bg-zinc-800 rounded-b-lg mx-auto',
      frameColor: 'bg-zinc-800',
      screenClass: 'rounded-[0.5rem]',
      scale: 0.6
    },
    {
      id: 'macbook',
      name: 'MacBook Pro 16"',
      icon: <Monitor className="h-4 w-4" />,
      dimensions: { width: 1728, height: 1117 },
      frameClass: 'rounded-xl border-[0.5rem] border-zinc-800',
      frameColor: 'bg-zinc-800',
      macbookStyle: true,
      macbookNotchClass: 'w-[20%] h-8 bg-zinc-800 rounded-b-lg mx-auto',
      macbookBaseClass: 'w-[110%] h-24 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-b-3xl -ml-[5%]',
      screenClass: 'rounded-lg',
      keyboardClass: 'w-[105%] h-16 bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-b-2xl -ml-[2.5%]',
      footClass: 'w-[30%] h-2 bg-zinc-950 rounded-b-lg mx-auto mt-1',
      scale: 0.5
    }
  ];

  const activePreset = devicePresets.find(d => d.id === activeDevice) || devicePresets[2];
  
  const handleDeviceChange = (deviceId: string) => {
    const device = devicePresets.find(d => d.id === deviceId);
    if (device) {
      setActiveDevice(deviceId);
      const defaultContainer = elements.find(el => el.id === 'default-container');
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
  }
  // Initialize default container
// In your Canvas component
// useEffect(() => {
//   // Check if we already have exactly one default container
//   const defaultContainers = elements.filter(el => el.id === "default-container");
  
//   if (elements.length === 0 && defaultContainers.length === 0) {
//       const defaultContainer: DesignElement = {
//           id: "default-container" as UUID,
//           componentType: 'container',
//           position: { x: 0, y: 0 },
//           dimensions: activePreset.dimensions,
//           props: {
//               style: {
//                   backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.5)' : 'rgba(250, 250, 250, 0.7)',
//                   border: theme === 'dark' ? '1px dashed rgba(255, 255, 255, 0.1)' : '1px dashed rgba(0, 0, 0, 0.1)',
//                   backdropFilter: 'blur(4px)',
//                   WebkitBackdropFilter: 'blur(4px)',
//                   width: "100%",
//                   height: "100%",
//                   zIndex: 5000,
//               } as StyleProperties
//           },
//           meta: {
//               name: "Main Container",
//               created: Date.now(),
//               modified: Date.now(),
//               createdBy: 'system' as UUID,
//               componentSource: 'core'
//           }
//       };
//       addElement(defaultContainer);
//   } else if (defaultContainers.length > 1) {
//       // Clean up duplicates if they exist
//       const containersToRemove = defaultContainers.slice(1);
//       containersToRemove.forEach(container => {
//           // You'll need a removeElement function in your useDesignView hook
//           deleteElement(container.id);
//       });
//   }
// }, [activePreset.dimensions, addElement, elements, theme, deleteElement]);
//   const handleDeviceChange = (deviceId: string) => {
//     const device = devicePresets.find(d => d.id === deviceId);
//     if (device) {
//       setActiveDevice(deviceId);
//       const defaultContainer = elements.find(el => el.id === 'default-container');
//       if (defaultContainer) {
//         updateElement(defaultContainer.id, {
//           dimensions: device.dimensions
//         });
//       }
//       updateDesignView({
//         canvas: {
//           ...canvas,
//           dimensions: device.dimensions
//         }
//       });
//     }
//   };

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


  const toggleFullscreen = () => setFullscreen(!fullscreen);
  const zoomIn = () => setZoom(prev => Math.min(3, prev + 0.1));
  const zoomOut = () => setZoom(prev => Math.max(0.2, prev - 0.1));
  const resetZoom = () => setZoom(1);

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
        componentType: item.type,
        position,
        dimensions: { width: 100, height: 40 },
        props: {
          style: {
            backgroundColor: theme === 'dark' ? 'rgba(82, 82, 91, 0.5)' : 'rgba(212, 212, 216, 0.5)',
            border: theme === 'dark' ? '1px solid rgba(63, 63, 70, 0.8)' : '1px solid rgba(228, 228, 231, 0.8)'
          } as StyleProperties,
        },
        meta: {
          name: item.name,
          created: Date.now(),
          modified: Date.now(),
          createdBy: 'user' as UUID,
          componentSource: 'core'
        }
      };

      addElement(newElement);
      selectElements([newElement.id]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [viewport, addElement, selectElements, theme]);

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

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement) !== canvasRef.current) return;
    isDragging.current = true;
    setIsDraggingCanvas(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    selectElements([]);
  }, [selectElements]);

  const handleContextMenu = (e: React.MouseEvent, elementId: UUID | null = null) => {
    e.preventDefault();
    if (elementId) {
      if (!selectedElements.includes(elementId)) {
        selectElements([elementId]);
      }
    } else {
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = useCallback(throttle((e: MouseEvent) => {
    if (!isDragging.current || !canvasRef.current) return;

    const deltaX = (e.clientX - dragStartPos.current.x) / viewport.zoom;
    const deltaY = (e.clientY - dragStartPos.current.y) / viewport.zoom;

    if (resizeHandle.current && selectedElements.length === 1) {
      const element = elements.find(el => el.id === selectedElements[0]);
      if (!element) return;

      const newDimensions: Dimensions = { width: element.dimensions?.width ?? 0, height: element.dimensions?.height ?? 0 };
      const newPosition = { ...element.position };

      switch (resizeHandle.current) {
        case 'n': 
          newDimensions.height = Math.max(10, (newDimensions.height ?? 0) - deltaY); 
          newPosition.y += deltaY; 
          break;
        case 'ne': 
          newDimensions.width = Math.max(10, newDimensions.width ?? 0 + deltaX); 
          newDimensions.height = Math.max(10, newDimensions.height ?? 0 - deltaY); 
          newPosition.y += deltaY; 
          break;
        case 'e': 
          newDimensions.width = Math.max(10, newDimensions.width ?? 0 + deltaX); 
          break;
        case 'se': 
          newDimensions.width = Math.max(10, newDimensions.width ?? 0 + deltaX); 
          newDimensions.height = Math.max(10, newDimensions.height ?? 0 + deltaY); 
          break;
        case 's': 
          newDimensions.height = Math.max(10, newDimensions.height ?? 0 + deltaY); 
          break;
        case 'sw': 
          newDimensions.width = Math.max(10, newDimensions.width ?? 0 - deltaX); 
          newDimensions.height = Math.max(10, newDimensions.height ?? 0 + deltaY); 
          newPosition.x += deltaX; 
          break;
        case 'w': 
          newDimensions.width = Math.max(10, newDimensions.width ?? 0 - deltaX); 
          newPosition.x += deltaX; 
          break;
        case 'nw': 
          newDimensions.width = Math.max(10, newDimensions.width ?? 0 - deltaX); 
          newDimensions.height = Math.max(10, newDimensions.height ?? 0 - deltaY); 
          newPosition.x += deltaX; 
          newPosition.y += deltaY; 
          break;
      }

      updateElement(element.id, {
        dimensions: newDimensions,
        position: newPosition
      });
    } else if (selectedElementsRef.current.length > 0) {
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

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    setIsDraggingCanvas(false);
    resizeHandle.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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

  const updateElementStyle = (elementId: UUID, styleUpdates: Partial<StyleProperties>) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      updateElement(elementId, {
        props: {
          ...element.props,
          style: {
            ...element.props?.style,
            ...styleUpdates
          }
        }
      });
    }
  };

  const renderElement = (element: DesignElement) => {
    // Skip duplicate default containers
    if (element.id === "default-container") {
      const allDefaults = elements.filter(el => el.id === "default-container");
      if (allDefaults.length > 1 && allDefaults[0].id !== element.id) {
          return null;
      }
  }

  const isSelected = selectedElements.includes(element.id);
    const isDefaultContainer = element.id === "default-container";
    const isResizable = ['box', 'container', 'grid', 'stack', 'section', 'carousel', 'modal', 'tabs'].includes(element.componentType);
  
    const elementStyles: React.CSSProperties = {
        position: 'absolute',
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.dimensions?.width}px`,
        height: `${element.dimensions?.height}px`,
        zIndex: isDefaultContainer ? 0 : (isSelected ? 1000 : 1),
        ...element.props?.style
    };
  
    return (
      <div key={element.id}> {/* Key moved here to the actual rendered div */}
      <ElementFactory 
          element={element} 
          style={elementStyles}
          className={cn(
              isSelected && "ring-2 ring-blue-500 ring-offset-2",
              element.props?.className
          )}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
          onContextMenu={(e) => handleContextMenu(e, element.id)}
          ref={isResizable ? getElementRef(element.id) : undefined}
      />

      {isSelected && !isDefaultContainer && (
          <div 
              className="absolute pointer-events-none"
              style={{
                  left: `${element.position.x}px`,
                  top: `${element.position.y}px`,
                  width: `${element.dimensions?.width}px`,
                  height: `${element.dimensions?.height}px`,
                  zIndex: isSelected ? 1000 : 1,
              }}
          >
              {renderSelectionHandles(element)}
          </div>
      )}
      
      {isDefaultContainer && (
          <div 
              className="absolute flex items-center justify-center text-sm font-medium pointer-events-none"
              style={{
                  left: `${element.position.x}px`,
                  top: `${element.position.y}px`,
                  width: `${element.dimensions?.width}px`,
                  height: `${element.dimensions?.height}px`,
                  color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  zIndex: 10
              }}
          >
              {activePreset.name} ({Math.round(element.dimensions?.width || 0)}×{Math.round(element.dimensions?.height || 0)})
          </div>
      )}
  </div>
);
};

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden transition-colors duration-300",
      fullscreen ? "fixed inset-0 z-[100]" : "",
      theme === 'dark' ? "bg-zinc-950" : "bg-zinc-100"
    )}>
      {/* Drop target layer */}
      <div
        ref={(node: HTMLDivElement | null) => { drop(node); }}
        className="absolute inset-0"
        style={{
          pointerEvents: isDraggingCanvas ? 'none' : 'auto'
        }}
        onContextMenu={handleContextMenu}
      >
        {/* Main canvas content */}
        <div
          ref={canvasRef}
          className={cn(
            "relative w-full h-full flex items-center justify-center p-8 transition-all duration-300",
            isDraggingCanvas ? "cursor-grabbing" : "cursor-default"
          )}
          onMouseDown={handleCanvasMouseDown}
        >
          {activePreset.macbookStyle ? (
            <div className="relative mt-9" style={{ transform: `scale(${Math.min(1, 1200 / activePreset.dimensions.width)})` }}>
              <div className={cn("relative mx-auto", activePreset.frameClass, activePreset.frameColor)}>
                <div className="absolute top-4 z-[5000] left-4 flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
                </div>

                <div
                  className={cn(
                    "relative overflow-hidden mx-auto",
                    activePreset.screenClass,
                    theme === 'dark' ? "bg-zinc-900" : "bg-zinc-50"
                  )}
                  style={{
                    width: `${activePreset.dimensions.width}px`,
                    height: `${activePreset.dimensions.height}px`,
                  }}
                >
                  {renderGrid()}
                  <div
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
              <div className={cn("relative mx-auto mt-0", activePreset.keyboardClass)}>
                <div className="w-full h-8 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-t-lg"></div>
                <div className="w-[80%] h-1 bg-zinc-700 rounded-full mx-auto mt-2"></div>
                <div className="w-[60%] h-1 bg-zinc-700 rounded-full mx-auto mt-1"></div>
              </div>
            </div>
          ) : (
            <div className="relative" style={{ transform: `scale(${Math.min(1, 1000 / activePreset.dimensions.width)})` }}>
              <div className={cn("relative mx-auto", activePreset.frameClass, activePreset.frameColor)}>
                <div className={cn("absolute -top-6 left-0 right-0 flex justify-center", activePreset.notchClass)} />
                <div
                  className={cn(
                    "relative overflow-hidden mx-auto",
                    activePreset.screenClass,
                    theme === 'dark' ? "bg-zinc-900" : "bg-zinc-50"
                  )}
                  style={{
                    width: `${activePreset.dimensions.width}px`,
                    height: `${activePreset.dimensions.height}px`,
                  }}
                >
                  {renderGrid()}
                  <div
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

      {/* Canvas Context Menu */}
      {contextMenuPosition && (
        <div 
          className="fixed bg-background border rounded-md shadow-lg z-50"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="p-1">
            <button 
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-sm"
              onClick={() => {
                const defaultContainer = elements.find(el => el.id === 'default-container');
                if (defaultContainer) {
                  updateElementStyle(defaultContainer.id, { 
                    backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.5)' : 'rgba(250, 250, 250, 0.7)'
                  });
                }
                setContextMenuPosition(null);
              }}
            >
              Reset Background
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-sm"
              onClick={() => {
                const defaultContainer = elements.find(el => el.id === 'default-container');
                if (defaultContainer) {
                  updateElementStyle(defaultContainer.id, { 
                    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                  });
                }
                setContextMenuPosition(null);
              }}
            >
              Solid Background
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-sm"
              onClick={() => {
                setContextMenuPosition(null);
                resetZoom();
              }}
            >
              Reset View
            </button>
          </div>
        </div>
      )}

      {/* Control bar */}
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
    </div>
  );
};

export default Canvas;