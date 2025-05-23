"use client";

import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { Node, Edge, XYPosition, Position } from '@xyflow/react';
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

const {state} = useEditor()

function createInitialEditorState(): EditorState {
  return {
    currentView: 'flow',
    designView: {
      ...state.designView,
    //   canvas: {
    //     type: '2d',
    //     dimensions: { width: 1920, height: 1080 },
    //     background: {
    //       type: 'color',
    //       color: '#ffffff',
    //       opacity: 1,
    //       blendMode: 'normal'
    //     },
    //     grid: {
    //       enabled: true,
    //       size: 20,
    //       subdivisions: 5,
    //       color: '#e5e7eb',
    //       opacity: 0.5,
    //       snapping: { enabled: true, strength: 0.5 }
    //     },
    //     breakpoints: [],
    //     currentBreakpointId: '',
    //     artboards: [],
    //     currentArtboardId: ''
    //   },
    //   elements: [],
    //   selectedElements: [],
    //   interactionState: {
    //     mode: 'select',
    //     status: 'idle'
    //   },
    //   viewport: {
    //     position: { x: 0, y: 0 },
    //     zoom: 1,
    //     dimensions: { width: 0, height: 0 },
    //     visibleRect: {
    //       position: { x: 0, y: 0 },
    //       dimensions: { width: 0, height: 0 }
    //     }
    //   },
    //   guides: [],
    //   assetOverrides: []
    },
    flowView: {
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
    },
    componentLibrary: {
      components: [],
      categories: [],
      tags: []
    },
    designSystems: [],
    assets: {
      assets: [],
      categories: [],
      tags: []
    },
    variables: {
      variables: [],
      scopes: [],
      types: []
    },
    dataSources: {
      sources: [],
      types: []
    },
    content: {
      models: [],
      entries: []
    },
    i18n: {
      languages: [],
      bundles: []
    },
    history: {
      undoStack: [],
      redoStack: [],
      current: {
        id: uuidv4(),
        type: 'flow',
        timestamp: Date.now(),
        description: 'Initial state',
        snapshot: {
          design: createInitialEditorState().designView,
          flow: createInitialEditorState().flowView,
          data: {
            variables: [],
            dataSources: [],
            content: [],
            i18n: [],
            apiEndpoints: []
          }
        }
      }
    },
    settings: {
      theme: 'system',
      defaultView: 'flow',
      componentLibraryView: 'grid',
      autoSave: true,
      autoSaveInterval: 5000,
      keyboardShortcuts: [],
      experimentalFeatures: {
        aiAssist: false,
        realTimeCollaboration: false,
        versionControlIntegration: false,
        advancedAnimations: false
      },
      versionControl: {
        enabled: false,
        autoCommit: false,
        branch: 'main'
      },
      build: {
        mode: "development",
        outputDir: "dist",
        cleanBeforeBuild: true
      },
      deployment: {
        defaultEnvironment: "development",
        autoDeploy: false
      }
    },
    collaboration: {
      users: [],
      session: {
        id: uuidv4(),
        started: Date.now(),
        active: false
      },
      comments: [],
      changes: []
    },
    plugins: {
      plugins: [],
      enabled: []
    },
    ai: {
      enabled: false,
      providers: [],
      history: []
    },
    deployment: {
      environments: [],
      history: [],
      artifacts: []
    },
    ui: {
      panels: [],
      tools: [],
      inspectors: [],
      modals: [],
      toasts: [],
      preferences: {
        theme: 'system',
        layout: 'default',
        iconSize: 'medium',
        density: 'normal',
        animations: true,
        transitions: true
      }
    }
  };
}

const initialState: FlowState = {
  nodes: [],
  edges: [],
  variables: [],
  bindings: [],
  editorState: createInitialEditorState()
};

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'ADD_NODE':
      return {
        ...state,
        nodes: [...state.nodes, action.node],
        editorState: updateFlowViewNodes(state.editorState, [...state.nodes, action.node])
      };
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(node => 
          node.id === action.id ? { ...node, ...action.updates } : node
        ),
        editorState: updateFlowViewNodes(
          state.editorState,
          state.nodes.map(node => 
            node.id === action.id ? { ...node, ...action.updates } : node
          )
        )
      };
    case 'REMOVE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.id),
        edges: state.edges.filter(
          edge => edge.source !== action.id && edge.target !== action.id
        ),
        editorState: updateFlowViewAfterNodeRemoval(state.editorState, action.id)
      };
    case 'ADD_EDGE':
      return {
        ...state,
        edges: [...state.edges, action.edge],
        editorState: updateFlowViewEdges(state.editorState, [...state.edges, action.edge])
      };
    case 'UPDATE_EDGE':
      return {
        ...state,
        edges: state.edges.map(edge =>
          edge.id === action.id ? { ...edge, ...action.updates } : edge
        ),
        editorState: updateFlowViewEdges(
          state.editorState,
          state.edges.map(edge =>
            edge.id === action.id ? { ...edge, ...action.updates } : edge
          )
        )
      };
    case 'REMOVE_EDGE':
      return {
        ...state,
        edges: state.edges.filter(edge => edge.id !== action.id),
        editorState: updateFlowViewEdges(
          state.editorState,
          state.edges.filter(edge => edge.id !== action.id)
        )
      };
    case 'SET_NODES':
      return {
        ...state,
        nodes: action.nodes,
        editorState: updateFlowViewNodes(state.editorState, action.nodes)
      };
    case 'SET_EDGES':
      return {
        ...state,
        edges: action.edges,
        editorState: updateFlowViewEdges(state.editorState, action.edges)
      };
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
}

function updateFlowViewNodes(editorState: EditorState, nodes: Node<EnhancedFlowNode>[]): EditorState {
  return {
    ...editorState,
    flowView: {
      ...editorState.flowView,
      nodes: nodes.map(node => ({
        ...node.data,
        id: node.id,
        position: node.position,
        dimensions: node.data.dimensions,
        metadata: {
          ...(node.data.metadata || { created: Date.now(), createdBy: 'unknown' }),
          modified: node.data.metadata?.updated ?? Date.now()
        },
        ports: node.data.ports || [],
        // Handle position types properly
        sourcePosition: node.data.sourcePosition as Position | undefined,
        targetPosition: node.data.targetPosition as Position | undefined,
        type: node.data.type || 'function',
        language: node.data.language || 'javascript',
        code: node.data.code || '',
        inputs: node.data.inputs || [],
        outputs: node.data.outputs || []
      }))
    }
  };
}

function updateFlowViewEdges(editorState: EditorState, edges: Edge<FlowConnection & Record<string, unknown>>[]): EditorState {
  return {
    ...editorState,
    flowView: {
      ...editorState.flowView,
      connections: edges.map(edge => ({
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
      }))
    }
  };
}

function updateFlowViewAfterNodeRemoval(editorState: EditorState, nodeId: string): EditorState {
  return {
    ...editorState,
    flowView: {
      ...editorState.flowView,
      nodes: editorState.flowView.nodes.filter(node => node.id !== nodeId),
      connections: editorState.flowView.connections.filter(
        conn => conn.source.nodeId !== nodeId && conn.target.nodeId !== nodeId
      )
    }
  };
}

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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