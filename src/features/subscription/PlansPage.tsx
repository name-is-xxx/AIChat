import { Button, Checkbox, Modal } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  Check,
  CheckCircle,
  Lightning,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";
import type { PlanDefinition } from "../../utils/types";
import { plans } from "../../utils/data";
import { formatDate, formatPrice } from "../../utils/utils";
import { useSubscription } from "./useSubscription";

type SubscriptionState = ReturnType<typeof useSubscription>;

export default function PlansPage() {
  const state = useSubscription();
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const onBack = () => navigate("/");

  useEffect(() => {
    centerPlan(state.selectedPlanId, false);
  }, []);

  useEffect(() => {
    if (state.paymentStatus === "success") setCheckoutOpen(false);
  }, [state.paymentStatus]);

  function centerPlan(planId: PlanDefinition["id"], smooth = true) {
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    const selected = carouselRef.current?.querySelector<HTMLElement>(
      `[data-plan-id="${planId}"]`,
    );
    selected?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "nearest",
      inline: "center",
    });
  }

  function selectPlan(planId: PlanDefinition["id"], openCheckout = false) {
    state.choosePlan(planId);
    centerPlan(planId);
    if (openCheckout && planId !== "free" && planId !== state.subscription.planId)
      setCheckoutOpen(true);
  }

  function moveCarousel(direction: -1 | 1) {
    const currentIndex = plans.findIndex(
      (plan) => plan.id === state.selectedPlanId,
    );
    const next =
      plans[Math.max(0, Math.min(plans.length - 1, currentIndex + direction))];
    if (!next || next.id === state.selectedPlanId) return;
    selectPlan(next.id);
  }

  function selectNearestPlan() {
    const track = carouselRef.current;
    if (!track) return;
    const trackCenter =
      track.getBoundingClientRect().left + track.clientWidth / 2;
    const slides = Array.from(
      track.querySelectorAll<HTMLElement>("[data-plan-id]"),
    );
    const nearest = slides.reduce<HTMLElement | null>((current, slide) => {
      if (!current) return slide;
      const currentDistance = Math.abs(
        current.getBoundingClientRect().left +
          current.offsetWidth / 2 -
          trackCenter,
      );
      const slideDistance = Math.abs(
        slide.getBoundingClientRect().left +
          slide.offsetWidth / 2 -
          trackCenter,
      );
      return slideDistance < currentDistance ? slide : current;
    }, null);
    const planId = nearest?.dataset.planId as PlanDefinition["id"] | undefined;
    if (planId && planId !== state.selectedPlanId) state.choosePlan(planId);
  }

  return (
    <main className="h-full min-w-0 overflow-y-auto bg-[#fbfbf9]">
      {state.paymentStatus === "success" ? (
        <PurchaseSuccess state={state} onBack={onBack} />
      ) : (
        <div className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8 sm:py-9">
          <section className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.12em] text-gray-400">
              A PLAN FOR EVERY POSSIBILITY
            </span>
            <h1 className="m-0 text-2xl font-semibold leading-tight text-green-sage sm:text-3xl">
              选择适合你的套餐。
            </h1>
            <p className="m-0 text-sm leading-6 text-gray-400">
              从轻量体验，到完整释放每一个想法。
            </p>
          </section>

          <div className="relative mt-7">
            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4"
              onScroll={selectNearestPlan}
              aria-label="选择套餐，可左右滑动浏览"
              role="group"
            >
              <div
                aria-hidden="true"
                className="flex-none sm:hidden"
                style={{
                  flexBasis: "calc((100% - min(60vw, 320px) - 24px) / 2)",
                }}
              />
              {plans.map((plan) => (
                <div
                  className="w-[min(72vw,320px)] flex-none snap-center sm:w-auto"
                  data-plan-id={plan.id}
                  key={plan.id}
                >
                  <PlanCard
                    plan={plan}
                    current={state.subscription.planId === plan.id}
                    selected={state.selectedPlanId === plan.id}
                    onClick={() => selectPlan(plan.id, true)}
                  />
                </div>
              ))}
              <div
                aria-hidden="true"
                className="flex-none sm:hidden"
                style={{
                  flexBasis: "calc((100% - min(60vw, 320px) - 24px) / 2)",
                }}
              />
            </div>
            <button
              className="absolute left-0 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/95 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-green disabled:opacity-40 sm:hidden"
              onClick={() => moveCarousel(-1)}
              disabled={state.selectedPlanId === plans[0].id}
              aria-label="上一个套餐"
              type="button"
            >
              <CaretLeft size={17} />
            </button>
            <button
              className="absolute right-0 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/95 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-green disabled:opacity-40 sm:hidden"
              onClick={() => moveCarousel(1)}
              disabled={state.selectedPlanId === plans[plans.length - 1].id}
              aria-label="下一个套餐"
              type="button"
            >
              <CaretRight size={17} />
            </button>
          </div>

          <div className="mx-auto mt-3 flex w-full max-w-2xl flex-wrap justify-between gap-x-4 gap-y-1 text-[10px] leading-5 text-gray-400">
            <span>套餐权益为演示内容，使用次数不会实际限制模拟对话。</span>
            <span>一次付款有效 30 天，到期后自动转为 Free。</span>
          </div>
        </div>
      )}
      <Modal
        opened={checkoutOpen}
        onClose={() => {
          if (state.paymentStatus !== "processing") setCheckoutOpen(false);
        }}
        title="完成订阅"
        centered
        size="sm"
        closeOnClickOutside={state.paymentStatus !== "processing"}
        closeOnEscape={state.paymentStatus !== "processing"}
      >
        {state.paymentStatus === "processing" ? (
          <ProcessingOverlay
            onCancel={() => {
              state.setPaymentStatus("idle");
              setCheckoutOpen(false);
            }}
          />
        ) : (
          <CheckoutPanel state={state} />
        )}
      </Modal>
    </main>
  );
}

function PlanCard({
  plan,
  current,
  selected,
  onClick,
}: {
  plan: PlanDefinition;
  current: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <article
      className={`flex min-h-[350px] w-full min-w-0 flex-col rounded-lg border p-4 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-green ${current ? "cursor-default" : "cursor-pointer"} ${selected ? "border-green bg-[#f6f9f4] shadow-[0_5px_18px_#52775912]" : "border-line bg-white hover:border-sage"}`}
      onClick={() => {
        if (!current) onClick();
      }}
      aria-label={`${plan.name} 套餐`}
      role="group"
    >
      <div className="flex h-8 flex-none items-center justify-between gap-2">
        <span
          className={`grid h-8 w-8 place-items-center rounded-md 
            ${
              plan.id === "plus"
                ? "bg-sky-50 text-blue"
                : plan.id === "pro"
                  ? "bg-orange-50 text-[#aa8059]"
                  : plan.id === "max"
                    ? "bg-violet-50 text-violet-700"
                    : "bg-green-soft text-green"
            }`}
        >
          <Sparkle size={16} />
        </span>
        {current ? (
          <span className="text-[10px] font-semibold text-green">当前套餐</span>
        ) : (
          selected && (
            <span className="text-[10px] font-semibold text-green">已选择</span>
          )
        )}
      </div>
      <div className="mt-3 flex min-w-0 items-center gap-2">
        <h2 className="m-0 truncate text-[17px] font-semibold ">{plan.name}</h2>
        {plan.id === "max" && (
          <span className="inline-flex items-center gap-1 text-[8px] font-bold text-[#8b7449]">
            <Lightning size={11} /> MAX
          </span>
        )}
      </div>
      <p className="mb-3 mt-1 min-h-5 text-xs leading-5 text-gray-400">
        {plan.describe}
      </p>
      <div className="flex items-baseline gap-1">
        <strong className="text-2xl font-semibold ">
          {formatPrice(plan.monthlyPriceCents)}
        </strong>
        <span className="text-xs text-gray-400">
          {plan.monthlyPriceCents ? "/ 月" : "/ 永久"}
        </span>
      </div>
      <div className="my-3 h-px bg-[#ecece6]" />
      <ul className="m-0 grid list-none gap-2 p-0">
        {plan.benefits.map((benefit) => (
          <li
            className="flex items-start gap-2 text-xs leading-5 text-[#555c52]"
            key={benefit}
          >
            <Check size={13} className="flex-none text-sage" />
            {benefit}
          </li>
        ))}
      </ul>
      <Button
        className={`mt-auto min-h-10 w-full rounded-md text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green ${current ? "border border-line bg-[#f2f3ef] text-gray-400" : selected ? "bg-green text-white hover:bg-green-dark" : "border border-sage bg-white text-green hover:bg-green-soft"}`}
        disabled={current || plan.id === "free"}
        aria-pressed={selected}
        onClick={(event) => {
          event.stopPropagation();
          if (!current) onClick();
        }}
        variant={current ? "default" : "filled"}
        type="button"
      >
        {current ? "当前套餐" : plan.id === "free" ? "免费套餐" : "立即购买"}
      </Button>
    </article>
  );
}

function CheckoutPanel({ state }: { state: SubscriptionState }) {
  const {
    selectedPlan,
    paymentMethod,
    setPaymentMethod,
    purchaseConsent,
    setPurchaseConsent,
  } = state;
  return (
    <section className="col-span-2 min-w-0 rounded-lg border border-line bg-white p-5 sm:col-auto sm:p-4">
      <div className="flex items-center justify-between border-b border-[#efefe9] pb-4">
        <div>
          <span className="block text-[10px] font-bold text-gray-400">
            SECURE CHECKOUT
          </span>
          <h2 className="mb-0 mt-1 text-[17px] font-semibold">完成订阅</h2>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] text-green">
          <ShieldCheck size={14} /> 安全支付
        </div>
      </div>
      <div className="flex items-center gap-3 py-4">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-green-soft text-green">
          <Sparkle size={18} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <strong className="text-xs">{selectedPlan.name} 套餐</strong>
          <span className="text-[10px] text-gray-400">
            单次付款，有效期 30 天
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <strong className="text-lg">
            {formatPrice(selectedPlan.monthlyPriceCents)}
          </strong>
          <span className="text-[10px] text-gray-400">/ 月</span>
        </div>
      </div>
      <div className="mb-2 mt-1 text-[11px] font-semibold text-[#666b62]">
        付款方式
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
        <PaymentOption
          method="wechat"
          label="微信支付"
          selected={paymentMethod === "wechat"}
          onClick={() => setPaymentMethod("wechat")}
        />
        <PaymentOption
          method="alipay"
          label="支付宝"
          selected={paymentMethod === "alipay"}
          onClick={() => setPaymentMethod("alipay")}
        />
      </div>
      <Checkbox
        className="mt-3"
        classNames={{ label: "text-[10px] leading-5 text-[#6f746b]" }}
        checked={purchaseConsent}
        onChange={(event) => setPurchaseConsent(event.currentTarget.checked)}
        color="#64845e"
        size="xs"
        label={
          <span>
            我同意{" "}
            <strong>{formatPrice(selectedPlan.monthlyPriceCents)}/月</strong>{" "}
            单次付款开通 {selectedPlan.name} 套餐，有效期 30 天，到期后自动转为 Free。
          </span>
        }
      />
      <Button
        className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-green px-4 text-xs font-semibold text-white hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-45"
        disabled={
          selectedPlan.id === "free" ||
          selectedPlan.id === state.subscription.planId ||
          !purchaseConsent
        }
        onClick={state.startPayment}
      >
        <span>确认订阅</span>
        <strong className="ml-auto text-[11px]">
          {formatPrice(selectedPlan.monthlyPriceCents)} / 月
        </strong>
        <ArrowRight size={16} />
      </Button>
      <div className="mt-2 flex items-center justify-center gap-1.5 text-[9px] text-gray-400">
        <ShieldCheck size={13} /> 本 Demo 为模拟订阅，不会产生真实扣款。
      </div>
    </section>
  );
}

function PaymentOption({
  method,
  label,
  selected,
  onClick,
}: {
  method: "wechat" | "alipay";
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      className={`flex min-h-11 min-w-0 items-center gap-2 rounded-md border px-2.5 py-2 text-left text-[11px] ${selected ? "border-sage bg-[#f8faf6]" : "border-[#e7e8e1] bg-white"}`}
      onClick={onClick}
    >
      <span
        className={`grid h-6 w-6 flex-none place-items-center rounded-md text-[11px] font-bold ${method === "wechat" ? "bg-green-soft text-[#3e8b57]" : "bg-sky-50 text-[#3976b7]"}`}
      >
        {method === "wechat" ? "微" : "支"}
      </span>
      <span>
        {label}
        <span className="ml-1.5 text-[9px] text-gray-400">模拟</span>
      </span>
      <span
        className={`ml-auto h-3.5 w-3.5 rounded-full ${selected ? "border-4 border-sage" : "border border-[#d4d7ce]"}`}
      />
    </Button>
  );
}

function PurchaseSuccess({
  state,
  onBack,
}: {
  state: SubscriptionState;
  onBack: () => void;
}) {
  const purchasedPlan =
    plans.find((plan) => plan.id === state.subscription.planId) ?? plans[0];

  return (
    <section className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center px-4 py-7 text-center">
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-green-soft text-green">
        <Check size={28} />
      </div>
      <span className="text-[10px] font-bold text-gray-400">
        SUBSCRIPTION ACTIVE
      </span>
      <h1 className="mt-3 text-2xl font-semibold">
        欢迎加入{" "}
        {purchasedPlan.name}
      </h1>
      <p className="mt-2 text-xs text-gray-400">
        你的套餐已经生效，接下来一个月，尽情探索新的想法。
      </p>
      <div className="mt-6 grid w-full grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#e7e8e1] bg-[#e7e8e1] text-left sm:grid-cols-1">
        <Detail label="当前套餐">
          {purchasedPlan.name}
        </Detail>
        <Detail label="到期日期">
          {state.subscription.renewsAt
            ? formatDate(state.subscription.renewsAt)
            : "—"}
        </Detail>
        <Detail label="到期后">
          <span className="inline-flex items-center gap-1 text-green">
            <CheckCircle size={14} /> 自动转为 Free
          </span>
        </Detail>
        <Detail label="订单编号">
          {state.orders[0]?.id.slice(-12).toUpperCase()}
        </Detail>
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-gray-400">
        <ShieldCheck size={14} /> 模拟订阅 · 不会产生真实扣款
      </div>
      <Button
        className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-green px-4 text-xs font-semibold text-white hover:bg-green-dark"
        onClick={onBack}
      >
        返回聊天 <ArrowRight size={16} />
      </Button>
    </section>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 bg-white p-3">
      <span className="text-[10px] text-gray-400">{label}</span>
      <strong className="break-words text-[11px]">{children}</strong>
    </div>
  );
}

function ProcessingOverlay({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex flex-col items-center p-5 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-green-soft text-green motion-safe:animate-pulse">
        <ShieldCheck size={24} />
      </div>
      <strong className="text-base">正在确认订阅</strong>
      <span className="mt-1 text-[11px] text-gray-400">请稍候，马上就好</span>
      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-[#edf0e9]">
        <i className="block h-full w-2/5 animate-progress rounded-full bg-sage" />
      </div>
      <small className="mt-2 text-[11px] text-gray-400">
        正在安全处理付款
      </small>
      <Button
        className="mt-4 border-0 bg-transparent text-[11px] text-gray-400"
        onClick={onCancel}
      >
        取消
      </Button>
    </div>
  );
}
