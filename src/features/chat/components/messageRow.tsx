import { ActionIcon, CopyButton } from "@mantine/core";
import { Check, Copy, Sparkle } from "@phosphor-icons/react";
import type { ChatMessage } from "../../../utils/types";
import { green } from "@/theme/colors";

function MessageRow({ message }: { message: ChatMessage }) {
  return (
    <article
      className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""} ${message.status === "streaming" ? "items-end" : "items-start"}`}
    >
      {message.role === "assistant" && (
        <div className="p-2 flex rounded-lg bg-light text-middleLight">
          <Sparkle size={14} />
        </div>
      )}
      <div
        className={`h-full break-words text-sm leading-7 space-y-2 ${message.role === "user" ? "rounded-xl rounded-br-sm border border-middleLight bg-light p-2.5" : ""}`}
      >
        {message.status === "streaming" ? (
          <div className="flex gap-1 p-2 text-end" aria-label="AI 正在回复">
            <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-middleLight" />
            <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-middleLight [animation-delay:100ms]" />
            <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-middleLight [animation-delay:200ms]" />
          </div>
        ) : (
          <p className="m-0 whitespace-pre-wrap">{message.content}</p>
        )}
        {message.role === "assistant" && message.status === "complete" && (
          <div className="flex items-center gap-2">
            <CopyButton value={message.content} timeout={2200}>
              {({ copied, copy }) => (
                <ActionIcon
                  color={green.middleLight}
                  title={copied ? "已复制" : "复制"}
                  aria-label={copied ? "已复制" : "复制消息"}
                  onClick={copy}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </ActionIcon>
              )}
            </CopyButton>
          </div>
        )}
      </div>
    </article>
  );
}

export default MessageRow;
