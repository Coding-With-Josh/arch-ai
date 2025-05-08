// components/ui/color-picker.tsx
"use client";
import * as React from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { cn } from "@/lib/utils";
import { useEditor } from "@/editor/editor-provider";
import type { HexColor, Variable } from "@/editor/types";

interface ColorPickerProps {
  value: HexColor;
  onChange: (color: HexColor) => void;
  className?: string;
  small?: boolean;
}

export const ColorPicker = ({
  value,
  onChange,
  className,
  small = false,
}: ColorPickerProps) => {
  const { theme } = useTheme();
  const { state } = useEditor();
  const [open, setOpen] = React.useState(false);

  // Get current design system colors
  const currentDesignSystem = state.designSystems[0]; // Assuming first is active
  const colorTokens = currentDesignSystem 
    ? Object.entries(currentDesignSystem.tokens.colors)
        .flatMap(([category, colors]) => 
          Object.entries(colors).map(([name, value]) => ({
            category,
            name,
            value: value as HexColor
          }))
        )
    : [];

  // Get color variables from editor state
  const colorVariables = state.variables.variables.filter(v => 
    v.type === 'string' && typeof v.value === 'string' && v.value.startsWith('#')
  ) as Variable[];

  // Zinc palette for fallback
  const zincPalette = theme === 'dark' ? [
    "#18181b", "#27272a", "#3f3f46", "#52525b",
    "#71717a", "#a1a1aa", "#d4d4d8", "#e4e4e7",
    "#f4f4f5", "#fafafa"
  ] : [
    "#fafafa", "#f4f4f5", "#e4e4e7", "#d4d4d8", 
    "#a1a1aa", "#71717a", "#52525b", "#3f3f46",
    "#27272a", "#18181b"
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size={small ? "sm" : "default"}
            className="w-full justify-start gap-2"
          >
            <div
              className="h-4 w-4 rounded border"
              style={{ backgroundColor: value }}
            />
            <span className="truncate">
              {colorTokens.find(t => t.value === value)?.name ||
               colorVariables.find(v => v.value === value)?.name ||
               value}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <Tabs defaultValue="picker" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="picker" className="text-xs">Picker</TabsTrigger>
              <TabsTrigger value="tokens" className="text-xs">Tokens</TabsTrigger>
              <TabsTrigger value="vars" className="text-xs">Variables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="picker" className="pt-2 space-y-2">
              <HexColorPicker color={value} onChange={(newColor: string) => onChange(newColor as HexColor)} className="w-full" />
              <div className="flex items-center gap-2">
                <HexColorInput
                  color={value}
                  onChange={(newColor: string) => onChange(newColor as HexColor)}
                  prefixed
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1",
                    "text-sm shadow-sm transition-colors file:border-0 file:bg-transparent",
                    "file:text-sm file:font-medium placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
                <div
                  className="h-9 w-9 rounded border"
                  style={{ backgroundColor: value }}
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {zincPalette.map((color) => (
                  <button
                    key={color}
                    className="h-6 w-6 rounded border cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(color as HexColor)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tokens" className="pt-2 max-h-60 overflow-y-auto">
              {colorTokens.length > 0 ? (
                <div className="space-y-2">
                  {Array.from(new Set(colorTokens.map(t => t.category))).map(category => (
                    <div key={category}>
                      <h4 className="text-xs font-medium px-2 py-1 text-muted-foreground">
                        {category}
                      </h4>
                      <div className="grid grid-cols-5 gap-2 p-2">
                        {colorTokens
                          .filter(t => t.category === category)
                          .map(token => (
                            <button
                              key={`${token.category}-${token.name}`}
                              className="h-6 w-6 rounded border cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
                              style={{ backgroundColor: token.value }}
                              onClick={() => onChange(token.value)}
                              title={`${token.name} (${token.value})`}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No color tokens defined
                </div>
              )}
            </TabsContent>

            <TabsContent value="vars" className="pt-2 max-h-60 overflow-y-auto">
              {colorVariables.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-2">
                    {colorVariables.map(variable => (
                      <button
                        key={variable.id}
                        className="h-6 w-6 rounded border cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
                        style={{ backgroundColor: variable.value as string }}
                        onClick={() => onChange(variable.value as HexColor)}
                        title={`${variable.name} (${variable.value})`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No color variables defined
                </div>
              )}
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};