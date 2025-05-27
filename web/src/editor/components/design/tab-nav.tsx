"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Box, Trees, Image, Layout, Plug, GitBranch } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import ComponentsTab from "./tabs/components-tab";

const tabs = [
    { value: "components", label: "Components", icon: <Box className="h-6 w-6" />, content: <ComponentsTab/> },
    { value: "widgetTree", label: "Widget Tree", icon: <GitBranch className="h-6 w-6" />, content: "Widget Tree Content" },
    { value: "assets", label: "Assets", icon: <Image className="h-6 w-6" />, content: "Assets Content" },
    { value: "designSystem", label: "Design System", icon: <Layout className="h-6 w-6" />, content: "Design System Content" },
    { value: "plugin", label: "Plugin", icon: <Plug className="h-6 w-6" />, content: "Plugin Content" },
];

const TabNav: React.FC = () => {
    return (
        <div className="flex h-full">
            <TooltipProvider delayDuration={0}>
                <Tabs defaultValue="components" orientation="vertical" className="flex ">
                    <TabsList className="flex flex-col h-full space-y-1 py-2 w-[3.6rem] bg-background/70 border-r rounded-lg justify-center items-center">
                        {tabs.map((tab) => (
                            <Tooltip key={tab.value}>
                                <TooltipTrigger asChild>
                                    <TabsTrigger
                                        value={tab.value}
                                        className="p-2 hover:bg-muted mt-2.5 rounded flex items-center justify-center w-8 h-8"
                                    >
                                        {tab.icon}
                                    </TabsTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="text-xs">
                                    {tab.label}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TabsList>
                    <ScrollArea className="h-full lg:w-[23rem] xl:w-[23rem]">
                        {tabs.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className="p-3 text-sm">
                                <Sheet>
                                    {tab.content}
                                </Sheet>
                            </TabsContent>
                        ))}
                    </ScrollArea>
                </Tabs>
            </TooltipProvider>
        </div>
    );
};

export default TabNav;