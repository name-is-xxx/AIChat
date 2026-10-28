import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { ChatMessage, Conversation } from "../../utils/types";
import { seedArchivedConversations, seedConversations } from "../../utils/data";
import { createId } from "../../utils/utils";
import { useSessionState } from "../../utils/useSessionState";
import { mockReply } from "./mockReply";

interface ChatLists {
  conversations: Conversation[];
  archives: Conversation[];
}

export interface ChatActions {
  sendMessage: (content: string, conversationId?: string) => string | null;
  renameConversation: (id: string, title: string) => boolean;
  archiveConversation: (id: string) => void;
  restoreConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
}

const ChatListsContext = createContext<ChatLists | null>(null);
const ChatActionsContext = createContext<ChatActions | null>(null);

export function ChatDataProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useSessionState<Conversation[]>(
    "morrow.activeConversations",
    seedConversations,
  );
  const [archives, setArchives] = useSessionState<Conversation[]>(
    "morrow.archivedConversations",
    seedArchivedConversations,
  );

  const sendMessage = useCallback(
    (content: string, conversationId?: string): string | null => {
      const clean = content.trim();
      if (!clean) return null;

      const active = conversations.find(
        (conversation) => conversation.id === conversationId,
      );
      const archived = archives.find(
        (conversation) => conversation.id === conversationId,
      );
      const existing = active ?? archived;
      const id = existing?.id ?? createId("chat");
      const now = new Date().toISOString();
      const userMessage: ChatMessage = {
        id: createId("message"),
        role: "user",
        content: clean,
        createdAt: now,
        status: "complete",
      };
      const assistantMessage: ChatMessage = {
        id: createId("message"),
        role: "assistant",
        content: "",
        createdAt: new Date(Date.now() + 800).toISOString(),
        status: "streaming",
      };
      const nextConversation: Conversation = {
        id,
        title: existing?.title ?? clean.replace(/\s+/g, " ").slice(0, 22),
        preview: clean,
        updatedAt: now,
        messages: [
          ...(existing?.messages ?? []),
          userMessage,
          assistantMessage,
        ],
      };

      setConversations((current) => [
        nextConversation,
        ...current.filter((conversation) => conversation.id !== id),
      ]);
      if (archived) {
        setArchives((current) =>
          current.filter((conversation) => conversation.id !== id),
        );
      }

      window.setTimeout(() => {
        const answer = mockReply(clean);
        const updateReply = (conversation: Conversation): Conversation => ({
          ...conversation,
          preview: answer.replace(/\s+/g, " ").slice(0, 60),
          updatedAt: new Date().toISOString(),
          messages: conversation.messages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  content: answer,
                  status: "complete",
                  createdAt: new Date().toISOString(),
                }
              : message,
          ),
        });

        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === id ? updateReply(conversation) : conversation,
          ),
        );
        setArchives((current) =>
          current.map((conversation) =>
            conversation.id === id ? updateReply(conversation) : conversation,
          ),
        );
      }, 6000);
      return id;
    },
    [archives, conversations, setArchives, setConversations],
  );

  const renameConversation = useCallback(
    (id: string, title: string) => {
      const cleanTitle = title.trim();
      if (!cleanTitle) return false;
      const exists = [...conversations, ...archives].some(
        (conversation) => conversation.id === id,
      );
      if (!exists) return false;

      const rename = (conversation: Conversation) =>
        conversation.id === id
          ? { ...conversation, title: cleanTitle }
          : conversation;
      setConversations((current) => current.map(rename));
      setArchives((current) => current.map(rename));
      return true;
    },
    [archives, conversations, setArchives, setConversations],
  );

  const archiveConversation = useCallback(
    (id: string) => {
      const conversation = conversations.find((item) => item.id === id);
      if (!conversation) return;
      setConversations((current) => current.filter((item) => item.id !== id));
      setArchives((current) => [
        conversation,
        ...current.filter((item) => item.id !== id),
      ]);
    },
    [conversations, setArchives, setConversations],
  );

  const restoreConversation = useCallback(
    (id: string) => {
      const conversation = archives.find((item) => item.id === id);
      if (!conversation) return;
      setArchives((current) => current.filter((item) => item.id !== id));
      setConversations((current) => [
        conversation,
        ...current.filter((item) => item.id !== id),
      ]);
    },
    [archives, setArchives, setConversations],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((current) => current.filter((item) => item.id !== id));
      setArchives((current) => current.filter((item) => item.id !== id));
    },
    [setArchives, setConversations],
  );

  const lists = useMemo(
    () => ({ conversations, archives }),
    [archives, conversations],
  );
  const actions = useMemo(
    () => ({
      sendMessage,
      renameConversation,
      archiveConversation,
      restoreConversation,
      deleteConversation,
    }),
    [
      archiveConversation,
      deleteConversation,
      renameConversation,
      restoreConversation,
      sendMessage,
    ],
  );

  return (
    <ChatActionsContext.Provider value={actions}>
      <ChatListsContext.Provider value={lists}>
        {children}
      </ChatListsContext.Provider>
    </ChatActionsContext.Provider>
  );
}

export function useChatLists() {
  const lists = useContext(ChatListsContext);
  if (!lists) {
    throw new Error("useChatLists must be used within ChatDataProvider");
  }
  return lists;
}

export function useChatActions() {
  const actions = useContext(ChatActionsContext);
  if (!actions) {
    throw new Error("useChatActions must be used within ChatDataProvider");
  }
  return actions;
}
