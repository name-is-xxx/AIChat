import { Avatar, Button, Input, Menu, Modal, TextInput } from "@mantine/core";
import {
  Archive,
  Check,
  ChatCenteredText,
  DotsThree,
  GearSix,
  Pencil,
  MagnifyingGlass,
  Trash,
  SignOut,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChatActions } from "../features/chat/ChatDataProvider";
import { formatListTime } from "../utils/utils";
import type { Conversation } from "../utils/types";
import { green } from "@/theme/colors.ts";
import {
  clearAccountSession,
  requireAccountSession,
} from "../utils/accountSession";

function SideBar({
  conversations,
  activeConversationId,
  actions,
  isOpen,
  onNew,
  onSelect,
}: {
  conversations: Conversation[];
  activeConversationId?: string;
  actions: ChatActions;
  isOpen: boolean;
  onNew: () => void;
  onSelect: (id: string) => void;
}) {
  const navigate = useNavigate();
  const account = requireAccountSession();
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const pendingConversation = conversations.find(
    (conversation) => conversation.id === pendingDelete,
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleConversations = normalizedQuery
    ? conversations.filter((conversation) =>
        conversation.title.toLocaleLowerCase().includes(normalizedQuery),
      )
    : conversations;

  function saveRename() {
    if (!editingId) return;
    if (!actions.renameConversation(editingId, draftTitle)) {
      setRenameError("标题不能为空");
      return;
    }
    setEditingId(null);
    setRenameError(null);
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex h-full w-[278px] min-w-64 min-h-0 flex-col gap-3 overflow-hidden border-r border-light bg-white p-4 transition-transform sm:static sm:z-auto sm:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <Button
        variant="subtle"
        color={green.middleLight}
        leftSection={<ChatCenteredText size={16} />}
        onClick={onNew}
        classNames={{
          inner: "w-full justify-start",
        }}
      >
        新对话
      </Button>
      <Input
        color={green.middleLight}
        radius="lg"
        rightSectionPointerEvents="all"
        leftSection={<MagnifyingGlass size={15} />}
        rightSection={
          query ? (
            <Input.ClearButton
              aria-label="清除搜索"
              onClick={() => setQuery("")}
            />
          ) : null
        }
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder="搜索对话"
        aria-label="搜索聊天记录"
      />
      <div className="min-h-0 flex-1 overflow-auto p-2 space-y-2 [scrollbar-color:#d3d5cc_transparent] [scrollbar-width:thin]">
        <h4 className="font-semibold text-gray-400">历史对话</h4>
        {visibleConversations.length ? (
          visibleConversations.map((conversation) => (
            <div
              className={`flex min-h-12 items-center rounded-md ${conversation.id === activeConversationId ? "bg-light" : "hover:bg-middleLight"}`}
              key={conversation.id}
            >
              {editingId === conversation.id ? (
                <form
                  className="flex w-full items-start gap-1 p-1"
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveRename();
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <TextInput
                      size="xs"
                      autoFocus
                      value={draftTitle}
                      onChange={(event) =>
                        setDraftTitle(event.currentTarget.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setEditingId(null);
                          setRenameError(null);
                        }
                      }}
                      error={renameError}
                      aria-label="重命名会话"
                    />
                  </div>
                  <button
                    className="grid h-8 w-8 flex-none place-items-center rounded-md border-0 bg-transparent text-green hover:bg-[#eef2eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-green"
                    type="submit"
                    aria-label="保存名称"
                    title="保存名称"
                  >
                    <Check size={15} />
                  </button>
                  <button
                    className="grid h-8 w-8 flex-none place-items-center rounded-md border-0 bg-transparent text-gray-400 hover:bg-[#f1f2ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-green"
                    type="button"
                    aria-label="取消重命名"
                    title="取消"
                    onClick={() => {
                      setEditingId(null);
                      setRenameError(null);
                    }}
                  >
                    <X size={15} />
                  </button>
                </form>
              ) : (
                <>
                  <button
                    className="flex min-h-11 min-w-0 flex-1 flex-col items-start justify-center gap-1 overflow-hidden border-0 bg-transparent px-2 py-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-green"
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                  >
                    <span className="w-full truncate text-sm">
                      {conversation.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatListTime(conversation.updatedAt)}
                    </span>
                  </button>
                  <Menu position="bottom-end" withinPortal width={150}>
                    <Menu.Target>
                      <button
                        className="rounded-md bg-transparent mx-2"
                        type="button"
                        aria-label={`更多会话操作：${conversation.title}`}
                        title="更多操作"
                      >
                        <DotsThree size={17} />
                      </button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<Pencil size={14} />}
                        onClick={() => {
                          setEditingId(conversation.id);
                          setDraftTitle(conversation.title);
                          setRenameError(null);
                        }}
                      >
                        重命名
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<Archive size={14} />}
                        onClick={() => {
                          actions.archiveConversation(conversation.id);
                          if (activeConversationId === conversation.id) {
                            navigate("/");
                          }
                        }}
                      >
                        归档
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<Trash size={14} />}
                        onClick={() => setPendingDelete(conversation.id)}
                      >
                        删除
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 px-3 text-xs text-gray-400">
            <MagnifyingGlass size={17} />
            <span>{query ? "没有找到相关对话" : "还没有历史对话"}</span>
          </div>
        )}
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar color={green.middleLight} radius="xl">
            {account.name.slice(0, 1)}
          </Avatar>
          <strong>{account.name}</strong>
        </div>
        <Menu position="top-end">
          <Menu.Target>
            <DotsThree size={24} />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<GearSix size={15} />}
              onClick={() => navigate("/settings/profile")}
            >
              设置
            </Menu.Item>
            <Menu.Item
              leftSection={<SignOut size={15} />}
              onClick={() => {
                clearAccountSession();
                navigate("/login");
              }}
            >
              退出登录
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <Modal
        opened={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="删除这段对话？"
        centered
        size="sm"
      >
        <p className="text-sm leading-6 text-[#646960]">
          “{pendingConversation?.title}”将从聊天记录中移除，且无法恢复。
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="default" onClick={() => setPendingDelete(null)}>
            取消
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              if (pendingDelete) {
                actions.deleteConversation(pendingDelete);
                if (activeConversationId === pendingDelete) navigate("/");
              }
              setPendingDelete(null);
            }}
          >
            删除对话
          </Button>
        </div>
      </Modal>
    </aside>
  );
}

export default SideBar;
