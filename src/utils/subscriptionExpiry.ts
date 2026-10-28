import { readAccountSession, writeAccountSession } from "./accountSession";
import type { Subscription } from "./types";

const SUBSCRIPTION_KEY = "morrow.subscription";

function readSubscription(): Subscription | null {
  try {
    const value: unknown = JSON.parse(
      window.sessionStorage.getItem(SUBSCRIPTION_KEY) ?? "null",
    );
    if (!value || typeof value !== "object") return null;
    return value as Subscription;
  } catch {
    return null;
  }
}

export function syncExpiredSubscription(now = Date.now()): boolean {
  const account = readAccountSession();
  const subscription = readSubscription();
  const expiry = subscription?.renewsAt
    ? Date.parse(subscription.renewsAt)
    : NaN;

  if (
    !account ||
    account.plan === "free" ||
    subscription?.status !== "active" ||
    !Number.isFinite(expiry) ||
    expiry > now
  ) {
    return false;
  }

  writeAccountSession({ ...account, plan: "free" });
  window.sessionStorage.setItem(
    SUBSCRIPTION_KEY,
    JSON.stringify({ ...subscription, status: "expired", autoRenew: false }),
  );
  window.dispatchEvent(new Event("morrow:subscription-expired"));
  return true;
}
