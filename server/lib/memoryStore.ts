interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Session {
  messages: ChatMessage[];
  createdAt: number;
  lastActivity: number;
}

const SESSION_TTL = 60 * 60 * 1000;
const MAX_MESSAGES_PER_SESSION = 100;

const sessions = new Map<string, Session>();

export function getMessages(sessionId: string): ChatMessage[] {
  const session = sessions.get(sessionId);
  if (!session) return [];
  session.lastActivity = Date.now();
  return session.messages;
}

export function addMessage(sessionId: string, role: 'user' | 'assistant', content: string): void {
  let session = sessions.get(sessionId);
  if (!session) {
    session = { messages: [], createdAt: Date.now(), lastActivity: Date.now() };
    sessions.set(sessionId, session);
  }

  session.messages.push({ role, content });
  session.lastActivity = Date.now();

  if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
    session.messages = session.messages.slice(-MAX_MESSAGES_PER_SESSION);
  }
}

export function clearSession(sessionId: string): void {
  sessions.delete(sessionId);
}

function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActivity > SESSION_TTL) {
      sessions.delete(id);
    }
  }
}

setInterval(cleanupExpiredSessions, 5 * 60 * 1000);
