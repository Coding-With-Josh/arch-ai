"use client";

import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { Node, Edge, Position } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { FlowConnection, FlowVariable, FlowNodeBinding, EditorState } from '../types';
import { EnhancedFlowNode } from './flowTypes';
import { useEditor } from '../editor-provider';

type FlowState = {
  nodes: Node<EnhancedFlowNode>[];
  edges: Edge<FlowConnection & Record<string, unknown>>[];
  variables: FlowVariable[];
  bindings: FlowNodeBinding[];
  editorState: EditorState;
};

type FlowAction =
  | { type: 'ADD_NODE'; node: Node<EnhancedFlowNode> }
  | { type: 'UPDATE_NODE'; id: string; updates: Partial<Node<EnhancedFlowNode>> }
  | { type: 'REMOVE_NODE'; id: string }
  | { type: 'ADD_EDGE'; edge: Edge<FlowConnection & Record<string, unknown>> }
  | { type: 'UPDATE_EDGE'; id: string; updates: Partial<Edge<FlowConnection & Record<string, unknown>>> }
  | { type: 'REMOVE_EDGE'; id: string }
  | { type: 'SET_NODES'; nodes: Node<EnhancedFlowNode>[] }
  | { type: 'SET_EDGES'; edges: Edge<FlowConnection & Record<string, unknown>>[] }
  | { type: 'LOAD_STATE'; state: FlowState };

type FlowContextType = {
  state: FlowState;
  dispatch: React.Dispatch<FlowAction>;
  addNode: (node: Omit<Node<EnhancedFlowNode>, 'id'>) => Node<EnhancedFlowNode>;
  updateNode: (id: string, updates: Partial<Node<EnhancedFlowNode>>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Omit<Edge<FlowConnection & Record<string, unknown>>, 'id'>) => Edge<FlowConnection & Record<string, unknown>>;
  updateEdge: (id: string, updates: Partial<Edge<FlowConnection & Record<string, unknown>>>) => void;
  removeEdge: (id: string) => void;
  setNodes: (nodes: Node<EnhancedFlowNode>[]) => void;
  setEdges: (edges: Edge<FlowConnection & Record<string, unknown>>[]) => void;
  getNode: (id: string) => Node<EnhancedFlowNode> | undefined;
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

const DEFAULT_FLOW_VIEW = {
  nodes: [],
  connections: [],
  variables: [],
  selected: {
    nodeIds: [],
    connectionIds: []
  },
  viewport: {
    zoom: 1,
    offset: { x: 0, y: 0 }
  },
  settings: {
    snapToGrid: true,
    gridSize: 20
  },
  elementBindings: []
};

function createFlowEditorState(existingState: EditorState): EditorState {
  return {
    ...existingState,
    currentView: 'flow',
    flowView: {
      ...DEFAULT_FLOW_VIEW,
      ...existingState.flowView
    }
  };
}

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'ADD_NODE':
      return {
        ...state,
        nodes: [...state.nodes, action.node],
        editorState: {
          ...state.editorState,
          flowView: {
            ...state.editorState.flowView,
            nodes: [...state.editorState.flowView.nodes, convertToFlowNode(action.node)]
          }
        }
      };
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(node => 
          node.id === action.id ? { ...node, ...action.updates } : node
        ),
        editorState: {
          ...state.editorState,
          flowView: {
            ...state.editorState.flowView,
            nodes: state.editorState.flowView.nodes.map(node => 
              node.id === action.id ? { ...node, ...convertToFlowNodeUpdates(action.updates) } : node
            )
          }
        }
      };
    case 'REMOVE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.id),
        edges: state.edges.filter(
          edge => edge.source !== action.id && edge.target !== action.id
        ),
        editorState: {
          ...state.editorState,
          flowView: {
            ...state.editorState.flowView,
            nodes: state.editorState.flowView.nodes.filter(node => node.id !== action.id),
            connections: state.editorState.flowView.connections.filter(
              conn => conn.source.nodeId !== action.id && conn.target.nodeId !== action.id
            )
          }
        }
      };
    case 'ADD_EDGE':
      return {
        ...state,
        edges: [...state.edges, action.edge],
        editorState: {
          ...state.editorState,
          flowView: {
            ...state.editorState.flowView,
            connections: [...state.editorState.flowView.connections, convertToFlowConnection(action.edge)]
          }
        }
      };
    case 'UPDATE_EDGE':
      return {
        ...state,
        edges: state.edges.map(edge =>
          edge.id === action.id ? { ...edge, ...action.updates } : edge
        ),
        editorState: {
          ...state.editorState,
          flowView: {
            ...state.editorState.flowView,
            connections: state.editorState.flowView.connections.map(conn =>
              conn.id === action.id ? { ...conn, ...convertToFlowConnectionUpdates(action.updates) } : conn
            )
          }
        }
      };
    case 'REMOVE_EDGE':
      return {
        ...state,
        edges: state.edges.filter(edge => edge.id !== action.id),
        editorState: {
          ...state.editorState,
          flowView: {
            ...state.editorState.flowView,
            connections: state.editorState.flowView.connections.filter(conn => conn.id !== action.id)
          }
        }
      };
    case 'SET_NODES':
      return {
        ...state,
        nodes: action.nodes,
        editorState: {
          ...state.editorState,
          flowView: {
            ...state.editorState.flowView,
            nodes: action.nodes.map(convertToFlowNode)
          }
        }
      };
    case 'SET_EDGES':
      return {
        ...state,
        edges: action.edges,
        editorState: {
          ...state.editorState,
          flowView: {
            ...state.editorState.flowView,
            connections: action.edges.map(convertToFlowConnection)
          }
        }
      };
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
}

function convertToFlowNode(node: Node<EnhancedFlowNode>) {
  return {
    ...node.data,
    id: node.id,
    position: node.position,
    dimensions: node.data.dimensions,
    metadata: {
      ...(node.data.metadata || { created: Date.now(), createdBy: 'unknown' }),
      modified: Date.now()
    },
    ports: node.data.ports || [],
    sourcePosition: node.data.sourcePosition as Position | undefined,
    targetPosition: node.data.targetPosition as Position | undefined,
    type: node.data.type || 'function',
    language: node.data.language || 'javascript',
    code: node.data.code || '',
    inputs: node.data.inputs || [],
    outputs: node.data.outputs || []
  };
}

function convertToFlowNodeUpdates(updates: Partial<Node<EnhancedFlowNode>>) {
  return {
    ...updates.data,
    position: updates.position,
    dimensions: updates.data?.dimensions
  };
}

function convertToFlowConnection(edge: Edge<FlowConnection & Record<string, unknown>>) {
  return {
    ...edge.data,
    id: edge.id,
    source: {
      nodeId: edge.source,
      portId: edge.sourceHandle || ''
    },
    target: {
      nodeId: edge.target,
      portId: edge.targetHandle || ''
    }
  };
}

function convertToFlowConnectionUpdates(updates: Partial<Edge<FlowConnection & Record<string, unknown>>>) {
  return {
    ...updates.data,
    source: updates.source ? { nodeId: updates.source, portId: updates.sourceHandle || '' } : undefined,
    target: updates.target ? { nodeId: updates.target, portId: updates.targetHandle || '' } : undefined
  };
}

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: editorState } = useEditor();
  
  const initialState: FlowState = useMemo(() => ({
    nodes: [],
    edges: [],
    variables: [],
    bindings: [],
    editorState: createFlowEditorState(editorState)
  }), [editorState]);

  const [state, dispatch] = useReducer(flowReducer, initialState);

  const getNode = (id: string) => state.nodes.find(node => node.id === id);

  const addNode = (node: Omit<Node<EnhancedFlowNode>, 'id'>) => {
    const newNode = { ...node, id: uuidv4() };
    dispatch({ type: 'ADD_NODE', node: newNode });
    return newNode;
  };

  const updateNode = (id: string, updates: Partial<Node<EnhancedFlowNode>>) => {
    dispatch({ type: 'UPDATE_NODE', id, updates });
  };

  const removeNode = (id: string) => {
    dispatch({ type: 'REMOVE_NODE', id });
  };

  const addEdge = (edge: Omit<Edge<FlowConnection & Record<string, unknown>>, 'id'>) => {
    const newEdge = { ...edge, id: uuidv4() };
    dispatch({ type: 'ADD_EDGE', edge: newEdge });
    return newEdge;
  };

  const updateEdge = (id: string, updates: Partial<Edge<FlowConnection & Record<string, unknown>>>) => {
    dispatch({ type: 'UPDATE_EDGE', id, updates });
  };

  const removeEdge = (id: string) => {
    dispatch({ type: 'REMOVE_EDGE', id });
  };

  const setNodes = (nodes: Node<EnhancedFlowNode>[]) => {
    dispatch({ type: 'SET_NODES', nodes });
  };

  const setEdges = (edges: Edge<FlowConnection & Record<string, unknown>>[]) => {
    dispatch({ type: 'SET_EDGES', edges });
  };

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    updateEdge,
    removeEdge,
    setNodes,
    setEdges,
    getNode
  }), [state]);

  return (
    <FlowContext.Provider value={contextValue}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};