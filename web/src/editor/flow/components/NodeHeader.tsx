"use client";

import { Button } from "@/components/ui/button";
import { FileText, GripVerticalIcon } from "lucide-react";
import React from "react";

const NodeHeader = ({ nodeType }: { nodeType: string }) => {
  return (
    <div className="flex items-center gap-2 p-2">
      <FileText size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {nodeType}
        </p>
        <div className="flex gap-1 items-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeHeader;