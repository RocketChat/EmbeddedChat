export interface Message {
  _id: string;
  msg: string;
  u: { _id: string; username: string; name?: string };
  ts: Date;
}

export type AITaskType = "chat" | "composer" | "replySuggestions";

export interface AITaskConfig {
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export type AITaskConfigs = Partial<Record<AITaskType, AITaskConfig>>;

export interface AIContext {
  roomId: string;
  userId: string;
  history: Message[];
  metadata?: {
    federated?: boolean;
    task?: AITaskType;
  };
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
}

export interface IAIAdapter {
  name: string;
  sendPrompt(context: AIContext, message: string): Promise<AIResponse>;
  getSuggestions?(
    conversation: Message[],
    context?: AIContext
  ): Promise<string[]>;
  summarize?(messages: Message[], context?: AIContext): Promise<string>;
  isAvailable(): Promise<boolean>;
}
