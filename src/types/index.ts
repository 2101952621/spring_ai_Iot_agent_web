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

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ResetPasswordForm {
  email: string;
  newPassword: string;
  confirmPassword?: string;
  resetToken: string;
  verificationCode?: string;
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

export interface VersionItem {
  releaseDate: string;
  title: string;
  content?: string;
  detailUrl?: string;
}

export interface WebFunctionInfo {
  id: number;
  functionCode: string;
  functionName: string;
  module?: string;
  openUrl?: string | null;
  functionPath?: string | null;
  buttonText?: string;
  icon?: string;
  description?: string;
  cardType?: string;
  precautions?: string;
  configMethod?: string | null;
}

export interface ChatEventVO {
  eventType: number;
  eventData: string | null;
}

export interface DownloadEventData {
  fileName: string;
  fileSize: number;
  downloadUrl: string;
  downloadToken: string;
  cardType: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
  functionCard?: WebFunctionInfo;
}

export interface ChatMessageSearchVO {
  messageId: string;
  sessionId: string;
  sessionTitle: string;
  messageType: string;
  messageContent: string;
  highlight: string;
  createTime: string;
  score: number;
}

export interface ChatMessageSearchResult {
  keyword: string;
  page: number;
  size: number;
  total: number;
  items: ChatMessageSearchVO[];
}

