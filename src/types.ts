import type { WebMCP } from 'webmcp-types';

export type ExecutionMode = 'without-ready' | 'with-ready';

export type LogLevel = 'AGENT' | 'REACT' | 'ERROR' | 'SUCCESS' | 'WAIT';

export interface TimelineEvent {
  id: string;
  timestamp: number;
  relativeMs: number;
  source: LogLevel;
  title: string;
  details?: string;
  highlight?: boolean;
}

/**
 * Proposed extension to WebMCP.ModelContextTool from 'webmcp-types'.
 * Adds semantic capability state (enabled/disabled) and operational synchronization state (ready/unready).
 */
export interface StateAwareModelContextTool extends WebMCP.ModelContextTool {
  /**
   * Semantic / Domain State:
   * Indicates whether this tool is permitted / actionable in the current application state.
   * Agents should NOT attempt to call disabled tools.
   * @default true
   */
  enabled?: boolean;

  /**
   * Natural-language reason why the tool is currently disabled (e.g. "User must log in first").
   */
  disabledReason?: string;

  /**
   * Operational / Synchronization State:
   * Indicates whether the application is currently stable and ready to execute this tool.
   * Agents CAN invoke unready tools, but the WebMCP runtime will await readiness before passing execution.
   * @default true
   */
  ready?: boolean;

  /**
   * Explanation of why the application is currently unready (e.g. "React DOM reconciliation in progress").
   */
  unreadyReason?: string;
}

/**
 * Proposed extension to WebMCP.RegisteredTool from 'webmcp-types'.
 * Exposes the live enabled and ready states when querying tools via modelContext.getTools().
 */
export interface StateAwareRegisteredTool extends WebMCP.RegisteredTool {
  enabled: boolean;
  disabledReason?: string;
  ready: boolean;
  unreadyReason?: string;
}

export interface OrderReceipt {
  id: string;
  item: string;
  originalPrice: number;
  discountApplied: number;
  finalPaid: number;
  expectedPrice: number;
  couponUsed: string;
  timestamp: string;
  status: 'CORRUPTED_OVERCHARGED' | 'SUCCESS';
  reason: string;
}
