import { useCallback, useEffect, useRef, useState } from 'react';
import { chatApi } from '@/api/chat';
import { generateId } from '@/utils';
import type { AnalysisPreviewData, ChatEventVO, ChatMessage, DownloadEventData, Example, SessionVO, WebFunctionInfo } from '@/types';

export function useChat(sessionId: string) {
  // 按会话 ID 隔离消息状态，切换会话时不会丢失正在生成的消息
  const [sessionMessages, setSessionMessages] = useState<Record<string, ChatMessage[]>>({});
  // 已经从后端加载过历史消息的会话集合
  const [loadedSessions, setLoadedSessions] = useState<Set<string>>(new Set());
  // 当前正在进行 SSE 流式响应的会话 ID
  const [streamingSessionId, setStreamingSessionId] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const [examples, setExamples] = useState<Example[]>([]);
  const [examplesPage, setExamplesPage] = useState(0);
  const [examplesLoading, setExamplesLoading] = useState(false);

  const abortRef = useRef<(() => void) | null>(null);
  const sessionIdRef = useRef(sessionId);
  const initialLoadedRef = useRef(false);

  // 用 ref 同步最新状态，避免这些状态变化导致 loadHistory / send 频繁重建
  const loadedSessionsRef = useRef(loadedSessions);
  const sessionMessagesRef = useRef(sessionMessages);
  const streamingSessionRef = useRef(streamingSessionId);

  sessionIdRef.current = sessionId;

  useEffect(() => {
    loadedSessionsRef.current = loadedSessions;
  }, [loadedSessions]);

  useEffect(() => {
    sessionMessagesRef.current = sessionMessages;
  }, [sessionMessages]);

  useEffect(() => {
    streamingSessionRef.current = streamingSessionId;
  }, [streamingSessionId]);

  const messages = sessionMessages[sessionId] || [];
  // loading 只对当前会话生效，切换去其他会话时不会显示停止按钮
  const loading = streamingSessionId === sessionId;

  // 更新指定会话的消息列表
  const updateSessionMessages = useCallback((sid: string, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setSessionMessages((prev) => {
      const current = prev[sid] || [];
      const next = updater(current);
      if (next === current) return prev;
      return { ...prev, [sid]: next };
    });
  }, []);

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
    if (!sid || loadedSessionsRef.current.has(sid)) return;

    // 如果当前会话已有本地消息（例如正在生成中），优先保留本地状态，避免覆盖导致"正在思考"消失
    if (sessionMessagesRef.current[sid]?.length > 0) {
      setLoadedSessions((prev) => new Set(prev).add(sid));
      return;
    }

    try {
      const list = await chatApi.queryBySessionId(sid);
      setSessionMessages((prev) => ({
        ...prev,
        [sid]: list.map((m) => ({
          id: generateId(),
          role: m.type === 'USER' ? 'user' : 'assistant',
          content: m.content,
        })),
      }));
    } catch {
      // 加载失败时不覆盖已有本地状态
    } finally {
      setLoadedSessions((prev) => new Set(prev).add(sid));
    }
  }, []);

  useEffect(() => {
    if (!initialLoadedRef.current) {
      initialLoadedRef.current = true;
      loadExamples(0);
    }
  }, [loadExamples]);

  useEffect(() => {
    if (!sessionId) return;
    loadHistory(sessionId);
  }, [sessionId, loadHistory]);

  const stop = useCallback(() => {
    if (abortRef.current) {
      const sid = streamingSessionRef.current;
      abortRef.current();
      abortRef.current = null;
      setStreamingSessionId(null);
      // 主动停止后 onerror 不再触发（EventSourcePolyfill 已标记 closed），
      // 需要手动关闭 assistant 消息的 loading 状态
      if (sid) {
        updateSessionMessages(sid, (prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.role !== 'assistant' || !last.loading) return prev;
          return [
            ...prev.slice(0, -1),
            { ...last, loading: false, content: last.content || '（已停止生成）' },
          ];
        });
      }
    }
  }, [updateSessionMessages]);

  const send = useCallback(
    async (text: string, explicitSessionId?: string): Promise<void> => {
      const sid = explicitSessionId || sessionIdRef.current;
      // 任意会话正在流式响应时都禁止重复发送
      if (!text.trim() || !sid || streamingSessionRef.current) return;

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

      updateSessionMessages(sid, (prev) => [...prev, userMsg, assistantMsg]);
      setInput('');
      setStreamingSessionId(sid);

      return new Promise<void>((resolve) => {
        const es = chatApi.chatStream(text.trim(), sid);
        abortRef.current = () => {
          es.close();
          resolve();
        };

        const finish = () => {
          setStreamingSessionId(null);
          abortRef.current = null;
          resolve();
        };

        es.onmessage = (event) => {
          try {
            const data: ChatEventVO = JSON.parse(event.data);
            if (data.eventType === 1001 && data.eventData) {
              updateSessionMessages(sid, (prev) => {
                const last = prev[prev.length - 1];
                if (!last || last.role !== 'assistant') return prev;
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: last.content + data.eventData, loading: false },
                ];
              });
            } else if (data.eventType === 1004 && data.eventData) {
              try {
                const card: WebFunctionInfo =
                  typeof data.eventData === 'string' ? JSON.parse(data.eventData) : (data.eventData as WebFunctionInfo);
                updateSessionMessages(sid, (prev) => {
                  const last = prev[prev.length - 1];
                  if (!last || last.role !== 'assistant') return prev;
                  return [
                    ...prev.slice(0, -1),
                    { ...last, functionCard: card, loading: false },
                  ];
                });
              } catch {
                // 卡片数据解析失败，静默忽略
              }
            } else if (data.eventType === 1005 && data.eventData) {
              try {
                const downloadData: DownloadEventData =
                  typeof data.eventData === 'string' ? JSON.parse(data.eventData) : (data.eventData as DownloadEventData);
                if (downloadData.cardType === 'REPORT_EXPORT') {
                  // Word 分析报告：显示下载按钮卡片，不自动下载
                  updateSessionMessages(sid, (prev) => {
                    const last = prev[prev.length - 1];
                    if (!last || last.role !== 'assistant') return prev;
                    return [
                      ...prev.slice(0, -1),
                      { ...last, reportDownload: downloadData, loading: false },
                    ];
                  });
                } else if (downloadData.downloadUrl && downloadData.fileName) {
                  // Excel 日志导出：自动下载
                  chatApi.downloadFile(downloadData.downloadUrl).then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = downloadData.fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }).catch((err) => {
                    console.error('文件下载失败:', err);
                  });
                }
              } catch {
                // 下载事件数据解析失败，静默忽略
              }
            } else if (data.eventType === 1006 && data.eventData) {
              // 分析预览事件：渲染智能洞察卡片
              try {
                const analysisData: AnalysisPreviewData =
                  typeof data.eventData === 'string' ? JSON.parse(data.eventData) : (data.eventData as AnalysisPreviewData);
                updateSessionMessages(sid, (prev) => {
                  const last = prev[prev.length - 1];
                  if (!last || last.role !== 'assistant') return prev;
                  return [
                    ...prev.slice(0, -1),
                    { ...last, analysisCard: analysisData, loading: false },
                  ];
                });
              } catch {
                // 分析预览数据解析失败，静默忽略
              }
            } else if (data.eventType === 1002) {
              es.close();
              finish();
            }
          } catch {
            // 非 JSON 事件文本直接追加
            updateSessionMessages(sid, (prev) => {
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
          updateSessionMessages(sid, (prev) => {
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
    [updateSessionMessages],
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
