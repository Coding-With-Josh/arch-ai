"use client";
import { Clock, Eye, Play, Zap, Share2, Settings, Users, GitBranch, CloudUpload, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import archLogo from "@/assets/images/brand/arch_logo-transparent-bg.png";
import ViewSwitch from './view-switch';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Editor, EditorState } from '@/editor/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEditor, useSettings } from '@/editor/editor-provider';
import { ModeToggle } from '@/components/ui/mode-toggle';

const Header = ({ state, editor }: { editor: Editor, state: EditorState }) => {
  const { updateSettings } = useSettings();
  const [darkMode, setDarkMode] = useState(state.settings.theme === 'dark');
  const [collaborators, setCollaborators] = useState(editor.collaborators.length);
  
  // Toggle between dark and light theme
  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    updateSettings({ theme: newTheme });
  };

  // Handle deployment based on environment
  const handleDeploy = (environmentId?: string) => {
    const defaultEnv = state.settings.deployment.defaultEnvironment;
    const envId = environmentId || defaultEnv;
    console.log(`Deploying to environment: ${envId}`);
    // Actual deployment logic would go here
  };

  // Handle preview/run based on current view
  const handlePreviewRun = () => {
    if (state.currentView === "design") {
      console.log("Entering preview mode");
    } else {
      console.log("Running flow");
    }
  };

  // Handle version control actions
  const handleVersionControl = (action: 'commit' | 'push' | 'pull') => {
    console.log(`Version control action: ${action}`);
  };

  return (
    <header className="relative top-0 min-h-fit py-2 border-b border-muted/75 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-5 h-full flex items-center justify-between">
        {/* Left Side - Logo & Project Info */}
        <div className="flex items-center gap-4">
          <div className="absolute left-0 border-r border-r-muted/75 h-full w-fit px-3 flex items-center justify-center hover:bg-muted transition-all cursor-pointer">
            <Image
              src={archLogo}
              width={100}
              height={100}
              alt="Arch Logo"
              className="size-8"
            />
          </div>

          <div className="flex flex-col items-start justify-start gap-0.5 ml-14">
            <span className="text-xs font-bold truncate max-w-[180px]">
              {editor.meta.name || "Untitled"}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                <Clock className='h-3 w-3 mt-0'/> 
                Last updated {formatDistanceToNow(editor.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Center - View Switch */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <ViewSwitch />
        </div>

        {/* Right Side - Actions */}
        <div className="flex text-xs items-center justify-center gap-2">
          {/* Theme Toggle */}
          <TooltipProvider><Tooltip>
            <TooltipTrigger asChild>
              {/* <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={toggleTheme}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button> */}
              <ModeToggle/>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Toggle theme ({darkMode ? 'light' : 'dark'})
            </TooltipContent>
          </Tooltip></TooltipProvider>

          {/* Preview/Run Button */}
          {state.currentView === "design" ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs min-h-fit py-1"
              onClick={handlePreviewRun}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs min-h-fit py-1"
              onClick={handlePreviewRun}
            >
              <Play className="h-4 w-4 mr-1" />
              Run
            </Button>
          )}

          {/* Collaboration */}
          <TooltipProvider><Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs min-h-fit py-1"
              >
                <Users className="h-4 w-4 mr-1" />
                {collaborators > 0 && collaborators}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {collaborators > 0 ? 
                `${collaborators} collaborators` : 
                "Invite collaborators"}
            </TooltipContent>
          </Tooltip></TooltipProvider>

          {/* Version Control */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs min-h-fit py-1">
                <GitBranch className="h-4 w-4 mr-1" />
                Version
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleVersionControl('commit')}>
                Commit Changes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVersionControl('push')}>
                Push to Remote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVersionControl('pull')}>
                Pull Latest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Deploy Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                className="text-xs min-h-fit py-1 bg-gradient-to-r from-zinc-700 to-zinc-900 text-white hover:from-zinc-600 hover:to-zinc-800 border-2 border-zinc-800 transition-all"
              >
                <CloudUpload className="h-4 w-4 mr-1" />
                Deploy
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {state.deployment.environments.map(env => (
                <DropdownMenuItem 
                  key={env.id} 
                  onClick={() => handleDeploy(env.id)}
                >
                  {env.name} ({env.type})
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => handleDeploy()}>
                Deploy to Default
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <TooltipProvider><Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Editor Settings
            </TooltipContent>
          </Tooltip></TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;