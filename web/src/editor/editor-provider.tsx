"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { 
  Asset, 
  AssetID, 
  ComponentDefinition, 
  DesignElement, 
  DesignSystem, 
  DesignViewState, 
  Editor, 
  EditorState, 
  FlowConnection, 
  FlowNode, 
  FlowViewState, 
  PluginUI, 
  User, 
  UUID, 
  Variable 
} from '@/editor/types';

// Initial state
const initialState: EditorState = {
  currentView: 'design',
  designView: {
    canvas: {
      type: '2d',
      dimensions: { width: 1440, height: 1024 },
      background: { type: 'color', color: '#ffffff', opacity: 1, blendMode: 'normal' },
      grid: {
        enabled: true,
        size: 10,
        subdivisions: 5,
        color: '#e0e0e0',
        opacity: 0.5,
        snapping: { enabled: true, strength: 0.5 }
      },
      breakpoints: [],
      currentBreakpointId: '' as UUID,
      artboards: [],
      currentArtboardId: '' as UUID
    },
    elements: [],
    selectedElements: [],
    interactionState: { mode: 'select', status: 'idle' },
    viewport: {
      position: { x: 0, y: 0 },
      zoom: 1,
      dimensions: { width: 1440, height: 800 },
      visibleRect: { position: { x: 0, y: 0 }, dimensions: { width: 1440, height: 800 } }
    },
    guides: [],
    assetOverrides: []
  },
  flowView: {
    nodes: [],
    connections: [],
    variables: [],
    selected: { nodeIds: [], connectionIds: [] },
    viewport: { zoom: 1, offset: { x: 0, y: 0 } },
    settings: { snapToGrid: true, gridSize: 20 }
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
      id: '' as UUID,
      type: 'design',
      timestamp: Date.now(),
      description: 'Initial state',
      snapshot: {
        design: {
          canvas: {
            type: '2d',
            dimensions: { width: 1440, height: 1024 },
            background: { type: 'color', color: '#ffffff', opacity: 1, blendMode: 'normal' },
            grid: {
              enabled: true,
              size: 10,
              subdivisions: 5,
              color: '#e0e0e0',
              opacity: 0.5,
              snapping: { enabled: true, strength: 0.5 }
            },
            breakpoints: [],
            currentBreakpointId: '' as UUID,
            artboards: [],
            currentArtboardId: '' as UUID
          },
          elements: [],
          selectedElements: [],
          interactionState: { mode: 'select', status: 'idle' },
          viewport: {
            position: { x: 0, y: 0 },
            zoom: 1,
            dimensions: { width: 1440, height: 800 },
            visibleRect: { position: { x: 0, y: 0 }, dimensions: { width: 1440, height: 800 } }
          },
          guides: [],
          assetOverrides: []
        },
        flow: {
          nodes: [],
          connections: [],
          variables: [],
          selected: { nodeIds: [], connectionIds: [] },
          viewport: { zoom: 1, offset: { x: 0, y: 0 } },
          settings: { snapToGrid: true, gridSize: 20 }
        },
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
    theme: 'light',
    defaultView: 'design',
    componentLibraryView: 'grid',
    autoSave: true,
    autoSaveInterval: 30000,
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
      outputDir: "build",
      cleanBeforeBuild: true
    },
    deployment: {
      defaultEnvironment: "staging",
      autoDeploy: false
    }
  },
  collaboration: {
    users: [],
    session: {
      id: '' as UUID,
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
  }
};

// Action types
type EditorAction =
  | { type: 'SET_CURRENT_VIEW'; payload: 'design' | 'flow' | 'both' }
  | { type: 'UPDATE_DESIGN_VIEW'; payload: Partial<EditorState['designView']> }
  | { type: 'UPDATE_FLOW_VIEW'; payload: Partial<EditorState['flowView']> }
  | { type: 'ADD_ELEMENT'; payload: DesignElement }
  | { type: 'UPDATE_ELEMENT'; payload: { id: UUID; updates: Partial<DesignElement> } }
  | { type: 'DELETE_ELEMENT'; payload: UUID }
  | { type: 'SELECT_ELEMENTS'; payload: UUID[] }
  | { type: 'ADD_NODE'; payload: FlowNode }
  | { type: 'UPDATE_NODE'; payload: { id: UUID; updates: Partial<FlowNode> } }
  | { type: 'DELETE_NODE'; payload: UUID }
  | { type: 'ADD_CONNECTION'; payload: FlowConnection }
  | { type: 'UPDATE_CONNECTION'; payload: { id: UUID; updates: Partial<FlowConnection> } }
  | { type: 'DELETE_CONNECTION'; payload: UUID }
  | { type: 'SELECT_NODES'; payload: UUID[] }
  | { type: 'SELECT_CONNECTIONS'; payload: UUID[] }
  | { type: 'ADD_VARIABLE'; payload: Variable }
  | { type: 'UPDATE_VARIABLE'; payload: { id: UUID; updates: Partial<Variable> } }
  | { type: 'DELETE_VARIABLE'; payload: UUID }
  | { type: 'ADD_COMPONENT'; payload: ComponentDefinition }
  | { type: 'UPDATE_COMPONENT'; payload: { id: UUID; updates: Partial<ComponentDefinition> } }
  | { type: 'DELETE_COMPONENT'; payload: UUID }
  | { type: 'ADD_DESIGN_SYSTEM'; payload: DesignSystem }
  | { type: 'UPDATE_DESIGN_SYSTEM'; payload: { id: UUID; updates: Partial<DesignSystem> } }
  | { type: 'DELETE_DESIGN_SYSTEM'; payload: UUID }
  | { type: 'ADD_ASSET'; payload: Asset }
  | { type: 'UPDATE_ASSET'; payload: { id: AssetID; updates: Partial<Asset> } }
  | { type: 'DELETE_ASSET'; payload: AssetID }
  | { type: 'ADD_PLUGIN'; payload: {
    id: UUID;
    name: string;
    description: string;
    version: string;
    author: string;
    icon: AssetID;
    entryPoint: string;
    permissions: string[];
    ui?: PluginUI;
  }}
  | { type: 'ENABLE_PLUGIN'; payload: UUID }
  | { type: 'DISABLE_PLUGIN'; payload: UUID }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_HISTORY' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<EditorState['settings']> }
  | { type: 'RESET_STATE'; payload?: Partial<EditorState> }
  | { type: 'LOAD_EDITOR'; payload: Editor };

// Reducer function
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'UPDATE_DESIGN_VIEW':
      return { ...state, designView: { ...state.designView, ...action.payload } };
    
    case 'UPDATE_FLOW_VIEW':
      return { ...state, flowView: { ...state.flowView, ...action.payload } };
    
    case 'ADD_ELEMENT':
      return {
        ...state,
        designView: {
          ...state.designView,
          elements: [...state.designView.elements, action.payload]
        }
      };
    
    case 'UPDATE_ELEMENT':
      return {
        ...state,
        designView: {
          ...state.designView,
          elements: state.designView.elements.map(el => 
            el.id === action.payload.id ? ({ ...el, ...action.payload.updates } as DesignElement) : el
          )
        }
      };
    
    case 'DELETE_ELEMENT':
      return {
        ...state,
        designView: {
          ...state.designView,
          elements: state.designView.elements.filter(el => el.id !== action.payload),
          selectedElements: state.designView.selectedElements.filter(id => id !== action.payload)
        }
      };
    
    case 'SELECT_ELEMENTS':
      return {
        ...state,
        designView: {
          ...state.designView,
          selectedElements: action.payload
        }
      };
    
    case 'ADD_NODE':
      return {
        ...state,
        flowView: {
          ...state.flowView,
          nodes: [...state.flowView.nodes, action.payload]
        }
      };
    
    case 'UPDATE_NODE':
      return {
        ...state,
        flowView: {
          ...state.flowView,
          nodes: state.flowView.nodes.map(node => {
            if (node.id === action.payload.id) {
              const { type, ...updatesWithoutType } = action.payload.updates;
              return { ...node, ...updatesWithoutType } as FlowNode;
            }
            return node;
          })
        }
      };
    
    case 'DELETE_NODE':
      return {
        ...state,
        flowView: {
          ...state.flowView,
          nodes: state.flowView.nodes.filter(node => node.id !== action.payload),
          connections: state.flowView.connections.filter(
            conn => conn.source.nodeId !== action.payload && conn.target.nodeId !== action.payload
          ),
          selected: {
            nodeIds: state.flowView.selected.nodeIds.filter(id => id !== action.payload),
            connectionIds: state.flowView.selected.connectionIds
          }
        }
      };
    
    case 'ADD_CONNECTION':
      return {
        ...state,
        flowView: {
          ...state.flowView,
          connections: [...state.flowView.connections, action.payload]
        }
      };
    
    case 'UPDATE_CONNECTION':
      return {
        ...state,
        flowView: {
          ...state.flowView,
          connections: state.flowView.connections.map(conn => 
            conn.id === action.payload.id ? { ...conn, ...action.payload.updates } : conn
          )
        }
      };
    
    case 'DELETE_CONNECTION':
      return {
        ...state,
        flowView: {
          ...state.flowView,
          connections: state.flowView.connections.filter(conn => conn.id !== action.payload),
          selected: {
            nodeIds: state.flowView.selected.nodeIds,
            connectionIds: state.flowView.selected.connectionIds.filter(id => id !== action.payload)
          }
        }
      };
    
    case 'SELECT_NODES':
      return {
        ...state,
        flowView: {
          ...state.flowView,
          selected: {
            ...state.flowView.selected,
            nodeIds: action.payload
          }
        }
      };
    
    case 'SELECT_CONNECTIONS':
      return {
        ...state,
        flowView: {
          ...state.flowView,
          selected: {
            ...state.flowView.selected,
            connectionIds: action.payload
          }
        }
      };
    
    case 'ADD_VARIABLE':
      return {
        ...state,
        variables: {
          ...state.variables,
          variables: [...state.variables.variables, action.payload]
        }
      };
    
    case 'UPDATE_VARIABLE':
      return {
        ...state,
        variables: {
          ...state.variables,
          variables: state.variables.variables.map(v => 
            v.id === action.payload.id ? { ...v, ...action.payload.updates } : v
          )
        }
      };
    
    case 'DELETE_VARIABLE':
      return {
        ...state,
        variables: {
          ...state.variables,
          variables: state.variables.variables.filter(v => v.id !== action.payload)
        }
      };
    
    case 'ADD_COMPONENT':
      return {
        ...state,
        componentLibrary: {
          ...state.componentLibrary,
          components: [...state.componentLibrary.components, action.payload]
        }
      };
    
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        componentLibrary: {
          ...state.componentLibrary,
          components: state.componentLibrary.components.map(c => 
            c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
          )
        }
      };
    
    case 'DELETE_COMPONENT':
      return {
        ...state,
        componentLibrary: {
          ...state.componentLibrary,
          components: state.componentLibrary.components.filter(c => c.id !== action.payload)
        }
      };
    
    case 'ADD_DESIGN_SYSTEM':
      return {
        ...state,
        designSystems: [...state.designSystems, action.payload]
      };
    
    case 'UPDATE_DESIGN_SYSTEM':
      return {
        ...state,
        designSystems: state.designSystems.map(ds => 
          ds.id === action.payload.id ? { ...ds, ...action.payload.updates } : ds
        )
      };
    
    case 'DELETE_DESIGN_SYSTEM':
      return {
        ...state,
        designSystems: state.designSystems.filter(ds => ds.id !== action.payload)
      };
    
    case 'ADD_ASSET':
      return {
        ...state,
        assets: {
          ...state.assets,
          assets: [...state.assets.assets, action.payload]
        }
      };
    
    case 'UPDATE_ASSET':
      return {
        ...state,
        assets: {
          ...state.assets,
          assets: state.assets.assets.map(a => 
            a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
          )
        }
      };
    
    case 'DELETE_ASSET':
      return {
        ...state,
        assets: {
          ...state.assets,
          assets: state.assets.assets.filter(a => a.id !== action.payload)
        }
      };
    
    case 'ADD_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          plugins: [...state.plugins.plugins, {
            id: action.payload.id,
            name: action.payload.name,
            description: action.payload.description,
            version: action.payload.version,
            author: action.payload.author,
            icon: action.payload.icon,
            entryPoint: action.payload.entryPoint,
            permissions: action.payload.permissions,
            ui: action.payload.ui
          }]
        }
      };
    
    case 'ENABLE_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          enabled: state.plugins.enabled.includes(action.payload) ? state.plugins.enabled : [...state.plugins.enabled, action.payload]
        }
      };
    
    case 'DISABLE_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          enabled: state.plugins.enabled.filter(id => id !== action.payload)
        }
      };
    
    case 'UNDO':
      if (state.history.undoStack.length === 0) return state;
      const lastHistory = state.history.undoStack[state.history.undoStack.length - 1];
      const { design: savedDesign, flow: savedFlow, data: savedData } = lastHistory.snapshot;
      return {
        ...state,
        designView: savedDesign,
        flowView: savedFlow,
        history: {
          undoStack: state.history.undoStack.slice(0, -1),
          redoStack: [...state.history.redoStack, state.history.current],
          current: lastHistory
        }
      };
    
    case 'REDO':
      if (state.history.redoStack.length === 0) return state;
      const redoHistory = state.history.redoStack[state.history.redoStack.length - 1];
      return {
        ...state,
        designView: redoHistory.snapshot.design,
        flowView: redoHistory.snapshot.flow,
        variables: {
          ...state.variables,
          variables: redoHistory.snapshot.data.variables
        },
        dataSources: {
          ...state.dataSources,
          sources: redoHistory.snapshot.data.dataSources
        },
        content: {
          ...state.content,
          entries: redoHistory.snapshot.data.content
        },
        i18n: {
          ...state.i18n,
          bundles: redoHistory.snapshot.data.i18n
        },
        history: {
          undoStack: [...state.history.undoStack, state.history.current],
          redoStack: state.history.redoStack.slice(0, -1),
          current: redoHistory
        }
      };
    
    case 'SAVE_HISTORY': {
      return {
        ...state,
        history: {
          undoStack: [...state.history.undoStack, state.history.current],
          redoStack: [],
          current: {
            id: crypto.randomUUID() as UUID,
            type: state.currentView,
            timestamp: Date.now(),
            description: 'User action',
            snapshot: {
              design: state.designView,
              flow: state.flowView,
              data: {
                variables: state.variables.variables,
                dataSources: state.dataSources.sources,
                content: state.content.entries,
                i18n: state.i18n.bundles,
                apiEndpoints: []
              }
            }
          }
        }
      };
    }
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'RESET_STATE':
      return {
        ...initialState,
        ...action.payload
      };
    
    case 'LOAD_EDITOR':
      return {
        ...state,
        ...action.payload.state,
        currentView: 'design'
      };
    
    default:
      return state;
  }
}

// Context
const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  currentEditor: Editor | null;
  currentUser: User | null;
}>({
  state: initialState,
  dispatch: () => null,
  currentEditor: null,
  currentUser: null
});

// Provider component
export function EditorProvider({ 
  children,
  initialEditor,
  currentUser
}: {
  children: React.ReactNode;
  initialEditor: Editor;
  currentUser: User;
}) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Initialize with editor data
  useEffect(() => {
    if (initialEditor) {
      dispatch({ type: 'LOAD_EDITOR', payload: initialEditor });
    }
  }, [initialEditor]);

  // Auto-save functionality
  useEffect(() => {
    if (!state.settings.autoSave) return;

    const interval = setInterval(() => {
      dispatch({ type: 'SAVE_HISTORY' });
    }, state.settings.autoSaveInterval);

    return () => clearInterval(interval);
  }, [state.settings.autoSave, state.settings.autoSaveInterval]);

  return (
    <EditorContext.Provider value={{
      state,
      dispatch,
      currentEditor: initialEditor || null,
      currentUser: currentUser || null
    }}>
      {children}
    </EditorContext.Provider>
  );
}

// Custom hook for using the editor context
export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

// Helper hooks for common operations
export function useDesignView() {
  const { state, dispatch } = useEditor();
  
  return {
    canvas: state.designView.canvas,
    elements: state.designView.elements,
    selectedElements: state.designView.selectedElements,
    interactionState: state.designView.interactionState,
    viewport: state.designView.viewport,
    guides: state.designView.guides,
    
    addElement: (element: DesignElement) => dispatch({ type: 'ADD_ELEMENT', payload: element }),
    updateElement: (id: UUID, updates: Partial<DesignElement>) => 
      dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } }),
    deleteElement: (id: UUID) => dispatch({ type: 'DELETE_ELEMENT', payload: id }),
    selectElements: (ids: UUID[]) => dispatch({ type: 'SELECT_ELEMENTS', payload: ids }),
    updateDesignView: (updates: Partial<DesignViewState>) => 
      dispatch({ type: 'UPDATE_DESIGN_VIEW', payload: updates })
  };
}

export function useFlowView() {
  const { state, dispatch } = useEditor();
  
  return {
    nodes: state.flowView.nodes,
    connections: state.flowView.connections,
    variables: state.flowView.variables,
    selected: state.flowView.selected,
    viewport: state.flowView.viewport,
    settings: state.flowView.settings,
    
    addNode: (node: FlowNode) => dispatch({ type: 'ADD_NODE', payload: node }),
    updateNode: (id: UUID, updates: Partial<FlowNode>) => 
      dispatch({ type: 'UPDATE_NODE', payload: { id, updates } }),
    deleteNode: (id: UUID) => dispatch({ type: 'DELETE_NODE', payload: id }),
    addConnection: (connection: FlowConnection) => 
      dispatch({ type: 'ADD_CONNECTION', payload: connection }),
    updateConnection: (id: UUID, updates: Partial<FlowConnection>) => 
      dispatch({ type: 'UPDATE_CONNECTION', payload: { id, updates } }),
    deleteConnection: (id: UUID) => dispatch({ type: 'DELETE_CONNECTION', payload: id }),
    selectNodes: (ids: UUID[]) => dispatch({ type: 'SELECT_NODES', payload: ids }),
    selectConnections: (ids: UUID[]) => dispatch({ type: 'SELECT_CONNECTIONS', payload: ids }),
    updateFlowView: (updates: Partial<FlowViewState>) => 
      dispatch({ type: 'UPDATE_FLOW_VIEW', payload: updates })
  };
}

export function useComponents() {
  const { state, dispatch } = useEditor();
  
  return {
    components: state.componentLibrary.components,
    categories: state.componentLibrary.categories,
    tags: state.componentLibrary.tags,
    
    addComponent: (component: ComponentDefinition) => 
      dispatch({ type: 'ADD_COMPONENT', payload: component }),
    updateComponent: (id: UUID, updates: Partial<ComponentDefinition>) => 
      dispatch({ type: 'UPDATE_COMPONENT', payload: { id, updates } }),
    deleteComponent: (id: UUID) => dispatch({ type: 'DELETE_COMPONENT', payload: id })
  };
}

export function useDesignSystems() {
  const { state, dispatch } = useEditor();
  
  return {
    designSystems: state.designSystems,
    
    addDesignSystem: (designSystem: DesignSystem) => 
      dispatch({ type: 'ADD_DESIGN_SYSTEM', payload: designSystem }),
    updateDesignSystem: (id: UUID, updates: Partial<DesignSystem>) => 
      dispatch({ type: 'UPDATE_DESIGN_SYSTEM', payload: { id, updates } }),
    deleteDesignSystem: (id: UUID) => dispatch({ type: 'DELETE_DESIGN_SYSTEM', payload: id })
  };
}

export function useVariables() {
  const { state, dispatch } = useEditor();
  
  return {
    variables: state.variables.variables,
    scopes: state.variables.scopes,
    types: state.variables.types,
    
    addVariable: (variable: Variable) => dispatch({ type: 'ADD_VARIABLE', payload: variable }),
    updateVariable: (id: UUID, updates: Partial<Variable>) => 
      dispatch({ type: 'UPDATE_VARIABLE', payload: { id, updates } }),
    deleteVariable: (id: UUID) => dispatch({ type: 'DELETE_VARIABLE', payload: id })
  };
}

export function useAssets() {
  const { state, dispatch } = useEditor();
  
  return {
    assets: state.assets.assets,
    categories: state.assets.categories,
    tags: state.assets.tags,
    
    addAsset: (asset: Asset) => dispatch({ type: 'ADD_ASSET', payload: asset }),
    updateAsset: (id: AssetID, updates: Partial<Asset>) => 
      dispatch({ type: 'UPDATE_ASSET', payload: { id, updates } }),
    deleteAsset: (id: AssetID) => dispatch({ type: 'DELETE_ASSET', payload: id })
  };
}

export function usePlugins() {
  const { state, dispatch } = useEditor();
  
  return {
    plugins: state.plugins.plugins,
    enabled: state.plugins.enabled,
    
    addPlugin: (plugin: { id: UUID; name: string; description: string; version: string; author: string; icon: AssetID; entryPoint: string; permissions: string[]; ui?: PluginUI }) => dispatch({ type: 'ADD_PLUGIN', payload: plugin }),
    enablePlugin: (id: UUID) => dispatch({ type: 'ENABLE_PLUGIN', payload: id }),
    disablePlugin: (id: UUID) => dispatch({ type: 'DISABLE_PLUGIN', payload: id })
  };
}

export function useSettings() {
  const { state, dispatch } = useEditor();
  
  return {
    settings: state.settings,
    updateSettings: (updates: Partial<EditorState['settings']>) => 
      dispatch({ type: 'UPDATE_SETTINGS', payload: updates })
  };
}

export function useHistory() {
  const { state, dispatch } = useEditor();
  
  return {
    undoStack: state.history.undoStack,
    redoStack: state.history.redoStack,
    current: state.history.current,
    
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
    saveHistory: () => dispatch({ type: 'SAVE_HISTORY' })
  };
}

export function useCurrentEditor() {
  const { currentEditor } = useEditor();
  return currentEditor;
}

export function useCurrentUser() {
  const { currentUser } = useEditor();
  return currentUser;
}