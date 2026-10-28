import { ShieldWarning, Warning } from "@phosphor-icons/react";
import { Button, Modal } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccountSession } from "../utils/accountSession";

export default function SecurityPage() {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <section aria-labelledby="security-title">
      <div className="border-b border-line pb-5">
        <h1 id="security-title" className="mb-0 mt-1 text-xl font-semibold ">
          账号安全
        </h1>
      </div>
      <div className="flex items-center gap-4 border-b border-line py-5">
        <div className="rounded-md p-2 bg-red-100 text-red-500">
          <ShieldWarning size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">注销账户</h2>
          <p className="text-xs leading-5 text-gray-400">
            结束当前演示账户会话，并清除本标签页保存的数据。
          </p>
        </div>
        <Button
          variant="filled"
          color="red"
          onClick={() => setConfirmOpen(true)}
        >
          注销账户
        </Button>
      </div>
      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="确认注销账户？"
        centered
        size="sm"
      >
        <div className="flex gap-3 mb-3">
          <div className="text-red-500 flex-shrink-0 p-1">
            <Warning size={20} />
          </div>
          <div>
            这会清除当前标签页中的对话、套餐和资料演示状态，并返回登录占位页。此操作无法撤销。
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="default" onClick={() => setConfirmOpen(false)}>
            取消
          </Button>
          <Button
            color="red"
            onClick={() => {
              setConfirmOpen(false);
              clearAccountSession();
              navigate("/login");
            }}
          >
            确认注销
          </Button>
        </div>
      </Modal>
    </section>
  );
}
