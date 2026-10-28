import { green } from "@/theme/colors";
import { Button } from "@mantine/core";
import {
  Archive,
  ArrowLeftIcon,
  IdentificationCard,
  List,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const sections = [
  { to: "/settings/profile", label: "个人资料", icon: IdentificationCard },
  { to: "/settings/archive", label: "归档列表", icon: Archive },
  { to: "/settings/security", label: "账号安全", icon: ShieldCheck },
];

export default function SettingsLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-full min-h-0 min-w-0 flex flex-row">
      <nav
        aria-label="设置"
        className={`fixed inset-y-0 left-0 z-20 flex flex-col min-h-0 min-w-64 gap-3 overflow-hidden border-r border-light bg-white p-5 transition-transform sm:static sm:z-auto sm:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Button
          variant="subtle"
          color={green.middleLight}
          leftSection={<ArrowLeftIcon size={16} />}
          classNames={{
            inner: "w-full justify-start",
          }}
          onClick={() => navigate("/")}
        >
          返回对话页
        </Button>
        <div className="p-3 text-base font-bold">SETTINGS</div>
        {sections.map(({ to, label, icon: Icon }) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md p-3 text-xs ${isActive ? "bg-light text-middleLight" : "hover:bg-middleLight"}`
            }
            key={to}
            to={to}
            onClick={() => setMenuOpen(false)}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-10 bg-black/30 sm:hidden"
          aria-label="关闭设置导航"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-9">
        <div className="mx-auto w-full">
          <Button
            variant="subtle"
            color={green.middleLight}
            leftSection={<List size={16} />}
            className="mb-4 sm:hidden"
            onClick={() => setMenuOpen(true)}
          >
            设置菜单
          </Button>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
