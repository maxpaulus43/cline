/**
 * Cline Library Exports
 *
 * This file exports the public API for programmatic use of Cline.
 * Consumers can import these classes and types to embed Cline in their applications.
 *
 * @example
 * ```typescript
 * import { ClineAgent } from "cline"
 *
 * const agent = new ClineAgent({ version: "1.0.0" })
 * await agent.initialize({ clientCapabilities: {} })
 * const session = await agent.newSession({ cwd: process.cwd() })
 * ```
 *
 * @module cline
 */

// Re-export ACP SDK types that consumers will need
export type {
	Agent,
	AgentSideConnection,
	AudioContent,
	CancelNotification,
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
// Core Agent
export { ClineAgent } from "./agent/ClineAgent.js"
export { ClineSessionEmitter } from "./agent/ClineSessionEmitter.js"
// Types
export type {
	AcpAgentOptions,
	AcpSessionState,
	// Session types
	ClineAcpSession,
	// Agent capabilities and info
	ClineAgentCapabilities,
	ClineAgentInfo,
	// Agent options and configuration
	ClineAgentOptions,
	// Permission options
	ClinePermissionOption,
	// Event types
	ClineSessionEvents,
	ClineToAcpUpdateMapping,
	// Permission handling
	PermissionHandler,
	PermissionResolver,
	SessionUpdatePayload,
	SessionUpdateType,
	// Message translation
	TranslatedMessage,
} from "./agent/types.js"
