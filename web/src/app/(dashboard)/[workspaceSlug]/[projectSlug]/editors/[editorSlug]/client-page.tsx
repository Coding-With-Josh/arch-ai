"use client";
import { useEditor } from '@/editor/editor-provider';
import React from 'react';
import FlowView from './_view/flow';
import DesignView from './_view/design';
import Header from '@/editor/components/shared/header';
import { HTML5Backend } from 'react-dnd-html5-backend';   
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { DndProvider } from 'react-dnd';

interface ClientPageProps {
  params: {
    editorSlug: string
  }
}

const ClientPage = ({ params }: ClientPageProps) => {
  const { state, currentEditor } = useEditor();
  const { connection } = useAppKitConnection()

  if (!currentEditor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen gap-4">
        <h2 className="text-xl font-semibold">Connect your wallet to continue</h2>
        <p className="text-muted-foreground">
          This editor uses blockchain for authentication and collaboration
        </p>
        <appkit-connect-button/>
      </div>
    );
  }

  // if (chain?.unsupported) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen gap-4">
  //       <h2 className="text-xl font-semibold">Unsupported Network</h2>
  //       <p className="text-muted-foreground">
  //         Please switch to a supported network in your wallet
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="h-screen w-screen overflow-hidden top-0 left-0 bottom-0 right-0 flex flex-col">
      <Header state={state} editor={currentEditor} />
      
      {state.currentView === "flow" ? (
        <div className="flex-1">
          <FlowView />
        </div>
      ) : state.currentView === "design" ? (
        <div className="flex-1 overflow-hidden">
          <DesignView />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          {/* Split view would go here */}
        </div>
      )}
    </div>
    </DndProvider>
  );
};

export default ClientPage;