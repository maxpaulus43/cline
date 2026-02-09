/**
 * Cline Library Type Definitions
 *
 * This file provides TypeScript type definitions for the Cline library.
 * Consumers can import ClineAgent and related types to embed Cline in their applications.
 *
 * @module cline
 */

import type * as acp from "@agentclientprotocol/sdk"

// ============================================================
// Core Agent
// ============================================================

/**
 * Options for creating a ClineAgent instance.
 */
export interface ClineAgentOptions {
	/** CLI version string */
	version: string
	/** Whether debug logging is enabled */
	debug?: boolean
}

/**
 * Cline's implementation of the ACP Agent interface.
 *
 * This agent bridges the ACP protocol with Cline's core Controller,
 * translating ACP requests into Controller operations and emitting
 * session updates via EventEmitters.
 *
 * @example
 * ```typescript
 * import { ClineAgent } from "cline"
 *
 * const agent = new ClineAgent({ version: "1.0.0" })
 * await agent.initialize({ clientCapabilities: {} })
 * const session = await agent.newSession({ cwd: process.cwd() })
 * const response = await agent.prompt({
 *   sessionId: session.sessionId,
 *   prompt: [{ type: "text", text: "Hello, Cline!" }]
 * })
 * ```
 */
export declare class ClineAgent implements acp.Agent {
	constructor(options: ClineAgentOptions)

	/** Map of active sessions by session ID */
	readonly sessions: Map<string, ClineAcpSession>

	/**
	 * Set the permission handler callback.
	 * Called when the agent needs permission for a tool call.
	 */
	setPermissionHandler(handler: PermissionHandler): void

	/**
	 * Get the event emitter for a session.
	 * Use this to subscribe to session events.
	 */
	emitterForSession(sessionId: string): ClineSessionEmitter

	/**
	 * Initialize the agent and return its capabilities.
	 */
	initialize(params: acp.InitializeRequest, connection?: acp.AgentSideConnection): Promise<acp.InitializeResponse>

	/**
	 * Initialize the host provider with optional connection for ACP mode.
	 */
	initializeHostProvider(clientCapabilities?: acp.ClientCapabilities, connection?: acp.AgentSideConnection): void

	/**
	 * Create a new session.
	 */
	newSession(params: acp.NewSessionRequest): Promise<acp.NewSessionResponse>

	/**
	 * Set the model for a session.
	 * @experimental This is an unstable API that may change.
	 */
	unstable_setSessionModel(params: acp.SetSessionModelRequest): Promise<acp.SetSessionModelResponse>

	/**
	 * Handle a user prompt.
	 */
	prompt(params: acp.PromptRequest): Promise<acp.PromptResponse>

	/**
	 * Cancel the current operation in a session.
	 */
	cancel(params: acp.CancelNotification): Promise<void>

	/**
	 * Set the session mode (plan/act).
	 */
	setSessionMode(params: acp.SetSessionModeRequest): Promise<acp.SetSessionModeResponse>

	/**
	 * Handle authentication requests.
	 */
	authenticate(params: acp.AuthenticateRequest): Promise<acp.AuthenticateResponse>

	/**
	 * Shutdown the agent and clean up resources.
	 */
	shutdown(): Promise<void>
}

// ============================================================
// Session Emitter
// ============================================================

/**
 * Event emitter for session updates.
 * Extends EventEmitter with typed events for ACP session updates.
 */
export declare class ClineSessionEmitter {
	/**
	 * Subscribe to a session update event.
	 */
	on<K extends keyof ClineSessionEvents>(event: K, listener: ClineSessionEvents[K]): this

	/**
	 * Subscribe to a session update event (once).
	 */
	once<K extends keyof ClineSessionEvents>(event: K, listener: ClineSessionEvents[K]): this

	/**
	 * Unsubscribe from a session update event.
	 */
	off<K extends keyof ClineSessionEvents>(event: K, listener: ClineSessionEvents[K]): this

	/**
	 * Emit a session update event.
	 */
	emit<K extends keyof ClineSessionEvents>(event: K, ...args: Parameters<ClineSessionEvents[K]>): boolean
}

// ============================================================
// Session Types
// ============================================================

/**
 * Extended session data stored by Cline for ACP sessions.
 */
export interface ClineAcpSession {
	/** Unique session/task ID */
	sessionId: string
	/** Working directory for the session */
	cwd: string
	/** Current mode (plan/act) */
	mode: "plan" | "act"
	/** MCP servers passed from the client */
	mcpServers: acp.McpServer[]
	/** Timestamp when session was created */
	createdAt: number
	/** Timestamp of last activity */
	lastActivityAt: number
	/** Whether this session was loaded from history */
	isLoadedFromHistory?: boolean
	/** Model ID override for plan mode (format: "provider/modelId") */
	planModeModelId?: string
	/** Model ID override for act mode (format: "provider/modelId") */
	actModeModelId?: string
}

/**
 * State tracking for an active ACP session.
 */
export interface AcpSessionState {
	/** Session ID */
	sessionId: string
	/** Whether the session is currently processing a prompt */
	isProcessing: boolean
	/** Current tool call ID being executed (if any) */
	currentToolCallId?: string
	/** Whether the session has been cancelled */
	cancelled: boolean
	/** Accumulated tool calls for permission batching */
	pendingToolCalls: Map<string, acp.ToolCall>
}

// ============================================================
// Permission Handling
// ============================================================

/**
 * Callback to resolve a permission request with the user's response.
 */
export type PermissionResolver = (response: acp.RequestPermissionResponse) => void

/**
 * Handler function for permission requests.
 * Called when the agent needs permission for a tool call.
 */
export type PermissionHandler = (request: Omit<acp.RequestPermissionRequest, "sessionId">, resolve: PermissionResolver) => void

// ============================================================
// Event Types
// ============================================================

/**
 * Extract the sessionUpdate discriminator value from a SessionUpdate variant.
 */
export type SessionUpdateType = acp.SessionUpdate["sessionUpdate"]

/**
 * Extract the payload type for a given sessionUpdate discriminator value.
 */
export type SessionUpdatePayload<T extends SessionUpdateType> = Omit<
	Extract<acp.SessionUpdate, { sessionUpdate: T }>,
	"sessionUpdate"
>

/**
 * Maps ACP SessionUpdate types to their event listener signatures.
 */
export type ClineSessionEvents = {
	[K in SessionUpdateType]: (payload: SessionUpdatePayload<K>) => void
} & {
	/** Error event for session-level errors */
	error: (error: Error) => void
}

// ============================================================
// Agent Capabilities
// ============================================================

/**
 * Cline-specific agent capabilities.
 */
export interface ClineAgentCapabilities {
	/** Support for loading sessions from disk */
	loadSession: boolean
	/** Prompt capabilities for the agent */
	promptCapabilities: {
		/** Support for image inputs */
		image: boolean
		/** Support for audio inputs */
		audio: boolean
		/** Support for embedded context (file resources) */
		embeddedContext: boolean
	}
	/** MCP server passthrough capabilities */
	mcpCapabilities: {
		/** Support for HTTP MCP servers */
		http: boolean
		/** Support for SSE MCP servers */
		sse: boolean
	}
}

/**
 * Cline agent info for ACP initialization response.
 */
export interface ClineAgentInfo {
	name: "cline"
	title: "Cline"
	version: string
}

// ============================================================
// Message Translation
// ============================================================

/**
 * Result of translating a Cline message to ACP session update(s).
 */
export interface TranslatedMessage {
	/** The session updates to send */
	updates: acp.SessionUpdate[]
	/** Whether this message requires a permission request */
	requiresPermission?: boolean
	/** Permission request details if required */
	permissionRequest?: Omit<acp.RequestPermissionRequest, "sessionId">
	/** The toolCallId that was created/used */
	toolCallId?: string
}

/**
 * Permission option as presented to the ACP client.
 */
export interface ClinePermissionOption {
	kind: acp.PermissionOptionKind
	name: string
	optionId: string
}

// ============================================================
// Re-exported ACP Types
// ============================================================

export type {
	Agent,
	AgentSideConnection,
	AudioContent,
	CancelNotification,
	ClientCapabilities,
	ContentBlock,
	ImageContent,
	InitializeRequest,
	InitializeResponse,
	LoadSessionRequest,
	LoadSessionResponse,
	McpServer,
	ModelInfo,
	NewSessionRequest,
	NewSessionResponse,
	PermissionOption,
	PermissionOptionKind,
	PromptRequest,
	PromptResponse,
	RequestPermissionRequest,
	RequestPermissionResponse,
	SessionConfigOption,
	SessionModelState,
	SessionNotification,
	SessionUpdate,
	SetSessionConfigOptionRequest,
	SetSessionConfigOptionResponse,
	SetSessionModelRequest,
	SetSessionModelResponse,
	SetSessionModeRequest,
	SetSessionModeResponse,
	StopReason,
	TextContent,
	ToolCall,
	ToolCallStatus,
	ToolCallUpdate,
	ToolKind,
} from "@agentclientprotocol/sdk"
