import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "@/components/sideBar";
import { useChatActions, useChatLists } from "./ChatDataProvider";
import ChatPage from "./ChatPage";

export default function ChatIndex() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { conversations, archives } = useChatLists();
  const actions = useChatActions();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const activeConversation =
    [...conversations, ...archives].find(
      (conversation) => conversation.id === id,
    ) ?? null;

  function sendMessage(content: string) {
    const conversationId = actions.sendMessage(content, id);
    if (conversationId) navigate(`/${conversationId}`);
    setInput("");
  }

  function startNew() {
    setInput("");
    setHistoryOpen(false);
    navigate("/");
    window.setTimeout(() => inputRef.current?.focus(), 20);
  }
  function selectConversation(id: string) {
    setHistoryOpen(false);
    navigate(`/${id}`);
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <SideBar
        conversations={conversations}
        activeConversationId={id}
        actions={actions}
        isOpen={historyOpen}
        onNew={startNew}
        onSelect={selectConversation}
      />
      {historyOpen && (
        <button
          type="button"
          className="fixed inset-0 z-10 bg-black/30 sm:hidden"
          aria-label="关闭聊天记录"
          onClick={() => setHistoryOpen(false)}
        />
      )}
      <ChatPage
        conversation={activeConversation}
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        onOpenHistory={() => setHistoryOpen(true)}
        inputRef={inputRef}
      />
    </div>
  );
}
