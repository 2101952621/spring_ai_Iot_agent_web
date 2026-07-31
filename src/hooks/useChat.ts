import { useCallback, useEffect, useRef, useState } from 'react';
import { chatApi } from '@/api/chat';
import { generateId } from '@/utils';
import type { ChatEventVO, ChatMessage, Example, SessionVO } from '@/types';

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState<Example[]>([]);
  const [examplesPage, setExamplesPage] = useState(0);
  const [examplesLoading, setExamplesLoading] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);
  const sessionIdRef = useRef(sessionId);
  const initialLoadedRef = useRef(false);
  const messagesSessionRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const loadExamples = useCallback(async (page: number) => {
    setExamplesLoading(true);
    try {
      const list = await chatApi.getHotMessages(page);
      setExamples(list);
      setExamplesPage(page);
    } catch {
      setExamples([]);
    } finally {
      setExamplesLoading(false);
    }
  }, []);

  const refreshExamples = useCallback(async () => {
    const nextPage = examplesPage + 1;
    await loadExamples(nextPage);
  }, [examplesPage, loadExamples]);

  const loadHistory = useCallback(async (sid: string) => {
    try {
      const list = await chatApi.queryBySessionId(sid);
      setMessages(
        list.map((m) => ({
          id: generateId(),
          role: m.type === 'USER' ? 'user' : 'assistant',
          content: m.content,
        })),
      );
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadedRef.current) {
      initialLoadedRef.current = true;
      loadExamples(0);
    }
  }, [loadExamples]);

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      messagesSessionRef.current = '';
      return;
    }
    // 如果当前 messages 已经属于目标会话，避免覆盖（例如发送消息途中触发的加载）
    if (messagesSessionRef.current === sessionId) return;
    loadHistory(sessionId).then(() => {
      messagesSessionRef.current = sessionId;
    });
  }, [sessionId, loadHistory]);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
      setLoading(false);
    }
  }, []);

  const send = useCallback(
    async (text: string, explicitSessionId?: string): Promise<void> => {
      const sid = explicitSessionId || sessionIdRef.current;
      if (!text.trim() || !sid || loading) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
      };
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '',
        loading: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      messagesSessionRef.current = sid;
      setInput('');
      setLoading(true);

      return new Promise<void>((resolve) => {
        const es = chatApi.chatStream(text.trim(), sid);
        abortRef.current = () => {
          es.close();
          resolve();
        };

        const finish = () => {
          setLoading(false);
          abortRef.current = null;
          resolve();
        };

        es.onmessage = (event) => {
          try {
            const data: ChatEventVO = JSON.parse(event.data);
            if (data.eventType === 1001 && data.eventData) {
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (!last || last.role !== 'assistant') return prev;
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: last.content + data.eventData, loading: false },
                ];
              });
            } else if (data.eventType === 1002) {
              es.close();
              finish();
            }
          } catch {
            // 非 JSON 事件文本直接追加
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (!last || last.role !== 'assistant') return prev;
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + event.data, loading: false },
              ];
            });
          }
        };

        es.onerror = (err) => {
          const detail = err.message || '连接异常，请稍后重试。';
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== 'assistant') return prev;
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content || detail, loading: false },
            ];
          });
          finish();
        };
      });
    },
    [sessionId, loading],
  );

  const createSession = useCallback(async (): Promise<SessionVO | null> => {
    try {
      return await chatApi.createSession(3);
    } catch {
      return null;
    }
  }, []);

  return {
    messages,
    input,
    setInput,
    loading,
    examples,
    examplesLoading,
    send,
    stop,
    createSession,
    refreshExamples,
  };
}
