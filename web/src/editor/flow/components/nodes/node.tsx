"use client";

import { memo } from "react";
import { NodeProps, Position } from "@xyflow/react";
import NodeCard from "../NodeCard";
import NodeHeader from "../NodeHeader";
import { NodeInput, NodeInputs } from "../NodeInputs";
import { useFlow } from "../../flow-provider";
import { EnhancedFlowNode } from "../../flowTypes";
import { cn } from "@/lib/utils";

const NodeComponent = memo((props: NodeProps<EnhancedFlowNode>) => {
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

  const renderInputs = () => {
    switch (data.type) {
      case 'wallet':
        return (
          <>
            <NodeInput
              input={{
                name: "Wallet Type",
                type: "string",
                value: data.inputs?.["Wallet Type"] || "EOA",
                helperText: "Solana, Sui, Multichain, etc.",
                required: true,
                hideHandle: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Sender Address",
                type: "string",
                value: data.inputs?.["Sender Address"] || "",
                helperText: "0x1234567890abcdef...",
                required: true,
                hideHandle: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'contract':
        return (
          <>
            <NodeInput
              input={{
                name: "Contract Address",
                type: "string",
                value: data.inputs?.["Contract Address"] || "",
                helperText: "0x...",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "ABI",
                type: "string",
                value: data.inputs?.["ABI"] || "[]",
                helperText: "Contract ABI JSON",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Chain",
                type: "string",
                value: data.inputs?.["Chain"] || "Ethereum",
                helperText: "Network where contract is deployed",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'token':
        return (
          <>
            <NodeInput
              input={{
                name: "Token Address",
                type: "string",
                value: data.inputs?.["Token Address"] || "",
                helperText: "0x...",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Standard",
                type: "string",
                value: data.inputs?.["Standard"] || "ERC20",
                helperText: "Token standard",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Decimals",
                type: "number",
                value: data.inputs?.["Decimals"] || 18,
                helperText: "Token decimals",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'nft':
        return (
          <>
            <NodeInput
              input={{
                name: "Contract Address",
                type: "string",
                value: data.inputs?.["Contract Address"] || "",
                helperText: "NFT collection address",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Token ID",
                type: "string",
                value: data.inputs?.["Token ID"] || "",
                helperText: "Specific NFT identifier",
                required: false
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Standard",
                type: "string",
                value: data.inputs?.["Standard"] || "ERC721",
                helperText: "NFT standard",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'logic':
        return (
          <>
            <NodeInput
              input={{
                name: "Condition",
                type: "string",
                value: data.inputs?.["Condition"] || "",
                helperText: "Logical condition to evaluate",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Operator",
                type: "string",
                value: data.inputs?.["Operator"] || "AND",
                helperText: "Logical operator (AND/OR)",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'api':
        return (
          <>
            <NodeInput
              input={{
                name: "Endpoint",
                type: "string",
                value: data.inputs?.["Endpoint"] || "",
                helperText: "API endpoint URL",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Method",
                type: "string",
                value: data.inputs?.["Method"] || "GET",
                helperText: "HTTP method",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Headers",
                type: "string",
                value: data.inputs?.["Headers"] || "{}",
                helperText: "Request headers JSON",
                required: false
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'data':
        return (
          <>
            <NodeInput
              input={{
                name: "Source",
                type: "string",
                value: data.inputs?.["Source"] || "ipfs",
                helperText: "Data source (ipfs, database, etc.)",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Query",
                type: "string",
                value: data.inputs?.["Query"] || "",
                helperText: "Query or identifier",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'ui':
        return (
          <>
            <NodeInput
              input={{
                name: "Component",
                type: "string",
                value: data.inputs?.["Component"] || "button",
                helperText: "UI component type",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Label",
                type: "string",
                value: data.inputs?.["Label"] || "",
                helperText: "Display text",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'function':
        return (
          <>
            <NodeInput
              input={{
                name: "Code",
                type: "string",
                value: data.inputs?.["Code"] || "",
                helperText: "Function logic",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Language",
                type: "string",
                value: data.inputs?.["Language"] || "javascript",
                helperText: "Programming language",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Parameters",
                type: "string",
                value: data.inputs?.["Parameters"] || "[]",
                helperText: "Input parameters",
                required: false
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'event':
        return (
          <>
            <NodeInput
              input={{
                name: "Event Name",
                type: "string",
                value: data.inputs?.["Event Name"] || "",
                helperText: "Event identifier",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Payload",
                type: "string",
                value: data.inputs?.["Payload"] || "{}",
                helperText: "Event data schema",
                required: false
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      case 'variable':
        return (
          <>
            <NodeInput
              input={{
                name: "Name",
                type: "string",
                value: data.inputs?.["Name"] || "",
                helperText: "Variable identifier",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Value",
                type: "string",
                value: data.inputs?.["Value"] || "",
                helperText: "Variable value",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Type",
                type: "string",
                value: data.inputs?.["Type"] || "string",
                helperText: "Data type",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
          </>
        );

      default:
        return data.inputs && Object.entries(data.inputs).map(([name, value]) => (
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
        ));
    }
  };

  return (
    <NodeCard nodeId={id} isSelected={selected}>
      <NodeHeader nodeType={data.type} />
      <NodeInputs>
        {renderInputs()}
      </NodeInputs>
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";

export default NodeComponent;