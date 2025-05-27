"use client";
import { Button } from '@/components/ui/button';
import { Image, Plus, PlusSquare, Text, Search, X, Container, SquareStack, FormInput, Check, Box, Columns, Type, MousePointer2, PanelTop } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Premium component library with more icons and categories
const componentCategories = [
  {
    name: "Layout",
    items: [
      { name: "Container", icon: <Container className="h-4 w-4" />, type: "container" },
      { name: "Grid", icon: <Columns className="h-4 w-4" />, type: "grid" },
      { name: "Stack", icon: <SquareStack className="h-4 w-4" />, type: "stack" },
      { name: "Box", icon: <Box className="h-4 w-4" />, type: "box" },
      { name: "Section", icon: <PanelTop className="h-4 w-4" />, type: "section" },
    ]
  },
  {
    name: "Basic",
    items: [
      { name: "Text", icon: <Type className="h-4 w-4" />, type: "text" },
      { name: "Button", icon: <MousePointer2 className="h-4 w-4" />, type: "button" },
      { name: "Image", icon: <Image className="h-4 w-4" />, type: "image" },
    ]
  },
  {
    name: "Inputs",
    items: [
      { name: "Text Input", icon: <FormInput className="h-4 w-4" />, type: "text-input" },
      { name: "Checkbox", icon: <Check className="h-4 w-4" />, type: "checkbox" },
      { name: "Select", icon: <PlusSquare className="h-4 w-4" />, type: "select" },
    ]
  },
  {
    name: "Advanced",
    items: [
      { name: "Carousel", icon: <SquareStack className="h-4 w-4" />, type: "carousel" },
      { name: "Modal", icon: <Container className="h-4 w-4" />, type: "modal" },
      { name: "Tabs", icon: <SquareStack className="h-4 w-4" />, type: "tabs" },
    ]
  }
];

const ComponentItem = ({ item }: { item: { name: string; icon: React.ReactNode; type: string } }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type: item.type, name: item.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
          ref={(node: HTMLDivElement | null) => { drag(node); }}
          className={cn(
              "flex flex-col items-center p-2 rounded-md border hover:bg-accent cursor-grab active:cursor-grabbing transition-all",
              "hover:shadow-sm hover:border-primary/50",
              isDragging && "opacity-60 shadow-lg"
            )}
          >
            <div className="p-1.5 rounded-md bg-secondary/50 mb-1.5">
              {item.icon}
            </div>
            <span className="text-xs text-center font-medium">{item.name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Drag {item.name} to canvas
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ComponentsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string[]>(["Layout", "Basic"]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return componentCategories;

    return componentCategories.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  return (
      <div className="flex flex-col h-full z-10 rounded-lg bg-zinc-950/70 backdrop-blur-sm border border-muted overflow-hidden max-h-[53rem]">
        {/* Premium Header with Glass Morphism */}
        <div className="px-3 pt-3 pb-0 bg-zinc-900 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold tracking-tight">Components Library</h3>
            <TooltipProvider><Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => {
                    // Add your custom component logic here
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create custom component</TooltipContent>
            </Tooltip>
            </TooltipProvider>
          </div>

          {/* Enhanced Search with Clear Button */}
          <div className="relative mb-3 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <Input
              placeholder="Search components..."
              className="pl-9 h-8 text-xs focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Components List with Smooth Scrolling */}
        <ScrollArea className="flex-1 px-3 pb-3">
          {filteredCategories.length > 0 ? (
            <Accordion
              type="multiple"
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full space-y-1"
            >
              {filteredCategories.map((category) => (
                <AccordionItem
                  key={category.name}
                  value={category.name}
                  className="border-0"
                >
                  <AccordionTrigger className="py-1.5 px-1 hover:no-underline hover:bg-accent/50 rounded-md">
                    <span className="text-xs font-medium tracking-wide flex items-center">
                      <span className="truncate">{category.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({category.items.length})
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      {category.items.map((item) => (
                        <ComponentItem key={`${category.name}-${item.name}`} item={item} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100%-100px)] text-center">
              <Search className="h-6 w-6 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-1">
                No components found for "{searchQuery}"
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Try a different search term
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </div>
          )}
        </ScrollArea>

        {/* Footer with Quick Actions */}
        <div className="px-3 py-2 border-t flex justify-between items-center bg-background/70 backdrop-blur-sm">
          <span className="text-xs text-muted-foreground">
            {componentCategories.reduce((acc, cat) => acc + cat.items.length, 0)} components
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setActiveCategory(componentCategories.map(c => c.name))}
          >
            Expand All
          </Button>
        </div>
      </div>
  );
};

export default ComponentsTab;