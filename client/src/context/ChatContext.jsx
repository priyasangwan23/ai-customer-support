import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ChatContext = createContext(null);

// ── Fallback dummy data used when backend is unreachable ──────────
const DUMMY_CONVERSATIONS = [
  {
    _id: 'dummy-1',
    title: 'How do I track my order?',
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    messages: [
      { _id: 'd1m1', sender: 'user', text: 'How do I track my order?', timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
      { _id: 'd1m2', sender: 'bot', text: 'You can track your order from the Orders section in your account dashboard.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    ],
  },
  {
    _id: 'dummy-2',
    title: 'What are your business hours?',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    messages: [
      { _id: 'd2m1', sender: 'user', text: 'What are your business hours?', timestamp: new Date(Date.now() - 1000 * 60 * 61).toISOString() },
      { _id: 'd2m2', sender: 'bot', text: 'We are open Monday to Friday, 9:00 AM to 5:00 PM.', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    ],
  },
  {
    _id: 'dummy-3',
    title: 'How can I contact support?',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    messages: [
      { _id: 'd3m1', sender: 'user', text: 'How can I contact support?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.1).toISOString() },
      { _id: 'd3m2', sender: 'bot', text: 'You can reach us at support@example.com.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    ],
  },
];

const API = 'http://localhost:5000/api/history';

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations]               = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory]          = useState(true);
  const [useDummy, setUseDummy]                          = useState(false);

  // Mirror conversations in a ref so callbacks don't need it as a dep
  const conversationsRef = useRef([]);
  useEffect(() => { conversationsRef.current = conversations; }, [conversations]);

  // ── Fetch all conversations on mount ─────────────────────────
  const fetchConversations = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Non-array response');
      setConversations(data);
      setUseDummy(false);
    } catch (err) {
      console.warn('[ChatContext] fetch history failed, using dummy data:', err.message);
      setConversations(DUMMY_CONVERSATIONS);
      setUseDummy(true);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ── Create a brand-new conversation, returns it ───────────────
  const createConversation = useCallback(async (title = 'New Conversation') => {
    if (useDummy) {
      const newConv = {
        _id: `dummy-${Date.now()}`,
        title,
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv._id);
      return newConv;
    }
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        // Server error — fall back to an in-memory dummy conversation
        // so the UI stays usable even when the history API is broken
        console.warn(`[ChatContext] createConversation server error ${res.status}, using local fallback`);
        const fallback = {
          _id: `local-${Date.now()}`,
          title,
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        setConversations(prev => [fallback, ...prev]);
        setActiveConversationId(fallback._id);
        return fallback;
      }
      const newConv = await res.json();
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv._id);
      return newConv;
    } catch (err) {
      console.error('[ChatContext] createConversation failed:', err);
      // Network error — also fall back to local conversation
      const fallback = {
        _id: `local-${Date.now()}`,
        title,
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setConversations(prev => [fallback, ...prev]);
      setActiveConversationId(fallback._id);
      return fallback;
    }
  }, [useDummy]);

  // ── Append a message to a conversation (local + backend) ──────
  const appendMessage = useCallback(async (convId, sender, text) => {
    // Optimistic local update
    const newMsg = {
      _id: `local-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toISOString(),
    };

    setConversations(prev =>
      prev.map(c => {
        if (c._id !== convId) return c;
        const updatedTitle =
          c.title === 'New Conversation' && sender === 'user'
            ? (text.length > 40 ? text.slice(0, 40) + '…' : text)
            : c.title;
        return {
          ...c,
          title: updatedTitle,
          updatedAt: new Date().toISOString(),
          messages: [...(c.messages || []), newMsg],
        };
      })
    );

    if (useDummy) return newMsg;

    try {
      await fetch(`${API}/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, text }),
      });
    } catch (err) {
      console.error('[ChatContext] appendMessage failed:', err);
    }
    return newMsg;
  }, [useDummy]);

  // ── Get full messages for a conversation ──────────────────────
  // Uses conversationsRef (not conversations state) so this function stays
  // stable between renders and doesn't cause cascading useEffect calls.
  const getConversationMessages = useCallback(async (convId) => {
    if (useDummy) {
      const found = conversationsRef.current.find(c => c._id === convId);
      return found?.messages ?? [];
    }
    try {
      const res = await fetch(`${API}/${convId}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setConversations(prev =>
        prev.map(c => (c._id === convId ? { ...c, messages: data.messages } : c))
      );
      return data.messages;
    } catch (err) {
      console.error('[ChatContext] getConversationMessages failed:', err);
      return [];
    }
  }, [useDummy]); // conversations removed — read via ref instead

  // ── Delete a conversation ─────────────────────────────────────
  const deleteConversation = useCallback(async (convId) => {
    setConversations(prev => prev.filter(c => c._id !== convId));
    if (activeConversationId === convId) setActiveConversationId(null);

    if (useDummy) return;
    try {
      await fetch(`${API}/${convId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('[ChatContext] deleteConversation failed:', err);
    }
  }, [useDummy, activeConversationId]);

  return (
    <ChatContext.Provider value={{
      conversations,
      conversationsRef,
      activeConversationId,
      setActiveConversationId,
      isLoadingHistory,
      useDummy,
      createConversation,
      appendMessage,
      getConversationMessages,
      deleteConversation,
      refetchConversations: fetchConversations,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatHistory = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatHistory must be used inside <ChatProvider>');
  return ctx;
};
