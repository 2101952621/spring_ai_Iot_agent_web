import { useCallback, useEffect, useState } from 'react';
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
  const [sessions, setSessions] = useState<Record<string, ChatSessionVO[]>>({});
  const [currentSessionId, setCurrentSessionId] = useState('');

  const { messages, input, setInput, loading, examples, examplesLoading, send, stop, createSession, refreshExamples } =
    useChat(currentSessionId);

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

  const handleSend = async () => {
    let sid = currentSessionId;
    if (!sid) {
      const session = await createSession();
      if (!session) return;
      sid = session.sessionId;
      setCurrentSessionId(sid);
      await loadSessions();
    }
    send(input, sid);
  };

  const handleExampleSelect = async (question: string) => {
    let sid = currentSessionId;
    if (!sid) {
      const session = await createSession();
      if (!session) return;
      sid = session.sessionId;
      setCurrentSessionId(sid);
      await loadSessions();
    }
    setInput(question);
    send(question, sid);
  };

  const activeSessionTitle = currentSessionId
    ? (Object.values(sessions)
        .flat()
        .find((s) => s.sessionId === currentSessionId)?.title ?? '新会话')
    : '万物互联领航员';

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gradient-to-br from-brand-start via-white to-brand-end">
      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelect={handleSelectSession}
        onNew={handleNewSession}
        onDelete={handleDeleteSession}
      />

      <main className="flex flex-col flex-1">
        <ChatHeader
          title={activeSessionTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 pb-20">
              <ExampleQuestions
                examples={examples}
                onSelect={handleExampleSelect}
                onRefresh={refreshExamples}
                refreshing={examplesLoading}
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
