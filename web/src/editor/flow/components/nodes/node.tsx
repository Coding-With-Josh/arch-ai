"use client";

import { memo, useRef, useEffect, useState } from "react";
import { NodeProps, Position } from "@xyflow/react";
import NodeCard from "../NodeCard";
import NodeHeader from "../NodeHeader";
import { NodeInput, NodeInputs } from "../NodeInputs";
import { useFlow } from "../../flow-provider";
import { EnhancedFlowNode } from "../../flowTypes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const NodeComponent = memo((props: NodeProps<EnhancedFlowNode>) => {
  const { data, id, selected = false } = props;
  const { updateNode } = useFlow();
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate content height for animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [selected, data.inputs]);

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
                type: "select",
                value: data.inputs?.["Wallet Type"] || "EOA",
                options: ["EOA", "Smart Contract", "Multisig", "Hardware"],
                helperText: "Select wallet type",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Chain",
                type: "select",
                value: data.inputs?.["Chain"] || "Ethereum",
                options: ["Ethereum", "Solana", "Polygon", "Arbitrum"],
                helperText: "Select blockchain network",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Address",
                type: "string",
                value: data.inputs?.["Address"] || "",
                helperText: "Wallet public address",
                required: true
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
                name: "Chain",
                type: "select",
                value: data.inputs?.["Chain"] || "Ethereum",
                options: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
                helperText: "Deployment network",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "ABI Version",
                type: "select",
                value: data.inputs?.["ABI Version"] || "V4",
                options: ["V4", "V3", "V2", "V1"],
                helperText: "Contract ABI version",
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
                name: "Token Standard",
                type: "select",
                value: data.inputs?.["Token Standard"] || "ERC20",
                options: ["ERC20", "ERC721", "ERC1155", "SPL"],
                helperText: "Token standard type",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Address",
                type: "string",
                value: data.inputs?.["Address"] || "",
                helperText: "Token contract address",
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
                helperText: "Token decimal places",
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
                name: "Collection Type",
                type: "select",
                value: data.inputs?.["Collection Type"] || "ERC721",
                options: ["ERC721", "ERC1155", "SPL", "Other"],
                helperText: "NFT collection standard",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
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
                helperText: "Unique NFT identifier",
                required: false
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
                name: "Condition Type",
                type: "select",
                value: data.inputs?.["Condition Type"] || "AND",
                options: ["AND", "OR", "XOR", "NAND"],
                helperText: "Logical operator type",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Inputs Required",
                type: "number",
                value: data.inputs?.["Inputs Required"] || 2,
                helperText: "Number of required inputs",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Strict Mode",
                type: "boolean",
                value: data.inputs?.["Strict Mode"] || false,
                helperText: "Enable strict type checking",
                required: false
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
                name: "HTTP Method",
                type: "select",
                value: data.inputs?.["HTTP Method"] || "GET",
                options: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                helperText: "Request method type",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
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
                name: "Authentication",
                type: "select",
                value: data.inputs?.["Authentication"] || "None",
                options: ["None", "Bearer Token", "API Key", "OAuth2"],
                helperText: "Authentication method",
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
                name: "Source Type",
                type: "select",
                value: data.inputs?.["Source Type"] || "IPFS",
                options: ["IPFS", "SQL", "GraphQL", "REST"],
                helperText: "Data source type",
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
                helperText: "Data query or identifier",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Cache Enabled",
                type: "boolean",
                value: data.inputs?.["Cache Enabled"] || true,
                helperText: "Enable response caching",
                required: false
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
                name: "Component Type",
                type: "select",
                value: data.inputs?.["Component Type"] || "Button",
                options: ["Button", "Input", "Card", "Modal"],
                helperText: "UI element type",
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
            <NodeInput
              input={{
                name: "Interactive",
                type: "boolean",
                value: data.inputs?.["Interactive"] || true,
                helperText: "Enable user interaction",
                required: false
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
                name: "Language",
                type: "select",
                value: data.inputs?.["Language"] || "JavaScript",
                options: ["JavaScript", "Python", "Rust", "Solidity"],
                helperText: "Programming language",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Code",
                type: "string",
                value: data.inputs?.["Code"] || "",
                helperText: "Function logic implementation",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Async",
                type: "boolean",
                value: data.inputs?.["Async"] || false,
                helperText: "Enable asynchronous execution",
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
                name: "Event Type",
                type: "uuuuuuuuu",
                value: data.inputs?.["Event Type"] || "Custom",
                options: ["Custom", "ERC20 Transfer", "NFT Mint", "Swap"],
                helperText: "Event classification",
                required: true
              }}
              nodeId={id}
              onChange={handleInputChange}
            />
            <NodeInput
              input={{
                name: "Payload Schema",
                type: "string",
                value: data.inputs?.["Payload Schema"] || "{}",
                helperText: "JSON schema definition",
                required: true
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
                name: "Data Type",
                type: "select",
                value: data.inputs?.["Data Type"] || "String",
                options: ["String", "Number", "Boolean", "Object"],
                helperText: "Variable data type",
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
                name: "Constant",
                type: "boolean",
                value: data.inputs?.["Constant"] || false,
                helperText: "Immutable variable",
                required: false
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
      
      <div className="overflow-hidden">
        <AnimatePresence>
          {selected && (
            <motion.div
              ref={contentRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: contentHeight,
                opacity: 1,
                transition: { 
                  height: { duration: 0.2, ease: "easeInOut" },
                  opacity: { duration: 0.1, delay: 0.05 }
                }
              }}
              exit={{ 
                height: 0,
                opacity: 0,
                transition: { 
                  height: { duration: 0.2, ease: "easeInOut" },
                  opacity: { duration: 0.1 }
                }
              }}
            >
              <NodeInputs>
                {renderInputs()}
              </NodeInputs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";

export default NodeComponent;