/***********************
 * CORE PRIMITIVES
 ***********************/
type UUID = string;
type Timestamp = number;
type HexColor = `#${string}`;
type URLString = `http://${string}` | `https://${string}`;
type AssetID = `asset_${UUID}`;
type EthereumAddress = `0x${string}`;
type IPFSCid = `Qm${string}` | `bafy${string}`;

interface Position {
  x: number;
  y: number;
  z?: number; // For 3D canvas support
}

interface Dimensions {
  width: number;
  height: number;
  depth?: number; // For 3D elements
}

interface Rect {
  position: Position;
  dimensions: Dimensions;
}

/***********************
 * AUTH & COLLABORATION
 ***********************/
interface User {
  id: UUID;
  auth: {
    email: string;
    walletAddresses: EthereumAddress[];
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
}

interface UserPreferences {
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
}

interface UserPermissions {
  roles: ('admin' | 'editor' | 'viewer' | 'developer')[];
  projects: {
    id: UUID;
    role: 'owner' | 'collaborator' | 'viewer';
    permissions: ('edit' | 'deploy' | 'share' | 'export')[];
  }[];
}

interface UserActivity {
  timestamp: Timestamp;
  type: 'login' | 'project_open' | 'element_create' | 'deployment';
  projectId?: UUID;
  details?: Record<string, any>;
}

/***********************
 * PROJECT STRUCTURE
 ***********************/
interface Project {
  id: UUID;
  meta: {
    name: string;
    description: string;
    icon: AssetID;
    tags: string[];
    isTemplate: boolean;
    templateId?: UUID;
  };
  state: ProjectState;
  versions: ProjectVersion[];
  collaborators: ProjectCollaborator[];
  settings: ProjectSettings;
  environments: ProjectEnvironment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ProjectState {
  currentVersionId: UUID;
  publishedVersions: UUID[];
  draftVersion?: UUID;
}

interface ProjectVersion {
  id: UUID;
  name: string;
  description?: string;
  snapshot: ProjectSnapshot;
  createdBy: UUID;
  createdAt: Timestamp;
  parentVersionId?: UUID; // For version branching
}

interface ProjectSnapshot {
  design: DesignViewState;
  flow: FlowViewState;
  data: ProjectData;
}

interface ProjectData {
  variables: Variable[];
  dataSources: DataSource[];
  content: ContentEntry[];
  i18n: I18nBundle[];
  apiEndpoints: ApiEndpoint[];
}

interface ProjectCollaborator {
  userId: UUID;
  role: 'admin' | 'editor' | 'developer' | 'viewer';
  joinedAt: Timestamp;
  lastActive?: Timestamp;
  permissions: string[];
}

/***********************
 * DESIGN VIEW - CANVAS
 ***********************/
interface DesignViewState {
  canvas: CanvasState;
  elements: DesignElement[];
  selectedElements: UUID[];
  hoveredElement?: UUID;
  interactionState: InteractionState;
  viewport: ViewportState;
  guides: Guide[];
  assetOverrides: AssetOverride[];
}

interface CanvasState {
  type: '2d' | '3d';
  dimensions: Dimensions;
  background: CanvasBackground;
  grid: GridSettings;
  breakpoints: Breakpoint[];
  currentBreakpointId: UUID;
  artboards: Artboard[];
  currentArtboardId: UUID;
}

interface CanvasBackground {
  type: 'color' | 'image' | 'gradient' | 'pattern';
  color?: HexColor;
  image?: AssetID;
  gradient?: CanvasGradient;
  pattern?: CanvasPattern;
  opacity: number;
  blendMode: BlendMode;
}

type BlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay'
  | 'darken' | 'lighten' | 'color-dodge' | 'color-burn'
  | 'hard-light' | 'soft-light' | 'difference' | 'exclusion'
  | 'hue' | 'saturation' | 'color' | 'luminosity';

interface CanvasGradient {
  type: 'linear' | 'radial' | 'conic';
  stops: GradientStop[];
  rotation?: number;
  position?: Position;
}

interface GradientStop {
  position: number;
  color: HexColor;
  opacity?: number;
}

interface CanvasPattern {
  assetId: AssetID;
  repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
  scale: number;
  position: Position;
}

interface GridSettings {
  enabled: boolean;
  size: number;
  subdivisions: number;
  color: HexColor;
  opacity: number;
  snapping: {
    enabled: boolean;
    strength: number;
  };
}

interface Breakpoint {
  id: UUID;
  name: string;
  minWidth: number;
  maxWidth?: number;
  baseFontSize: number;
  mediaQuery?: string;
  icon: AssetID;
}

interface Artboard {
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
}

/***********************
 * DESIGN ELEMENTS
 ***********************/
type DesignElement = 
  | VisualElement 
  | LayoutElement 
  | ComponentInstance 
  | SmartContractElement
  | CanvasGroup;

interface VisualElement {
  id: UUID;
  type: 'rectangle' | 'ellipse' | 'text' | 'image' | 'vector' | 'icon';
  position: Position;
  dimensions: Dimensions;
  transform: ElementTransform;
  style: ElementStyle;
  constraints: LayoutConstraints;
  parentId?: UUID;
  childrenIds: UUID[];
  meta: ElementMetadata;
}

interface ElementTransform {
  rotation: number;
  skew: {
    x: number;
    y: number;
  };
  origin: Position;
}

interface ElementStyle {
  fills: Paint[];
  borders: Border[];
  shadows: Shadow[];
  effects: ElementEffect[];
  opacity: number;
  blendMode: BlendMode;
  filters: ElementFilter[];
  clip: ClipSettings;
  overflow: 'visible' | 'hidden' | 'scroll';
}

interface Paint {
  type: 'solid' | 'gradient' | 'image' | 'noise';
  color?: HexColor;
  gradient?: CanvasGradient;
  image?: AssetID;
  opacity: number;
  blendMode: BlendMode;
}

interface Border {
  position: 'inside' | 'center' | 'outside';
  thickness: number;
  color: HexColor;
  style: 'solid' | 'dashed' | 'dotted';
  dashPattern?: [number, number];
}

interface Shadow {
  type: 'drop-shadow' | 'inner-shadow';
  color: HexColor;
  blur: number;
  spread: number;
  offset: Position;
}

interface ElementEffect {
  type: 'blur' | 'glow' | 'background-blur';
  radius: number;
  color?: HexColor;
}

interface ElementFilter {
  type: 'brightness' | 'contrast' | 'saturate' | 'hue-rotate';
  value: number;
}

interface ClipSettings {
  enabled: boolean;
  mode: 'rect' | 'circle' | 'path';
  path?: string; // SVG path for custom clipping
}

interface LayoutElement {
  id: UUID;
  type: 'frame' | 'section' | 'grid' | 'stack';
  layoutMode: 'none' | 'horizontal' | 'vertical' | 'grid';
  position: Position;
  dimensions: Dimensions;
  layoutConfig: LayoutConfig;
  childrenIds: UUID[];
  style: ElementStyle;
  constraints: LayoutConstraints;
  parentId?: UUID;
  meta: ElementMetadata;
}

interface LayoutConfig {
  padding: Spacing;
  gap: number;
  itemSpacing?: number;
  gridColumns?: number;
  gridRows?: number;
  alignment?: 'start' | 'center' | 'end' | 'space-between';
  wrap?: boolean;
}

interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface ComponentInstance {
  id: UUID;
  type: 'component';
  componentId: UUID;
  position: Position;
  dimensions: Dimensions;
  props: ComponentProps;
  variants: ComponentVariant[];
  overrides: ComponentOverride[];
  childrenIds: UUID[];
  parentId?: UUID;
  constraints: LayoutConstraints;
  meta: ElementMetadata;
}

interface ComponentProps {
  [key: string]: PropValue;
}

type PropValue = 
  | string 
  | number 
  | boolean 
  | PropValue[]
  | { [key: string]: PropValue }
  | Expression;

interface Expression {
  type: 'expression';
  language: 'javascript' | 'solidity' | 'jsonata';
  code: string;
  dependencies: string[];
}

interface ComponentVariant {
  name: string;
  condition: string;
  props: ComponentProps;
}

interface ComponentOverride {
  targetId: UUID;
  props: ComponentProps;
}

interface SmartContractElement {
  id: UUID;
  type: 'contract';
  contractType: 'ethereum' | 'solana' | 'cosmos';
  address: EthereumAddress;
  abi: any;
  methods: ContractMethod[];
  events: ContractEvent[];
  position: Position;
  dimensions: Dimensions;
  style: ElementStyle;
  meta: ElementMetadata;
}

interface ContractMethod {
  name: string;
  inputs: ContractParam[];
  outputs: ContractParam[];
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
}

interface ContractEvent {
  name: string;
  inputs: ContractParam[];
  anonymous: boolean;
}

interface ContractParam {
  name: string;
  type: string;
  indexed?: boolean;
}

interface CanvasGroup {
  id: UUID;
  type: 'group';
  name: string;
  position: Position;
  dimensions: Dimensions;
  childrenIds: UUID[];
  isLocked: boolean;
  isHidden: boolean;
  meta: ElementMetadata;
}

/***********************
 * FLOW VIEW
 ***********************/
interface FlowViewState {
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
}

type FlowNode = 
  | ContractNode 
  | FunctionNode 
  | EventNode 
  | VariableNode 
  | ApiNode 
  | DataNode 
  | LogicNode 
  | UiNode;

interface BaseFlowNode {
  id: UUID;
  type: string;
  position: Position;
  dimensions: Dimensions;
  title: string;
  description?: string;
  style: FlowNodeStyle;
  ports: FlowPort[];
  metadata: FlowNodeMetadata;
}

interface ContractNode extends BaseFlowNode {
  type: 'contract';
  contractAddress: EthereumAddress;
  network: string;
  abi: any;
  methods: ContractMethodReference[];
  events: ContractEventReference[];
}

interface ContractMethodReference {
  name: string;
  nodeId: UUID;
}

interface ContractEventReference {
  name: string;
  nodeId: UUID;
}

interface FunctionNode extends BaseFlowNode {
  type: 'function';
  language: 'javascript' | 'typescript' | 'solidity';
  code: string;
  inputs: FlowParam[];
  outputs: FlowParam[];
}

interface EventNode extends BaseFlowNode {
  type: 'event';
  eventName: string;
  payloadSchema: any;
}

interface VariableNode extends BaseFlowNode {
  type: 'variable';
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'array';
  initialValue: any;
  isConstant: boolean;
  scope: 'global' | 'local';
}

interface ApiNode extends BaseFlowNode {
  type: 'api';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body?: any;
  auth?: ApiAuth;
}

interface ApiAuth {
  type: 'none' | 'basic' | 'bearer' | 'apiKey' | 'oauth2';
  config?: any;
}

interface DataNode extends BaseFlowNode {
  type: 'data';
  operation: 'read' | 'write' | 'query';
  source: 'local' | 'ipfs' | 'arweave' | 'database';
  query?: any;
}

interface LogicNode extends BaseFlowNode {
  type: 'logic';
  logicType: 'if' | 'switch' | 'loop' | 'delay' | 'trigger';
  conditions?: LogicCondition[];
  delayMs?: number;
}

interface LogicCondition {
  left: string | Expression;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  right: string | Expression;
}

interface UiNode extends BaseFlowNode {
  type: 'ui';
  uiType: 'button' | 'form' | 'input' | 'display';
  elementId?: UUID;
  events: UiEvent[];
}

interface UiEvent {
  type: string;
  action: UiAction;
}

type UiAction = 
  | { type: 'navigate', target: string }
  | { type: 'triggerFlow', flowId: UUID }
  | { type: 'callContract', nodeId: UUID }
  | { type: 'setVariable', variableId: UUID, value: any }
  | { type: 'custom', code: string };

interface FlowPort {
  id: UUID;
  type: 'input' | 'output';
  dataType: string;
  name: string;
  defaultValue?: any;
  isArray: boolean;
  isOptional: boolean;
}

interface FlowParam {
  name: string;
  type: string;
  defaultValue?: any;
}

interface FlowConnection {
  id: UUID;
  source: {
    nodeId: UUID;
    portId: UUID;
  };
  target: {
    nodeId: UUID;
    portId: UUID;
  };
  style: FlowConnectionStyle;
  metadata: {
    created: Timestamp;
    createdBy: UUID;
  };
}

interface FlowConnectionStyle {
  color: HexColor;
  width: number;
  dashArray: number[];
  animated: boolean;
}

interface FlowVariable {
  id: UUID;
  name: string;
  type: string;
  value: any;
  scope: 'flow' | 'global';
  isConstant: boolean;
}

/***********************
 * COMPONENT SYSTEM
 ***********************/
interface ComponentLibrary {
  components: ComponentDefinition[];
  categories: ComponentCategory[];
  tags: string[];
}

interface ComponentDefinition {
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
}

interface ComponentPropDefinitions {
  [key: string]: ComponentPropDefinition;
}

interface ComponentPropDefinition {
  type: PropType;
  defaultValue?: any;
  required?: boolean;
  description?: string;
  options?: any[];
  control?: PropControl;
  validation?: PropValidation;
}

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

interface PropValidation {
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
}

interface ComponentSlot {
  name: string;
  description?: string;
  allowedComponents?: string[];
  required?: boolean;
  defaultValue?: SlotDefaultValue;
}

type SlotDefaultValue = 
  | { type: 'text', content: string }
  | { type: 'component', componentId: UUID }
  | { type: 'elements', elementIds: UUID[] };

interface ComponentStyleDefinitions {
  default: ComponentStyleGroup;
  variants: ComponentVariantStyle[];
  states: ComponentStateStyle[];
}

interface ComponentStyleGroup {
  base: StyleProperties;
  responsive?: Record<string, Partial<StyleProperties>>;
}

interface ComponentVariantStyle {
  name: string;
  condition: string;
  styles: Partial<StyleProperties>;
}

interface ComponentStateStyle {
  state: 'hover' | 'active' | 'focus' | 'disabled';
  styles: Partial<StyleProperties>;
}

interface ComponentBehavior {
  name: string;
  description?: string;
  events: ComponentEventDefinition[];
  actions: ComponentActionDefinition[];
}

interface ComponentEventDefinition {
  name: string;
  description?: string;
  payloadSchema?: any;
}

interface ComponentActionDefinition {
  name: string;
  description?: string;
  parameters?: ComponentParamDefinition[];
}

interface ComponentParamDefinition {
  name: string;
  type: string;
  required?: boolean;
}

interface ComponentExample {
  name: string;
  description?: string;
  props: Record<string, any>;
  slots?: Record<string, SlotExample>;
  styles?: Partial<StyleProperties>;
}

interface SlotExample {
  type: 'text' | 'component' | 'elements';
  content: any;
}

/***********************
 * DESIGN SYSTEM
 ***********************/
interface DesignSystem {
  id: UUID;
  name: string;
  description: string;
  version: string;
  tokens: DesignTokens;
  components: DesignSystemComponents;
  themes: DesignSystemTheme[];
  meta: DesignSystemMetadata;
}

interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  sizing: SizingScale;
  shadows: ShadowScale;
  borders: BorderScale;
  opacity: OpacityScale;
  zIndex: ZIndexScale;
  animations: AnimationPresets;
}

interface ColorPalette {
  primary: ColorGroup;
  secondary: ColorGroup;
  accent: ColorGroup;
  neutral: ColorGroup;
  success: ColorGroup;
  warning: ColorGroup;
  danger: ColorGroup;
  info: ColorGroup;
  [key: string]: ColorGroup;
}

interface ColorGroup {
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
}

interface TypographyScale {
  fontFamilies: Record<string, string>;
  fontWeights: Record<string, number>;
  fontSizes: Record<string, string>;
  lineHeights: Record<string, number>;
  letterSpacing: Record<string, string>;
  textStyles: Record<string, TextStyle>;
}

interface TextStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: number;
  letterSpacing: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

interface SpacingScale {
  base: number;
  scale: 'linear' | 'exponential';
  factors: Record<string, number>;
}

interface SizingScale {
  base: number;
  scale: 'linear' | 'exponential';
  factors: Record<string, number>;
}

interface ShadowScale {
  small: ShadowPreset;
  medium: ShadowPreset;
  large: ShadowPreset;
  xlarge: ShadowPreset;
  [key: string]: ShadowPreset;
}

interface ShadowPreset {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: HexColor;
  inset?: boolean;
}

interface BorderScale {
  width: Record<string, number>;
  radius: Record<string, number>;
  style: Record<string, 'solid' | 'dashed' | 'dotted'>;
}

interface OpacityScale {
  values: Record<string, number>;
}

interface ZIndexScale {
  values: Record<string, number>;
}

interface AnimationPresets {
  durations: Record<string, string>;
  easings: Record<string, string>;
  delays: Record<string, string>;
  keyframes: Record<string, KeyframeDefinition>;
}

interface KeyframeDefinition {
  [key: string]: Record<string, any>;
}

interface DesignSystemComponents {
  buttons: ComponentStylePreset[];
  inputs: ComponentStylePreset[];
  cards: ComponentStylePreset[];
  [key: string]: ComponentStylePreset[];
}

interface ComponentStylePreset {
  name: string;
  base: StyleProperties;
  variants?: Record<string, Partial<StyleProperties>>;
  states?: Record<string, Partial<StyleProperties>>;
}

interface DesignSystemTheme {
  name: string;
  base: 'light' | 'dark';
  tokens: Partial<DesignTokens>;
}

/***********************
 * EDITOR STATE
 ***********************/
interface EditorState {
  currentProject: UUID;
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
}

interface AssetLibrary {
  assets: Asset[];
  categories: AssetCategory[];
  tags: string[];
}

interface Asset {
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
}

interface AssetVariant {
  size: 'original' | 'thumb' | 'small' | 'medium' | 'large';
  url: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

interface VariableRegistry {
  variables: Variable[];
  scopes: VariableScope[];
  types: VariableTypeDefinition[];
}

interface VariableScope {
  id: UUID;
  name: string;
  type: 'global' | 'page' | 'component' | 'flow';
  parentId?: UUID;
}

interface VariableTypeDefinition {
  name: string;
  baseType: string;
  validation?: any;
  editor?: any;
}

interface DataSourceRegistry {
  sources: DataSource[];
  types: DataSourceType[];
}

interface DataSource {
  id: UUID;
  name: string;
  type: 'api' | 'database' | 'contract' | 'localStorage' | 'ipfs';
  config: any;
  schema?: any;
}

interface ContentManager {
  models: ContentModel[];
  entries: ContentEntry[];
}

interface ContentModel {
  id: UUID;
  name: string;
  fields: ContentField[];
}

interface ContentField {
  name: string;
  type: string;
  required: boolean;
  validation?: any;
}

interface I18nManager {
  languages: I18nLanguage[];
  bundles: I18nBundle[];
}

interface I18nLanguage {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
}

interface I18nBundle {
  id: UUID;
  language: string;
  strings: Record<string, string>;
}

interface HistoryStack {
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  current: HistoryEntry;
}

interface HistoryEntry {
  id: UUID;
  type: 'design' | 'flow' | 'both';
  timestamp: Timestamp;
  description: string;
  snapshot: ProjectSnapshot;
}

interface CollaborationState {
  users: Collaborator[];
  session: {
    id: UUID;
    started: Timestamp;
    active: boolean;
  };
  comments: CommentThread[];
  changes: LiveChange[];
}

interface Collaborator {
  userId: UUID;
  presence: {
    activeView: 'design' | 'flow';
    selection: UUID[];
    cursor: Position;
  };
  permissions: string[];
}

interface CommentThread {
  id: UUID;
  target: {
    type: 'element' | 'node' | 'canvas';
    id: UUID;
  };
  position: Position;
  comments: Comment[];
  resolved: boolean;
}

interface Comment {
  id: UUID;
  author: UUID;
  content: string;
  timestamp: Timestamp;
  reactions: Reaction[];
}

interface Reaction {
  emoji: string;
  users: UUID[];
}

interface LiveChange {
  type: 'create' | 'update' | 'delete';
  target: {
    type: 'element' | 'node' | 'connection';
    id: UUID;
  };
  data: any;
  author: UUID;
  timestamp: Timestamp;
}

interface PluginManager {
  plugins: Plugin[];
  enabled: UUID[];
}

interface Plugin {
  id: UUID;
  name: string;
  description: string;
  version: string;
  author: string;
  icon: AssetID;
  entryPoint: string;
  permissions: string[];
  ui?: PluginUI;
}

interface PluginUI {
  panels: PluginPanel[];
  tools: PluginTool[];
  inspectors: PluginInspector[];
}

interface PluginPanel {
  id: UUID;
  title: string;
  icon: AssetID;
  location: 'left' | 'right' | 'bottom';
  component: string;
}

interface AIManager {
  enabled: boolean;
  providers: AIProvider[];
  history: AIInteraction[];
}

interface AIProvider {
  id: UUID;
  type: 'openai' | 'anthropic' | 'local' | 'custom';
  name: string;
  config: any;
}

interface AIInteraction {
  id: UUID;
  prompt: string;
  response: string;
  timestamp: Timestamp;
  context: any;
}

/***********************
 * DEPLOYMENT & BUILD
 ***********************/
interface DeploymentManager {
  environments: DeploymentEnvironment[];
  history: DeploymentRecord[];
  artifacts: DeploymentArtifact[];
}

interface DeploymentEnvironment {
  id: UUID;
  name: string;
  type: 'development' | 'staging' | 'production';
  config: any;
  url?: string;
}

interface DeploymentRecord {
  id: UUID;
  environment: UUID;
  version: UUID;
  timestamp: Timestamp;
  status: 'pending' | 'success' | 'failed' | 'in-progress';
  logs: DeploymentLog[];
  artifacts: UUID[];
}

interface DeploymentLog {
  timestamp: Timestamp;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: any;
}

interface DeploymentArtifact {
  id: UUID;
  type: 'frontend' | 'backend' | 'contract' | 'assets';
  name: string;
  size: number;
  url: string;
  hash: string;
  createdAt: Timestamp;
}

/***********************
 * TEMPLATES
 ***********************/
interface TemplateLibrary {
  designTemplates: DesignTemplate[];
  flowTemplates: FlowTemplate[];
  projectTemplates: ProjectTemplate[];
  categories: TemplateCategory[];
}

interface DesignTemplate {
  id: UUID;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: AssetID;
  preview: AssetID;
  canvas: CanvasState;
  elements: DesignElement[];
  designSystem?: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface FlowTemplate {
  id: UUID;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: AssetID;
  nodes: FlowNode[];
  connections: FlowConnection[];
  variables: FlowVariable[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ProjectTemplate {
  id: UUID;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: AssetID;
  design: DesignTemplate;
  flow: FlowTemplate;
  designSystem?: UUID;
  variables: Variable[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/***********************
 * INTERACTION STATES
 ***********************/
interface InteractionState {
  mode: 'select' | 'create' | 'drag' | 'resize' | 'connect';
  tool?: string;
  status: 'idle' | 'active' | 'complete';
  data?: any;
}

interface DragState {
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
}

interface ResizeState {
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
}

interface ConnectState {
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
}

/***********************
 * VIEWPORT & RENDERING
 ***********************/
interface ViewportState {
  position: Position;
  zoom: number;
  dimensions: Dimensions;
  visibleRect: Rect;
}

interface RenderSettings {
  quality: 'low' | 'medium' | 'high';
  showGrid: boolean;
  showMargins: boolean;
  showPadding: boolean;
  showHiddenLayers: boolean;
  showAnnotations: boolean;
  performanceMode: boolean;
}

/***********************
 * EDITOR UI STATE
 ***********************/
interface UIState {
  panels: UIPanel[];
  tools: UITool[];
  inspectors: UIInspector[];
  modals: UIModal[];
  toasts: UIToast[];
  preferences: UIPreferences;
}

interface UIPanel {
  id: string;
  title: string;
  icon: string;
  isVisible: boolean;
  isCollapsed: boolean;
  position: 'left' | 'right' | 'bottom';
  order: number;
}

interface UITool {
  id: string;
  name: string;
  icon: string;
  shortcut?: string;
  isActive: boolean;
  group?: string;
}

interface UIInspector {
  id: string;
  title: string;
  context: any;
  isVisible: boolean;
}

interface UIModal {
  id: string;
  title: string;
  content: any;
  options: any;
  isVisible: boolean;
}

interface UIToast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration: number;
  isVisible: boolean;
}

interface UIPreferences {
  theme: 'light' | 'dark' | 'system';
  layout: 'default' | 'minimal' | 'custom';
  iconSize: 'small' | 'medium' | 'large';
  density: 'compact' | 'normal' | 'spacious';
  animations: boolean;
  transitions: boolean;
}

/***********************
 * MISSING TYPE DEFINITIONS
 ***********************/

// Keyboard Shortcut
interface KeyboardShortcut {
    action: string;
    keyCombination: string;
    description: string;
  }
  
  // Project Settings
  interface ProjectSettings {
    versionControl: {
      enabled: boolean;
      autoCommit: boolean;
      branch: string;
    };
    build: {
      outputDir: string;
      cleanBeforeBuild: boolean;
    };
    deployment: {
      defaultEnvironment: string;
      autoDeploy: boolean;
    };
  }
  
  // Project Environment
  interface ProjectEnvironment {
    id: UUID;
    name: string;
    type: 'development' | 'staging' | 'production';
    config: {
      apiBaseUrl: string;
      chainId: number;
      contractAddresses: Record<string, string>;
    };
  }
  
  // Variable
  interface Variable {
    id: UUID;
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';
    value: any;
    scope: 'global' | 'page' | 'component';
    isConstant: boolean;
    description?: string;
  }
  
  // Content Entry
  interface ContentEntry {
    id: UUID;
    modelId: UUID;
    fields: Record<string, any>;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }
  
  // API Endpoint
  interface ApiEndpoint {
    id: UUID;
    name: string;
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body?: any;
    responseSchema?: any;
  }
  
  // Guide
  interface Guide {
    id: UUID;
    type: 'horizontal' | 'vertical';
    position: number;
    color: string;
    isLocked: boolean;
  }
  
  // Asset Override
  interface AssetOverride {
    id: UUID;
    assetId: AssetID;
    elementId: UUID;
    property: string;
    value: any;
  }
  
  // Layout Constraints
  interface LayoutConstraints {
    horizontal: 'scale' | 'left' | 'right' | 'leftAndRight' | 'center';
    vertical: 'scale' | 'top' | 'bottom' | 'topAndBottom' | 'center';
  }
  
  // Element Metadata
  interface ElementMetadata {
    created: Timestamp;
    modified: Timestamp;
    createdBy: UUID;
    componentDefinitionId?: UUID;
    templateId?: UUID;
    notes?: string;
    tags?: string[];
  }
  
  // Flow Node Style
  interface FlowNodeStyle {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    borderWidth: number;
    borderRadius: number;
  }
  
  // Flow Node Metadata
  interface FlowNodeMetadata {
    created: Timestamp;
    modified: Timestamp;
    createdBy: UUID;
    templateId?: UUID;
  }
  
  // Component Category
  interface ComponentCategory {
    id: UUID;
    name: string;
    icon: string;
    order: number;
  }
  
  // Component Metadata
  interface ComponentMetadata {
    created: Timestamp;
    modified: Timestamp;
    createdBy: UUID;
    isPublic: boolean;
    templateId?: UUID;
  }
  
  // Style Properties
  interface StyleProperties {
    // Layout
    display?: 'block' | 'flex' | 'grid' | 'inline' | 'none';
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    
    // Box Model
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    margin?: string | number;
    padding?: string | number;
    
    // Appearance
    backgroundColor?: string;
    color?: string;
    border?: string;
    borderRadius?: string | number;
    boxShadow?: string;
    opacity?: number;
    
    // Typography
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: number | 'normal' | 'bold' | 'lighter' | 'bolder';
    lineHeight?: string | number;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    textDecoration?: string;
    
    // Transform
    transform?: string;
    transition?: string;
    
    // Other
    cursor?: string;
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
    zIndex?: number;
  }
  
  // Design System Metadata
  interface DesignSystemMetadata {
    created: Timestamp;
    modified: Timestamp;
    createdBy: UUID;
    isPublic: boolean;
    version: string;
  }
  
  // Editor Settings
  interface EditorSettings {
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
  }
  
  // Asset Category
  interface AssetCategory {
    id: UUID;
    name: string;
    icon: string;
    order: number;
  }
  
  // Data Source Type
  interface DataSourceType {
    name: string;
    description: string;
    schema: any;
    icon: string;
  }
  
  // Plugin Tool
  interface PluginTool {
    id: UUID;
    name: string;
    icon: string;
    component: string;
  }
  
  // Plugin Inspector
  interface PluginInspector {
    id: UUID;
    name: string;
    component: string;
    targetTypes: string[];
  }
  
  // Template Category
  interface TemplateCategory {
    id: UUID;
    name: string;
    icon: string;
    order: number;
  }