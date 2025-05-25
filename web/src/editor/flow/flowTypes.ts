import { XYPosition, Node, Position } from "@xyflow/react";

type UUID = string;
export type walletAddresses = `0x${string}`;

export interface NodePosition {
    x: number;
    y: number;
}

export type TaskType =
    | 'LAUNCH_BROWSER'
    | 'SCRAPE_DATA'
    | 'DOWNLOAD_FILE'
    | 'UPLOAD_FILE'
    | 'RUN_SCRIPT';

export type NodeType =
    | 'contract'
    | 'wallet'
    | 'token'
    | 'nft'
    | 'logic'
    | 'api'
    | 'data'
    | 'ui'
    | 'function'
    | 'event'
    | 'variable';

export interface FlowNodeStyle {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    borderWidth: number;
    borderRadius: number;
}

export interface FlowNodeMetadata {
    created: number;
    createdBy: string;
    updated?: number;
    tags?: string[];
}
    
export type NodeValueType = 'string' | 'number' | 'boolean' | 'boolean[]' | 'object' | 'select';

export interface NodeParameter {
    name: string;
    type: NodeValueType;
    label?: string;
    options?: string[]; 
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
}

export interface FlowPort {
    id: string;
    type: 'input' | 'output';
    dataType: string;
    name: string;
    isArray?: boolean;
    isOptional?: boolean;
    defaultValue?: any;
}

export interface NodeProps {
    id: string;
    data: EnhancedFlowNode;
    selected?: boolean;
}

// Conditional Logic Types
export type LogicType = 'if' | 'switch' | 'for' | 'while' | 'forEach' | 'doWhile';
export type ComparisonOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'matches';
export type LogicalOperator = 'AND' | 'OR';

export interface LogicCondition {
    id: UUID;
    left: string;
    operator: ComparisonOperator;
    right: string;
    logicalOperator?: LogicalOperator;
}

export interface LoopParams {
    init?: string;
    condition?: string;
    update?: string;
    collection?: string;
    itemName?: string;
    maxIterations?: number;
}

// Database Types
export type DatabaseType = 'mysql' | 'postgres' | 'mongodb' | 'firebase';
export type DatabaseOperation = 'query' | 'insert' | 'update' | 'delete' | 'transaction';

export interface EnhancedFlowNode extends Node {
    id: string;
    type: NodeType;
    position: XYPosition;
    dimensions: { width: number; height: number };
    title: string;
    description?: string;
    style: FlowNodeStyle;
    ports: FlowPort[];
    metadata: FlowNodeMetadata;
    data: {
        type: NodeType;
        // Common properties
        inputs?: Record<string, any>;
        wants?: string[];
        needs?: string[];
        // Function node specific
        language?: 'javascript' | 'typescript' | 'rust';
        code?: string;
        inputsList?: NodeParameter[];
        outputs?: NodeParameter[];
        // Logic node specific
        logicType?: LogicType;
        conditions?: LogicCondition[];
        branches?: {
            condition: string;
            nodes: string[];
        }[];
        loopParams?: LoopParams;
        // Database node specific
        dbOperation?: DatabaseOperation;
        dbType?: DatabaseType;
        query?: string | object;
        // Other type specific properties
        [key: string]: any;
    };
    sourcePosition?: Position;
    targetPosition?: Position;
    dragHandle?: string;
    parentId?: string;
    zIndex?: number;
    [key: string]: any;
}

// Specialized node types for better type safety
export interface LogicNode extends EnhancedFlowNode {
    type: 'logic';
    data: EnhancedFlowNode['data'] & {
        logicType: LogicType;
        conditions: LogicCondition[];
        branches?: {
            condition: string;
            nodes: string[];
        }[];
        loopParams?: LoopParams;
    };
}

export interface DatabaseNode extends EnhancedFlowNode {
    type: 'data';
    data: EnhancedFlowNode['data'] & {
        dbOperation: DatabaseOperation;
        dbType: DatabaseType;
        query: string | object;
        parameters?: Record<string, unknown>;
    };
}