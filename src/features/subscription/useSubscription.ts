import { useEffect, useState } from "react";
import type {
  PaymentMethod,
  PlanId,
  Subscription,
  SubscriptionOrder,
} from "../../utils/types";
import { plans } from "../../utils/data";
import { createId } from "../../utils/utils";
import { useSessionState } from "../../utils/useSessionState";
import {
  requireAccountSession,
  writeAccountSession,
} from "../../utils/accountSession";

export function useSubscription() {
  const [account, setAccount] = useState(requireAccountSession);
  const [subscriptionDetails, setSubscriptionDetails] = useSessionState<Subscription>(
    "morrow.subscription",
    {
      status: "active",
      startedAt: null,
      renewsAt: null,
      autoRenew: false,
    },
  );
  const [orders, setOrders] = useSessionState<SubscriptionOrder[]>(
    "morrow.orders",
    [],
  );
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(() =>
    account.plan === "free" ? "plus" : account.plan,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wechat");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle");
  const [purchaseConsent, setPurchaseConsent] = useState(false);
  const subscription = { ...subscriptionDetails, planId: account.plan };
  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[1];
  const currentPlan =
    plans.find((plan) => plan.id === account.plan) ?? plans[0];

  useEffect(() => {
    const refreshAccount = () => setAccount(requireAccountSession());
    window.addEventListener("morrow:subscription-expired", refreshAccount);
    return () =>
      window.removeEventListener("morrow:subscription-expired", refreshAccount);
  }, []);

  useEffect(() => {
    if (paymentStatus !== "processing") return;
    if (selectedPlanId === "free" || selectedPlanId === account.plan) {
      setPaymentStatus("idle");
      return;
    }
    const timer = window.setTimeout(() => {
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + 30);
      const endAt = periodEnd.toISOString();
      const order: SubscriptionOrder = {
        id: createId("order"),
        planId: selectedPlanId as Exclude<PlanId, "free">,
        amountCents: selectedPlan.monthlyPriceCents,
        method: paymentMethod,
        status: "success",
        createdAt: now.toISOString(),
        periodEndsAt: endAt,
      };
      const nextAccount = { ...account, plan: selectedPlanId };
      writeAccountSession(nextAccount);
      setAccount(nextAccount);
      setSubscriptionDetails({
        status: "active",
        startedAt: now.toISOString(),
        renewsAt: endAt,
        autoRenew: false,
      });
      setOrders((current) => [order, ...current]);
      setPaymentStatus("success");
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [
    paymentMethod,
    paymentStatus,
    selectedPlan.monthlyPriceCents,
    selectedPlanId,
    account,
  ]);

  function openPlans() {
    setPaymentStatus("idle");
    setPurchaseConsent(false);
    setSelectedPlanId(account.plan !== "free" ? account.plan : "plus");
  }

  function choosePlan(id: PlanId) {
    setSelectedPlanId(id);
    setPurchaseConsent(false);
    setPaymentStatus("idle");
  }

  function startPayment() {
    if (
      selectedPlanId === "free" ||
      selectedPlanId === account.plan ||
      !purchaseConsent
    ) {
      return;
    }
    setPaymentStatus("processing");
  }

  return {
    subscription,
    orders,
    selectedPlanId,
    selectedPlan,
    currentPlan,
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    setPaymentStatus,
    purchaseConsent,
    setPurchaseConsent,
    startPayment,
    openPlans,
    choosePlan,
  };
}
