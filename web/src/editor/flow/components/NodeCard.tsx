"use client";

import { cn } from "@/lib/utils";
import { Handle, Position, useNodes, useReactFlow } from "@xyflow/react";
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
    const nodes = useNodes();
    const isFirstNode = nodes.length > 0 && nodes[0].id === nodeId;

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
            {/* Top handle - only if not the first node */}
            {!isFirstNode && (
                <Handle
                    id="target"
                    type="target"
                    position={Position.Top}
                    className={cn(
                        "!bg-muted-foreground !border-2 !border-background !w-4 !h-4"
                    )}
                />
            )}

            {children}

            {/* Bottom handle - always shown */}
            <Handle
                id="source"
                type="source"
                position={Position.Bottom}
                className={cn(
                    "!bg-muted-foreground !border-2 !border-background !w-4 !h-4"
                )}
            />
        </div>
    );
};

export default NodeCard;