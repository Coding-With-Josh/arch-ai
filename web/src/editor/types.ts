import { Node } from "@xyflow/react";

/***********************
 * CORE PRIMITIVES
 ***********************/
type UUID = string;
type Timestamp = number;
type HexColor = `#${string}`;
type URLString = `http://${string}` | `https://${string}`;
type AssetID = `asset_${UUID}`;
type walletAddresses = `0x${string}`;
type IPFSCid = `Qm${string}` | `bafy${string}`;
type ChainId = string | number;
type NetworkName = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'solana' | string;

type JSX = {
  IntrinsicElements: {
    [key: string]: any;
  };
};

type ContractMethod = {
  name: string;
  inputs: ContractParam[];
  outputs: ContractParam[];
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
};

type ContractEvent = {
  name: string;
  inputs: ContractParam[];
  anonymous: boolean;
};

type ContractParam = {
  name: string;
  type: string;
  indexed?: boolean;
};

type Expression = {
  type: 'expression';
  language: 'javascript' | 'rust' | 'jsonata';
  code: string;
  dependencies: string[];
};


type Position = {
  x: number;
  y: number;
  z?: number;
};

type Dimensions = {
  width: number;
  height: number;
  depth?: number;
};

type Rect = {
  position: Position;
  dimensions: Dimensions;
};

/***********************
 * AUTH & COLLABORATION
 ***********************/
type User = {
  id: UUID;
  auth: {
    email: string;
    walletAddresses: walletAddresses[];
    oauthProviders: {
      google?: string;
      github?: string;
      discord?: string;
    };
  };
  profile: {
    username: string;
    avatar: AssetID;
    bio?: string;
  };
  preferences: UserPreferences;
  permissions: UserPermissions;
  activity: UserActivity[];
  createdAt: Timestamp;
  lastActive: Timestamp;
};

type UserPreferences = {
  ui: {
    theme: 'light' | 'dark' | 'system' | 'oled';
    density: 'compact' | 'normal' | 'spacious';
    canvasTheme: 'light' | 'dark' | 'transparent' | 'custom';
    customTheme?: {
      colors: Record<string, HexColor>;
      css?: string;
    };
  };
  editor: {
    defaultView: 'design' | 'flow' | 'split';
    autoSave: boolean;
    autoSaveInterval: number;
    nudgeAmount: number;
    snapToGrid: boolean;
    showRulers: boolean;
  };
  shortcuts: KeyboardShortcut[];
};

type UserPermissions = {
  roles: ('admin' | 'editor' | 'viewer' | 'developer')[];
  projects: {
    id: UUID;
    role: 'owner' | 'collaborator' | 'viewer';
    permissions: ('edit' | 'deploy' | 'share' | 'export')[];
  }[];
};

type UserActivity = {
  timestamp: Timestamp;
  type: 'login' | 'project_open' | 'element_create' | 'deployment';
  projectId?: UUID;
  details?: Record<string, any>;
};

/***********************
 * EDITOR STRUCTURE
 ***********************/
type Editor = {
  id: UUID;
  meta: {
    name: string;
    slug: string;
    description: string;
    icon: AssetID;
    tags: string[];
    isTemplate: boolean;
    templateId?: UUID;
  };
  state: EditorState;
  versions: EditorVersion[];
  collaborators: EditorCollaborator[];
  settings: EditorSettings;
  environments: EditorEnvironment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type EditorVersion = {
  id: UUID;
  name: string;
  description?: string;
  snapshot: EditorSnapshot;
  createdBy: UUID;
  createdAt: Timestamp;
  parentVersionId?: UUID;
};

type EditorSnapshot = {
  design: DesignViewState;
  flow: FlowViewState;
  data: EditorData;
};

type EditorData = {
  variables: Variable[];
  dataSources: DataSource[];
  content: ContentEntry[];
  i18n: I18nBundle[];
  apiEndpoints: ApiEndpoint[];
};

type EditorCollaborator = {
  userId: UUID;
  role: 'admin' | 'editor' | 'developer' | 'viewer';
  joinedAt: Timestamp;
  lastActive?: Timestamp;
  permissions: string[];
};

type EditorEnvironment = {
  id: UUID;
  name: string;
  type: 'development' | 'staging' | 'production';
  config: {
    apiBaseUrl: string;
    chainId: number;
    contractAddresses: Record<string, string>;
  };
};

/***********************
 * DESIGN VIEW - CANVAS
 ***********************/
type DesignViewState = {
  canvas: CanvasState;
  elements: DesignElement[];
  selectedElements: UUID[];
  hoveredElement?: UUID;
  interactionState: InteractionState;
  viewport: ViewportState;
  guides: Guide[];
  assetOverrides: AssetOverride[];
};

type CanvasState = {
  type: '2d' | '3d';
  dimensions: Dimensions;
  background: CanvasBackground;
  grid: GridSettings;
  breakpoints: Breakpoint[];
  currentBreakpointId: UUID;
  artboards: Artboard[];
  currentArtboardId: UUID;
};

type CanvasBackground = {
  type: 'color' | 'image' | 'gradient' | 'pattern';
  color?: HexColor;
  image?: AssetID;
  gradient?: CanvasGradient;
  pattern?: CanvasPattern;
  opacity: number;
  blendMode: BlendMode;
};

type BlendMode =
  | 'normal' | 'multiply' | 'screen' | 'overlay'
  | 'darken' | 'lighten' | 'color-dodge' | 'color-burn'
  | 'hard-light' | 'soft-light' | 'difference' | 'exclusion'
  | 'hue' | 'saturation' | 'color' | 'luminosity';

type CanvasGradient = {
  type: 'linear' | 'radial' | 'conic';
  stops: GradientStop[];
  rotation?: number;
  position?: Position;
};

type GradientStop = {
  position: number;
  color: HexColor;
  opacity?: number;
};

type CanvasPattern = {
  assetId: AssetID;
  repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
  scale: number;
  position: Position;
};

type GridSettings = {
  enabled: boolean;
  size: number;
  subdivisions: number;
  color: HexColor;
  opacity: number;
  snapping: {
    enabled: boolean;
    strength: number;
  };
};

type Breakpoint = {
  id: UUID;
  name: string;
  minWidth: number;
  maxWidth?: number;
  baseFontSize: number;
  mediaQuery?: string;
  icon: AssetID;
};

type Artboard = {
  id: UUID;
  name: string;
  position: Position;
  dimensions: Dimensions;
  background: CanvasBackground;
  isRoot: boolean;
  meta?: {
    device?: string;
    orientation?: 'portrait' | 'landscape';
  };
};

/***********************
 * REACT-BASED ELEMENT SYSTEM
 ***********************/
type ReactStyle = React.CSSProperties & {
  hover?: React.CSSProperties;
  active?: React.CSSProperties;
  focus?: React.CSSProperties;
  variants?: Record<string, React.CSSProperties>;
};

type ElementEventHandlers = {
  onClick?: ElementAction;
  onHover?: ElementAction;
  onFocus?: ElementAction;
  onBlur?: ElementAction;
  onChange?: ElementAction;
  onDrag?: ElementAction;
  onDrop?: ElementAction;
  customEvents?: Record<string, ElementAction>;
};

type ElementAction = 
  | { type: 'navigate', target: string }
  | { type: 'callContract', contractId: string, method: string, args: any[] }
  | { type: 'setVariable', variableId: string, value: any }
  | { type: 'triggerFlow', flowId: string, payload?: any }
  | { type: 'openUrl', url: string, target?: '_blank' | '_self' }
  | { type: 'custom', handler: string }
  | { type: 'emitEvent', eventName: string, payload?: any };

type ComponentProps = {
  [key: string]: any;
  style?: ReactStyle;
  className?: string;
  children?: any;
} & ElementEventHandlers;

type DesignElement = {
  id: UUID;
  componentType: string;
  position: { x: number; y: number };  // Make optional if needed
  dimensions?: { width: number; height: number };  // Make optional if needed
  props: ComponentProps;
  children?: DesignElement[];
  layout?: {
    position: 'relative' | 'absolute' | 'fixed' | 'sticky';
    constraints: LayoutConstraints;
    gridArea?: string;
  };
  dataBindings?: {
    [propName: string]: DataBinding;
  };
  eventBindings?: {
    [eventName: string]: EventBinding;
  };
  meta: ElementMetadata & {
    componentSource?: 'core' | 'custom' | 'plugin';
    importPath?: string;
  };
};

type DataBinding = {
  sourceType: 'variable' | 'contractState' | 'content' | 'api';
  sourceId: UUID;
  transform?: {
    type: 'map' | 'filter' | 'reduce';
    function: string;
  };
};

type EventBinding = {
  handlerType: 'flow' | 'contract' | 'variable';
  handlerId: UUID;
  transform?: {
    inputMapping: Record<string, string>;
  };
};

type CoreComponentTypes = {
  Box: {
    props: ComponentProps & {
      as?: keyof JSX["IntrinsicElements"];
    };
  };
  Flex: {
    props: ComponentProps & {
      direction?: 'row' | 'column';
      align?: string;
      justify?: string;
      wrap?: boolean;
    };
  };
  Grid: {
    props: ComponentProps & {
      columns?: number | string;
      rows?: number | string;
      gap?: number | string;
    };
  };
  Text: {
    props: ComponentProps & {
      content?: string;
      variant?: string;
      truncate?: boolean;
    };
  };
  Button: {
    props: ComponentProps & {
      variant?: 'primary' | 'secondary' | 'ghost';
      size?: 'sm' | 'md' | 'lg';
      loading?: boolean;
      disabled?: boolean;
    };
  };
  Input: {
    props: ComponentProps & {
      type?: string;
      placeholder?: string;
      value?: string;
    };
  };
  WalletConnect: {
    props: ComponentProps & {
      chainId?: number;
      variant?: 'button' | 'dropdown';
    };
  };
  ContractInteraction: {
    props: ComponentProps & {
      contractId: UUID;
      method: string;
      args?: any[];
      buttonText?: string;
    };
  };
  NFTDisplay: {
    props: ComponentProps & {
      contractId: UUID;
      tokenId: string | number;
      variant?: 'card' | 'full';
    };
  };
  DataTable: {
    props: ComponentProps & {
      dataSource: UUID;
      columns: Array<{
        field: string;
        header: string;
        render?: string;
      }>;
    };
  };
  Image: {
    props: ComponentProps & {
      src: string | AssetID;
      alt?: string;
      objectFit?: 'cover' | 'contain';
    };
  };
};

type SmartContractElement = {
  id: UUID;
  type: 'contract';
  contractType: 'ethereum' | 'solana' | 'sui';
  address: walletAddresses;
  abi: any;
  methods: ContractMethod[];
  events: ContractEvent[];
  reactComponent: {
    name: string;
    props: {
      contractId: UUID;
      networkId?: number;
      readOnly?: boolean;
      style?: ReactStyle;
    };
  };
  uiHooks: {
    useContractRead: {
      method: string;
      args?: any[];
      watch?: boolean;
    };
    useContractWrite: {
      method: string;
      buttonText?: string;
      successMessage?: string;
    };
  };
};

type FlowNodeBinding = {
  elementId: UUID;
  nodeId: UUID;
  inputMappings: Record<string, string>;
  outputMappings: Record<string, string>;
  triggerEvents: string[];
};

/***********************
 * FLOW VIEW
 ***********************/
type FlowViewState = {
  nodes: FlowNode[];
  connections: FlowConnection[];
  variables: FlowVariable[];
  selected: {
    nodeIds: UUID[];
    connectionIds: UUID[];
  };
  viewport: {
    zoom: number;
    offset: Position;
  };
  settings: {
    snapToGrid: boolean;
    gridSize: number;
  };
  elementBindings: FlowNodeBinding[];
};


export interface NodeParam {
  name: string;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  [key: string]: any;
}

export interface ParamProps {
  param: NodeParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
}

type FlowNode =
  | (ContractNode & { data?: FlowNodeData })
  | (FunctionNode & { data?: FlowNodeData })
  | (EventNode & { data?: FlowNodeData })
  | (VariableNode & { data?: FlowNodeData })
  | (ApiNode & { data?: FlowNodeData })
  | (DataNode & { data?: FlowNodeData })
  | (LogicNode & { data?: FlowNodeData })
  | (UiNode & { data?: FlowNodeData });

  type FlowNodeData = {
    [key: string]: any;
    // type: TaskType;
    inputs: Record<string, string>;

  }


type BaseFlowNode = Node & {
  id: UUID;
  type: string;
  position: Position;
  dimensions: Dimensions;
  title: string;
  description?: string;
  style: FlowNodeStyle;
  ports: FlowPort[];
  metadata: FlowNodeMetadata;
};


type ContractNode = BaseFlowNode & {
  type: 'contract';
  contractAddress: walletAddresses;
  network: string;
  abi: any;
  methods: ContractMethodReference[];
  events: ContractEventReference[];
};

type ContractMethodReference = {
  name: string;
  nodeId: UUID;
};

type ContractEventReference = {
  name: string;
  nodeId: UUID;
};

type FunctionNode = BaseFlowNode & {
  type: 'function';
  language: 'javascript' | 'typescript' | 'rust';
  code: string;
  inputs: FlowParam[];
  outputs: FlowParam[];
};

type EventNode = BaseFlowNode & {
  type: 'event';
  eventName: string;
  payloadSchema: any;
};

type VariableNode = BaseFlowNode & {
  type: 'variable';
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'array';
  initialValue: any;
  isConstant: boolean;
  scope: 'global' | 'local';
};

interface ApiNode extends BaseFlowNode {
  type: 'api';
  method: 'GET' | 'POST';
  chain: 'ethereum' | 'solana' | 'sui';
  
  // Chain-specific endpoints
  endpoint: {
    ethereum?: {
      rpcUrl: string;
      chainId: number;
    };
    solana?: {
      rpcUrl: string;
      commitment: 'processed' | 'confirmed' | 'finalized';
    };
    sui?: {
      rpcUrl: string;
      version: string;
    };
  };
  
  // Common fields
  headers: Record<string, string>;
  queryParams: Record<string, string>;
}

type ApiAuth = {
  type: 'none' | 'basic' | 'bearer' | 'apiKey' | 'oauth2';
  config?: any;
};

type DataNode = BaseFlowNode & {
  type: 'data';
  operation: 'read' | 'write' | 'query';
  source: 'local' | 'ipfs' | 'arweave' | 'database';
  query?: any;
};

interface LogicNode extends BaseFlowNode {
  type: 'logic';
  logicType: 'if' | 'switch' | 'loop';
  
  // Chain-specific conditions
  conditions?: (LogicCondition & {
    chain?: 'ethereum' | 'solana' | 'sui';
    chainOperator?: {
      ethereum?: 'gas' | 'nonce';
      solana?: 'slot' | 'priorityFee';
      sui?: 'version' | 'objectExists';
    };
  })[];
}

type LogicCondition = {
  left: string | Expression;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  right: string | Expression;
};

type UiNode = BaseFlowNode & {
  type: 'ui';
  uiType: 'button' | 'form' | 'input' | 'display';
  elementId?: UUID;
  events: UiEvent[];
};

type UiEvent = {
  type: string;
  action: UiAction;
};

type UiAction =
  | { type: 'navigate', target: string }
  | { type: 'triggerFlow', flowId: UUID }
  | { type: 'callContract', nodeId: UUID }
  | { type: 'setVariable', variableId: UUID, value: any }
  | { type: 'custom', code: string };

type FlowPort = {
    id: string;
    type: 'input' | 'output';
    dataType: string;
    name: string;
    defaultValue?: any;
    isArray?: boolean; // Make optional
    isOptional?: boolean; // Make optional
  }

type FlowParam = {
  name: string;
  type: string;
  defaultValue?: any;
};

interface FlowConnection {
  id: UUID;
  source: {
    nodeId: UUID;
    portId: UUID;
    chain?: 'ethereum' | 'solana' | 'sui'; // Added chain context
  };
  target: {
    nodeId: UUID;
    portId: UUID;
    chain?: 'ethereum' | 'solana' | 'sui'; // Added chain context
  };
  
  // Cross-chain bridging support
  bridge?: {
    protocol: 'wormhole' | 'layerzero' | 'native';
    bridgeFee?: number;
  };
}
type FlowConnectionStyle = {
  color: HexColor;
  width: number;
  dashArray: number[];
  animated: boolean;
};

type FlowVariable = {
  id: UUID;
  name: string;
  type: string;
  value: any;
  scope: 'flow' | 'global';
  isConstant: boolean;
  chainValue?: {
    ethereum?: {
      hexValue?: string;
      weiValue?: string;
    };
    solana?: {
      lamports?: string;
      base64Data?: string;
    };
    sui?: {
      objectId?: string;
      moveValue?: string;
    };
  };
  
  // New chain-specific fields
  chainType?: 'ethereum' | 'solana' | 'sui';
  chainFormat?: {
    ethereum?: 'hex' | 'wei';
    solana?: 'lamports' | 'base64';
    sui?: 'myst' | 'object';
  };
};

/***********************
 * COMPONENT SYSTEM
 ***********************/
type ComponentLibrary = {
  components: ComponentDefinition[];
  categories: ComponentCategory[];
  tags: string[];
};

type ComponentDefinition = {
  id: UUID;
  name: string;
  description: string;
  category: string;
  tags: string[];
  icon: AssetID;
  preview: AssetID;
  author: UUID;
  version: string;
  props: ComponentPropDefinitions;
  slots: ComponentSlot[];
  styles: ComponentStyleDefinitions;
  behaviors: ComponentBehavior[];
  examples: ComponentExample[];
  meta: ComponentMetadata;
};

type ComponentPropDefinitions = {
  [key: string]: ComponentPropDefinition;
};

type ComponentPropDefinition = {
  type: PropType;
  defaultValue?: any;
  required?: boolean;
  description?: string;
  options?: any[];
  control?: PropControl;
  validation?: PropValidation;
};

type PropType =
  | 'string' | 'number' | 'boolean'
  | 'array' | 'object' | 'function'
  | 'color' | 'date' | 'asset'
  | 'component' | 'enum';

type PropControl =
  | 'text' | 'textarea' | 'number'
  | 'checkbox' | 'select' | 'radio'
  | 'color' | 'date' | 'json'
  | 'style' | 'code' | 'range'
  | 'file' | 'component';

type PropValidation = {
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
};

type ComponentSlot = {
  name: string;
  description?: string;
  allowedComponents?: string[];
  required?: boolean;
  defaultValue?: SlotDefaultValue;
};

type SlotDefaultValue =
  | { type: 'text', content: string }
  | { type: 'component', componentId: UUID }
  | { type: 'elements', elementIds: UUID[] };

type ComponentStyleDefinitions = {
  default: ComponentStyleGroup;
  variants: ComponentVariantStyle[];
  states: ComponentStateStyle[];
};

type ComponentStyleGroup = {
  base: StyleProperties;
  responsive?: Record<string, Partial<StyleProperties>>;
};

type ComponentVariantStyle = {
  name: string;
  condition: string;
  styles: Partial<StyleProperties>;
};

type ComponentStateStyle = {
  state: 'hover' | 'active' | 'focus' | 'disabled';
  styles: Partial<StyleProperties>;
};

type ComponentBehavior = {
  name: string;
  description?: string;
  events: ComponentEventDefinition[];
  actions: ComponentActionDefinition[];
};

type ComponentEventDefinition = {
  name: string;
  description?: string;
  payloadSchema?: any;
};

type ComponentActionDefinition = {
  name: string;
  description?: string;
  parameters?: ComponentParamDefinition[];
};

type ComponentParamDefinition = {
  name: string;
  type: string;
  required?: boolean;
};

type ComponentExample = {
  name: string;
  description?: string;
  props: Record<string, any>;
  slots?: Record<string, SlotExample>;
  styles?: Partial<StyleProperties>;
};

type SlotExample = {
  type: 'text' | 'component' | 'elements';
  content: any;
};

/***********************
 * DESIGN SYSTEM
 ***********************/
type DesignSystem = {
  id: UUID;
  name: string;
  description: string;
  version: string;
  tokens: DesignTokens;
  components: DesignSystemComponents;
  themes: DesignSystemTheme[];
  meta: DesignSystemMetadata;
  reactTheme: {
    colors: Record<string, string>;
    typography: Record<string, ReactStyle>;
    components: {
      [key: string]: ReactStyle;
    };
    variants: Record<string, ReactStyle>;
  };
};

type DesignTokens = {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  sizing: SizingScale;
  shadows: ShadowScale;
  borders: BorderScale;
  opacity: OpacityScale;
  zIndex: ZIndexScale;
  animations: AnimationPresets;
};

type ColorPalette = {
  primary: ColorGroup;
  secondary: ColorGroup;
  accent: ColorGroup;
  neutral: ColorGroup;
  success: ColorGroup;
  warning: ColorGroup;
  danger: ColorGroup;
  info: ColorGroup;
  [key: string]: ColorGroup;
};

type ColorGroup = {
  base: HexColor;
  50?: HexColor;
  100?: HexColor;
  200?: HexColor;
  300?: HexColor;
  400?: HexColor;
  500?: HexColor;
  600?: HexColor;
  700?: HexColor;
  800?: HexColor;
  900?: HexColor;
};

type TypographyScale = {
  fontFamilies: Record<string, string>;
  fontWeights: Record<string, number>;
  fontSizes: Record<string, string>;
  lineHeights: Record<string, number>;
  letterSpacing: Record<string, string>;
  textStyles: Record<string, TextStyle>;
};

type TextStyle = {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: number;
  letterSpacing: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
};

type SpacingScale = {
  base: number;
  scale: 'linear' | 'exponential';
  factors: Record<string, number>;
};

type SizingScale = {
  base: number;
  scale: 'linear' | 'exponential';
  factors: Record<string, number>;
};

type ShadowScale = {
  small: ShadowPreset;
  medium: ShadowPreset;
  large: ShadowPreset;
  xlarge: ShadowPreset;
  [key: string]: ShadowPreset;
};

type ShadowPreset = {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: HexColor;
  inset?: boolean;
};

type BorderScale = {
  width: Record<string, number>;
  radius: Record<string, number>;
  style: Record<string, 'solid' | 'dashed' | 'dotted'>;
};

type OpacityScale = {
  values: Record<string, number>;
};

type ZIndexScale = {
  values: Record<string, number>;
};

type AnimationPresets = {
  durations: Record<string, string>;
  easings: Record<string, string>;
  delays: Record<string, string>;
  keyframes: Record<string, KeyframeDefinition>;
};

type KeyframeDefinition = {
  [key: string]: Record<string, any>;
};

type DesignSystemComponents = {
  buttons: ComponentStylePreset[];
  inputs: ComponentStylePreset[];
  cards: ComponentStylePreset[];
  [key: string]: ComponentStylePreset[];
};

type ComponentStylePreset = {
  name: string;
  base: StyleProperties;
  variants?: Record<string, Partial<StyleProperties>>;
  states?: Record<string, Partial<StyleProperties>>;
};

type DesignSystemTheme = {
  name: string;
  base: 'light' | 'dark';
  tokens: Partial<DesignTokens>;
};

/***********************
 * EDITOR STATE
 ***********************/
type EditorState = {
  currentView: 'design' | 'flow' | 'both';
  designView: DesignViewState;
  flowView: FlowViewState;
  componentLibrary: ComponentLibrary;
  designSystems: DesignSystem[];
  assets: AssetLibrary;
  variables: VariableRegistry;
  dataSources: DataSourceRegistry;
  content: ContentManager;
  i18n: I18nManager;
  history: HistoryStack;
  settings: EditorSettings;
  collaboration: CollaborationState;
  plugins: PluginManager;
  ai: AIManager;
  deployment: DeploymentManager;
  ui: UIState;
};

type AssetLibrary = {
  assets: Asset[];
  categories: AssetCategory[];
  tags: string[];
};

type Asset = {
  id: AssetID;
  name: string;
  type: 'image' | 'video' | 'audio' | 'font' | 'document' | '3d';
  url: string;
  previewUrl?: string;
  meta: {
    size: number;
    width?: number;
    height?: number;
    duration?: number;
    format: string;
    createdAt: Timestamp;
    createdBy: UUID;
  };
  variants?: AssetVariant[];
};

type AssetVariant = {
  size: 'original' | 'thumb' | 'small' | 'medium' | 'large';
  url: string;
  dimensions?: {
    width: number;
    height: number;
  };
};

type VariableRegistry = {
  variables: Variable[];
  scopes: VariableScope[];
  types: VariableTypeDefinition[];
};

type VariableScope = {
  id: UUID;
  name: string;
  type: 'global' | 'page' | 'component' | 'flow';
  parentId?: UUID;
};

type VariableTypeDefinition = {
  name: string;
  baseType: string;
  validation?: any;
  editor?: any;
};

type DataSourceRegistry = {
  sources: DataSource[];
  types: DataSourceType[];
};

type DataSource = {
  id: UUID;
  name: string;
  type: 'api' | 'database' | 'contract' | 'localStorage' | 'ipfs';
  config: any;
  schema?: any;
};

type ContentManager = {
  models: ContentModel[];
  entries: ContentEntry[];
};

type ContentModel = {
  id: UUID;
  name: string;
  fields: ContentField[];
};

type ContentField = {
  name: string;
  type: string;
  required: boolean;
  validation?: any;
};

type I18nManager = {
  languages: I18nLanguage[];
  bundles: I18nBundle[];
};

type I18nLanguage = {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
};

type I18nBundle = {
  id: UUID;
  language: string;
  strings: Record<string, string>;
};

type HistoryStack = {
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  current: HistoryEntry;
};

type HistoryEntry = {
  id: UUID;
  type: 'design' | 'flow' | 'both';
  timestamp: Timestamp;
  description: string;
  snapshot: EditorSnapshot;
};

type CollaborationState = {
  users: Collaborator[];
  session: {
    id: UUID;
    started: Timestamp;
    active: boolean;
  };
  comments: CommentThread[];
  changes: LiveChange[];
};

type Collaborator = {
  userId: UUID;
  presence: {
    activeView: 'design' | 'flow';
    selection: UUID[];
    cursor: Position;
  };
  permissions: string[];
};

type CommentThread = {
  id: UUID;
  target: {
    type: 'element' | 'node' | 'canvas';
    id: UUID;
  };
  position: Position;
  comments: Comment[];
  resolved: boolean;
};

type Comment = {
  id: UUID;
  author: UUID;
  content: string;
  timestamp: Timestamp;
  reactions: Reaction[];
};

type Reaction = {
  emoji: string;
  users: UUID[];
};

type LiveChange = {
  type: 'create' | 'update' | 'delete';
  target: {
    type: 'element' | 'node' | 'connection';
    id: UUID;
  };
  data: any;
  author: UUID;
  timestamp: Timestamp;
};

type PluginManager = {
  plugins: Plugin[];
  enabled: UUID[];
};

type Plugin = {
  id: UUID;
  name: string;
  description: string;
  version: string;
  author: string;
  icon: AssetID;
  entryPoint: string;
  permissions: string[];
  ui?: PluginUI;
};

type PluginUI = {
  panels: PluginPanel[];
  tools: PluginTool[];
  inspectors: PluginInspector[];
};

type PluginPanel = {
  id: UUID;
  title: string;
  icon: AssetID;
  location: 'left' | 'right' | 'bottom';
  component: string;
};

type PluginTool = {
  id: UUID;
  name: string;
  icon: string;
  component: string;
};

type PluginInspector = {
  id: UUID;
  name: string;
  component: string;
  targetTypes: string[];
};

type AIManager = {
  enabled: boolean;
  providers: AIProvider[];
  history: AIInteraction[];
};

type AIProvider = {
  id: UUID;
  type: 'openai' | 'anthropic' | 'local' | 'custom';
  name: string;
  config: any;
};

type AIInteraction = {
  id: UUID;
  prompt: string;
  response: string;
  timestamp: Timestamp;
  context: any;
};

/***********************
 * DEPLOYMENT & BUILD
 ***********************/
type DeploymentManager = {
  environments: DeploymentEnvironment[];
  history: DeploymentRecord[];
  artifacts: DeploymentArtifact[];
};

type DeploymentEnvironment = {
  id: UUID;
  name: string;
  type: 'development' | 'staging' | 'production';
  config: any;
  url?: string;
};

type DeploymentRecord = {
  id: UUID;
  environment: UUID;
  version: UUID;
  timestamp: Timestamp;
  status: 'pending' | 'success' | 'failed' | 'in-progress';
  logs: DeploymentLog[];
  artifacts: UUID[];
};

type DeploymentLog = {
  timestamp: Timestamp;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: any;
};

type DeploymentArtifact = {
  id: UUID;
  type: 'frontend' | 'backend' | 'contract' | 'assets';
  name: string;
  size: number;
  url: string;
  hash: string;
  createdAt: Timestamp;
};

/***********************
 * TEMPLATES
 ***********************/
type TemplateLibrary = {
  designTemplates: DesignTemplate[];
  flowTemplates: FlowTemplate[];
  editorTemplates: EditorTemplate[];
  categories: TemplateCategory[];
};

type DesignTemplate = {
  id: UUID;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  thumbnail: AssetID;
  preview: AssetID;
  canvas: CanvasState;
  elements: DesignElement[];
  designSystem?: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type FlowTemplate = {
  id: UUID;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  thumbnail: AssetID;
  nodes: FlowNode[];
  connections: FlowConnection[];
  variables: FlowVariable[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type EditorTemplate = {
  id: UUID;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  thumbnail: AssetID;
  design: DesignTemplate;
  flow: FlowTemplate;
  designSystem?: UUID;
  variables: Variable[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

/***********************
 * INTERACTION STATES
 ***********************/
type InteractionState = {
  mode: 'select' | 'create' | 'drag' | 'resize' | 'connect';
  tool?: string;
  status: 'idle' | 'active' | 'complete';
  data?: any;
};

type DragState = {
  type: 'element' | 'component' | 'asset';
  origin: Position;
  current: Position;
  source: {
    type: 'palette' | 'canvas';
    id?: UUID;
  };
  target?: {
    type: 'canvas' | 'element';
    id?: UUID;
  };
};

type ResizeState = {
  elementId: UUID;
  handle: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
  start: {
    position: Position;
    dimensions: Dimensions;
  };
  current: {
    position: Position;
    dimensions: Dimensions;
  };
  constraints: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: number;
  };
};

type ConnectState = {
  source: {
    type: 'port' | 'element';
    id: UUID;
    position: Position;
  };
  current: Position;
  target?: {
    type: 'port' | 'element';
    id: UUID;
    position: Position;
  };
  valid: boolean;
};

/***********************
 * VIEWPORT & RENDERING
 ***********************/
type ViewportState = {
  position: Position;
  zoom: number;
  dimensions: Dimensions;
  visibleRect: Rect;
};

type RenderSettings = {
  quality: 'low' | 'medium' | 'high';
  showGrid: boolean;
  showMargins: boolean;
  showPadding: boolean;
  showHiddenLayers: boolean;
  showAnnotations: boolean;
  performanceMode: boolean;
};

/***********************
 * EDITOR UI STATE
 ***********************/
type UIState = {
  panels: UIPanel[];
  tools: UITool[];
  inspectors: UIInspector[];
  modals: UIModal[];
  toasts: UIToast[];
  preferences: UIPreferences;
};

type UIPanel = {
  id: string;
  title: string;
  icon: string;
  isVisible: boolean;
  isCollapsed: boolean;
  position: 'left' | 'right' | 'bottom';
  order: number;
};

type UITool = {
  id: string;
  name: string;
  icon: string;
  shortcut?: string;
  isActive: boolean;
  group?: string;
};

type UIInspector = {
  id: string;
  title: string;
  context: any;
  isVisible: boolean;
};

type UIModal = {
  id: string;
  title: string;
  content: any;
  options: any;
  isVisible: boolean;
};

type UIToast = {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration: number;
  isVisible: boolean;
};

type UIPreferences = {
  theme: 'light' | 'dark' | 'system';
  layout: 'default' | 'minimal' | 'custom';
  iconSize: 'small' | 'medium' | 'large';
  density: 'compact' | 'normal' | 'spacious';
  animations: boolean;
  transitions: boolean;
};

/***********************
 * SUPPORTING TYPES
 ***********************/
type KeyboardShortcut = {
  action: string;
  keyCombination: string;
  description: string;
};

type Variable = {
  id: UUID;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';
  value: any;
  scope: 'global' | 'page' | 'component';
  isConstant: boolean;
  description?: string;
};

type ContentEntry = {
  id: UUID;
  modelId: UUID;
  fields: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type ApiEndpoint = {
  id: UUID;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body?: any;
  responseSchema?: any;
};

type Guide = {
  id: UUID;
  type: 'horizontal' | 'vertical';
  position: number;
  color: string;
  isLocked: boolean;
};

type AssetOverride = {
  id: UUID;
  assetId: AssetID;
  elementId: UUID;
  property: string;
  value: any;
};

type LayoutConstraints = {
  horizontal: 'scale' | 'left' | 'right' | 'leftAndRight' | 'center';
  vertical: 'scale' | 'top' | 'bottom' | 'topAndBottom' | 'center';
};

type ElementMetadata = {
  name: string;
  created: Timestamp;
  modified: Timestamp;
  createdBy: UUID;
  componentDefinitionId?: UUID;
  templateId?: UUID;
  notes?: string;
  tags?: string[];
};

type FlowNodeStyle = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  borderWidth: number;
  borderRadius: number;
};

type FlowNodeMetadata = {
  created: Timestamp;
  modified: Timestamp;
  createdBy: UUID;
  templateId?: UUID;
};

type ComponentCategory = {
  id: UUID;
  name: string;
  icon: string;
  order: number;
};

type ComponentMetadata = {
  created: Timestamp;
  modified: Timestamp;
  createdBy: UUID;
  isPublic: boolean;
  templateId?: UUID;
};

type StyleProperties = {
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  margin?: string | number;
  padding?: string | number;
  backgroundColor?: string;
  color?: string;
  border?: string;
  borderRadius?: string | number;
  boxShadow?: string;
  opacity?: number;
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: number | 'normal' | 'bold' | 'lighter' | 'bolder';
  lineHeight?: string | number;
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  textDecoration?: string;
  transform?: string;
  transition?: string;
  cursor?: string;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  zIndex?: number;
};

type DesignSystemMetadata = {
  created: Timestamp;
  modified: Timestamp;
  createdBy: UUID;
  isPublic: boolean;
  version: string;
};

type EditorSettings = {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'design' | 'flow' | 'split';
  componentLibraryView: 'grid' | 'list';
  autoSave: boolean;
  autoSaveInterval: number;
  keyboardShortcuts: KeyboardShortcut[];
  experimentalFeatures: {
    aiAssist: boolean;
    realTimeCollaboration: boolean;
    versionControlIntegration: boolean;
    advancedAnimations: boolean;
  };
  versionControl: {
    enabled: boolean;
    autoCommit: boolean;
    branch: string;
  };
  build: {
    mode: "development" | "production";
    outputDir: string;
    cleanBeforeBuild: boolean;
  };
  deployment: {
    defaultEnvironment: string;
    autoDeploy: boolean;
  };
};

type AssetCategory = {
  id: UUID;
  name: string;
  icon: string;
  order: number;
};

type DataSourceType = {
  name: string;
  description: string;
  schema: any;
  icon: string;
};

type TemplateCategory = {
  id: UUID;
  name: string;
  icon: string;
  order: number;
};

/***********************
 * EXPORT ALL TYPES
 ***********************/
export type {
  UUID,
  Timestamp,
  HexColor,
  URLString,
  AssetID,
  walletAddresses,
  IPFSCid,
  Position,
  Dimensions,
  Rect,
  User,
  UserPreferences,
  UserPermissions,
  UserActivity,
  Editor,
  EditorState,
  EditorVersion,
  EditorSnapshot,
  EditorData,
  EditorCollaborator,
  EditorEnvironment,
  DesignViewState,
  CanvasState,
  CanvasBackground,
  BlendMode,
  CanvasGradient,
  GradientStop,
  CanvasPattern,
  GridSettings,
  Breakpoint,
  Artboard,
  ReactStyle,
  ElementEventHandlers,
  ElementAction,
  ComponentProps,
  DesignElement,
  DataBinding,
  EventBinding,
  CoreComponentTypes,
  SmartContractElement,
  FlowNodeBinding,
  FlowViewState,
  FlowNode,
  BaseFlowNode,
  ContractNode,
  ContractMethodReference,
  ContractEventReference,
  FunctionNode,
  EventNode,
  VariableNode,
  ApiNode,
  ApiAuth,
  DataNode,
  LogicNode,
  LogicCondition,
  UiNode,
  UiEvent,
  UiAction,
  FlowPort,
  FlowParam,
  FlowConnection,
  FlowConnectionStyle,
  FlowVariable,
  ComponentLibrary,
  ComponentDefinition,
  ComponentPropDefinitions,
  ComponentPropDefinition,
  PropType,
  PropControl,
  PropValidation,
  ComponentSlot,
  SlotDefaultValue,
  ComponentStyleDefinitions,
  ComponentStyleGroup,
  ComponentVariantStyle,
  ComponentStateStyle,
  ComponentBehavior,
  ComponentEventDefinition,
  ComponentActionDefinition,
  ComponentParamDefinition,
  ComponentExample,
  SlotExample,
  DesignSystem,
  DesignTokens,
  ColorPalette,
  ColorGroup,
  TypographyScale,
  TextStyle,
  SpacingScale,
  SizingScale,
  ShadowScale,
  ShadowPreset,
  BorderScale,
  OpacityScale,
  ZIndexScale,
  AnimationPresets,
  KeyframeDefinition,
  DesignSystemComponents,
  ComponentStylePreset,
  DesignSystemTheme,
  AssetLibrary,
  Asset,
  AssetVariant,
  VariableRegistry,
  VariableScope,
  VariableTypeDefinition,
  DataSourceRegistry,
  DataSource,
  ContentManager,
  ContentModel,
  ContentField,
  I18nManager,
  I18nLanguage,
  I18nBundle,
  HistoryStack,
  HistoryEntry,
  CollaborationState,
  Collaborator,
  CommentThread,
  Comment,
  Reaction,
  LiveChange,
  PluginManager,
  Plugin,
  PluginUI,
  PluginPanel,
  PluginTool,
  PluginInspector,
  AIManager,
  AIProvider,
  AIInteraction,
  DeploymentManager,
  DeploymentEnvironment,
  DeploymentRecord,
  DeploymentLog,
  DeploymentArtifact,
  TemplateLibrary,
  DesignTemplate,
  FlowTemplate,
  EditorTemplate,
  TemplateCategory,
  InteractionState,
  DragState,
  ResizeState,
  ConnectState,
  ViewportState,
  RenderSettings,
  UIState,
  UIPanel,
  UITool,
  UIInspector,
  UIModal,
  UIToast,
  UIPreferences,
  KeyboardShortcut,
  Variable,
  ContentEntry,
  ApiEndpoint,
  Guide,
  AssetOverride,
  LayoutConstraints,
  ElementMetadata,
  FlowNodeStyle,
  FlowNodeMetadata,
  ComponentCategory,
  ComponentMetadata,
  StyleProperties,
  DesignSystemMetadata,
  EditorSettings,
  AssetCategory,
  DataSourceType,
  ContractMethod,
  ContractEvent,
  ContractParam,
  Expression,
  ChainId,
  NetworkName,
  // NodeType
};