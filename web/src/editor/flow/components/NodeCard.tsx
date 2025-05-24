"use client";

import { cn } from "@/lib/utils";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import React from "react";

const NodeCard = ({
    children,
    nodeId,
    isSelected,
}: {
    children: React.ReactNode;
    nodeId: string;
    isSelected: boolean;
}) => {
    const { getNode, setCenter } = useReactFlow();

    const onDoubleClick = () => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
        if (x === undefined || y === undefined) return;
        setCenter(x, y, {
            zoom: 1,
            duration: 500,
        });
    };

    return (
        <div
            className={cn(
                "rounded-xl cursor-pointer dark:bg-zinc-900 bg-zinc-50 border border-muted w-[420px] text-xs gap-1 flex flex-col",
                isSelected && "border-primary"
            )}
            onDoubleClick={onDoubleClick}
        >
            {children}
            <Handle
                id="target"
                type="target"
                position={Position.Bottom}
                className={cn(
                    "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4"
                )}
            />
        </div>
    );
};

export default NodeCard;