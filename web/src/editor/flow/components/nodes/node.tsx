"use client";

import { memo } from "react";
import { NodeProps, Position } from "@xyflow/react";
import NodeCard from "../NodeCard";
import NodeHeader from "../NodeHeader";
import { NodeInput, NodeInputs } from "../NodeInputs";
import { useFlow } from "../../flow-provider";
import { EnhancedFlowNode } from "../../flowTypes";

const NodeComponent = memo((props: NodeProps<EnhancedFlowNode & { targetPosition?: Position, sourcePosition?: Position }>) => {
  const { data, id, selected = false } = props;
  const { updateNode } = useFlow();

  const handleInputChange = (paramName: string, value: any) => {
    updateNode(id, {
      ...data,
      inputs: {
        ...data.inputs,
        [paramName]: value
      }
    } as any);
  };

  return (
    <NodeCard nodeId={id} isSelected={selected}>
      <NodeHeader nodeType={data.type} />
      <NodeInputs>
        {data.inputs && Object.entries(data.inputs).map(([name, value]) => (
          <NodeInput 
            key={name}
            input={{ 
              name,
              type: typeof value as 'string' | 'number' | 'boolean',
              value: value as string | number | boolean
            }}
            nodeId={id}
            onChange={handleInputChange}
          />
        ))}
      </NodeInputs>
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";

export default NodeComponent;