// editor/components/design/properties-sheet.tsx
"use client";
import React, { useState } from 'react';
import { useDesignView } from '@/editor/editor-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualElement, LayoutElement, ComponentInstance, DesignElement, ElementTransform, LayoutConfig } from '@/editor/types';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet, ChevronDown, ChevronRight, Pencil, Database, Copy, Delete } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const PropertiesSheet = () => {
  const { selectedElements, elements, updateElement } = useDesignView();
  const [activeTab, setActiveTab] = useState('design');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    position: true,
    size: true,
    background: true,
    border: true,
    layout: true,
    transform: true,
    constraints: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  // Handle layout changes for layout elements
  const handleLayoutChange = (property: keyof LayoutConfig, value: any) => {
    if (isLayoutElement(element)) {
      const newLayoutConfig = { ...element.layoutConfig, [property]: value };
      updateElement(element.id, { layoutConfig: newLayoutConfig });
    }
  };

  // Handle transform changes
  const handleTransformChange = (property: keyof ElementTransform, value: any) => {
    if (hasTransform(element)) {
      updateElement(element.id, {
        transform: {
          ...element.transform,
          [property]: value
        }
      });
    }
  };

  // Handle constraint changes
  const handleConstraintChange = (axis: 'horizontal' | 'vertical', value: string) => {
    if (hasConstraints(element)) {
      updateElement(element.id, {
        constraints: {
          ...element.constraints,
          [axis]: value
        }
      });
    }
  };

  return (
    <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className=" border-l min-h-screen overflow-y-scroll bg-background flex flex-col items-center justify-start">
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center justify-between">
          <span>{element.meta.name}</span>
          <Button size="icon" variant={"ghost"}>
            <Copy />
            <Delete />
          </Button>
        </div>
      </div>
      {/* <div className="w-[280px] border-l h-full overflow-y-auto bg-background flex flex-col items-center justify-center"> */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none">
          <TabsTrigger value="design" className="py-2 text-xs">
            <Pencil className="h-5 w-5 " />
          </TabsTrigger>
          <TabsTrigger value="advanced" className="py-2 text-xs">
            <Database className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="p-4 space-y-4">
          {/* Position Section */}
          <Collapsible
            open={openSections.position}
            onOpenChange={() => toggleSection('position')}
            className="space-y-2"
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between">
              <Label className="text-xs">Position</Label>
              {openSections.position ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-2 gap-2 pt-2">
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
            </CollapsibleContent>
          </Collapsible>

          {/* Size Section */}
          <Collapsible
            open={openSections.size}
            onOpenChange={() => toggleSection('size')}
            className="space-y-2"
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between">
              <Label className="text-xs">Size</Label>
              {openSections.size ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={Math.round(element.dimensions.width)}
                    onChange={(e) => updateElement(element.id, {
                      dimensions: { ...element.dimensions, width: Number(e.target.value) }
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={Math.round(element.dimensions.height)}
                    onChange={(e) => updateElement(element.id, {
                      dimensions: { ...element.dimensions, height: Number(e.target.value) }
                    })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Only show style properties for visual elements */}
          {hasStyle(element) && (
            <>
              {/* Background Section */}
              <Collapsible
                open={openSections.background}
                onOpenChange={() => toggleSection('background')}
                className="space-y-2"
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between">
                  <Label className="text-xs">Background</Label>
                  {openSections.background ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pt-2">
                    <ColorPicker
                      value={element.style.[0]?.type === 'solid' ?
                        (element.style.fills[0].color ?? '#ffffff') : '#ffffff'}
                      onChange={(color) => handleColorChange('fills', color)}
                    />

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
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Border Section */}
              <Collapsible
                open={openSections.border}
                onOpenChange={() => toggleSection('border')}
                className="space-y-2"
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between">
                  <Label className="text-xs">Border</Label>
                  {openSections.border ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pt-2">
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

                    <div className="space-y-2">
                      <Label className="text-xs">Border Radius</Label>
                      <Slider
                        value={[parseInt(element.style.borderRadius?.replace('px', '') || '0')]}
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
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}

          {/* Layout properties for layout elements */}
          {isLayoutElement(element) && (
            <Collapsible
              open={openSections.layout}
              onOpenChange={() => toggleSection('layout')}
              className="space-y-2"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between">
                <Label className="text-xs">Layout</Label>
                {openSections.layout ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Direction</Label>
                    <Select
                      value={element.layoutMode}
                      onValueChange={(value) => {
                        updateElement(element.id, { layoutMode: value as any });
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="text-xs">None</SelectItem>
                        <SelectItem value="horizontal" className="text-xs">Horizontal</SelectItem>
                        <SelectItem value="vertical" className="text-xs">Vertical</SelectItem>
                        <SelectItem value="grid" className="text-xs">Grid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {element.layoutMode !== 'none' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs">Gap</Label>
                        <Input
                          type="number"
                          value={element.layoutConfig?.gap || 0}
                          onChange={(e) => handleLayoutChange('gap', Number(e.target.value))}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Padding</Label>
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <Label className="text-xs">Top</Label>
                            <Input
                              type="number"
                              value={element.layoutConfig?.padding?.top || 0}
                              onChange={(e) => handleLayoutChange('padding', {
                                ...element.layoutConfig?.padding,
                                top: Number(e.target.value)
                              })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Right</Label>
                            <Input
                              type="number"
                              value={element.layoutConfig?.padding?.right || 0}
                              onChange={(e) => handleLayoutChange('padding', {
                                ...element.layoutConfig?.padding,
                                right: Number(e.target.value)
                              })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Bottom</Label>
                            <Input
                              type="number"
                              value={element.layoutConfig?.padding?.bottom || 0}
                              onChange={(e) => handleLayoutChange('padding', {
                                ...element.layoutConfig?.padding,
                                bottom: Number(e.target.value)
                              })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Left</Label>
                            <Input
                              type="number"
                              value={element.layoutConfig?.padding?.left || 0}
                              onChange={(e) => handleLayoutChange('padding', {
                                ...element.layoutConfig?.padding,
                                left: Number(e.target.value)
                              })}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {element.layoutMode === 'grid' && (
                        <div className="space-y-2">
                          <Label className="text-xs">Grid Columns</Label>
                          <Input
                            type="number"
                            value={element.layoutConfig?.gridColumns || 1}
                            onChange={(e) => handleLayoutChange('gridColumns', Number(e.target.value))}
                            className="h-8 text-xs"
                            min={1}
                            max={12}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Transform properties */}
          {hasTransform(element) && (
            <Collapsible
              open={openSections.transform}
              onOpenChange={() => toggleSection('transform')}
              className="space-y-2"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between">
                <Label className="text-xs">Transform</Label>
                {openSections.transform ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Rotation</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[element.transform.rotation]}
                        min={-180}
                        max={180}
                        step={1}
                        onValueChange={([value]) => handleTransformChange('rotation', value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={element.transform.rotation}
                        onChange={(e) => handleTransformChange('rotation', Number(e.target.value))}
                        className="h-8 w-16 text-xs"
                        min={-180}
                        max={180}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Skew</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">X</Label>
                        <Input
                          type="number"
                          value={element.transform.skew.x}
                          onChange={(e) => handleTransformChange('skew', {
                            ...element.transform.skew,
                            x: Number(e.target.value)
                          })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y</Label>
                        <Input
                          type="number"
                          value={element.transform.skew.y}
                          onChange={(e) => handleTransformChange('skew', {
                            ...element.transform.skew,
                            y: Number(e.target.value)
                          })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Transform Origin</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">X</Label>
                        <Slider
                          value={[element.transform.origin.x * 100]}
                          max={100}
                          step={1}
                          onValueChange={([value]) => handleTransformChange('origin', {
                            ...element.transform.origin,
                            x: value / 100
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y</Label>
                        <Slider
                          value={[element.transform.origin.y * 100]}
                          max={100}
                          step={1}
                          onValueChange={([value]) => handleTransformChange('origin', {
                            ...element.transform.origin,
                            y: value / 100
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Constraints properties */}
          {hasConstraints(element) && (
            <Collapsible
              open={openSections.constraints}
              onOpenChange={() => toggleSection('constraints')}
              className="space-y-2"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between">
                <Label className="text-xs">Constraints</Label>
                {openSections.constraints ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Horizontal</Label>
                    <Select
                      value={element.constraints.horizontal}
                      onValueChange={(value) => handleConstraintChange('horizontal', value)}
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

                  <div className="space-y-2">
                    <Label className="text-xs">Vertical</Label>
                    <Select
                      value={element.constraints.vertical}
                      onValueChange={(value) => handleConstraintChange('vertical', value)}
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
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Component instance properties */}
          {isComponentInstance(element) && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Component ID</Label>
                <Input
                  value={element.componentId}
                  readOnly
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Props</Label>
                <div className="space-y-2">
                  {Object.entries(element.props).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-2">
                      <div className="text-xs text-muted-foreground truncate">{key}</div>
                      <div className="text-xs truncate">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="p-4 space-y-4">
          {/* Advanced properties would go here */}
          <div className="space-y-2">
            <Label className="text-xs">Element ID</Label>
            <Input
              value={element.id}
              readOnly
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Type</Label>
            <Input
              value={element.type}
              readOnly
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Created</Label>
            <Input
              value={new Date(element.meta.created).toLocaleString()}
              readOnly
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Modified</Label>
            <Input
              value={new Date(element.meta.modified).toLocaleString()}
              readOnly
              className="h-8 text-xs"
            />
          </div>
        </TabsContent>
      </Tabs>
      {/* </div> */}
    </ResizablePanel>
  );
};

export default PropertiesSheet;