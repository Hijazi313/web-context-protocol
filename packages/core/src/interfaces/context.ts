/**
 * Core context interfaces for MCP
 *
 * These interfaces define the data structures used to represent context
 * throughout the MCP architecture.
 */

/**
 * Privacy level for context filtering
 */
export type PrivacyLevel = 'strict' | 'balanced' | 'permissive';

/**
 * Privacy level enum
 */
export const PrivacyLevel = {
  STRICT: 'strict' as const,
  BALANCED: 'balanced' as const,
  PERMISSIVE: 'permissive' as const,
};

/**
 * Metadata about the context
 */
export interface ContextMetadata {
  /**
   * Timestamp when the context was captured
   */
  timestamp: number;

  /**
   * Source of the context (e.g., 'browser', 'application')
   */
  source: string;

  /**
   * Version of the context schema
   */
  version: string;

  /**
   * Privacy level applied to the context
   */
  privacyLevel: PrivacyLevel;

  /**
   * URL of the page where the context was captured
   */
  url?: string;

  /**
   * Domain of the page where the context was captured
   */
  domain?: string;

  /**
   * Processing information
   */
  processing?: {
    /**
     * Duration of context processing in milliseconds
     */
    durationMs?: number;

    /**
     * Steps applied during processing
     */
    steps?: string[];

    /**
     * Original size of the context before processing
     */
    originalSize?: number;

    /**
     * Processed size of the context
     */
    processedSize?: number;
  };
}

/**
 * DOM node representation
 */
export interface DOMNode {
  /**
   * Node type (element, text, etc.)
   */
  nodeType: number;

  /**
   * Node name (tag name for elements)
   */
  nodeName: string;

  /**
   * Node value (text content for text nodes)
   */
  nodeValue?: string;

  /**
   * Attributes of the node (for element nodes)
   */
  attributes?: Record<string, string>;

  /**
   * CSS classes of the node (for element nodes)
   */
  classList?: string[];

  /**
   * Child nodes
   */
  children?: DOMNode[];

  /**
   * Whether the node is visible
   */
  isVisible?: boolean;

  /**
   * Bounding rectangle of the node
   */
  boundingRect?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  };

  /**
   * Computed styles of the node
   */
  computedStyles?: Record<string, string>;

  /**
   * Accessibility properties
   */
  accessibility?: {
    role?: string;
    label?: string;
    description?: string;
  };
}

/**
 * Selection information
 */
export interface Selection {
  /**
   * Selected text
   */
  text: string;

  /**
   * Start node path
   */
  startNodePath: string;

  /**
   * End node path
   */
  endNodePath: string;

  /**
   * Start offset
   */
  startOffset: number;

  /**
   * End offset
   */
  endOffset: number;
}

/**
 * Viewport information
 */
export interface Viewport {
  /**
   * Width of the viewport in pixels
   */
  width: number;

  /**
   * Height of the viewport in pixels
   */
  height: number;

  /**
   * Scroll position X
   */
  scrollX: number;

  /**
   * Scroll position Y
   */
  scrollY: number;

  /**
   * Device pixel ratio
   */
  devicePixelRatio: number;
}

/**
 * User interaction
 */
export interface Interaction {
  /**
   * Type of interaction
   */
  type: 'click' | 'scroll' | 'hover' | 'keypress' | 'focus' | 'blur' | 'input';

  /**
   * Timestamp of the interaction
   */
  timestamp: number;

  /**
   * Target element path
   */
  targetPath?: string;

  /**
   * Target element tag name
   */
  targetTagName?: string;

  /**
   * Additional data specific to the interaction type
   */
  data?: any;
}

/**
 * Navigation history event
 */
export interface NavigationHistoryEvent {
  /**
   * Type of navigation event
   */
  type: 'pageload' | 'hashchange' | 'popstate' | 'pushstate' | 'replacestate';

  /**
   * Timestamp of the navigation event
   */
  timestamp: number;

  /**
   * URL before the navigation
   */
  fromUrl?: string;

  /**
   * URL after the navigation
   */
  toUrl: string;
}

/**
 * Session information
 */
export interface SessionInfo {
  /**
   * Session ID
   */
  id: string;

  /**
   * Session start timestamp
   */
  startTime: number;

  /**
   * Session duration in milliseconds
   */
  duration: number;

  /**
   * Number of page views in the session
   */
  pageViews?: number;

  /**
   * Number of interactions in the session
   */
  interactionCount?: number;
}

/**
 * Component information
 */
export interface Component {
  /**
   * Component name
   */
  name: string;

  /**
   * Component type
   */
  type: string;

  /**
   * Component props
   */
  props?: Record<string, any>;

  /**
   * Component state
   */
  state?: Record<string, any>;

  /**
   * Child components
   */
  children?: Component[];
}

/**
 * DOM context
 */
export interface DOMContext {
  /**
   * Page title
   */
  title: string;

  /**
   * Page URL
   */
  url: string;

  /**
   * Favicon URL
   */
  favicon?: string;

  /**
   * DOM structure
   */
  structure: DOMNode;

  /**
   * Current selection
   */
  selection?: Selection;

  /**
   * Viewport information
   */
  viewport: Viewport;

  /**
   * Meta tags
   */
  meta?: Record<string, string>;

  /**
   * Open dialogs or modals
   */
  dialogs?: DOMNode[];
}

/**
 * User context
 */
export interface UserContext {
  /**
   * Recent user interactions
   */
  interactions: Interaction[];

  /**
   * Navigation history
   */
  navigation: NavigationHistoryEvent[];

  /**
   * Session information
   */
  session: SessionInfo;

  /**
   * User preferences (non-identifying)
   */
  preferences?: Record<string, any>;
}

/**
 * Application context
 */
export interface AppContext {
  /**
   * Application state
   */
  state: Record<string, unknown>;

  /**
   * Framework name
   */
  framework: string;

  /**
   * Framework version
   */
  frameworkVersion: string;

  /**
   * Components
   */
  components: Component[];

  /**
   * Current route
   */
  route?: {
    path: string;
    params: Record<string, string>;
    query: Record<string, string>;
  };

  /**
   * Application errors
   */
  errors?: Array<{
    message: string;
    stack?: string;
    timestamp: number;
  }>;
}

/**
 * Complete context object
 */
export interface Context {
  /**
   * DOM context
   */
  dom?: DOMContext;

  /**
   * User context
   */
  user?: UserContext;

  /**
   * Application context
   */
  app?: AppContext;

  /**
   * Context metadata
   */
  meta: ContextMetadata;
}

/**
 * Options for context retrieval
 */
export interface ContextOptions {
  /**
   * Depth of context to retrieve
   */
  depth?: 'shallow' | 'medium' | 'deep';

  /**
   * Fields to include
   */
  include?: string[];

  /**
   * Fields to exclude
   */
  exclude?: string[];

  /**
   * Maximum size of context in bytes
   */
  maxSize?: number;

  /**
   * Privacy level to apply
   */
  privacyLevel?: PrivacyLevel;
}

/**
 * Context query for specific elements
 */
export interface ContextQuery {
  /**
   * Whether to include DOM context
   */
  includeDOM?: boolean;

  /**
   * Whether to include user context
   */
  includeUserContext?: boolean;

  /**
   * Whether to include application context
   */
  includeAppContext?: boolean;

  /**
   * Selector for DOM elements
   */
  selector?: string;

  /**
   * Path to specific context data
   */
  path?: string;

  /**
   * Filter conditions
   */
  filter?: Record<string, any>;

  /**
   * Maximum number of results
   */
  limit?: number;

  /**
   * Maximum depth of DOM tree to capture
   */
  maxDepth?: number;

  /**
   * Privacy level to apply
   */
  privacyLevel?: PrivacyLevel;
}

/**
 * Result of a context query
 */
export interface QueryResult {
  /**
   * Context data
   */
  context: Partial<Context>;

  /**
   * Execution time in milliseconds
   */
  executionTime: number;

  /**
   * Whether the query was successful
   */
  success: boolean;

  /**
   * Error message if the query failed
   */
  error?: string;
}
