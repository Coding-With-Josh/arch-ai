"use client";

import { useCallback } from "react";
import StringParam from "./StringParam";
import { useFlow } from "../flow-provider";
import { NodeParameter } from "../flowTypes";

interface NodeParamFieldProps {
  param: NodeParameter & { value: string | number | boolean };
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
  const value = node?.data.data.inputs?.[param.name];

  const updateNodeParamValue = useCallback(
    (newValue: any) => {
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  if (param.type === "string") {
    return (
      <StringParam
        param={param}
        value={value as string}
        updateNodeParamValue={updateNodeParamValue}
      />
    );
  }
  return (
    <div className="w-full">
      <p className="text-xs text-muted-foreground">Not Implemented</p>
    </div>
  );
};

export default NodeParamField;