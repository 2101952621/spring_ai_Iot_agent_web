import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ExampleQuestions } from '@/components/ExampleQuestions';
import { useChat } from '@/hooks/useChat';
import { chatApi } from '@/api/chat';
import type { ChatSessionVO } from '@/types';

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sessions, setSessions] = useState<Record<string, ChatSessionVO[]>>({});
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [exampleSending, setExampleSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, loading, examples, examplesLoading, send, stop, createSession, refreshExamples } =
    useChat(currentSessionId);

  // 消息变化时自动滚动到底部
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadSessions = useCallback(async () => {
    try {
      const data = await chatApi.queryHistorySession();
      setSessions(data);
    } catch {
      setSessions({});
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleNewSession = async () => {
    const session = await createSession();
    if (session) {
      setCurrentSessionId(session.sessionId);
      await loadSessions();
    }
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleDeleteSession = async (sessionId: string) => {
    await chatApi.deleteHistorySession(sessionId);
    if (sessionId === currentSessionId) {
      setCurrentSessionId('');
    }
    await loadSessions();
  };

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(true);
      setSidebarCollapsed(false);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  };

  const handleSend = async () => {
    if (loading) return;
    let sid = currentSessionId;
    if (!sid) {
      const session = await createSession();
      if (!session) return;
      sid = session.sessionId;
    }
    await send(input, sid);
    if (sid !== currentSessionId) {
      setCurrentSessionId(sid);
      await loadSessions();
    }
  };

  const handleExampleSelect = async (question: string) => {
    if (exampleSending || loading) return;
    setExampleSending(true);
    try {
      let sid = currentSessionId;
      if (!sid) {
        const session = await createSession();
        if (!session) return;
        sid = session.sessionId;
      }
      setInput(question);
      await send(question, sid);
      if (sid !== currentSessionId) {
        setCurrentSessionId(sid);
        await loadSessions();
      }
    } finally {
      setExampleSending(false);
    }
  };

  const activeSessionTitle = currentSessionId
    ? (Object.values(sessions)
        .flat()
        .find((s) => s.sessionId === currentSessionId)?.title ?? '新会话')
    : '万物互联领航员';

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gradient-to-br from-brand-start via-white to-brand-end dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelect={handleSelectSession}
        onNew={handleNewSession}
        onDelete={handleDeleteSession}
      />

      <main className="flex flex-col flex-1">
        <ChatHeader
          title={activeSessionTitle}
          onMenuClick={handleMenuClick}
        />

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 pb-20">
              <ExampleQuestions
                examples={examples}
                onSelect={handleExampleSelect}
                onRefresh={refreshExamples}
                refreshing={examplesLoading}
                disabled={exampleSending || loading}
              />
            </div>
          ) : (
            <div className="w-full max-w-3xl py-4 mx-auto">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onStop={stop}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
