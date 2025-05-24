"use client";

import { useCallback, useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { 
  Background, 
  BackgroundVariant, 
  ReactFlow, 
  ReactFlowProvider, 
  useNodesState, 
  useEdgesState,
  useReactFlow,
  Panel,
  NodeTypes,
  MiniMap
} from '@xyflow/react';
import { NodeLibrary } from '@/editor/flow/components/NodeLibrary';
import { EnhancedFlowNode, NodeType } from '@/editor/flow/flowTypes';
import { NodeFactory } from '@/editor/flow/lib/nodeFactory';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cross, DotIcon, Minus, Plus, Maximize } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import FlowTabNav from '@/editor/flow/components/flow-tab-nav';
import { FlowProvider, useFlow } from '@/editor/flow/flow-provider';
import NodeComponent from '@/editor/flow/components/nodes/node';

const nodeTypes: NodeTypes = {
  contract: NodeComponent,
  wallet: NodeComponent,
  token: NodeComponent,
  nft: NodeComponent,
  logic: NodeComponent,
  api: NodeComponent,
  data: NodeComponent,
  ui: NodeComponent,
  function: NodeComponent,
  event: NodeComponent,
  variable: NodeComponent,
};

const FlowInner = () => {
  const { theme } = useTheme();
  const { state: flowState, addNode, setNodes, setEdges } = useFlow();
  const [nodes, setFlowNodes, onNodesChange] = useNodesState([]);
  const [edges, setFlowEdges, onEdgesChange] = useEdgesState([]);
  const { zoomIn, zoomOut, getZoom, screenToFlowPosition } = useReactFlow();
  const [bgStyle, setBgStyle] = useState(BackgroundVariant.Dots);
  const dropRef = useRef<HTMLDivElement>(null);

  // Sync flow state with ReactFlow state
  useEffect(() => {
    setFlowNodes(flowState.nodes);
    setFlowEdges(flowState.edges);
  }, [flowState.nodes, flowState.edges, setFlowNodes, setFlowEdges]);

  const [, drop] = useDrop({
    accept: 'NODE_TEMPLATE',
    drop: (item: { type: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !dropRef.current) return;

      const position = screenToFlowPosition({
        x: offset.x,
        y: offset.y
      });

      const newNode = NodeFactory.createNode(item.type as NodeType, position);
      addNode({
        type: newNode.data.type,
        position: newNode.position,
        data: {
          ...newNode,
          data: {
            inputs: [
              {
                name: "Wallet Type",
                type: "STRING",
                helperText: "Solana, Sui, Multichain, etc.",
                required: true,
                hideHandle: true
              },
              {
                name: "Sender Address",
                type: "STRING",
                helperText: "0x1234567890abcdef...",
                required: true,
                hideHandle: true
              }
            ]
          }
        }
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }, [screenToFlowPosition, addNode]);

  drop(dropRef);

  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    setNodes(nodes);
  }, [nodes, onNodesChange, setNodes]);

  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
    setEdges(edges);
  }, [edges, onEdgesChange, setEdges]);

  const bgPresets = [
    { id: BackgroundVariant.Dots, name: 'Dots', icon: <DotIcon className="h-4 w-4" /> },
    { id: BackgroundVariant.Lines, name: 'Lines', icon: <Cross className="h-4 w-4" /> },
  ];

  const zoom = getZoom();

  return (
    <div className="flex h-full">
      <FlowTabNav/>
      <div
        ref={dropRef}
        className="flex-1"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Panel position="top-center" className="flex gap-2">
            <div className="flex items-center gap-1 bg-background/90 backdrop-blur-lg rounded-full border shadow-lg px-4 py-2">
              {bgPresets.map(bg => (
                <Button
                  key={bg.id}
                  className={cn(
                    "rounded-full p-2 h-8 w-8",
                    bgStyle === bg.id ? "bg-accent" : "bg-transparent hover:bg-accent/50"
                  )}
                  size="sm"
                  variant="ghost"
                  onClick={() => setBgStyle(bg.id)}
                  title={bg.name}
                >
                  {bg.icon}
                </Button>
              ))}
              <div className="h-6 w-px bg-border mx-1" />
              <Button
                className="rounded-full p-2 h-8 w-8"
                size="sm"
                variant="ghost"
                onClick={() => zoomIn()}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-xs w-10 text-center font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                className="rounded-full p-2 h-8 w-8"
                size="sm"
                variant="ghost"
                onClick={() => zoomOut()}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                className="rounded-full p-2 h-8 w-8"
                size="sm"
                variant="ghost"
                onClick={() => zoomIn()}
              >
                <Maximize className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-border mx-1" />
              <ModeToggle/>
            </div>
          </Panel>
          <Background
            variant={bgStyle}
            gap={12}
            size={1}
            color={theme === "dark" ? "#27272a" : "#a1a1aa"}
          />
          <MiniMap
            bgColor={theme === "dark" ? "black" : "white"}
            color={theme === "dark" ? "white" : "black"}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

const Flow = () => {
  return (
    <ReactFlowProvider>
      <FlowProvider>
        <FlowInner />
      </FlowProvider>
    </ReactFlowProvider>
  );
};

export default Flow;