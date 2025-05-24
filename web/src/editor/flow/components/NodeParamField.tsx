"use client";

import { useCallback } from "react";
import StringParam from "./StringParam";
import { useFlow } from "../flow-provider";
import { NodeParameter } from "../flowTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface NodeParamFieldProps {
  param: NodeParameter & { 
    value?: string | number | boolean;
    required?: boolean;
    helperText?: string;
    hideHandle?: boolean;
  };
  nodeId: string;
  onChange?: (value: any) => void;
}

const NodeParamField = ({
  param,
  nodeId,
  onChange,
}: NodeParamFieldProps) => {
  const { getNode } = useFlow();
  const node = getNode(nodeId);
  
  // Safely get the value with multiple fallbacks
  const value = node?.data?.inputs?.[param.name] ?? 
               param.value ?? 
               (param.type === "string" ? "" : 
                param.type === "number" ? 0 : 
                param.type === "boolean" ? false : "");

  const updateNodeParamValue = useCallback(
    (newValue: any) => {
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  // Handle undefined inputs case
  if (!node?.data?.inputs) {
    return (
      <div className="space-y-1 p-1 w-full">
        <Label className="text-xs flex text-red-500">
          Configuration Error
        </Label>
        <div className="p-2 border rounded text-xs text-muted-foreground">
          Node inputs not properly initialized
        </div>
      </div>
    );
  }

  // String Parameter
  if (param.type === "string" || typeof value === "string") {
    return (
      <StringParam
        param={{
          ...param,
          label: param.name,
          value: value as string
        }}
        value={value as string}
        updateNodeParamValue={updateNodeParamValue}
      />
    );
  }

  // Number Parameter
  if (param.type === "number" || typeof value === "number") {
    return (
      <div className="space-y-1 p-1 w-full">
        <Label className="text-xs flex">
          {param.name}
          {param.required && <span className="text-red-400 px-1">*</span>}
        </Label>
        <Input
          type="number"
          className="text-xs"
          value={value as number}
          onChange={(e) => updateNodeParamValue(Number(e.target.value))}
          placeholder="Enter number..."
        />
        {param.helperText && (
          <p className="text-xs text-muted-foreground px-1">{param.helperText}</p>
        )}
      </div>
    );
  }

  // Boolean Parameter (Switch)
  if (param.type === "boolean" || typeof value === "boolean") {
    return (
      <div className="flex items-center justify-between p-2 w-full">
        <div>
          <Label className="text-xs flex items-center gap-1">
            {param.name}
            {param.required && <span className="text-red-400">*</span>}
          </Label>
          {param.helperText && (
            <p className="text-xs text-muted-foreground">{param.helperText}</p>
          )}
        </div>
        <Switch
          checked={value as boolean}
          onCheckedChange={updateNodeParamValue}
          className={cn(
            "data-[state=checked]:bg-primary",
            "data-[state=unchecked]:bg-muted-foreground/20"
          )}
        />
      </div>
    );
  }

  // Fallback for unsupported types
  return (
    <div className="space-y-1 p-1 w-full">
      <Label className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-400 px-1">*</span>}
      </Label>
      <div className="p-2 border rounded text-xs text-muted-foreground">
        Parameter type "{param.type}" not supported
      </div>
      {param.helperText && (
        <p className="text-xs text-muted-foreground px-1">{param.helperText}</p>
      )}
    </div>
  );
};

export default NodeParamField;