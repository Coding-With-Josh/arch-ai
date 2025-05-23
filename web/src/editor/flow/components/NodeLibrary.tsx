"use client";
import { Button } from '@/components/ui/button';
import { Plus, Search, X, PanelTop, BoxSelect, Type, MousePointer2, FormInput, Check, SquareStack, Container, Columns, Image } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NodeType } from '../flowTypes';

interface NodeTemplate {
  name: string;
  icon: React.ReactNode;
  type: NodeType;
  category: string;
  defaultData?: any;
}

const nodeTemplates: NodeTemplate[] = [
  // Web3 Nodes
  {
    name: "Solana Contract",
    icon: <PanelTop className="h-4 w-4" />,
    type: "contract",
    category: "Web3",
    defaultData: { chain: "solana" }
  },
  {
    name: "Wallet Connection",
    icon: <MousePointer2 className="h-4 w-4" />,
    type: "wallet",
    category: "Web3"
  },
  {
    name: "Token Transfer",
    icon: <BoxSelect className="h-4 w-4" />,
    type: "token",
    category: "Web3"
  },    
  {
    name: "NFT Display",
    icon: <Image className="h-4 w-4" />,
    type: "nft",
    category: "Web3"
  },
  
  // Logic Nodes
  {
    name: "Condition",
    icon: <Check className="h-4 w-4" />,
    type: "logic",
    category: "Logic",
    defaultData: { logicType: "if" }
  },
  {
    name: "Loop",
    icon: <SquareStack className="h-4 w-4" />,
    type: "logic",
    category: "Logic",
    defaultData: { logicType: "loop" }
  },
  
  // Data Nodes
  {
    name: "API Request",
    icon: <FormInput className="h-4 w-4" />,
    type: "api",
    category: "Data"
  },
  {
    name: "Database Query",
    icon: <Container className="h-4 w-4" />,
    type: "data",
    category: "Data"
  },
  
  // UI Nodes
  {
    name: "Button",
    icon: <MousePointer2 className="h-4 w-4" />,
    type: "ui",
    category: "UI",
    defaultData: { uiType: "button" }
  },
  {
    name: "Form Input",
    icon: <Type className="h-4 w-4" />,
    type: "ui",
    category: "UI",
    defaultData: { uiType: "input" }
  }
];

const NodeItem = ({ template }: { template: NodeTemplate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'NODE_TEMPLATE',
    item: template,
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
              "flex items-center p-2 pt-3 space-x-2 justify-start pl-4 rounded-md border hover:bg-accent cursor-grab active:cursor-grabbing transition-all",
              "hover:shadow-sm hover:border-primary/50",
              isDragging && "opacity-60 shadow-lg"
            )}
          >
            <div className="p-1.5 rounded-md bg-secondary/50">
              {template.icon}
            </div>
            <span className="text-xs text-center font-medium">{template.name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Drag to create {template.name} node
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const NodeLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>(["Web3", "Logic"]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(nodeTemplates.map(t => t.category)));
    return uniqueCategories.map(category => ({
      name: category,
      items: nodeTemplates.filter(t => t.category === category)
    }));
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;

    return categories.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.items.length > 0);
  }, [searchQuery, categories]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pb-0 bg-background/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm pt-2 font-semibold tracking-tight">Node Library</h3>
        </div>

        <div className="relative mb-3 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <Input
            placeholder="Search nodes..."
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

      <ScrollArea className="flex-1 px-3 py-3">
        {filteredCategories.length > 0 ? (
          <Accordion
            type="multiple"
            value={activeCategories}
            onValueChange={setActiveCategories}
            className="w-full space-y-4"
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
                  <div className="flex flex-col gap-2">
                    {category.items.map((item) => (
                      <NodeItem key={`${category.name}-${item.type}`} template={item} />
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
              No nodes found for "{searchQuery}"
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
    </div>
  );
};