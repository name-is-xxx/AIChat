import { ArrowCounterClockwise, Trash } from "@phosphor-icons/react";
import { ActionIcon, Button, Modal, Pagination } from "@mantine/core";
import { useState } from "react";
import { formatListTime } from "../utils/utils";
import { useChatActions, useChatLists } from "./chat/ChatDataProvider";

const PAGE_SIZE = 10;

export default function ArchivePage() {
  const { archives } = useChatLists();
  const actions = useChatActions();
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(archives.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const items = archives.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const pending = archives.find((item) => item.id === pendingDelete);

  return (
    <section aria-labelledby="archive-title" className="space-y-2">
      <div className="border-b border-line py-5">
        <h1 id="archive-title" className="text-xl font-semibold">
          归档列表
        </h1>
      </div>
      <div className="h-full divide-y divide-line border-y border-line">
        {items.length ? (
          items.map((conversation) => (
            <div className="flex items-center gap-3 p-3" key={conversation.id}>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm">{conversation.title}</p>
                <span className="block text-xs text-gray-400">
                  {formatListTime(conversation.updatedAt)}
                </span>
              </div>
              <Button
                variant="default"
                size="compact-sm"
                leftSection={<ArrowCounterClockwise size={14} />}
                onClick={() => actions.restoreConversation(conversation.id)}
              >
                恢复
              </Button>
              <ActionIcon
                variant="subtle"
                color="red"
                aria-label={`删除归档对话：${conversation.title}`}
                title="删除"
                onClick={() => setPendingDelete(conversation.id)}
              >
                <Trash size={16} />
              </ActionIcon>
            </div>
          ))
        ) : (
          <div className="grid min-h-48 place-items-center px-4 text-sm text-gray-400">
            还没有归档的对话
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 py-4">
        <Pagination total={totalPages} value={currentPage} onChange={setPage} />
      </div>
      <Modal
        opened={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="删除归档对话？"
        centered
        size="sm"
      >
        <p className="text-sm leading-6">
          “{pending?.title}”将被永久删除，且无法恢复。
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="default" onClick={() => setPendingDelete(null)}>
            取消
          </Button>
          <Button
            color="red"
            onClick={() => {
              if (pendingDelete) actions.deleteConversation(pendingDelete);
              setPendingDelete(null);
            }}
          >
            删除
          </Button>
        </div>
      </Modal>
    </section>
  );
}
