import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App.tsx";
import ChatIndex from "@/features/chat/index.tsx";
import PlansPage from "./features/subscription/PlansPage.tsx";
import SettingsLayout from "./features/SettingsLayout.tsx";
import ProfilePage from "./features/ProfilePage.tsx";
import ArchivePage from "./features/ArchivePage.tsx";
import SecurityPage from "./features/SecurityPage.tsx";
import LoginPage from "./features/LoginPage.tsx";
import { readAccountSession } from "./utils/accountSession";
import { syncExpiredSubscription } from "./utils/subscriptionExpiry";

function requireAccountSessionLoader() {
  syncExpiredSubscription();
  if (!readAccountSession()) throw redirect("/login");
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: requireAccountSessionLoader,
    children: [
      { index: true, element: <ChatIndex /> },
      { path: ":id", element: <ChatIndex /> },
      { path: "plans", element: <PlansPage /> },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          { index: true, path: "profile", element: <ProfilePage /> },
          { path: "archive", element: <ArchivePage /> },
          { path: "security", element: <SecurityPage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);

export default router;
