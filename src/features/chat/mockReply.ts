export function mockReply(prompt: string) {
  const question = prompt.toLowerCase();
  if (question.includes("诗") || question.includes("写")) return "当然。\n\n春风把窗沿擦亮，\n树梢替天空写下新的句子。\n而我只想在这样的午后，\n慢一点，再慢一点。\n\n想要更轻快、俏皮一点的版本吗？";
  if (question.includes("黑洞")) return "可以把黑洞想象成一口特别深的井：一旦东西掉到某个边界以内，就连光也很难爬出来。这个边界叫「事件视界」。\n\n它并不是宇宙里的洞，而是一片质量非常集中的区域，把周围的时空弯曲得很厉害。";
  if (question.includes("待办") || question.includes("安排")) return "可以先把今天的事情分成三类：必须完成、最好完成、可以往后放。先挑出最重要的一件，在精力最好的时候处理；零碎的小事集中安排在一起，中间也留一点缓冲时间。\n\n如果你把待办发给我，我可以继续帮你排出具体顺序。";
  return `关于「${prompt.slice(0, 36)}${prompt.length > 36 ? "…" : ""}」，我会先从目标和限制条件两方面梳理。\n\n一个简单的开始是：明确你最想解决的问题，再把它拆成几个可以行动的小步骤。你也可以告诉我更多背景，我会据此给出更具体的建议。`;
}
