import type {
  AccountSession,
  Conversation,
  PlanDefinition,
  PlanId,
} from "./types";
import { green, orange, blue, purple } from "@/theme/colors.ts";

function offsetTime(dayOffset: number, hour: number, minute: number) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const plans: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    monthlyPriceCents: 0,
    dailyMessageLimit: 30,
    describe: "轻量体验，随时开始",
    benefits: ["基础模型", "每日 30 次对话", "标准响应速度"],
    color: { light: green.light, dark: green.dark },
  },
  {
    id: "plus",
    name: "Plus",
    monthlyPriceCents: 3900,
    monthlyMessageLimit: 5000,
    describe: "更从容的日常创作",
    benefits: ["高级模型", "每月 5,000 次对话", "更快响应速度"],
    color: { light: orange.light, dark: orange.dark },
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPriceCents: 9900,
    monthlyMessageLimit: 20000,
    describe: "适合高频深度使用",
    benefits: ["更多模型与上下文", "每月 20,000 次对话", "高峰优先响应"],
    color: { light: blue.light, dark: blue.dark },
  },
  {
    id: "max",
    name: "Max",
    monthlyPriceCents: 19900,
    describe: "完整释放创作空间",
    benefits: ["优先响应与更大额度", "对话次数不限", "全部模型与上下文"],
    color: { light: purple.light, dark: purple.dark },
  },
];

export const starterPrompts = [
  { title: "灵感写作", text: "帮我写一段关于春天的短诗" },
  { title: "学习新知", text: "用简单的例子解释什么是黑洞" },
  { title: "整理思路", text: "帮我把今天的待办安排得更合理" },
];

export const seedConversations: Conversation[] = [
  {
    id: "chat-01",
    title: "给周末的杭州散步做个计划",
    updatedAt: offsetTime(0, 10, 24),
    messages: [
      {
        id: "msg-01a",
        role: "user",
        content: "给周末的杭州散步做个计划",
        createdAt: offsetTime(0, 10, 21),
        status: "complete",
      },
      {
        id: "msg-01b",
        role: "assistant",
        content:
          "可以从湖滨步行到北山街，沿途慢慢逛。上午在湖滨银泰附近喝杯咖啡，中午绕开人多的断桥，沿着白堤走到孤山；下午找间临湖的小店坐一会儿，傍晚再看日落。整段路线约 6 公里，不赶时间刚刚好。",
        createdAt: offsetTime(0, 10, 24),
        status: "complete",
      },
    ],
  },
  {
    id: "chat-02",
    title: "把这段英文改得自然一点",
    updatedAt: offsetTime(-1, 18, 42),
    messages: [
      {
        id: "msg-02a",
        role: "user",
        content:
          "把这段英文改得自然一点：I am looking forward to meeting you and discuss the plan.",
        createdAt: offsetTime(-1, 18, 40),
        status: "complete",
      },
      {
        id: "msg-02b",
        role: "assistant",
        content:
          "可以这样说：“I’m looking forward to meeting you and discussing the plan.”\n\n这里把 discuss 改成 discussing，是因为它和前面的 meeting 并列，都接在 look forward to 后面。",
        createdAt: offsetTime(-1, 18, 42),
        status: "complete",
      },
    ],
  },
  {
    id: "chat-03",
    title: "轻薄笔记本怎么选",
    updatedAt: offsetTime(-4, 15, 6),
    messages: [
      {
        id: "msg-03a",
        role: "user",
        content: "轻薄笔记本怎么选？主要是写文档和剪一点短视频。",
        createdAt: offsetTime(-4, 15, 4),
        status: "complete",
      },
      {
        id: "msg-03b",
        role: "assistant",
        content:
          "你的使用场景可以优先看屏幕、续航和内存。16GB 内存是比较稳妥的起点；如果短视频只是偶尔剪辑，集成显卡通常够用，把预算留给更好的屏幕和轻一点的机身会更实在。",
        createdAt: offsetTime(-4, 15, 6),
        status: "complete",
      },
    ],
  },
];

export const seedArchivedConversations: Conversation[] = [
  "周末的杭州散步计划",
  "自然英文表达练习",
  "轻薄笔记本选购建议",
  "一周工作安排整理",
  "给朋友的生日祝福",
  "阳台绿植养护方法",
  "三天两夜旅行清单",
  "会议纪要提炼重点",
  "晚餐菜单灵感",
  "个人阅读计划",
].map((title, index) => {
  const updatedAt = offsetTime(-index - 2, 11, 20);
  return {
    id: `chat-archive-${index + 1}`,
    title,
    updatedAt,
    messages: [
      {
        id: `msg-0${index + 1}a`,
        role: "user",
        content: title,
        createdAt: updatedAt,
        status: "complete",
      },
      {
        id: `msg-0${index + 1}b`,
        role: "assistant",
        content: "这是一段已归档的演示对话记录。",
        createdAt: updatedAt,
        status: "complete",
      },
    ],
  };
});

export const demoProfile: AccountSession = {
  name: "林知夏",
  userName: "林知夏",
  email: "lin.zhixia@example.com",
  phone: "138****2048",
  plan: "free" as PlanId,
};
