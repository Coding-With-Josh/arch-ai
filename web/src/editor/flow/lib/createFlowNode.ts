import { FlowNode } from '@/editor/types';
import { v4 as uuidv4 } from 'uuid';
import { EnhancedFlowNode, NodePosition, NodeType, TaskType } from '../flowTypes';

export function CreateFlowNode(
    taskType: TaskType,
    position?: NodePosition
): EnhancedFlowNode {
    const baseNode = {
        id: uuidv4(),
        type: 'task' as const,
        position: position ?? { x: 0, y: 0 },
        dimensions: { width: 200, height: 100 },
        title: taskType, // Now properly typed
        style: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            textColor: '#000000',
            borderWidth: 1,
            borderRadius: 5
        },
        ports: [],
        metadata: {
            created: Date.now(),
            createdBy: 'system'
        }
    };

    // Map TaskType to flow node configurations
    switch (taskType) {
        case "LAUNCH_BROWSER":
            return {
                ...baseNode,
                type: 'ui',
                uiType: 'browser',
                data: {
                    url: '',
                    headless: true
                },
                inputs: {}
            } as EnhancedFlowNode;
        
        case "SCRAPE_DATA":
            return {
                ...baseNode,
                type: 'data',
                source: 'web',
                operation: 'read',
                data: {
                    selectors: [],
                    pagination: {}
                },
                inputs: {},
                outputs: {
                    data: []
                },

            } as EnhancedFlowNode;
        
        // Add other task type mappings...
        
        default:
            return {
                ...baseNode,
                type: 'function',
                language: 'javascript',
                data: {
                    code: `// ${taskType} task`
                },
                inputs: {},
            } as EnhancedFlowNode;
    }
}