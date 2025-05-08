import { Button } from '@/components/ui/button'
import { Image, Plus, PlusSquare, Text, Search, X } from 'lucide-react'
import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const componentCategories = [
  {
    name: "Layout",
    items: [
      { name: "Container", icon: <PlusSquare className="h-6 w-6" /> },
      { name: "Grid", icon: <PlusSquare className="h-6 w-6" /> },
      { name: "Stack", icon: <PlusSquare className="h-6 w-6" /> },
    ]
  },
  {
    name: "Basic",
    items: [
      { name: "Text", icon: <Text className="h-6 w-6" /> },
      { name: "Button", icon: <PlusSquare className="h-6 w-6" /> },
      { name: "Image", icon: <Image className="h-6 w-6" /> },
    ]
  },
  {
    name: "Inputs",
    items: [
      { name: "Text Input", icon: <PlusSquare className="h-6 w-6" /> },
      { name: "Checkbox", icon: <PlusSquare className="h-6 w-6" /> },
      { name: "Select", icon: <PlusSquare className="h-6 w-6" /> },
    ]
  }
]

const ComponentsTab = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string[]>(["Layout"])

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return componentCategories
    
    return componentCategories.map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.items.length > 0)
  }, [searchQuery])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 pb-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Components</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1 px-3">
        <Accordion 
          type="multiple" 
          value={activeCategory} 
          onValueChange={setActiveCategory}
          className="w-full"
        >
          {filteredCategories.map((category) => (
            <AccordionItem key={category.name} value={category.name} className="border-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="text-sm font-medium">{category.name}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col items-center p-3 rounded-md border hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="p-2 rounded-md bg-secondary mb-2">
                        {item.icon}
                      </div>
                      <span className="text-xs text-center">{item.name}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No components found for "{searchQuery}"
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default ComponentsTab