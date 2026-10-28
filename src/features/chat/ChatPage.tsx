import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { ArrowRight, Sparkle, List } from "@phosphor-icons/react";
import { starterPrompts } from "../../utils/data";
import type { Conversation } from "../../utils/types";
import ChatInput from "./components/chatInput";
import MessageRow from "./components/messageRow";
import { green } from "@/theme/colors";
import { Button } from "@mantine/core";

export default function ChatPage({
  conversation,
  input,
  setInput,
  onSend,
  onOpenHistory,
  inputRef,
}: {
  conversation: Conversation | null;
  input: string;
  setInput: (value: string) => void;
  onSend: (content: string) => void;
  onOpenHistory: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
}) {
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [, setMobileComposerFocused] = useState(false);
  useEffect(() => {
    if (conversation)
      chatScrollRef.current?.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [conversation?.id, conversation?.messages]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;
    onSend(input);
  }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      if (input.trim()) onSend(input);
    }
  }

  return (
    <div className="w-full h-full min-h-0 min-w-0 flex flex-col">
      <div className="w-full flex items-center gap-2">
        <Button
          variant="subtle"
          color={green.middleLight}
          onClick={onOpenHistory}
          className="sm:hidden px-2"
          aria-label="打开聊天记录"
        >
          <List size={18} />
        </Button>
        {conversation && (
          <h1 className="flex-1 truncate text-sm font-semibold py-3 border-b border-light">
            {conversation.title}
          </h1>
        )}
      </div>
      {conversation ? (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto" ref={chatScrollRef}>
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8 sm:gap-5 sm:px-4">
              {conversation.messages.map((message) => (
                <MessageRow message={message} key={message.id} />
              ))}
            </div>
          </div>
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={submit}
            onKeyDown={onKeyDown}
            inputRef={inputRef}
            setFocused={setMobileComposerFocused}
          />
        </>
      ) : (
        <div className="m-auto flex w-full max-w-2xl flex-col items-center px-6 py-10 text-center sm:px-4 sm:py-8">
          <div className="p-2 flex rounded-lg bg-light text-middleLight">
            <Sparkle size={24} />
          </div>
          <span className="block text-base font-bold leading-5 text-gray-400">
            A LITTLE SPACE TO THINK
          </span>
          <h1 className="mt-4 text-3xl font-semibold  sm:text-2xl">
            下午好，<span className="text-green">想聊点什么？</span>
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            灵感、问题，或者一个还没想清楚的念头。
          </p>
          <div className="mx-0 mb-4 mt-8 hidden w-full grid-cols-3 gap-3 sm:grid">
            {starterPrompts.map((prompt) => (
              <div
                className="flex items-center gap-3 rounded-lg p-3 text-left border border-middleLight hover:bg-light"
                key={prompt.title}
                onClick={() => onSend(prompt.text)}
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1 cursor-default">
                  <strong className="truncate text-xs text-dark">
                    {prompt.title}
                  </strong>
                  <small className="truncate text-xs text-middleLight">
                    {prompt.text}
                  </small>
                </span>
                <ArrowRight size={15} className="text-middleLight" />
              </div>
            ))}
          </div>
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={submit}
            onKeyDown={onKeyDown}
            inputRef={inputRef}
            setFocused={setMobileComposerFocused}
          />
        </div>
      )}
    </div>
  );
}
