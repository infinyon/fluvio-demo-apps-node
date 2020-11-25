///
/// Chat Protocol Message Definitions
///

export type Payload =
  | Init
  | BotText
  | OperatorText
  | UserText
  | ChoiceRequest
  | ChoiceResponse
  | StartChatSession
  | EndChatSession;

export interface Init {
  kind: "Init"
}

export interface BotText {
  kind: "BotText",
  content: string
}

export interface OperatorText {
  kind: "OperatorText",
  name: string,
  content: string
}

export interface UserText {
  kind: "UserText",
  sessionId: string,
  content?: string,
}

export interface ChoiceRequest {
  kind: "ChoiceRequest",
  question: string,
  groupId: string,
  choices: Array<Choice>,
}

export interface Choice {
  itemId: string,
  content: string
}

export interface ChoiceResponse {
  kind: "ChoiceResponse",
  groupId: string,
  itemId: string,
  content?: string,
}

export interface StartChatSession {
  kind: "StartChatSession",
  sessionId: string,
  chatPrompt?: string,
  chatText?: string,
}

export interface EndChatSession {
  kind: "EndChatSession",
  sessionId: string,
}

/**
 * Check if Payload is init
 */
export const isInitPayload = (payload: Payload) => {
  return (payload.kind === "Init")
};