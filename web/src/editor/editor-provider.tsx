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
  Variable,
  DeploymentEnvironment,
  DeploymentRecord,
  DeploymentArtifact,
  ContentModel,
  ContentEntry,
  I18nLanguage,
  I18nBundle,
  DataSource,
  EditorEnvironment,
  CommentThread,
  Collaborator,
  AIProvider,
  AIInteraction,
  Artboard,
  Breakpoint,
  CanvasBackground,
  CanvasGradient,
  CanvasPattern,
  Guide,
  AssetOverride,
  KeyboardShortcut,
  VariableScope,
  VariableTypeDefinition,
  DataSourceType,
  AssetCategory,
  TemplateCategory,
  ComponentCategory,
  Plugin,
  PluginPanel,
  PluginTool,
  PluginInspector,
  UIPanel,
  UITool,
  UIInspector,
  UIModal,
  UIToast,
  UIPreferences,
  InteractionState,
  DragState,
  ResizeState,
  ConnectState,
  ViewportState,
  RenderSettings,
  UIState,
  Position,
  Dimensions,
  Rect,
  GridSettings,
  LayoutConstraints,
  ElementMetadata,
  FlowNodeStyle,
  FlowNodeMetadata,
  StyleProperties,
  EditorSettings
} from '@/editor/types';

// Initial state with all properties
const initialState: EditorState = {
  currentView: 'design',
  designView: {
    canvas: {
      type: '2d',
      dimensions: { width: 900, height: 700 },
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
    elementBindings: [],
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
          elementBindings: [],
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
  deployment: {
    environments: [],
    history: [],
    artifacts: []
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
  },
  ui: {
    panels: [],
    tools: [],
    inspectors: [],
    modals: [],
    toasts: [],
    preferences: {
      theme: 'light',
      layout: 'default',
      iconSize: 'medium',
      density: 'normal',
      animations: true,
      transitions: true
    }
  }
};

// Complete action types
type EditorAction =
  // Core view actions
  | { type: 'SET_CURRENT_VIEW'; payload: 'design' | 'flow' | 'both' }
  | { type: 'UPDATE_DESIGN_VIEW'; payload: Partial<DesignViewState> }
  | { type: 'UPDATE_FLOW_VIEW'; payload: Partial<FlowViewState> }
  
  // Design elements
  | { type: 'ADD_ELEMENT'; payload: DesignElement }
  | { type: 'UPDATE_ELEMENT'; payload: { id: UUID; updates: Partial<DesignElement> } }
  | { type: 'DELETE_ELEMENT'; payload: UUID }
  | { type: 'SELECT_ELEMENTS'; payload: UUID[] }
  | { type: 'UPDATE_INTERACTION_STATE'; payload: Partial<InteractionState> }
  | { type: 'UPDATE_VIEWPORT'; payload: Partial<ViewportState> }
  
  // Flow elements
  | { type: 'ADD_NODE'; payload: FlowNode }
  | { type: 'UPDATE_NODE'; payload: { id: UUID; updates: Partial<FlowNode> } }
  | { type: 'DELETE_NODE'; payload: UUID }
  | { type: 'ADD_CONNECTION'; payload: FlowConnection }
  | { type: 'UPDATE_CONNECTION'; payload: { id: UUID; updates: Partial<FlowConnection> } }
  | { type: 'DELETE_CONNECTION'; payload: UUID }
  | { type: 'SELECT_NODES'; payload: UUID[] }
  | { type: 'SELECT_CONNECTIONS'; payload: UUID[] }
  
  // Variables
  | { type: 'ADD_VARIABLE'; payload: Variable }
  | { type: 'UPDATE_VARIABLE'; payload: { id: UUID; updates: Partial<Variable> } }
  | { type: 'DELETE_VARIABLE'; payload: UUID }
  | { type: 'ADD_VARIABLE_SCOPE'; payload: VariableScope }
  | { type: 'UPDATE_VARIABLE_SCOPE'; payload: { id: UUID; updates: Partial<VariableScope> } }
  | { type: 'DELETE_VARIABLE_SCOPE'; payload: UUID }
  
  // Components
  | { type: 'ADD_COMPONENT'; payload: ComponentDefinition }
  | { type: 'UPDATE_COMPONENT'; payload: { id: UUID; updates: Partial<ComponentDefinition> } }
  | { type: 'DELETE_COMPONENT'; payload: UUID }
  | { type: 'ADD_COMPONENT_CATEGORY'; payload: ComponentCategory }
  | { type: 'UPDATE_COMPONENT_CATEGORY'; payload: { id: UUID; updates: Partial<ComponentCategory> } }
  | { type: 'DELETE_COMPONENT_CATEGORY'; payload: UUID }
  
  // Design systems
  | { type: 'ADD_DESIGN_SYSTEM'; payload: DesignSystem }
  | { type: 'UPDATE_DESIGN_SYSTEM'; payload: { id: UUID; updates: Partial<DesignSystem> } }
  | { type: 'DELETE_DESIGN_SYSTEM'; payload: UUID }
  
  // Assets
  | { type: 'ADD_ASSET'; payload: Asset }
  | { type: 'UPDATE_ASSET'; payload: { id: AssetID; updates: Partial<Asset> } }
  | { type: 'DELETE_ASSET'; payload: AssetID }
  | { type: 'ADD_ASSET_CATEGORY'; payload: AssetCategory }
  | { type: 'UPDATE_ASSET_CATEGORY'; payload: { id: UUID; updates: Partial<AssetCategory> } }
  | { type: 'DELETE_ASSET_CATEGORY'; payload: UUID }
  
  // Plugins
  | { type: 'ADD_PLUGIN'; payload: Plugin }
  | { type: 'UPDATE_PLUGIN'; payload: { id: UUID; updates: Partial<Plugin> } }
  | { type: 'DELETE_PLUGIN'; payload: UUID }
  | { type: 'ENABLE_PLUGIN'; payload: UUID }
  | { type: 'DISABLE_PLUGIN'; payload: UUID }
  | { type: 'ADD_PLUGIN_PANEL'; payload: PluginPanel }
  | { type: 'UPDATE_PLUGIN_PANEL'; payload: { id: UUID; updates: Partial<PluginPanel> } }
  | { type: 'DELETE_PLUGIN_PANEL'; payload: UUID }
  
  // History
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_HISTORY' }
  
  // Settings
  | { type: 'UPDATE_SETTINGS'; payload: Partial<EditorSettings> }
  | { type: 'ADD_KEYBOARD_SHORTCUT'; payload: KeyboardShortcut }
  | { type: 'UPDATE_KEYBOARD_SHORTCUT'; payload: { action: string; updates: Partial<KeyboardShortcut> } }
  | { type: 'DELETE_KEYBOARD_SHORTCUT'; payload: string }
  
  // State management
  | { type: 'RESET_STATE'; payload?: Partial<EditorState> }
  | { type: 'LOAD_EDITOR'; payload: Editor }
  
  // Deployment
  | { type: 'ADD_DEPLOYMENT_ENVIRONMENT'; payload: DeploymentEnvironment }
  | { type: 'UPDATE_DEPLOYMENT_ENVIRONMENT'; payload: { id: UUID; updates: Partial<DeploymentEnvironment> } }
  | { type: 'DELETE_DEPLOYMENT_ENVIRONMENT'; payload: UUID }
  | { type: 'ADD_DEPLOYMENT_RECORD'; payload: DeploymentRecord }
  | { type: 'UPDATE_DEPLOYMENT_RECORD'; payload: { id: UUID; updates: Partial<DeploymentRecord> } }
  | { type: 'DELETE_DEPLOYMENT_RECORD'; payload: UUID }
  | { type: 'ADD_DEPLOYMENT_ARTIFACT'; payload: DeploymentArtifact }
  | { type: 'DELETE_DEPLOYMENT_ARTIFACT'; payload: UUID }
  
  // Content management
  | { type: 'ADD_CONTENT_MODEL'; payload: ContentModel }
  | { type: 'UPDATE_CONTENT_MODEL'; payload: { id: UUID; updates: Partial<ContentModel> } }
  | { type: 'DELETE_CONTENT_MODEL'; payload: UUID }
  | { type: 'ADD_CONTENT_ENTRY'; payload: ContentEntry }
  | { type: 'UPDATE_CONTENT_ENTRY'; payload: { id: UUID; updates: Partial<ContentEntry> } }
  | { type: 'DELETE_CONTENT_ENTRY'; payload: UUID }
  
  // Internationalization
  | { type: 'ADD_I18N_LANGUAGE'; payload: I18nLanguage }
  | { type: 'UPDATE_I18N_LANGUAGE'; payload: { code: string; updates: Partial<I18nLanguage> } }
  | { type: 'DELETE_I18N_LANGUAGE'; payload: string }
  | { type: 'ADD_I18N_BUNDLE'; payload: I18nBundle }
  | { type: 'UPDATE_I18N_BUNDLE'; payload: { id: UUID; updates: Partial<I18nBundle> } }
  | { type: 'DELETE_I18N_BUNDLE'; payload: UUID }
  
  // Data sources
  | { type: 'ADD_DATA_SOURCE'; payload: DataSource }
  | { type: 'UPDATE_DATA_SOURCE'; payload: { id: UUID; updates: Partial<DataSource> } }
  | { type: 'DELETE_DATA_SOURCE'; payload: UUID }
  | { type: 'ADD_DATA_SOURCE_TYPE'; payload: DataSourceType }
  | { type: 'UPDATE_DATA_SOURCE_TYPE'; payload: { name: string; updates: Partial<DataSourceType> } }
  | { type: 'DELETE_DATA_SOURCE_TYPE'; payload: string }
  
  // Environments
  | { type: 'ADD_ENVIRONMENT'; payload: EditorEnvironment }
  | { type: 'UPDATE_ENVIRONMENT'; payload: { id: UUID; updates: Partial<EditorEnvironment> } }
  | { type: 'DELETE_ENVIRONMENT'; payload: UUID }
  
  // Collaboration
  | { type: 'ADD_COLLABORATOR'; payload: Collaborator }
  | { type: 'UPDATE_COLLABORATOR'; payload: { userId: UUID; updates: Partial<Collaborator> } }
  | { type: 'REMOVE_COLLABORATOR'; payload: UUID }
  | { type: 'ADD_COMMENT_THREAD'; payload: CommentThread }
  | { type: 'UPDATE_COMMENT_THREAD'; payload: { id: UUID; updates: Partial<CommentThread> } }
  | { type: 'DELETE_COMMENT_THREAD'; payload: UUID }
  | { type: 'START_COLLABORATION_SESSION' }
  | { type: 'END_COLLABORATION_SESSION' }
  
  // AI
  | { type: 'ENABLE_AI'; payload: boolean }
  | { type: 'ADD_AI_PROVIDER'; payload: AIProvider }
  | { type: 'UPDATE_AI_PROVIDER'; payload: { id: UUID; updates: Partial<AIProvider> } }
  | { type: 'DELETE_AI_PROVIDER'; payload: UUID }
  | { type: 'ADD_AI_INTERACTION'; payload: AIInteraction }
  | { type: 'CLEAR_AI_HISTORY' }
  
  // Canvas management
  | { type: 'ADD_ARBOARD'; payload: Artboard }
  | { type: 'UPDATE_ARBOARD'; payload: { id: UUID; updates: Partial<Artboard> } }
  | { type: 'DELETE_ARBOARD'; payload: UUID }
  | { type: 'SET_CURRENT_ARBOARD'; payload: UUID }
  | { type: 'ADD_BREAKPOINT'; payload: Breakpoint }
  | { type: 'UPDATE_BREAKPOINT'; payload: { id: UUID; updates: Partial<Breakpoint> } }
  | { type: 'DELETE_BREAKPOINT'; payload: UUID }
  | { type: 'SET_CURRENT_BREAKPOINT'; payload: UUID }
  | { type: 'UPDATE_CANVAS_BACKGROUND'; payload: Partial<CanvasBackground> }
  | { type: 'UPDATE_CANVAS_GRID'; payload: Partial<GridSettings> }
  | { type: 'ADD_GUIDE'; payload: Guide }
  | { type: 'UPDATE_GUIDE'; payload: { id: UUID; updates: Partial<Guide> } }
  | { type: 'DELETE_GUIDE'; payload: UUID }
  | { type: 'ADD_ASSET_OVERRIDE'; payload: AssetOverride }
  | { type: 'UPDATE_ASSET_OVERRIDE'; payload: { id: UUID; updates: Partial<AssetOverride> } }
  | { type: 'DELETE_ASSET_OVERRIDE'; payload: UUID }
  
  // UI State
  | { type: 'ADD_UI_PANEL'; payload: UIPanel }
  | { type: 'UPDATE_UI_PANEL'; payload: { id: string; updates: Partial<UIPanel> } }
  | { type: 'TOGGLE_UI_PANEL'; payload: string }
  | { type: 'ADD_UI_TOOL'; payload: UITool }
  | { type: 'UPDATE_UI_TOOL'; payload: { id: string; updates: Partial<UITool> } }
  | { type: 'SET_ACTIVE_TOOL'; payload: string | null }
  | { type: 'ADD_UI_INSPECTOR'; payload: UIInspector }
  | { type: 'UPDATE_UI_INSPECTOR'; payload: { id: string; updates: Partial<UIInspector> } }
  | { type: 'TOGGLE_UI_INSPECTOR'; payload: string }
  | { type: 'SHOW_MODAL'; payload: UIModal }
  | { type: 'HIDE_MODAL'; payload: string }
  | { type: 'SHOW_TOAST'; payload: UIToast }
  | { type: 'HIDE_TOAST'; payload: string }
  | { type: 'UPDATE_UI_PREFERENCES'; payload: Partial<UIPreferences> };

// Complete reducer function
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    // Core view actions
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'UPDATE_DESIGN_VIEW':
      return { ...state, designView: { ...state.designView, ...action.payload } };
    
    case 'UPDATE_FLOW_VIEW':
      return { ...state, flowView: { ...state.flowView, ...action.payload } };
    
    // Design elements
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
    
    case 'UPDATE_INTERACTION_STATE':
      return {
        ...state,
        designView: {
          ...state.designView,
          interactionState: { ...state.designView.interactionState, ...action.payload }
        }
      };
    
    case 'UPDATE_VIEWPORT':
      return {
        ...state,
        designView: {
          ...state.designView,
          viewport: { ...state.designView.viewport, ...action.payload }
        }
      };
    
    // Flow elements
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
    
    // Variables
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
    
    case 'ADD_VARIABLE_SCOPE':
      return {
        ...state,
        variables: {
          ...state.variables,
          scopes: [...state.variables.scopes, action.payload]
        }
      };
    
    case 'UPDATE_VARIABLE_SCOPE':
      return {
        ...state,
        variables: {
          ...state.variables,
          scopes: state.variables.scopes.map(scope => 
            scope.id === action.payload.id ? { ...scope, ...action.payload.updates } : scope
          )
        }
      };
    
    case 'DELETE_VARIABLE_SCOPE':
      return {
        ...state,
        variables: {
          ...state.variables,
          scopes: state.variables.scopes.filter(scope => scope.id !== action.payload)
        }
      };
    
    // Components
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
    
    case 'ADD_COMPONENT_CATEGORY':
      return {
        ...state,
        componentLibrary: {
          ...state.componentLibrary,
          categories: [...state.componentLibrary.categories, action.payload]
        }
      };
    
    case 'UPDATE_COMPONENT_CATEGORY':
      return {
        ...state,
        componentLibrary: {
          ...state.componentLibrary,
          categories: state.componentLibrary.categories.map(cat => 
            cat.id === action.payload.id ? { ...cat, ...action.payload.updates } : cat
          )
        }
      };
    
    case 'DELETE_COMPONENT_CATEGORY':
      return {
        ...state,
        componentLibrary: {
          ...state.componentLibrary,
          categories: state.componentLibrary.categories.filter(cat => cat.id !== action.payload)
        }
      };
    
    // Design systems
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
    
    // Assets
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
    
    case 'ADD_ASSET_CATEGORY':
      return {
        ...state,
        assets: {
          ...state.assets,
          categories: [...state.assets.categories, action.payload]
        }
      };
    
    case 'UPDATE_ASSET_CATEGORY':
      return {
        ...state,
        assets: {
          ...state.assets,
          categories: state.assets.categories.map(cat => 
            cat.id === action.payload.id ? { ...cat, ...action.payload.updates } : cat
          )
        }
      };
    
    case 'DELETE_ASSET_CATEGORY':
      return {
        ...state,
        assets: {
          ...state.assets,
          categories: state.assets.categories.filter(cat => cat.id !== action.payload)
        }
      };
    
    // Plugins
    case 'ADD_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          plugins: [...state.plugins.plugins, action.payload]
        }
      };
    
    case 'UPDATE_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          plugins: state.plugins.plugins.map(p => 
            p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
          )
        }
      };
    
    case 'DELETE_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          plugins: state.plugins.plugins.filter(p => p.id !== action.payload),
          enabled: state.plugins.enabled.filter(id => id !== action.payload)
        }
      };
    
    case 'ENABLE_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          enabled: state.plugins.enabled.includes(action.payload) 
            ? state.plugins.enabled 
            : [...state.plugins.enabled, action.payload]
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
    
    case 'ADD_PLUGIN_PANEL':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          plugins: state.plugins.plugins.map(p => {
            if (!p.ui) p.ui = { panels: [], tools: [], inspectors: [] };
            return {
              ...p,
              ui: {
                ...p.ui,
                panels: [...(p.ui?.panels || []), action.payload]
              }
            };
          })
        }
      };
    
    // History
    case 'UNDO':
      if (state.history.undoStack.length === 0) return state;
      const lastHistory = state.history.undoStack[state.history.undoStack.length - 1];
      const { design: savedDesign, flow: savedFlow, data: savedData } = lastHistory.snapshot;
      return {
        ...state,
        designView: savedDesign,
        flowView: savedFlow,
        variables: {
          ...state.variables,
          variables: savedData.variables
        },
        dataSources: {
          ...state.dataSources,
          sources: savedData.dataSources
        },
        content: {
          ...state.content,
          entries: savedData.content
        },
        i18n: {
          ...state.i18n,
          bundles: savedData.i18n
        },
        history: {
          undoStack: state.history.undoStack.slice(0, -1),
          redoStack: [...state.history.redoStack, state.history.current],
          current: lastHistory
        }
      };
    
    case 'REDO':
      if (state.history.redoStack.length === 0) return state;
      const redoHistory = state.history.redoStack[state.history.redoStack.length - 1];
      const { design: redoDesign, flow: redoFlow, data: redoData } = redoHistory.snapshot;
      return {
        ...state,
        designView: redoDesign,
        flowView: redoFlow,
        variables: {
          ...state.variables,
          variables: redoData.variables
        },
        dataSources: {
          ...state.dataSources,
          sources: redoData.dataSources
        },
        content: {
          ...state.content,
          entries: redoData.content
        },
        i18n: {
          ...state.i18n,
          bundles: redoData.i18n
        },
        history: {
          undoStack: [...state.history.undoStack, state.history.current],
          redoStack: state.history.redoStack.slice(0, -1),
          current: redoHistory
        }
      };
    
    case 'SAVE_HISTORY': {
      const newHistory = {
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
      };
      
      return {
        ...state,
        history: {
          undoStack: [...state.history.undoStack, state.history.current],
          redoStack: [],
          current: newHistory
        }
      };
    }
    
    // Settings
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'ADD_KEYBOARD_SHORTCUT':
      return {
        ...state,
        settings: {
          ...state.settings,
          keyboardShortcuts: [...state.settings.keyboardShortcuts, action.payload]
        }
      };
    
    case 'UPDATE_KEYBOARD_SHORTCUT':
      return {
        ...state,
        settings: {
          ...state.settings,
          keyboardShortcuts: state.settings.keyboardShortcuts.map(ks => 
            ks.action === action.payload.action ? { ...ks, ...action.payload.updates } : ks
          )
        }
      };
    
    case 'DELETE_KEYBOARD_SHORTCUT':
      return {
        ...state,
        settings: {
          ...state.settings,
          keyboardShortcuts: state.settings.keyboardShortcuts.filter(ks => ks.action !== action.payload)
        }
      };
    
    // State management
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
    
    // Deployment
    case 'ADD_DEPLOYMENT_ENVIRONMENT':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          environments: [...state.deployment.environments, action.payload]
        }
      };
    
    case 'UPDATE_DEPLOYMENT_ENVIRONMENT':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          environments: state.deployment.environments.map(env => 
            env.id === action.payload.id ? { ...env, ...action.payload.updates } : env
          )
        }
      };
    
    case 'DELETE_DEPLOYMENT_ENVIRONMENT':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          environments: state.deployment.environments.filter(env => env.id !== action.payload)
        }
      };
    
    case 'ADD_DEPLOYMENT_RECORD':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          history: [...state.deployment.history, action.payload]
        }
      };
    
    case 'UPDATE_DEPLOYMENT_RECORD':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          history: state.deployment.history.map(record => 
            record.id === action.payload.id ? { ...record, ...action.payload.updates } : record
          )
        }
      };
    
    case 'DELETE_DEPLOYMENT_RECORD':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          history: state.deployment.history.filter(record => record.id !== action.payload)
        }
      };
    
    case 'ADD_DEPLOYMENT_ARTIFACT':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          artifacts: [...state.deployment.artifacts, action.payload]
        }
      };
    
    case 'DELETE_DEPLOYMENT_ARTIFACT':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          artifacts: state.deployment.artifacts.filter(artifact => artifact.id !== action.payload)
        }
      };
    
    // Content management
    case 'ADD_CONTENT_MODEL':
      return {
        ...state,
        content: {
          ...state.content,
          models: [...state.content.models, action.payload]
        }
      };
    
    case 'UPDATE_CONTENT_MODEL':
      return {
        ...state,
        content: {
          ...state.content,
          models: state.content.models.map(model => 
            model.id === action.payload.id ? { ...model, ...action.payload.updates } : model
          )
        }
      };
    
    case 'DELETE_CONTENT_MODEL':
      return {
        ...state,
        content: {
          ...state.content,
          models: state.content.models.filter(model => model.id !== action.payload)
        }
      };
    
    case 'ADD_CONTENT_ENTRY':
      return {
        ...state,
        content: {
          ...state.content,
          entries: [...state.content.entries, action.payload]
        }
      };
    
    case 'UPDATE_CONTENT_ENTRY':
      return {
        ...state,
        content: {
          ...state.content,
          entries: state.content.entries.map(entry => 
            entry.id === action.payload.id ? { ...entry, ...action.payload.updates } : entry
          )
        }
      };
    
    case 'DELETE_CONTENT_ENTRY':
      return {
        ...state,
        content: {
          ...state.content,
          entries: state.content.entries.filter(entry => entry.id !== action.payload)
        }
      };
    
    // Internationalization
    case 'ADD_I18N_LANGUAGE':
      return {
        ...state,
        i18n: {
          ...state.i18n,
          languages: [...state.i18n.languages, action.payload]
        }
      };
    
    case 'UPDATE_I18N_LANGUAGE':
      return {
        ...state,
        i18n: {
          ...state.i18n,
          languages: state.i18n.languages.map(lang => 
            lang.code === action.payload.code ? { ...lang, ...action.payload.updates } : lang
          )
        }
      };
    
    case 'DELETE_I18N_LANGUAGE':
      return {
        ...state,
        i18n: {
          ...state.i18n,
          languages: state.i18n.languages.filter(lang => lang.code !== action.payload)
        }
      };
    
    case 'ADD_I18N_BUNDLE':
      return {
        ...state,
        i18n: {
          ...state.i18n,
          bundles: [...state.i18n.bundles, action.payload]
        }
      };
    
    case 'UPDATE_I18N_BUNDLE':
      return {
        ...state,
        i18n: {
          ...state.i18n,
          bundles: state.i18n.bundles.map(bundle => 
            bundle.id === action.payload.id ? { ...bundle, ...action.payload.updates } : bundle
          )
        }
      };
    
    case 'DELETE_I18N_BUNDLE':
      return {
        ...state,
        i18n: {
          ...state.i18n,
          bundles: state.i18n.bundles.filter(bundle => bundle.id !== action.payload)
        }
      };
    
    // Data sources
    case 'ADD_DATA_SOURCE':
      return {
        ...state,
        dataSources: {
          ...state.dataSources,
          sources: [...state.dataSources.sources, action.payload]
        }
      };
    
    case 'UPDATE_DATA_SOURCE':
      return {
        ...state,
        dataSources: {
          ...state.dataSources,
          sources: state.dataSources.sources.map(source => 
            source.id === action.payload.id ? { ...source, ...action.payload.updates } : source
          )
        }
      };
    
    case 'DELETE_DATA_SOURCE':
      return {
        ...state,
        dataSources: {
          ...state.dataSources,
          sources: state.dataSources.sources.filter(source => source.id !== action.payload)
        }
      };
    
    case 'ADD_DATA_SOURCE_TYPE':
      return {
        ...state,
        dataSources: {
          ...state.dataSources,
          types: [...state.dataSources.types, action.payload]
        }
      };
    
    case 'UPDATE_DATA_SOURCE_TYPE':
      return {
        ...state,
        dataSources: {
          ...state.dataSources,
          types: state.dataSources.types.map(type => 
            type.name === action.payload.name ? { ...type, ...action.payload.updates } : type
          )
        }
      };
    
    case 'DELETE_DATA_SOURCE_TYPE':
      return {
        ...state,
        dataSources: {
          ...state.dataSources,
          types: state.dataSources.types.filter(type => type.name !== action.payload)
        }
      };
    
    // Environments
    case 'ADD_ENVIRONMENT':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          environments: [...state.deployment.environments, action.payload]
        }
      };
    
    case 'UPDATE_ENVIRONMENT':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          environments: state.deployment.environments.map(env => 
            env.id === action.payload.id ? { ...env, ...action.payload.updates } : env
          )
        }
      };
    
    case 'DELETE_ENVIRONMENT':
      return {
        ...state,
        deployment: {
          ...state.deployment,
          environments: state.deployment.environments.filter(env => env.id !== action.payload)
        }
      };
    
    // Collaboration
    case 'ADD_COLLABORATOR':
      return {
        ...state,
        collaboration: {
          ...state.collaboration,
          users: [...state.collaboration.users, action.payload]
        }
      };
    
    case 'UPDATE_COLLABORATOR':
      return {
        ...state,
        collaboration: {
          ...state.collaboration,
          users: state.collaboration.users.map(user => 
            user.userId === action.payload.userId ? { ...user, ...action.payload.updates } : user
          )
        }
      };
    
    case 'REMOVE_COLLABORATOR':
      return {
        ...state,
        collaboration: {
          ...state.collaboration,
          users: state.collaboration.users.filter(user => user.userId !== action.payload)
        }
      };
    
    case 'ADD_COMMENT_THREAD':
      return {
        ...state,
        collaboration: {
          ...state.collaboration,
          comments: [...state.collaboration.comments, action.payload]
        }
      };
    
    case 'UPDATE_COMMENT_THREAD':
      return {
        ...state,
        collaboration: {
          ...state.collaboration,
          comments: state.collaboration.comments.map(thread => 
            thread.id === action.payload.id ? { ...thread, ...action.payload.updates } : thread
          )
        }
      };
    
    case 'DELETE_COMMENT_THREAD':
      return {
        ...state,
        collaboration: {
          ...state.collaboration,
          comments: state.collaboration.comments.filter(thread => thread.id !== action.payload)
        }
      };
    
    case 'START_COLLABORATION_SESSION':
      return {
        ...state,
        collaboration: {
          ...state.collaboration,
          session: {
            id: crypto.randomUUID() as UUID,
            started: Date.now(),
            active: true
          }
        }
      };
    
    case 'END_COLLABORATION_SESSION':
      return {
        ...state,
        collaboration: {
          ...state.collaboration,
          session: {
            ...state.collaboration.session,
            active: false
          }
        }
      };
    
    // AI
    case 'ENABLE_AI':
      return {
        ...state,
        ai: {
          ...state.ai,
          enabled: action.payload
        }
      };
    
    case 'ADD_AI_PROVIDER':
      return {
        ...state,
        ai: {
          ...state.ai,
          providers: [...state.ai.providers, action.payload]
        }
      };
    
    case 'UPDATE_AI_PROVIDER':
      return {
        ...state,
        ai: {
          ...state.ai,
          providers: state.ai.providers.map(provider => 
            provider.id === action.payload.id ? { ...provider, ...action.payload.updates } : provider
          )
        }
      };
    
    case 'DELETE_AI_PROVIDER':
      return {
        ...state,
        ai: {
          ...state.ai,
          providers: state.ai.providers.filter(provider => provider.id !== action.payload)
        }
      };
    
    case 'ADD_AI_INTERACTION':
      return {
        ...state,
        ai: {
          ...state.ai,
          history: [...state.ai.history, action.payload]
        }
      };
    
    case 'CLEAR_AI_HISTORY':
      return {
        ...state,
        ai: {
          ...state.ai,
          history: []
        }
      };
    
    // Canvas management
    case 'ADD_ARBOARD':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            artboards: [...state.designView.canvas.artboards, action.payload]
          }
        }
      };
    
    case 'UPDATE_ARBOARD':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            artboards: state.designView.canvas.artboards.map(artboard => 
              artboard.id === action.payload.id ? { ...artboard, ...action.payload.updates } : artboard
            )
          }
        }
      };
    
    case 'DELETE_ARBOARD':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            artboards: state.designView.canvas.artboards.filter(artboard => artboard.id !== action.payload)
          }
        }
      };
    
    case 'SET_CURRENT_ARBOARD':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            currentArtboardId: action.payload
          }
        }
      };
    
    case 'ADD_BREAKPOINT':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            breakpoints: [...state.designView.canvas.breakpoints, action.payload]
          }
        }
      };
    
    case 'UPDATE_BREAKPOINT':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            breakpoints: state.designView.canvas.breakpoints.map(bp => 
              bp.id === action.payload.id ? { ...bp, ...action.payload.updates } : bp
            )
          }
        }
      };
    
    case 'DELETE_BREAKPOINT':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            breakpoints: state.designView.canvas.breakpoints.filter(bp => bp.id !== action.payload)
          }
        }
      };
    
    case 'SET_CURRENT_BREAKPOINT':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            currentBreakpointId: action.payload
          }
        }
      };
    
    case 'UPDATE_CANVAS_BACKGROUND':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            background: { ...state.designView.canvas.background, ...action.payload }
          }
        }
      };
    
    case 'UPDATE_CANVAS_GRID':
      return {
        ...state,
        designView: {
          ...state.designView,
          canvas: {
            ...state.designView.canvas,
            grid: { ...state.designView.canvas.grid, ...action.payload }
          }
        }
      };
    
    case 'ADD_GUIDE':
      return {
        ...state,
        designView: {
          ...state.designView,
          guides: [...state.designView.guides, action.payload]
        }
      };
    
    case 'UPDATE_GUIDE':
      return {
        ...state,
        designView: {
          ...state.designView,
          guides: state.designView.guides.map(guide => 
            guide.id === action.payload.id ? { ...guide, ...action.payload.updates } : guide
          )
        }
      };
    
    case 'DELETE_GUIDE':
      return {
        ...state,
        designView: {
          ...state.designView,
          guides: state.designView.guides.filter(guide => guide.id !== action.payload)
        }
      };
    
    case 'ADD_ASSET_OVERRIDE':
      return {
        ...state,
        designView: {
          ...state.designView,
          assetOverrides: [...state.designView.assetOverrides, action.payload]
        }
      };
    
    case 'UPDATE_ASSET_OVERRIDE':
      return {
        ...state,
        designView: {
          ...state.designView,
          assetOverrides: state.designView.assetOverrides.map(override => 
            override.id === action.payload.id ? { ...override, ...action.payload.updates } : override
          )
        }
      };
    
    case 'DELETE_ASSET_OVERRIDE':
      return {
        ...state,
        designView: {
          ...state.designView,
          assetOverrides: state.designView.assetOverrides.filter(override => override.id !== action.payload)
        }
      };
    
    // UI State
    case 'ADD_UI_PANEL':
      return {
        ...state,
        ui: {
          ...state.ui,
          panels: [...state.ui.panels, action.payload]
        }
      };
    
    case 'UPDATE_UI_PANEL':
      return {
        ...state,
        ui: {
          ...state.ui,
          panels: state.ui.panels.map(panel => 
            panel.id === action.payload.id ? { ...panel, ...action.payload.updates } : panel
          )
        }
      };
    
    case 'TOGGLE_UI_PANEL':
      return {
        ...state,
        ui: {
          ...state.ui,
          panels: state.ui.panels.map(panel => 
            panel.id === action.payload 
              ? { ...panel, isVisible: !panel.isVisible } 
              : panel
          )
        }
      };
    
    case 'ADD_UI_TOOL':
      return {
        ...state,
        ui: {
          ...state.ui,
          tools: [...state.ui.tools, action.payload]
        }
      };
    
    case 'UPDATE_UI_TOOL':
      return {
        ...state,
        ui: {
          ...state.ui,
          tools: state.ui.tools.map(tool => 
            tool.id === action.payload.id ? { ...tool, ...action.payload.updates } : tool
          )
        }
      };
    
    case 'SET_ACTIVE_TOOL':
      return {
        ...state,
        ui: {
          ...state.ui,
          tools: state.ui.tools.map(tool => ({
            ...tool,
            isActive: tool.id === action.payload
          }))
        }
      };
    
    case 'ADD_UI_INSPECTOR':
      return {
        ...state,
        ui: {
          ...state.ui,
          inspectors: [...state.ui.inspectors, action.payload]
        }
      };
    
    case 'UPDATE_UI_INSPECTOR':
      return {
        ...state,
        ui: {
          ...state.ui,
          inspectors: state.ui.inspectors.map(inspector => 
            inspector.id === action.payload.id ? { ...inspector, ...action.payload.updates } : inspector
          )
        }
      };
    
    case 'TOGGLE_UI_INSPECTOR':
      return {
        ...state,
        ui: {
          ...state.ui,
          inspectors: state.ui.inspectors.map(inspector => 
            inspector.id === action.payload 
              ? { ...inspector, isVisible: !inspector.isVisible } 
              : inspector
          )
        }
      };
    
    case 'SHOW_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: [...state.ui.modals, action.payload]
        }
      };
    
    case 'HIDE_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: state.ui.modals.filter(modal => modal.id !== action.payload)
        }
      };
    
    case 'SHOW_TOAST':
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: [...state.ui.toasts, action.payload]
        }
      };
    
    case 'HIDE_TOAST':
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: state.ui.toasts.filter(toast => toast.id !== action.payload)
        }
      };
    
    case 'UPDATE_UI_PREFERENCES':
      return {
        ...state,
        ui: {
          ...state.ui,
          preferences: { ...state.ui.preferences, ...action.payload }
        }
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

  useEffect(() => {
    if (initialEditor) {
      dispatch({ type: 'LOAD_EDITOR', payload: initialEditor });
    }
  }, [initialEditor]);

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

// Expanded helper hooks

// Design View
export function useDesignView() {
  const { state, dispatch } = useEditor();
  
  return {
    canvas: state.designView.canvas,
    elements: state.designView.elements,
    selectedElements: state.designView.selectedElements,
    interactionState: state.designView.interactionState,
    viewport: state.designView.viewport,
    guides: state.designView.guides,
    assetOverrides: state.designView.assetOverrides,
    
    // Element actions
    addElement: (element: DesignElement) => dispatch({ type: 'ADD_ELEMENT', payload: element }),
    updateElement: (id: UUID, updates: Partial<DesignElement>) => 
      dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } }),
    deleteElement: (id: UUID) => dispatch({ type: 'DELETE_ELEMENT', payload: id }),
    selectElements: (ids: UUID[]) => dispatch({ type: 'SELECT_ELEMENTS', payload: ids }),
    
    // Canvas actions
    addArtboard: (artboard: Artboard) => dispatch({ type: 'ADD_ARBOARD', payload: artboard }),
    updateArtboard: (id: UUID, updates: Partial<Artboard>) => 
      dispatch({ type: 'UPDATE_ARBOARD', payload: { id, updates } }),
    deleteArtboard: (id: UUID) => dispatch({ type: 'DELETE_ARBOARD', payload: id }),
    setCurrentArtboard: (id: UUID) => dispatch({ type: 'SET_CURRENT_ARBOARD', payload: id }),
    
    addBreakpoint: (breakpoint: Breakpoint) => dispatch({ type: 'ADD_BREAKPOINT', payload: breakpoint }),
    updateBreakpoint: (id: UUID, updates: Partial<Breakpoint>) => 
      dispatch({ type: 'UPDATE_BREAKPOINT', payload: { id, updates } }),
    deleteBreakpoint: (id: UUID) => dispatch({ type: 'DELETE_BREAKPOINT', payload: id }),
    setCurrentBreakpoint: (id: UUID) => dispatch({ type: 'SET_CURRENT_BREAKPOINT', payload: id }),
    
    updateCanvasBackground: (updates: Partial<CanvasBackground>) => 
      dispatch({ type: 'UPDATE_CANVAS_BACKGROUND', payload: updates }),
    updateCanvasGrid: (updates: Partial<GridSettings>) => 
      dispatch({ type: 'UPDATE_CANVAS_GRID', payload: updates }),
    
    // Guides
    addGuide: (guide: Guide) => dispatch({ type: 'ADD_GUIDE', payload: guide }),
    updateGuide: (id: UUID, updates: Partial<Guide>) => 
      dispatch({ type: 'UPDATE_GUIDE', payload: { id, updates } }),
    deleteGuide: (id: UUID) => dispatch({ type: 'DELETE_GUIDE', payload: id }),
    
    // Asset overrides
    addAssetOverride: (override: AssetOverride) => 
      dispatch({ type: 'ADD_ASSET_OVERRIDE', payload: override }),
    updateAssetOverride: (id: UUID, updates: Partial<AssetOverride>) => 
      dispatch({ type: 'UPDATE_ASSET_OVERRIDE', payload: { id, updates } }),
    deleteAssetOverride: (id: UUID) => 
      dispatch({ type: 'DELETE_ASSET_OVERRIDE', payload: id }),
    
    // Interaction
    updateInteractionState: (updates: Partial<InteractionState>) => 
      dispatch({ type: 'UPDATE_INTERACTION_STATE', payload: updates }),
    
    // Viewport
    updateViewport: (updates: Partial<ViewportState>) => 
      dispatch({ type: 'UPDATE_VIEWPORT', payload: updates }),
    
    // General
    updateDesignView: (updates: Partial<DesignViewState>) => 
      dispatch({ type: 'UPDATE_DESIGN_VIEW', payload: updates })
  };
}

// Flow View
export function useFlowView() {
  const { state, dispatch } = useEditor();
  
  return {
    nodes: state.flowView.nodes,
    connections: state.flowView.connections,
    variables: state.flowView.variables,
    selected: state.flowView.selected,
    viewport: state.flowView.viewport,
    settings: state.flowView.settings,
    
    // Node actions
    addNode: (node: FlowNode) => dispatch({ type: 'ADD_NODE', payload: node }),
    updateNode: (id: UUID, updates: Partial<FlowNode>) => 
      dispatch({ type: 'UPDATE_NODE', payload: { id, updates } }),
    deleteNode: (id: UUID) => dispatch({ type: 'DELETE_NODE', payload: id }),
    
    // Connection actions
    addConnection: (connection: FlowConnection) => 
      dispatch({ type: 'ADD_CONNECTION', payload: connection }),
    updateConnection: (id: UUID, updates: Partial<FlowConnection>) => 
      dispatch({ type: 'UPDATE_CONNECTION', payload: { id, updates } }),
    deleteConnection: (id: UUID) => dispatch({ type: 'DELETE_CONNECTION', payload: id }),
    
    // Selection
    selectNodes: (ids: UUID[]) => dispatch({ type: 'SELECT_NODES', payload: ids }),
    selectConnections: (ids: UUID[]) => dispatch({ type: 'SELECT_CONNECTIONS', payload: ids }),
    
    // General
    updateFlowView: (updates: Partial<FlowViewState>) => 
      dispatch({ type: 'UPDATE_FLOW_VIEW', payload: updates })
  };
}

// Components
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
    deleteComponent: (id: UUID) => dispatch({ type: 'DELETE_COMPONENT', payload: id }),
    
    addComponentCategory: (category: ComponentCategory) => 
      dispatch({ type: 'ADD_COMPONENT_CATEGORY', payload: category }),
    updateComponentCategory: (id: UUID, updates: Partial<ComponentCategory>) => 
      dispatch({ type: 'UPDATE_COMPONENT_CATEGORY', payload: { id, updates } }),
    deleteComponentCategory: (id: UUID) => 
      dispatch({ type: 'DELETE_COMPONENT_CATEGORY', payload: id })
  };
}

// Design Systems
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

// Variables
export function useVariables() {
  const { state, dispatch } = useEditor();
  
  return {
    variables: state.variables.variables,
    scopes: state.variables.scopes,
    types: state.variables.types,
    
    addVariable: (variable: Variable) => dispatch({ type: 'ADD_VARIABLE', payload: variable }),
    updateVariable: (id: UUID, updates: Partial<Variable>) => 
      dispatch({ type: 'UPDATE_VARIABLE', payload: { id, updates } }),
    deleteVariable: (id: UUID) => dispatch({ type: 'DELETE_VARIABLE', payload: id }),
    
    addVariableScope: (scope: VariableScope) => 
      dispatch({ type: 'ADD_VARIABLE_SCOPE', payload: scope }),
    updateVariableScope: (id: UUID, updates: Partial<VariableScope>) => 
      dispatch({ type: 'UPDATE_VARIABLE_SCOPE', payload: { id, updates } }),
    deleteVariableScope: (id: UUID) => 
      dispatch({ type: 'DELETE_VARIABLE_SCOPE', payload: id })
  };
}

// Assets
export function useAssets() {
  const { state, dispatch } = useEditor();
  
  return {
    assets: state.assets.assets,
    categories: state.assets.categories,
    tags: state.assets.tags,
    
    addAsset: (asset: Asset) => dispatch({ type: 'ADD_ASSET', payload: asset }),
    updateAsset: (id: AssetID, updates: Partial<Asset>) => 
      dispatch({ type: 'UPDATE_ASSET', payload: { id, updates } }),
    deleteAsset: (id: AssetID) => dispatch({ type: 'DELETE_ASSET', payload: id }),
    
    addAssetCategory: (category: AssetCategory) => 
      dispatch({ type: 'ADD_ASSET_CATEGORY', payload: category }),
    updateAssetCategory: (id: UUID, updates: Partial<AssetCategory>) => 
      dispatch({ type: 'UPDATE_ASSET_CATEGORY', payload: { id, updates } }),
    deleteAssetCategory: (id: UUID) => 
      dispatch({ type: 'DELETE_ASSET_CATEGORY', payload: id })
  };
}

// Plugins
export function usePlugins() {
  const { state, dispatch } = useEditor();
  
  return {
    plugins: state.plugins.plugins,
    enabled: state.plugins.enabled,
    
    addPlugin: (plugin: Plugin) => dispatch({ type: 'ADD_PLUGIN', payload: plugin }),
    updatePlugin: (id: UUID, updates: Partial<Plugin>) => 
      dispatch({ type: 'UPDATE_PLUGIN', payload: { id, updates } }),
    deletePlugin: (id: UUID) => dispatch({ type: 'DELETE_PLUGIN', payload: id }),
    enablePlugin: (id: UUID) => dispatch({ type: 'ENABLE_PLUGIN', payload: id }),
    disablePlugin: (id: UUID) => dispatch({ type: 'DISABLE_PLUGIN', payload: id }),
    
    addPluginPanel: (panel: PluginPanel) => 
      dispatch({ type: 'ADD_PLUGIN_PANEL', payload: panel }),
    updatePluginPanel: (id: UUID, updates: Partial<PluginPanel>) => 
      dispatch({ type: 'UPDATE_PLUGIN_PANEL', payload: { id, updates } }),
    deletePluginPanel: (id: UUID) => 
      dispatch({ type: 'DELETE_PLUGIN_PANEL', payload: id })
  };
}

// Settings
export function useSettings() {
  const { state, dispatch } = useEditor();
  
  return {
    settings: state.settings,
    
    updateSettings: (updates: Partial<EditorSettings>) => 
      dispatch({ type: 'UPDATE_SETTINGS', payload: updates }),
    
    addKeyboardShortcut: (shortcut: KeyboardShortcut) => 
      dispatch({ type: 'ADD_KEYBOARD_SHORTCUT', payload: shortcut }),
    updateKeyboardShortcut: (action: string, updates: Partial<KeyboardShortcut>) => 
      dispatch({ type: 'UPDATE_KEYBOARD_SHORTCUT', payload: { action, updates } }),
    deleteKeyboardShortcut: (action: string) => 
      dispatch({ type: 'DELETE_KEYBOARD_SHORTCUT', payload: action })
  };
}

// History
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

// Deployment
export function useDeployment() {
  const { state, dispatch } = useEditor();
  
  return {
    environments: state.deployment.environments,
    history: state.deployment.history,
    artifacts: state.deployment.artifacts,
    
    addEnvironment: (env: DeploymentEnvironment) => 
      dispatch({ type: 'ADD_DEPLOYMENT_ENVIRONMENT', payload: env }),
    updateEnvironment: (id: UUID, updates: Partial<DeploymentEnvironment>) => 
      dispatch({ type: 'UPDATE_DEPLOYMENT_ENVIRONMENT', payload: { id, updates } }),
    deleteEnvironment: (id: UUID) => 
      dispatch({ type: 'DELETE_DEPLOYMENT_ENVIRONMENT', payload: id }),
    
    addDeploymentRecord: (record: DeploymentRecord) => 
      dispatch({ type: 'ADD_DEPLOYMENT_RECORD', payload: record }),
    updateDeploymentRecord: (id: UUID, updates: Partial<DeploymentRecord>) => 
      dispatch({ type: 'UPDATE_DEPLOYMENT_RECORD', payload: { id, updates } }),
    deleteDeploymentRecord: (id: UUID) => 
      dispatch({ type: 'DELETE_DEPLOYMENT_RECORD', payload: id }),
    
    addArtifact: (artifact: DeploymentArtifact) => 
      dispatch({ type: 'ADD_DEPLOYMENT_ARTIFACT', payload: artifact }),
    deleteArtifact: (id: UUID) => 
      dispatch({ type: 'DELETE_DEPLOYMENT_ARTIFACT', payload: id })
  };
}

// Content
export function useContent() {
  const { state, dispatch } = useEditor();
  
  return {
    models: state.content.models,
    entries: state.content.entries,
    
    addModel: (model: ContentModel) => 
      dispatch({ type: 'ADD_CONTENT_MODEL', payload: model }),
    updateModel: (id: UUID, updates: Partial<ContentModel>) => 
      dispatch({ type: 'UPDATE_CONTENT_MODEL', payload: { id, updates } }),
    deleteModel: (id: UUID) => 
      dispatch({ type: 'DELETE_CONTENT_MODEL', payload: id }),
    
    addEntry: (entry: ContentEntry) => 
      dispatch({ type: 'ADD_CONTENT_ENTRY', payload: entry }),
    updateEntry: (id: UUID, updates: Partial<ContentEntry>) => 
      dispatch({ type: 'UPDATE_CONTENT_ENTRY', payload: { id, updates } }),
    deleteEntry: (id: UUID) => 
      dispatch({ type: 'DELETE_CONTENT_ENTRY', payload: id })
  };
}

// Internationalization (i18n)
export function useI18n() {
  const { state, dispatch } = useEditor();
  
  return {
    languages: state.i18n.languages,
    bundles: state.i18n.bundles,
    
    addLanguage: (language: I18nLanguage) => 
      dispatch({ type: 'ADD_I18N_LANGUAGE', payload: language }),
    updateLanguage: (code: string, updates: Partial<I18nLanguage>) => 
      dispatch({ type: 'UPDATE_I18N_LANGUAGE', payload: { code, updates } }),
    deleteLanguage: (code: string) => 
      dispatch({ type: 'DELETE_I18N_LANGUAGE', payload: code }),
    
    addBundle: (bundle: I18nBundle) => 
      dispatch({ type: 'ADD_I18N_BUNDLE', payload: bundle }),
    updateBundle: (id: UUID, updates: Partial<I18nBundle>) => 
      dispatch({ type: 'UPDATE_I18N_BUNDLE', payload: { id, updates } }),
    deleteBundle: (id: UUID) => 
      dispatch({ type: 'DELETE_I18N_BUNDLE', payload: id })
  };
}

// Data Sources
export function useDataSources() {
  const { state, dispatch } = useEditor();
  
  return {
    sources: state.dataSources.sources,
    types: state.dataSources.types,
    
    addDataSource: (source: DataSource) => 
      dispatch({ type: 'ADD_DATA_SOURCE', payload: source }),
    updateDataSource: (id: UUID, updates: Partial<DataSource>) => 
      dispatch({ type: 'UPDATE_DATA_SOURCE', payload: { id, updates } }),
    deleteDataSource: (id: UUID) => 
      dispatch({ type: 'DELETE_DATA_SOURCE', payload: id }),
    
    addDataSourceType: (type: DataSourceType) => 
      dispatch({ type: 'ADD_DATA_SOURCE_TYPE', payload: type }),
    updateDataSourceType: (name: string, updates: Partial<DataSourceType>) => 
      dispatch({ type: 'UPDATE_DATA_SOURCE_TYPE', payload: { name, updates } }),
    deleteDataSourceType: (name: string) => 
      dispatch({ type: 'DELETE_DATA_SOURCE_TYPE', payload: name })
  };
}

// Environments
export function useEnvironments() {
  const { state, dispatch } = useEditor();
  
  return {
    environments: state.deployment.environments,
    
    addEnvironment: (env: EditorEnvironment) => 
      dispatch({ type: 'ADD_ENVIRONMENT', payload: env }),
    updateEnvironment: (id: UUID, updates: Partial<EditorEnvironment>) => 
      dispatch({ type: 'UPDATE_ENVIRONMENT', payload: { id, updates } }),
    deleteEnvironment: (id: UUID) => 
      dispatch({ type: 'DELETE_ENVIRONMENT', payload: id })
  };
}

// Collaboration
export function useCollaboration() {
  const { state, dispatch } = useEditor();
  
  return {
    users: state.collaboration.users,
    session: state.collaboration.session,
    comments: state.collaboration.comments,
    changes: state.collaboration.changes,
    
    addCollaborator: (collaborator: Collaborator) => 
      dispatch({ type: 'ADD_COLLABORATOR', payload: collaborator }),
    updateCollaborator: (userId: UUID, updates: Partial<Collaborator>) => 
      dispatch({ type: 'UPDATE_COLLABORATOR', payload: { userId, updates } }),
    removeCollaborator: (userId: UUID) => 
      dispatch({ type: 'REMOVE_COLLABORATOR', payload: userId }),
    
    addCommentThread: (thread: CommentThread) => 
      dispatch({ type: 'ADD_COMMENT_THREAD', payload: thread }),
    updateCommentThread: (id: UUID, updates: Partial<CommentThread>) => 
      dispatch({ type: 'UPDATE_COMMENT_THREAD', payload: { id, updates } }),
    deleteCommentThread: (id: UUID) => 
      dispatch({ type: 'DELETE_COMMENT_THREAD', payload: id }),
    
    startSession: () => dispatch({ type: 'START_COLLABORATION_SESSION' }),
    endSession: () => dispatch({ type: 'END_COLLABORATION_SESSION' })
  };
}

// AI
export function useAI() {
  const { state, dispatch } = useEditor();
  
  return {
    enabled: state.ai.enabled,
    providers: state.ai.providers,
    history: state.ai.history,
    
    enableAI: (enabled: boolean) => 
      dispatch({ type: 'ENABLE_AI', payload: enabled }),
    
    addProvider: (provider: AIProvider) => 
      dispatch({ type: 'ADD_AI_PROVIDER', payload: provider }),
    updateProvider: (id: UUID, updates: Partial<AIProvider>) => 
      dispatch({ type: 'UPDATE_AI_PROVIDER', payload: { id, updates } }),
    deleteProvider: (id: UUID) => 
      dispatch({ type: 'DELETE_AI_PROVIDER', payload: id }),
    
    addInteraction: (interaction: AIInteraction) => 
      dispatch({ type: 'ADD_AI_INTERACTION', payload: interaction }),
    clearHistory: () => dispatch({ type: 'CLEAR_AI_HISTORY' })
  };
}

// UI State
export function useUI() {
  const { state, dispatch } = useEditor();
  
  return {
    panels: state.ui.panels,
    tools: state.ui.tools,
    inspectors: state.ui.inspectors,
    modals: state.ui.modals,
    toasts: state.ui.toasts,
    preferences: state.ui.preferences,
    
    addPanel: (panel: UIPanel) => 
      dispatch({ type: 'ADD_UI_PANEL', payload: panel }),
    updatePanel: (id: string, updates: Partial<UIPanel>) => 
      dispatch({ type: 'UPDATE_UI_PANEL', payload: { id, updates } }),
    togglePanel: (id: string) => 
      dispatch({ type: 'TOGGLE_UI_PANEL', payload: id }),
    
    addTool: (tool: UITool) => 
      dispatch({ type: 'ADD_UI_TOOL', payload: tool }),
    updateTool: (id: string, updates: Partial<UITool>) => 
      dispatch({ type: 'UPDATE_UI_TOOL', payload: { id, updates } }),
    setActiveTool: (id: string | null) => 
      dispatch({ type: 'SET_ACTIVE_TOOL', payload: id }),
    
    addInspector: (inspector: UIInspector) => 
      dispatch({ type: 'ADD_UI_INSPECTOR', payload: inspector }),
    updateInspector: (id: string, updates: Partial<UIInspector>) => 
      dispatch({ type: 'UPDATE_UI_INSPECTOR', payload: { id, updates } }),
    toggleInspector: (id: string) => 
      dispatch({ type: 'TOGGLE_UI_INSPECTOR', payload: id }),
    
    showModal: (modal: UIModal) => 
      dispatch({ type: 'SHOW_MODAL', payload: modal }),
    hideModal: (id: string) => 
      dispatch({ type: 'HIDE_MODAL', payload: id }),
    
    showToast: (toast: UIToast) => 
      dispatch({ type: 'SHOW_TOAST', payload: toast }),
    hideToast: (id: string) => 
      dispatch({ type: 'HIDE_TOAST', payload: id }),
    
    updatePreferences: (updates: Partial<UIPreferences>) => 
      dispatch({ type: 'UPDATE_UI_PREFERENCES', payload: updates })
  };
}

// Current Editor and User
export function useCurrentEditor() {
  const { currentEditor } = useEditor();
  return currentEditor;
}

export function useCurrentUser() {
  const { currentUser } = useEditor();
  return currentUser;
}

// View management
export function useViews() {
  const { state, dispatch } = useEditor();
  
  return {
    currentView: state.currentView,
    setCurrentView: (view: 'design' | 'flow' | 'both') => 
      dispatch({ type: 'SET_CURRENT_VIEW', payload: view })
  };
}