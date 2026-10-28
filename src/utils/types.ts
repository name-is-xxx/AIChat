export type PlanId = "free" | "plus" | "pro" | "max";
export type Role = "user" | "assistant";
export type MessageStatus = "complete" | "streaming";
export type PaymentMethod = "wechat" | "alipay";
export type SubscriptionStatus = "active" | "expired";
export type Page = "chat" | "plans" | "settings";

export interface AccountSession {
  name: string;
  userName: string;
  email?: string;
  phone?: string;
  plan: PlanId;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  title: string;
  preview?: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  monthlyPriceCents: number;
  monthlyMessageLimit?: number;
  dailyMessageLimit?: number;
  benefits: string[];
  describe: string;
  color: {
    light: string;
    dark: string;
  };
}

export interface Subscription {
  status: SubscriptionStatus;
  startedAt: string | null;
  renewsAt: string | null;
  autoRenew: boolean;
}

export interface SubscriptionOrder {
  id: string;
  planId: Exclude<PlanId, "free">;
  amountCents: number;
  method: PaymentMethod;
  status: "processing" | "success";
  createdAt: string;
  periodEndsAt: string;
}
