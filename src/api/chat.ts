import { http } from './request';
import type { ChatEventVO, ChatSessionVO, Example, MessageVO, SessionVO } from '@/types';

export const chatApi = {
  /** 获取热门示例问题（分页，每页固定 3 条） */
  getHotMessages: (page = 0) =>
    http.get<Example[]>('/ai/hot', { params: { page } }),

  /** 创建新会话 */
  createSession: (n = 3) =>
    http.post<SessionVO>('/ai', undefined, { params: { n } }),

  /** 查询历史会话列表（分组） */
  queryHistorySession: () =>
    http.get<Record<string, ChatSessionVO[]>>('/ai/history'),

  /** 删除历史会话 */
  deleteHistorySession: (sessionId: string) =>
    http.delete(`/ai/history?sessionId=${encodeURIComponent(sessionId)}`),

  /** 更新会话标题 */
  updateTitle: (sessionId: string, title: string) =>
    http.put(`/ai/history?sessionId=${encodeURIComponent(sessionId)}&title=${encodeURIComponent(title)}`),

  /** 查询单个会话详情 */
  queryBySessionId: (sessionId: string) =>
    http.get<MessageVO[]>(`/ai/${encodeURIComponent(sessionId)}`),

  /** 发起 SSE 聊天流 */
  chatStream: (question: string, sessionId: string) => {
    const token = localStorage.getItem('mtn_ai_token');
    // 使用相对路径，开发时由 Vite 代理转发到 localhost:8080，避免 CORS
    const target = new URL('/api/ai/chat', window.location.origin);

    return new EventSourcePolyfill(target.toString(), {
      method: 'POST',
      headers: token
        ? { 'X-Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, sessionId }),
    });
  },
};

/**
 * 简单兼容：EventSource 不支持 POST + Headers + Body
 * 通过 fetch 读取 text/event-stream
 */
class EventSourcePolyfill {
  private abortController = new AbortController();
  private url: string;
  private options: RequestInit;

  onmessage: ((ev: MessageEvent<string>) => void) | null = null;
  onerror: ((err: Error) => void) | null = null;
  onopen: (() => void) | null = null;

  constructor(url: string, options: RequestInit) {
    this.url = url;
    this.options = options;
    this.connect();
  }

  private async connect() {
    try {
      const resp = await fetch(this.url, {
        ...this.options,
        signal: this.abortController.signal,
        headers: {
          Accept: 'text/event-stream',
          ...(this.options.headers || {}),
        },
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => `HTTP ${resp.status}`);
        throw new Error(`SSE 连接失败(${resp.status}): ${text}`);
      }

      if (!resp.body) {
        throw new Error('SSE 响应体为空');
      }

      if (this.onopen) this.onopen();

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        this.parseLines(lines);
      }
    } catch (err) {
      if (this.onerror && err instanceof Error) this.onerror(err);
    }
  }

  private parseLines(lines: string[]) {
    let currentData = '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') {
        if (currentData !== '' && this.onmessage) {
          this.onmessage(new MessageEvent('message', { data: currentData }));
        }
        currentData = '';
      } else if (trimmed.startsWith('data:')) {
        const data = trimmed.slice(5).trim();
        currentData = currentData ? `${currentData}\n${data}` : data;
      } else if (trimmed.startsWith('event:') || trimmed.startsWith('id:')) {
        // ignore
      }
    }
  }

  close() {
    this.abortController.abort();
  }
}
