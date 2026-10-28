import { plans } from "./data";
import type { PlanDefinition, PlanId } from "./types";

export function createId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

export function getPlanById(planId: PlanId): PlanDefinition | undefined {
  return plans.find((plan) => plan.id === planId);
}

export function formatPrice(cents: number) {
  if (!cents) return "¥0";
  return `¥${(cents / 100).toLocaleString("zh-CN")}`;
}

export function formatListTime(value: string) {
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (date.toDateString() === new Date(now.getTime() - 86400000).toDateString()) return "昨天";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}
