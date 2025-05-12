// editor/components/design/properties-sheet.tsx
"use client";
import React, { useState } from 'react';
import { useDesignView } from '@/editor/editor-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualElement, LayoutElement, ComponentInstance, DesignElement } from '@/editor/types';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const PropertiesSheet = () => {
  const { selectedElements, elements, updateElement } = useDesignView();
  const [activeTab, setActiveTab] = useState('design');
  
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
  
  if (selectedElements.length !== 1) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        {selectedElements.length === 0 
          ? "Select an element to edit its properties" 
          : "Multi-selection editing coming soon"}
      </div>
    );
  }
  
  const element = elements.find(el => el.id === selectedElements[0]);
  if (!element) return null;

  // Type guards
  const isVisualElement = (element: DesignElement): element is VisualElement => {
    return ['rectangle', 'ellipse', 'text', 'image', 'vector', 'icon'].includes(element.type);
  };

  const isLayoutElement = (element: DesignElement): element is LayoutElement => {
    return ['frame', 'section', 'grid', 'stack'].includes(element.type);
  };

  const isComponentInstance = (element: DesignElement): element is ComponentInstance => {
    return element.type === 'component';
  };

  const hasStyle = (element: DesignElement): element is VisualElement => {
    return isVisualElement(element);
  };

  const hasTransform = (element: DesignElement): element is VisualElement | ComponentInstance => {
    return isVisualElement(element) || isComponentInstance(element);
  };

  const hasConstraints = (element: DesignElement): element is VisualElement | LayoutElement | ComponentInstance => {
    return isVisualElement(element) || isLayoutElement(element) || isComponentInstance(element);
  };

  // Handle color changes for visual elements
  const handleColorChange = (property: 'fills' | 'borders', color: string, index = 0) => {
    if (isVisualElement(element)) {
      const newStyle = { ...element.style };
      
      if (property === 'fills') {
        newStyle.fills = newStyle.fills.map((fill, i) => 
          i === index ? { ...fill, color: color as `#${string}`, type: 'solid' } : fill
        );
        if (newStyle.fills.length === 0) {
          newStyle.fills = [{ type: 'solid', color: color as `#${string}`, opacity: 1, blendMode: 'normal' }];
        }
      } else if (property === 'borders') {
        newStyle.borders = newStyle.borders.map((border, i) => 
          i === index ? { ...border, color: color as `#${string}` } : border
        );
        if (newStyle.borders.length === 0) {
          newStyle.borders = [{ 
            position: 'inside', 
            thickness: 1, 
            color: color as `#${string}`, 
            style: 'solid' 
          }];
        }
      }

      updateElement(element.id, { style: newStyle });
    }
  };

  return (
    <div className="w-[280px] border-l h-full overflow-y-auto bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none">
          <TabsTrigger value="design" className="py-2 text-xs">Design</TabsTrigger>
          <TabsTrigger value="advanced" className="py-2 text-xs">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="design" className="p-4 space-y-4">
          {/* Device Preset Selector */}
          <div className="space-y-2">
            <Label className="text-xs">Device Preset</Label>
            <div className="grid grid-cols-3 gap-2">
              {devicePresets.map(device => (
                <Button
                  key={device.id}
                  variant="outline"
                  size="sm"
                  className="h-8 p-0 flex flex-col items-center justify-center gap-1"
                  onClick={() => handleDeviceChange(device.id)}
                >
                  {device.icon}
                  <span className="text-xs">{device.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Position & Size Controls */}
          <div className="space-y-2">
            <Label className="text-xs">Position</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">X</Label>
                <Input 
                  type="number" 
                  value={Math.round(element.position.x)} 
                  onChange={(e) => updateElement(element.id, {
                    position: { ...element.position, x: Number(e.target.value) }
                  })}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Y</Label>
                <Input 
                  type="number" 
                  value={Math.round(element.position.y)} 
                  onChange={(e) => updateElement(element.id, {
                    position: { ...element.position, y: Number(e.target.value) }
                  })}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
          
          {/* Only show style properties for visual elements */}
          {hasStyle(element) && (
            <>
              {/* Background Color */}
              <div className="space-y-2">
                <Label className="text-xs">Background</Label>
                <ColorPicker
                  value={element.style.fills[0]?.type === 'solid' ? 
                    (element.style.fills[0].color ?? '#ffffff') : '#ffffff'}
                  onChange={(color) => handleColorChange('fills', color)}
                />
              </div>
              
              {/* Opacity */}
              <div className="space-y-2">
                <Label className="text-xs">Opacity</Label>
                <Slider
                  value={[element.style.opacity * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => {
                    updateElement(element.id, {
                      style: { ...element.style, opacity: value / 100 }
                    });
                  }}
                />
              </div>
              
              {/* Border */}
              <div className="space-y-2">
                <Label className="text-xs">Border</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Label className="text-xs">Color</Label>
                    <ColorPicker
                      value={element.style.borders[0]?.color || '#000000'}
                      onChange={(color) => handleColorChange('borders', color)}
                      small
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Width</Label>
                    <Input 
                      type="number" 
                      value={element.style.borders[0]?.thickness || 0} 
                      onChange={(e) => {
                        if (isVisualElement(element)) {
                          const newStyle = { ...element.style };
                          newStyle.borders = newStyle.borders.map((border, i) => 
                            i === 0 ? { ...border, thickness: Number(e.target.value) } : border
                          );
                          if (newStyle.borders.length === 0) {
                            newStyle.borders = [{ 
                              position: 'inside', 
                              thickness: Number(e.target.value), 
                              color: '#000000', 
                              style: 'solid' 
                            }];
                          }
                          updateElement(element.id, { style: newStyle });
                        }
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Style</Label>
                  <Select
                    value={element.style.borders[0]?.style || 'solid'}
                    onValueChange={(value) => {
                      if (isVisualElement(element)) {
                        const newStyle = { ...element.style };
                        newStyle.borders = newStyle.borders.map((border, i) => 
                          i === 0 ? { ...border, style: value as any } : border
                        );
                        if (newStyle.borders.length === 0) {
                          newStyle.borders = [{ 
                            position: 'inside', 
                            thickness: 1, 
                            color: '#000000', 
                            style: value as any 
                          }];
                        }
                        updateElement(element.id, { style: newStyle });
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Border style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid" className="text-xs">Solid</SelectItem>
                      <SelectItem value="dashed" className="text-xs">Dashed</SelectItem>
                      <SelectItem value="dotted" className="text-xs">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Border Radius */}
              {/* <div className="space-y-2">
                <Label className="text-xs">Border Radius</Label>
                <Slider
                  value={[parseInt(element.style.borderRadius || '0')]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => {
                    if (isVisualElement(element)) {
                      updateElement(element.id, {
                        style: { ...element.style, borderRadius: `${value}px` }
                      });
                    }
                  }}
                />
              </div> */}
            </>
          )}
        </TabsContent>
        
<TabsContent value="advanced" className="p-4 space-y-4">
          {/* Only show transform for elements that have it */}
          {/* {hasTransform(element) && (
            <div className="space-y-2">
              <Label className="text-xs">Rotation</Label>
              <Slider
                value={[element.transform.rotation]}
                max={360}
                min={-360}
                step={1}
                onValueChange={([value]) => updateElement(element.id, {
                  transform: { ...element.transform, rotation: value }
                })}
              />
            </div>
          )} */}
          
          {/* Only show constraints for elements that have them */}
          {hasConstraints(element) && (
            <div className="space-y-2">
              <Label className="text-xs">Constraints</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Horizontal</Label>
                  <Select
                    value={element.constraints.horizontal}
                    onValueChange={(value) => updateElement(element.id, {
                      constraints: { 
                        ...element.constraints, 
                        horizontal: value as any 
                      }
                    })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scale" className="text-xs">Scale</SelectItem>
                      <SelectItem value="left" className="text-xs">Left</SelectItem>
                      <SelectItem value="right" className="text-xs">Right</SelectItem>
                      <SelectItem value="leftAndRight" className="text-xs">Left & Right</SelectItem>
                      <SelectItem value="center" className="text-xs">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Vertical</Label>
                  <Select
                    value={element.constraints.vertical}
                    onValueChange={(value) => updateElement(element.id, {
                      constraints: { 
                        ...element.constraints, 
                        vertical: value as any 
                      }
                    })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scale" className="text-xs">Scale</SelectItem>
                      <SelectItem value="top" className="text-xs">Top</SelectItem>
                      <SelectItem value="bottom" className="text-xs">Bottom</SelectItem>
                      <SelectItem value="topAndBottom" className="text-xs">Top & Bottom</SelectItem>
                      <SelectItem value="center" className="text-xs">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertiesSheet;