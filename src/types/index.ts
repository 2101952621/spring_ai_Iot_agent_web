export interface User {
  uuidId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  authority?: string;
  tenantId?: string;
  customerId?: string;
  [key: string]: unknown;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface ChatSessionVO {
  sessionId: string;
  title?: string;
  updateTime?: string;
}

export interface SessionVO {
  sessionId: string;
  examples: Example[];
}

export interface Example {
  title: string;
  describe: string;
}

export interface MessageVO {
  content: string;
  type: 'USER' | 'ASSISTANT';
}

export interface ChatEventVO {
  eventType: number;
  eventData: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}
