import { ArrowLeft, Sparkle } from "@phosphor-icons/react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { demoProfile } from "../utils/data";
import { writeAccountSession } from "../utils/accountSession";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col">
      <header className="flex h-16 items-center justify-between px-5 sm:px-10 border-b border-light">
        <div className="flex items-center gap-2 border-0 cursor-default">
          <span className="p-2 flex rounded-lg bg-light text-middleLight">
            <Sparkle size={20} />
          </span>
          morrow.
        </div>
      </header>
      <main className="fex-1 m-auto flex flex-col items-center justify-center gap-3">
        <h1 className="text-xl">登录占位页</h1>
        <p className="text-sm leading-6 text-gray-400">
          演示账户已退出。真实登录功能尚未接入。
        </p>
        <Button
          leftSection={<ArrowLeft size={15} />}
          onClick={() => {
            writeAccountSession({ ...demoProfile });
            navigate("/");
          }}
        >
          返回首页演示
        </Button>
      </main>
    </div>
  );
}
