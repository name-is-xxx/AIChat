import { Badge, Button } from "@mantine/core";
import { Lightning, Sparkle } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPlanById } from "@/utils/utils.ts";
import { requireAccountSession } from "@/utils/accountSession";
import { green } from "@/theme/colors";

export default function TitleHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPlans = location.pathname === "/plans";
  const currentPlan = getPlanById(requireAccountSession().plan);

  return (
    <header className="flex z-10 h-16 items-center justify-between px-5 sm:px-10 border-b border-light">
      <div
        className="flex items-center gap-2 border-0 cursor-default"
        onClick={() => navigate("/")}
        aria-label="返回首页"
      >
        <span className="p-2 flex rounded-lg bg-light text-middleLight">
          <Sparkle size={20} />
        </span>
        morrow.
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="light"
          radius="lg"
          className={`h-full rounded-md px-2 py-1 text-center font-bold`}
          aria-label={`当前套餐 ${currentPlan?.name}`}
        >
          {currentPlan?.name}
        </Badge>
        <Button
          variant="filled"
          color={green.middleLight}
          onClick={() => {
            if (isPlans) {
              navigate("/");
              return;
            }
            navigate("/plans");
          }}
          leftSection={<Lightning size={15} />}
        >
          {isPlans ? "返回" : "充值"}
        </Button>
      </div>
    </header>
  );
}
