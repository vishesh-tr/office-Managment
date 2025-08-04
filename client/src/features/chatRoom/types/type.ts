type MessageType = "user" | "system";

export interface ChatMessage {
  username?: string;
  message: string;
  room?: string;
  timestamp: string;
  type: MessageType;
}
