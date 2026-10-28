import type { FormEvent, KeyboardEvent, RefObject } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { ActionIcon } from "@mantine/core";
import { green } from "@/theme/colors";

function ChatInput({
  input,
  setInput,
  onSubmit,
  onKeyDown,
  inputRef,
  setFocused,
}: {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  setFocused: (focused: boolean) => void;
}) {
  return (
    <>
      <form
        className="mx-auto my-3 w-full max-w-2xl p-2 space-y-2 rounded-lg border border-middleLight"
        onSubmit={onSubmit}
      >
        <textarea
          className="block min-h-12 w-full resize-y border-0 bg-transparent text-[13px] leading-6  outline-none placeholder:text-[#a0a39b]"
          ref={inputRef}
          value={input}
          rows={2}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="发消息给 Morrow…"
          aria-label="输入消息"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            AI 生成的内容可能不准确，请自行判断。
          </span>
          <ActionIcon
            variant="filled"
            color={green.middle}
            radius="lg"
            type="submit"
            disabled={!input.trim()}
            aria-label="发送消息"
          >
            <PaperPlaneTilt />
          </ActionIcon>
        </div>
      </form>
    </>
  );
}

export default ChatInput;
