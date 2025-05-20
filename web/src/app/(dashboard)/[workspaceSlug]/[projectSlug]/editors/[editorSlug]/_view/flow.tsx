import React from 'react'
import { Background, BackgroundVariant, Controls, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from '@xyflow/react'

const FlowView = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: '1',
      type: 'input',
      data: { label: 'Node 1' },
      position: { x: 0, y: 0 },
    },
    {
      id: '2',
      data: { label: 'Node 2' },
      position: { x: 100, y: 100 },
    },
    {
      id: '3',
      data: { label: 'Node 3' },
      position: { x: 200, y: 200 },
    }
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  return (
      <ReactFlowProvider>
    <div className="flex h-full w-full">
        <ReactFlow
          edges={edges}
          nodes={nodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <Controls
            position='bottom-left'
            orientation='horizontal'
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
          />

        </ReactFlow>
    </div>
      </ReactFlowProvider> 
  )
}

export default FlowView