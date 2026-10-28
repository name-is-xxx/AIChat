import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import TitleHeader from "./components/hearder";
import { ChatDataProvider } from "./features/chat/ChatDataProvider";
import { syncExpiredSubscription } from "./utils/subscriptionExpiry";

export default function App() {
  const [, refreshAccount] = useState(0);

  useEffect(() => {
    const checkExpiry = () => {
      if (syncExpiredSubscription()) refreshAccount((current) => current + 1);
    };
    checkExpiry();
    const timer = window.setInterval(checkExpiry, 60_000);
    window.addEventListener("focus", checkExpiry);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", checkExpiry);
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <TitleHeader />
      <ChatDataProvider>
        <Outlet />
      </ChatDataProvider>
    </div>
  );
}
