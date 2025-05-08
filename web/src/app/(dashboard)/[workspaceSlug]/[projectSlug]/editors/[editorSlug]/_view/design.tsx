import TabNav from '@/editor/components/design/tab-nav';
import React from 'react';
import Canvas from '@/editor/components/design/canvas';
import PropertiesSheet from '@/editor/components/design/properties-sheet';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';

const DesignView = () => {
  return ( 
    <div className="flex h-full w-full">
      <TabNav/>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={80} minSize={60}>
          <Canvas/>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <PropertiesSheet/>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DesignView;