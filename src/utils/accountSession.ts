import type { AccountSession, PlanId } from "./types";

export const ACCOUNT_SESSION_KEY = "morrow.profile";

const planIds: PlanId[] = ["free", "plus", "pro", "max"];

export function readAccountSession(): AccountSession | null {
  try {
    const stored = window.sessionStorage.getItem(ACCOUNT_SESSION_KEY);
    if (!stored) return null;

    const value: unknown = JSON.parse(stored);
    if (
      !value ||
      typeof value !== "object" ||
      !("name" in value) ||
      typeof value.name !== "string" ||
      !("userName" in value) ||
      typeof value.userName !== "string" ||
      !("email" in value) ||
      typeof value.email !== "string" ||
      !("phone" in value) ||
      typeof value.phone !== "string" ||
      !("plan" in value) ||
      typeof value.plan !== "string" ||
      !planIds.includes(value.plan as PlanId)
    ) {
      return null;
    }

    return value as AccountSession;
  } catch {
    return null;
  }
}

export function requireAccountSession(): AccountSession {
  const profile = readAccountSession();
  if (!profile) throw new Error("Account session is missing or invalid");
  return profile;
}

export function writeAccountSession(profile: AccountSession) {
  window.sessionStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(profile));
}

export function clearAccountSession() {
  window.sessionStorage.removeItem(ACCOUNT_SESSION_KEY);
}
