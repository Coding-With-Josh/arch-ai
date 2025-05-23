"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";

const StringParam = ({
  param,
  value,
  updateNodeParamValue,
}: {
  param: any;
  value: any;
  updateNodeParamValue: (v: string) => void;
}) => {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value);

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.label || param.name}
        {param.required && <p className="text-red-400 px-1">*</p>}
      </Label>
      <Input
        className="text-xs"
        id={id}
        value={internalValue}
        placeholder="Enter value..."
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;