"use client";
import React, { useState, useMemo } from 'react';
import { useDesignView } from '@/editor/editor-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { ResizablePanel } from '@/components/ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Pencil, Database, Grid, Copy, Delete, LayoutGrid, Box, Type, Image, Code, Zap, EyeOff, Lock, Unlock, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, AlignHorizontalJustifyStart, AlignHorizontalJustifyEnd, AlignVerticalJustifyStart, AlignVerticalJustifyEnd } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { DesignElement } from '@/editor/types';

const PropertiesSheet = () => {
  const { selectedElements, elements, updateElement } = useDesignView();
  const [activeTab, setActiveTab] = useState('design');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    layout: true,
    style: true,
    constraints: true,
    interactions: true,
    accessibility: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const element = useMemo(() => {
    return elements.find(el => el.id === selectedElements[0]);
  }, [selectedElements, elements]);

  if (selectedElements.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full text-center">
        <LayoutGrid className="h-8 w-8 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Select an element to edit properties</p>
      </div>
    );
  }

  if (selectedElements.length > 1) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full text-center">
        <Box className="h-8 w-8 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{selectedElements.length} elements selected</p>
        <p className="text-xs text-muted-foreground mt-1">Group editing coming soon</p>
      </div>
    );
  }

  if (!element) return null;

  const handlePropChange = (propPath: string, value: any) => {
    const pathParts = propPath.split('.');
    const lastPart = pathParts.pop()!;

    let current = { ...element };
    let target = current;

    for (const part of pathParts) {
      if (!target[part]) target[part] = {};
      target = target[part];
    }

    target[lastPart] = value;
    updateElement(element.id, current);
  };

  const handleStyleChange = (property: string, value: any) => {
    handlePropChange(`props.style.${property}`, value);
  };

  const handleLayoutChange = (property: string, value: any) => {
    handlePropChange(`layout.${property}`, value);
  };

  const renderIconForType = (type: string) => {
    switch (type) {
      case 'text': return <Type className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'button': return <Zap className="h-4 w-4" />;
      case 'grid': return <Grid className="h-4 w-4" />;
      default: return <Box className="h-4 w-4" />;
    }
  };

  // Safely get position and dimensions with defaults
  const position = element.position || { x: 0, y: 0 };
  const dimensions = element.dimensions || { width: 100, height: 100 };

  return (
    <ResizablePanel defaultSize={28} minSize={20} maxSize={30}
      className="border-l bg-background flex flex-col"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderIconForType(element.componentType)}
              <h3 className="font-medium text-sm capitalize">
                {element.componentType || 'Element'}
              </h3>
              <Badge variant="outline" className="text-xs">
                {element.meta?.componentSource || 'custom'}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider><Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handlePropChange('props.style.visibility',
                      element.props?.style?.visibility === 'hidden' ? 'visible' : 'hidden')}
                  >
                    {element.props?.style?.visibility === 'hidden' ?
                      <EyeOff className="h-4 w-4" /> :
                      <Lock className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {element.props?.style?.visibility === 'hidden' ? 'Show element' : 'Lock element'}
                </TooltipContent>
              </Tooltip></TooltipProvider>
              <TooltipProvider><Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Duplicate</TooltipContent>
              </Tooltip></TooltipProvider>
              <TooltipProvider><Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                    <Delete className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Delete</TooltipContent>
              </Tooltip></TooltipProvider>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
              <TabsTrigger value="design" className="py-2 text-xs">
                <Pencil className="h-4 w-4 mr-2" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="advanced" className="py-2 text-xs">
                <Code className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="p-4 space-y-6">
              {/* Layout Section */}
              <Collapsible
                open={openSections.layout}
                onOpenChange={() => toggleSection('layout')}
                className="space-y-4"
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Layout</Label>
                  </div>
                  {openSections.layout ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs mb-1 block">X</Label>
                      <Input
                        type="number"
                        value={Math.round(position.x)}
                        onChange={(e) => handlePropChange('position.x', Number(e.target.value))}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Y</Label>
                      <Input
                        type="number"
                        value={Math.round(position.y)}
                        onChange={(e) => handlePropChange('position.y', Number(e.target.value))}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Width</Label>
                      <Input
                        type="number"
                        value={Math.round(dimensions.width)}
                        onChange={(e) => handlePropChange('dimensions.width', Number(e.target.value))}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Height</Label>
                      <Input
                        type="number"
                        value={Math.round(dimensions.height)}
                        onChange={(e) => handlePropChange('dimensions.height', Number(e.target.value))}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-2 block">Position Type</Label>
                    <Select
                      value={element.layout?.position || 'relative'}
                      onValueChange={(value) => handleLayoutChange('position', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relative" className="text-xs">Relative</SelectItem>
                        <SelectItem value="absolute" className="text-xs">Absolute</SelectItem>
                        <SelectItem value="fixed" className="text-xs">Fixed</SelectItem>
                        <SelectItem value="sticky" className="text-xs">Sticky</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs mb-2 block">Display</Label>
                    <Select
                      value={element.props?.style?.display || 'block'}
                      onValueChange={(value) => handleStyleChange('display', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block" className="text-xs">Block</SelectItem>
                        <SelectItem value="flex" className="text-xs">Flex</SelectItem>
                        <SelectItem value="grid" className="text-xs">Grid</SelectItem>
                        <SelectItem value="inline" className="text-xs">Inline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {element.props?.style?.display === 'flex' && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs mb-2 block">Direction</Label>
                        <Select
                          value={element.props.style?.flexDirection || 'row'}
                          onValueChange={(value) => handleStyleChange('flexDirection', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="row" className="text-xs">Row</SelectItem>
                            <SelectItem value="column" className="text-xs">Column</SelectItem>
                            <SelectItem value="row-reverse" className="text-xs">Row Reverse</SelectItem>
                            <SelectItem value="column-reverse" className="text-xs">Column Reverse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs mb-2 block">Justify Content</Label>
                        <div className="flex gap-1">
                          <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleStyleChange('justifyContent', 'flex-start')}
                              >
                                <AlignHorizontalJustifyStart className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Start</TooltipContent>
                          </Tooltip></TooltipProvider>
                          <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleStyleChange('justifyContent', 'center')}
                              >
                                <AlignHorizontalJustifyCenter className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Center</TooltipContent>
                          </Tooltip></TooltipProvider>
                          <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleStyleChange('justifyContent', 'flex-end')}
                              >
                                <AlignHorizontalJustifyEnd className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">End</TooltipContent>
                          </Tooltip></TooltipProvider>
                          <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleStyleChange('justifyContent', 'space-between')}
                              >
                                <AlignLeft className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Space Between</TooltipContent>
                          </Tooltip></TooltipProvider>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs mb-2 block">Align Items</Label>
                        <div className="flex gap-1">
                          <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleStyleChange('alignItems', 'flex-start')}
                              >
                                <AlignVerticalJustifyStart className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Start</TooltipContent>
                          </Tooltip></TooltipProvider>
                          <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleStyleChange('alignItems', 'center')}
                              >
                                <AlignVerticalJustifyCenter className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Center</TooltipContent>
                          </Tooltip></TooltipProvider>
                          <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleStyleChange('alignItems', 'flex-end')}
                              >
                                <AlignVerticalJustifyEnd className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">End</TooltipContent>
                          </Tooltip></TooltipProvider>
                        </div>
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Style Section */}
              <Collapsible
                open={openSections.style}
                onOpenChange={() => toggleSection('style')}
                className="space-y-4"
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Style</Label>
                  </div>
                  {openSections.style ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <div>
                    <Label className="text-xs mb-2 block">Background Color</Label>
                    <ColorPicker
                      value={element.props?.style?.backgroundColor as `#${string}` || '#ffffff'}
                      onChange={(color) => handleStyleChange('backgroundColor', color)}
                    />
                  </div>

                  <div>
                    <Label className="text-xs mb-2 block">Opacity</Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[element.props?.style?.opacity ? Math.round(Number(element.props.style.opacity) * 100) : 100]}
                        max={100}
                        step={1}
                        onValueChange={([value]) => handleStyleChange('opacity', value / 100)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={String(element.props?.style?.opacity ? Math.round(Number(element.props.style.opacity) * 100) : 100)}
                        onChange={(e) => handleStyleChange('opacity', Number(e.target.value) / 100)}
                        className="h-8 w-12 text-xs"
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-xs mb-2 block">Border</Label>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label className="text-xs mb-1 block">Color</Label>
                        <ColorPicker
                          value={element.props?.style?.borderColor as `#${string}` || '#000000'}
                          onChange={(color) => handleStyleChange('borderColor', color)}
                          small
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Width</Label>
                        <Input
                          type="number"
                          value={parseInt(element.props?.style?.borderWidth?.toString() || '0')}
                          onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs mb-2 block">Radius</Label>
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[parseInt(element.props?.style?.borderRadius?.toString() || '0')]}
                          max={100}
                          step={1}
                          onValueChange={([value]) => handleStyleChange('borderRadius', `${value}px`)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={parseInt(element.props?.style?.borderRadius?.toString() || '0')}
                          onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                          className="h-8 w-12 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-xs mb-2 block">Shadow</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs mb-1 block">Color</Label>
                        <ColorPicker
                          value={element.props?.style?.boxShadow?.split(' ')[3] as `#${string}` || '#000000'}
                          onChange={(color) => {
                            const parts = element.props?.style?.boxShadow?.split(' ') || ['0px', '0px', '0px', '#000000'];
                            parts[3] = color;
                            handleStyleChange('boxShadow', parts.join(' '));
                          }}
                          small
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Blur</Label>
                        <Input
                          type="number"
                          value={parseInt(element.props?.style?.boxShadow?.split(' ')[2]?.replace('px', '') || '0')}
                          onChange={(e) => {
                            const parts = element.props?.style?.boxShadow?.split(' ') || ['0px', '0px', '0px', '#000000'];
                            parts[2] = `${e.target.value}px`;
                            handleStyleChange('boxShadow', parts.join(' '));
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Constraints Section */}
              {element.layout?.constraints && (
                <Collapsible
                  open={openSections.constraints}
                  onOpenChange={() => toggleSection('constraints')}
                  className="space-y-4"
                >
                  <CollapsibleTrigger className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Unlock className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">Constraints</Label>
                    </div>
                    {openSections.constraints ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 space-y-4">
                    <div>
                      <Label className="text-xs mb-2 block">Horizontal</Label>
                      <Select
                        value={element.layout.constraints.horizontal}
                        onValueChange={(value) => handleLayoutChange('constraints.horizontal', value)}
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
                      <Label className="text-xs mb-2 block">Vertical</Label>
                      <Select
                        value={element.layout.constraints.vertical}
                        onValueChange={(value) => handleLayoutChange('constraints.vertical', value)}
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
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Interactions Section */}
              <Collapsible
                open={openSections.interactions}
                onOpenChange={() => toggleSection('interactions')}
                className="space-y-4"
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Interactions</Label>
                  </div>
                  {openSections.interactions ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <div>
                    <Label className="text-xs mb-2 block">On Click</Label>
                    <Select
                      value={element.props?.onClick?.type || 'none'}
                      onValueChange={(value) => {
                        if (value === 'none') {
                          handlePropChange('props.onClick', undefined);
                        } else {
                          handlePropChange('props.onClick', { type: value });
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="text-xs">No action</SelectItem>
                        <SelectItem value="navigate" className="text-xs">Navigate</SelectItem>
                        <SelectItem value="callContract" className="text-xs">Call Contract</SelectItem>
                        <SelectItem value="setVariable" className="text-xs">Set Variable</SelectItem>
                        <SelectItem value="triggerFlow" className="text-xs">Trigger Flow</SelectItem>
                        <SelectItem value="custom" className="text-xs">Custom Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {element.props?.onClick?.type === 'navigate' && (
                    <div>
                      <Label className="text-xs mb-2 block">Target</Label>
                      <Input
                        value={element.props.onClick?.target || ''}
                        onChange={(e) => handlePropChange('props.onClick.target', e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Accessibility Section */}
              <Collapsible
                open={openSections.accessibility}
                onOpenChange={() => toggleSection('accessibility')}
                className="space-y-4"
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Accessibility</Label>
                  </div>
                  {openSections.accessibility ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Hidden</Label>
                    <Switch
                      checked={element.props?.style?.visibility === 'hidden'}
                      onCheckedChange={(checked) =>
                        handleStyleChange('visibility', checked ? 'hidden' : 'visible')
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Screen Reader Only</Label>
                    <Switch
                      checked={element.props?.['aria-hidden'] === 'true'}
                      onCheckedChange={(checked) =>
                        handlePropChange('props.aria-hidden', checked ? 'true' : 'false')
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block">ARIA Label</Label>
                    <Input
                      value={element.props?.['aria-label'] || ''}
                      onChange={(e) => handlePropChange('props.aria-label', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="advanced" className="p-4 space-y-6">
              <div>
                <Label className="text-xs mb-2 block">Element ID</Label>
                <Input
                  value={element.id}
                  readOnly
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs mb-2 block">Component Type</Label>
                <Input
                  value={element.componentType}
                  readOnly
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs mb-2 block">Created</Label>
                <Input
                  value={new Date(element.meta?.created || Date.now()).toLocaleString()}
                  readOnly
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs mb-2 block">Modified</Label>
                <Input
                  value={new Date(element.meta?.modified || Date.now()).toLocaleString()}
                  readOnly
                  className="h-8 text-xs"
                />
              </div>

              <Separator />

              <div>
                <Label className="text-xs mb-2 block">Custom CSS Classes</Label>
                <Input
                  value={element.props?.className || ''}
                  onChange={(e) => handlePropChange('props.className', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="space-separated classes"
                />
              </div>

              <div>
                <Label className="text-xs mb-2 block">Custom Data Attributes</Label>
                <div className="space-y-2">
                  {Object.entries(element.props || {})
                    .filter(([key]) => key.startsWith('data-'))
                    .map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2">
                        <Input
                          value={key}
                          onChange={(e) => {
                            const newProps = { ...element.props };
                            delete newProps[key];
                            newProps[e.target.value] = value;
                            handlePropChange('props', newProps);
                          }}
                          className="h-8 text-xs"
                        />
                        <Input
                          value={String(value)}
                          onChange={(e) => handlePropChange(`props.${key}`, e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs"
                    onClick={() => handlePropChange(`props.data-attr-${Date.now()}`, 'value')}
                  >
                    Add Data Attribute
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ResizablePanel>
  );
};

export default PropertiesSheet;